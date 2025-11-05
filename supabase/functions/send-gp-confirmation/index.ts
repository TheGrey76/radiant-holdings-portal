import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GPConfirmationRequest {
  firstName: string;
  lastName: string;
  email: string;
  firmName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, firmName }: GPConfirmationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Aries76 <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Aries76 GP Capital Advisory",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Aries76</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f1729;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1729;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a2744 0%, #0d1424 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 2px;">
                          ARIES<span style="color: #9b87f5;">76</span>
                        </h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.6); font-size: 14px; letter-spacing: 1px;">
                          GP CAPITAL ADVISORY
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">
                          Welcome to GP Capital Advisory
                        </h2>
                        
                        <p style="margin: 0 0 20px; color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6;">
                          Dear ${firstName} ${lastName},
                        </p>
                        
                        <p style="margin: 0 0 20px; color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6;">
                          Thank you for registering with Aries76. We're excited to have <strong style="color: #ffffff;">${firmName}</strong> join our exclusive GP network.
                        </p>
                        
                        <p style="margin: 0 0 30px; color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6;">
                          Please verify your email address to access the full GP Fundraising Economics content and request an introductory call with our team.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 20px; color: rgba(255,255,255,0.6); font-size: 14px;">
                            Check your Supabase email for the verification link, or click the button below to access your account:
                          </p>
                          <a href="https://ce89ea00-e7ad-464d-991b-f1fbbd3dd837.lovableproject.com/gp-fundraising-economics" 
                             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #9b87f5 0%, #7e69d6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(155, 135, 245, 0.3);">
                            Access GP Portal
                          </a>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
                          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">
                            What's Next?
                          </h3>
                          
                          <ul style="margin: 0; padding: 0 0 0 20px; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.8;">
                            <li style="margin-bottom: 10px;">Verify your email address</li>
                            <li style="margin-bottom: 10px;">Explore our transparent fundraising economics model</li>
                            <li style="margin-bottom: 10px;">Review the pricing tiers and mandate complexity assessment</li>
                            <li>Request an introductory call to discuss your specific needs</li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="margin: 0 0 10px; color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6;">
                          <strong style="color: #ffffff;">Aries76</strong><br>
                          Transparent, aligned fundraising solutions for General Partners
                        </p>
                        
                        <p style="margin: 15px 0 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                          If you didn't register for Aries76, you can safely ignore this email.
                        </p>
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

    console.log("GP confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending GP confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
