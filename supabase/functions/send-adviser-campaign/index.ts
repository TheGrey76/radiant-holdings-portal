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
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { 
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.7; 
                    color: #1e293b;
                    background: #f8fafc;
                    padding: 40px 20px;
                  }
                  .email-wrapper { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #ffffff;
                    border-radius: 4px;
                    overflow: hidden;
                  }
                  .header { 
                    background: #0f172a;
                    padding: 40px 40px 32px;
                    text-align: center;
                  }
                  .logo { 
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 500;
                    letter-spacing: 6px;
                    margin-bottom: 8px;
                  }
                  .tagline {
                    color: #94a3b8;
                    font-size: 12px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    font-weight: 400;
                  }
                  .content { 
                    padding: 48px 40px;
                    background: #ffffff;
                  }
                  .greeting {
                    font-size: 16px;
                    color: #0f172a;
                    margin-bottom: 32px;
                    font-weight: 400;
                  }
                  .main-content {
                    color: #475569;
                    font-size: 15px;
                    line-height: 1.7;
                  }
                  .main-content p {
                    margin-bottom: 20px;
                  }
                  .main-content ul {
                    margin: 24px 0;
                    padding-left: 0;
                    list-style: none;
                  }
                  .main-content li {
                    margin-bottom: 12px;
                    color: #475569;
                    padding-left: 24px;
                    position: relative;
                  }
                  .main-content li:before {
                    content: "•";
                    position: absolute;
                    left: 8px;
                    color: #3b82f6;
                    font-size: 14px;
                  }
                  .main-content strong {
                    color: #0f172a;
                    font-weight: 600;
                  }
                  .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin: 32px 0;
                  }
                  .feature-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 24px 20px;
                    text-align: center;
                  }
                  .feature-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                    color: #3b82f6;
                    font-weight: 400;
                  }
                  .feature-title {
                    color: #0f172a;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 6px;
                  }
                  .feature-desc {
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.6;
                  }
                  .highlight-box {
                    background: #f0f9ff;
                    border-left: 3px solid #3b82f6;
                    padding: 24px;
                    margin: 28px 0;
                    border-radius: 4px;
                  }
                  .stats-container {
                    display: flex;
                    justify-content: space-around;
                    margin: 32px 0;
                    padding: 32px 24px;
                    background: #f8fafc;
                    border-radius: 4px;
                  }
                  .stat-item {
                    text-align: center;
                  }
                  .stat-number {
                    font-size: 32px;
                    font-weight: 600;
                    color: #0f172a;
                    margin-bottom: 4px;
                  }
                  .stat-label {
                    font-size: 12px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  }
                  .cta-container {
                    text-align: center;
                    margin: 40px 0 24px;
                  }
                  .cta-primary { 
                    display: inline-block;
                    padding: 14px 32px;
                    background: #3b82f6;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 15px;
                    margin: 0 6px 12px;
                    transition: background 0.2s;
                  }
                  .cta-secondary {
                    display: inline-block;
                    padding: 14px 32px;
                    background: #ffffff;
                    color: #3b82f6 !important;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 15px;
                    border: 1px solid #e2e8f0;
                    margin: 0 6px 12px;
                    transition: background 0.2s;
                  }
                  .divider {
                    height: 1px;
                    background: #e2e8f0;
                    margin: 32px 0;
                  }
                  .signature {
                    margin-top: 40px;
                    padding-top: 24px;
                    border-top: 1px solid #e2e8f0;
                  }
                  .signature-name {
                    font-weight: 500;
                    color: #0f172a;
                    margin-bottom: 4px;
                    font-size: 15px;
                  }
                  .signature-title {
                    color: #64748b;
                    font-size: 14px;
                  }
                  .footer { 
                    background: #f8fafc;
                    padding: 32px 40px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                  }
                  .footer-content {
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.8;
                  }
                  .footer-links {
                    margin-top: 16px;
                  }
                  .footer-link {
                    color: #3b82f6;
                    text-decoration: none;
                    margin: 0 10px;
                    font-size: 13px;
                    font-weight: 500;
                  }
                  .contact-info {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                  }
                  @media only screen and (max-width: 600px) {
                    .email-wrapper { border-radius: 0; }
                    .header { padding: 32px 24px 24px; }
                    .content { padding: 32px 24px; }
                    .footer { padding: 24px 24px; }
                    .feature-grid { grid-template-columns: 1fr; }
                    .stats-container { flex-direction: column; gap: 20px; }
                    .cta-primary, .cta-secondary { display: block; margin: 8px 0; }
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
                      <strong style="color: #0f172a; font-size: 14px;">ARIES76 Capital Advisory</strong><br>
                      London, United Kingdom
                    </div>
                    
                    <div class="footer-links">
                      <a href="https://aries76.com" class="footer-link">Website</a>
                      <span style="color: #cbd5e1;">•</span>
                      <a href="https://aries76.com/structured-products" class="footer-link">Structured Products</a>
                      <span style="color: #cbd5e1;">•</span>
                      <a href="https://aries76.com/contact" class="footer-link">Contattaci</a>
                    </div>
                    
                    <div class="contact-info">
                      <div class="footer-content" style="font-size: 12px;">
                        <a href="mailto:info@aries76.com" style="color: #3b82f6; text-decoration: none;">info@aries76.com</a><br>
                        &copy; ${new Date().getFullYear()} ARIES76. Tutti i diritti riservati.
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `;

          await resend.emails.send({
            from: "ARIES76 Capital Advisory <info@aries76.com>",
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
