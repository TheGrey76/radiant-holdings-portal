import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface ETFFlowData {
  date: string;
  netFlow: number;
  inflows: number;
  outflows: number;
}

interface TopETF {
  name: string;
  ticker: string;
  aum: number;
  flow: number;
}

interface ETFSummary {
  totalAUM: number;
  aumChange: number;
  weeklyNetFlow: number;
  monthlyNetFlow: number;
  topETFs: TopETF[];
  dailyFlows: ETFFlowData[];
  lastUpdate: string;
  source: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-primary mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Inflows:</span>
            <span className="text-xs font-medium text-emerald-400">+${data.inflows}M</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Outflows:</span>
            <span className="text-xs font-medium text-red-400">-${data.outflows}M</span>
          </div>
          <div className="pt-1 border-t border-border">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-muted-foreground">Net:</span>
              <span className={`text-xs font-bold ${data.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.netFlow >= 0 ? '+' : ''}${data.netFlow}M
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ETFFlowsTracker = () => {
  const [data, setData] = useState<ETFSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const { data: result, error: fetchError } = await supabase.functions.invoke('fetch-etf-flows');
      
      if (fetchError) {
        console.error('ETF flows fetch error:', fetchError);
        setError('Unable to load ETF data');
        return;
      }
      
      setData(result);
    } catch (err) {
      console.error('ETF flows error:', err);
      setError('Unable to load ETF data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatLastUpdate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">ETF Flows Tracker</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Institutional capital flows</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatLastUpdate(data.lastUpdate)}
                </span>
                {data.source === 'fallback' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    Cached
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Total AUM
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-foreground">${data.totalAUM.toFixed(1)}B</span>
                  <span className="text-xs font-medium text-emerald-400 mb-0.5">+{data.aumChange.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Weekly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  {data.weeklyNetFlow >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xl font-bold ${data.weeklyNetFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.weeklyNetFlow >= 0 ? '+' : ''}${data.weeklyNetFlow.toFixed(2)}B
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Monthly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  {data.monthlyNetFlow >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xl font-bold ${data.monthlyNetFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.monthlyNetFlow >= 0 ? '+' : ''}${data.monthlyNetFlow.toFixed(2)}B
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Top Inflow
                </span>
                <span className="text-sm font-bold text-foreground">{data.topETFs[0]?.ticker}</span>
                <span className="text-xs text-emerald-400 block">+${data.topETFs[0]?.flow}M</span>
              </div>
            </div>

            {/* Daily Flows Chart */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Daily Net Flows (This Week)</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.dailyFlows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickFormatter={(value) => `$${value}M`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
                  <Bar dataKey="netFlow" radius={[4, 4, 0, 0]}>
                    {data.dailyFlows.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.netFlow >= 0 ? '#10b981' : '#ef4444'} 
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top ETFs Table */}
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
              <span className="text-sm font-medium text-foreground block mb-3">Top Bitcoin ETFs by AUM</span>
              <div className="space-y-2">
                {data.topETFs.slice(0, 5).map((etf, index) => (
                  <div key={etf.ticker} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{index + 1}</span>
                      <div>
                        <span className="text-sm font-medium text-foreground">{etf.ticker}</span>
                        <span className="text-xs text-muted-foreground ml-2">{etf.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">${etf.aum.toFixed(1)}B</span>
                      <span className={`text-sm font-bold ${etf.flow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {etf.flow >= 0 ? '+' : ''}${etf.flow}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {/* Source Attribution */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Data: CoinGlass, SoSo Value, ARIES76 Analytics</span>
          <a 
            href="https://sosovalue.xyz/assets/etf/us-btc-spot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            View ETF data <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};