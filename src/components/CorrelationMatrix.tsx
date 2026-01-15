import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CorrelationData {
  asset: string;
  label: string;
  '30d': number;
  '90d': number;
  '1y': number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Historical correlation data (rolling correlations)
const correlationData: CorrelationData[] = [
  { asset: 'sp500', label: 'S&P 500', '30d': 0.65, '90d': 0.58, '1y': 0.42, trend: 'increasing' },
  { asset: 'nasdaq', label: 'NASDAQ', '30d': 0.72, '90d': 0.68, '1y': 0.55, trend: 'increasing' },
  { asset: 'gold', label: 'Gold', '30d': 0.15, '90d': 0.22, '1y': 0.18, trend: 'stable' },
  { asset: 'dxy', label: 'DXY (USD)', '30d': -0.48, '90d': -0.52, '1y': -0.45, trend: 'stable' },
  { asset: 'm2', label: 'Global M2', '30d': 0.78, '90d': 0.72, '1y': 0.68, trend: 'stable' },
  { asset: 'realrates', label: 'Real Rates', '30d': -0.62, '90d': -0.55, '1y': -0.48, trend: 'decreasing' },
  { asset: 'vix', label: 'VIX', '30d': -0.35, '90d': -0.42, '1y': -0.38, trend: 'stable' },
  { asset: 'oil', label: 'Crude Oil', '30d': 0.25, '90d': 0.18, '1y': 0.12, trend: 'decreasing' },
];

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

const getInterpretation = (asset: string, value: number) => {
  const strength = Math.abs(value);
  const direction = value >= 0 ? 'positive' : 'negative';
  const strengthLabel = strength >= 0.6 ? 'strong' : strength >= 0.3 ? 'moderate' : 'weak';
  
  const insights: Record<string, string> = {
    sp500: `${strengthLabel} ${direction} correlation with equities suggests BTC ${value >= 0 ? 'moves with risk appetite' : 'acts as hedge'}`,
    nasdaq: `Tech sector correlation indicates BTC ${value >= 0.5 ? 'trades as a high-beta tech proxy' : 'showing divergence'}`,
    gold: `${strengthLabel} correlation with gold ${value >= 0.3 ? 'supports digital gold narrative' : 'suggests different driver'}`,
    dxy: `${direction} DXY correlation typical for dollar-denominated assets`,
    m2: `Strong M2 correlation confirms liquidity as primary driver`,
    realrates: `${direction} real rates correlation aligns with macro theory`,
    vix: `${direction} VIX correlation shows ${value < -0.3 ? 'risk-off sensitivity' : 'limited fear impact'}`,
    oil: `${strengthLabel} oil correlation indicates ${value >= 0.2 ? 'macro-driven' : 'independent'} dynamics`,
  };
  
  return insights[asset] || 'Correlation data';
};

export const CorrelationMatrix = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('30d');

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cross-Asset Correlations</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Bitcoin's relationship with macro assets</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
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
            {correlationData.map((item, index) => {
              const value = item[selectedPeriod];
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
                          <div className="w-24">
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
                            {item.trend === 'increasing' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                            {item.trend === 'decreasing' && <TrendingDown className="w-3 h-3 text-red-400" />}
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
                    <p className="text-sm">{getInterpretation(item.asset, value)}</p>
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
          <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-2">
            <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-white">Key Insight:</strong> Bitcoin's strongest correlation remains with 
              Global M2 liquidity (+{correlationData.find(d => d.asset === 'm2')?.[selectedPeriod].toFixed(2)}), 
              confirming our macro-liquidity framework. The {selectedPeriod === '30d' ? 'recent' : 'historical'} negative 
              correlation with real rates supports the thesis that monetary policy remains the primary driver.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};