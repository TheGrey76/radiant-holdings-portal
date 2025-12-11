import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailSearchRequest {
  firstName: string;
  lastName: string;
  company: string;
  investorId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hunterApiKey = Deno.env.get("HUNTER_API_KEY");
    if (!hunterApiKey) {
      throw new Error("HUNTER_API_KEY not configured");
    }

    const { firstName, lastName, company, investorId }: EmailSearchRequest = await req.json();
    
    console.log(`Searching email for: ${firstName} ${lastName} at ${company}`);

    // Try to extract domain from company name or search for it
    let domain = "";
    
    // First, try to find the company domain using Hunter's Domain Search
    const domainSearchUrl = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(company)}&api_key=${hunterApiKey}`;
    const domainResponse = await fetch(domainSearchUrl);
    const domainData = await domainResponse.json();
    
    if (domainData.data?.domain) {
      domain = domainData.data.domain;
      console.log(`Found domain for ${company}: ${domain}`);
    }

    let emailResult = null;
    let confidence = 0;

    if (domain) {
      // Use Email Finder API with the domain
      const emailFinderUrl = `https://api.hunter.io/v2/email-finder?domain=${encodeURIComponent(domain)}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&api_key=${hunterApiKey}`;
      const emailResponse = await fetch(emailFinderUrl);
      const emailData = await emailResponse.json();
      
      console.log("Email finder response:", JSON.stringify(emailData));

      if (emailData.data?.email) {
        emailResult = emailData.data.email;
        confidence = emailData.data.score || 0;
      }
    }

    // If no email found with domain, try email verifier with common patterns
    if (!emailResult) {
      // Generate common email patterns
      const patterns = [
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}`,
      ];
      
      // Try common domains if we couldn't find company domain
      const commonDomains = domain ? [domain] : ['gmail.com', 'outlook.com', 'yahoo.com'];
      
      for (const pattern of patterns) {
        for (const testDomain of commonDomains) {
          const testEmail = `${pattern}@${testDomain}`;
          const verifyUrl = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(testEmail)}&api_key=${hunterApiKey}`;
          const verifyResponse = await fetch(verifyUrl);
          const verifyData = await verifyResponse.json();
          
          if (verifyData.data?.status === 'valid' || verifyData.data?.score >= 50) {
            emailResult = testEmail;
            confidence = verifyData.data.score || 50;
            break;
          }
        }
        if (emailResult) break;
      }
    }

    // If we found an email and have an investorId, update the database
    if (emailResult && investorId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: updateError } = await supabase
        .from("abc_investors")
        .update({ email: emailResult })
        .eq("id", investorId);

      if (updateError) {
        console.error("Error updating investor email:", updateError);
      } else {
        console.log(`Updated investor ${investorId} with email ${emailResult}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        email: emailResult,
        confidence,
        domain,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in search-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
