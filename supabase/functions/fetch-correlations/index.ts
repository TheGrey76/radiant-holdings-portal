import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for correlation data (15 minutes)
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface PriceData {
  date: string;
  close: number;
}

// Calculate Pearson correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 5) return 0;

  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const meanX = xSlice.reduce((a, b) => a + b, 0) / n;
  const meanY = ySlice.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = xSlice[i] - meanX;
    const diffY = ySlice[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  return numerator / denominator;
}

// Calculate daily returns from prices
function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] !== 0) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
  }
  return returns;
}

// Fetch historical data from TwelveData
async function fetchTwelveData(symbol: string, outputSize: number = 365): Promise<PriceData[]> {
  const apiKey = Deno.env.get('TWELVE_DATA_API_KEY');
  if (!apiKey) {
    console.log(`No TwelveData API key, using fallback for ${symbol}`);
    return [];
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=${outputSize}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error' || !data.values) {
      console.log(`TwelveData error for ${symbol}:`, data.message);
      return [];
    }

    return data.values.map((v: any) => ({
      date: v.datetime,
      close: parseFloat(v.close)
    })).reverse(); // Oldest first
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return [];
  }
}

// Fetch FRED data for macro indicators
async function fetchFredData(seriesId: string): Promise<PriceData[]> {
  const apiKey = Deno.env.get('FRED_API_KEY');
  if (!apiKey) {
    console.log(`No FRED API key, using fallback for ${seriesId}`);
    return [];
  }

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&observation_end=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.observations) {
      console.log(`FRED error for ${seriesId}`);
      return [];
    }

    return data.observations
      .filter((o: any) => o.value !== '.')
      .map((o: any) => ({
        date: o.date,
        close: parseFloat(o.value)
      }));
  } catch (error) {
    console.error(`Error fetching FRED ${seriesId}:`, error);
    return [];
  }
}

// Generate realistic fallback correlations based on historical patterns
function generateFallbackCorrelations() {
  return {
    correlations: [
      {
        asset: "SPX",
        label: "S&P 500",
        values: { "30d": 0.42, "90d": 0.38, "1y": 0.31 },
        trend: "stable",
        interpretation: "Moderate positive correlation with equities, trending lower as Bitcoin matures as an asset class."
      },
      {
        asset: "GOLD",
        label: "Gold (XAU)",
        values: { "30d": 0.18, "90d": 0.22, "1y": 0.15 },
        trend: "up",
        interpretation: "Low but increasing correlation with gold, supporting the 'digital gold' thesis."
      },
      {
        asset: "DXY",
        label: "US Dollar Index",
        values: { "30d": -0.35, "90d": -0.41, "1y": -0.38 },
        trend: "stable",
        interpretation: "Inverse correlation with USD strength - weaker dollar tends to support Bitcoin."
      },
      {
        asset: "TNX",
        label: "10Y Treasury Yield",
        values: { "30d": -0.28, "90d": -0.31, "1y": -0.25 },
        trend: "down",
        interpretation: "Negative correlation with yields - lower rates favor risk assets like Bitcoin."
      },
      {
        asset: "M2",
        label: "M2 Money Supply",
        values: { "30d": 0.52, "90d": 0.58, "1y": 0.61 },
        trend: "up",
        interpretation: "Strong correlation with liquidity expansion - key driver for Bitcoin price."
      }
    ],
    lastUpdated: new Date().toISOString(),
    dataSource: "fallback"
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached correlation data');
      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching fresh correlation data...');

    // Fetch Bitcoin data
    const btcData = await fetchTwelveData('BTC/USD', 400);
    
    if (btcData.length < 30) {
      console.log('Insufficient BTC data, using fallback');
      const fallback = generateFallbackCorrelations();
      cachedData = fallback;
      cacheTimestamp = now;
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch comparison assets
    const [spxData, goldData, dxyData] = await Promise.all([
      fetchTwelveData('SPY', 400), // S&P 500 ETF as proxy
      fetchTwelveData('XAU/USD', 400),
      fetchTwelveData('DXY', 400)
    ]);

    // Fetch FRED data for M2 and 10Y yield
    const [m2Data, tnxData] = await Promise.all([
      fetchFredData('WM2NS'), // Weekly M2
      fetchFredData('DGS10')  // 10Y Treasury
    ]);

    const btcPrices = btcData.map(d => d.close);
    const btcReturns = calculateReturns(btcPrices);

    const correlations: any[] = [];

    // Calculate SPX correlation
    if (spxData.length >= 30) {
      const spxReturns = calculateReturns(spxData.map(d => d.close));
      correlations.push({
        asset: "SPX",
        label: "S&P 500",
        values: {
          "30d": calculateCorrelation(btcReturns.slice(-30), spxReturns.slice(-30)),
          "90d": calculateCorrelation(btcReturns.slice(-90), spxReturns.slice(-90)),
          "1y": calculateCorrelation(btcReturns, spxReturns)
        },
        trend: "stable",
        interpretation: "Correlation with US equities - indicates risk-on/risk-off behavior."
      });
    }

    // Calculate Gold correlation
    if (goldData.length >= 30) {
      const goldReturns = calculateReturns(goldData.map(d => d.close));
      correlations.push({
        asset: "GOLD",
        label: "Gold (XAU)",
        values: {
          "30d": calculateCorrelation(btcReturns.slice(-30), goldReturns.slice(-30)),
          "90d": calculateCorrelation(btcReturns.slice(-90), goldReturns.slice(-90)),
          "1y": calculateCorrelation(btcReturns, goldReturns)
        },
        trend: "up",
        interpretation: "Digital gold narrative - correlation with traditional store of value."
      });
    }

    // Calculate DXY correlation
    if (dxyData.length >= 30) {
      const dxyReturns = calculateReturns(dxyData.map(d => d.close));
      correlations.push({
        asset: "DXY",
        label: "US Dollar Index",
        values: {
          "30d": calculateCorrelation(btcReturns.slice(-30), dxyReturns.slice(-30)),
          "90d": calculateCorrelation(btcReturns.slice(-90), dxyReturns.slice(-90)),
          "1y": calculateCorrelation(btcReturns, dxyReturns)
        },
        trend: "stable",
        interpretation: "Dollar strength inverse relationship - weaker USD typically supports BTC."
      });
    }

    // Use fallback if not enough real data
    if (correlations.length < 3) {
      console.log('Insufficient data for correlations, using fallback');
      const fallback = generateFallbackCorrelations();
      cachedData = fallback;
      cacheTimestamp = now;
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add trend analysis
    correlations.forEach(c => {
      const diff30_90 = c.values["30d"] - c.values["90d"];
      if (diff30_90 > 0.1) c.trend = "up";
      else if (diff30_90 < -0.1) c.trend = "down";
      else c.trend = "stable";
    });

    const result = {
      correlations,
      lastUpdated: new Date().toISOString(),
      dataSource: "live",
      periods: {
        "30d": "30 days",
        "90d": "90 days",
        "1y": "1 year"
      }
    };

    cachedData = result;
    cacheTimestamp = now;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-correlations:', error);
    
    // Return fallback on error
    const fallback = generateFallbackCorrelations();
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
