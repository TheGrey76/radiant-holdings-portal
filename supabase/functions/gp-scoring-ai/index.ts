import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_SYSTEM_PROMPT = `You are an expert institutional due diligence analyst working for Aries76, a capital intelligence firm. You are analyzing GP/fund documents to extract data points for a quantitative scoring framework.

Extract ALL relevant data points and map them to the scoring framework below. For each metric, provide:
1. The raw data point(s) you found
2. Which document and approximate page/section it came from
3. A confidence level (high/medium/low)
4. A suggested score (0, 1, 3, or 5) based on the thresholds
5. A brief rationale for the suggested score

SCORING FRAMEWORK:

PILLAR 1 — THE TEAM (30 pts):
- Senior Team Stability (10 pts): 5=>90% together >7yr, 3=70-90% >5yr, 1=<70% or <5yr, 0=high turnover
- Attribution Analysis (10 pts): 5=>80% value from current key persons, 3=60-80%, 1=<60%, 0=key persons departed
- Relevant Experience (5 pts): 5=avg >15yr India PE/VC, 3=10-15yr, 1=<10yr, 0=limited India exp
- GP Commitment (5 pts): 5=>3% fund size, 3=1.5-3%, 1=1-1.5%, 0=<1%

PILLAR 2 — THE TRACK RECORD (35 pts):
- Net IRR USD (10 pts): 5=top quartile >22%, 3=15-22%, 1=10-15%, 0=<10%
- Net MOIC USD (10 pts): 5=>2.5x, 3=2.0-2.5x, 1=1.5-2.0x, 0=<1.5x
- DPI Cash Returns (10 pts): 5=>1.2x mature, 3=0.8-1.2x, 1=0.5-0.8x, 0=<0.5x
- Loss Ratio (5 pts): 5=<5%, 3=5-10%, 1=10-15%, 0=>15%

PILLAR 3 — THE STRATEGY (20 pts):
- Strategy-Market Fit (10 pts): 5=clear differentiated niche, 3=solid but generic, 1=unclear, 0=misaligned
- Fund Size Discipline (5 pts): 5=<1.5x prior, 3=1.5-2x, 1=>2x, 0=significant increase
- Vintage Focus (5 pts): 5=Fund II/III, 3=Fund IV, 1=Fund I or V+, 0=N/A

PILLAR 4 — GOVERNANCE & OPERATIONS (15 pts):
- ILPA Compliance (5 pts): 5=full ILPA 3.0, 3=partial, 1=limited, 0=non-compliant
- Fee Structure (5 pts): 5=mgmt<2% carry=20% hurdle>8%, 3=standard 2/20/8, 1=above-market, 0=egregious
- Operational DD (5 pts): 5=passes all checks, 3=minor issues, 1=significant concerns, 0=fails

Also extract general fund information:
- Fund name, GP name, fund number/vintage, target size, management fee, carry, hurdle rate, GP commitment percentage, key person names and titles.

Return ONLY a JSON object with this exact structure (no markdown, no backticks, no preamble):

{
  "fund_info": {
    "fund_name": { "value": "", "confidence": "high|medium|low", "source": "" },
    "gp_name": { "value": "", "confidence": "high|medium|low", "source": "" },
    "fund_number": { "value": "", "confidence": "high|medium|low", "source": "" },
    "target_size_usd_m": { "value": null, "confidence": "high|medium|low", "source": "" },
    "management_fee_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "carry_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "hurdle_rate_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "gp_commitment_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "key_persons": [{ "name": "", "title": "", "years_experience": null }]
  },
  "metrics": {
    "senior_team_stability": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "attribution_analysis": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "relevant_experience": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "gp_commitment": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "net_irr_usd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "net_moic_usd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "dpi_cash_returns": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "loss_ratio": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "strategy_market_fit": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "fund_size_discipline": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "vintage_focus": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "ilpa_compliance": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "fee_structure": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "operational_dd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" }
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { action, documents, pillarName, pillarData } = await req.json();

    if (action === "extract") {
      // Build content parts from base64 documents
      const contentParts: any[] = [];

      for (const doc of documents) {
        if (doc.mediaType?.startsWith("image/")) {
          contentParts.push({
            type: "image_url",
            image_url: { url: `data:${doc.mediaType};base64,${doc.base64}` },
          });
        } else {
          // For PDFs and other docs, include as text description + base64 reference
          contentParts.push({
            type: "text",
            text: `[Document: ${doc.name} (${doc.docType})]:\n${doc.textContent || "Binary document attached as base64. Analyze the content."}`,
          });
        }
      }

      contentParts.push({
        type: "text",
        text: "Analyze these GP/fund documents and extract all data points relevant to our scoring framework. Return ONLY valid JSON.",
      });

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
            { role: "user", content: contentParts },
          ],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to your workspace." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await response.text();
        console.error("AI gateway error:", response.status, errText);
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      // Strip markdown code fences if present
      let cleanText = text.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
      }

      // Parse JSON from response - try multiple strategies
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in AI response. First 500 chars:", text.substring(0, 500));
        throw new Error("No valid JSON found in AI response");
      }

      let parsed;
      let jsonStr = jsonMatch[0];
      
      // Strategy 1: direct parse
      try {
        parsed = JSON.parse(jsonStr);
      } catch (_e1) {
        // Strategy 2: fix common issues - unescaped newlines/tabs in string values
        try {
          // Replace literal newlines/tabs inside JSON string values
          const fixed = jsonStr
            .replace(/[\r\n]+/g, " ")
            .replace(/\t/g, " ")
            .replace(/,\s*([}\]])/g, "$1"); // remove trailing commas
          parsed = JSON.parse(fixed);
        } catch (_e2) {
          console.error("JSON parse failed after cleanup. First 500 chars:", jsonStr.substring(0, 500));
          console.error("Parse error:", _e2.message);
          throw new Error("Failed to parse AI response as JSON. The AI returned malformed data - please retry.");
        }
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate_notes") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: "You are a senior due diligence analyst at Aries76, a capital intelligence firm. Write a concise, professional Investment Committee memo paragraph summarizing the assessment of this pillar. Use specific numbers and data points. Write in third person, institutional tone. 3-5 sentences max.",
            },
            {
              role: "user",
              content: `Write an IC memo paragraph for the ${pillarName} pillar. Scores and data: ${JSON.stringify(pillarData)}`,
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to your workspace." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      return new Response(JSON.stringify({ notes: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("gp-scoring-ai error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
