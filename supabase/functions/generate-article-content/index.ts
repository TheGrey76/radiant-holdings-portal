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
    const { title, sourceUrl, sourceName, category, targetWords, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a professional financial journalist writing for ARIES76, an institutional investment advisory firm. 
Write in ${language === 'it' ? 'Italian' : 'English'}.
Your tone is professional, analytical, and authoritative.
Focus on providing actionable insights for institutional investors, family offices, and financial professionals.
Include relevant market context, implications for investors, and forward-looking analysis.
Use clear section headers with ## markdown syntax.
Aim for approximately ${targetWords} words.`;

    const userPrompt = `Write a comprehensive article based on this news:

Title: "${title}"
Source: ${sourceName}
Category: ${category}
Original URL: ${sourceUrl}

Create a well-structured article with:
1. An engaging introduction that hooks the reader
2. Key facts and analysis (2-3 sections with ## headers)
3. Market implications and investor takeaways
4. A brief conclusion

Target word count: ${targetWords} words.
End with a source attribution: *Source: [${sourceName}](${sourceUrl})*`;

    console.log(`Generating ${targetWords}-word article for: ${title}`);

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
        max_tokens: Math.max(2000, targetWords * 2),
        temperature: 0.7,
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

    console.log(`Generated article with ~${content.split(/\s+/).length} words`);

    return new Response(
      JSON.stringify({ 
        content,
        wordCount: content.split(/\s+/).length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating article:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
