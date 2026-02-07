import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes DB cache

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check DB cache for each ticker
    const now = Date.now();
    const cachedResults: Record<string, any> = {};
    const uncachedTickers: string[] = [];

    const { data: cachedRows } = await supabase
      .from('swing_price_cache')
      .select('ticker, price_data, fetched_at')
      .in('ticker', tickers);

    for (const ticker of tickers) {
      const cached = cachedRows?.find((r: any) => r.ticker === ticker);
      if (cached) {
        const cachedAge = now - new Date(cached.fetched_at).getTime();
        if (cachedAge < CACHE_TTL_MS) {
          cachedResults[ticker] = cached.price_data;
        } else {
          uncachedTickers.push(ticker);
        }
      } else {
        uncachedTickers.push(ticker);
      }
    }

    let freshResults: Record<string, any> = {};

    if (uncachedTickers.length > 0) {
      const symbolsParam = uncachedTickers.join(',');
      console.log(`Fetching prices from Twelve Data for: ${symbolsParam}`);

      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbolsParam}&apikey=${TWELVE_DATA_API_KEY}`
      );
      const data = await response.json();

      console.log(`Twelve Data response status: ${response.status}, keys: ${JSON.stringify(Object.keys(data))}`);

      // Check for API-level error (rate limit, auth, etc.)
      if (data.code && data.message) {
        console.error(`Twelve Data API error: code=${data.code}, message=${data.message}`);
        // Return cached data even if stale, or empty
        for (const ticker of uncachedTickers) {
          const stale = cachedRows?.find((r: any) => r.ticker === ticker);
          if (stale) {
            freshResults[ticker] = stale.price_data;
            console.log(`Using stale cache for ${ticker}`);
          } else {
            freshResults[ticker] = { ticker, error: data.message || 'Rate limited', price: null };
          }
        }
      } else if (uncachedTickers.length === 1) {
        const ticker = uncachedTickers[0];
        if (data && !data.code && data.close) {
          const result = buildPriceResult(ticker, data);
          freshResults[ticker] = result;
          await upsertCache(supabase, ticker, result);
        } else {
          console.warn(`No valid data for ${ticker}: ${JSON.stringify(data).slice(0, 200)}`);
          freshResults[ticker] = { ticker, error: data?.message || 'No data', price: null };
        }
      } else {
        for (const ticker of uncachedTickers) {
          const tickerData = data[ticker];
          if (tickerData && !tickerData.code && tickerData.close) {
            const result = buildPriceResult(ticker, tickerData);
            freshResults[ticker] = result;
            await upsertCache(supabase, ticker, result);
          } else {
            console.warn(`No valid data for ${ticker}: ${JSON.stringify(tickerData)?.slice(0, 200)}`);
            // Try stale cache
            const stale = cachedRows?.find((r: any) => r.ticker === ticker);
            if (stale) {
              freshResults[ticker] = stale.price_data;
              console.log(`Using stale cache for ${ticker}`);
            } else {
              freshResults[ticker] = { ticker, error: tickerData?.message || 'No data', price: null };
            }
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

function buildPriceResult(ticker: string, data: any) {
  return {
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
}

async function upsertCache(supabase: any, ticker: string, priceData: any) {
  const { error } = await supabase
    .from('swing_price_cache')
    .upsert(
      { ticker, price_data: priceData, fetched_at: new Date().toISOString() },
      { onConflict: 'ticker' }
    );
  if (error) {
    console.error(`Cache upsert failed for ${ticker}:`, error.message);
  }
}
