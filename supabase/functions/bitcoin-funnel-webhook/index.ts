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
          // Update lead status to 'paid'
          const { data: existingLead, error: findError } = await supabase
            .from("bitcoin_funnel_leads")
            .select("id, status")
            .eq("email", customerEmail.toLowerCase())
            .maybeSingle();

          if (existingLead) {
            // Update existing lead
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
              console.log("Lead updated to paid:", customerEmail);
            }
          } else {
            // Create new lead with paid status (direct purchase without preview)
            const { error: insertError } = await supabase
              .from("bitcoin_funnel_leads")
              .insert({
                email: customerEmail.toLowerCase(),
                status: "paid",
                source: "direct",
                paid_at: new Date().toISOString(),
                stripe_payment_id: paymentIntentId,
              });

            if (insertError) {
              console.error("Error inserting lead:", insertError);
            } else {
              console.log("New paid lead created:", customerEmail);
            }
          }

          // Log automation action
          const { error: logError } = await supabase
            .from("bitcoin_funnel_automation_log")
            .insert({
              lead_id: existingLead?.id || null,
              action: "payment_completed",
              details: {
                email: customerEmail,
                payment_intent: paymentIntentId,
                amount: session.amount_total,
                currency: session.currency,
              },
            });

          if (logError) {
            console.error("Error logging automation:", logError);
          }

          // Also create report purchase record for access control
          const { error: purchaseError } = await supabase
            .from("report_purchases")
            .upsert({
              report_id: "bitcoin-2026", // You may need to get this from reports table
              user_email: customerEmail.toLowerCase(),
              status: "completed",
              amount_paid: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || "EUR",
              stripe_session_id: session.id,
              stripe_payment_intent: paymentIntentId,
              purchased_at: new Date().toISOString(),
            }, {
              onConflict: "user_email,report_id",
            });

          if (purchaseError) {
            console.error("Error creating purchase record:", purchaseError);
          }
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
