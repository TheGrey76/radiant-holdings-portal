import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const TWELVE_DATA_API_KEY = Deno.env.get("TWELVE_DATA_API_KEY") ?? "";

interface Holding {
  ticker: string;
  weight: number;
  name?: string;
}

interface MiniScanRequest {
  email: string;
  holdings: Holding[];
  source?: string;
}

interface MarketData {
  price: number;
  returns: number[];
  volatility: number;
  name?: string;
}

// Fetch live price and 5-year historical data from Twelve Data
async function fetchMarketData(ticker: string): Promise<MarketData | null> {
  if (!TWELVE_DATA_API_KEY) {
    console.warn(`[portfolio-mini-scan] TWELVE_DATA_API_KEY missing, using fallback for ${ticker}`);
    return null;
  }

  try {
    // Map common crypto tickers to Twelve Data format
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
    
    // Fetch 5 years of monthly data for volatility calculation
    const historyUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=60&apikey=${TWELVE_DATA_API_KEY}`;
    const historyResponse = await fetch(historyUrl);
    const historyData = await historyResponse.json();
    
    if (historyData.code || historyData.status === 'error') {
      console.warn(`[portfolio-mini-scan] Twelve Data error for ${ticker}:`, historyData.message || historyData.code);
      return null;
    }
    
    if (!historyData.values || historyData.values.length < 2) {
      console.warn(`[portfolio-mini-scan] Insufficient data for ${ticker}`);
      return null;
    }
    
    // Extract prices (newest first in Twelve Data response)
    const prices = historyData.values.map((v: any) => parseFloat(v.close)).reverse();
    const currentPrice = prices[prices.length - 1];
    
    // Calculate monthly returns
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      const monthlyReturn = (prices[i] - prices[i - 1]) / prices[i - 1];
      returns.push(monthlyReturn);
    }
    
    // Calculate annualized volatility from monthly returns
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const monthlyVolatility = Math.sqrt(variance);
    const annualizedVolatility = monthlyVolatility * Math.sqrt(12);
    
    console.log(`[portfolio-mini-scan] ${ticker}: price=${currentPrice}, volatility=${(annualizedVolatility * 100).toFixed(1)}%, dataPoints=${returns.length}`);
    
    return {
      price: currentPrice,
      returns,
      volatility: annualizedVolatility,
      name: historyData.meta?.name || ticker,
    };
  } catch (error) {
    console.error(`[portfolio-mini-scan] Error fetching data for ${ticker}:`, error);
    return null;
  }
}

// Fallback risk factors when live data unavailable
const FALLBACK_VOLATILITY: Record<string, number> = {
  'BTC': 0.65,
  'ETH': 0.75,
  'SOL': 0.90,
  'XRP': 0.85,
  'ADA': 0.80,
  'DOGE': 1.00,
  'AVAX': 0.85,
  'MATIC': 0.80,
  'AAPL': 0.25,
  'MSFT': 0.22,
  'GOOGL': 0.28,
  'AMZN': 0.30,
  'NVDA': 0.45,
  'META': 0.38,
  'TSLA': 0.55,
  'SPY': 0.15,
  'VOO': 0.15,
  'QQQ': 0.20,
  'VTI': 0.15,
  'IVV': 0.15,
  'AGG': 0.05,
  'BND': 0.05,
  'DEFAULT': 0.25,
};

// Calculate portfolio metrics using live data
function calculatePortfolioMetrics(
  holdings: Holding[], 
  marketData: Map<string, MarketData>
): {
  riskScore: number;
  volatility: number;
  expectedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  var95: number;
} {
  let portfolioVolatility = 0;
  let portfolioReturn = 0;
  let totalWeight = 0;
  
  // Calculate weighted volatility and expected returns
  for (const holding of holdings) {
    const ticker = holding.ticker.toUpperCase();
    const weight = holding.weight / 100;
    const data = marketData.get(ticker);
    
    let volatility: number;
    let annualReturn: number;
    
    if (data && data.returns.length > 0) {
      // Use live data
      volatility = data.volatility;
      const avgMonthlyReturn = data.returns.reduce((a, b) => a + b, 0) / data.returns.length;
      annualReturn = avgMonthlyReturn * 12;
    } else {
      // Fallback to heuristics
      volatility = FALLBACK_VOLATILITY[ticker] || FALLBACK_VOLATILITY['DEFAULT'];
      annualReturn = volatility * 0.6; // Risk-return approximation
    }
    
    portfolioVolatility += Math.pow(weight * volatility, 2);
    portfolioReturn += weight * annualReturn;
    totalWeight += weight;
  }
  
  // Simplified correlation adjustment (assume 0.3 average correlation)
  const avgCorrelation = 0.3;
  const n = holdings.length;
  if (n > 1) {
    const correlationAdjustment = 1 + (n - 1) * avgCorrelation * 0.5;
    portfolioVolatility = Math.sqrt(portfolioVolatility * correlationAdjustment);
  } else {
    portfolioVolatility = Math.sqrt(portfolioVolatility);
  }
  
  // Risk-free rate (current ~5% environment)
  const riskFreeRate = 0.045;
  const sharpeRatio = portfolioVolatility > 0 
    ? (portfolioReturn - riskFreeRate) / portfolioVolatility 
    : 0;
  
  // Estimate max drawdown from volatility (empirical relationship)
  const maxDrawdown = portfolioVolatility * 2.5;
  
  // VaR 95% (parametric)
  const var95 = portfolioReturn - (1.645 * portfolioVolatility);
  
  // Convert volatility to risk score (0-100)
  const riskScore = Math.min(100, Math.max(0, Math.round(portfolioVolatility * 100 + 20)));
  
  return {
    riskScore,
    volatility: portfolioVolatility,
    expectedReturn: portfolioReturn,
    sharpeRatio,
    maxDrawdown,
    var95,
  };
}

// Generate insights based on live analysis
function generateInsights(
  holdings: Holding[], 
  marketData: Map<string, MarketData>,
  metrics: ReturnType<typeof calculatePortfolioMetrics>
): string[] {
  const insights: string[] = [];
  
  // Concentration risk
  const maxWeight = Math.max(...holdings.map(h => h.weight));
  if (maxWeight > 30) {
    const topHolding = holdings.find(h => h.weight === maxWeight);
    insights.push(`High concentration: ${maxWeight}% in ${topHolding?.ticker || 'single position'}. Consider diversifying.`);
  }
  
  // Crypto exposure with live volatility
  const cryptoTickers = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'AVAX', 'MATIC'];
  const cryptoHoldings = holdings.filter(h => cryptoTickers.includes(h.ticker.toUpperCase()));
  const cryptoWeight = cryptoHoldings.reduce((sum, h) => sum + h.weight, 0);
  
  if (cryptoWeight > 20) {
    const cryptoVols = cryptoHoldings.map(h => {
      const data = marketData.get(h.ticker.toUpperCase());
      return data ? data.volatility : FALLBACK_VOLATILITY[h.ticker.toUpperCase()] || 0.7;
    });
    const avgCryptoVol = cryptoVols.reduce((a, b) => a + b, 0) / cryptoVols.length;
    insights.push(`Crypto allocation (${cryptoWeight}%) with ${(avgCryptoVol * 100).toFixed(0)}% avg volatility.`);
  }
  
  // Sharpe ratio assessment
  if (metrics.sharpeRatio > 1) {
    insights.push(`Strong risk-adjusted return: Sharpe ratio of ${metrics.sharpeRatio.toFixed(2)}.`);
  } else if (metrics.sharpeRatio < 0.5 && metrics.sharpeRatio > 0) {
    insights.push(`Low risk-adjusted returns: Sharpe ratio of ${metrics.sharpeRatio.toFixed(2)}. Consider rebalancing.`);
  }
  
  // Max drawdown warning
  if (metrics.maxDrawdown > 0.4) {
    insights.push(`High drawdown risk: potential ${(metrics.maxDrawdown * 100).toFixed(0)}% decline in adverse conditions.`);
  }
  
  // VaR insight
  if (metrics.var95 < -0.15) {
    insights.push(`95% VaR: ${(metrics.var95 * 100).toFixed(1)}% potential annual loss in worst-case scenarios.`);
  }
  
  // Data quality note
  const liveDataCount = Array.from(marketData.values()).filter(d => d.returns.length > 0).length;
  if (liveDataCount > 0 && liveDataCount < holdings.length) {
    insights.push(`Analysis based on ${liveDataCount}/${holdings.length} tickers with live market data.`);
  }
  
  // Overall risk profile
  if (metrics.riskScore >= 70) {
    insights.push('Aggressive profile: high growth potential with significant volatility.');
  } else if (metrics.riskScore >= 50) {
    insights.push('Balanced profile: moderate risk suitable for long-term growth.');
  } else if (metrics.riskScore > 0) {
    insights.push('Conservative profile: lower volatility with stable returns.');
  }
  
  return insights.slice(0, 5); // Max 5 insights
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

    const { email, holdings, source = 'mini_scan' }: MiniScanRequest = await req.json();

    const requestId = crypto.randomUUID();
    console.log(`[portfolio-mini-scan] requestId=${requestId} source=${source} holdings=${holdings.length}`);

    if (!email || !holdings || holdings.length === 0) {
      throw new Error('Email and holdings are required');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Fetch live market data for all holdings in parallel
    console.log(`[portfolio-mini-scan] requestId=${requestId} Fetching live market data...`);
    const marketDataPromises = holdings.map(h => fetchMarketData(h.ticker));
    const marketDataResults = await Promise.all(marketDataPromises);
    
    const marketData = new Map<string, MarketData>();
    holdings.forEach((h, i) => {
      if (marketDataResults[i]) {
        marketData.set(h.ticker.toUpperCase(), marketDataResults[i]!);
      }
    });
    
    console.log(`[portfolio-mini-scan] requestId=${requestId} Live data fetched for ${marketData.size}/${holdings.length} tickers`);

    // Calculate metrics using live data
    const metrics = calculatePortfolioMetrics(holdings, marketData);
    
    // Generate insights
    const insights = generateInsights(holdings, marketData, metrics);

    const analysisResults = {
      riskScore: metrics.riskScore,
      riskLevel: metrics.riskScore >= 70 ? 'Aggressive' : metrics.riskScore >= 50 ? 'Moderate' : 'Conservative',
      expectedReturn: `${(metrics.expectedReturn * 100).toFixed(1)}%`,
      volatilityImpact: `${(metrics.volatility * 100).toFixed(1)}%`,
      sharpeRatio: metrics.sharpeRatio.toFixed(2),
      maxDrawdown: `${(metrics.maxDrawdown * 100).toFixed(1)}%`,
      var95: `${(metrics.var95 * 100).toFixed(1)}%`,
      insights,
      holdingsAnalyzed: holdings.length,
      liveDataUsed: marketData.size,
      generatedAt: new Date().toISOString(),
      dataSource: marketData.size > 0 ? 'twelve_data_live' : 'heuristic_fallback',
    };

    // Send email with results (best-effort)
    try {
      if (!resend) {
        console.warn(`[portfolio-mini-scan] requestId=${requestId} RESEND_API_KEY missing; skipping email send`);
      } else {
        const normalizedEmail = email.toLowerCase().trim();
        const holdingsSummary = holdings
          .slice(0, 10)
          .map((h) => `${(h.ticker ?? '').toUpperCase()} (${h.weight}%)`)
          .join(", ");

        const emailResponse = await resend.emails.send({
          from: 'Aries76 <research@aries76.com>',
          to: [normalizedEmail],
          reply_to: "research@aries76.com",
          subject: `Your Portfolio Mini-Scan: Risk Score ${analysisResults.riskScore} (${analysisResults.riskLevel})`,
          headers: {
            "X-Priority": "3",
          },
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                  body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; color: #0f172a; line-height: 1.6; }
                  .container { max-width: 640px; margin: 0 auto; padding: 28px 18px; }
                  .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; }
                  .kpis { display: flex; gap: 10px; flex-wrap: wrap; margin: 14px 0; }
                  .kpi { flex: 1 1 140px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
                  .kpiTitle { font-size: 12px; color: #64748b; margin: 0 0 6px; }
                  .kpiValue { font-size: 20px; font-weight: 800; margin: 0; }
                  .muted { color: #64748b; font-size: 14px; }
                  .cta { display: inline-block; padding: 12px 18px; border-radius: 10px; background: #0f172a; color: #fff !important; text-decoration: none; font-weight: 700; }
                  ul { margin: 10px 0 0 18px; }
                  .footer { margin-top: 14px; font-size: 12px; color: #64748b; }
                  .live-badge { display: inline-block; padding: 2px 8px; background: #10b981; color: white; border-radius: 4px; font-size: 10px; margin-left: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="card">
                    <p class="muted" style="margin-top:0">Aries76 Capital Intelligence</p>
                    <h2 style="margin: 6px 0 4px">Your Portfolio Mini‑Scan ${marketData.size > 0 ? '<span class="live-badge">LIVE DATA</span>' : ''}</h2>
                    <p class="muted" style="margin: 0 0 12px">Holdings analyzed: ${analysisResults.holdingsAnalyzed}${holdingsSummary ? ` • ${holdingsSummary}` : ''}</p>
                    <div class="kpis">
                      <div class="kpi">
                        <p class="kpiTitle">Risk Score</p>
                        <p class="kpiValue">${analysisResults.riskScore}</p>
                        <p class="muted" style="margin:0">${analysisResults.riskLevel}</p>
                      </div>
                      <div class="kpi">
                        <p class="kpiTitle">Expected Return</p>
                        <p class="kpiValue">${analysisResults.expectedReturn}</p>
                      </div>
                      <div class="kpi">
                        <p class="kpiTitle">Volatility</p>
                        <p class="kpiValue">${analysisResults.volatilityImpact}</p>
                      </div>
                      <div class="kpi">
                        <p class="kpiTitle">Sharpe Ratio</p>
                        <p class="kpiValue">${analysisResults.sharpeRatio}</p>
                      </div>
                    </div>

                    <h3 style="margin: 16px 0 8px">Key insights</h3>
                    <ul>
                      ${analysisResults.insights.map((i) => `<li>${i}</li>`).join('')}
                    </ul>

                    <div style="margin-top: 18px">
                      <a class="cta" href="https://aries76.com/portfolio-analysis" target="_blank" rel="noreferrer">Get the full report</a>
                      <p class="footer">Powered by 5-year historical data from Twelve Data. If you didn't request this scan, you can ignore this email.</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log(`[portfolio-mini-scan] requestId=${requestId} email sent to=${normalizedEmail} resendId=${emailResponse?.id ?? 'n/a'}`);
      }
    } catch (emailErr) {
      console.error(`[portfolio-mini-scan] requestId=${requestId} email send failed`, emailErr);
    }

    // Save to portfolio_leads
    await supabase.from('portfolio_leads').insert({
      email: email.toLowerCase(),
      source,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip'),
      user_agent: req.headers.get('user-agent'),
    });

    // Save scan to portfolio_scans with enhanced data
    const { data: scanData, error: scanError } = await supabase
      .from('portfolio_scans')
      .insert({
        email: email.toLowerCase(),
        holdings,
        risk_score: metrics.riskScore,
        analysis_results: {
          ...analysisResults,
          rawMetrics: {
            volatility: metrics.volatility,
            expectedReturn: metrics.expectedReturn,
            sharpeRatio: metrics.sharpeRatio,
            maxDrawdown: metrics.maxDrawdown,
            var95: metrics.var95,
          },
        },
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error saving scan:', scanError);
    }

    console.log(`[portfolio-mini-scan] requestId=${requestId} completed email=${email} riskScore=${metrics.riskScore} liveData=${marketData.size}`);

    return new Response(
      JSON.stringify({
        success: true,
        scanId: scanData?.id,
        results: analysisResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in portfolio-mini-scan:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
