import { useFearGreedIndex } from '@/hooks/useFearGreedIndex';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getColorByValue = (value: number): string => {
  if (value <= 25) return '#ea384c'; // Extreme Fear - red
  if (value <= 45) return '#f97316'; // Fear - orange
  if (value <= 55) return '#eab308'; // Neutral - yellow
  if (value <= 75) return '#84cc16'; // Greed - lime
  return '#22c55e'; // Extreme Greed - green
};

const getGradientByValue = (value: number): string => {
  if (value <= 25) return 'from-red-500/20 to-red-600/10';
  if (value <= 45) return 'from-orange-500/20 to-orange-600/10';
  if (value <= 55) return 'from-yellow-500/20 to-yellow-600/10';
  if (value <= 75) return 'from-lime-500/20 to-lime-600/10';
  return 'from-green-500/20 to-green-600/10';
};

export const FearGreedIndex = () => {
  const { data, loading, error, refetch } = useFearGreedIndex();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
          <div className="h-24 bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400 text-sm">Fear & Greed Index unavailable</p>
          <button onClick={refetch} className="text-zinc-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const color = getColorByValue(data.value);
  const gradientClass = getGradientByValue(data.value);
  const gaugeRotation = (data.value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${gradientClass} backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
          Fear & Greed Index
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={refetch} className="text-zinc-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Refresh data</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div className="relative w-32 h-16 overflow-hidden">
          {/* Background arc */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea384c" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(data.value / 100) * 126} 126`}
              />
            </svg>
          </div>
          
          {/* Needle */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: gaugeRotation }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            className="absolute bottom-0 left-1/2 w-0.5 h-10 origin-bottom"
            style={{ backgroundColor: color }}
          />
          
          {/* Center dot */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: color, borderColor: 'white' }}
          />
        </div>

        {/* Value and classification */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-4xl font-bold tabular-nums"
              style={{ color }}
            >
              {data.value}
            </span>
            <span className="text-zinc-500 text-sm">/100</span>
          </div>
          
          <p 
            className="text-lg font-semibold mt-1"
            style={{ color }}
          >
            {data.classification}
          </p>
          
          {/* Trend indicator */}
          <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
            {data.trendDirection === 'up' && (
              <>
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+{data.trend}</span>
              </>
            )}
            {data.trendDirection === 'down' && (
              <>
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="text-red-400">{data.trend}</span>
              </>
            )}
            {data.trendDirection === 'stable' && (
              <>
                <Minus className="w-3 h-3" />
                <span>0</span>
              </>
            )}
            <span className="text-zinc-500 ml-1">7d trend</span>
          </div>
        </div>
      </div>

      {/* Mini sparkline of history */}
      <div className="mt-4 flex items-end gap-1 h-8">
        {data.history.slice().reverse().map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / 100) * 100}%` }}
                transition={{ delay: index * 0.05 }}
                className="flex-1 rounded-sm cursor-pointer transition-opacity hover:opacity-80"
                style={{ backgroundColor: getColorByValue(item.value) }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}: {item.value} ({item.classification})
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <p className="text-xs text-zinc-500 mt-2 text-center">Last 7 days</p>
    </motion.div>
  );
};
