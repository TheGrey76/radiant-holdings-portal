import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If webhook secret is configured, verify signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body);
    }

    console.log("Received Stripe event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a Bitcoin report purchase
      if (session.metadata?.product_type === "bitcoin_2026_report") {
        const customerEmail = session.customer_email;
        const paymentIntentId = session.payment_intent as string;

        console.log("Processing Bitcoin 2026 Report purchase for:", customerEmail);

        if (customerEmail) {
          const normalizedEmail = customerEmail.toLowerCase().trim();
          
          // 1. Update lead status to 'paid' in bitcoin_funnel_leads
          const { data: existingLead, error: findError } = await supabase
            .from("bitcoin_funnel_leads")
            .select("id, status")
            .eq("email", normalizedEmail)
            .maybeSingle();

          if (existingLead) {
            const { error: updateError } = await supabase
              .from("bitcoin_funnel_leads")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                stripe_payment_id: paymentIntentId,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingLead.id);

            if (updateError) {
              console.error("Error updating lead:", updateError);
            } else {
              console.log("Lead updated to paid:", normalizedEmail);
            }
          } else {
            const { error: insertError } = await supabase
              .from("bitcoin_funnel_leads")
              .insert({
                email: normalizedEmail,
                status: "paid",
                source: session.metadata?.source || "direct",
                paid_at: new Date().toISOString(),
                stripe_payment_id: paymentIntentId,
              });

            if (insertError) {
              console.error("Error inserting lead:", insertError);
            } else {
              console.log("New paid lead created:", normalizedEmail);
            }
          }

          // 2. CRITICAL: Add to page_access table for access control
          const { error: accessError } = await supabase
            .from("page_access")
            .upsert({
              email: normalizedEmail,
              page_slug: "bitcoin-2026-report",
              access_type: "paid",
              stripe_payment_id: paymentIntentId,
              granted_at: new Date().toISOString(),
            }, {
              onConflict: "email,page_slug",
            });

          if (accessError) {
            console.error("Error adding page_access:", accessError);
          } else {
            console.log("Page access granted for:", normalizedEmail);
          }

          // 3. Log automation action
          await supabase
            .from("bitcoin_funnel_automation_log")
            .insert({
              lead_id: existingLead?.id || null,
              action: "payment_completed",
              details: {
                email: normalizedEmail,
                payment_intent: paymentIntentId,
                amount: session.amount_total,
                currency: session.currency,
              },
            });

          // 4. Also create report purchase record (for legacy/analytics)
          await supabase
            .from("report_purchases")
            .upsert({
              report_id: "bitcoin-2026",
              user_email: normalizedEmail,
              status: "completed",
              amount_paid: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || "EUR",
              stripe_session_id: session.id,
              stripe_payment_intent: paymentIntentId,
              purchased_at: new Date().toISOString(),
            }, {
              onConflict: "user_email,report_id",
            });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
