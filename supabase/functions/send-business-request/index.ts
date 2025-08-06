import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log("Initializing Resend with API key:", resendApiKey ? "API key found" : "API key missing");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BusinessRequestData {
  companyName: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Edge function called with method:", req.method);
  console.log("RESEND_API_KEY configured:", !!Deno.env.get("RESEND_API_KEY"));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Reading request body...");
    const body = await req.text();
    console.log("Request body:", body);
    
    const { companyName, email }: BusinessRequestData = JSON.parse(body);

    console.log("Processing business intelligence request:", { companyName, email });

    // Send email to ARIES76
    const emailResponse = await resend.emails.send({
      from: "Business Intelligence Requests <onboarding@resend.dev>",
      to: ["quinley.martini@aries76.com"],
      subject: `New Business Intelligence Analysis Request - ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Business Intelligence Analysis Request
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Client Information</h3>
            <p><strong>Company Name:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Service Details</h3>
            <p><strong>Service:</strong> Business Intelligence Analysis</p>
            <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Request Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Next Steps</h3>
            <ol style="color: #475569;">
              <li>Review client requirements</li>
              <li>Prepare custom quote</li>
              <li>Send quote and wire transfer instructions within 24 hours</li>
              <li>Schedule analysis delivery (5-7 business days)</li>
            </ol>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            This request was submitted through the ARIES76 Business Intelligence page.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully to ARIES76:", emailResponse);

    // Send confirmation email to client
    const confirmationResponse = await resend.emails.send({
      from: "ARIES76 <onboarding@resend.dev>",
      to: [email],
      subject: "Your Business Intelligence Analysis Request - ARIES76",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Thank You for Your Request
          </h2>
          
          <p>Dear ${companyName} team,</p>
          
          <p>Thank you for your interest in our Business Intelligence Analysis services. We have received your request and will contact you within 24 hours with a custom quote and next steps.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">What You Can Expect</h3>
            <ul style="color: #475569;">
              <li>Custom quote based on your specific requirements</li>
              <li>Wire transfer payment instructions</li>
              <li>Analysis delivery within 5-7 business days</li>
              <li>30-day satisfaction guarantee</li>
            </ul>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Our Business Intelligence Services Include</h3>
            <ul style="color: #475569;">
              <li>AI-driven data analysis and insights</li>
              <li>Custom dashboard development</li>
              <li>Predictive analytics implementation</li>
              <li>Customer behavior analysis</li>
              <li>Market intelligence reports</li>
              <li>ROI analysis and projections</li>
            </ul>
          </div>
          
          <p>If you have any questions in the meantime, please don't hesitate to reach out.</p>
          
          <p>Best regards,<br>
          <strong>The ARIES76 Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            ARIES76 - Business Intelligence & AI Solutions
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent to client:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Request submitted successfully" 
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
    console.error("Error in send-business-request function:", error);
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