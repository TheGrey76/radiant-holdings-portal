import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CallRequestData {
  name: string;
  firm: string;
  email: string;
  fundInMarket?: string;
  preferredTimezone?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, firm, email, fundInMarket, preferredTimezone, message }: CallRequestData = await req.json();

    console.log("Processing call request notification for:", email);

    // Email 1: Notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Aries76 <onboarding@resend.dev>",
      to: ["edoardo.grigione@aries76.com"],
      subject: "New GP Call Request",
      html: `
        <h2>New Call Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Firm:</strong> ${firm}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${fundInMarket ? `<p><strong>Fund in Market:</strong> ${fundInMarket}</p>` : ''}
        ${preferredTimezone ? `<p><strong>Preferred Timezone:</strong> ${preferredTimezone}</p>` : ''}
        ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Email 2: Confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Aries76 <onboarding@resend.dev>",
      to: [email],
      subject: "Your Call Request Has Been Received",
      html: `
        <h2>Thank you for your interest, ${name}!</h2>
        <p>We have received your request for an introductory call and will get back to you shortly.</p>
        
        <h3>Your Request Details:</h3>
        <p><strong>Firm:</strong> ${firm}</p>
        ${fundInMarket ? `<p><strong>Fund in Market:</strong> ${fundInMarket}</p>` : ''}
        ${preferredTimezone ? `<p><strong>Preferred Timezone:</strong> ${preferredTimezone}</p>` : ''}
        
        <p>We typically respond within 24-48 hours. If you have any urgent questions, please don't hesitate to contact us directly.</p>
        
        <p>Best regards,<br>The Aries76 Team</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Aries76 Capital Advisory<br>
          <a href="https://aries76.com">www.aries76.com</a>
        </p>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-call-request-notification function:", error);
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
