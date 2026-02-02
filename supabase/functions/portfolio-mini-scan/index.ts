import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

// Simple risk calculation based on holdings
function calculateRiskScore(holdings: Holding[]): number {
  // Risk factors by asset type (simplified)
  const riskFactors: Record<string, number> = {
    'BTC': 85,
    'ETH': 80,
    'CRYPTO': 80,
    'TECH': 65,
    'GROWTH': 60,
    'BALANCED': 50,
    'BONDS': 25,
    'CASH': 10,
  };

  let totalRisk = 0;
  let totalWeight = 0;

  for (const holding of holdings) {
    const ticker = holding.ticker.toUpperCase();
    let risk = 50; // Default risk

    // Check for crypto
    if (['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE'].includes(ticker)) {
      risk = riskFactors['CRYPTO'];
    }
    // Check for tech stocks
    else if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'].includes(ticker)) {
      risk = riskFactors['TECH'];
    }
    // Check for bonds
    else if (ticker.includes('BOND') || ticker.includes('AGG') || ticker.includes('BND')) {
      risk = riskFactors['BONDS'];
    }
    // Check for ETFs
    else if (['SPY', 'VOO', 'QQQ', 'VTI', 'IVV'].includes(ticker)) {
      risk = 55;
    }

    totalRisk += risk * (holding.weight / 100);
    totalWeight += holding.weight;
  }

  // Normalize if weights don't add to 100
  if (totalWeight > 0 && totalWeight !== 100) {
    totalRisk = totalRisk * (100 / totalWeight);
  }

  return Math.round(totalRisk);
}

// Generate analysis insights
function generateInsights(holdings: Holding[], riskScore: number): string[] {
  const insights: string[] = [];
  
  // Check concentration
  const maxWeight = Math.max(...holdings.map(h => h.weight));
  if (maxWeight > 30) {
    insights.push(`High concentration risk: ${maxWeight}% in a single position. Consider diversifying.`);
  }

  // Check crypto exposure
  const cryptoTickers = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'AVAX', 'MATIC'];
  const cryptoWeight = holdings
    .filter(h => cryptoTickers.includes(h.ticker.toUpperCase()))
    .reduce((sum, h) => sum + h.weight, 0);
  
  if (cryptoWeight > 20) {
    insights.push(`Significant crypto exposure (${cryptoWeight}%). High volatility expected.`);
  } else if (cryptoWeight > 0 && cryptoWeight <= 10) {
    insights.push(`Moderate crypto allocation (${cryptoWeight}%). Good for diversification.`);
  }

  // Risk level insight
  if (riskScore >= 70) {
    insights.push('Aggressive portfolio: High growth potential with significant volatility risk.');
  } else if (riskScore >= 50) {
    insights.push('Balanced portfolio: Moderate risk-return profile suitable for long-term growth.');
  } else {
    insights.push('Conservative portfolio: Lower volatility with stable, predictable returns.');
  }

  return insights;
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
    console.log(`[portfolio-mini-scan] requestId=${requestId} source=${source}`);

    if (!email || !holdings || holdings.length === 0) {
      throw new Error('Email and holdings are required');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Calculate risk score
    const riskScore = calculateRiskScore(holdings);
    
    // Generate insights
    const insights = generateInsights(holdings, riskScore);

    // Calculate expected return (simplified model)
    const expectedReturn = Math.round((riskScore * 0.15) + 2); // 2-17% range
    
    // Volatility impact
    const volatilityImpact = Math.round(riskScore * 0.12);

    const analysisResults = {
      riskScore,
      riskLevel: riskScore >= 70 ? 'Aggressive' : riskScore >= 50 ? 'Moderate' : 'Conservative',
      expectedReturn: `+${expectedReturn}%`,
      volatilityImpact: `+${volatilityImpact}%`,
      insights,
      holdingsAnalyzed: holdings.length,
      generatedAt: new Date().toISOString(),
    };

    // Send email with results (best-effort; do not fail scan if email fails)
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
          subject: `Your Portfolio Mini-Scan: Risk Score ${riskScore} (${analysisResults.riskLevel})`,
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
                  .kpi { flex: 1 1 160px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
                  .kpiTitle { font-size: 12px; color: #64748b; margin: 0 0 6px; }
                  .kpiValue { font-size: 22px; font-weight: 800; margin: 0; }
                  .muted { color: #64748b; font-size: 14px; }
                  .cta { display: inline-block; padding: 12px 18px; border-radius: 10px; background: #0f172a; color: #fff !important; text-decoration: none; font-weight: 700; }
                  ul { margin: 10px 0 0 18px; }
                  .footer { margin-top: 14px; font-size: 12px; color: #64748b; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="card">
                    <p class="muted" style="margin-top:0">Aries76 Capital Intelligence</p>
                    <h2 style="margin: 6px 0 4px">Your Portfolio Mini‑Scan</h2>
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
                        <p class="kpiTitle">Volatility Impact</p>
                        <p class="kpiValue">${analysisResults.volatilityImpact}</p>
                      </div>
                    </div>

                    <h3 style="margin: 16px 0 8px">Key insights</h3>
                    <ul>
                      ${analysisResults.insights.map((i) => `<li>${i}</li>`).join('')}
                    </ul>

                    <div style="margin-top: 18px">
                      <a class="cta" href="https://aries76.com/portfolio-analysis" target="_blank" rel="noreferrer">Get the full report</a>
                      <p class="footer">If you didn't request this scan, you can ignore this email.</p>
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

    // Save scan to portfolio_scans
    const { data: scanData, error: scanError } = await supabase
      .from('portfolio_scans')
      .insert({
        email: email.toLowerCase(),
        holdings,
        risk_score: riskScore,
        analysis_results: analysisResults,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error saving scan:', scanError);
    }

    console.log(`[portfolio-mini-scan] requestId=${requestId} completed email=${email} riskScore=${riskScore}`);

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
