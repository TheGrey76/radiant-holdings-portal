import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendLinkRequest {
  page_slug: string;
  document_title: string;
  emails: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { page_slug, document_title, emails }: SendLinkRequest = await req.json();

    if (!page_slug || !emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const documentUrl = `https://www.aries76.com/${page_slug}`;
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const email of emails) {
      try {
        const emailResponse = await resend.emails.send({
          // NOTE: use your verified domain on Resend
          from: "Aries76 Advisory <advisory@aries76.com>",
          to: [email],
          reply_to: "advisory@aries76.com",
          subject: `Documento disponibile: ${document_title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
                          <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">ARIES76</h1>
                          <p style="color: #888; margin: 10px 0 0 0; font-size: 12px; letter-spacing: 1px;">STRATEGIC ADVISORY</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 22px; font-weight: 500;">Documento Disponibile</h2>
                          <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Gentile Cliente,</p>
                          <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Un nuovo documento è stato preparato per Lei:</p>
                          <div style="background-color: #f8f8f8; border-left: 4px solid #d4af37; padding: 20px; margin: 0 0 30px 0;">
                            <p style="color: #1a1a2e; font-size: 18px; font-weight: 500; margin: 0;">${document_title}</p>
                          </div>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="padding: 20px 0;">
                                <a href="${documentUrl}" style="display: inline-block; background-color: #d4af37; color: #1a1a2e; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 4px; letter-spacing: 1px;">VISUALIZZA DOCUMENTO</a>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">Per accedere al documento, utilizzi l'indirizzo email a cui è stata inviata questa comunicazione.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #1a1a2e; padding: 25px 30px; text-align: center;">
                          <p style="color: #888; font-size: 12px; margin: 0; line-height: 1.6;">© ${new Date().getFullYear()} Aries76 Capital Advisors Ltd.<br>London | Milan</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });

        console.log("Resend response:", { to: email, emailResponse });
        results.successful++;
      } catch (emailError: any) {
        console.error("Resend error:", { to: email, message: emailError?.message, emailError });
        results.failed++;
        results.errors.push(`${email}: ${emailError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-advisory-link:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
