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

interface HunterResponse {
  data?: {
    email?: string;
    score?: number;
    domain?: string;
    first_name?: string;
    last_name?: string;
    position?: string;
    linkedin?: string;
    verification?: {
      status?: string;
    };
  };
  errors?: Array<{ details: string }>;
}

// Extract domain from company name/website
function extractDomain(azienda: string): string | null {
  const suffixes = [' S.p.A.', ' S.p.a.', ' SpA', ' SPA', ' S.r.l.', ' Srl', ' SRL', ' Ltd', ' Limited', ' GmbH', ' AG', ' Inc', ' Corp', ' LLC', ' SGR', ' SIM', ' S.A.'];
  let cleanName = azienda;
  
  for (const suffix of suffixes) {
    cleanName = cleanName.replace(new RegExp(suffix + '$', 'i'), '');
  }
  
  if (azienda.includes('.') && !azienda.includes(' ')) {
    return azienda.toLowerCase();
  }
  
  const domain = cleanName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    + '.com';
  
  return domain;
}

// Split full name into first and last name
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/[\s,]+/).filter(p => p.length > 0);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  // Handle "Surname, Name" format common in Italian
  if (fullName.includes(',')) {
    return { firstName: parts[1] || '', lastName: parts[0] || '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

// Scrape company website using Firecrawl to find email patterns
async function scrapeCompanyForEmails(azienda: string, nome: string): Promise<{ email: string | null; confidence: number }> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!FIRECRAWL_API_KEY) {
    console.log("FIRECRAWL_API_KEY not configured, skipping website scraping");
    return { email: null, confidence: 0 };
  }

  // Try common domain patterns for the company
  const domainPatterns = [
    extractDomain(azienda),
    azienda.toLowerCase().replace(/[^a-z0-9]/g, '') + '.it',
    azienda.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
  ].filter(Boolean);

  for (const domain of domainPatterns) {
    try {
      // Search for contact page
      const searchUrl = `https://${domain}/contatti`;
      console.log(`Firecrawl: Trying to scrape ${searchUrl}`);

      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `https://${domain}`,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
      });

      if (!response.ok) {
        console.log(`Firecrawl: Failed to scrape ${domain}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const content = data.data?.markdown || data.markdown || '';
      
      if (!content) continue;

      // Extract email patterns from content
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = content.match(emailRegex) || [];
      
      // Filter out generic emails
      const genericPatterns = ['info@', 'contact@', 'support@', 'noreply@', 'privacy@', 'legal@'];
      const personalEmails = foundEmails.filter(email => 
        !genericPatterns.some(pattern => email.toLowerCase().startsWith(pattern))
      );

      if (personalEmails.length > 0) {
        console.log(`Firecrawl: Found ${personalEmails.length} potential emails on ${domain}`);
        
        // Try to match with investor name
        const { firstName, lastName } = splitName(nome);
        const nameParts = [firstName.toLowerCase(), lastName.toLowerCase()].filter(p => p);
        
        for (const email of personalEmails) {
          const emailLower = email.toLowerCase();
          if (nameParts.some(part => emailLower.includes(part))) {
            console.log(`Firecrawl: Found matching email ${email} for ${nome}`);
            return { email, confidence: 70 };
          }
        }
        
        // If no name match, try to infer email pattern
        const domainEmails = personalEmails.filter(e => e.includes(domain!.replace('.com', '').replace('.it', '')));
        if (domainEmails.length > 0 && firstName && lastName) {
          // Common patterns: name.surname@, nsurname@, name_surname@
          const patterns = [
            `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
            `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${domain}`,
            `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
            `${lastName.toLowerCase()}.${firstName.toLowerCase()}@${domain}`,
          ];
          console.log(`Firecrawl: Inferring email patterns for ${nome}`);
          return { email: patterns[0], confidence: 50 };
        }
      }
    } catch (error) {
      console.error(`Firecrawl error for ${domain}:`, error);
    }
  }

  return { email: null, confidence: 0 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUNTER_API_KEY = Deno.env.get("HUNTER_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!HUNTER_API_KEY) {
      console.warn("HUNTER_API_KEY not configured, falling back to Firecrawl + AI");
    }

    const { investorId, nome, azienda, ruolo, categoria }: EnrichmentRequest = await req.json();

    console.log(`Enrichment for: ${nome} at ${azienda}`);

    let hunterEmail: string | null = null;
    let hunterLinkedin: string | null = null;
    let hunterConfidence: number = 0;

    // Step 1: Try Hunter.io for email lookup
    if (HUNTER_API_KEY) {
      const domain = extractDomain(azienda);
      const { firstName, lastName } = splitName(nome);

      if (domain && firstName && lastName) {
        console.log(`Hunter.io lookup: ${firstName} ${lastName} @ ${domain}`);
        
        try {
          const hunterUrl = new URL('https://api.hunter.io/v2/email-finder');
          hunterUrl.searchParams.set('domain', domain);
          hunterUrl.searchParams.set('first_name', firstName);
          hunterUrl.searchParams.set('last_name', lastName);
          hunterUrl.searchParams.set('api_key', HUNTER_API_KEY);

          const hunterResponse = await fetch(hunterUrl.toString());
          const hunterData: HunterResponse = await hunterResponse.json();

          if (hunterData.data?.email) {
            hunterEmail = hunterData.data.email;
            hunterConfidence = hunterData.data.score || 0;
            hunterLinkedin = hunterData.data.linkedin || null;
            console.log(`Hunter found email: ${hunterEmail} (score: ${hunterConfidence})`);
          } else if (hunterData.errors) {
            console.log(`Hunter error: ${hunterData.errors[0]?.details}`);
          }
        } catch (hunterError) {
          console.error("Hunter.io API error:", hunterError);
        }
      } else if (domain && firstName) {
        console.log(`Hunter: Skipping - need both first and last name (have: ${firstName})`);
      }
    }

    // Step 2: If Hunter didn't find email, try Firecrawl
    let firecrawlEmail: string | null = null;
    let firecrawlConfidence: number = 0;
    
    if (!hunterEmail) {
      console.log("Hunter did not find email, trying Firecrawl...");
      const firecrawlResult = await scrapeCompanyForEmails(azienda, nome);
      firecrawlEmail = firecrawlResult.email;
      firecrawlConfidence = firecrawlResult.confidence;
    }

    // Step 3: Use AI for additional enrichment (LinkedIn, bio, investment focus, etc.)
    let aiData: any = {};
    
    if (LOVABLE_API_KEY) {
      const systemPrompt = `You are a professional investor research assistant for private equity fundraising. 
Your task is to find and return structured information about an investor contact.

IMPORTANT: Return ONLY a valid JSON object with no additional text. Do not include markdown code blocks.

The JSON must have this exact structure:
{
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

Find their LinkedIn profile, professional background, investment preferences, and any relevant details.`;

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
              aiData = JSON.parse(cleanContent.trim());
              console.log("AI enrichment successful");
            } catch (parseError) {
              console.error("Failed to parse AI response:", parseError);
            }
          }
        } else if (response.status === 429) {
          console.log("AI rate limited, continuing with other data");
        } else if (response.status === 402) {
          console.log("AI credits exhausted, continuing with other data");
        }
      } catch (aiError) {
        console.error("AI enrichment error:", aiError);
      }
    }

    // Step 4: Combine results (Hunter > Firecrawl > AI priority for email)
    const finalEmail = hunterEmail || firecrawlEmail || null;
    const finalConfidence = hunterEmail ? hunterConfidence : firecrawlConfidence;
    
    const enrichedData = {
      email: finalEmail,
      emailConfidence: finalConfidence,
      emailSource: hunterEmail ? 'hunter.io' : firecrawlEmail ? 'firecrawl' : null,
      phone: null,
      linkedin: hunterLinkedin || aiData.linkedin || null,
      bio: aiData.bio || null,
      investmentFocus: aiData.investmentFocus || null,
      ticketSize: aiData.ticketSize || null,
      recentDeals: aiData.recentDeals || null,
      notes: aiData.notes || null,
      confidence: finalEmail && finalConfidence >= 80 ? 'high' : 
                  finalEmail && finalConfidence >= 50 ? 'medium' : 
                  aiData.confidence || 'low',
      source: hunterEmail ? 'hunter.io' : firecrawlEmail ? 'firecrawl' : 'ai'
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
