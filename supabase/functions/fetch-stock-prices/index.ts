import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping of our ticker symbols to Finnhub symbols
const TICKER_MAPPING: Record<string, string> = {
  // Certificate A - Morgan Stanley Phoenix
  'ENEL.MI': 'ENEL.MI',
  'GOOGL': 'GOOGL',
  'UCG.MI': 'UCG.MI',
  
  // Certificate B - UBS Phoenix Healthcare
  'NVO': 'NVO',
  'MRK.DE': 'MRK.DE',
  'CVS': 'CVS',
  
  // Certificate C - UBS Memory Cash Collect (Italian Large Caps)
  'ISP.MI': 'ISP.MI',
  'ENI.MI': 'ENI.MI',
  'STM.MI': 'STMMI.MI',
  
  // Certificate D - Barclays Phoenix Italy Consumer & Luxury
  'RACE.MI': 'RACE.MI',
  'BC.MI': 'BC.MI',
  'CPR.MI': 'CPR.MI',
};

interface PriceResult {
  ticker: string;
  price: number | null;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY is not set');
    }

    const { tickers } = await req.json();
    
    if (!tickers || !Array.isArray(tickers)) {
      throw new Error('Invalid request: tickers array required');
    }

    console.log(`Fetching prices for ${tickers.length} tickers`);

    const results: PriceResult[] = [];

    // Fetch prices for each ticker
    for (const ticker of tickers) {
      try {
        const finnhubTicker = TICKER_MAPPING[ticker] || ticker;
        
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(finnhubTicker)}&token=${FINNHUB_API_KEY}`
        );

        if (!response.ok) {
          console.error(`Finnhub error for ${ticker}: ${response.status}`);
          results.push({ ticker, price: null, error: `HTTP ${response.status}` });
          continue;
        }

        const data = await response.json();
        
        // Finnhub returns { c: currentPrice, h: high, l: low, o: open, pc: previousClose, t: timestamp }
        if (data.c && data.c > 0) {
          results.push({ ticker, price: data.c });
          console.log(`${ticker}: ${data.c}`);
        } else {
          // Try Yahoo Finance as fallback for European stocks
          const yahooPrice = await fetchYahooPrice(ticker);
          if (yahooPrice) {
            results.push({ ticker, price: yahooPrice });
            console.log(`${ticker} (Yahoo): ${yahooPrice}`);
          } else {
            results.push({ ticker, price: null, error: 'No price data' });
          }
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error);
        results.push({ ticker, price: null, error: error.message });
      }
    }

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

// Fallback to Yahoo Finance for European stocks
async function fetchYahooPrice(ticker: string): Promise<number | null> {
  try {
    // Yahoo uses different suffixes
    let yahooTicker = ticker;
    if (ticker.endsWith('.MI')) {
      yahooTicker = ticker; // Yahoo uses .MI for Milan
    } else if (ticker.endsWith('.DE')) {
      yahooTicker = ticker; // Yahoo uses .DE for Xetra
    }

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=1d`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    
    return price && price > 0 ? price : null;
  } catch {
    return null;
  }
}
