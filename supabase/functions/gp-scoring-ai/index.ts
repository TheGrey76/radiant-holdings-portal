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

Also extract general fund information: Fund name, GP name, fund number/vintage, target size, management fee, carry, hurdle rate, GP commitment percentage, key person names and titles.

Use the extract_scoring_data tool to return your analysis.`;

// Tool definition for structured output
const EXTRACTION_TOOL = {
  type: "function",
  function: {
    name: "extract_scoring_data",
    description: "Extract and return all scoring data from GP/fund documents",
    parameters: {
      type: "object",
      properties: {
        fund_info: {
          type: "object",
          properties: {
            fund_name: { type: "object", properties: { value: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            gp_name: { type: "object", properties: { value: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            fund_number: { type: "object", properties: { value: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            target_size_usd_m: { type: "object", properties: { value: { type: ["number", "null"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            management_fee_pct: { type: "object", properties: { value: { type: ["number", "null"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            carry_pct: { type: "object", properties: { value: { type: ["number", "null"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            hurdle_rate_pct: { type: "object", properties: { value: { type: ["number", "null"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            gp_commitment_pct: { type: "object", properties: { value: { type: ["number", "null"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } }, required: ["value", "confidence", "source"] },
            key_persons: { type: "array", items: { type: "object", properties: { name: { type: "string" }, title: { type: "string" }, years_experience: { type: ["number", "null"] } }, required: ["name", "title"] } }
          },
          required: ["fund_name", "gp_name", "fund_number", "target_size_usd_m", "management_fee_pct", "carry_pct", "hurdle_rate_pct", "gp_commitment_pct", "key_persons"]
        },
        metrics: {
          type: "object",
          properties: {
            senior_team_stability: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            attribution_analysis: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            relevant_experience: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            gp_commitment: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            net_irr_usd: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            net_moic_usd: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            dpi_cash_returns: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            loss_ratio: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            strategy_market_fit: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            fund_size_discipline: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            vintage_focus: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            ilpa_compliance: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            fee_structure: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] },
            operational_dd: { type: "object", properties: { raw_data: { type: "string" }, source_document: { type: "string" }, source_location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, suggested_score: { type: "number" }, rationale: { type: "string" } }, required: ["raw_data", "source_document", "source_location", "confidence", "suggested_score", "rationale"] }
          },
          required: ["senior_team_stability", "attribution_analysis", "relevant_experience", "gp_commitment", "net_irr_usd", "net_moic_usd", "dpi_cash_returns", "loss_ratio", "strategy_market_fit", "fund_size_discipline", "vintage_focus", "ilpa_compliance", "fee_structure", "operational_dd"]
        }
      },
      required: ["fund_info", "metrics"],
      additionalProperties: false
    }
  }
};

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
      const contentParts: any[] = [];

      for (const doc of documents) {
        if (doc.mediaType?.startsWith("image/")) {
          contentParts.push({
            type: "image_url",
            image_url: { url: `data:${doc.mediaType};base64,${doc.base64}` },
          });
        } else {
          contentParts.push({
            type: "text",
            text: `[Document: ${doc.name} (${doc.docType})]:\n${doc.textContent || "Binary document attached as base64. Analyze the content."}`,
          });
        }
      }

      contentParts.push({
        type: "text",
        text: "Analyze these GP/fund documents and extract all data points relevant to our scoring framework. Use the extract_scoring_data tool to return your structured analysis.",
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
          tools: [EXTRACTION_TOOL],
          tool_choice: { type: "function", function: { name: "extract_scoring_data" } },
          max_tokens: 8192,
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
      
      // Extract from tool call response
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fallback: try content field (in case model didn't use tool calling)
      const text = data.choices?.[0]?.message?.content || "";
      if (text) {
        let cleanText = text.trim().replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      throw new Error("No valid extraction data in AI response");
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
