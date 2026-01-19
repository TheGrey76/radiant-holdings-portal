import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface PortfolioMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  volatility: number;
  expectedReturn: number;
  var95: number;
  cvar95: number;
}

interface SentimentData {
  fearGreedIndex: number;
  mvrv_zscore: number;
  activeAddresses: number;
  exchangeFlows: number;
  interpretation: string;
  sentimentColor?: string;
}

interface AllocationData {
  name: string;
  value: number;
}

const COLORS = ['#F7931A', '#627EEA', '#00D4AA', '#6366F1'];

const defaultAllocation: AllocationData[] = [
  { name: 'Bitcoin', value: 40 },
  { name: 'Ethereum', value: 30 },
  { name: 'Traditional Assets', value: 20 },
  { name: 'Stablecoins', value: 10 },
];

export function PortfolioAnalysisDashboard() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [allocation] = useState<AllocationData[]>(defaultAllocation);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // Fetch portfolio metrics
      const { data: metricsResponse, error: metricsError } = await supabase.functions.invoke('portfolio-analysis', {
        body: {
          assets: ['BTC', 'ETH', 'SPY', 'USDC'],
          weights: [0.4, 0.3, 0.2, 0.1],
          timeframe: '1m',
        },
      });

      if (metricsError) throw new Error(metricsError.message);
      setMetrics(metricsResponse);

      // Fetch sentiment data
      const { data: sentimentResponse, error: sentimentError } = await supabase.functions.invoke('sentiment-data');

      if (sentimentError) throw new Error(sentimentError.message);
      setSentiment(sentimentResponse);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Update every hour
    const interval = setInterval(() => fetchData(true), 3600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Portfolio Analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={() => fetchData()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Analysis Engine</h2>
          <p className="text-muted-foreground text-sm mt-1">Institutional-grade risk metrics & sentiment analysis</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
        >
          {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {/* Key Metrics Grid */}
      {metrics && (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-300 uppercase tracking-wide">Sharpe Ratio</span>
            </div>
            <p className="text-3xl font-bold text-blue-100">{metrics.sharpeRatio.toFixed(2)}</p>
            <p className="text-xs text-blue-300/70 mt-1">Risk-adjusted returns</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wide">Sortino Ratio</span>
            </div>
            <p className="text-3xl font-bold text-emerald-100">{metrics.sortinoRatio.toFixed(2)}</p>
            <p className="text-xs text-emerald-300/70 mt-1">Downside risk-adjusted</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-red-300 uppercase tracking-wide">Max Drawdown</span>
            </div>
            <p className="text-3xl font-bold text-red-100">{(metrics.maxDrawdown * 100).toFixed(1)}%</p>
            <p className="text-xs text-red-300/70 mt-1">Largest peak-to-trough</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-medium text-orange-300 uppercase tracking-wide">Volatility</span>
            </div>
            <p className="text-3xl font-bold text-orange-100">{(metrics.volatility * 100).toFixed(1)}%</p>
            <p className="text-xs text-orange-300/70 mt-1">Annualized volatility</p>
          </div>
        </motion.div>
      )}

      {/* Sentiment & Risk Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fear & Greed Index */}
        {sentiment && (
          <motion.div
            className="p-6 rounded-2xl bg-card border border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Market Sentiment</h3>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fear & Greed Index</p>
                <p className="text-5xl font-bold text-orange-500">{sentiment.fearGreedIndex}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-lg font-semibold px-3 py-1 rounded-full ${
                    sentiment.fearGreedIndex < 25
                      ? 'bg-red-500/20 text-red-400'
                      : sentiment.fearGreedIndex < 45
                      ? 'bg-orange-500/20 text-orange-400'
                      : sentiment.fearGreedIndex < 55
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : sentiment.fearGreedIndex < 75
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {sentiment.interpretation}
                </span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: `${sentiment.fearGreedIndex}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
          </motion.div>
        )}

        {/* Risk Metrics */}
        {metrics && (
          <motion.div
            className="p-6 rounded-2xl bg-card border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Risk Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-muted-foreground">Value at Risk (95%)</span>
                <span className="text-red-400 font-semibold">{(metrics.var95 * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-muted-foreground">Conditional VaR (95%)</span>
                <span className="text-red-500 font-semibold">{(metrics.cvar95 * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-muted-foreground">Expected Return</span>
                <span className="text-green-400 font-semibold">{(metrics.expectedReturn * 100).toFixed(2)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Allocation Pie Chart */}
      <motion.div
        className="p-6 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-foreground mb-6">Current Portfolio Allocation</h3>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={allocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {allocation.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-foreground font-medium">{item.name}</span>
                </div>
                <span className="text-muted-foreground font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Summary */}
      {metrics && (
        <motion.div
          className="p-6 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-foreground mb-6">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Sharpe</p>
              <p className="text-2xl font-bold text-blue-400">{metrics.sharpeRatio.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Sortino</p>
              <p className="text-2xl font-bold text-emerald-400">{metrics.sortinoRatio.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Max DD</p>
              <p className="text-2xl font-bold text-red-400">{(metrics.maxDrawdown * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Volatility</p>
              <p className="text-2xl font-bold text-orange-400">{(metrics.volatility * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Exp. Return</p>
              <p className="text-2xl font-bold text-green-400">{(metrics.expectedReturn * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">VaR 95%</p>
              <p className="text-2xl font-bold text-pink-400">{(metrics.var95 * 100).toFixed(2)}%</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Note */}
      <div className="text-center text-muted-foreground text-sm py-4">
        <p>Data refreshed hourly | Last update: {new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      </div>
    </div>
  );
}

export default PortfolioAnalysisDashboard;
