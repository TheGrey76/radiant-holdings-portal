import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { email, action, code } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Email required" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Action: ${action}, Email: ${normalizedEmail}`);

    if (action === "request") {
      // Check if already verified
      const { data: existing } = await supabase
        .from("bitcoin_research_signups")
        .select("id, verified")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (existing?.verified) {
        console.log("Email already verified:", normalizedEmail);
        return new Response(
          JSON.stringify({ success: true, alreadyVerified: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate verification code
      const verificationCode = generateCode();
      console.log("Generated code for:", normalizedEmail);

      // Upsert the signup record
      const { error: upsertError } = await supabase
        .from("bitcoin_research_signups")
        .upsert({
          email: normalizedEmail,
          verification_code: verificationCode,
          verified: false,
          updated_at: new Date().toISOString()
        }, { onConflict: "email" });

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        return new Response(
          JSON.stringify({ success: false, error: "Database error" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Send verification email
      if (resendKey) {
        try {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "ARIES76 Research <research@aries76.com>",
            to: [normalizedEmail],
            subject: "Your access code — Bitcoin Research",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0d1117; color: #e5e5e5;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 48px; font-weight: 800; color: #f97316;">₿</span>
                </div>
                
                <h1 style="color: white; font-size: 28px; text-align: center; margin-bottom: 20px;">
                  Bitcoin Research
                </h1>
                
                <p style="color: #a1a1a1; font-size: 16px; text-align: center; margin-bottom: 30px;">
                  Here is your access code:
                </p>
                
                <div style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 40px; font-weight: 800; color: white; letter-spacing: 8px;">
                    ${verificationCode}
                  </span>
                </div>
                
                <p style="color: #a1a1a1; font-size: 14px; text-align: center; margin-bottom: 20px;">
                  Enter this code on the access page to continue.
                </p>
                
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                  ARIES76 Ltd · Registered Office: 128 City Road, London, EC1V 2NX<br />
                  <a href="https://aries76.com" style="color: #f97316;">www.aries76.com</a>
                </p>
              </div>
            `,
          });
          console.log("Verification email sent to:", normalizedEmail);
        } catch (emailError) {
          console.error("Email sending error:", emailError);
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "verify") {
      if (!code) {
        return new Response(
          JSON.stringify({ success: false, error: "Code required" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check the code
      const { data: signup } = await supabase
        .from("bitcoin_research_signups")
        .select("id, verification_code")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (!signup) {
        return new Response(
          JSON.stringify({ success: false, error: "Email not found" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (signup.verification_code !== code.trim()) {
        console.log("Invalid code for:", normalizedEmail);
        return new Response(
          JSON.stringify({ success: false, error: "Codice non valido" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark as verified
      const { error: updateError } = await supabase
        .from("bitcoin_research_signups")
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          verification_code: null
        })
        .eq("id", signup.id);

      if (updateError) {
        console.error("Update error:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: "Verification failed" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Email verified successfully:", normalizedEmail);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("bitcoin-research-signup error:", e);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
