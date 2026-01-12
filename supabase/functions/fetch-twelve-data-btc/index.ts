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

    const fetchFromCoinGecko = async () => {
      // No API key required
      const cgRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_last_updated_at=true'
      );
      const cg = await cgRes.json();
      const usd = cg?.bitcoin?.usd;
      const eur = cg?.bitcoin?.eur;
      const ts = cg?.bitcoin?.last_updated_at
        ? new Date(cg.bitcoin.last_updated_at * 1000).toISOString()
        : new Date().toISOString();

      if (typeof usd !== 'number' || typeof eur !== 'number') {
        throw new Error('CoinGecko fallback returned invalid data');
      }

      return {
        bitcoin_price_usd: usd,
        bitcoin_price_eur: eur,
        change_24h: null,
        timestamp: ts,
        source: 'coingecko_fallback',
      };
    };

    // Fetch BTC/USD price from Twelve Data (single call)
    const btcUsdResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${TWELVE_DATA_API_KEY}`
    );
    const btcUsdData = await btcUsdResponse.json();
    console.log('BTC/USD response:', btcUsdData);

    // Twelve Data returns errors as JSON with a "code" field.
    // On rate limit, prefer (1) cached data, (2) CoinGecko fallback, (3) graceful null response.
    if (btcUsdData?.code) {
      const message = btcUsdData?.message || btcUsdData?.code;

      if (cachedData) {
        console.log('Twelve Data error, returning stale cached data:', message);
        return new Response(JSON.stringify({ ...cachedData.data, cached: true, stale: true, rate_limited: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        console.log('Twelve Data error, using CoinGecko fallback:', message);
        const fallback = await fetchFromCoinGecko();
        cachedData = { data: fallback, timestamp: Date.now() };
        return new Response(JSON.stringify({ ...fallback, cached: true, fallback: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (fallbackErr) {
        console.error('CoinGecko fallback failed:', fallbackErr);
        // Graceful (non-500) response so the frontend doesn’t crash
        return new Response(
          JSON.stringify({
            bitcoin_price_usd: null,
            bitcoin_price_eur: null,
            change_24h: null,
            timestamp: new Date().toISOString(),
            source: 'unavailable',
            error: `Twelve Data API error: ${message}`,
            rate_limited: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    
    // Graceful (non-500) response so the frontend can show an error state without crashing
    return new Response(
      JSON.stringify({
        bitcoin_price_usd: null,
        bitcoin_price_eur: null,
        change_24h: null,
        source: 'unavailable',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
