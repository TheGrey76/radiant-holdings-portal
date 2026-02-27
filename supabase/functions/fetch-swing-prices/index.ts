import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes for quotes
const WEEKLY_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes for weekly ranges

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
    let apiCreditsUsed = 0;

    if (uncachedTickers.length > 0) {
      const symbolsParam = uncachedTickers.join(',');
      console.log(`Fetching prices from Twelve Data for: ${symbolsParam}`);

      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbolsParam}&apikey=${TWELVE_DATA_API_KEY}`
      );
      const data = await response.json();
      apiCreditsUsed += uncachedTickers.length;

      console.log(`Twelve Data response status: ${response.status}, keys: ${JSON.stringify(Object.keys(data))}`);

      if (data.code && data.message) {
        console.error(`Twelve Data API error: code=${data.code}, message=${data.message}`);
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

    // Fetch weekly ranges — use separate cache with longer TTL
    const weekStart = getWeekMonday();
    const weekCacheKey = `week_${weekStart}`;

    // Check which tickers already have cached weekly data
    const tickersNeedingWeekly: string[] = [];
    for (const ticker of tickers) {
      const result = allResults[ticker];
      if (result && result._week_cache_key === weekCacheKey) {
        // Already has valid weekly data from cache
        continue;
      }
      tickersNeedingWeekly.push(ticker);
    }

    // Check DB for cached weekly ranges
    const { data: weeklyCachedRows } = await supabase
      .from('swing_price_cache')
      .select('ticker, price_data, fetched_at')
      .in('ticker', tickers);

    // Find tickers that need fresh weekly data
    const tickersToFetchWeekly: string[] = [];
    for (const ticker of tickersNeedingWeekly) {
      const cached = weeklyCachedRows?.find((r: any) => r.ticker === ticker);
      if (cached?.price_data?.week_high != null && cached?.price_data?._week_cache_key === weekCacheKey) {
        const cachedAge = now - new Date(cached.fetched_at).getTime();
        if (cachedAge < WEEKLY_CACHE_TTL_MS) {
          // Use cached weekly data
          if (allResults[ticker]) {
            allResults[ticker].week_high = cached.price_data.week_high;
            allResults[ticker].week_low = cached.price_data.week_low;
            allResults[ticker].week_start = weekStart;
          }
          continue;
        }
      }
      tickersToFetchWeekly.push(ticker);
    }

    // Fetch weekly ranges one at a time, respecting rate limits
    // Max 2 per invocation to stay under 8 credits/min (quote already used some)
    const maxWeeklyFetches = Math.max(0, 8 - apiCreditsUsed - 1);
    const tickersToFetch = tickersToFetchWeekly.slice(0, maxWeeklyFetches);

    if (tickersToFetch.length > 0) {
      console.log(`Fetching weekly ranges for: ${tickersToFetch.join(',')}`);
      for (const ticker of tickersToFetch) {
        try {
          const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&start_date=${weekStart}&apikey=${TWELVE_DATA_API_KEY}`;
          const resp = await fetch(url);
          const data = await resp.json();

          if (data.values && Array.isArray(data.values) && data.values.length > 0) {
            let weekHigh = -Infinity;
            let weekLow = Infinity;
            for (const bar of data.values) {
              const h = parseFloat(bar.high);
              const l = parseFloat(bar.low);
              if (!isNaN(h) && h > weekHigh) weekHigh = h;
              if (!isNaN(l) && l < weekLow) weekLow = l;
            }
            if (weekHigh !== -Infinity && weekLow !== Infinity) {
              if (allResults[ticker]) {
                allResults[ticker].week_high = weekHigh;
                allResults[ticker].week_low = weekLow;
                allResults[ticker].week_start = weekStart;
                allResults[ticker]._week_cache_key = weekCacheKey;
                // Update cache with weekly data
                await upsertCache(supabase, ticker, allResults[ticker]);
              }
            }
          } else if (data.code) {
            console.warn(`Weekly range API error for ${ticker}: ${data.message}`);
            break; // Stop if rate limited
          }
        } catch (e) {
          console.warn(`Weekly range fetch failed for ${ticker}:`, e);
        }
      }
    }

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

function getWeekMonday(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  const yyyy = monday.getUTCFullYear();
  const mm = String(monday.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(monday.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
