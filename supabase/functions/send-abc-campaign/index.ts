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

interface CampaignRequest {
  recipients: Recipient[];
  subject: string;
  content: string;
  senderEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, content, senderEmail }: CampaignRequest = await req.json();
    
    console.log(`Starting ABC campaign: "${subject}" to ${recipients.length} recipients`);
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

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
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              
              <!-- Logo Header -->
              <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 32px;" />
              </div>
              
              <!-- Email Body -->
              <div style="font-size: 15px; line-height: 1.7; color: #333333; white-space: pre-wrap;">
${personalizedContent}
              </div>
              
              <!-- Signature Block -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e5e5;">
                <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                  <tr>
                    <td style="vertical-align: top; padding-right: 20px;">
                      <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 28px; margin-top: 5px;" />
                    </td>
                    <td style="vertical-align: top;">
                      <div style="font-size: 14px; font-weight: 600; color: #1a2332;">Edoardo GRIGIONE</div>
                      <div style="font-size: 12px; color: #c77c4d; margin-top: 2px;">CEO | Founder</div>
                      <div style="font-size: 12px; margin-top: 4px;">
                        <a href="https://www.aries76.com" style="color: #2563eb; text-decoration: none;">www.aries76.com</a>
                      </div>
                      <div style="font-size: 11px; color: #666666; margin-top: 4px;">27, Old Gloucester Street, London WC1N 3AX, UK</div>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Confidentiality Disclaimer -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="font-size: 9px; color: #999999; line-height: 1.5; margin: 0;">
                  The information transmitted is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination, or other use of, or taking of any action in reliance upon, this information by persons or entities other than the intended recipient is prohibited. If you received this in error, please contact the sender and delete the material from any computer.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 30px; text-align: center;">
                <p style="font-size: 11px; color: #999999; margin: 0;">Aries76 Capital Advisory</p>
                <p style="font-size: 11px; color: #999999; margin: 5px 0 0 0;">London, United Kingdom</p>
              </div>
              
            </div>
          </body>
          </html>
        `;

        await resend.emails.send({
          from: "Edoardo Grigione - Aries76 <edoardo.grigione@aries76.com>",
          to: [recipient.email],
          subject: personalizedSubject,
          html: emailHtml,
        });

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
