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

// Clean company name for search
function cleanCompanyName(azienda: string): string {
  const suffixes = [' S.p.A.', ' S.p.a.', ' SpA', ' SPA', ' S.r.l.', ' Srl', ' SRL', ' Ltd', ' Limited', ' GmbH', ' AG', ' Inc', ' Corp', ' LLC', ' SGR', ' SIM', ' S.A.', ' Private Banking', ' Asset Management'];
  let cleanName = azienda;
  
  for (const suffix of suffixes) {
    cleanName = cleanName.replace(new RegExp(suffix + '$', 'i'), '');
  }
  return cleanName.trim();
}

// Extract domain from company name
function extractDomain(azienda: string): string | null {
  const cleaned = cleanCompanyName(azienda).toLowerCase();
  const commonWords = ['banca', 'bank', 'gruppo', 'group', 'capital', 'asset', 'management', 'investment', 'investments', 'partners'];
  
  let domain = cleaned
    .replace(/[^a-z0-9]/g, '')
    .replace(new RegExp(commonWords.join('|'), 'g'), '');
  
  if (domain.length < 3) {
    domain = cleaned.replace(/[^a-z0-9]/g, '');
  }
  
  return domain.length >= 3 ? domain : null;
}

// Apollo.io People Search
async function searchApolloForPerson(
  nome: string, 
  azienda: string, 
  ruolo?: string
): Promise<{ email: string | null; linkedin: string | null; confidence: number; rateLimited: boolean }> {
  const APOLLO_API_KEY = Deno.env.get("APOLLO_API_KEY");
  
  if (!APOLLO_API_KEY) {
    console.log("APOLLO_API_KEY not configured");
    return { email: null, linkedin: null, confidence: 0, rateLimited: false };
  }

  const { firstName, lastName } = splitName(nome);
  const cleanedCompany = cleanCompanyName(azienda);

  console.log(`Apollo search: ${firstName} ${lastName} at ${cleanedCompany}`);

  try {
    const response = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': APOLLO_API_KEY,
      },
      body: JSON.stringify({
        person_titles: ruolo ? [ruolo] : undefined,
        q_keywords: `${firstName} ${lastName}`.trim(),
        organization_names: [cleanedCompany, azienda],
        per_page: 5,
        page: 1,
      }),
    });

    if (response.status === 429) {
      console.log("Apollo rate limited (429), will use Hunter fallback");
      return { email: null, linkedin: null, confidence: 0, rateLimited: true };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Apollo API error: ${response.status} - ${errorText}`);
      return { email: null, linkedin: null, confidence: 0, rateLimited: response.status === 429 };
    }

    const data = await response.json();

    if (data.people && data.people.length > 0) {
      const bestMatch = data.people.find((p: any) => {
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
          rateLimited: false,
        };
      }
    }

    console.log("Apollo: No matches found");
    return { email: null, linkedin: null, confidence: 0, rateLimited: false };

  } catch (error) {
    console.error("Apollo API error:", error);
    return { email: null, linkedin: null, confidence: 0, rateLimited: false };
  }
}

// Hunter.io Email Finder - Fallback
async function searchHunterForEmail(
  nome: string,
  azienda: string
): Promise<{ email: string | null; confidence: number }> {
  const HUNTER_API_KEY = Deno.env.get("HUNTER_API_KEY");
  
  if (!HUNTER_API_KEY) {
    console.log("HUNTER_API_KEY not configured");
    return { email: null, confidence: 0 };
  }

  const { firstName, lastName } = splitName(nome);
  const domain = extractDomain(azienda);
  
  if (!domain) {
    console.log("Could not extract domain for Hunter search");
    return { email: null, confidence: 0 };
  }

  // Try common Italian domain patterns
  const domainsToTry = [
    `${domain}.it`,
    `${domain}.com`,
    `${domain}group.it`,
    `${domain}group.com`,
  ];

  console.log(`Hunter search: ${firstName} ${lastName}, trying domains: ${domainsToTry.join(', ')}`);

  for (const tryDomain of domainsToTry) {
    try {
      const url = new URL('https://api.hunter.io/v2/email-finder');
      url.searchParams.set('domain', tryDomain);
      url.searchParams.set('first_name', firstName);
      url.searchParams.set('last_name', lastName);
      url.searchParams.set('api_key', HUNTER_API_KEY);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      
      if (data.data?.email) {
        console.log(`Hunter found: ${data.data.email} (confidence: ${data.data.score})`);
        return {
          email: data.data.email,
          confidence: data.data.score || 70,
        };
      }
    } catch (error) {
      console.error(`Hunter error for ${tryDomain}:`, error);
    }
  }

  console.log("Hunter: No email found");
  return { email: null, confidence: 0 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    const { investorId, nome, azienda, ruolo, categoria }: EnrichmentRequest = await req.json();

    console.log(`Enrichment for: ${nome} at ${azienda}`);

    // Step 1: Try Apollo.io first (best for B2B)
    const apolloResult = await searchApolloForPerson(nome, azienda, ruolo);

    let email = apolloResult.email;
    let linkedin = apolloResult.linkedin;
    let emailSource = apolloResult.email ? 'apollo.io' : null;
    let emailConfidence = apolloResult.confidence;

    // Step 2: If Apollo failed or rate limited, try Hunter.io
    if (!email && (apolloResult.rateLimited || apolloResult.confidence === 0)) {
      console.log("Trying Hunter.io fallback...");
      const hunterResult = await searchHunterForEmail(nome, azienda);
      if (hunterResult.email) {
        email = hunterResult.email;
        emailSource = 'hunter.io';
        emailConfidence = hunterResult.confidence;
      }
    }

    // Step 3: Use AI for additional context (bio, investment focus, etc.)
    let aiData: any = {};
    
    if (LOVABLE_API_KEY) {
      const systemPrompt = `You are a professional investor research assistant for private equity fundraising. 
Your task is to provide structured information about an investor contact.

CRITICAL RULES:
1. DO NOT invent or guess LinkedIn profile URLs - leave linkedin as null
2. Only provide information you are confident about
3. Return ONLY a valid JSON object with no additional text

The JSON must have this exact structure:
{
  "bio": "Brief professional bio (max 100 words) or null",
  "investmentFocus": ["array", "of", "focus", "areas"] or null,
  "ticketSize": "typical investment range or null",
  "recentDeals": ["array of recent investments/deals"] or null,
  "notes": "any relevant notes for fundraising approach or null",
  "confidence": "high/medium/low based on data quality"
}`;

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
          console.log("AI rate limited, continuing with contact data only");
        } else if (response.status === 402) {
          console.log("AI credits exhausted, continuing with contact data only");
        }
      } catch (aiError) {
        console.error("AI enrichment error:", aiError);
      }
    }

    // Step 4: Combine results
    const enrichedData = {
      email,
      emailConfidence,
      emailSource,
      phone: null,
      linkedin,
      bio: aiData.bio || null,
      investmentFocus: aiData.investmentFocus || null,
      ticketSize: aiData.ticketSize || null,
      recentDeals: aiData.recentDeals || null,
      notes: aiData.notes || null,
      confidence: email && emailConfidence >= 80 ? 'high' : 
                  email && emailConfidence >= 50 ? 'medium' : 
                  aiData.confidence || 'low',
      source: emailSource || 'ai'
    };

    // Step 5: Update Supabase if we found useful data
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
