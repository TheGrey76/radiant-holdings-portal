import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProspLead {
  name: string;
  linkedinUrl: string;
}

interface ProspCampaign {
  campaign_id: string;
  campaign_name: string;
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

    const prospApiKey = Deno.env.get('PROSP_API_KEY');
    if (!prospApiKey) {
      console.error('PROSP_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Prosp.ai API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, campaignId } = await req.json();

    // Action: list-campaigns - Get all campaigns from Prosp.ai
    if (action === 'list-campaigns') {
      console.log('Fetching campaigns from Prosp.ai...');
      
      const campaignsResponse = await fetch('https://prosp.ai/api/v1/campaigns/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: prospApiKey }),
      });

      const campaignsData = await campaignsResponse.json();

      if (!campaignsResponse.ok) {
        console.error('Prosp.ai campaigns API error:', campaignsData);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch campaigns', details: campaignsData }),
          { status: campaignsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Found ${campaignsData.data?.length || 0} campaigns`);

      return new Response(
        JSON.stringify({ success: true, campaigns: campaignsData.data || [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: sync-from-prosp - Import leads from a campaign
    if (action === 'sync-from-prosp') {
      if (!campaignId) {
        return new Response(
          JSON.stringify({ error: 'Missing campaignId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Fetching leads from Prosp.ai campaign: ${campaignId}`);

      const leadsResponse = await fetch('https://prosp.ai/api/v1/campaigns/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: prospApiKey, campaign_id: campaignId }),
      });

      const leadsData = await leadsResponse.json();

      if (!leadsResponse.ok) {
        console.error('Prosp.ai leads API error:', leadsData);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch leads', details: leadsData }),
          { status: leadsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const prospLeads: ProspLead[] = leadsData.data || [];
      console.log(`Found ${prospLeads.length} leads in Prosp.ai campaign`);

      // Get existing investors from database
      const { data: existingInvestors, error: fetchError } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, linkedin, status');

      if (fetchError) {
        console.error('Error fetching existing investors:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch existing investors' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let newLeads = 0;
      let updatedLeads = 0;
      let skippedLeads = 0;

      for (const lead of prospLeads) {
        // Try to match by LinkedIn URL
        const linkedinUrl = lead.linkedinUrl?.toLowerCase().replace(/\/$/, '');
        
        const existingByLinkedIn = existingInvestors?.find(inv => 
          inv.linkedin?.toLowerCase().replace(/\/$/, '') === linkedinUrl
        );

        if (existingByLinkedIn) {
          // Update LinkedIn outreach status if needed
          const { data: existingOutreach } = await supabase
            .from('abc_linkedin_outreach')
            .select('id')
            .eq('investor_id', existingByLinkedIn.id)
            .eq('outreach_type', 'prosp_campaign')
            .limit(1);

          if (!existingOutreach || existingOutreach.length === 0) {
            // Create new outreach record for tracking
            await supabase.from('abc_linkedin_outreach').insert({
              investor_id: existingByLinkedIn.id,
              investor_name: `${existingByLinkedIn.nome} - ${existingByLinkedIn.azienda}`,
              linkedin_url: lead.linkedinUrl,
              status: 'pending',
              outreach_type: 'prosp_campaign',
              notes: `Imported from Prosp.ai campaign: ${campaignId}`,
            });
            updatedLeads++;
          } else {
            skippedLeads++;
          }
        } else {
          // New lead - try to parse name and create investor
          const nameParts = lead.name?.split(' ') || ['Unknown'];
          const nome = lead.name || 'Unknown';
          
          // Create new investor with minimal data
          const { error: insertError } = await supabase.from('abc_investors').insert({
            nome: nome,
            azienda: 'Da Prosp.ai',
            categoria: 'Altro',
            status: 'To Contact',
            linkedin: lead.linkedinUrl,
            fonte: 'Prosp.ai Sync',
            priorita: 'Media',
          });

          if (!insertError) {
            newLeads++;
            console.log(`Created new investor from Prosp: ${nome}`);
          } else {
            console.error(`Error creating investor: ${insertError.message}`);
          }
        }
      }

      // Log activity
      await supabase.from('abc_investor_activities').insert({
        investor_name: 'Sistema',
        activity_type: 'Prosp.ai Sync',
        activity_description: `Sincronizzati ${prospLeads.length} lead da Prosp.ai. Nuovi: ${newLeads}, Aggiornati: ${updatedLeads}, Già presenti: ${skippedLeads}`,
        created_by: claimsData.user.email || 'system',
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Sync completed',
          stats: {
            total: prospLeads.length,
            new: newLeads,
            updated: updatedLeads,
            skipped: skippedLeads,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: get-analytics - Get campaign analytics
    if (action === 'get-analytics') {
      if (!campaignId) {
        return new Response(
          JSON.stringify({ error: 'Missing campaignId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Fetching analytics for campaign: ${campaignId}`);

      // Get analytics for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (d: Date) => 
        `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

      const analyticsResponse = await fetch('https://prosp.ai/api/v1/campaigns/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: prospApiKey,
          campaign_id: campaignId,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        }),
      });

      const analyticsData = await analyticsResponse.json();

      if (!analyticsResponse.ok) {
        console.error('Prosp.ai analytics API error:', analyticsData);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch analytics', details: analyticsData }),
          { status: analyticsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Aggregate analytics data
      const analytics = analyticsData.data || [];
      const summary = {
        connection_requests: 0,
        connections_accepted: 0,
        messages_sent: 0,
        replies: 0,
      };

      for (const item of analytics) {
        if (item.action?.includes('connection') && item.action?.includes('request')) {
          summary.connection_requests += item.count || 0;
        }
        if (item.action?.includes('accept')) {
          summary.connections_accepted += item.count || 0;
        }
        if (item.action?.includes('message') && item.action?.includes('sent')) {
          summary.messages_sent += item.count || 0;
        }
        if (item.action?.includes('repl')) {
          summary.replies += item.count || 0;
        }
      }

      return new Response(
        JSON.stringify({ success: true, analytics: summary, raw: analytics }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: list-campaigns, sync-from-prosp, get-analytics' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in prosp-sync:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
