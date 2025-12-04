import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  phone: z.string().max(30, "Phone too long").optional().nullable(),
  company: z.string().max(200, "Company name too long").optional().nullable(),
  inquiryType: z.enum(['lp', 'gp', 'general']),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message too long")
});

// HTML escape to prevent injection
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input
    const parseResult = contactSchema.safeParse(rawBody);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid input",
          details: parseResult.error.errors.map(e => e.message)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, company, inquiryType, message } = parseResult.data;

    console.log("Processing contact inquiry:", { name, email, inquiryType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database with sanitized data
    const { data: inquiry, error: dbError } = await supabase
      .from("contact_inquiries")
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        inquiry_type: inquiryType,
        message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save inquiry: ${dbError.message}`);
    }

    console.log("Inquiry saved to database:", inquiry.id);

    // Escape HTML for email content to prevent injection
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message);
    const safeCompany = company ? escapeHtml(company) : null;
    const safePhone = phone ? escapeHtml(phone) : null;

    // Send confirmation email to user
    try {
      const confirmationEmail = await resend.emails.send({
        from: "Aries76 Ltd <onboarding@resend.dev>",
        to: [email],
        subject: "We've received your inquiry - Aries76 Ltd",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Thank you for reaching out!</h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Dear ${safeName},</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              We have received your ${inquiryType === 'lp' ? 'Limited Partner' : inquiryType === 'gp' ? 'General Partner' : 'general'} inquiry 
              and our team will review it shortly.
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              A member of our team will be in touch with you within 24-48 hours.
            </p>
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2d3748; font-size: 14px; margin: 0;"><strong>Your Message:</strong></p>
              <p style="color: #4a5568; font-size: 14px; margin: 10px 0 0 0;">${safeMessage}</p>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The Aries76 Team</strong>
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #718096; font-size: 12px; line-height: 1.6;">
              Aries76 Ltd<br>
              27 Old Gloucester Street<br>
              London, WC1N 3AX, United Kingdom<br>
              <a href="mailto:quinley.martini@aries76.com" style="color: #4299e1;">quinley.martini@aries76.com</a>
            </p>
          </div>
        `,
      });
      console.log("Confirmation email sent:", confirmationEmail);
    } catch (confirmError: any) {
      console.log("Confirmation email failed (expected in test mode):", confirmError.message);
    }

    // Send notification email to Aries76
    const notificationEmail = await resend.emails.send({
      from: "Aries76 Contact Form <onboarding@resend.dev>",
      to: ["edoardo.grigione@aries76.com"],
      subject: `New ${inquiryType.toUpperCase()} Inquiry from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">New Contact Inquiry</h1>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Inquiry Type:</strong> ${inquiryType === 'lp' ? 'Limited Partner' : inquiryType === 'gp' ? 'General Partner' : 'General'}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${safePhone ? `<p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Phone:</strong> ${safePhone}</p>` : ''}
            ${safeCompany ? `<p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Company:</strong> ${safeCompany}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <p style="color: #2d3748; font-size: 14px; margin: 0;"><strong>Message:</strong></p>
            <p style="color: #4a5568; font-size: 14px; margin: 10px 0 0 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry submitted successfully",
        inquiryId: inquiry.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "An error occurred processing your request"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
