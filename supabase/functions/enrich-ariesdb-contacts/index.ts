import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactToEnrich {
  id: string;
  name: string;
  company: string;
  email?: string;
}

interface EnrichmentResult {
  email?: string;
  phone?: string;
  linkedin_url?: string;
  title?: string;
  company?: string;
  location?: string;
  source: string;
}

// Parse Italian-style name "Cognome, Nome" or "Nome Cognome"
function parseName(name: string): { firstName: string; lastName: string } {
  if (!name) return { firstName: "", lastName: "" };
  if (name.includes(",")) {
    const [last, first] = name.split(",").map((s) => s.trim());
    return { firstName: first || "", lastName: last || "" };
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

// Clean company name for better matching
function cleanCompany(company: string): string {
  return company
    .replace(/\b(s\.?p\.?a\.?|s\.?r\.?l\.?|ltd\.?|inc\.?|gmbh|llc|plc)\b/gi, "")
    .replace(/[,\-–]+$/, "")
    .trim();
}

async function enrichViaApollo(
  contact: ContactToEnrich,
  apiKey: string
): Promise<EnrichmentResult | null> {
  const { firstName, lastName } = parseName(contact.name);
  const company = cleanCompany(contact.company || "");

  if (!lastName && !contact.email) return null;

  try {
    const body: Record<string, unknown> = {};
    if (contact.email) {
      body.email = contact.email;
    } else {
      body.first_name = firstName;
      body.last_name = lastName;
      if (company) body.organization_name = company;
    }

    const res = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        ...body,
        page: 1,
        per_page: 1,
      }),
    });

    if (!res.ok) {
      console.error(`Apollo API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const person = data?.people?.[0];
    if (!person) return null;

    // Validate match quality
    const nameMatch =
      person.first_name?.toLowerCase() === firstName.toLowerCase() &&
      person.last_name?.toLowerCase() === lastName.toLowerCase();

    const looseMatch =
      person.last_name?.toLowerCase() === lastName.toLowerCase() &&
      person.organization?.name?.toLowerCase().includes(company.toLowerCase());

    return {
      email: person.email || undefined,
      phone: person.phone_numbers?.[0]?.number || undefined,
      // Only set LinkedIn for strict matches
      linkedin_url: nameMatch ? person.linkedin_url || undefined : undefined,
      title: person.title || undefined,
      company: person.organization?.name || undefined,
      location: [person.city, person.country].filter(Boolean).join(", ") || undefined,
      source: nameMatch ? "apollo_strict" : looseMatch ? "apollo_loose" : "apollo_partial",
    };
  } catch (err) {
    console.error("Apollo enrichment error:", err);
    return null;
  }
}

async function enrichViaHunter(
  contact: ContactToEnrich,
  apiKey: string
): Promise<EnrichmentResult | null> {
  const { firstName, lastName } = parseName(contact.name);
  const company = cleanCompany(contact.company || "");

  if (!lastName || !company) return null;

  try {
    const params = new URLSearchParams({
      first_name: firstName,
      last_name: lastName,
      company: company,
      api_key: apiKey,
    });

    const res = await fetch(
      `https://api.hunter.io/v2/email-finder?${params.toString()}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.data;
    if (!result?.email) return null;

    return {
      email: result.email,
      phone: undefined,
      linkedin_url: result.linkedin_url || undefined,
      title: result.position || undefined,
      company: result.company || undefined,
      location: undefined,
      source: "hunter",
    };
  } catch (err) {
    console.error("Hunter enrichment error:", err);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const apolloKey = Deno.env.get("APOLLO_API_KEY");
    const hunterKey = Deno.env.get("HUNTER_API_KEY");

    if (!apolloKey && !hunterKey) {
      return new Response(
        JSON.stringify({ error: "No enrichment API keys configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { contact_ids, batch_size = 10 } = await req.json();

    // Get contacts to enrich
    let query = supabase
      .from("ariesdb_contacts")
      .select("id, name, company, email, enriched_email")
      .eq("enrichment_status", "pending");

    if (contact_ids?.length) {
      query = query.in("id", contact_ids);
    }

    const { data: contacts, error: fetchErr } = await query.limit(batch_size);

    if (fetchErr) throw fetchErr;
    if (!contacts?.length) {
      return new Response(
        JSON.stringify({ enriched: 0, message: "No contacts to enrich" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let enrichedCount = 0;

    for (const contact of contacts) {
      let result: EnrichmentResult | null = null;

      // Try Apollo first
      if (apolloKey) {
        result = await enrichViaApollo(contact, apolloKey);
      }

      // Fallback to Hunter if no email found
      if (!result?.email && hunterKey) {
        const hunterResult = await enrichViaHunter(contact, hunterKey);
        if (hunterResult) {
          result = result
            ? { ...result, email: hunterResult.email, source: `${result.source}+hunter` }
            : hunterResult;
        }
      }

      if (result) {
        const updateData: Record<string, unknown> = {
          enrichment_status: "enriched",
          enriched_at: new Date().toISOString(),
          enrichment_source: result.source,
        };

        if (result.email) updateData.enriched_email = result.email;
        if (result.phone) updateData.enriched_phone = result.phone;
        if (result.linkedin_url) updateData.enriched_linkedin_url = result.linkedin_url;
        if (result.title) updateData.enriched_title = result.title;
        if (result.company) updateData.enriched_company = result.company;
        if (result.location) updateData.enriched_location = result.location;

        await supabase.from("ariesdb_contacts").update(updateData).eq("id", contact.id);
        enrichedCount++;
      } else {
        await supabase
          .from("ariesdb_contacts")
          .update({ enrichment_status: "not_found", enriched_at: new Date().toISOString() })
          .eq("id", contact.id);
      }

      // Rate limiting: 200ms between requests
      await new Promise((r) => setTimeout(r, 200));
    }

    return new Response(
      JSON.stringify({ enriched: enrichedCount, total: contacts.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Enrichment error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
