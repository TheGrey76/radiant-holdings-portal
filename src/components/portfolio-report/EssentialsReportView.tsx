import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  Activity, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Download,
  HelpCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';

// Metric tooltips in English
const METRIC_TOOLTIPS = {
  riskScore: "Overall portfolio risk score from 0-100. Higher values indicate more aggressive portfolios with greater volatility.",
  expectedReturn: "Annualized expected return based on historical performance and current market conditions.",
  volatility: "Annualized standard deviation of returns. Measures how much the portfolio value fluctuates.",
  sharpeRatio: "Risk-adjusted return metric. Values above 1.0 are good, above 2.0 are excellent. Measures excess return per unit of risk.",
  sortinoRatio: "Similar to Sharpe but only penalizes downside volatility. Higher is better for asymmetric return profiles.",
  maxDrawdown: "Largest peak-to-trough decline in portfolio value. Shows worst-case historical loss scenario.",
  var95: "Value at Risk (95%): Maximum expected annual loss with 95% confidence. 5% chance of losing more than this.",
  cvar95: "Conditional VaR: Average loss in the worst 5% of scenarios. More conservative than VaR.",
  diversificationRatio: "Ratio of weighted average volatility to portfolio volatility. Higher values indicate better diversification.",
  probabilityOfLoss: "Probability of ending with less than initial investment over the projection period.",
  p5: "5th percentile: Only 5% of simulations performed worse than this outcome.",
  p25: "25th percentile: Conservative outcome, 25% of simulations performed worse.",
  p50: "Median outcome: 50% of simulations performed better, 50% worse. Most likely scenario.",
  p75: "75th percentile: Optimistic outcome, only 25% of simulations performed better.",
  p95: "95th percentile: Best case scenario, only 5% of simulations performed better.",
  contribution: "This asset's contribution to overall portfolio return, based on weight and expected return."
};

const MetricLabel: React.FC<{ label: string; tooltipKey: keyof typeof METRIC_TOOLTIPS }> = ({ label, tooltipKey }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-muted-foreground flex items-center gap-1 cursor-help">
          {label}
          <HelpCircle className="h-3 w-3 opacity-50" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{METRIC_TOOLTIPS[tooltipKey]}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface MonteCarloResults {
  simulationsRun: number;
  yearsProjected: number;
  percentiles: {
    p5: string;
    p25: string;
    p50: string;
    p75: string;
    p95: string;
  };
  probabilityOfLoss: string;
  expectedValue: string;
  bestCase: string;
  worstCase: string;
  samplePaths: number[][];
}

interface Metrics {
  riskScore: number;
  riskLevel: string;
  expectedReturn: string;
  volatility: string;
  sharpeRatio: string;
  sortinoRatio: string;
  maxDrawdown: string;
  var95: string;
  cvar95: string;
  diversificationRatio: string;
}

interface AllocationItem {
  ticker: string;
  weight: number;
  contribution: number;
}

interface BenchmarkComparison {
  portfolio: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    p50FiveYear: number;
  };
  benchmarks: {
    name: string;
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    p50FiveYear: number;
  }[];
}

interface EssentialsReport {
  reportType: string;
  generatedAt: string;
  dataSource: string;
  liveDataCount: number;
  holdingsAnalyzed: number;
  metrics: Metrics;
  monteCarlo: MonteCarloResults;
  allocation: {
    breakdown: AllocationItem[];
    totalWeight: number;
  };
  benchmarkComparison: BenchmarkComparison;
  isPurchased: boolean;
}

interface EssentialsReportViewProps {
  report: EssentialsReport;
  email?: string;
}

