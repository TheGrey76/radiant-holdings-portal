import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DistributionRequest {
  title: string;
  url: string;
  excerpt?: string;
  platform: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { title, url, excerpt, platform }: DistributionRequest = await req.json();

    console.log('Distributing content:', { title, url, platform });

    // Get active webhook for the platform
    const { data: distributions, error: fetchError } = await supabase
      .from('content_distributions')
      .select('webhook_url')
      .eq('platform', platform)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (fetchError || !distributions) {
      console.error('No active webhook found for platform:', platform);
      return new Response(
        JSON.stringify({ error: 'No active webhook configured for this platform' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Prepare payload for Zapier
    const payload = {
      title,
      url,
      excerpt: excerpt || '',
      platform,
      timestamp: new Date().toISOString(),
      source: 'Aries76'
    };

    console.log('Sending to webhook:', distributions.webhook_url);

    // Send to Zapier webhook
    const webhookResponse = await fetch(distributions.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const status = webhookResponse.ok ? 'sent' : 'failed';

    // Log the distribution
    const { error: logError } = await supabase
      .from('distribution_logs')
      .insert({
        content_title: title,
        content_url: url,
        platform,
        status,
        metadata: {
          webhook_status: webhookResponse.status,
          response: webhookResponse.ok ? 'success' : await webhookResponse.text()
        }
      });

    if (logError) {
      console.error('Error logging distribution:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: webhookResponse.ok,
        status,
        message: webhookResponse.ok 
          ? 'Content distributed successfully' 
          : 'Failed to distribute content'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in distribute-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
