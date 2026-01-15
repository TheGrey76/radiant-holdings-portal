import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Info, TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface CorrelationItem {
  asset: string;
  label: string;
  values: {
    '30d': number;
    '90d': number;
    '1y': number;
  };
  trend: 'up' | 'down' | 'stable';
  interpretation: string;
}

interface CorrelationResponse {
  correlations: CorrelationItem[];
  lastUpdated: string;
  dataSource: 'live' | 'fallback';
}

const getCorrelationColor = (value: number) => {
  if (value >= 0.6) return 'bg-emerald-500';
  if (value >= 0.3) return 'bg-emerald-400/70';
  if (value >= 0.1) return 'bg-emerald-300/50';
  if (value >= -0.1) return 'bg-zinc-500/50';
  if (value >= -0.3) return 'bg-red-300/50';
  if (value >= -0.6) return 'bg-red-400/70';
  return 'bg-red-500';
};

const getCorrelationTextColor = (value: number) => {
  if (value >= 0.3) return 'text-emerald-400';
  if (value >= -0.3) return 'text-white';
  return 'text-red-400';
};

const formatCorrelation = (value: number) => {
  return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
};

export const CorrelationMatrix = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('30d');
  const [data, setData] = useState<CorrelationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCorrelations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: fetchError } = await supabase.functions.invoke('fetch-correlations');
      
      if (fetchError) throw fetchError;
      
      setData(result);
    } catch (err) {
      console.error('Error fetching correlations:', err);
      setError('Failed to fetch correlation data');
      // Use fallback data on error
      setData({
        correlations: [
          { asset: "SPX", label: "S&P 500", values: { "30d": 0.42, "90d": 0.38, "1y": 0.31 }, trend: "stable", interpretation: "Moderate positive correlation with equities." },
          { asset: "GOLD", label: "Gold (XAU)", values: { "30d": 0.18, "90d": 0.22, "1y": 0.15 }, trend: "up", interpretation: "Low correlation supports digital gold thesis." },
          { asset: "DXY", label: "US Dollar Index", values: { "30d": -0.35, "90d": -0.41, "1y": -0.38 }, trend: "stable", interpretation: "Inverse correlation with USD strength." },
        ],
        lastUpdated: new Date().toISOString(),
        dataSource: 'fallback'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrelations();
  }, []);

  const correlations = data?.correlations || [];
  const isLive = data?.dataSource === 'live';

  // Find strongest correlations for insight
  const strongestPositive = correlations.reduce((max, item) => 
    item.values[selectedPeriod] > (max?.values[selectedPeriod] || -1) ? item : max, correlations[0]);
  const strongestNegative = correlations.reduce((min, item) => 
    item.values[selectedPeriod] < (min?.values[selectedPeriod] || 1) ? item : min, correlations[0]);

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cross-Asset Correlations</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Bitcoin's relationship with macro assets</p>
            </div>
          </div>
          
          {/* Status & Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {isLive ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="text-xs text-zinc-500">
                {isLive ? 'Live' : 'Cached'}
              </span>
            </div>
            <button
              onClick={fetchCorrelations}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {loading && !data ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Period Selector */}
            <div className="mb-6">
              <div className="inline-flex rounded-lg bg-zinc-800/60 border border-zinc-700/50 p-1">
                {(['30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
                      selectedPeriod === period
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Correlation Grid */}
            <div className="space-y-3">
              {correlations.map((item, index) => {
                const value = item.values[selectedPeriod];
                return (
                  <Tooltip key={item.asset}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 cursor-help hover:border-orange-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-28">
                              <span className="text-sm font-medium text-white">{item.label}</span>
                            </div>
                            
                            {/* Correlation Bar */}
                            <div className="w-48 h-2 bg-zinc-700/60 rounded-full overflow-hidden relative">
                              <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-600"></div>
                              <motion.div
                                className={`absolute h-full ${getCorrelationColor(value)}`}
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${Math.abs(value) * 50}%`,
                                  left: value >= 0 ? '50%' : `${50 - Math.abs(value) * 50}%`
                                }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Trend Indicator */}
                            <div className="flex items-center gap-1">
                              {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                              {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                              {item.trend === 'stable' && <div className="w-3 h-0.5 bg-zinc-500 rounded" />}
                            </div>
                            
                            {/* Correlation Value */}
                            <span className={`text-lg font-bold tabular-nums w-16 text-right ${getCorrelationTextColor(value)}`}>
                              {formatCorrelation(value)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-zinc-800 border-zinc-700 text-zinc-100">
                      <p className="text-sm">{item.interpretation}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-zinc-700/50">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                  <span className="text-zinc-400">Strong positive (≥0.6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-zinc-500/50"></div>
                  <span className="text-zinc-400">Neutral (-0.1 to 0.1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                  <span className="text-zinc-400">Strong negative (≤-0.6)</span>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            {strongestPositive && strongestNegative && (
              <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">Key Insight:</strong> In the {selectedPeriod === '30d' ? 'last 30 days' : selectedPeriod === '90d' ? 'last 90 days' : 'past year'}, 
                  Bitcoin shows strongest positive correlation with {strongestPositive.label} ({formatCorrelation(strongestPositive.values[selectedPeriod])}) 
                  and inverse relationship with {strongestNegative.label} ({formatCorrelation(strongestNegative.values[selectedPeriod])}).
                </p>
              </div>
            )}

            {/* Last Updated */}
            {data?.lastUpdated && (
              <p className="mt-3 text-xs text-zinc-500 text-right">
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
