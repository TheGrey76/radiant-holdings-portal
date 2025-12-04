import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    console.log("Creating Stripe checkout session for Bitcoin 2026 Report");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe configuration error");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { email, successUrl, cancelUrl } = await req.json();
    
    console.log("Request data:", { email, successUrl, cancelUrl });

    // Create Stripe checkout session with inline product/price data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Bitcoin 2026 Report",
              description: "Institutional Research Report: A Macro-Liquidity Framework for Institutional Positioning",
              images: ["https://dvwmyljnssspwfpwocof.supabase.co/storage/v1/object/public/reports/bitcoin-2026-cover.png"],
            },
            unit_amount: 100, // €1.00 for testing (change back to 9900 for €99.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/bitcoin-2026-report?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/bitcoin-2026-report-preview?canceled=true`,
      customer_email: email,
      metadata: {
        product_type: "bitcoin_2026_report",
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
