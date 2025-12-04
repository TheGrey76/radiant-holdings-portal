import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceResult {
  ticker: string;
  price: number | null;
  source?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');
    
    const { tickers } = await req.json();
    
    if (!tickers || !Array.isArray(tickers)) {
      throw new Error('Invalid request: tickers array required');
    }

    console.log(`Fetching prices for ${tickers.length} tickers`);

    const results: PriceResult[] = [];

    for (const ticker of tickers) {
      try {
        let price: number | null = null;
        let source = '';

        // Try Yahoo Finance first for all stocks
        price = await fetchYahooPrice(ticker);
        source = 'Yahoo';
        
        // Fallback to Finnhub for US stocks if Yahoo fails
        if (!price && FINNHUB_API_KEY && !ticker.includes('.')) {
          price = await fetchFinnhubPrice(ticker, FINNHUB_API_KEY);
          source = 'Finnhub';
        }

        if (price && price > 0) {
          results.push({ ticker, price, source });
          console.log(`${ticker} (${source}): ${price}`);
        } else {
          results.push({ ticker, price: null, error: 'No price data' });
          console.log(`${ticker}: No price data`);
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error.message);
        results.push({ ticker, price: null, error: error.message });
      }
    }

    const successCount = results.filter(r => r.price !== null).length;
    console.log(`Successfully fetched ${successCount}/${tickers.length} prices`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Fetch price from Finnhub (US stocks)
async function fetchFinnhubPrice(ticker: string, apiKey: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`
    );

    if (!response.ok) {
      console.log(`Finnhub error for ${ticker}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.c && data.c > 0 ? data.c : null;
  } catch (error) {
    console.error(`Finnhub fetch error for ${ticker}:`, error.message);
    return null;
  }
}

// Fetch price from Yahoo Finance (works for all markets)
async function fetchYahooPrice(ticker: string): Promise<number | null> {
  try {
    // Yahoo Finance uses the same ticker format for European stocks
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!response.ok) {
      console.log(`Yahoo error for ${ticker}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Try to get current market price
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    
    if (price && price > 0) {
      return price;
    }

    // Fallback to last close price
    const closePrice = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    if (closePrice && Array.isArray(closePrice)) {
      const lastPrice = closePrice.filter((p: number | null) => p !== null).pop();
      return lastPrice && lastPrice > 0 ? lastPrice : null;
    }

    return null;
  } catch (error) {
    console.error(`Yahoo fetch error for ${ticker}:`, error.message);
    return null;
  }
}
