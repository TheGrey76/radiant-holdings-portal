import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { newsId } = await req.json();

    if (!newsId) {
      throw new Error("newsId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing news item: ${newsId}`);

    // Fetch the news item
    const { data: news, error: newsError } = await supabase
      .from("aggregated_news")
      .select("*")
      .eq("id", newsId)
      .single();

    if (newsError || !news) {
      throw new Error(`News item not found: ${newsError?.message}`);
    }

    console.log(`News title: ${news.title}`);

    // Prepare prompt for AI
    const systemPrompt = `You are ARIES76's financial analyst assistant specializing in private equity, venture capital, family offices, and alternative investments. Your task is to:
1. Summarize news articles concisely (2-3 sentences)
2. Add insightful commentary from an institutional investor perspective
3. Suggest relevant tags for categorization

Respond in JSON format:
{
  "summary": "Concise summary of the news",
  "commentary": "ARIES76's perspective and market implications",
  "tags": ["tag1", "tag2", "tag3"]
}

Keep language professional, insightful, and relevant to institutional investors.`;

    const userPrompt = `Analyze this financial news article:

Title: ${news.title}
Source: ${news.source_name}
Category: ${news.category}
Content: ${news.original_content || "No content available - summarize based on title"}

Provide summary, commentary, and tags in JSON format.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    console.log("AI Response:", aiContent);

    // Parse AI response
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: use raw response as summary
      parsed = {
        summary: aiContent.substring(0, 500),
        commentary: "Analysis pending review.",
        tags: [news.category],
      };
    }

    // Insert curated content
    const { data: curated, error: curatedError } = await supabase
      .from("curated_content")
      .insert({
        news_id: newsId,
        ai_summary: parsed.summary,
        ai_commentary: parsed.commentary,
        ai_tags: parsed.tags || [],
        status: "pending",
      })
      .select()
      .single();

    if (curatedError) {
      throw new Error(`Error saving curated content: ${curatedError.message}`);
    }

    // Mark news as processed and curated
    await supabase
      .from("aggregated_news")
      .update({ is_processed: true, is_curated: true })
      .eq("id", newsId);

    console.log(`Successfully processed news ${newsId}`);

    return new Response(
      JSON.stringify({
        success: true,
        curated_id: curated.id,
        summary: parsed.summary,
        tags: parsed.tags,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in process-news-ai:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
