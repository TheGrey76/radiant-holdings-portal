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
  sector?: string;
}

interface ReportRequest {
  email: string;
  holdings: Holding[];
  scanId?: string;
}

// Sector classification
const SECTOR_MAP: Record<string, string> = {
  'AAPL': 'Technology', 'MSFT': 'Technology', 'GOOGL': 'Technology', 'AMZN': 'Consumer Cyclical',
  'NVDA': 'Technology', 'META': 'Technology', 'TSLA': 'Consumer Cyclical', 'AMD': 'Technology',
  'INTC': 'Technology', 'CRM': 'Technology', 'ORCL': 'Technology', 'ADBE': 'Technology',
  'JPM': 'Financials', 'V': 'Financials', 'MA': 'Financials', 'BRK.B': 'Financials',
  'JNJ': 'Healthcare', 'UNH': 'Healthcare', 'MRK': 'Healthcare', 'ABBV': 'Healthcare',
  'XOM': 'Energy', 'CVX': 'Energy',
  'PG': 'Consumer Defensive', 'PEP': 'Consumer Defensive', 'KO': 'Consumer Defensive', 'WMT': 'Consumer Defensive',
  'DIS': 'Communication Services', 'NFLX': 'Communication Services',
  'SPY': 'Broad Market ETF', 'VOO': 'Broad Market ETF', 'VTI': 'Broad Market ETF',
  'QQQ': 'Tech ETF', 'XLK': 'Tech ETF',
  'AGG': 'Bond ETF', 'BND': 'Bond ETF', 'TLT': 'Bond ETF',
  'GLD': 'Commodity ETF', 'VNQ': 'Real Estate ETF',
  'BTC': 'Cryptocurrency', 'ETH': 'Cryptocurrency', 'SOL': 'Cryptocurrency',
  'XRP': 'Cryptocurrency', 'ADA': 'Cryptocurrency', 'DOGE': 'Cryptocurrency',
};

// Sector risk characteristics
const SECTOR_RISK_PROFILES: Record<string, { volatility: number; beta: number; correlation: number }> = {
  'Technology': { volatility: 0.28, beta: 1.3, correlation: 0.85 },
  'Healthcare': { volatility: 0.18, beta: 0.9, correlation: 0.75 },
  'Financials': { volatility: 0.22, beta: 1.1, correlation: 0.80 },
  'Consumer Cyclical': { volatility: 0.25, beta: 1.2, correlation: 0.82 },
  'Consumer Defensive': { volatility: 0.14, beta: 0.7, correlation: 0.65 },
  'Energy': { volatility: 0.30, beta: 1.4, correlation: 0.70 },
  'Communication Services': { volatility: 0.24, beta: 1.1, correlation: 0.78 },
  'Broad Market ETF': { volatility: 0.15, beta: 1.0, correlation: 1.0 },
  'Tech ETF': { volatility: 0.22, beta: 1.2, correlation: 0.90 },
  'Bond ETF': { volatility: 0.05, beta: 0.1, correlation: -0.20 },
  'Commodity ETF': { volatility: 0.18, beta: 0.3, correlation: 0.10 },
  'Real Estate ETF': { volatility: 0.20, beta: 0.9, correlation: 0.60 },
  'Cryptocurrency': { volatility: 0.75, beta: 2.5, correlation: 0.40 },
  'Custom': { volatility: 0.25, beta: 1.0, correlation: 0.75 },
};

