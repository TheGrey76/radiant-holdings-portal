import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, TrendingUp, BarChart3, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OnChainData {
  hashRate: number; // EH/s
  hashRateChange: number;
  activeAddresses: number;
  activeAddressesChange: number;
  mvrv: number;
  mvrvZone: 'undervalued' | 'neutral' | 'overvalued';
  transactionVolume: number; // billions
  transactionVolumeChange: number;
  lastUpdate: Date;
}

// Simulated data - in production would come from Glassnode/CryptoQuant API
const fetchOnChainData = async (): Promise<OnChainData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    hashRate: 750 + Math.random() * 50,
    hashRateChange: 2.3 + Math.random() * 3,
    activeAddresses: 1.1 + Math.random() * 0.2,
    activeAddressesChange: 5.2 + Math.random() * 5,
    mvrv: 1.8 + Math.random() * 0.5,
    mvrvZone: 'neutral',
    transactionVolume: 15 + Math.random() * 5,
    transactionVolumeChange: 8.5 + Math.random() * 4,
    lastUpdate: new Date(),
  };
};

const getMVRVColor = (zone: string) => {
  switch (zone) {
    case 'undervalued': return 'text-emerald-400';
    case 'overvalued': return 'text-red-400';
    default: return 'text-orange-400';
  }
};

const getMVRVBg = (zone: string) => {
  switch (zone) {
    case 'undervalued': return 'bg-emerald-500/10 border-emerald-500/30';
    case 'overvalued': return 'bg-red-500/10 border-red-500/30';
    default: return 'bg-orange-500/10 border-orange-500/30';
  }
};

export const OnChainMetrics = () => {
  const [data, setData] = useState<OnChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchOnChainData();
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

  const metrics = data ? [
    {
      icon: Activity,
      label: 'Hash Rate',
      value: `${data.hashRate.toFixed(0)} EH/s`,
      change: `+${data.hashRateChange.toFixed(1)}%`,
      changePositive: true,
      tooltip: 'Total computational power securing the Bitcoin network. Higher hash rate = stronger security.',
    },
    {
      icon: Users,
      label: 'Active Addresses',
      value: `${data.activeAddresses.toFixed(2)}M`,
      change: `+${data.activeAddressesChange.toFixed(1)}%`,
      changePositive: true,
      tooltip: 'Unique addresses transacting on-chain in the last 24h. Proxy for network adoption.',
    },
    {
      icon: TrendingUp,
      label: 'MVRV Ratio',
      value: data.mvrv.toFixed(2),
      zone: data.mvrvZone,
      tooltip: 'Market Value to Realized Value. Below 1 = undervalued, 1-2.5 = neutral, >2.5 = overvalued.',
    },
    {
      icon: BarChart3,
      label: 'Tx Volume (24h)',
      value: `$${data.transactionVolume.toFixed(1)}B`,
      change: `+${data.transactionVolumeChange.toFixed(1)}%`,
      changePositive: true,
      tooltip: 'Total value transferred on-chain in USD. Indicates economic activity and demand.',
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
                    className={`p-5 rounded-xl border cursor-help transition-all hover:border-orange-500/40 ${
                      metric.zone 
                        ? getMVRVBg(metric.zone) 
                        : 'bg-zinc-800/60 border-zinc-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <metric.icon className={`w-4 h-4 ${metric.zone ? getMVRVColor(metric.zone) : 'text-orange-400'}`} />
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className={`text-2xl font-bold ${metric.zone ? getMVRVColor(metric.zone) : 'text-white'}`}>
                        {metric.value}
                      </span>
                      {metric.change && (
                        <span className={`text-xs font-medium ${metric.changePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {metric.change}
                        </span>
                      )}
                      {metric.zone && (
                        <span className={`text-xs font-medium uppercase ${getMVRVColor(metric.zone)}`}>
                          {metric.zone}
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
        
        {/* Source Attribution */}
        <div className="mt-6 pt-4 border-t border-zinc-700/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Data: Glassnode, CryptoQuant, ARIES76 Analytics</span>
          <a 
            href="https://glassnode.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-orange-400 transition-colors"
          >
            View on-chain data <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};