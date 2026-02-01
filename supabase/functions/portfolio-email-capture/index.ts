import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailCaptureRequest {
  email: string;
  source: 'unlock_gate' | 'dca_strategy' | 'mini_scan_cta' | 'sticky_banner' | 'pricing_page';
  sendWelcome?: boolean;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, source, sendWelcome = true }: EmailCaptureRequest = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already exists
    const { data: existing } = await supabase
      .from('portfolio_leads')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1);

    // Save to portfolio_leads
    const { error: insertError } = await supabase.from('portfolio_leads').insert({
      email: normalizedEmail,
      source,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip'),
      user_agent: req.headers.get('user-agent'),
    });

    if (insertError && !insertError.message.includes('duplicate')) {
      console.error('Error saving lead:', insertError);
    }

    // Send welcome email if requested and not already in system
    if (sendWelcome && (!existing || existing.length === 0)) {
      try {
        await resend.emails.send({
          from: 'Aries76 <research@aries76.com>',
          to: [normalizedEmail],
          subject: 'Your Portfolio Analysis Access',
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
                .cta { display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
                .features { margin: 20px 0; }
                .feature { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
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
                  <h2>Welcome to Portfolio Intelligence</h2>
                  <p>Thank you for your interest in institutional-grade portfolio analysis.</p>
                  
                  <div class="features">
                    <div class="feature">✓ Risk Analysis & Scoring</div>
                    <div class="feature">✓ Monte Carlo Simulations</div>
                    <div class="feature">✓ AI-Powered Recommendations</div>
                    <div class="feature">✓ Tax-Optimized Rebalancing</div>
                  </div>
                  
                  <p>Ready to analyze your complete portfolio?</p>
                  
                  <a href="https://aries76.com/bitcoin-research" class="cta">Get Your Full Report →</a>
                  
                  <p style="font-size: 14px; color: #64748b;">
                    Reports start from £149 for institutional-quality analysis.
                  </p>
                </div>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Aries76 Capital Intelligence</p>
                  <p><a href="https://aries76.com">aries76.com</a></p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log(`Welcome email sent to ${normalizedEmail}`);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log(`Lead captured: ${normalizedEmail} from ${source}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email captured successfully',
        isNew: !existing || existing.length === 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in portfolio-email-capture:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
