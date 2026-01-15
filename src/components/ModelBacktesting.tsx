import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, CheckCircle2, Target, TrendingUp, Info, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

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

interface BacktestResponse {
  data: BacktestPoint[];
  metrics: BacktestMetrics;
  lastUpdated: string;
  dataSource: 'live' | 'fallback' | 'empty' | 'error';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const error = ((Math.abs(data.actualPrice - data.targetMid) / data.actualPrice) * 100).toFixed(1);
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-orange-400 mb-2">{data.date}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Actual:</span>
            <span className="text-xs font-bold text-white">${(data.actualPrice / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Target Range:</span>
            <span className="text-xs font-bold text-orange-400">
              ${(data.targetLow / 1000).toFixed(0)}k - ${(data.targetHigh / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="pt-1 border-t border-zinc-700">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-zinc-400">Within Target:</span>
              <span className={`text-xs font-medium ${data.withinTarget ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.withinTarget ? 'Yes ✓' : 'No'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] text-zinc-500">Regime:</span>
            <span className={`text-[10px] font-medium uppercase ${
              data.regime === 'EXPANSION' ? 'text-emerald-400' : 
              data.regime === 'CONTRACTION' ? 'text-red-400' : 
              data.regime === 'ACCUMULATION' ? 'text-blue-400' : 'text-amber-400'
            }`}>{data.regime}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ModelBacktesting = () => {
  const [response, setResponse] = useState<BacktestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-backtest-data');
      
      if (error) throw error;
      setResponse(data);
    } catch (err) {
      console.error('Error fetching backtest data:', err);
      // Fallback data
      setResponse({
        data: [],
        metrics: { mape: 0, directionAccuracy: 0, targetAccuracy: 0, regimeAccuracy: 0, totalPredictions: 0 },
        lastUpdated: new Date().toISOString(),
        dataSource: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = response?.metrics;
  const backtestData = response?.data || [];
  const isLive = response?.dataSource === 'live';

  // Transform data for chart (scale to thousands)
  const chartData = backtestData.map(d => ({
    ...d,
    actual: d.actualPrice / 1000,
    targetMidK: d.targetMid / 1000,
    targetLowK: d.targetLow / 1000,
    targetHighK: d.targetHigh / 1000,
  }));

  const metricCards = metrics ? [
    {
      icon: Target,
      label: 'Target Accuracy',
      value: `${metrics.targetAccuracy}%`,
      status: metrics.targetAccuracy >= 60 ? 'good' : metrics.targetAccuracy >= 40 ? 'warning' : 'bad',
      tooltip: 'Percentage of predictions where actual price was within the target range',
    },
    {
      icon: TrendingUp,
      label: 'Direction Accuracy',
      value: `${metrics.directionAccuracy}%`,
      status: metrics.directionAccuracy >= 65 ? 'good' : metrics.directionAccuracy >= 50 ? 'warning' : 'bad',
      tooltip: 'How often the model correctly predicted price direction (up/down)',
    },
    {
      icon: CheckCircle2,
      label: 'Regime Accuracy',
      value: `${metrics.regimeAccuracy}%`,
      status: metrics.regimeAccuracy >= 70 ? 'good' : metrics.regimeAccuracy >= 50 ? 'warning' : 'bad',
      tooltip: 'Accuracy in predicting macro regimes (expansion/neutral/contraction)',
    },
    {
      icon: LineChart,
      label: 'Mean Error (MAPE)',
      value: `${metrics.mape}%`,
      status: metrics.mape <= 15 ? 'good' : metrics.mape <= 25 ? 'warning' : 'bad',
      tooltip: 'Average percentage difference between target midpoint and actual price',
    },
  ] : [];

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Model Backtesting</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Historical prediction accuracy ({metrics?.totalPredictions || 0} predictions)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {isLive ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="text-xs text-zinc-500">{isLive ? 'Live' : 'Cached'}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl bg-zinc-800" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl bg-zinc-800" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Accuracy Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metricCards.map((metric, index) => (
                <Tooltip key={metric.label}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-4 rounded-xl border cursor-help transition-all hover:border-orange-500/40 ${
                        metric.status === 'good' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        metric.status === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                        metric.status === 'bad' ? 'bg-red-500/10 border-red-500/30' :
                        'bg-zinc-800/60 border-zinc-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className={`w-4 h-4 ${
                          metric.status === 'good' ? 'text-emerald-400' :
                          metric.status === 'warning' ? 'text-amber-400' :
                          metric.status === 'bad' ? 'text-red-400' :
                          'text-violet-400'
                        }`} />
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          {metric.label}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${
                        metric.status === 'good' ? 'text-emerald-400' :
                        metric.status === 'warning' ? 'text-amber-400' :
                        metric.status === 'bad' ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {metric.value}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-zinc-800 border-zinc-700 text-zinc-100">
                    <p className="text-sm">{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Backtest Chart */}
            {chartData.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white">Actual Price vs Target Range</span>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 bg-white rounded"></div>
                      <span className="text-zinc-400">Actual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-orange-400/30 rounded"></div>
                      <span className="text-zinc-400">Target Range</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="targetRangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#a1a1aa', fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#a1a1aa', fontSize: 10 }}
                      tickFormatter={(value) => `$${value}k`}
                      width={50}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    {/* Target range area */}
                    <Area 
                      type="monotone" 
                      dataKey="targetHighK" 
                      stroke="none"
                      fill="url(#targetRangeGradient)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="targetLowK" 
                      stroke="none"
                      fill="#18181b"
                    />
                    
                    {/* Actual price line */}
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#ffffff" 
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#ffffff', stroke: '#18181b', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Methodology Note */}
            <div className="mt-4 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong className="text-zinc-300">Methodology:</strong> The ARIES76 Macro-Liquidity Model combines M2 growth, real interest rates, 
                and on-chain metrics to generate price target ranges. Backtest data is from actual historical predictions stored in our database.
                Past performance is not indicative of future results.
              </p>
            </div>

            {/* Last updated */}
            {response?.lastUpdated && (
              <p className="mt-3 text-xs text-zinc-500 text-right">
                Last updated: {new Date(response.lastUpdated).toLocaleString()}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
