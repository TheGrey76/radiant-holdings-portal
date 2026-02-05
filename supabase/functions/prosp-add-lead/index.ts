import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProspLeadRequest {
  investorId: string;
  linkedinUrl: string;
  campaignId: string;
  listId: string;
  investorName?: string;
  investorEmail?: string;
  investorCompany?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      console.error('Auth error:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { investorId, linkedinUrl, campaignId, listId, investorName, investorEmail, investorCompany } = await req.json() as ProspLeadRequest;

    // Validate required fields
    if (!linkedinUrl || !campaignId || !listId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: linkedinUrl, campaignId, listId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize and validate LinkedIn URL
    let normalizedLinkedinUrl = linkedinUrl.trim();
    
    // Remove trailing slashes
    normalizedLinkedinUrl = normalizedLinkedinUrl.replace(/\/+$/, '');
    
    // If it's just a username/path, add the full URL
    if (!normalizedLinkedinUrl.startsWith('http')) {
      // Check if it's a path like /in/username or in/username
      if (normalizedLinkedinUrl.startsWith('/in/') || normalizedLinkedinUrl.startsWith('in/')) {
        normalizedLinkedinUrl = 'https://www.linkedin.com' + (normalizedLinkedinUrl.startsWith('/') ? '' : '/') + normalizedLinkedinUrl;
      } else if (normalizedLinkedinUrl.startsWith('linkedin.com')) {
        normalizedLinkedinUrl = 'https://www.' + normalizedLinkedinUrl;
      } else if (normalizedLinkedinUrl.startsWith('www.linkedin.com')) {
        normalizedLinkedinUrl = 'https://' + normalizedLinkedinUrl;
      } else {
        // Assume it's just a username
        normalizedLinkedinUrl = 'https://www.linkedin.com/in/' + normalizedLinkedinUrl;
      }
    }
    
    // Ensure it's a valid LinkedIn URL
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?$/i;
    const isValidLinkedIn = linkedinPattern.test(normalizedLinkedinUrl) || 
                            normalizedLinkedinUrl.includes('linkedin.com/in/');
    
    if (!isValidLinkedIn) {
      console.error(`Invalid LinkedIn URL format: ${linkedinUrl} -> ${normalizedLinkedinUrl}`);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid LinkedIn URL format', 
          original: linkedinUrl,
          normalized: normalizedLinkedinUrl 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prospApiKey = Deno.env.get('PROSP_API_KEY');
    if (!prospApiKey) {
      console.error('PROSP_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Prosp.ai API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Adding lead to Prosp.ai:`);
    console.log(`  - Original LinkedIn URL: ${linkedinUrl}`);
    console.log(`  - Normalized LinkedIn URL: ${normalizedLinkedinUrl}`);
    console.log(`  - Name: ${investorName}`);
    console.log(`  - Company: ${investorCompany}`);
    console.log(`  - Campaign ID: ${campaignId}`);
    console.log(`  - List ID: ${listId}`);

    // Call Prosp.ai API to add lead
    // Build data array with custom properties (Prosp API uses "property" not "key")
    const dataArray: Array<{ property: string; value: string }> = [];
    if (investorEmail) {
      dataArray.push({ property: 'email', value: investorEmail });
    }
    if (investorName) {
      dataArray.push({ property: 'name', value: investorName });
    }
    if (investorCompany) {
      dataArray.push({ property: 'company', value: investorCompany });
    }

    const requestBody = {
      api_key: prospApiKey,
      campaign_id: campaignId,
      list_id: listId,
      linkedin_url: normalizedLinkedinUrl,
      data: dataArray,
    };
    
    console.log('Prosp.ai request body (without api_key):', JSON.stringify({ ...requestBody, api_key: '[REDACTED]' }, null, 2));

    const prospResponse = await fetch('https://prosp.ai/api/v1/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const prospData = await prospResponse.json();

    if (!prospResponse.ok) {
      console.error('Prosp.ai API error:', prospData);
      return new Response(
        JSON.stringify({ 
          error: 'Prosp.ai API error', 
          details: prospData.message || prospData.error || 'Unknown error',
          status: prospResponse.status
        }),
        { status: prospResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully added lead to Prosp.ai:`, prospData);

    // Log the activity in the database
    if (investorId) {
      const investorFullName = investorName || 'Unknown Investor';
      await supabase.from('abc_investor_activities').insert({
        investor_name: investorFullName,
        activity_type: 'LinkedIn Outreach',
        activity_description: `Added to Prosp.ai campaign for automated LinkedIn outreach`,
        created_by: claimsData.user.email || 'system',
      });

      // Create LinkedIn outreach record
      await supabase.from('abc_linkedin_outreach').insert({
        investor_id: investorId,
        investor_name: investorFullName,
        linkedin_url: linkedinUrl,
        status: 'pending',
        outreach_type: 'prosp_campaign',
        notes: `Sent to Prosp.ai campaign: ${campaignId}`,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead successfully added to Prosp.ai campaign',
        data: prospData 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in prosp-add-lead:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