// Scenario definitions
const SCENARIOS = {
  recession: {
    name: 'Recession',
    description: 'Economic contraction with falling corporate earnings',
    marketShock: -0.30,
    sectorImpacts: {
      'Technology': -0.35,
      'Consumer Cyclical': -0.40,
      'Financials': -0.35,
      'Healthcare': -0.15,
      'Consumer Defensive': -0.10,
      'Energy': -0.30,
      'Broad Market ETF': -0.30,
      'Tech ETF': -0.35,
      'Bond ETF': 0.10,
      'Commodity ETF': -0.15,
      'Real Estate ETF': -0.25,
      'Cryptocurrency': -0.50,
    }
  },
  inflation: {
    name: 'Inflation Surge',
    description: 'Persistent high inflation eroding purchasing power',
    marketShock: -0.15,
    sectorImpacts: {
      'Technology': -0.25,
      'Consumer Cyclical': -0.20,
      'Financials': 0.05,
      'Healthcare': -0.10,
      'Consumer Defensive': -0.05,
      'Energy': 0.15,
      'Broad Market ETF': -0.15,
      'Tech ETF': -0.25,
      'Bond ETF': -0.15,
      'Commodity ETF': 0.20,
      'Real Estate ETF': 0.05,
      'Cryptocurrency': -0.20,
    }
  },
  rateHike: {
    name: 'Rate Hike Shock',
    description: 'Aggressive interest rate increases by central banks',
    marketShock: -0.20,
    sectorImpacts: {
      'Technology': -0.30,
      'Consumer Cyclical': -0.25,
      'Financials': 0.10,
      'Healthcare': -0.15,
      'Consumer Defensive': -0.10,
      'Energy': -0.10,
      'Broad Market ETF': -0.20,
      'Tech ETF': -0.30,
      'Bond ETF': -0.20,
      'Commodity ETF': -0.05,
      'Real Estate ETF': -0.30,
      'Cryptocurrency': -0.40,
    }
  },
  cryptoCrash: {
    name: 'Crypto Crash',
    description: 'Major cryptocurrency market collapse',
    marketShock: -0.05,
    sectorImpacts: {
      'Technology': -0.10,
      'Consumer Cyclical': -0.05,
      'Financials': -0.05,
      'Healthcare': 0,
      'Consumer Defensive': 0,
      'Energy': 0,
      'Broad Market ETF': -0.03,
      'Tech ETF': -0.08,
      'Bond ETF': 0.02,
      'Commodity ETF': 0,
      'Real Estate ETF': 0,
      'Cryptocurrency': -0.70,
    }
  },
  bullMarket: {
    name: 'Bull Market Rally',
    description: 'Strong economic growth and market optimism',
    marketShock: 0.25,
    sectorImpacts: {
      'Technology': 0.35,
      'Consumer Cyclical': 0.30,
      'Financials': 0.25,
      'Healthcare': 0.15,
      'Consumer Defensive': 0.10,
      'Energy': 0.20,
      'Broad Market ETF': 0.25,
      'Tech ETF': 0.35,
      'Bond ETF': -0.05,
      'Commodity ETF': 0.10,
      'Real Estate ETF': 0.20,
      'Cryptocurrency': 0.50,
    }
  }
};

function getSector(ticker: string, providedSector?: string): string {
  if (providedSector && providedSector !== 'Custom') return providedSector;
  return SECTOR_MAP[ticker.toUpperCase()] || 'Custom';
}

function calculateSectorBreakdown(holdings: Holding[]): {
  breakdown: { sector: string; weight: number; holdings: string[]; riskContribution: number }[];
  concentrationRisk: { level: string; score: number; topSector: string };
  diversificationScore: number;
} {
  const sectorTotals: Record<string, { weight: number; holdings: string[] }> = {};
  
  for (const holding of holdings) {
    const sector = getSector(holding.ticker, holding.sector);
    if (!sectorTotals[sector]) {
      sectorTotals[sector] = { weight: 0, holdings: [] };
    }
    sectorTotals[sector].weight += holding.weight;
    sectorTotals[sector].holdings.push(holding.ticker);
  }
  
  const breakdown = Object.entries(sectorTotals)
    .map(([sector, data]) => {
      const riskProfile = SECTOR_RISK_PROFILES[sector] || SECTOR_RISK_PROFILES['Custom'];
      return {
        sector,
        weight: data.weight,
        holdings: data.holdings,
        riskContribution: data.weight * riskProfile.volatility / 100,
      };
    })
    .sort((a, b) => b.weight - a.weight);
  
  // Concentration risk
  const topSectorWeight = breakdown[0]?.weight || 0;
  const herfindahlIndex = breakdown.reduce((sum, s) => sum + Math.pow(s.weight / 100, 2), 0);
  
  let concentrationLevel = 'Low';
  let concentrationScore = 100 - (herfindahlIndex * 100);
  
  if (topSectorWeight > 50) {
    concentrationLevel = 'High';
    concentrationScore = Math.min(30, concentrationScore);
  } else if (topSectorWeight > 35) {
    concentrationLevel = 'Moderate';
    concentrationScore = Math.min(60, concentrationScore);
  }
  
  // Diversification score (inverse of concentration)
  const diversificationScore = Math.round(100 - (herfindahlIndex * 100));
  
  return {
    breakdown,
    concentrationRisk: {
      level: concentrationLevel,
      score: Math.round(concentrationScore),
      topSector: breakdown[0]?.sector || 'Unknown',
    },
    diversificationScore,
  };
}

