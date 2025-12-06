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
        // Personalize content
        const personalizedContent = content
          .replace(/\{nome\}/g, recipient.name)
          .replace(/\{azienda\}/g, recipient.company);

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://aries76.com/aries76-og-logo.png" alt="Aries76" style="height: 40px;" />
            </div>
            
            <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
${personalizedContent}
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>Aries76 Capital Advisory</p>
              <p>London, United Kingdom</p>
              <p style="margin-top: 10px;">
                <a href="https://www.aries76.com" style="color: #ff6b35;">www.aries76.com</a>
              </p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: "ABC Company <onboarding@resend.dev>",
          to: [recipient.email],
          subject: subject,
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
