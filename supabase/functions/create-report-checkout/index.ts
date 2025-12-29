import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe not configured");
    }

    const { reportId, reportSlug, userEmail, priceEur, successUrl, cancelUrl } = await req.json();
    
    console.log("Creating checkout for report:", { reportId, reportSlug, userEmail, priceEur });

    if (!reportId || !userEmail || !priceEur || !successUrl || !cancelUrl) {
      throw new Error("Missing required parameters");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch report details
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("id, title, slug, stripe_price_id, price_eur")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      console.error("Report not found:", reportError);
      throw new Error("Report not found");
    }

    console.log("Found report:", report.title);

    // Check if customer already exists
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // Create line item
    let lineItems;
    
    if (report.stripe_price_id) {
      // Use existing Stripe price
      lineItems = [
        {
          price: report.stripe_price_id,
          quantity: 1,
        },
      ];
    } else {
      // Create price data inline
      lineItems = [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: report.title,
              description: `ARIES76 Research Report: ${report.title}`,
            },
            unit_amount: Math.round(priceEur * 100), // Convert to cents
          },
          quantity: 1,
        },
      ];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        report_id: report.id,
        report_slug: report.slug,
        user_email: userEmail,
      },
      payment_intent_data: {
        metadata: {
          report_id: report.id,
          report_slug: report.slug,
          user_email: userEmail,
        },
      },
    });

    console.log("Created checkout session:", session.id);

    // Create pending purchase record
    const { error: purchaseError } = await supabase
      .from("report_purchases")
      .insert({
        report_id: report.id,
        user_email: userEmail,
        stripe_session_id: session.id,
        status: "pending",
        amount_paid: priceEur,
        currency: "EUR",
      });

    if (purchaseError) {
      console.error("Error creating purchase record:", purchaseError);
      // Don't fail - we can still process the payment
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