export const EssentialsReportView: React.FC<EssentialsReportViewProps> = ({ report, email }) => {
  const [showAllPaths, setShowAllPaths] = useState(false);
  
  const { metrics, monteCarlo, allocation, benchmarkComparison } = report;

  // Prepare Monte Carlo chart data
  const chartData = React.useMemo(() => {
    const months = monteCarlo.yearsProjected * 12 + 1;
    const data = [];
    
    for (let i = 0; i <= months; i++) {
      const year = i / 12;
      const point: any = { 
        month: i, 
        year: year.toFixed(1),
        yearLabel: i % 12 === 0 ? `Year ${Math.floor(year)}` : ''
      };
      
      // Calculate percentile bands from sample paths
      const pathValues = monteCarlo.samplePaths.map(path => path[i] || 100);
      pathValues.sort((a, b) => a - b);
      
      const getPercentile = (p: number) => pathValues[Math.floor(pathValues.length * p)] || 100;
      
      point.p5 = getPercentile(0.05);
      point.p25 = getPercentile(0.25);
      point.p50 = getPercentile(0.50);
      point.p75 = getPercentile(0.75);
      point.p95 = getPercentile(0.95);
      
      data.push(point);
    }
    
    return data;
  }, [monteCarlo]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Conservative': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Moderate': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Aggressive': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-muted-foreground';
    }
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Portfolio Essentials Report
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {report.dataSource === 'twelve_data_live' ? 'LIVE DATA' : 'ESTIMATED'}
            </Badge>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Generated {new Date(report.generatedAt).toLocaleDateString()} • 
            {report.holdingsAnalyzed} holdings analyzed • 
            {report.liveDataCount} with live market data
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <MetricLabel label="Risk Score" tooltipKey="riskScore" />
                <p className="text-4xl font-bold">{metrics.riskScore}</p>
                <Badge className={`mt-2 ${getRiskColor(metrics.riskLevel)}`}>
                  {metrics.riskLevel}
                </Badge>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(metrics.riskScore / 100) * 251.2} 251.2`}
                    className="text-primary"
                  />
                </svg>
                <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold text-emerald-400">{metrics.expectedReturn}</p>
            <MetricLabel label="Expected Return" tooltipKey="expectedReturn" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="h-5 w-5 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold text-amber-400">{metrics.volatility}</p>
            <MetricLabel label="Volatility" tooltipKey="volatility" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{metrics.sharpeRatio}</p>
            <MetricLabel label="Sharpe Ratio" tooltipKey="sharpeRatio" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold">{metrics.sortinoRatio}</p>
            <MetricLabel label="Sortino Ratio" tooltipKey="sortinoRatio" />
          </CardContent>
        </Card>
      </div>

      {/* Monte Carlo Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            5-Year Monte Carlo Projection
            <Badge variant="outline" className="ml-2">{monteCarlo.simulationsRun.toLocaleString()} simulations</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorP95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorP75" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorP25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  tickFormatter={(v) => `Y${v}`}
                  className="text-xs"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => `${v.toFixed(0)}`}
                  className="text-xs"
                />
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background/95 border rounded-lg p-3 shadow-xl">
                        <p className="font-medium mb-2">Year {data.year}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-emerald-400">P95: {data.p95?.toFixed(1)}</p>
                          <p className="text-emerald-300">P75: {data.p75?.toFixed(1)}</p>
                          <p className="font-bold">P50: {data.p50?.toFixed(1)}</p>
                          <p className="text-orange-300">P25: {data.p25?.toFixed(1)}</p>
                          <p className="text-red-400">P5: {data.p5?.toFixed(1)}</p>
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={100} stroke="#888" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="p95" 
                  stroke="#22c55e" 
                  fill="url(#colorP95)" 
                  strokeWidth={1}
                />
                <Area 
                  type="monotone" 
                  dataKey="p75" 
                  stroke="#22c55e" 
                  fill="url(#colorP75)" 
                  strokeWidth={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="p50" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="p25" 
                  stroke="#f97316" 
                  fill="url(#colorP25)" 
                  strokeWidth={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="p5" 
                  stroke="#ef4444" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monte Carlo Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Best Case (P95)</p>
              <p className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                {monteCarlo.percentiles.p95}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Optimistic (P75)</p>
              <p className="text-xl font-bold text-emerald-300">{monteCarlo.percentiles.p75}</p>
            </div>
            <div className="text-center bg-primary/10 rounded-lg py-2">
              <p className="text-xs text-muted-foreground mb-1">Median (P50)</p>
              <p className="text-2xl font-bold text-primary">{monteCarlo.percentiles.p50}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Conservative (P25)</p>
              <p className="text-xl font-bold text-orange-400">{monteCarlo.percentiles.p25}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Worst Case (P5)</p>
              <p className="text-xl font-bold text-red-400 flex items-center justify-center gap-1">
                <ArrowDownRight className="h-4 w-4" />
                {monteCarlo.percentiles.p5}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics & Benchmark Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <MetricLabel label="Max Drawdown" tooltipKey="maxDrawdown" />
              <span className="font-bold text-red-400">{metrics.maxDrawdown}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <MetricLabel label="Value at Risk (95%)" tooltipKey="var95" />
              <span className="font-bold text-orange-400">{metrics.var95}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <MetricLabel label="Conditional VaR (95%)" tooltipKey="cvar95" />
              <span className="font-bold text-red-400">{metrics.cvar95}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <MetricLabel label="Diversification Ratio" tooltipKey="diversificationRatio" />
              <span className="font-bold">{metrics.diversificationRatio}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <MetricLabel label="Probability of Loss (5yr)" tooltipKey="probabilityOfLoss" />
              <span className="font-bold text-amber-400">{monteCarlo.probabilityOfLoss}</span>
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Benchmark Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Your Portfolio */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Your Portfolio</span>
                  <Badge className="bg-primary/20 text-primary">P50: {benchmarkComparison.portfolio.p50FiveYear.toFixed(0)}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Return</p>
                    <p className="font-bold">{formatPercent(benchmarkComparison.portfolio.expectedReturn)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volatility</p>
                    <p className="font-bold">{formatPercent(benchmarkComparison.portfolio.volatility)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sharpe</p>
                    <p className="font-bold">{benchmarkComparison.portfolio.sharpeRatio.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Benchmarks */}
              {benchmarkComparison.benchmarks.map((benchmark, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{benchmark.name}</span>
                    <Badge variant="outline">P50: {benchmark.p50FiveYear}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="font-bold">{formatPercent(benchmark.expectedReturn)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volatility</p>
                      <p className="font-bold">{formatPercent(benchmark.volatility)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sharpe</p>
                      <p className="font-bold">{benchmark.sharpeRatio.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Allocation Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allocation.breakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 font-mono font-bold">{item.ticker}</div>
                <div className="flex-1">
                  <Progress value={item.weight} className="h-2" />
                </div>
                <div className="w-16 text-right text-sm">{item.weight.toFixed(1)}%</div>
                <div className="w-24 text-right text-sm">
                  <span className={item.contribution >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {item.contribution >= 0 ? '+' : ''}{item.contribution.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">contribution</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 flex gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          This report is for informational purposes only and does not constitute investment advice. 
          Past performance is not indicative of future results. Monte Carlo simulations are based on 
          historical data and statistical assumptions that may not hold in the future.
        </p>
      </div>
    </div>
  );
};

export default EssentialsReportView;
