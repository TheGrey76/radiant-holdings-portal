import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

const SYMBOLS = Object.keys(COINGECKO_IDS);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch prices from CoinGecko
    console.log("Fetching crypto prices...");
    const ids = Object.values(COINGECKO_IDS).join(",");
    const priceResp = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_7d_change=true`
    );
    const priceData = await priceResp.json();

    const priceMap: Record<string, { price: number; change24h: number; marketCap: number }> = {};
    for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
      const d = priceData[geckoId];
      if (d) {
        priceMap[symbol] = {
          price: d.usd ?? 0,
          change24h: d.usd_24h_change ?? 0,
          marketCap: d.usd_market_cap ?? 0,
        };
      }
    }

    // 2. Fetch Fear & Greed Index
    console.log("Fetching Fear & Greed...");
    let fearGreedValue = 50;
    let fearGreedLabel = "Neutral";
    try {
      const fgResp = await fetch("https://api.alternative.me/fng/?limit=1");
      const fgData = await fgResp.json();
      fearGreedValue = parseInt(fgData.data?.[0]?.value || "50");
      fearGreedLabel = fgData.data?.[0]?.value_classification || "Neutral";
    } catch (e) {
      console.error("Fear & Greed fetch failed:", e);
    }

    // 3. Fetch recent crypto news via Finnhub
    console.log("Fetching news...");
    let newsContext = "No recent news available.";
    try {
      const finnhubKey = Deno.env.get("FINNHUB_API_KEY");
      if (finnhubKey) {
        const newsResp = await fetch(
          `https://finnhub.io/api/v1/news?category=crypto&token=${finnhubKey}`
        );
        const newsData = await newsResp.json();
        const topNews = (newsData || []).slice(0, 10);
        newsContext = topNews
          .map((n: any) => `- ${n.headline} (${n.source})`)
          .join("\n");
      }
    } catch (e) {
      console.error("News fetch failed:", e);
    }

    // 4. Build prompt for AI
    const priceContext = SYMBOLS.map((s) => {
      const p = priceMap[s];
      return p
        ? `${s}: $${p.price.toFixed(p.price < 1 ? 6 : 2)}, 24h change: ${p.change24h.toFixed(2)}%, Market Cap: $${(p.marketCap / 1e6).toFixed(0)}M`
        : `${s}: price unavailable`;
    }).join("\n");

    const systemPrompt = `You are a professional crypto analyst for Aries76, an institutional advisory firm. 
You provide concise, data-driven analysis in Italian for a professional audience.
Your tone is measured, institutional, and avoids hype. 
Never provide financial advice or investment recommendations — only analysis.`;

    const userPrompt = `Aggiorna l'outlook per ciascuna delle seguenti criptovalute basandoti sui dati attuali.

**Prezzi live:**
${priceContext}

**Fear & Greed Index:** ${fearGreedValue} (${fearGreedLabel})

**News recenti crypto:**
${newsContext}

Per ogni token (${SYMBOLS.join(", ")}), fornisci in JSON un array con oggetti contenenti:
- "symbol": ticker
- "description": descrizione fondamentale aggiornata (2-3 frasi in italiano)
- "current_status": situazione attuale basata sui prezzi live (1-2 frasi in italiano)
- "drivers": array di 2-3 driver fondamentali attuali (stringhe in italiano)
- "medium_term_outlook": outlook medio periodo (1 frase in italiano)
- "medium_term_sentiment": uno tra "bullish", "neutral", "bearish", "speculative"
- "long_term_outlook": outlook lungo periodo (1 frase in italiano)  
- "long_term_sentiment": uno tra "bullish", "neutral", "bearish", "speculative"
- "risks": array di 2-3 rischi attuali (stringhe in italiano)
- "ai_commentary": breve commento analitico (2-3 frasi in italiano) che integra prezzi, news e sentiment di mercato

Rispondi SOLO con il JSON array, senza markdown fences o altro testo.`;

    // 5. Call Lovable AI
    console.log("Calling AI for analysis...");
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      throw new Error(`AI gateway error ${aiResp.status}: ${errText}`);
    }

    const aiData = await aiResp.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean up potential markdown fences
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let analyses: any[];
    try {
      analyses = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content);
      throw new Error("AI returned invalid JSON");
    }

    // 6. Upsert into database
    console.log("Saving to database...");
    for (const analysis of analyses) {
      const symbol = analysis.symbol?.toUpperCase();
      if (!SYMBOLS.includes(symbol)) continue;

      const p = priceMap[symbol];
      const { error } = await supabase
        .from("crypto_portfolio_outlook")
        .update({
          description: analysis.description,
          current_status: analysis.current_status,
          drivers: analysis.drivers || [],
          medium_term_outlook: analysis.medium_term_outlook,
          medium_term_sentiment: analysis.medium_term_sentiment,
          long_term_outlook: analysis.long_term_outlook,
          long_term_sentiment: analysis.long_term_sentiment,
          risks: analysis.risks || [],
          ai_commentary: analysis.ai_commentary,
          fear_greed_at_update: fearGreedValue,
          price_usd_at_update: p?.price ?? null,
          change_24h_at_update: p?.change24h ?? null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("symbol", symbol);

      if (error) {
        console.error(`Error updating ${symbol}:`, error);
      }
    }

    console.log("Crypto outlook update complete!");
    return new Response(
      JSON.stringify({ success: true, updated: analyses.length, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("update-crypto-outlook error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
