import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory cache with 2-minute TTL
const priceCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 2 * 60 * 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tickers } = await req.json();

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return new Response(JSON.stringify({ error: 'tickers array required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
    if (!TWELVE_DATA_API_KEY) {
      throw new Error('TWELVE_DATA_API_KEY is not configured');
    }

    // Check cache for each ticker
    const now = Date.now();
    const cachedResults: Record<string, any> = {};
    const uncachedTickers: string[] = [];

    for (const ticker of tickers) {
      const cached = priceCache[ticker];
      if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
        cachedResults[ticker] = cached.data;
      } else {
        uncachedTickers.push(ticker);
      }
    }

    let freshResults: Record<string, any> = {};

    if (uncachedTickers.length > 0) {
      const symbolsParam = uncachedTickers.join(',');
      console.log(`Fetching prices for: ${symbolsParam}`);

      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbolsParam}&apikey=${TWELVE_DATA_API_KEY}`
      );
      const data = await response.json();

      // Handle single vs multiple symbols response
      if (uncachedTickers.length === 1) {
        const ticker = uncachedTickers[0];
        if (data && !data.code) {
          const result = {
            ticker: data.symbol || ticker,
            name: data.name || ticker,
            price: parseFloat(data.close) || null,
            open: parseFloat(data.open) || null,
            high: parseFloat(data.high) || null,
            low: parseFloat(data.low) || null,
            previous_close: parseFloat(data.previous_close) || null,
            change: parseFloat(data.change) || null,
            percent_change: parseFloat(data.percent_change) || null,
            volume: parseInt(data.volume) || null,
            exchange: data.exchange || null,
            currency: data.currency || 'USD',
          };
          freshResults[ticker] = result;
          priceCache[ticker] = { data: result, timestamp: now };
        } else {
          freshResults[ticker] = { ticker, error: data?.message || 'No data', price: null };
        }
      } else {
        // Multiple symbols returns an object keyed by symbol
        for (const ticker of uncachedTickers) {
          const tickerData = data[ticker];
          if (tickerData && !tickerData.code) {
            const result = {
              ticker: tickerData.symbol || ticker,
              name: tickerData.name || ticker,
              price: parseFloat(tickerData.close) || null,
              open: parseFloat(tickerData.open) || null,
              high: parseFloat(tickerData.high) || null,
              low: parseFloat(tickerData.low) || null,
              previous_close: parseFloat(tickerData.previous_close) || null,
              change: parseFloat(tickerData.change) || null,
              percent_change: parseFloat(tickerData.percent_change) || null,
              volume: parseInt(tickerData.volume) || null,
              exchange: tickerData.exchange || null,
              currency: tickerData.currency || 'USD',
            };
            freshResults[ticker] = result;
            priceCache[ticker] = { data: result, timestamp: now };
          } else {
            freshResults[ticker] = { ticker, error: tickerData?.message || 'No data', price: null };
          }
        }
      }
    }

    const allResults = { ...cachedResults, ...freshResults };

    return new Response(JSON.stringify({
      prices: allResults,
      timestamp: new Date().toISOString(),
      cached_count: Object.keys(cachedResults).length,
      fresh_count: Object.keys(freshResults).length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching swing prices:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      prices: {},
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
