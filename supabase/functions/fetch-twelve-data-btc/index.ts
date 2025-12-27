import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
    if (!TWELVE_DATA_API_KEY) {
      throw new Error('TWELVE_DATA_API_KEY is not configured');
    }

    console.log('Fetching Bitcoin price from Twelve Data...');

    // Fetch BTC/USD price
    const btcUsdResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${TWELVE_DATA_API_KEY}`
    );
    const btcUsdData = await btcUsdResponse.json();
    console.log('BTC/USD response:', btcUsdData);

    if (btcUsdData.code) {
      throw new Error(`Twelve Data API error: ${btcUsdData.message || btcUsdData.code}`);
    }

    // Fetch BTC/EUR price
    const btcEurResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/EUR&apikey=${TWELVE_DATA_API_KEY}`
    );
    const btcEurData = await btcEurResponse.json();
    console.log('BTC/EUR response:', btcEurData);

    // Fetch previous day's closing price for 24h change calculation
    const yesterdayResponse = await fetch(
      `https://api.twelvedata.com/time_series?symbol=BTC/USD&interval=1day&outputsize=2&apikey=${TWELVE_DATA_API_KEY}`
    );
    const yesterdayData = await yesterdayResponse.json();
    console.log('Yesterday data response:', yesterdayData);

    let change24h = 0;
    if (yesterdayData.values && yesterdayData.values.length >= 2) {
      const currentPrice = parseFloat(btcUsdData.price);
      const previousClose = parseFloat(yesterdayData.values[1].close);
      change24h = ((currentPrice - previousClose) / previousClose) * 100;
      console.log(`Calculated 24h change: ${change24h.toFixed(2)}%`);
    }

    const result = {
      bitcoin_price_usd: parseFloat(btcUsdData.price),
      bitcoin_price_eur: btcEurData.price ? parseFloat(btcEurData.price) : null,
      change_24h: change24h,
      timestamp: new Date().toISOString(),
      source: 'twelve_data'
    };

    console.log('Returning result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching Twelve Data:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
