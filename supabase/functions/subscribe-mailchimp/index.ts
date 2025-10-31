import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: SubscribeRequest = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');

    console.log('Raw API Key length:', apiKey?.length);
    console.log('Raw Audience ID:', audienceId);

    if (!apiKey || !audienceId) {
      console.error('Missing Mailchimp credentials - API Key:', !!apiKey, 'Audience ID:', !!audienceId);
      return new Response(
        JSON.stringify({ error: 'Mailchimp configuration error - missing credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean the audience ID - remove any prefix like "id="
    let cleanAudienceId = audienceId.trim();
    if (cleanAudienceId.includes('=')) {
      cleanAudienceId = cleanAudienceId.split('=')[1];
    }
    
    console.log('Clean Audience ID:', cleanAudienceId);

    // Extract datacenter from API key (e.g., us11 from key-us11)
    const apiKeyParts = apiKey.trim().split('-');
    console.log('API Key parts:', apiKeyParts.length);
    
    const datacenter = apiKeyParts.length > 1 ? apiKeyParts[apiKeyParts.length - 1] : null;
    
    if (!datacenter) {
      console.error('Invalid API key format - API key parts:', apiKeyParts.length);
      return new Response(
        JSON.stringify({ error: 'Invalid Mailchimp API key format. Expected format: key-datacenter (e.g., abc123-us11)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${cleanAudienceId}/members`;

    console.log(`Mailchimp datacenter: ${datacenter}`);
    console.log(`Subscribing ${email} to Mailchimp audience ${cleanAudienceId}`);

    const memberData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        ...(firstName && { FNAME: firstName }),
        ...(lastName && { LNAME: lastName }),
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mailchimp API error:', data);
      
      // Check if already subscribed
      if (data.title === 'Member Exists') {
        return new Response(
          JSON.stringify({ message: 'Email already subscribed' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: data.detail || 'Failed to subscribe' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully subscribed to Mailchimp:', data);

    return new Response(
      JSON.stringify({ message: 'Successfully subscribed!', data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in subscribe-mailchimp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
