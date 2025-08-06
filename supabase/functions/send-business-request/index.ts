import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BusinessRequestData {
  companyName?: string;
  email: string;
  company?: string;
  full_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 Edge Function called!");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ CORS preflight handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    console.log("📥 Request body:", body);
    
    const data: BusinessRequestData = JSON.parse(body);
    console.log("📊 Parsed data:", data);
    
    // Get company name from different possible fields
    const companyName = data.companyName || data.company || data.full_name || "Unknown Company";
    const email = data.email;
    
    console.log("📝 Processing request for:", { companyName, email });

    // Check if RESEND_API_KEY exists
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("🔑 RESEND_API_KEY exists:", !!resendApiKey);
    
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not found!");
      throw new Error("RESEND_API_KEY not configured");
    }
    
    const resend = new Resend(resendApiKey);
    console.log("📧 Resend client initialized");

    // Send email to ARIES76
    console.log("📤 Sending email to quinley.martini@aries76.com...");
    
    const emailResponse = await resend.emails.send({
      from: "ARIES76 Requests <onboarding@resend.dev>",
      to: ["quinley.martini@aries76.com"],
      subject: `🔥 NEW Business Intelligence Request - ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px;">
          <h1 style="color: #1e3a8a; text-align: center;">🔥 NEW REQUEST ALERT!</h1>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #92400e; margin-top: 0;">Client Information</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> Business Intelligence Analysis</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px;">
            <h3 style="color: #1e40af;">Action Required:</h3>
            <p>✅ Review requirements<br>
            ✅ Prepare custom quote<br>
            ✅ Send quote within 24 hours<br>
            ✅ Schedule delivery (5-7 days)</p>
          </div>
          
          <p style="text-align: center; margin-top: 30px; color: #6b7280;">
            Sent from ARIES76 Business Intelligence System
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailId: emailResponse.data?.id || "unknown"
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
    console.error("❌ ERROR in send-business-request:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);