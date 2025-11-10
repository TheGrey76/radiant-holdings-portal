import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CampaignRequest {
  campaignId: string;
  subject: string;
  content: string;
  regionFilter?: string;
  intermediaryFilter?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verify admin user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const { campaignId, subject, content, regionFilter, intermediaryFilter }: CampaignRequest = await req.json();

    console.log("Processing campaign:", campaignId);

    // Update campaign status to sending
    await supabaseClient
      .from("email_campaigns")
      .update({ status: "sending" })
      .eq("id", campaignId);

    // Fetch advisers based on filters
    let query = supabaseClient
      .from("financial_advisers")
      .select("email, full_name")
      .not("email", "is", null);

    if (regionFilter && regionFilter !== "all") {
      query = query.eq("region", regionFilter);
    }

    if (intermediaryFilter && intermediaryFilter !== "all") {
      query = query.eq("intermediary", intermediaryFilter);
    }

    const { data: advisers, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (!advisers || advisers.length === 0) {
      throw new Error("No advisers found matching the filters");
    }

    console.log(`Sending to ${advisers.length} advisers`);

    let successCount = 0;
    let failCount = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < advisers.length; i += batchSize) {
      const batch = advisers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (adviser) => {
        try {
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="it">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6; 
                    color: #1a1a1a;
                    background-color: #f4f5f7;
                  }
                  .email-wrapper { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: #ffffff;
                  }
                  .header { 
                    background: linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #2d3f5f 100%);
                    padding: 40px 30px;
                    text-align: center;
                  }
                  .logo { 
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    margin-bottom: 10px;
                  }
                  .tagline {
                    color: #94a3b8;
                    font-size: 14px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                  }
                  .content { 
                    padding: 40px 30px;
                    background: #ffffff;
                  }
                  .greeting {
                    font-size: 18px;
                    color: #0f1729;
                    margin-bottom: 20px;
                    font-weight: 500;
                  }
                  .main-content {
                    color: #4a5568;
                    font-size: 15px;
                    line-height: 1.8;
                  }
                  .main-content p {
                    margin-bottom: 16px;
                  }
                  .main-content ul {
                    margin: 20px 0;
                    padding-left: 20px;
                  }
                  .main-content li {
                    margin-bottom: 12px;
                    color: #4a5568;
                  }
                  .main-content strong {
                    color: #1a1a1a;
                    font-weight: 600;
                  }
                  .highlight-box {
                    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                    border-left: 4px solid #3b82f6;
                    padding: 20px;
                    margin: 30px 0;
                    border-radius: 4px;
                  }
                  .cta-container {
                    text-align: center;
                    margin: 35px 0;
                  }
                  .cta-button { 
                    display: inline-block;
                    padding: 16px 40px;
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s ease;
                  }
                  .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
                  }
                  .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                    margin: 30px 0;
                  }
                  .signature {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #f1f5f9;
                  }
                  .signature-name {
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 4px;
                  }
                  .signature-title {
                    color: #64748b;
                    font-size: 14px;
                  }
                  .footer { 
                    background: #0f1729;
                    padding: 30px;
                    text-align: center;
                  }
                  .footer-content {
                    color: #94a3b8;
                    font-size: 13px;
                    line-height: 1.8;
                  }
                  .footer-links {
                    margin-top: 20px;
                  }
                  .footer-link {
                    color: #60a5fa;
                    text-decoration: none;
                    margin: 0 10px;
                    font-size: 13px;
                  }
                  .footer-link:hover {
                    color: #93c5fd;
                  }
                  .social-links {
                    margin-top: 20px;
                  }
                  .social-link {
                    display: inline-block;
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    margin: 0 6px;
                    line-height: 36px;
                    color: #94a3b8;
                    text-decoration: none;
                  }
                </style>
              </head>
              <body>
                <div class="email-wrapper">
                  <div class="header">
                    <div class="logo">ARIES76</div>
                    <div class="tagline">Capital Advisory</div>
                  </div>
                  
                  <div class="content">
                    <div class="greeting">Gentile ${adviser.full_name},</div>
                    
                    <div class="main-content">
                      ${content}
                    </div>
                    
                    <div class="signature">
                      <div class="signature-name">Il Team ARIES76</div>
                      <div class="signature-title">Capital Advisory</div>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <div class="footer-content">
                      <strong style="color: #ffffff;">ARIES76 Capital Advisory</strong><br>
                      London, United Kingdom<br>
                      <a href="mailto:info@aries76.com" class="footer-link">info@aries76.com</a>
                    </div>
                    
                    <div class="footer-links">
                      <a href="https://aries76.com" class="footer-link">Website</a>
                      <a href="https://aries76.com/structured-products" class="footer-link">Structured Products</a>
                      <a href="https://aries76.com/contact" class="footer-link">Contattaci</a>
                    </div>
                    
                    <div class="divider" style="background: rgba(255, 255, 255, 0.1); margin: 25px 0;"></div>
                    
                    <div class="footer-content" style="font-size: 12px;">
                      &copy; ${new Date().getFullYear()} ARIES76. Tutti i diritti riservati.<br>
                      Questa email è stata inviata a ${adviser.email}
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `;

          await resend.emails.send({
            from: "ARIES76 Capital Advisory <onboarding@resend.dev>",
            to: [adviser.email],
            subject: subject,
            html: htmlContent,
          });

          successCount++;
          console.log(`Email sent to ${adviser.email}`);
        } catch (error) {
          failCount++;
          console.error(`Failed to send to ${adviser.email}:`, error);
        }
      });

      await Promise.all(emailPromises);
      
      // Small delay between batches
      if (i + batchSize < advisers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign with results
    await supabaseClient
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: advisers.length,
        successful_sends: successCount,
        failed_sends: failCount,
      })
      .eq("id", campaignId);

    console.log(`Campaign completed: ${successCount} sent, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: advisers.length,
        successful: successCount,
        failed: failCount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-adviser-campaign:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
