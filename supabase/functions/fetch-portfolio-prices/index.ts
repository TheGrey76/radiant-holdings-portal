import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceResult {
  isin: string;
  ticker?: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  source: string;
  error?: string;
}

// ETF ticker mappings for Yahoo Finance (Borsa Italiana / European exchanges)
const ETF_TICKER_MAP: Record<string, string> = {
  'IE00B4L5Y983': 'SWDA.MI',   // iShares Core MSCI World
  'IE00BP3QZ601': 'IWQU.MI',   // iShares MSCI World Quality Factor
  'IE00B3DKXQ41': 'IEAG.MI',   // iShares Core € Aggregate Bond
  'IE00B579F325': 'SGLD.MI',   // Invesco Physical Gold
  'LU0290358497': 'XEON.MI',   // Xtrackers EUR Overnight Rate
};

// Certificate ticker mappings (some may be available on Yahoo Finance)
const CERT_TICKER_MAP: Record<string, string> = {
  'XS3189071965': 'XS3189071965.MI',
  'XS3120925063': 'XS3120925063.MI',
  'DE000VJ1P3J8': 'DE000VJ1P3J8.MI',
  'CH1505566112': 'CH1505566112.MI',
  'CH1491786658': 'CH1491786658.MI',
  'XS3167626897': 'XS3167626897.MI',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { isins, type } = await req.json();
    
    if (!isins || !Array.isArray(isins)) {
      throw new Error('Invalid request: isins array required');
    }

    console.log(`Fetching ${type || 'portfolio'} prices for ${isins.length} instruments`);

    const results: PriceResult[] = [];
    const tickerMap = type === 'certificates' ? CERT_TICKER_MAP : ETF_TICKER_MAP;

    for (const isin of isins) {
      const ticker = tickerMap[isin];
      
      if (!ticker) {
        console.log(`No ticker mapping for ISIN: ${isin}`);
        results.push({
          isin,
          price: null,
          change: null,
          changePercent: null,
          currency: 'EUR',
          source: 'none',
          error: 'No ticker mapping'
        });
        continue;
      }

      try {
        const priceData = await fetchYahooPrice(ticker);
        
        if (priceData) {
          results.push({
            isin,
            ticker,
            price: priceData.price,
            change: priceData.change,
            changePercent: priceData.changePercent,
            currency: priceData.currency || 'EUR',
            source: 'yahoo'
          });
          console.log(`${isin} (${ticker}): €${priceData.price} (${priceData.changePercent?.toFixed(2)}%)`);
        } else {
          results.push({
            isin,
            ticker,
            price: null,
            change: null,
            changePercent: null,
            currency: 'EUR',
            source: 'yahoo',
            error: 'No price data available'
          });
          console.log(`${isin} (${ticker}): No data`);
        }

        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error fetching ${isin}:`, error.message);
        results.push({
          isin,
          ticker,
          price: null,
          change: null,
          changePercent: null,
          currency: 'EUR',
          source: 'yahoo',
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.price !== null).length;
    console.log(`Successfully fetched ${successCount}/${isins.length} prices`);

    return new Response(JSON.stringify({ 
      results,
      timestamp: new Date().toISOString(),
      successCount,
      totalCount: isins.length
    }), {
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

async function fetchYahooPrice(ticker: string): Promise<{
  price: number;
  change: number | null;
  changePercent: number | null;
  currency: string | null;
} | null> {
  try {
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
    const meta = data?.chart?.result?.[0]?.meta;
    
    if (!meta) {
      return null;
    }

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    const currency = meta.currency;
    
    if (!currentPrice || currentPrice <= 0) {
      return null;
    }

    let change = null;
    let changePercent = null;
    
    if (previousClose && previousClose > 0) {
      change = currentPrice - previousClose;
      changePercent = (change / previousClose) * 100;
    }

    return {
      price: currentPrice,
      change,
      changePercent,
      currency
    };
  } catch (error) {
    console.error(`Yahoo fetch error for ${ticker}:`, error.message);
    return null;
  }
}