function runScenarioAnalysis(holdings: Holding[]): {
  scenarios: {
    id: string;
    name: string;
    description: string;
    portfolioImpact: number;
    impactByHolding: { ticker: string; impact: number }[];
  }[];
  worstCase: { scenario: string; impact: number };
  bestCase: { scenario: string; impact: number };
  stressTestSummary: string;
} {
  const results: {
    id: string;
    name: string;
    description: string;
    portfolioImpact: number;
    impactByHolding: { ticker: string; impact: number }[];
  }[] = [];
  
  for (const [scenarioId, scenario] of Object.entries(SCENARIOS)) {
    let portfolioImpact = 0;
    const impactByHolding: { ticker: string; impact: number }[] = [];
    
    for (const holding of holdings) {
      const sector = getSector(holding.ticker, holding.sector);
      const sectorImpact = (scenario.sectorImpacts as Record<string, number>)[sector] ?? scenario.marketShock;
      const holdingImpact = sectorImpact * (holding.weight / 100);
      
      portfolioImpact += holdingImpact;
      impactByHolding.push({
        ticker: holding.ticker,
        impact: sectorImpact * 100,
      });
    }
    
    results.push({
      id: scenarioId,
      name: scenario.name,
      description: scenario.description,
      portfolioImpact: portfolioImpact * 100,
      impactByHolding,
    });
  }
  
  const sortedByImpact = [...results].sort((a, b) => a.portfolioImpact - b.portfolioImpact);
  const worstCase = sortedByImpact[0];
  const bestCase = sortedByImpact[sortedByImpact.length - 1];
  
  // Generate stress test summary
  let stressTestSummary = '';
  if (worstCase.portfolioImpact < -25) {
    stressTestSummary = 'Your portfolio shows HIGH vulnerability to market stress. Consider adding defensive assets or increasing bond allocation.';
  } else if (worstCase.portfolioImpact < -15) {
    stressTestSummary = 'Your portfolio has MODERATE downside risk. The current allocation balances growth potential with reasonable protection.';
  } else {
    stressTestSummary = 'Your portfolio is WELL PROTECTED against market downturns. The defensive positioning limits both upside and downside.';
  }
  
  return {
    scenarios: results,
    worstCase: { scenario: worstCase.name, impact: worstCase.portfolioImpact },
    bestCase: { scenario: bestCase.name, impact: bestCase.portfolioImpact },
    stressTestSummary,
  };
}

