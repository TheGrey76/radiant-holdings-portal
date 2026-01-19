import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SentimentData {
  fearGreedIndex: number
  mvrv_zscore: number
  activeAddresses: number
  exchangeFlows: number
  timestamp: string
}

// Generate sentiment data - can be enhanced with real API integrations later
function generateSentimentData(): SentimentData {
  // Use some randomness but keep it somewhat realistic
  const baseIndex = 50 + Math.floor((Math.sin(Date.now() / 86400000) * 30)) // Cycles over days
  const fearGreedIndex = Math.min(100, Math.max(0, baseIndex + Math.floor((Math.random() - 0.5) * 20)))
  
  return {
    fearGreedIndex,
    mvrv_zscore: Number(((Math.random() - 0.5) * 4).toFixed(2)), // Typically ranges from -2 to +2
    activeAddresses: Math.floor(Math.random() * 500000) + 800000, // 800k - 1.3M is realistic
    exchangeFlows: Number(((Math.random() - 0.5) * 50000).toFixed(2)), // Net flows in BTC
    timestamp: new Date().toISOString(),
  }
}

// Interpret Fear & Greed Index
function interpretFearGreed(index: number): string {
  if (index < 20) return "Extreme Fear"
  if (index < 40) return "Fear"
  if (index < 60) return "Neutral"
  if (index < 80) return "Greed"
  return "Extreme Greed"
}

// Get sentiment color for UI
function getSentimentColor(index: number): string {
  if (index < 20) return "#ef4444" // red
  if (index < 40) return "#f97316" // orange
  if (index < 60) return "#eab308" // yellow
  if (index < 80) return "#22c55e" // green
  return "#ef4444" // red for extreme greed (contrarian indicator)
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

    // First try to get the latest cached data (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: cachedData } = await supabase
      .from("sentiment_metrics")
      .select("*")
      .gte("created_at", oneHourAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cachedData) {
      console.log("Returning cached sentiment data")
      return new Response(
        JSON.stringify({
          fearGreedIndex: cachedData.fear_greed_index,
          mvrv_zscore: cachedData.mvrv_zscore,
          activeAddresses: cachedData.active_addresses,
          exchangeFlows: cachedData.exchange_flows,
          interpretation: cachedData.interpretation,
          sentimentColor: getSentimentColor(cachedData.fear_greed_index),
          timestamp: cachedData.created_at,
          cached: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Generate fresh data
    const sentimentData = generateSentimentData()
    const interpretation = interpretFearGreed(sentimentData.fearGreedIndex)
    console.log("Generated fresh sentiment data:", sentimentData)

    // Store in database
    const { error } = await supabase
      .from("sentiment_metrics")
      .insert({
        fear_greed_index: sentimentData.fearGreedIndex,
        mvrv_zscore: sentimentData.mvrv_zscore,
        active_addresses: sentimentData.activeAddresses,
        exchange_flows: sentimentData.exchangeFlows,
        interpretation: interpretation,
      })

    if (error) {
      console.error("Database insert error:", error)
      // Don't fail the request if storage fails
    }

    return new Response(
      JSON.stringify({
        ...sentimentData,
        interpretation,
        sentimentColor: getSentimentColor(sentimentData.fearGreedIndex),
        cached: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Sentiment data error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
