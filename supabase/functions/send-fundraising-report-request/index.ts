import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReportRequestData {
  full_name: string;
  email: string;
  company?: string;
  role?: string;
  fund_type?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ReportRequestData = await req.json();
    console.log("Processing fundraising report request for:", requestData.email);

    // Send notification email to admin
    const adminEmail = await resend.emails.send({
      from: "Aries76 Notifications <onboarding@resend.dev>",
      to: ["quinley.martini@aries76.com"],
      subject: "New Fundraising Report Sample Request",
      html: `
        <h2>New Fundraising Report Sample Request</h2>
        <p><strong>Name:</strong> ${requestData.full_name}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        ${requestData.company ? `<p><strong>Company:</strong> ${requestData.company}</p>` : ''}
        ${requestData.role ? `<p><strong>Role:</strong> ${requestData.role}</p>` : ''}
        ${requestData.fund_type ? `<p><strong>Fund Type:</strong> ${requestData.fund_type}</p>` : ''}
        ${requestData.message ? `<p><strong>Message:</strong><br>${requestData.message}</p>` : ''}
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `,
    });

    console.log("Admin notification sent:", adminEmail);

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: "Aries76 <onboarding@resend.dev>",
      to: [requestData.email],
      subject: "Sample Report Request Received - Aries76",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for your interest!</h2>
          <p>Dear ${requestData.full_name},</p>
          <p>We have received your request for a sample Fundraising Readiness Assessment report.</p>
          <p>Our team will review your request and send you an anonymized sample report within 24-48 hours.</p>
          ${requestData.fund_type ? `<p>Report type requested: <strong>${requestData.fund_type}</strong></p>` : ''}
          <p>In the meantime, feel free to explore our other services at <a href="https://www.aries76.com">www.aries76.com</a>.</p>
          <p>If you have any questions, don't hesitate to reach out to us at quinley.martini@aries76.com.</p>
          <br>
          <p>Best regards,<br>
          <strong>The Aries76 Team</strong></p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Aries76 Capital Advisory<br>
            London, United Kingdom
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent to user:", userEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing fundraising report request:", error);
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
