import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PortfolioRequest {
  assets: string[]
  weights: number[]
  timeframe: "1d" | "1w" | "1m"
}

interface PortfolioMetrics {
  sharpeRatio: number
  sortinoRatio: number
  maxDrawdown: number
  volatility: number
  expectedReturn: number
  var95: number
  cvar95: number
}

// Calculate Sharpe Ratio
function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  if (stdDev === 0) return 0
  return (avgReturn - riskFreeRate) / stdDev
}

// Calculate Sortino Ratio
function calculateSortinoRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const downsideReturns = returns.filter(r => r < riskFreeRate)
  if (downsideReturns.length === 0) return avgReturn > riskFreeRate ? 3 : 0
  const downside = downsideReturns.reduce((sum, r) => sum + Math.pow(r - riskFreeRate, 2), 0) / returns.length
  const downsideStdDev = Math.sqrt(downside)
  if (downsideStdDev === 0) return 0
  return (avgReturn - riskFreeRate) / downsideStdDev
}

// Calculate Max Drawdown
function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0
  let maxDrawdown = 0
  let peak = prices[0]
  for (const price of prices) {
    if (price > peak) peak = price
    const drawdown = (peak - price) / peak
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }
  return -maxDrawdown
}

// Calculate Volatility
function calculateVolatility(returns: number[]): number {
  if (returns.length === 0) return 0
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  return Math.sqrt(variance)
}

// Calculate VaR (95%)
function calculateVaR(returns: number[], confidence: number = 0.95): number {
  if (returns.length === 0) return 0
  const sorted = [...returns].sort((a, b) => a - b)
  const index = Math.floor(sorted.length * (1 - confidence))
  return sorted[index] || 0
}

// Calculate CVaR (95%)
function calculateCVaR(returns: number[], confidence: number = 0.95): number {
  if (returns.length === 0) return 0
  const sorted = [...returns].sort((a, b) => a - b)
  const index = Math.floor(sorted.length * (1 - confidence))
  const tailReturns = sorted.slice(0, index + 1)
  if (tailReturns.length === 0) return 0
  return tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length
}

// Generate simulated portfolio data based on realistic Bitcoin portfolio metrics
function generatePortfolioData(assets: string[], weights: number[]): PortfolioMetrics {
  // Simulate daily returns for 252 trading days (1 year)
  const mockReturns = Array.from({ length: 252 }, () => {
    // Bitcoin-weighted portfolio: higher volatility, potential for higher returns
    const btcWeight = weights[assets.indexOf('BTC')] || 0.4
    const baseReturn = (Math.random() - 0.48) * 0.03 // Slight positive bias
    const btcVolatility = btcWeight * (Math.random() - 0.5) * 0.05 // Bitcoin adds volatility
    return baseReturn + btcVolatility
  })
  
  // Generate price series from returns
  const mockPrices = [100]
  for (let i = 1; i < 252; i++) {
    mockPrices.push(mockPrices[i - 1] * (1 + mockReturns[i]))
  }

  // Annualize expected return
  const dailyAvgReturn = mockReturns.reduce((a, b) => a + b, 0) / mockReturns.length
  const annualizedReturn = dailyAvgReturn * 252

  return {
    sharpeRatio: Number(calculateSharpeRatio(mockReturns).toFixed(3)),
    sortinoRatio: Number(calculateSortinoRatio(mockReturns).toFixed(3)),
    maxDrawdown: Number(calculateMaxDrawdown(mockPrices).toFixed(4)),
    volatility: Number((calculateVolatility(mockReturns) * Math.sqrt(252)).toFixed(4)), // Annualized
    expectedReturn: Number(annualizedReturn.toFixed(4)),
    var95: Number(calculateVaR(mockReturns).toFixed(4)),
    cvar95: Number(calculateCVaR(mockReturns).toFixed(4)),
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body: PortfolioRequest = await req.json()
    console.log("Portfolio analysis request:", body)

    // Validate input
    if (!body.assets || !body.weights || body.assets.length !== body.weights.length) {
      return new Response(
        JSON.stringify({ error: "Invalid input: assets and weights must have same length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Validate weights sum to 1
    const weightSum = body.weights.reduce((a, b) => a + b, 0)
    if (Math.abs(weightSum - 1) > 0.01) {
      return new Response(
        JSON.stringify({ error: "Invalid input: weights must sum to 1" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Generate portfolio metrics
    const metrics = generatePortfolioData(body.assets, body.weights)
    console.log("Generated metrics:", metrics)

    // Store in database
    const { error } = await supabase
      .from("portfolio_metrics")
      .insert({
        assets: body.assets,
        weights: body.weights,
        metrics: metrics,
        timeframe: body.timeframe,
      })

    if (error) {
      console.error("Database insert error:", error)
      // Don't fail the request if storage fails
    }

    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Portfolio analysis error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
