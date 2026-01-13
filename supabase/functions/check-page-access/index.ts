import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ hasAccess: false, error: "Server configuration error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { email, page_slug } = await req.json().catch(() => ({ email: null, page_slug: null }));
    
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedSlug = typeof page_slug === "string" ? page_slug.trim().toLowerCase() : "";

    if (!normalizedEmail || !normalizedSlug) {
      console.log("Missing email or page_slug:", { email, page_slug });
      return new Response(
        JSON.stringify({ hasAccess: false, reason: "missing_params" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Checking access: email=${normalizedEmail}, page=${normalizedSlug}`);

    // Check page_access table
    const { data, error } = await supabase
      .from("page_access")
      .select("id, access_type, expires_at")
      .eq("page_slug", normalizedSlug)
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("Database query error:", error);
      return new Response(
        JSON.stringify({ hasAccess: false, reason: "db_error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data) {
      console.log(`No access record found for ${normalizedEmail} on ${normalizedSlug}`);
      return new Response(
        JSON.stringify({ hasAccess: false, reason: "no_access_record" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.log(`Access expired for ${normalizedEmail} on ${normalizedSlug}`);
      return new Response(
        JSON.stringify({ hasAccess: false, reason: "expired" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Access granted for ${normalizedEmail} on ${normalizedSlug}, type=${data.access_type}`);
    return new Response(
      JSON.stringify({ hasAccess: true, access_type: data.access_type }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("check-page-access error:", e);
    return new Response(
      JSON.stringify({ hasAccess: false, reason: "server_error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
