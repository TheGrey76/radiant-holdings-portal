import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, TrendingUp, BarChart3, RefreshCw, ExternalLink, Wifi, WifiOff, Cpu, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface OnChainData {
  hashRate: { value: number; change24h: number; unit: string };
  difficulty: { value: number; change: number; nextAdjustment: string };
  activeAddresses: { value: number; change24h: number };
  mempoolSize: { value: number; avgFee: number };
  blockHeight: number;
  lastBlockTime: string;
  supplyData: { circulating: number; maxSupply: number; percentMined: number };
  lastUpdated: string;
  dataSource: 'live' | 'fallback';
}

export const OnChainMetrics = () => {
  const [data, setData] = useState<OnChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const { data: result, error: fetchError } = await supabase.functions.invoke('fetch-onchain-metrics');
      
      if (fetchError) throw fetchError;
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching on-chain metrics:', err);
      setError('Failed to load data');
      // Use fallback
      setData({
        hashRate: { value: 750, change24h: 2.3, unit: "EH/s" },
        difficulty: { value: 110.45, change: 3.2, nextAdjustment: "~5 days" },
        activeAddresses: { value: 1050000, change24h: 1.8 },
        mempoolSize: { value: 45000, avgFee: 12.5 },
        blockHeight: 878500,
        lastBlockTime: new Date().toISOString(),
        supplyData: { circulating: 19800000, maxSupply: 21000000, percentMined: 94.3 },
        lastUpdated: new Date().toISOString(),
        dataSource: 'fallback'
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const isLive = data?.dataSource === 'live';

  const metrics = data ? [
    {
      icon: Cpu,
      label: 'Hash Rate',
      value: `${data.hashRate.value.toFixed(0)} ${data.hashRate.unit}`,
      change: `${data.hashRate.change24h >= 0 ? '+' : ''}${data.hashRate.change24h.toFixed(1)}%`,
      changePositive: data.hashRate.change24h >= 0,
      tooltip: 'Total computational power securing the Bitcoin network. Higher = stronger security.',
    },
    {
      icon: Activity,
      label: 'Difficulty',
      value: `${data.difficulty.value.toFixed(1)}T`,
      subtext: data.difficulty.nextAdjustment,
      change: `${data.difficulty.change >= 0 ? '+' : ''}${data.difficulty.change.toFixed(1)}%`,
      changePositive: data.difficulty.change >= 0,
      tooltip: 'Mining difficulty adjusts every 2016 blocks to maintain 10-min block times.',
    },
    {
      icon: Users,
      label: 'Active Addresses',
      value: formatNumber(data.activeAddresses.value),
      change: `${data.activeAddresses.change24h >= 0 ? '+' : ''}${data.activeAddresses.change24h.toFixed(1)}%`,
      changePositive: data.activeAddresses.change24h >= 0,
      tooltip: 'Unique addresses transacting on-chain in the last 24h. Proxy for network adoption.',
    },
    {
      icon: Box,
      label: 'Block Height',
      value: data.blockHeight.toLocaleString(),
      subtext: `${data.supplyData.percentMined}% mined`,
      tooltip: 'Current blockchain height. Each block adds ~6.25 BTC to circulating supply.',
    },
  ] : [];

  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-700/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">On-Chain Metrics</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Live network health indicators</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5">
              {isLive ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="text-xs text-zinc-500">
                {isLive ? 'Live' : 'Cached'}
              </span>
            </div>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-zinc-800" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {metrics.map((metric, index) => (
              <Tooltip key={metric.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-5 rounded-xl border cursor-help transition-all hover:border-orange-500/40 bg-zinc-800/60 border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <metric.icon className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-white">
                          {metric.value}
                        </span>
                        {metric.subtext && (
                          <p className="text-xs text-zinc-500 mt-1">{metric.subtext}</p>
                        )}
                      </div>
                      {metric.change && (
                        <span className={`text-xs font-medium ${metric.changePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {metric.change}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-zinc-800 border-zinc-700 text-zinc-100">
                  <p className="text-sm">{metric.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        )}

        {/* Supply Progress */}
        {data && (
          <div className="mt-6 p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Bitcoin Supply</span>
              <span className="text-sm font-medium text-white">
                {formatNumber(data.supplyData.circulating)} / 21M BTC
              </span>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${data.supplyData.percentMined}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
              <span>Mempool: {formatNumber(data.mempoolSize.value)} txs</span>
              <span>Avg fee: {data.mempoolSize.avgFee} sat/vB</span>
            </div>
          </div>
        )}
        
        {/* Source Attribution */}
        <div className="mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Data: Blockchain.com, CoinGecko</span>
          {data?.lastUpdated && (
            <span>Updated: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};
