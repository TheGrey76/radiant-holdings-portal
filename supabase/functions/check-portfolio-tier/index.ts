import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PORTFOLIO-TIER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get all active subscriptions for this user
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('portfolio_subscriptions')
      .select('tier, purchased_at, expires_at')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (subError) {
      logStep("Error fetching subscriptions", { error: subError.message });
      throw new Error(`Database error: ${subError.message}`);
    }

    // Filter out expired subscriptions
    const now = new Date();
    const activeTiers = (subscriptions || [])
      .filter(sub => !sub.expires_at || new Date(sub.expires_at) > now)
      .map(sub => sub.tier);

    logStep("Active tiers found", { tiers: activeTiers });

    return new Response(
      JSON.stringify({
        success: true,
        tiers: activeTiers,
        hasEssentials: activeTiers.includes('essentials'),
        hasProfessional: activeTiers.includes('professional'),
        hasEnterprise: activeTiers.includes('enterprise'),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        tiers: [],
        hasEssentials: false,
        hasProfessional: false,
        hasEnterprise: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 even on error to allow client to handle
      }
    );
  }
});
