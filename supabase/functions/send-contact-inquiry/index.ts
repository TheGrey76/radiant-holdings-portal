import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: 'lp' | 'gp' | 'general';
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, inquiryType, message }: ContactInquiryRequest = await req.json();

    console.log("Processing contact inquiry:", { name, email, inquiryType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const { data: inquiry, error: dbError } = await supabase
      .from("contact_inquiries")
      .insert({
        name,
        email,
        phone,
        company,
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

    // Send confirmation email to user
    const confirmationEmail = await resend.emails.send({
      from: "Aries76 Ltd <onboarding@resend.dev>",
      to: [email],
      subject: "We've received your inquiry - Aries76 Ltd",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Thank you for reaching out!</h1>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            We have received your ${inquiryType === 'lp' ? 'Limited Partner' : inquiryType === 'gp' ? 'General Partner' : 'general'} inquiry 
            and our team will review it shortly.
          </p>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            A member of our team will be in touch with you within 24-48 hours.
          </p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d3748; font-size: 14px; margin: 0;"><strong>Your Message:</strong></p>
            <p style="color: #4a5568; font-size: 14px; margin: 10px 0 0 0;">${message}</p>
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

    // Send notification email to Aries76
    const notificationEmail = await resend.emails.send({
      from: "Aries76 Contact Form <onboarding@resend.dev>",
      to: ["quinley.martini@aries76.com"],
      subject: `New ${inquiryType.toUpperCase()} Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">New Contact Inquiry</h1>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Inquiry Type:</strong> ${inquiryType === 'lp' ? 'Limited Partner' : inquiryType === 'gp' ? 'General Partner' : 'General'}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p style="color: #2d3748; font-size: 14px; margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ''}
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <p style="color: #2d3748; font-size: 14px; margin: 0;"><strong>Message:</strong></p>
            <p style="color: #4a5568; font-size: 14px; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
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
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
