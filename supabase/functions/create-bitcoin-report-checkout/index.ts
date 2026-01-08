import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe configuration error");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { email, successUrl, cancelUrl, source = "direct" } = await req.json();
    
    console.log("Request data:", { email, successUrl, cancelUrl, source });

    // Save lead to bitcoin_funnel_leads with status 'requested'
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Check if lead already exists
      const { data: existingLead } = await supabase
        .from("bitcoin_funnel_leads")
        .select("id, status")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      let leadId: string | null = null;

      if (existingLead) {
        // Update existing lead if not already paid
        if (existingLead.status !== "paid") {
          await supabase
            .from("bitcoin_funnel_leads")
            .update({ 
              status: "requested",
              updated_at: new Date().toISOString()
            })
            .eq("id", existingLead.id);
        }
        leadId = existingLead.id;
        console.log("Updated existing lead:", email);
      } else {
        // Insert new lead
        const { data: newLead, error: insertError } = await supabase
          .from("bitcoin_funnel_leads")
          .insert({
            email: email.toLowerCase(),
            status: "requested",
            source: source,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Error inserting lead:", insertError);
        } else {
          leadId = newLead?.id;
          console.log("New lead created:", email);
        }
      }

      // Log automation action
      await supabase.from("bitcoin_funnel_automation_log").insert({
        lead_id: leadId,
        action: "access_requested",
        details: { email, source },
      });

      // Send Email 1: Access confirmation
      if (resendKey && (!existingLead || existingLead.status === "preview")) {
        try {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "ARIES76 Research <research@aries76.com>",
            to: [email],
            subject: "Your Bitcoin 2026 Access Request — Confirmed",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 32px; font-weight: 800; color: #f97316;">₿</span>
                  <span style="font-size: 24px; font-weight: 700; color: white; margin-left: 8px;">ARIES76</span>
                </div>
                
                <h1 style="color: white; font-size: 24px; margin-bottom: 20px;">Access Request Received</h1>
                
                <p style="line-height: 1.7; color: #a1a1aa;">
                  We've received your request for the <strong style="color: white;">Bitcoin 2026 Research Page</strong>.
                </p>
                
                <p style="line-height: 1.7; color: #a1a1aa;">
                  This is a continuously updated intelligence resource — not a static PDF. It includes real-time data, 
                  macro-liquidity analysis, and institutional positioning frameworks updated throughout 2026.
                </p>
                
                <div style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); border: 1px solid #3f3f46; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                  <p style="color: #f97316; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">One-time access</p>
                  <p style="color: white; font-size: 36px; font-weight: 700; margin: 0;">€99</p>
                  <p style="color: #71717a; font-size: 14px; margin-top: 8px;">Ongoing updates included</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://aries76.com/bitcoin-2026-report-preview" 
                     style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Complete Your Access →
                  </a>
                </div>
                
                <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 40px;">
                  ARIES76 Research · Institutional-Grade Analysis<br/>
                  <a href="https://aries76.com" style="color: #71717a;">aries76.com</a>
                </p>
              </div>
            `,
          });
          
          console.log("Confirmation email sent to:", email);
          
          // Log email sent
          await supabase.from("bitcoin_funnel_automation_log").insert({
            lead_id: leadId,
            action: "email_1_sent",
            details: { email, subject: "Your Bitcoin 2026 Access Request — Confirmed" },
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
      }
    }

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
            unit_amount: 9900, // €99.00 in cents
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
        source: source,
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
