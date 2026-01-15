import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BacktestPoint {
  date: string;
  timestamp: string;
  regime: string;
  actualPrice: number;
  targetLow: number;
  targetHigh: number;
  targetMid: number;
  probability: number;
  confidence: number;
  withinTarget: boolean;
}

interface BacktestMetrics {
  mape: number;
  directionAccuracy: number;
  targetAccuracy: number;
  regimeAccuracy: number;
  totalPredictions: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch historical regime data
    const { data: regimeHistory, error } = await supabase
      .from('bitcoin_regime_history')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (!regimeHistory || regimeHistory.length === 0) {
      // Return fallback data if no history
      return new Response(JSON.stringify({
        data: [],
        metrics: {
          mape: 0,
          directionAccuracy: 0,
          targetAccuracy: 0,
          regimeAccuracy: 0,
          totalPredictions: 0,
        },
        lastUpdated: new Date().toISOString(),
        dataSource: 'empty'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform data for backtesting
    const backtestData: BacktestPoint[] = regimeHistory.map((record: any) => {
      const targetMid = (record.price_target_low + record.price_target_high) / 2;
      const withinTarget = record.bitcoin_price_at_time >= record.price_target_low && 
                          record.bitcoin_price_at_time <= record.price_target_high;
      
      return {
        date: new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        timestamp: record.timestamp,
        regime: record.regime,
        actualPrice: record.bitcoin_price_at_time,
        targetLow: record.price_target_low,
        targetHigh: record.price_target_high,
        targetMid: targetMid,
        probability: record.probability,
        confidence: record.confidence,
        withinTarget: withinTarget,
      };
    });

    // Calculate metrics
    let totalError = 0;
    let correctDirections = 0;
    let correctTargets = 0;
    let correctRegimes = 0;

    backtestData.forEach((point, index) => {
      // Mean Absolute Percentage Error (using mid target)
      const error = Math.abs(point.actualPrice - point.targetMid) / point.actualPrice * 100;
      totalError += error;

      // Target accuracy (price within predicted range)
      if (point.withinTarget) {
        correctTargets++;
      }

      // Direction accuracy (compared to previous)
      if (index > 0) {
        const prevPoint = backtestData[index - 1];
        const actualDir = point.actualPrice > prevPoint.actualPrice;
        const predictedDir = point.targetMid > prevPoint.targetMid;
        if (actualDir === predictedDir) {
          correctDirections++;
        }
      }

      // Regime accuracy (did regime match price movement)
      const isExpansion = point.regime === 'EXPANSION';
      const isContraction = point.regime === 'CONTRACTION';
      const priceUp = index > 0 && point.actualPrice > backtestData[index - 1].actualPrice;
      const priceDown = index > 0 && point.actualPrice < backtestData[index - 1].actualPrice;
      
      if ((isExpansion && priceUp) || (isContraction && priceDown) || 
          (point.regime === 'NEUTRAL' || point.regime === 'ACCUMULATION')) {
        correctRegimes++;
      }
    });

    const metrics: BacktestMetrics = {
      mape: Math.round((totalError / backtestData.length) * 10) / 10,
      directionAccuracy: Math.round((correctDirections / Math.max(1, backtestData.length - 1)) * 100),
      targetAccuracy: Math.round((correctTargets / backtestData.length) * 100),
      regimeAccuracy: Math.round((correctRegimes / backtestData.length) * 100),
      totalPredictions: backtestData.length,
    };

    return new Response(JSON.stringify({
      data: backtestData,
      metrics: metrics,
      lastUpdated: new Date().toISOString(),
      dataSource: 'live'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-backtest-data:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      data: [],
      metrics: {
        mape: 0,
        directionAccuracy: 0,
        targetAccuracy: 0,
        regimeAccuracy: 0,
        totalPredictions: 0,
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
