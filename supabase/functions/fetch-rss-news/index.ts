import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  guid?: string;
}

// Simple RSS parser
function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
  
  for (const itemXml of itemMatches) {
    const getTag = (tag: string) => {
      const match = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return match ? (match[1] || match[2] || '').trim() : '';
    };
    
    const title = getTag('title');
    const link = getTag('link');
    
    if (title && link) {
      items.push({
        title,
        link,
        description: getTag('description'),
        pubDate: getTag('pubDate'),
        guid: getTag('guid') || link,
      });
    }
  }
  
  return items;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Fetching active RSS news sources...");

    // Get active RSS sources
    const { data: sources, error: sourcesError } = await supabase
      .from("news_sources")
      .select("*")
      .eq("is_active", true)
      .eq("source_type", "rss");

    if (sourcesError) {
      throw new Error(`Error fetching sources: ${sourcesError.message}`);
    }

    console.log(`Found ${sources?.length || 0} active RSS sources`);

    let totalFetched = 0;
    const errors: string[] = [];

    for (const source of sources || []) {
      try {
        console.log(`Fetching RSS from: ${source.name} (${source.url})`);
        
        const response = await fetch(source.url, {
          headers: {
            "User-Agent": "ARIES76-NewsBot/1.0",
            "Accept": "application/rss+xml, application/xml, text/xml",
          },
        });

        if (!response.ok) {
          errors.push(`${source.name}: HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = parseRSS(xml);
        
        console.log(`Parsed ${items.length} items from ${source.name}`);

        // Insert news items
        for (const item of items.slice(0, 20)) { // Limit to 20 per source
          const { error: insertError } = await supabase
            .from("aggregated_news")
            .upsert(
              {
                source_id: source.id,
                external_id: item.guid || item.link,
                title: item.title,
                original_url: item.link,
                original_content: item.description,
                source_name: source.name,
                category: source.category,
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
                fetched_at: new Date().toISOString(),
              },
              {
                onConflict: "external_id,source_id",
                ignoreDuplicates: true,
              }
            );

          if (!insertError) {
            totalFetched++;
          }
        }

        // Update last fetched timestamp
        await supabase
          .from("news_sources")
          .update({ last_fetched_at: new Date().toISOString() })
          .eq("id", source.id);

      } catch (err) {
        console.error(`Error processing source ${source.name}:`, err);
        errors.push(`${source.name}: ${err.message}`);
      }
    }

    console.log(`Total news items fetched: ${totalFetched}`);

    return new Response(
      JSON.stringify({
        success: true,
        fetched: totalFetched,
        sources_processed: sources?.length || 0,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-rss-news:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
