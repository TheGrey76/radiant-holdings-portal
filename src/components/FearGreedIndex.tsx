import { useFearGreedIndex } from '@/hooks/useFearGreedIndex';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getColorByValue = (value: number): string => {
  if (value <= 25) return 'text-red-500';
  if (value <= 45) return 'text-orange-500';
  if (value <= 55) return 'text-yellow-500';
  if (value <= 75) return 'text-lime-500';
  return 'text-green-500';
};

const getBgByValue = (value: number): string => {
  if (value <= 25) return 'bg-red-500';
  if (value <= 45) return 'bg-orange-500';
  if (value <= 55) return 'bg-yellow-500';
  if (value <= 75) return 'bg-lime-500';
  return 'bg-green-500';
};

export const FearGreedIndex = () => {
  const { data, loading, error, refetch } = useFearGreedIndex();

  if (loading) {
    return (
      <div className="bg-card/50 rounded-lg p-6 border border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-card/50 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Fear & Greed Index unavailable</p>
          <button onClick={refetch} className="text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const colorClass = getColorByValue(data.value);
  const bgClass = getBgByValue(data.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card/50 rounded-lg p-6 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Fear & Greed Index
          </h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={refetch} className="text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className={`text-4xl font-bold tabular-nums ${colorClass}`}>
          {data.value}
        </span>
        <span className="text-sm text-muted-foreground">/100</span>
        <span className={`text-sm font-medium ${colorClass}`}>
          {data.classification}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${bgClass} rounded-full`}
        />
        {/* Scale markers */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-background/50"></div>
          <div className="flex-1 border-r border-background/50"></div>
          <div className="flex-1 border-r border-background/50"></div>
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground mb-4">
        <span>Extreme Fear</span>
        <span>Fear</span>
        <span>Neutral</span>
        <span>Greed</span>
        <span>Extreme Greed</span>
      </div>

      {/* Trend & History */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">7d Trend:</span>
          {data.trendDirection === 'up' && (
            <span className="flex items-center gap-1 text-green-500">
              <TrendingUp className="w-3 h-3" />
              +{data.trend}
            </span>
          )}
          {data.trendDirection === 'down' && (
            <span className="flex items-center gap-1 text-red-500">
              <TrendingDown className="w-3 h-3" />
              {data.trend}
            </span>
          )}
          {data.trendDirection === 'stable' && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Minus className="w-3 h-3" />
              0
            </span>
          )}
        </div>

        {/* Mini History */}
        <div className="flex items-end gap-0.5 h-4">
          {data.history.slice().reverse().map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={`w-1.5 rounded-sm ${getBgByValue(item.value)} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                  style={{ height: `${(item.value / 100) * 100}%`, minHeight: '2px' }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: {item.value}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
