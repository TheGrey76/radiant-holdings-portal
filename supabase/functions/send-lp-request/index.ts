import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const lpRequestSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(200, "Name too long"),
  organization: z.string().min(1, "Organization is required").max(200, "Organization name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  role: z.string().max(200, "Role too long").optional(),
  jurisdiction: z.string().max(200, "Jurisdiction too long").optional(),
  investorType: z.string().max(100, "Investor type too long").optional(),
  areasOfInterest: z.array(z.string()).optional(),
  message: z.string().max(2000, "Message too long").optional(),
});

interface LPRequestData {
  fullName: string;
  organization: string;
  email: string;
  role?: string;
  jurisdiction?: string;
  investorType?: string;
  areasOfInterest?: string[];
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 LP Request Edge Function called!");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ CORS preflight handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    console.log("📥 LP Request received");
    
    const rawData: LPRequestData = JSON.parse(body);
    
    // Validate input
    const validationResult = lpRequestSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("❌ Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: validationResult.error.errors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const data = validationResult.data;
    
    console.log("📝 Processing LP request for:", data.organization);

    // Save to database
    console.log("💾 Saving LP registration to database...");
    const { data: dbData, error: dbError } = await supabase
      .from('lp_registrations')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          organization: data.organization,
          role: data.role,
          jurisdiction: data.jurisdiction,
          investor_type: data.investorType,
          areas_of_interest: data.areasOfInterest || [],
          message: data.message,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("❌ Database error:", dbError);
      throw new Error(`Failed to save registration: ${dbError.message}`);
    }

    console.log("✅ LP registration saved to database with ID:", dbData.id);

    // Prepare areas of interest string
    const areasText = data.areasOfInterest && data.areasOfInterest.length > 0
      ? data.areasOfInterest.join(", ")
      : "Not specified";

    // Send email to Quinley using Resend
    console.log("📤 Sending email to quinley.martini@aries76.com...");
    
    const emailResponse = await resend.emails.send({
      from: "Aries76 LP Requests <noreply@aries76.com>",
      to: ["quinley.martini@aries76.com"],
      subject: `🔥 NEW LP Information Request - ${data.organization}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1a2744 0%, #0d1424 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; text-align: center;">
              NEW LP INFORMATION REQUEST
            </h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background-color: #fff3cd; border-left: 4px solid #ff6c1f; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-weight: 500;">
                ⚡ Action Required: New professional investor requesting GP information pack
              </p>
            </div>

            <h2 style="color: #1a2744; font-size: 18px; font-weight: 500; margin-top: 0; border-bottom: 2px solid #ff6c1f; padding-bottom: 10px;">
              Contact Information
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500; width: 140px;">Full Name:</td>
                <td style="padding: 10px 0; color: #212529; font-weight: 600;">${data.fullName}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Organization:</td>
                <td style="padding: 10px 0; color: #212529; font-weight: 600;">${data.organization}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Email:</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${data.email}" style="color: #ff6c1f; text-decoration: none; font-weight: 600;">${data.email}</a>
                </td>
              </tr>
              ${data.role ? `
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Role:</td>
                <td style="padding: 10px 0; color: #212529;">${data.role}</td>
              </tr>
              ` : ''}
              ${data.jurisdiction ? `
              <tr>
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Jurisdiction:</td>
                <td style="padding: 10px 0; color: #212529;">${data.jurisdiction}</td>
              </tr>
              ` : ''}
              ${data.investorType ? `
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Investor Type:</td>
                <td style="padding: 10px 0; color: #212529;">${data.investorType}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; color: #6c757d; font-weight: 500;">Areas of Interest:</td>
                <td style="padding: 10px 0; color: #212529;">${areasText}</td>
              </tr>
            </table>

            ${data.message ? `
            <h2 style="color: #1a2744; font-size: 18px; font-weight: 500; margin-top: 25px; border-bottom: 2px solid #ff6c1f; padding-bottom: 10px;">
              Additional Message
            </h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #212529; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            </div>
            ` : ''}

            <div style="background-color: #e7f3ff; border-left: 4px solid #1a2744; padding: 15px; margin-top: 25px; border-radius: 4px;">
              <h3 style="color: #1a2744; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #495057;">
                <li style="margin-bottom: 5px;">Review LP profile and investment criteria</li>
                <li style="margin-bottom: 5px;">Prepare customized GP information pack</li>
                <li style="margin-bottom: 5px;">Schedule introductory call if appropriate</li>
                <li>Respond within 24 hours</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Request submitted on ${new Date().toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
                Sent from Aries76 For Limited Partners Portal
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
      throw new Error(`Resend API error: ${emailResponse.error.message}`);
    }

    console.log("✅ Email sent successfully via Resend!", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your request has been sent successfully. We will contact you shortly."
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
    console.error("❌ ERROR in send-lp-request:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request. Please try again later.",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
