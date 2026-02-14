import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map our symbols to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  TON: "the-open-network",
  LINK: "chainlink",
  ONDO: "ondo-finance",
  TAO: "bittensor",
  RENDER: "render-token",
  SUI: "sui",
  AAVE: "aave",
  RSR: "reserve-rights-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

    const resp = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      throw new Error(`CoinGecko API error: ${resp.status}`);
    }

    const raw = await resp.json();

    // Map back to our symbols
    const results: Record<string, any> = {};
    for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
      const d = raw[geckoId];
      if (d) {
        results[symbol] = {
          price_usd: d.usd ?? null,
          price_eur: d.eur ?? null,
          change_24h: d.usd_24h_change ?? null,
          market_cap_usd: d.usd_market_cap ?? null,
          volume_24h_usd: d.usd_24h_vol ?? null,
        };
      }
    }

    return new Response(JSON.stringify({ results, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("fetch-crypto-prices error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
