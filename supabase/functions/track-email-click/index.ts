import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("cid");
    const email = url.searchParams.get("e");
    const name = url.searchParams.get("n");
    const targetUrl = url.searchParams.get("url");
    const label = url.searchParams.get("label");

    // Get user agent and IP for analytics
    const userAgent = req.headers.get("user-agent") || "unknown";
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    console.log(`Email click: campaign=${campaignId}, email=${email}, url=${targetUrl}`);

    // Log click if we have required params
    if (campaignId && email && targetUrl) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insert click tracking record
      const { error } = await supabase
        .from("abc_email_clicks")
        .insert({
          campaign_id: campaignId,
          recipient_email: decodeURIComponent(email),
          recipient_name: name ? decodeURIComponent(name) : null,
          link_url: decodeURIComponent(targetUrl),
          link_label: label ? decodeURIComponent(label) : null,
          user_agent: userAgent,
          ip_address: ipAddress,
        });

      if (error) {
        console.error("Error logging click:", error);
      } else {
        console.log(`✓ Click logged for ${email} → ${targetUrl}`);
      }
    }

    // Redirect to target URL
    const redirectUrl = targetUrl ? decodeURIComponent(targetUrl) : "https://abccompany.it/";
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl,
      },
    });

  } catch (error: any) {
    console.error("Error in track-email-click:", error);
    // Still redirect on error
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": "https://abccompany.it/",
      },
    });
  }
};

serve(handler);
