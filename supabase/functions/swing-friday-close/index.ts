import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all active positions with entry data
    const { data: activePositions, error: fetchError } = await supabase
      .from("swing_positions")
      .select("*")
      .eq("is_active", true);

    if (fetchError) throw fetchError;
    if (!activePositions || activePositions.length === 0) {
      return new Response(
        JSON.stringify({ message: "Nessuna posizione attiva da chiudere", closed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch live prices for all tickers
    const tickers = activePositions.map((p: any) => p.ticker).filter(Boolean);
    const pricesRes = await fetch(`${supabaseUrl}/functions/v1/fetch-swing-prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({ tickers }),
    });

    const pricesData = await pricesRes.json();
    const prices = pricesData.prices || {};

    let closedCount = 0;

    for (const pos of activePositions) {
      const livePrice = prices[pos.ticker]?.price;
      if (!livePrice || !pos.entry_price || !pos.shares) continue;

      const realizedPnl =
        (livePrice - pos.entry_price) * pos.shares - (pos.fees || 0);

      const { error: updateError } = await supabase
        .from("swing_positions")
        .update({
          exit_price: livePrice,
          exit_date: new Date().toISOString(),
          realized_pnl: realizedPnl,
          is_active: false,
          status: realizedPnl < 0 ? "STOP" : "CLOSED",
        })
        .eq("id", pos.id);

      if (!updateError) closedCount++;
    }

    return new Response(
      JSON.stringify({
        message: `Chiusura venerdì completata: ${closedCount} posizioni chiuse`,
        closed: closedCount,
        total: activePositions.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Errore chiusura venerdì:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
