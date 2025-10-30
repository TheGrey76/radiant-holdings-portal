import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  preheader?: string;
  heading: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      throw new Error("Unauthorized");
    }

    console.log("User authenticated:", user.email);

    // Check if user is admin using service role (bypasses RLS)
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    console.log("Role check result:", { roleData, roleError, userId: user.id });
    
    if (roleError) {
      console.error("Role query error:", roleError);
      throw new Error("Error checking user role");
    }

    if (!roleData || roleData.role !== 'admin') {
      console.error("User is not admin:", { email: user.email, role: roleData?.role });
      throw new Error("Forbidden: Admin access required");
    }

    console.log("Admin verified, proceeding with newsletter send");

    const { subject, preheader, heading, content, ctaText, ctaLink }: NewsletterRequest = await req.json();

    console.log("Newsletter send request:", { subject, heading });

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('subscribed', true);

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No active subscribers to send to",
          sent: 0 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Create HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
                  <!-- Header -->
                  <tr>
                    <td style="text-align: center; padding: 40px 20px 30px; border-bottom: 1px solid #e5e5e5;">
                      <div style="font-size: 32px; font-weight: 300; letter-spacing: 2px; margin-bottom: 8px;">
                        ARIES<span style="color: #D97706;">76</span>
                      </div>
                      <p style="margin: 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px;">
                        Building Bridges Between Capital and Opportunity
                      </p>
                    </td>
                  </tr>

                  ${preheader ? `
                  <tr>
                    <td style="padding: 20px; font-size: 12px; color: #999;">
                      ${preheader}
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 40px 20px;">
                      <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 300; color: #1a1a1a; line-height: 1.3;">
                        ${heading}
                      </h1>
                      
                      <div style="color: #333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                        ${content}
                      </div>

                      ${ctaText && ctaLink ? `
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${ctaLink}" style="display: inline-block; background-color: #D97706; color: #ffffff; padding: 14px 36px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;">
                          ${ctaText}
                        </a>
                      </div>
                      ` : ''}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 12px; color: #666;">
                      <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Aries76 Ltd — All rights reserved.</p>
                      <p style="margin: 0 0 16px;">
                        27 Old Gloucester Street, London, United Kingdom, WC1N 3AX
                      </p>
                      <p style="margin: 0;">
                        <a href="{{unsubscribe_url}}" style="color: #999; text-decoration: underline;">
                          Unsubscribe
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Aries76 <onboarding@resend.dev>',
          to: [subscriber.email],
          subject: subject,
          html: htmlTemplate,
        });

        if (error) {
          console.error(`Failed to send to ${subscriber.email}:`, JSON.stringify(error));
          return { email: subscriber.email, success: false, error };
        }

        console.log(`Sent to ${subscriber.email}, message ID:`, data?.id);
        return { email: subscriber.email, success: true };
      } catch (err) {
        console.error(`Error sending to ${subscriber.email}:`, err);
        return { email: subscriber.email, success: false, error: err };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Newsletter sent: ${successful} successful, ${failed} failed`);

    // Save newsletter to database
    const { error: saveError } = await supabase
      .from('sent_newsletters')
      .insert({
        subject,
        preheader,
        heading,
        content,
        cta_text: ctaText,
        cta_link: ctaLink,
        sent_by: user.id,
        recipients_count: subscribers.length,
        successful_sends: successful,
        failed_sends: failed,
      });

    if (saveError) {
      console.error("Error saving newsletter record:", saveError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent to ${successful} subscribers`,
        sent: successful,
        failed: failed,
        total: subscribers.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred",
        success: false 
      }),
      {
        status: error.message === "Unauthorized" ? 401 : 
                error.message === "Forbidden: Admin access required" ? 403 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
