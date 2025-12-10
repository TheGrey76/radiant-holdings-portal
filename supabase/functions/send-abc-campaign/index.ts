import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Recipient {
  email: string;
  name: string;
  company: string;
  role?: string;
  city?: string;
  category?: string;
  personalizedContent?: string;
  personalizedSubject?: string;
}

interface Attachment {
  name: string;
  content: string; // base64
  type: string;
}

interface CampaignRequest {
  recipients: Recipient[];
  subject: string;
  content: string;
  senderEmail: string;
  attachments?: Attachment[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, content, senderEmail, attachments }: CampaignRequest = await req.json();
    
    console.log(`Starting ABC campaign: "${subject}" to ${recipients.length} recipients`);
    if (attachments && attachments.length > 0) {
      console.log(`Campaign includes ${attachments.length} attachment(s): ${attachments.map(a => a.name).join(', ')}`);
    }
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Prepare attachments for Resend format
    const resendAttachments = attachments?.map(att => ({
      filename: att.name,
      content: att.content,
    })) || [];

    for (const recipient of recipients) {
      try {
        // Personalize content with all placeholders
        const personalizedContent = content
          .replace(/\{nome\}/g, recipient.name || '')
          .replace(/\{azienda\}/g, recipient.company || '')
          .replace(/\{ruolo\}/g, recipient.role || '')
          .replace(/\{citta\}/g, recipient.city || '')
          .replace(/\{categoria\}/g, recipient.category || '')
          .replace(/\{email\}/g, recipient.email || '');
        
        const personalizedSubject = subject
          .replace(/\{nome\}/g, recipient.name || '')
          .replace(/\{azienda\}/g, recipient.company || '');

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            
            <!-- Main Container -->
            <div style="max-width: 640px; margin: 0 auto; padding: 30px 15px;">
              
              <!-- Email Card -->
              <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                
                <!-- Header with Logo -->
                <div style="background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%); padding: 35px 40px; text-align: center;">
                  <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 50px;" />
                  <p style="color: #c77c4d; font-size: 11px; letter-spacing: 3px; margin: 12px 0 0 0; text-transform: uppercase;">Capital Intelligence</p>
                </div>
                
                <!-- Email Body -->
                <div style="padding: 40px;">
                  <div style="font-size: 15px; line-height: 1.8; color: #333333; white-space: pre-wrap;">
${personalizedContent}
                  </div>
                </div>
                
                <!-- Signature Block -->
                <div style="padding: 0 40px 40px 40px;">
                  <div style="border-top: 2px solid #c77c4d; padding-top: 25px;">
                    <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                      <tr>
                        <td style="vertical-align: top; padding-right: 25px; border-right: 1px solid #e5e5e5;">
                          <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 40px;" />
                        </td>
                        <td style="vertical-align: top; padding-left: 25px;">
                          <div style="font-size: 16px; font-weight: 700; color: #1a2332; letter-spacing: 0.5px;">Edoardo GRIGIONE</div>
                          <div style="font-size: 13px; color: #c77c4d; margin-top: 4px; font-weight: 500;">CEO | Founder</div>
                          <div style="font-size: 13px; margin-top: 8px;">
                            <a href="https://www.aries76.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">www.aries76.com</a>
                          </div>
                          <div style="font-size: 12px; color: #666666; margin-top: 6px;">27, Old Gloucester Street, London WC1N 3AX, UK</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                
              </div>
              
              <!-- Confidentiality Disclaimer -->
              <div style="padding: 25px 20px; text-align: center;">
                <p style="font-size: 10px; color: #888888; line-height: 1.6; margin: 0;">
                  The information transmitted is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination, or other use of, or taking of any action in reliance upon, this information by persons or entities other than the intended recipient is prohibited. If you received this in error, please contact the sender and delete the material from any computer.
                </p>
                <p style="font-size: 11px; color: #999999; margin: 15px 0 0 0;">
                  Aries76 Capital Advisory · London, United Kingdom
                </p>
              </div>
              
            </div>
          </body>
          </html>
        `;

        const emailPayload: any = {
          from: "Edoardo Grigione - Aries76 <edoardo.grigione@aries76.com>",
          to: [recipient.email],
          subject: personalizedSubject,
          html: emailHtml,
        };

        // Add attachments if present
        if (resendAttachments.length > 0) {
          emailPayload.attachments = resendAttachments;
        }

        await resend.emails.send(emailPayload);

        results.successful++;
        console.log(`✓ Email sent to ${recipient.email}`);
        
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${recipient.email}: ${error.message}`);
        console.error(`✗ Failed to send to ${recipient.email}:`, error.message);
      }
    }

    console.log(`Campaign complete: ${results.successful} sent, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-abc-campaign:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);