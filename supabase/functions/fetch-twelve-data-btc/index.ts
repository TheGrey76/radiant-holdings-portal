import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache with 5-minute TTL
let cachedData: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache first
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL_MS) {
      console.log('Returning cached Bitcoin price data');
      return new Response(JSON.stringify({ ...cachedData.data, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
    if (!TWELVE_DATA_API_KEY) {
      throw new Error('TWELVE_DATA_API_KEY is not configured');
    }

    console.log('Fetching Bitcoin price from Twelve Data...');

    // Fetch BTC/USD price only (reduce API calls from 3 to 1)
    const btcUsdResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${TWELVE_DATA_API_KEY}`
    );
    const btcUsdData = await btcUsdResponse.json();
    console.log('BTC/USD response:', btcUsdData);

    if (btcUsdData.code) {
      // If rate limited but we have cached data, return it
      if (cachedData) {
        console.log('Rate limited, returning stale cached data');
        return new Response(JSON.stringify({ ...cachedData.data, cached: true, stale: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Twelve Data API error: ${btcUsdData.message || btcUsdData.code}`);
    }

    // Estimate EUR price (approximate conversion rate)
    const btcPriceUsd = parseFloat(btcUsdData.price);
    const estimatedEurPrice = btcPriceUsd * 0.92; // Approximate USD to EUR

    const result = {
      bitcoin_price_usd: btcPriceUsd,
      bitcoin_price_eur: estimatedEurPrice,
      change_24h: null, // Skip 24h change to reduce API calls
      timestamp: new Date().toISOString(),
      source: 'twelve_data'
    };

    // Update cache
    cachedData = { data: result, timestamp: Date.now() };
    console.log('Returning fresh result and caching:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching Twelve Data:', error);
    
    // Return cached data on error if available
    if (cachedData) {
      console.log('Error occurred, returning stale cached data');
      return new Response(JSON.stringify({ ...cachedData.data, cached: true, stale: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
