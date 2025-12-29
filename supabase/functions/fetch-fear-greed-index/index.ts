import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching Fear & Greed Index from Alternative.me...');
    
    // Fetch current value and last 7 days for trend
    const response = await fetch('https://api.alternative.me/fng/?limit=7');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fear & Greed data received:', JSON.stringify(data));
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No data received from API');
    }
    
    const current = data.data[0];
    const history = data.data;
    
    // Calculate 7-day trend
    const currentValue = parseInt(current.value);
    const oldestValue = parseInt(history[history.length - 1]?.value || current.value);
    const trend = currentValue - oldestValue;
    
    const result = {
      value: currentValue,
      classification: current.value_classification,
      timestamp: new Date(parseInt(current.timestamp) * 1000).toISOString(),
      trend: trend,
      trendDirection: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
      history: history.map((item: any) => ({
        value: parseInt(item.value),
        classification: item.value_classification,
        date: new Date(parseInt(item.timestamp) * 1000).toISOString()
      }))
    };
    
    console.log('Processed Fear & Greed result:', JSON.stringify(result));
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
