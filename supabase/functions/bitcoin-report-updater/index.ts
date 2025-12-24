// Supabase Edge Function: Bitcoin Report Daily Updater
// Esecuzione: Ogni giorno alle 6:00 AM CET tramite pg_cron

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configurazione
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const FRED_API_KEY = Deno.env.get("FRED_API_KEY") || "";

// Inizializza Supabase client con service role per scrittura
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// API Endpoints
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const FRED_API = "https://api.stlouisfed.org/fred";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BitcoinData {
  price_usd: number;
  price_eur: number;
  market_cap_usd: number;
  volume_24h: number;
  change_24h: number;
}

interface MacroData {
  m2_value: number;
  real_rate: number;
  unemployment_rate: number;
  inflation_rate: number;
}

interface ModelData {
  current_regime: string;
  regime_confidence: number;
  price_target_low: number;
  price_target_high: number;
  probability: number;
  institutional_target: number;
}

/**
 * Raccoglie dati Bitcoin da CoinGecko (API pubblica, no key required)
 */
async function fetchBitcoinData(): Promise<BitcoinData> {
  console.log("📊 Raccogliendo dati Bitcoin da CoinGecko...");

  try {
    // Prezzo Bitcoin attuale
    const priceResponse = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    );
    
    if (!priceResponse.ok) {
      throw new Error(`CoinGecko API error: ${priceResponse.status}`);
    }
    
    const priceData = await priceResponse.json();
    const btc = priceData.bitcoin;

    const bitcoinData: BitcoinData = {
      price_usd: btc.usd || 0,
      price_eur: btc.eur || 0,
      market_cap_usd: btc.usd_market_cap || 0,
      volume_24h: btc.usd_24h_vol || 0,
      change_24h: btc.usd_24h_change || 0,
    };

    console.log(`✓ Prezzo Bitcoin: $${bitcoinData.price_usd.toLocaleString()}`);
    return bitcoinData;
  } catch (error) {
    console.error("✗ Errore nel recupero dati Bitcoin:", error);
    throw error;
  }
}

/**
 * Raccoglie dati macro da FRED (Federal Reserve Economic Data)
 */
async function fetchMacroData(): Promise<MacroData> {
  console.log("📈 Raccogliendo dati macro da FRED...");

  const macroData: MacroData = {
    m2_value: 0,
    real_rate: 0,
    unemployment_rate: 0,
    inflation_rate: 0,
  };

  try {
    // M2 Money Supply
    const m2Response = await fetch(
      `${FRED_API}/series/observations?series_id=M2SL&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    );
    if (m2Response.ok) {
      const m2Data = await m2Response.json();
      if (m2Data.observations && m2Data.observations.length > 0) {
        macroData.m2_value = parseFloat(m2Data.observations[0].value) || 0;
        console.log(`✓ M2 Money Supply: ${macroData.m2_value}`);
      }
    }

    // Real Interest Rates (10-Year Treasury)
    const realRateResponse = await fetch(
      `${FRED_API}/series/observations?series_id=REAINTRATREARAT10Y&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    );
    if (realRateResponse.ok) {
      const realRateData = await realRateResponse.json();
      if (realRateData.observations && realRateData.observations.length > 0) {
        macroData.real_rate = parseFloat(realRateData.observations[0].value) || 0;
        console.log(`✓ Real Rate: ${macroData.real_rate}%`);
      }
    }

    // Unemployment Rate
    const unemploymentResponse = await fetch(
      `${FRED_API}/series/observations?series_id=UNRATE&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    );
    if (unemploymentResponse.ok) {
      const unemploymentData = await unemploymentResponse.json();
      if (unemploymentData.observations && unemploymentData.observations.length > 0) {
        macroData.unemployment_rate = parseFloat(unemploymentData.observations[0].value) || 0;
        console.log(`✓ Unemployment: ${macroData.unemployment_rate}%`);
      }
    }

    // Inflation Rate (CPI YoY)
    const inflationResponse = await fetch(
      `${FRED_API}/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    );
    if (inflationResponse.ok) {
      const inflationData = await inflationResponse.json();
      if (inflationData.observations && inflationData.observations.length > 0) {
        macroData.inflation_rate = parseFloat(inflationData.observations[0].value) || 0;
      }
    }

    return macroData;
  } catch (error) {
    console.error("✗ Errore nel recupero dati macro:", error);
    // Ritorna valori di default invece di lanciare l'errore
    return macroData;
  }
}

/**
 * Calcola il regime attuale del modello basato sui dati macro
 */
