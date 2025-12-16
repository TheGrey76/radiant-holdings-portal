import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const finnhubApiKey = Deno.env.get("FINNHUB_API_KEY");

    if (!finnhubApiKey) {
      throw new Error("FINNHUB_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for optional category filter
    let category = "general";
    try {
      const body = await req.json();
      if (body.category) {
        category = body.category;
      }
    } catch {
      // Use default category if no body
    }

    console.log(`Fetching Finnhub news for category: ${category}`);

    // Fetch from Finnhub API
    const finnhubUrl = `https://finnhub.io/api/v1/news?category=${category}&token=${finnhubApiKey}`;
    
    const response = await fetch(finnhubUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Finnhub API error:", response.status, errorText);
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const newsItems: FinnhubNews[] = await response.json();
    console.log(`Received ${newsItems.length} news items from Finnhub`);

    // Map Finnhub categories to our categories
    const mapCategory = (finnhubCategory: string): string => {
      const categoryMap: Record<string, string> = {
        "general": "markets",
        "forex": "markets",
        "crypto": "digital_assets",
        "merger": "private_equity",
      };
      return categoryMap[finnhubCategory] || "markets";
    };

    let totalFetched = 0;
    const errors: string[] = [];

    // Get or create Finnhub source
    const { data: sourceData } = await supabase
      .from("news_sources")
      .select("id")
      .eq("name", "Finnhub API")
      .single();

    const sourceId = sourceData?.id;

    // Insert news items
    for (const item of newsItems.slice(0, 50)) { // Limit to 50 items
      try {
        const { error: insertError } = await supabase
          .from("aggregated_news")
          .upsert(
            {
              source_id: sourceId,
              external_id: `finnhub_${item.id}`,
              title: item.headline,
              original_url: item.url,
              original_content: item.summary,
              image_url: item.image || null,
              source_name: item.source || "Finnhub",
              category: mapCategory(item.category),
              published_at: new Date(item.datetime * 1000).toISOString(),
              fetched_at: new Date().toISOString(),
            },
            {
              onConflict: "external_id,source_id",
              ignoreDuplicates: true,
            }
          );

        if (!insertError) {
          totalFetched++;
        } else {
          console.error("Insert error:", insertError.message);
        }
      } catch (err) {
        errors.push(`Item ${item.id}: ${err.message}`);
      }
    }

    // Update last fetched timestamp for Finnhub source
    if (sourceId) {
      await supabase
        .from("news_sources")
        .update({ last_fetched_at: new Date().toISOString() })
        .eq("id", sourceId);
    }

    console.log(`Successfully fetched ${totalFetched} news items from Finnhub`);

    return new Response(
      JSON.stringify({
        success: true,
        fetched: totalFetched,
        total_received: newsItems.length,
        category,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-finnhub-news:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
