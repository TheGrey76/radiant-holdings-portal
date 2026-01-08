import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, angle, blogExcerpt, targetUrl } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const angleDescriptions: Record<string, string> = {
      "de-education": "Challenge conventional wisdom about Bitcoin. Debunk myths and misconceptions. Provocative but professional.",
      "positioning": "Position ARIES76 as the institutional-grade Bitcoin research authority. Emphasize data-driven analysis and professional credibility.",
      "qualifying": "Filter for serious investors. Use language that resonates with family offices, wealth managers, and institutional allocators."
    };

    const systemPrompt = `You are a LinkedIn content strategist for ARIES76, an institutional investment advisory firm.
Write in English with a professional, authoritative tone.
Create posts optimized for LinkedIn engagement: hook in first line, strategic line breaks, no hashtag spam (max 3-5 relevant ones at the end).
Posts should be 150-250 words, easy to scan, with a clear CTA.`;

    const userPrompt = `Write a LinkedIn post promoting the Bitcoin 2026 Report.

Title/Hook: "${title}"
Angle: ${angle} - ${angleDescriptions[angle] || "Professional and engaging"}
${blogExcerpt ? `\nContext from blog: ${blogExcerpt}` : ""}
Target URL: ${targetUrl || "https://www.aries76.com/bitcoin-2026-report-preview"}

Structure:
1. Hook (first 2 lines - crucial for "see more" click)
2. 3-4 key insights or provocative points
3. Clear CTA to access the report
4. 3-5 relevant hashtags

Make it scroll-stopping and shareable.`;

    console.log(`Generating LinkedIn post: ${title} (${angle})`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    console.log(`Generated post with ${content.length} characters`);

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