function calculateModelRegime(macroData: MacroData, btcPrice: number): ModelData {
  console.log("🎯 Calcolando regime del modello...");

  const realRate = macroData.real_rate || 0;
  const m2Growth = macroData.m2_value > 0 ? 1 : 0; // Semplificato

  // Logica per regime identification basata sul report
  let regime = "ACCUMULATION";
  let regimeConfidence = 0.60;
  let priceLow = 96000;
  let priceHigh = 132000;
  let probability = 0.60;

  if (realRate < 0) {
    // Regime espansivo: tassi reali negativi favoriscono asset rischiosi
    regime = "EXPANSION";
    regimeConfidence = 0.85;
    priceLow = 180000;
    priceHigh = 260000;
    probability = 0.25;
  } else if (realRate > 2) {
    // Regime stress: tassi reali alti sfavoriscono asset rischiosi
    regime = "STRESS";
    regimeConfidence = 0.15;
    priceLow = 45000;
    priceHigh = 60000;
    probability = 0.15;
  }

  const modelData: ModelData = {
    current_regime: regime,
    regime_confidence: regimeConfidence,
    price_target_low: priceLow,
    price_target_high: priceHigh,
    probability: probability,
    institutional_target: 138000, // Target ponderato per probabilità
  };

  console.log(`✓ Regime: ${regime} (Confidence: ${(regimeConfidence * 100).toFixed(0)}%)`);

  return modelData;
}

/**
 * Salva i dati in Supabase
 */
async function saveToSupabase(
  timestamp: string,
  bitcoin: BitcoinData,
  macro: MacroData,
  model: ModelData
): Promise<void> {
  console.log("💾 Salvando dati in Supabase...");

  const record = {
    timestamp,
    bitcoin_price_usd: bitcoin.price_usd,
    bitcoin_price_eur: bitcoin.price_eur,
    bitcoin_market_cap: bitcoin.market_cap_usd,
    bitcoin_volume_24h: bitcoin.volume_24h,
    bitcoin_change_24h: bitcoin.change_24h,
    m2_value: macro.m2_value,
    real_rate: macro.real_rate,
    unemployment_rate: macro.unemployment_rate,
    inflation_rate: macro.inflation_rate,
    current_regime: model.current_regime,
    regime_confidence: model.regime_confidence,
    price_target_low: model.price_target_low,
    price_target_high: model.price_target_high,
    probability: model.probability,
    institutional_target: model.institutional_target,
    raw_data: { bitcoin, macro, model },
  };

  // Inserisci nella tabella storica (trigger aggiornerà automaticamente bitcoin_report_latest)
  const { error: insertError } = await supabase
    .from("bitcoin_report_data")
    .insert([record]);

  if (insertError) {
    console.error("✗ Errore inserimento:", insertError);
    throw insertError;
  }

  console.log("✓ Dati salvati nella tabella storica");

  // Registra l'aggiornamento nel log
  const { error: logError } = await supabase
    .from("bitcoin_report_updates_log")
    .insert([{
      update_timestamp: timestamp,
      status: "success",
      bitcoin_data_updated: true,
      macro_data_updated: true,
      model_updated: true,
      execution_time_ms: Date.now(),
    }]);

  if (logError) {
    console.warn("⚠️ Errore nel log:", logError);
  }

  console.log("✓ Log aggiornamento registrato");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log("🚀 Bitcoin Report Updater - Avvio aggiornamento");
  console.log(`📅 Timestamp: ${timestamp}`);

  try {
    // 1. Raccoglie dati Bitcoin
    const bitcoinData = await fetchBitcoinData();

    // 2. Raccoglie dati macro
    const macroData = await fetchMacroData();

    // 3. Calcola regime del modello
    const modelData = calculateModelRegime(macroData, bitcoinData.price_usd);

    // 4. Salva in Supabase
    await saveToSupabase(timestamp, bitcoinData, macroData, modelData);

    const executionTime = Date.now() - startTime;
    console.log(`✅ Aggiornamento completato in ${executionTime}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bitcoin Report data updated successfully",
        timestamp,
        executionTime,
        data: {
          bitcoin: bitcoinData,
          macro: macroData,
          model: modelData,
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("❌ Errore nell'aggiornamento:", error);

    // Log dell'errore
    await supabase
      .from("bitcoin_report_updates_log")
      .insert([{
        update_timestamp: timestamp,
        status: "failed",
        bitcoin_data_updated: false,
        macro_data_updated: false,
        model_updated: false,
        error_message: error.message,
        execution_time_ms: Date.now() - startTime,
      }]);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
