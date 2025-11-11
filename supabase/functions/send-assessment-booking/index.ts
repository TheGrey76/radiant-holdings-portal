import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AssessmentBookingRequest {
  client_type: string;
  fundraising_target: string;
  timeline: string;
  materials?: string;
  key_metrics?: string;
  lp_preferences?: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: AssessmentBookingRequest = await req.json();
    console.log("Assessment booking received:", bookingData);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Aries76 Assessments <onboarding@resend.dev>",
      to: ["quinley.martini@aries76.com"],
      subject: `New Assessment Booking: ${bookingData.contact_name} - ${bookingData.client_type}`,
      html: `
        <h2>New Assessment Booking Request</h2>
        
        <h3>Client Information</h3>
        <p><strong>Name:</strong> ${bookingData.contact_name}</p>
        <p><strong>Role:</strong> ${bookingData.contact_role}</p>
        <p><strong>Email:</strong> ${bookingData.contact_email}</p>
        ${bookingData.contact_phone ? `<p><strong>Phone:</strong> ${bookingData.contact_phone}</p>` : ''}
        
        <h3>Assessment Details</h3>
        <p><strong>Client Type:</strong> ${bookingData.client_type}</p>
        <p><strong>Fundraising Target:</strong> ${bookingData.fundraising_target}</p>
        <p><strong>Expected Timeline:</strong> ${bookingData.timeline}</p>
        
        ${bookingData.materials ? `
        <h3>Available Materials</h3>
        <p>${bookingData.materials}</p>
        ` : ''}
        
        ${bookingData.key_metrics ? `
        <h3>Key Metrics</h3>
        <p>${bookingData.key_metrics}</p>
        ` : ''}
        
        ${bookingData.lp_preferences ? `
        <h3>LP/Investor Preferences</h3>
        <p>${bookingData.lp_preferences}</p>
        ` : ''}
        
        <p style="margin-top: 20px; color: #666;">This request was submitted via the Fundraising Readiness page.</p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Aries76 <onboarding@resend.dev>",
      to: [bookingData.contact_email],
      subject: "Assessment Booking Confirmation - Aries76",
      html: `
        <h2>Thank you for booking an assessment, ${bookingData.contact_name}!</h2>
        
        <p>We have received your request for a Fundraising Readiness Assessment.</p>
        
        <h3>Your Details</h3>
        <p><strong>Client Type:</strong> ${bookingData.client_type}</p>
        <p><strong>Fundraising Target:</strong> ${bookingData.fundraising_target}</p>
        <p><strong>Expected Timeline:</strong> ${bookingData.timeline}</p>
        
        <h3>Next Steps</h3>
        <p>Our team will review your information and contact you within 1-2 business days to discuss:</p>
        <ul>
          <li>Your specific fundraising goals and challenges</li>
          <li>The assessment process and timeline</li>
          <li>A customized proposal tailored to your needs</li>
        </ul>
        
        <p>If you have any urgent questions, please don't hesitate to contact us at <a href="mailto:quinley.martini@aries76.com">quinley.martini@aries76.com</a>.</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>The Aries76 Team</strong></p>
        
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          Aries76 Ltd | London<br>
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
    console.error("Error in send-assessment-booking function:", error);
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
