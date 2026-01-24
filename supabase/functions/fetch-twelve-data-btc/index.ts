import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_24hr_change=true&include_last_updated_at=true'
      );
      const cg = await cgRes.json();
      const usd = cg?.bitcoin?.usd;
      const eur = cg?.bitcoin?.eur;
      const change24h = cg?.bitcoin?.usd_24h_change;
      const ts = cg?.bitcoin?.last_updated_at
        ? new Date(cg.bitcoin.last_updated_at * 1000).toISOString()
        : new Date().toISOString();

      if (typeof usd !== 'number' || typeof eur !== 'number') {
        throw new Error('CoinGecko fallback returned invalid data');
      }

      return {
        bitcoin_price_usd: usd,
        bitcoin_price_eur: eur,
        change_24h: typeof change24h === 'number' ? change24h : null,
        timestamp: ts,
        source: 'coingecko_fallback',
      };
    };

    // Fetch BTC/USD price from Twelve Data
    const btcUsdResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${TWELVE_DATA_API_KEY}`
    );
    const btcUsdData = await btcUsdResponse.json();
    console.log('BTC/USD response:', btcUsdData);

    // Twelve Data returns errors as JSON with a "code" field.
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

    const btcPriceUsd = parseFloat(btcUsdData.price);

    // Use CoinGecko for accurate EUR price (they have real BTC/EUR rate)
    let btcPriceEur = btcPriceUsd * 0.92; // Default fallback
    let change24h: number | null = null;

    try {
      const cgRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true'
      );
      const cg = await cgRes.json();
      
      if (cg?.bitcoin?.eur && typeof cg.bitcoin.eur === 'number') {
        btcPriceEur = cg.bitcoin.eur;
        console.log('Real BTC/EUR from CoinGecko:', btcPriceEur);
      }
      
      if (cg?.bitcoin?.eur_24h_change && typeof cg.bitcoin.eur_24h_change === 'number') {
        change24h = cg.bitcoin.eur_24h_change;
      }
    } catch (cgError) {
      console.error('Failed to fetch EUR price from CoinGecko, using estimate:', cgError);
    }

    const result = {
      bitcoin_price_usd: btcPriceUsd,
      bitcoin_price_eur: btcPriceEur,
      change_24h: change24h,
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
