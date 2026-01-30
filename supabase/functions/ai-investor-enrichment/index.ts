import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EnrichmentRequest {
  investorId: string;
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria?: string;
}

interface ApolloSearchResponse {
  people?: Array<{
    email?: string;
    linkedin_url?: string;
    first_name?: string;
    last_name?: string;
    title?: string;
    organization?: {
      name?: string;
    };
  }>;
}

// Split full name into first and last name
function splitName(fullName: string): { firstName: string; lastName: string } {
  const cleaned = fullName.trim();
  
  // Handle "Surname, Name" format common in Italian
  if (cleaned.includes(',')) {
    const [lastName, firstName] = cleaned.split(',').map(s => s.trim());
    return { firstName: firstName || '', lastName: lastName || '' };
  }
  
  const parts = cleaned.split(/\s+/).filter(p => p.length > 0);
  
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] };
  }
  
  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }
  
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

// Clean company name for Apollo search
function cleanCompanyName(azienda: string): string {
  const suffixes = [' S.p.A.', ' S.p.a.', ' SpA', ' SPA', ' S.r.l.', ' Srl', ' SRL', ' Ltd', ' Limited', ' GmbH', ' AG', ' Inc', ' Corp', ' LLC', ' SGR', ' SIM', ' S.A.', ' Private Banking', ' Asset Management'];
  let cleanName = azienda;
  
  for (const suffix of suffixes) {
    cleanName = cleanName.replace(new RegExp(suffix + '$', 'i'), '');
  }
  return cleanName.trim();
}

// Apollo.io People Search - Primary enrichment source
async function searchApolloForPerson(
  nome: string, 
  azienda: string, 
  ruolo?: string
): Promise<{ email: string | null; linkedin: string | null; confidence: number }> {
  const APOLLO_API_KEY = Deno.env.get("APOLLO_API_KEY");
  
  if (!APOLLO_API_KEY) {
    console.log("APOLLO_API_KEY not configured, skipping Apollo enrichment");
    return { email: null, linkedin: null, confidence: 0 };
  }

  const { firstName, lastName } = splitName(nome);
  const cleanedCompany = cleanCompanyName(azienda);

  console.log(`Apollo search: ${firstName} ${lastName} at ${cleanedCompany}`);

  try {
    // Use Apollo People Search API
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY,
      },
      body: JSON.stringify({
        q_person_name: `${firstName} ${lastName}`.trim(),
        q_organization_name: cleanedCompany,
        per_page: 5,
        page: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Apollo API error: ${response.status} - ${errorText}`);
      return { email: null, linkedin: null, confidence: 0 };
    }

    const data: ApolloSearchResponse = await response.json();

    if (data.people && data.people.length > 0) {
      // Find best match
      const bestMatch = data.people.find(p => {
        const matchesName = 
          (p.first_name?.toLowerCase() === firstName.toLowerCase() || 
           p.last_name?.toLowerCase() === lastName.toLowerCase());
        const matchesCompany = 
          p.organization?.name?.toLowerCase().includes(cleanedCompany.toLowerCase().slice(0, 6)) ||
          cleanedCompany.toLowerCase().includes(p.organization?.name?.toLowerCase().slice(0, 6) || '');
        return matchesName || matchesCompany;
      }) || data.people[0];

      if (bestMatch) {
        console.log(`Apollo found: ${bestMatch.email || 'no email'}, LinkedIn: ${bestMatch.linkedin_url || 'no linkedin'}`);
        return {
          email: bestMatch.email || null,
          linkedin: bestMatch.linkedin_url || null,
          confidence: bestMatch.email ? 90 : 50,
        };
      }
    }

    console.log("Apollo: No matches found");
    return { email: null, linkedin: null, confidence: 0 };

  } catch (error) {
    console.error("Apollo API error:", error);
    return { email: null, linkedin: null, confidence: 0 };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    const { investorId, nome, azienda, ruolo, categoria }: EnrichmentRequest = await req.json();

    console.log(`Enrichment for: ${nome} at ${azienda}`);

    // Step 1: Use Apollo.io as primary source (best for B2B contacts)
    const apolloResult = await searchApolloForPerson(nome, azienda, ruolo);

    // Step 2: Use AI for additional enrichment (bio, investment focus, etc.)
    let aiData: any = {};
    
    if (LOVABLE_API_KEY) {
      const systemPrompt = `You are a professional investor research assistant for private equity fundraising. 
Your task is to provide structured information about an investor contact based on your knowledge.

CRITICAL RULES:
1. DO NOT invent or guess LinkedIn profile URLs - leave linkedin as null
2. Only provide information you are confident about
3. Return ONLY a valid JSON object with no additional text or markdown

The JSON must have this exact structure:
{
  "bio": "Brief professional bio (max 100 words) or null",
  "investmentFocus": ["array", "of", "focus", "areas"] or null,
  "ticketSize": "typical investment range or null",
  "recentDeals": ["array of recent investments/deals"] or null,
  "notes": "any relevant notes for fundraising approach or null",
  "confidence": "high/medium/low based on data quality"
}

If you cannot find specific information, use null for that field.`;

      const userPrompt = `Research this investor for private equity fundraising:

Name: ${nome}
Company: ${azienda}
${ruolo ? `Role: ${ruolo}` : ''}
${categoria ? `Category: ${categoria}` : ''}

Provide professional background and investment preferences. DO NOT guess LinkedIn URLs.`;

      try {
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

        if (response.ok) {
          const aiResponse = await response.json();
          const aiContent = aiResponse.choices?.[0]?.message?.content;

          if (aiContent) {
            try {
              let cleanContent = aiContent.trim();
              if (cleanContent.startsWith("```json")) {
                cleanContent = cleanContent.slice(7);
              } else if (cleanContent.startsWith("```")) {
                cleanContent = cleanContent.slice(3);
              }
              if (cleanContent.endsWith("```")) {
                cleanContent = cleanContent.slice(0, -3);
              }
              const parsedData = JSON.parse(cleanContent.trim());
              if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
                aiData = parsedData;
                console.log("AI enrichment successful");
              }
            } catch (parseError) {
              console.error("Failed to parse AI response:", parseError);
            }
          }
        } else if (response.status === 429) {
          console.log("AI rate limited, continuing with Apollo data");
        } else if (response.status === 402) {
          console.log("AI credits exhausted, continuing with Apollo data");
        }
      } catch (aiError) {
        console.error("AI enrichment error:", aiError);
      }
    }

    // Step 3: Combine results - Apollo is primary source
    const enrichedData = {
      email: apolloResult.email,
      emailConfidence: apolloResult.confidence,
      emailSource: apolloResult.email ? 'apollo.io' : null,
      phone: null,
      linkedin: apolloResult.linkedin,
      bio: aiData.bio || null,
      investmentFocus: aiData.investmentFocus || null,
      ticketSize: aiData.ticketSize || null,
      recentDeals: aiData.recentDeals || null,
      notes: aiData.notes || null,
      confidence: apolloResult.email && apolloResult.confidence >= 80 ? 'high' : 
                  apolloResult.email && apolloResult.confidence >= 50 ? 'medium' : 
                  aiData.confidence || 'low',
      source: apolloResult.email ? 'apollo.io' : 'ai'
    };

    // Step 4: Update Supabase if we found useful data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData: Record<string, any> = {};

    if (enrichedData.email) {
      updateData.email = enrichedData.email;
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
        console.log(`Updated investor ${investorId} with:`, updateData);
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
