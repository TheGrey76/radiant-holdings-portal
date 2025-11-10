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
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #0f1729 0%, #1a2744 100%); color: white; padding: 30px; text-align: center; }
                  .content { padding: 30px; background: #f9f9f9; }
                  .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                  .cta-button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>ARIES76 Structured Products</h1>
                  </div>
                  <div class="content">
                    <p>Gentile ${adviser.full_name},</p>
                    ${content}
                  </div>
                  <div class="footer">
                    <p>ARIES76 Capital Advisory<br>
                    London, United Kingdom<br>
                    <a href="https://aries76.com">www.aries76.com</a></p>
                  </div>
                </div>
              </body>
            </html>
          `;

          await resend.emails.send({
            from: "ARIES76 <onboarding@resend.dev>",
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
