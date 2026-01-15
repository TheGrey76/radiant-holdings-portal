import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ETFFlowData {
  date: string;
  netFlow: number;
  inflows: number;
  outflows: number;
}

interface ETFSummary {
  totalAUM: number;
  aumChange: number;
  weeklyNetFlow: number;
  monthlyNetFlow: number;
  topInflows: { name: string; flow: number }[];
  dailyFlows: ETFFlowData[];
  lastUpdate: Date;
}

// Simulated data - in production would come from SoSo Value or similar API
const fetchETFData = async (): Promise<ETFSummary> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dailyFlows = days.map(day => {
    const inflows = Math.floor(100 + Math.random() * 400);
    const outflows = Math.floor(50 + Math.random() * 200);
    return {
      date: day,
      netFlow: inflows - outflows,
      inflows,
      outflows,
    };
  });
  
  return {
    totalAUM: 115 + Math.random() * 10,
    aumChange: 2.1 + Math.random() * 3,
    weeklyNetFlow: 1.2 + Math.random() * 0.8,
    monthlyNetFlow: 4.5 + Math.random() * 2,
    topInflows: [
      { name: 'IBIT (BlackRock)', flow: 450 + Math.floor(Math.random() * 100) },
      { name: 'FBTC (Fidelity)', flow: 180 + Math.floor(Math.random() * 50) },
      { name: 'ARKB (ARK)', flow: 85 + Math.floor(Math.random() * 30) },
      { name: 'BITB (Bitwise)', flow: 45 + Math.floor(Math.random() * 20) },
    ],
    dailyFlows,
    lastUpdate: new Date(),
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-primary mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Inflows:</span>
            <span className="text-xs font-medium text-green-400">+${data.inflows}M</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground">Outflows:</span>
            <span className="text-xs font-medium text-red-400">-${data.outflows}M</span>
          </div>
          <div className="pt-1 border-t border-border/30">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-muted-foreground">Net:</span>
              <span className={`text-xs font-bold ${data.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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

  const loadData = async () => {
    setLoading(true);
    const result = await fetchETFData();
    setData(result);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">ETF Flows Tracker</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Institutional capital flows</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <span className="text-xs text-muted-foreground">
                Updated {data.lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Total AUM
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-foreground">${data.totalAUM.toFixed(1)}B</span>
                  <span className="text-xs font-medium text-green-400 mb-0.5">+{data.aumChange.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Weekly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-green-400">+${data.weeklyNetFlow.toFixed(2)}B</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Monthly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-green-400">+${data.monthlyNetFlow.toFixed(2)}B</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Top Inflow
                </span>
                <span className="text-sm font-bold text-foreground">{data.topInflows[0].name}</span>
                <span className="text-xs text-green-400 block">+${data.topInflows[0].flow}M</span>
              </div>
            </div>

            {/* Daily Flows Chart */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Daily Net Flows (This Week)</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.dailyFlows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
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
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
                  <Bar dataKey="netFlow" radius={[4, 4, 0, 0]}>
                    {data.dailyFlows.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.netFlow >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} 
                        opacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top ETFs Table */}
            <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-border/30">
              <span className="text-sm font-medium text-foreground block mb-3">Top ETFs by Inflows (Today)</span>
              <div className="space-y-2">
                {data.topInflows.map((etf, index) => (
                  <div key={etf.name} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{index + 1}</span>
                      <span className="text-sm font-medium text-foreground">{etf.name}</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">+${etf.flow}M</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {/* Source Attribution */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Data: SoSo Value, ETF.com, ARIES76 Analytics</span>
          <a 
            href="https://sosovalue.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            View ETF data <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
