import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface EmailRequest {
  email: string;
  sequenceNumber: number;
  leadId?: string;
}

// Email templates for the funnel
const emailTemplates = {
  1: {
    subject: "Your Bitcoin 2026 Access Request — Confirmed",
    html: (email: string) => `
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
  },
  2: {
    subject: "Why this isn't a report — and why that matters",
    html: (email: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: 800; color: #f97316;">₿</span>
          <span style="font-size: 24px; font-weight: 700; color: white; margin-left: 8px;">ARIES76</span>
        </div>
        
        <h1 style="color: white; font-size: 24px; margin-bottom: 20px;">This isn't a PDF. It's a decision tool.</h1>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          Most Bitcoin "research" is outdated the moment you download it. Markets move faster than static documents.
        </p>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          The Bitcoin 2026 page is different:
        </p>
        
        <ul style="color: #a1a1aa; line-height: 2;">
          <li><strong style="color: white;">Live price data</strong> — updated in real-time</li>
          <li><strong style="color: white;">Macro regime tracking</strong> — M2, real rates, liquidity conditions</li>
          <li><strong style="color: white;">Institutional positioning</strong> — ETF flows, corporate treasuries</li>
          <li><strong style="color: white;">Risk frameworks</strong> — scenario analysis and exit strategies</li>
        </ul>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          One access. Continuous updates. No expiration.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://aries76.com/bitcoin-2026-report-preview" 
             style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            See What's Inside →
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 40px;">
          ARIES76 Research<br/>
          <a href="https://aries76.com" style="color: #71717a;">aries76.com</a>
        </p>
      </div>
    `,
  },
  3: {
    subject: "The risk of not having a framework",
    html: (email: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: 800; color: #f97316;">₿</span>
          <span style="font-size: 24px; font-weight: 700; color: white; margin-left: 8px;">ARIES76</span>
        </div>
        
        <h1 style="color: white; font-size: 24px; margin-bottom: 20px;">Bitcoin isn't risky. Guessing is.</h1>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          Most investors lose money in Bitcoin not because of volatility — but because they have no framework for when to enter, when to add, and when to exit.
        </p>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          The Bitcoin 2026 page includes:
        </p>
        
        <ul style="color: #a1a1aa; line-height: 2;">
          <li>Quantitative regime models to identify market phases</li>
          <li>Risk management frameworks with defined thresholds</li>
          <li>Exit strategy playbooks based on historical cycles</li>
          <li>Macro calendar with key dates and catalysts</li>
        </ul>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          This is the difference between speculation and positioning.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://aries76.com/bitcoin-2026-report-preview" 
             style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Access the Framework →
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 40px;">
          ARIES76 Research<br/>
          <a href="https://aries76.com" style="color: #71717a;">aries76.com</a>
        </p>
      </div>
    `,
  },
  4: {
    subject: "Final reminder: Your access is waiting",
    html: (email: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: 800; color: #f97316;">₿</span>
          <span style="font-size: 24px; font-weight: 700; color: white; margin-left: 8px;">ARIES76</span>
        </div>
        
        <h1 style="color: white; font-size: 24px; margin-bottom: 20px;">Your Bitcoin 2026 access is ready</h1>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          You requested access to the Bitcoin 2026 research page. The data is live. The frameworks are ready.
        </p>
        
        <p style="line-height: 1.7; color: #a1a1aa;">
          This is the last email you'll receive about this. If you'd like to proceed, the page is waiting.
        </p>
        
        <div style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); border: 1px solid #3f3f46; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
          <p style="color: #f97316; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">One-time access</p>
          <p style="color: white; font-size: 36px; font-weight: 700; margin: 0;">€99</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://aries76.com/bitcoin-2026-report-preview" 
             style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Complete Access Now →
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 40px;">
          No further emails will be sent.<br/>
          <a href="https://aries76.com" style="color: #71717a;">aries76.com</a>
        </p>
      </div>
    `,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sequenceNumber, leadId }: EmailRequest = await req.json();

    console.log(`Sending email ${sequenceNumber} to ${email}`);

    const template = emailTemplates[sequenceNumber as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Invalid sequence number: ${sequenceNumber}`);
    }

    const emailResponse = await resend.emails.send({
      from: "ARIES76 Research <research@aries76.com>",
      to: [email],
      subject: template.subject,
      html: template.html(email),
    });

    console.log("Email sent successfully:", emailResponse);

    // Log automation action if Supabase is configured
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from("bitcoin_funnel_automation_log").insert({
        lead_id: leadId || null,
        action: `email_${sequenceNumber}_sent`,
        details: {
          email,
          subject: template.subject,
          resend_id: emailResponse.data?.id,
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
