import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pricing tiers
const PRICING = {
  essentials: {
    price: 14900, // £149 in pence
    name: 'Essentials Report',
    features: ['Risk Analysis', 'Allocation Analysis', 'Basic Recommendations'],
  },
  professional: {
    price: 34900, // £349 in pence
    name: 'Professional Report',
    features: ['All Essentials features', 'Monte Carlo Simulations', 'Tax Optimization', 'Scenario Analysis'],
  },
  enterprise: {
    price: 74900, // £749 in pence
    name: 'Enterprise Report',
    features: ['All Professional features', 'AI Recommendations', 'Custom Constraints', 'Priority Support'],
  },
};

interface CheckoutRequest {
  email: string;
  tier: 'essentials' | 'professional' | 'enterprise';
  scanId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      email, 
      tier = 'professional', 
      scanId,
      successUrl = 'https://aries76.com/bitcoin-research?purchase=success',
      cancelUrl = 'https://aries76.com/bitcoin-research?purchase=cancelled',
    }: CheckoutRequest = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    const pricingTier = PRICING[tier];
    if (!pricingTier) {
      throw new Error('Invalid pricing tier');
    }

    // Check for existing customer
    const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: email.toLowerCase(),
        metadata: { source: 'portfolio_report' },
      });
      customerId = newCustomer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: pricingTier.name,
              description: `Portfolio Optimization Report - ${pricingTier.features.join(', ')}`,
              images: ['https://aries76.com/aries76-og-logo.png'],
            },
            unit_amount: pricingTier.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tier,
        scanId: scanId || '',
        email: email.toLowerCase(),
      },
    });

    // Create pending purchase record
    const { error: insertError } = await supabase.from('portfolio_purchases').insert({
      email: email.toLowerCase(),
      scan_id: scanId || null,
      stripe_session_id: session.id,
      amount_paid: pricingTier.price / 100,
      currency: 'GBP',
      tier,
      status: 'pending',
    });

    if (insertError) {
      console.error('Error creating purchase record:', insertError);
    }

    console.log(`Checkout session created for ${email}: ${tier} tier`);

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in portfolio-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
