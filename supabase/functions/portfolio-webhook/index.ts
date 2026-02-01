import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { Resend } from "npm:resend@2.0.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret');
    return new Response('Missing signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processing Stripe event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const email = session.metadata?.email || session.customer_email;
      const tier = session.metadata?.tier || 'professional';
      const scanId = session.metadata?.scanId;

      if (!email) {
        throw new Error('No email in session metadata');
      }

      // Update purchase record
      const { error: updateError } = await supabase
        .from('portfolio_purchases')
        .update({
          status: 'completed',
          stripe_payment_intent: session.payment_intent as string,
          paid_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year access
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating purchase:', updateError);
      }

      // Send confirmation email
      try {
        await resend.emails.send({
          from: 'Aries76 <research@aries76.com>',
          to: [email],
          subject: `Your ${tier.charAt(0).toUpperCase() + tier.slice(1)} Portfolio Report is Ready`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #f97316; }
                .content { background: #f8fafc; padding: 30px; border-radius: 12px; }
                .success { background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
                .cta { display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">ARIES76</div>
                  <p>Capital Intelligence</p>
                </div>
                
                <div class="content">
                  <div class="success">✓ Payment Confirmed</div>
                  
                  <h2>Thank You for Your Purchase!</h2>
                  <p>Your <strong>${tier.charAt(0).toUpperCase() + tier.slice(1)} Portfolio Report</strong> access is now active.</p>
                  
                  <p>You now have access to:</p>
                  <ul>
                    <li>Complete risk analysis dashboard</li>
                    <li>Monte Carlo simulations</li>
                    <li>AI-powered optimization recommendations</li>
                    <li>Downloadable PDF report</li>
                  </ul>
                  
                  <a href="https://aries76.com/bitcoin-research" class="cta">Access Your Report →</a>
                  
                  <p style="font-size: 14px; color: #64748b;">
                    Your access is valid for 12 months from today.
                  </p>
                </div>
                
                <div class="footer">
                  <p>Questions? Reply to this email.</p>
                  <p>© ${new Date().getFullYear()} Aries76 Capital Intelligence</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      console.log(`Payment completed for ${email}: ${tier} tier`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
