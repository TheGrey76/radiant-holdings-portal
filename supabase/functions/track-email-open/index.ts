import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

// 1x1 transparent GIF pixel
const TRACKING_PIXEL = Uint8Array.from(atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"), c => c.charCodeAt(0));

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

    console.log(`Email open tracked: campaign=${campaignId}, email=${email}`);

    // Only log if we have campaign and email
    if (campaignId && email) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get user agent and IP for analytics
      const userAgent = req.headers.get("user-agent") || "unknown";
      const forwardedFor = req.headers.get("x-forwarded-for");
      const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

      // Check if this open was already tracked (avoid duplicates from image caching)
      const { data: existing } = await supabase
        .from("abc_email_opens")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("recipient_email", decodeURIComponent(email))
        .limit(1);

      if (!existing || existing.length === 0) {
        // Insert tracking record
        const { error } = await supabase
          .from("abc_email_opens")
          .insert({
            campaign_id: campaignId,
            recipient_email: decodeURIComponent(email),
            recipient_name: name ? decodeURIComponent(name) : null,
            user_agent: userAgent,
            ip_address: ipAddress,
          });

        if (error) {
          console.error("Error logging email open:", error);
        } else {
          console.log(`✓ First open logged for ${email}`);
        }
      } else {
        console.log(`Already tracked open for ${email}`);
      }
    }

    // Return 1x1 transparent GIF
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
        "Content-Length": TRACKING_PIXEL.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("Error in track-email-open:", error);
    // Still return the pixel even on error
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
      },
    });
  }
};

serve(handler);