// Monte Carlo simulation (reused from essentials)
function runMonteCarloSimulation(
  holdings: Holding[],
  numSimulations: number = 1000,
  yearsForward: number = 5
): {
  percentiles: { p5: number; p25: number; p50: number; p75: number; p95: number };
  probabilityOfLoss: number;
  expectedValue: number;
} {
  const monthsForward = yearsForward * 12;
  const finalValues: number[] = [];
  const initialValue = 100;
  
  // Calculate portfolio parameters
  let portfolioReturn = 0;
  let portfolioVolatility = 0;
  
  for (const holding of holdings) {
    const sector = getSector(holding.ticker, holding.sector);
    const riskProfile = SECTOR_RISK_PROFILES[sector] || SECTOR_RISK_PROFILES['Custom'];
    const weight = holding.weight / 100;
    
    // Estimate return based on volatility (risk premium)
    const annualReturn = 0.04 + (riskProfile.volatility * 0.3);
    
    portfolioReturn += weight * annualReturn;
    portfolioVolatility += Math.pow(weight * riskProfile.volatility, 2);
  }
  
  portfolioVolatility = Math.sqrt(portfolioVolatility);
  const monthlyReturn = portfolioReturn / 12;
  const monthlyVol = portfolioVolatility / Math.sqrt(12);
  
  for (let sim = 0; sim < numSimulations; sim++) {
    let value = initialValue;
    
    for (let month = 0; month < monthsForward; month++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const drift = monthlyReturn - 0.5 * monthlyVol * monthlyVol;
      const shock = monthlyVol * z;
      value = value * Math.exp(drift + shock);
    }
    
    finalValues.push(value);
  }
  
  const sorted = [...finalValues].sort((a, b) => a - b);
  const getPercentile = (p: number) => sorted[Math.floor(sorted.length * p)];
  const lossCount = finalValues.filter(v => v < initialValue).length;
  
  return {
    percentiles: {
      p5: getPercentile(0.05),
      p25: getPercentile(0.25),
      p50: getPercentile(0.50),
      p75: getPercentile(0.75),
      p95: getPercentile(0.95),
    },
    probabilityOfLoss: (lossCount / numSimulations) * 100,
    expectedValue: finalValues.reduce((a, b) => a + b, 0) / numSimulations,
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
    
    console.log(`[professional-report] requestId=${requestId} email=${email} holdings=${holdings.length}`);

    if (!email || !holdings || holdings.length === 0) {
      throw new Error('Email and holdings are required');
    }

    // Verify purchase access
    const { data: accessData } = await supabase
      .from('page_access')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('page_slug', 'portfolio-professional')
      .maybeSingle();
    
    const hasPurchased = !!accessData;
    console.log(`[professional-report] requestId=${requestId} hasPurchased=${hasPurchased}`);

    // Run analyses
    const sectorBreakdown = calculateSectorBreakdown(holdings);
    const scenarioAnalysis = runScenarioAnalysis(holdings);
    const monteCarlo = runMonteCarloSimulation(holdings, 1000, 5);
    
    // Calculate overall risk score
    const cryptoWeight = holdings
      .filter(h => getSector(h.ticker, h.sector) === 'Cryptocurrency')
      .reduce((sum, h) => sum + h.weight, 0);
    
    const techWeight = holdings
      .filter(h => ['Technology', 'Tech ETF'].includes(getSector(h.ticker, h.sector)))
      .reduce((sum, h) => sum + h.weight, 0);
    
    const bondWeight = holdings
      .filter(h => getSector(h.ticker, h.sector) === 'Bond ETF')
      .reduce((sum, h) => sum + h.weight, 0);
    
    const riskScore = Math.min(100, Math.max(0, 
      40 + // Base
      (cryptoWeight * 0.8) + // Crypto is high risk
      (techWeight * 0.3) - // Tech adds some risk
      (bondWeight * 0.5) - // Bonds reduce risk
      (sectorBreakdown.diversificationScore * 0.2) // Diversification helps
    ));
    
    const riskLevel = riskScore >= 70 ? 'Aggressive' : riskScore >= 45 ? 'Moderate' : 'Conservative';

    const report = {
      reportType: 'professional',
      generatedAt: new Date().toISOString(),
      holdingsAnalyzed: holdings.length,
      
      // Risk Overview
      riskOverview: {
        riskScore: Math.round(riskScore),
        riskLevel,
        diversificationScore: sectorBreakdown.diversificationScore,
        concentrationRisk: sectorBreakdown.concentrationRisk,
      },
      
      // Sector Breakdown
      sectorBreakdown: sectorBreakdown.breakdown,
      
      // Scenario Analysis
      scenarioAnalysis: {
        scenarios: scenarioAnalysis.scenarios,
        worstCase: scenarioAnalysis.worstCase,
        bestCase: scenarioAnalysis.bestCase,
        stressTestSummary: scenarioAnalysis.stressTestSummary,
      },
      
      // Monte Carlo Summary
      monteCarlo: {
        percentiles: {
          p5: monteCarlo.percentiles.p5.toFixed(1),
          p25: monteCarlo.percentiles.p25.toFixed(1),
          p50: monteCarlo.percentiles.p50.toFixed(1),
          p75: monteCarlo.percentiles.p75.toFixed(1),
          p95: monteCarlo.percentiles.p95.toFixed(1),
        },
        probabilityOfLoss: `${monteCarlo.probabilityOfLoss.toFixed(1)}%`,
        expectedValue: monteCarlo.expectedValue.toFixed(1),
      },
      
      // Access info
      isPurchased: hasPurchased,
    };

    // Save report
    const { error: saveError } = await supabase
      .from('portfolio_reports')
      .upsert({
        email: email.toLowerCase(),
        scan_id: scanId || null,
        report_type: 'professional',
        report_data: report,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'email,report_type',
      });

    if (saveError) {
      console.error(`[professional-report] Error saving:`, saveError);
    }

    console.log(`[professional-report] requestId=${requestId} completed. Risk: ${riskScore.toFixed(0)}`);

    return new Response(
      JSON.stringify({ success: true, report }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[professional-report] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
