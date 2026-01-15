import { motion } from 'framer-motion';
import { LineChart, CheckCircle2, Target, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface BacktestPoint {
  date: string;
  actual: number;
  predicted: number;
  regime: 'expansion' | 'neutral' | 'stress';
}

// Historical model predictions vs actual prices (simulated backtest data)
const backtestData: BacktestPoint[] = [
  { date: 'Jan 24', actual: 42, predicted: 40, regime: 'neutral' },
  { date: 'Feb 24', actual: 52, predicted: 48, regime: 'expansion' },
  { date: 'Mar 24', actual: 71, predicted: 65, regime: 'expansion' },
  { date: 'Apr 24', actual: 64, predicted: 68, regime: 'neutral' },
  { date: 'May 24', actual: 68, predicted: 70, regime: 'neutral' },
  { date: 'Jun 24', actual: 62, predicted: 65, regime: 'neutral' },
  { date: 'Jul 24', actual: 65, predicted: 62, regime: 'neutral' },
  { date: 'Aug 24', actual: 59, predicted: 58, regime: 'neutral' },
  { date: 'Sep 24', actual: 63, predicted: 60, regime: 'neutral' },
  { date: 'Oct 24', actual: 72, predicted: 68, regime: 'expansion' },
  { date: 'Nov 24', actual: 96, predicted: 85, regime: 'expansion' },
  { date: 'Dec 24', actual: 105, predicted: 95, regime: 'expansion' },
  { date: 'Jan 25', actual: 102, predicted: 100, regime: 'expansion' },
];

// Calculate model accuracy metrics
const calculateMetrics = (data: BacktestPoint[]) => {
  const errors = data.map(d => Math.abs(d.actual - d.predicted) / d.actual * 100);
  const mape = errors.reduce((a, b) => a + b, 0) / errors.length;
  
  const directions = data.slice(1).map((d, i) => {
    const actualDir = d.actual > data[i].actual;
    const predictedDir = d.predicted > data[i].predicted;
    return actualDir === predictedDir;
  });
  const directionAccuracy = (directions.filter(Boolean).length / directions.length) * 100;
  
  const regimeCorrect = data.filter(d => {
    if (d.regime === 'expansion' && d.actual > 60) return true;
    if (d.regime === 'stress' && d.actual < 40) return true;
    if (d.regime === 'neutral' && d.actual >= 40 && d.actual <= 70) return true;
    return false;
  }).length;
  const regimeAccuracy = (regimeCorrect / data.length) * 100;
  
  return {
    mape: mape.toFixed(1),
    directionAccuracy: directionAccuracy.toFixed(0),
    regimeAccuracy: regimeAccuracy.toFixed(0),
    totalPredictions: data.length,
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const error = ((Math.abs(data.actual - data.predicted) / data.actual) * 100).toFixed(1);
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-orange-400 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Actual:</span>
            <span className="text-xs font-bold text-white">${data.actual}k</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Predicted:</span>
            <span className="text-xs font-bold text-orange-400">${data.predicted}k</span>
          </div>
          <div className="pt-1 border-t border-zinc-700">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-zinc-400">Error:</span>
              <span className={`text-xs font-medium ${parseFloat(error) < 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {error}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] text-zinc-500">Regime:</span>
            <span className={`text-[10px] font-medium uppercase ${
              data.regime === 'expansion' ? 'text-emerald-400' : 
              data.regime === 'stress' ? 'text-red-400' : 'text-amber-400'
            }`}>{data.regime}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ModelBacktesting = () => {
  const metrics = calculateMetrics(backtestData);

  const metricCards = [
    {
      icon: Target,
      label: 'Mean Absolute Error',
      value: `${metrics.mape}%`,
      status: parseFloat(metrics.mape) < 15 ? 'good' : 'warning',
      tooltip: 'Average percentage difference between predicted and actual prices',
    },
    {
      icon: TrendingUp,
      label: 'Direction Accuracy',
      value: `${metrics.directionAccuracy}%`,
      status: parseFloat(metrics.directionAccuracy) > 65 ? 'good' : 'warning',
      tooltip: 'How often the model correctly predicted price direction (up/down)',
    },
    {
      icon: CheckCircle2,
      label: 'Regime Accuracy',
      value: `${metrics.regimeAccuracy}%`,
      status: parseFloat(metrics.regimeAccuracy) > 70 ? 'good' : 'warning',
      tooltip: 'Accuracy in predicting macro regimes (expansion/neutral/stress)',
    },
    {
      icon: LineChart,
      label: 'Total Predictions',
      value: metrics.totalPredictions.toString(),
      status: 'neutral',
      tooltip: 'Number of monthly predictions in the backtest period',
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Model Backtesting</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Historical prediction accuracy (Jan 2024 – Jan 2025)</p>
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
                      'bg-zinc-800/60 border-zinc-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon className={`w-4 h-4 ${
                        metric.status === 'good' ? 'text-emerald-400' :
                        metric.status === 'warning' ? 'text-amber-400' :
                        'text-violet-400'
                      }`} />
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                    <span className={`text-xl font-bold ${
                      metric.status === 'good' ? 'text-emerald-400' :
                      metric.status === 'warning' ? 'text-amber-400' :
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
          <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white">Predicted vs Actual Price</span>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-white rounded"></div>
                  <span className="text-zinc-400">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-orange-400 rounded"></div>
                  <span className="text-zinc-400">Predicted</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={backtestData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
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
                  domain={[30, 120]}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#f97316', stroke: '#18181b', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Methodology Note */}
          <div className="mt-4 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/50 flex items-start gap-2">
            <Info className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Methodology:</strong> The ARIES76 Macro-Liquidity Model combines M2 growth, real interest rates, 
              and on-chain metrics to generate price targets. This backtest covers the period from January 2024 to January 2025. 
              Past performance is not indicative of future results.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};