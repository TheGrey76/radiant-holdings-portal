import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink, BarChart3 } from 'lucide-react';
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
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-orange-400 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Inflows:</span>
            <span className="text-xs font-medium text-emerald-400">+${data.inflows}M</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-zinc-400">Outflows:</span>
            <span className="text-xs font-medium text-red-400">-${data.outflows}M</span>
          </div>
          <div className="pt-1 border-t border-zinc-700">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-zinc-400">Net:</span>
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
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ETF Flows Tracker</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Institutional capital flows</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <span className="text-xs text-zinc-500">
                Updated {data.lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                <Skeleton key={i} className="h-20 rounded-xl bg-zinc-800" />
              ))}
            </div>
            <Skeleton className="h-48 rounded-xl bg-zinc-800" />
          </div>
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Total AUM
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-white">${data.totalAUM.toFixed(1)}B</span>
                  <span className="text-xs font-medium text-emerald-400 mb-0.5">+{data.aumChange.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Weekly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">+${data.weeklyNetFlow.toFixed(2)}B</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Monthly Net Flow
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">+${data.monthlyNetFlow.toFixed(2)}B</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Top Inflow
                </span>
                <span className="text-sm font-bold text-white">{data.topInflows[0].name}</span>
                <span className="text-xs text-emerald-400 block">+${data.topInflows[0].flow}M</span>
              </div>
            </div>

            {/* Daily Flows Chart */}
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-white">Daily Net Flows (This Week)</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.dailyFlows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    tickFormatter={(value) => `$${value}M`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.5 }} />
                  <ReferenceLine y={0} stroke="#52525b" strokeWidth={1} />
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
            <div className="mt-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-sm font-medium text-white block mb-3">Top ETFs by Inflows (Today)</span>
              <div className="space-y-2">
                {data.topInflows.map((etf, index) => (
                  <div key={etf.name} className="flex items-center justify-between py-2 border-b border-zinc-700/40 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-500 w-4">{index + 1}</span>
                      <span className="text-sm font-medium text-zinc-200">{etf.name}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">+${etf.flow}M</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {/* Source Attribution */}
        <div className="mt-6 pt-4 border-t border-zinc-700/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Data: SoSo Value, ETF.com, ARIES76 Analytics</span>
          <a 
            href="https://sosovalue.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-orange-400 transition-colors"
          >
            View ETF data <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};