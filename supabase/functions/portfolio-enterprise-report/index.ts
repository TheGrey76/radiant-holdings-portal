import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TWELVE_DATA_API_KEY = Deno.env.get("TWELVE_DATA_API_KEY") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

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
  customScenarios?: CustomScenario[];
}

interface CustomScenario {
  name: string;
  marketShock: number;
  description?: string;
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

// Historical crisis scenarios for institutional stress testing
const INSTITUTIONAL_STRESS_SCENARIOS = {
  gfc2008: {
    name: '2008 Global Financial Crisis',
    description: 'Lehman Brothers collapse, credit freeze, housing market crash',
    duration: '18 months',
    peakToTrough: -0.57,
    sectorImpacts: {
      'Technology': -0.52,
      'Consumer Cyclical': -0.60,
      'Financials': -0.80,
      'Healthcare': -0.35,
      'Consumer Defensive': -0.25,
      'Energy': -0.55,
      'Broad Market ETF': -0.57,
      'Tech ETF': -0.52,
      'Bond ETF': 0.15,
      'Commodity ETF': -0.30,
      'Real Estate ETF': -0.70,
      'Cryptocurrency': -0.85, // Extrapolated
    }
  },
  covid2020: {
    name: 'COVID-19 Crash (March 2020)',
    description: 'Global pandemic, economic shutdown, fastest bear market in history',
    duration: '33 days',
    peakToTrough: -0.34,
    sectorImpacts: {
      'Technology': -0.25,
      'Consumer Cyclical': -0.45,
      'Financials': -0.40,
      'Healthcare': -0.20,
      'Consumer Defensive': -0.15,
      'Energy': -0.60,
      'Broad Market ETF': -0.34,
      'Tech ETF': -0.28,
      'Bond ETF': 0.05,
      'Commodity ETF': -0.35,
      'Real Estate ETF': -0.40,
      'Cryptocurrency': -0.50,
    }
  },
  dotcom2000: {
    name: 'Dot-Com Bubble Burst (2000-2002)',
    description: 'Tech bubble collapse, Nasdaq lost 78% peak to trough',
    duration: '30 months',
    peakToTrough: -0.49,
    sectorImpacts: {
      'Technology': -0.78,
      'Consumer Cyclical': -0.45,
      'Financials': -0.35,
      'Healthcare': -0.25,
      'Consumer Defensive': -0.15,
      'Energy': -0.20,
      'Broad Market ETF': -0.49,
      'Tech ETF': -0.78,
      'Bond ETF': 0.20,
      'Commodity ETF': 0.05,
      'Real Estate ETF': -0.20,
      'Cryptocurrency': -0.80, // Extrapolated
    }
  },
  stagflation1970s: {
    name: '1970s Stagflation',
    description: 'Oil embargo, high inflation, economic stagnation',
    duration: '24 months',
    peakToTrough: -0.48,
    sectorImpacts: {
      'Technology': -0.35,
      'Consumer Cyclical': -0.50,
      'Financials': -0.40,
      'Healthcare': -0.25,
      'Consumer Defensive': -0.20,
      'Energy': 0.30, // Energy benefited
      'Broad Market ETF': -0.48,
      'Tech ETF': -0.40,
      'Bond ETF': -0.30,
      'Commodity ETF': 0.40,
      'Real Estate ETF': -0.35,
      'Cryptocurrency': -0.60, // Extrapolated
    }
  },
  euDebtCrisis2011: {
    name: 'European Debt Crisis (2011)',
    description: 'Greek debt crisis, contagion fears across Eurozone',
    duration: '6 months',
    peakToTrough: -0.22,
    sectorImpacts: {
      'Technology': -0.20,
      'Consumer Cyclical': -0.25,
      'Financials': -0.35,
      'Healthcare': -0.12,
      'Consumer Defensive': -0.08,
      'Energy': -0.22,
      'Broad Market ETF': -0.22,
      'Tech ETF': -0.20,
      'Bond ETF': 0.08,
      'Commodity ETF': -0.15,
      'Real Estate ETF': -0.18,
      'Cryptocurrency': -0.40,
    }
  }
};

function getSector(ticker: string, providedSector?: string): string {
  if (providedSector && providedSector !== 'Custom') return providedSector;
  return SECTOR_MAP[ticker.toUpperCase()] || 'Custom';
}

function runInstitutionalStressTests(holdings: Holding[]): {
  historicalScenarios: {
    id: string;
    name: string;
    description: string;
    duration: string;
    marketDrawdown: number;
    portfolioImpact: number;
    recoveryEstimate: string;
    impactByHolding: { ticker: string; impact: number }[];
  }[];
  worstHistoricalCase: { scenario: string; impact: number };
  averageDrawdown: number;
  resilience: { score: number; rating: string };
} {
  const results: any[] = [];
  
  for (const [scenarioId, scenario] of Object.entries(INSTITUTIONAL_STRESS_SCENARIOS)) {
    let portfolioImpact = 0;
    const impactByHolding: { ticker: string; impact: number }[] = [];
    
    for (const holding of holdings) {
      const sector = getSector(holding.ticker, holding.sector);
      const sectorImpact = (scenario.sectorImpacts as Record<string, number>)[sector] ?? scenario.peakToTrough;
      const holdingImpact = sectorImpact * (holding.weight / 100);
      
      portfolioImpact += holdingImpact;
      impactByHolding.push({
        ticker: holding.ticker,
        impact: sectorImpact * 100,
      });
    }
    
    // Estimate recovery time based on severity
    const recoveryMonths = Math.abs(portfolioImpact) * 36; // Rough estimate
    const recoveryEstimate = recoveryMonths > 24 
      ? `${Math.round(recoveryMonths / 12)} years` 
      : `${Math.round(recoveryMonths)} months`;
    
    results.push({
      id: scenarioId,
      name: scenario.name,
      description: scenario.description,
      duration: scenario.duration,
      marketDrawdown: scenario.peakToTrough * 100,
      portfolioImpact: portfolioImpact * 100,
      recoveryEstimate,
      impactByHolding,
    });
  }
  
  const sortedByImpact = [...results].sort((a, b) => a.portfolioImpact - b.portfolioImpact);
  const worstCase = sortedByImpact[0];
  const averageDrawdown = results.reduce((sum, r) => sum + r.portfolioImpact, 0) / results.length;
  
  // Calculate resilience score
  const resilienceScore = Math.max(0, Math.min(100, 100 + averageDrawdown * 2));
  let resilienceRating = 'Vulnerable';
  if (resilienceScore >= 70) resilienceRating = 'Resilient';
  else if (resilienceScore >= 50) resilienceRating = 'Moderate';
  else if (resilienceScore >= 30) resilienceRating = 'Sensitive';
  
  return {
    historicalScenarios: results,
    worstHistoricalCase: { scenario: worstCase.name, impact: worstCase.portfolioImpact },
    averageDrawdown,
    resilience: { score: Math.round(resilienceScore), rating: resilienceRating },
  };
}

function calculateTaxOptimization(holdings: Holding[]): {
  taxEfficiencyScore: number;
  recommendations: string[];
  potentialSavings: string;
  assetLocationSuggestions: { ticker: string; suggestion: string }[];
} {
  const recommendations: string[] = [];
  const assetLocationSuggestions: { ticker: string; suggestion: string }[] = [];
  
  let taxEfficientWeight = 0;
  let taxInefficientWeight = 0;
  
  for (const holding of holdings) {
    const sector = getSector(holding.ticker, holding.sector);
    const ticker = holding.ticker.toUpperCase();
    
    // Tax-efficient assets (index ETFs, growth stocks held long-term)
    if (['Broad Market ETF', 'Tech ETF'].includes(sector)) {
      taxEfficientWeight += holding.weight;
      assetLocationSuggestions.push({
        ticker,
        suggestion: 'Hold in taxable account - tax-efficient broad market exposure',
      });
    }
    // Tax-inefficient (bonds, REITs, high-dividend)
    else if (['Bond ETF', 'Real Estate ETF'].includes(sector)) {
      taxInefficientWeight += holding.weight;
      assetLocationSuggestions.push({
        ticker,
        suggestion: 'Consider holding in tax-advantaged account (ISA/SIPP) - generates taxable income',
      });
    }
    // Crypto - complex tax treatment
    else if (sector === 'Cryptocurrency') {
      assetLocationSuggestions.push({
        ticker,
        suggestion: 'Track cost basis carefully - each trade may be a taxable event',
      });
    }
    // Equities
    else {
      assetLocationSuggestions.push({
        ticker,
        suggestion: 'Flexible placement - consider dividend tax implications',
      });
    }
  }
  
  const taxEfficiencyScore = Math.round(
    (taxEfficientWeight / (taxEfficientWeight + taxInefficientWeight + 0.01)) * 100
  );
  
  // Generate recommendations
  if (taxInefficientWeight > 30) {
    recommendations.push('High allocation to tax-inefficient assets - prioritize tax-advantaged accounts');
  }
  if (holdings.some(h => getSector(h.ticker, h.sector) === 'Cryptocurrency')) {
    recommendations.push('Cryptocurrency holdings require detailed transaction records for tax compliance');
  }
  if (holdings.length > 10) {
    recommendations.push('Consider tax-loss harvesting opportunities across diversified holdings');
  }
  if (taxEfficientWeight > 60) {
    recommendations.push('Portfolio is tax-efficient - suitable for taxable accounts');
  }
  
  // Estimate potential savings (rough)
  const potentialSavings = taxInefficientWeight > 20 
    ? '£500-2,000/year with optimal asset location' 
    : '£100-500/year with optimal asset location';
  
  return {
    taxEfficiencyScore,
    recommendations,
    potentialSavings,
    assetLocationSuggestions: assetLocationSuggestions.slice(0, 10),
  };
}

function performRegulatoryComplianceCheck(holdings: Holding[]): {
  overallCompliance: { status: string; score: number };
  checks: { name: string; status: 'pass' | 'warning' | 'fail'; details: string }[];
  jurisdictionNotes: string[];
} {
  const checks: { name: string; status: 'pass' | 'warning' | 'fail'; details: string }[] = [];
  const jurisdictionNotes: string[] = [];
  
  // Concentration check (single position > 25%)
  const maxWeight = Math.max(...holdings.map(h => h.weight));
  if (maxWeight > 25) {
    checks.push({
      name: 'Concentration Limit',
      status: 'warning',
      details: `Single position at ${maxWeight.toFixed(1)}% exceeds 25% guideline`,
    });
  } else {
    checks.push({
      name: 'Concentration Limit',
      status: 'pass',
      details: 'All positions within 25% concentration limit',
    });
  }
  
  // Cryptocurrency exposure (institutional limits often <5-10%)
  const cryptoWeight = holdings
    .filter(h => getSector(h.ticker, h.sector) === 'Cryptocurrency')
    .reduce((sum, h) => sum + h.weight, 0);
  
  if (cryptoWeight > 10) {
    checks.push({
      name: 'Cryptocurrency Exposure',
      status: 'warning',
      details: `Crypto allocation at ${cryptoWeight.toFixed(1)}% may exceed institutional guidelines (typically <10%)`,
    });
  } else if (cryptoWeight > 0) {
    checks.push({
      name: 'Cryptocurrency Exposure',
      status: 'pass',
      details: `Crypto allocation at ${cryptoWeight.toFixed(1)}% within typical institutional limits`,
    });
  }
  
  // Liquidity check
  const illiquidAssets = holdings.filter(h => 
    ['Real Estate ETF', 'Cryptocurrency'].includes(getSector(h.ticker, h.sector))
  );
  const illiquidWeight = illiquidAssets.reduce((sum, h) => sum + h.weight, 0);
  
  if (illiquidWeight > 30) {
    checks.push({
      name: 'Liquidity Risk',
      status: 'warning',
      details: `${illiquidWeight.toFixed(1)}% in potentially less liquid assets`,
    });
  } else {
    checks.push({
      name: 'Liquidity Risk',
      status: 'pass',
      details: 'Adequate liquidity across holdings',
    });
  }
  
  // Diversification check
  const sectorCount = new Set(holdings.map(h => getSector(h.ticker, h.sector))).size;
  if (sectorCount < 3) {
    checks.push({
      name: 'Sector Diversification',
      status: 'warning',
      details: `Only ${sectorCount} sector(s) represented - consider broader diversification`,
    });
  } else {
    checks.push({
      name: 'Sector Diversification',
      status: 'pass',
      details: `${sectorCount} sectors represented - adequate diversification`,
    });
  }
  
  // Jurisdiction notes
  jurisdictionNotes.push('UK: Cryptocurrency gains subject to Capital Gains Tax');
  jurisdictionNotes.push('US ETFs: May be subject to 15% dividend withholding for UK investors');
  jurisdictionNotes.push('UCITS: Consider UCITS-equivalent ETFs for better tax treatment');
  
  // Overall score
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const score = Math.max(0, 100 - (failCount * 30) - (warningCount * 10));
  
  return {
    overallCompliance: {
      status: failCount > 0 ? 'Needs Attention' : warningCount > 0 ? 'Generally Compliant' : 'Fully Compliant',
      score,
    },
    checks,
    jurisdictionNotes,
  };
}

async function generateAIRecommendations(
  holdings: Holding[],
  stressTestResults: ReturnType<typeof runInstitutionalStressTests>,
  taxAnalysis: ReturnType<typeof calculateTaxOptimization>,
  complianceCheck: ReturnType<typeof performRegulatoryComplianceCheck>
): Promise<{
  summary: string;
  actionItems: { priority: 'high' | 'medium' | 'low'; action: string; rationale: string }[];
  optimizationSuggestions: string[];
}> {
  // Generate structured recommendations based on analysis
  const actionItems: { priority: 'high' | 'medium' | 'low'; action: string; rationale: string }[] = [];
  const optimizationSuggestions: string[] = [];
  
  // Based on stress test results
  if (stressTestResults.resilience.score < 50) {
    actionItems.push({
      priority: 'high',
      action: 'Increase allocation to defensive assets (bonds, consumer staples)',
      rationale: `Portfolio resilience score of ${stressTestResults.resilience.score} indicates vulnerability to market stress`,
    });
  }
  
  // Based on worst-case scenario
  if (stressTestResults.worstHistoricalCase.impact < -40) {
    actionItems.push({
      priority: 'high',
      action: 'Consider hedging strategies or tail-risk protection',
      rationale: `Worst-case scenario shows ${stressTestResults.worstHistoricalCase.impact.toFixed(1)}% drawdown`,
    });
  }
  
  // Tax optimization
  if (taxAnalysis.taxEfficiencyScore < 60) {
    actionItems.push({
      priority: 'medium',
      action: 'Review asset location across taxable and tax-advantaged accounts',
      rationale: `Tax efficiency score of ${taxAnalysis.taxEfficiencyScore} suggests optimization opportunities`,
    });
  }
  
  // Compliance warnings
  const warnings = complianceCheck.checks.filter(c => c.status === 'warning');
  for (const warning of warnings) {
    actionItems.push({
      priority: 'medium',
      action: `Address: ${warning.name}`,
      rationale: warning.details,
    });
  }
  
  // Optimization suggestions based on holdings
  const cryptoWeight = holdings
    .filter(h => getSector(h.ticker, h.sector) === 'Cryptocurrency')
    .reduce((sum, h) => sum + h.weight, 0);
  
  if (cryptoWeight > 5 && cryptoWeight < 15) {
    optimizationSuggestions.push('Consider dollar-cost averaging into crypto positions to manage volatility');
  }
  
  const techWeight = holdings
    .filter(h => ['Technology', 'Tech ETF'].includes(getSector(h.ticker, h.sector)))
    .reduce((sum, h) => sum + h.weight, 0);
  
  if (techWeight > 40) {
    optimizationSuggestions.push('High tech concentration - consider value or international diversification');
  }
  
  const bondWeight = holdings
    .filter(h => getSector(h.ticker, h.sector) === 'Bond ETF')
    .reduce((sum, h) => sum + h.weight, 0);
  
  if (bondWeight < 10 && stressTestResults.resilience.score < 60) {
    optimizationSuggestions.push('Adding 10-20% bond allocation could significantly improve downside protection');
  }
  
  // Generate summary
  const summary = `Portfolio analysis complete. Resilience rating: ${stressTestResults.resilience.rating}. ` +
    `Tax efficiency: ${taxAnalysis.taxEfficiencyScore}%. ` +
    `Compliance status: ${complianceCheck.overallCompliance.status}. ` +
    `${actionItems.filter(a => a.priority === 'high').length} high-priority actions identified.`;
  
  return {
    summary,
    actionItems,
    optimizationSuggestions,
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

    const { email, holdings, scanId, customScenarios }: ReportRequest = await req.json();
    const requestId = crypto.randomUUID();
    
    console.log(`[enterprise-report] requestId=${requestId} email=${email} holdings=${holdings.length}`);

    if (!email || !holdings || holdings.length === 0) {
      throw new Error('Email and holdings are required');
    }

    // Verify purchase access via portfolio_subscriptions
    const { data: subscriptionData } = await supabase
      .from('portfolio_subscriptions')
      .select('*')
      .eq('user_id', (await supabase.auth.admin.getUserByEmail(email)).data.user?.id)
      .eq('tier', 'enterprise')
      .eq('is_active', true)
      .maybeSingle();
    
    // Also check page_access fallback
    const { data: accessData } = await supabase
      .from('page_access')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('page_slug', 'portfolio-enterprise')
      .maybeSingle();
    
    const hasPurchased = !!subscriptionData || !!accessData;
    console.log(`[enterprise-report] requestId=${requestId} hasPurchased=${hasPurchased}`);

    // Run all analyses
    console.log(`[enterprise-report] requestId=${requestId} Running institutional stress tests...`);
    const stressTestResults = runInstitutionalStressTests(holdings);
    
    console.log(`[enterprise-report] requestId=${requestId} Calculating tax optimization...`);
    const taxAnalysis = calculateTaxOptimization(holdings);
    
    console.log(`[enterprise-report] requestId=${requestId} Performing compliance check...`);
    const complianceCheck = performRegulatoryComplianceCheck(holdings);
    
    console.log(`[enterprise-report] requestId=${requestId} Generating AI recommendations...`);
    const aiRecommendations = await generateAIRecommendations(
      holdings,
      stressTestResults,
      taxAnalysis,
      complianceCheck
    );
    
    // Calculate risk metrics
    let portfolioVolatility = 0;
    for (const holding of holdings) {
      const sector = getSector(holding.ticker, holding.sector);
      const riskProfile = SECTOR_RISK_PROFILES[sector] || SECTOR_RISK_PROFILES['Custom'];
      portfolioVolatility += Math.pow((holding.weight / 100) * riskProfile.volatility, 2);
    }
    portfolioVolatility = Math.sqrt(portfolioVolatility);
    
    const riskScore = Math.min(100, Math.max(0, Math.round(portfolioVolatility * 200 + 20)));
    const riskLevel = riskScore >= 70 ? 'Aggressive' : riskScore >= 45 ? 'Moderate' : 'Conservative';

    const report = {
      reportType: 'enterprise',
      generatedAt: new Date().toISOString(),
      holdingsAnalyzed: holdings.length,
      
      // Executive Summary
      executiveSummary: {
        riskScore,
        riskLevel,
        resilienceRating: stressTestResults.resilience.rating,
        resilienceScore: stressTestResults.resilience.score,
        taxEfficiencyScore: taxAnalysis.taxEfficiencyScore,
        complianceStatus: complianceCheck.overallCompliance.status,
        complianceScore: complianceCheck.overallCompliance.score,
        aiSummary: aiRecommendations.summary,
      },
      
      // Institutional Stress Testing
      institutionalStressTests: {
        historicalScenarios: stressTestResults.historicalScenarios,
        worstHistoricalCase: stressTestResults.worstHistoricalCase,
        averageDrawdown: stressTestResults.averageDrawdown,
        resilience: stressTestResults.resilience,
      },
      
      // Tax Optimization
      taxOptimization: {
        efficiencyScore: taxAnalysis.taxEfficiencyScore,
        recommendations: taxAnalysis.recommendations,
        potentialSavings: taxAnalysis.potentialSavings,
        assetLocationSuggestions: taxAnalysis.assetLocationSuggestions,
      },
      
      // Regulatory Compliance
      regulatoryCompliance: {
        overallStatus: complianceCheck.overallCompliance,
        checks: complianceCheck.checks,
        jurisdictionNotes: complianceCheck.jurisdictionNotes,
      },
      
      // AI Recommendations
      aiRecommendations: {
        summary: aiRecommendations.summary,
        actionItems: aiRecommendations.actionItems,
        optimizationSuggestions: aiRecommendations.optimizationSuggestions,
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
        report_type: 'enterprise',
        report_data: report,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'email,report_type',
      });

    if (saveError) {
      console.error(`[enterprise-report] Error saving:`, saveError);
    }

    console.log(`[enterprise-report] requestId=${requestId} completed. Resilience: ${stressTestResults.resilience.rating}`);

    return new Response(
      JSON.stringify({ success: true, report }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[enterprise-report] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
