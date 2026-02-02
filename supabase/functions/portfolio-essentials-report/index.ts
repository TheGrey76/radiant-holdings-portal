import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TWELVE_DATA_API_KEY = Deno.env.get("TWELVE_DATA_API_KEY") ?? "";

interface Holding {
  ticker: string;
  weight: number;
  name?: string;
}

interface ReportRequest {
  email: string;
  holdings: Holding[];
  scanId?: string;
}

interface MarketData {
  price: number;
  returns: number[];
  volatility: number;
  annualReturn: number;
  name?: string;
}

// Fetch 5 years of monthly data from Twelve Data
async function fetchMarketData(ticker: string): Promise<MarketData | null> {
  if (!TWELVE_DATA_API_KEY) {
    console.warn(`[essentials-report] TWELVE_DATA_API_KEY missing`);
    return null;
  }

  try {
    const tickerMap: Record<string, string> = {
      'BTC': 'BTC/USD',
      'ETH': 'ETH/USD',
      'SOL': 'SOL/USD',
      'XRP': 'XRP/USD',
      'ADA': 'ADA/USD',
      'DOGE': 'DOGE/USD',
      'AVAX': 'AVAX/USD',
      'MATIC': 'MATIC/USD',
    };
    
    const symbol = tickerMap[ticker.toUpperCase()] || ticker.toUpperCase();
    
    // Fetch 5 years of monthly data (60 months)
    const historyUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=60&apikey=${TWELVE_DATA_API_KEY}`;
    const historyResponse = await fetch(historyUrl);
    const historyData = await historyResponse.json();
    
    if (historyData.code || historyData.status === 'error') {
      console.warn(`[essentials-report] Twelve Data error for ${ticker}:`, historyData.message);
      return null;
    }
    
    if (!historyData.values || historyData.values.length < 12) {
      console.warn(`[essentials-report] Insufficient data for ${ticker}`);
      return null;
    }
    
    // Prices (newest first in API response, reverse for chronological)
    const prices = historyData.values.map((v: any) => parseFloat(v.close)).reverse();
    const currentPrice = prices[prices.length - 1];
    
    // Monthly returns
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    // Annualized metrics
    const avgMonthlyReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgMonthlyReturn, 2), 0) / returns.length;
    const monthlyVolatility = Math.sqrt(variance);
    
    return {
      price: currentPrice,
      returns,
      volatility: monthlyVolatility * Math.sqrt(12), // Annualized
      annualReturn: avgMonthlyReturn * 12,
      name: historyData.meta?.name || ticker,
    };
  } catch (error) {
    console.error(`[essentials-report] Error fetching ${ticker}:`, error);
    return null;
  }
}

// Fallback data for unsupported tickers
const FALLBACK_DATA: Record<string, { volatility: number; annualReturn: number }> = {
  'BTC': { volatility: 0.65, annualReturn: 0.45 },
  'ETH': { volatility: 0.75, annualReturn: 0.35 },
  'SOL': { volatility: 0.90, annualReturn: 0.40 },
  'AAPL': { volatility: 0.25, annualReturn: 0.15 },
  'MSFT': { volatility: 0.22, annualReturn: 0.18 },
  'GOOGL': { volatility: 0.28, annualReturn: 0.14 },
  'AMZN': { volatility: 0.30, annualReturn: 0.12 },
  'NVDA': { volatility: 0.45, annualReturn: 0.35 },
  'META': { volatility: 0.38, annualReturn: 0.20 },
  'TSLA': { volatility: 0.55, annualReturn: 0.25 },
  'SPY': { volatility: 0.15, annualReturn: 0.10 },
  'VOO': { volatility: 0.15, annualReturn: 0.10 },
  'QQQ': { volatility: 0.20, annualReturn: 0.14 },
  'VTI': { volatility: 0.15, annualReturn: 0.10 },
  'AGG': { volatility: 0.05, annualReturn: 0.03 },
  'BND': { volatility: 0.05, annualReturn: 0.03 },
  'DEFAULT': { volatility: 0.25, annualReturn: 0.08 },
};

// Monte Carlo simulation for 5-year projections
function runMonteCarloSimulation(
  holdings: Holding[],
  marketData: Map<string, MarketData>,
  numSimulations: number = 1000,
  yearsForward: number = 5
): {
  percentiles: { p5: number; p25: number; p50: number; p75: number; p95: number };
  paths: number[][];
  finalValues: number[];
  probabilityOfLoss: number;
  expectedValue: number;
  bestCase: number;
  worstCase: number;
} {
  const monthsForward = yearsForward * 12;
  const finalValues: number[] = [];
  const paths: number[][] = [];
  const initialValue = 100; // Normalize to 100
  
  // Calculate portfolio parameters
  let portfolioReturn = 0;
  let portfolioVolatility = 0;
  
  for (const holding of holdings) {
    const ticker = holding.ticker.toUpperCase();
    const weight = holding.weight / 100;
    const data = marketData.get(ticker);
    
    let annualReturn: number;
    let annualVol: number;
    
    if (data) {
      annualReturn = data.annualReturn;
      annualVol = data.volatility;
    } else {
      const fallback = FALLBACK_DATA[ticker] || FALLBACK_DATA['DEFAULT'];
      annualReturn = fallback.annualReturn;
      annualVol = fallback.volatility;
    }
    
    portfolioReturn += weight * annualReturn;
    portfolioVolatility += Math.pow(weight * annualVol, 2);
  }
  
  // Apply correlation adjustment (0.3 average)
  const n = holdings.length;
  if (n > 1) {
    portfolioVolatility = Math.sqrt(portfolioVolatility * (1 + (n - 1) * 0.3 * 0.5));
  } else {
    portfolioVolatility = Math.sqrt(portfolioVolatility);
  }
  
  // Monthly parameters
  const monthlyReturn = portfolioReturn / 12;
  const monthlyVol = portfolioVolatility / Math.sqrt(12);
  
  // Run simulations using Geometric Brownian Motion
  for (let sim = 0; sim < numSimulations; sim++) {
    const path = [initialValue];
    let value = initialValue;
    
    for (let month = 0; month < monthsForward; month++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      // GBM step
      const drift = monthlyReturn - 0.5 * monthlyVol * monthlyVol;
      const shock = monthlyVol * z;
      value = value * Math.exp(drift + shock);
      path.push(value);
    }
    
    finalValues.push(value);
    paths.push(path);
  }
  
  // Sort for percentiles
  const sorted = [...finalValues].sort((a, b) => a - b);
  const getPercentile = (p: number) => sorted[Math.floor(sorted.length * p)];
  
  // Calculate statistics
  const lossCount = finalValues.filter(v => v < initialValue).length;
  
  return {
    percentiles: {
      p5: getPercentile(0.05),
      p25: getPercentile(0.25),
      p50: getPercentile(0.50),
      p75: getPercentile(0.75),
      p95: getPercentile(0.95),
    },
    paths: paths.slice(0, 50), // Return 50 sample paths for visualization
    finalValues,
    probabilityOfLoss: (lossCount / numSimulations) * 100,
    expectedValue: finalValues.reduce((a, b) => a + b, 0) / numSimulations,
    bestCase: getPercentile(0.95),
    worstCase: getPercentile(0.05),
  };
}

// Calculate comprehensive portfolio metrics
function calculateDetailedMetrics(
  holdings: Holding[],
  marketData: Map<string, MarketData>
): {
  riskScore: number;
  volatility: number;
  expectedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  var95: number;
  cvar95: number;
  diversificationRatio: number;
  allocationBreakdown: { ticker: string; weight: number; contribution: number }[];
} {
  let portfolioVolatility = 0;
  let portfolioReturn = 0;
  const assetVols: number[] = [];
  const allocationBreakdown: { ticker: string; weight: number; contribution: number }[] = [];
  
  for (const holding of holdings) {
    const ticker = holding.ticker.toUpperCase();
    const weight = holding.weight / 100;
    const data = marketData.get(ticker);
    
    let annualReturn: number;
    let annualVol: number;
    
    if (data) {
      annualReturn = data.annualReturn;
      annualVol = data.volatility;
    } else {
      const fallback = FALLBACK_DATA[ticker] || FALLBACK_DATA['DEFAULT'];
      annualReturn = fallback.annualReturn;
      annualVol = fallback.volatility;
    }
    
    portfolioReturn += weight * annualReturn;
    portfolioVolatility += Math.pow(weight * annualVol, 2);
    assetVols.push(annualVol);
    
    allocationBreakdown.push({
      ticker,
      weight: holding.weight,
      contribution: weight * annualReturn * 100, // Return contribution %
    });
  }
  
  // Correlation adjustment
  const n = holdings.length;
  if (n > 1) {
    portfolioVolatility = Math.sqrt(portfolioVolatility * (1 + (n - 1) * 0.3 * 0.5));
  } else {
    portfolioVolatility = Math.sqrt(portfolioVolatility);
  }
  
  // Risk metrics
  const riskFreeRate = 0.045;
  const sharpeRatio = portfolioVolatility > 0 
    ? (portfolioReturn - riskFreeRate) / portfolioVolatility 
    : 0;
  
  // Sortino (downside deviation approximation)
  const downsideVol = portfolioVolatility * 0.7; // Approximate
  const sortinoRatio = downsideVol > 0 
    ? (portfolioReturn - riskFreeRate) / downsideVol 
    : 0;
  
  // Max drawdown estimation
  const maxDrawdown = portfolioVolatility * 2.5;
  
  // VaR and CVaR (parametric)
  const var95 = portfolioReturn - (1.645 * portfolioVolatility);
  const cvar95 = portfolioReturn - (2.063 * portfolioVolatility);
  
  // Diversification ratio
  const weightedAvgVol = holdings.reduce((sum, h, i) => 
    sum + (h.weight / 100) * assetVols[i], 0);
  const diversificationRatio = weightedAvgVol > 0 
    ? weightedAvgVol / portfolioVolatility 
    : 1;
  
  // Risk score (0-100)
  const riskScore = Math.min(100, Math.max(0, Math.round(portfolioVolatility * 100 + 20)));
  
  return {
    riskScore,
    volatility: portfolioVolatility,
    expectedReturn: portfolioReturn,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    var95,
    cvar95,
    diversificationRatio,
    allocationBreakdown,
  };
}

// Generate benchmark comparison
function generateBenchmarkComparison(
  portfolioMetrics: ReturnType<typeof calculateDetailedMetrics>,
  portfolioMonteCarlo: ReturnType<typeof runMonteCarloSimulation>
) {
  // Benchmark: 60/40 portfolio
  const benchmark6040 = {
    name: '60/40 Portfolio',
    expectedReturn: 0.07,
    volatility: 0.10,
    sharpeRatio: 0.45,
    p50FiveYear: 140,
  };
  
  // Benchmark: S&P 500
  const benchmarkSP500 = {
    name: 'S&P 500',
    expectedReturn: 0.10,
    volatility: 0.15,
    sharpeRatio: 0.50,
    p50FiveYear: 161,
  };
  
  return {
    portfolio: {
      expectedReturn: portfolioMetrics.expectedReturn,
      volatility: portfolioMetrics.volatility,
      sharpeRatio: portfolioMetrics.sharpeRatio,
      p50FiveYear: portfolioMonteCarlo.percentiles.p50,
    },
    benchmarks: [benchmark6040, benchmarkSP500],
  };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, holdings, scanId }: ReportRequest = await req.json();
    const requestId = crypto.randomUUID();
    
    console.log(`[essentials-report] requestId=${requestId} email=${email} holdings=${holdings.length}`);

    if (!email || !holdings || holdings.length === 0) {
      throw new Error('Email and holdings are required');
    }

    // Verify purchase access
    const { data: accessData } = await supabase
      .from('page_access')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('page_slug', 'portfolio-essentials')
      .maybeSingle();
    
    const hasPurchased = !!accessData;
    console.log(`[essentials-report] requestId=${requestId} hasPurchased=${hasPurchased}`);

    // Fetch live market data in parallel
    console.log(`[essentials-report] requestId=${requestId} Fetching market data...`);
    const marketDataPromises = holdings.map(h => fetchMarketData(h.ticker));
    const marketDataResults = await Promise.all(marketDataPromises);
    
    const marketData = new Map<string, MarketData>();
    holdings.forEach((h, i) => {
      if (marketDataResults[i]) {
        marketData.set(h.ticker.toUpperCase(), marketDataResults[i]!);
      }
    });
    
    console.log(`[essentials-report] requestId=${requestId} Live data for ${marketData.size}/${holdings.length} tickers`);

    // Run Monte Carlo simulation (1000 paths, 5 years)
    console.log(`[essentials-report] requestId=${requestId} Running Monte Carlo simulation...`);
    const monteCarlo = runMonteCarloSimulation(holdings, marketData, 1000, 5);
    
    // Calculate detailed metrics
    const metrics = calculateDetailedMetrics(holdings, marketData);
    
    // Generate benchmark comparison
    const benchmarkComparison = generateBenchmarkComparison(metrics, monteCarlo);

    // Compile full report
    const report = {
      reportType: 'essentials',
      generatedAt: new Date().toISOString(),
      dataSource: marketData.size > 0 ? 'twelve_data_live' : 'heuristic_fallback',
      liveDataCount: marketData.size,
      holdingsAnalyzed: holdings.length,
      
      // Core Metrics
      metrics: {
        riskScore: metrics.riskScore,
        riskLevel: metrics.riskScore >= 70 ? 'Aggressive' : metrics.riskScore >= 50 ? 'Moderate' : 'Conservative',
        expectedReturn: `${(metrics.expectedReturn * 100).toFixed(1)}%`,
        volatility: `${(metrics.volatility * 100).toFixed(1)}%`,
        sharpeRatio: metrics.sharpeRatio.toFixed(2),
        sortinoRatio: metrics.sortinoRatio.toFixed(2),
        maxDrawdown: `${(metrics.maxDrawdown * 100).toFixed(1)}%`,
        var95: `${(metrics.var95 * 100).toFixed(1)}%`,
        cvar95: `${(metrics.cvar95 * 100).toFixed(1)}%`,
        diversificationRatio: metrics.diversificationRatio.toFixed(2),
      },
      
      // Monte Carlo Results
      monteCarlo: {
        simulationsRun: 1000,
        yearsProjected: 5,
        percentiles: {
          p5: `${monteCarlo.percentiles.p5.toFixed(1)}`,
          p25: `${monteCarlo.percentiles.p25.toFixed(1)}`,
          p50: `${monteCarlo.percentiles.p50.toFixed(1)}`,
          p75: `${monteCarlo.percentiles.p75.toFixed(1)}`,
          p95: `${monteCarlo.percentiles.p95.toFixed(1)}`,
        },
        probabilityOfLoss: `${monteCarlo.probabilityOfLoss.toFixed(1)}%`,
        expectedValue: monteCarlo.expectedValue.toFixed(1),
        bestCase: monteCarlo.bestCase.toFixed(1),
        worstCase: monteCarlo.worstCase.toFixed(1),
        samplePaths: monteCarlo.paths, // 50 paths for charting
      },
      
      // Allocation Analysis
      allocation: {
        breakdown: metrics.allocationBreakdown,
        totalWeight: holdings.reduce((sum, h) => sum + h.weight, 0),
      },
      
      // Benchmark Comparison
      benchmarkComparison,
      
      // Access info
      isPurchased: hasPurchased,
    };

    // Save report to database
    const { error: saveError } = await supabase
      .from('portfolio_reports')
      .upsert({
        email: email.toLowerCase(),
        scan_id: scanId || null,
        report_type: 'essentials',
        report_data: report,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'email,report_type',
      });

    if (saveError) {
      console.error(`[essentials-report] Error saving report:`, saveError);
    }

    console.log(`[essentials-report] requestId=${requestId} completed. P50 5yr: ${monteCarlo.percentiles.p50.toFixed(1)}`);

    return new Response(
      JSON.stringify({
        success: true,
        report,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[essentials-report] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
