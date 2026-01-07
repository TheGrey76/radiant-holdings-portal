import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrichmentRequest {
  investorId: string;
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { investorId, nome, azienda, ruolo, categoria }: EnrichmentRequest = await req.json();

    console.log(`AI Enrichment for: ${nome} at ${azienda}`);

    const systemPrompt = `You are a professional investor research assistant for private equity fundraising. 
Your task is to find and return structured information about an investor contact.

IMPORTANT: Return ONLY a valid JSON object with no additional text. Do not include markdown code blocks.

The JSON must have this exact structure:
{
  "email": "found email or null",
  "phone": "found phone or null",
  "linkedin": "LinkedIn profile URL or null",
  "bio": "Brief professional bio (max 100 words) or null",
  "investmentFocus": ["array", "of", "focus", "areas"] or null,
  "ticketSize": "typical investment range or null",
  "recentDeals": ["array of recent investments/deals"] or null,
  "notes": "any relevant notes for fundraising approach or null",
  "confidence": "high/medium/low based on data quality"
}

If you cannot find specific information, use null for that field.
Base your research on the investor's name, company, role, and category provided.`;

    const userPrompt = `Research this investor for private equity fundraising:

Name: ${nome}
Company: ${azienda}
${ruolo ? `Role: ${ruolo}` : ''}
${categoria ? `Category: ${categoria}` : ''}

Find their professional contact information, investment preferences, and any relevant details for approaching them about a fund investment opportunity.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No AI response content");
    }

    console.log("AI Response:", aiContent);

    // Parse the JSON response (handle potential markdown code blocks)
    let enrichedData;
    try {
      // Remove potential markdown code blocks
      let cleanContent = aiContent.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      enrichedData = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      enrichedData = {
        email: null,
        phone: null,
        linkedin: null,
        bio: aiContent.slice(0, 500),
        investmentFocus: null,
        ticketSize: null,
        recentDeals: null,
        notes: null,
        confidence: "low",
      };
    }

    // Update the investor in Supabase if we found useful data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData: Record<string, any> = {};

    if (enrichedData.email) {
      updateData.email = enrichedData.email;
    }
    if (enrichedData.phone) {
      updateData.phone = enrichedData.phone;
    }
    if (enrichedData.linkedin) {
      updateData.linkedin = enrichedData.linkedin;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("abc_investors")
        .update(updateData)
        .eq("id", investorId);

      if (updateError) {
        console.error("Error updating investor:", updateError);
      } else {
        console.log(`Updated investor ${investorId} with enriched data`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: enrichedData,
        updated: Object.keys(updateData).length > 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in ai-investor-enrichment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
