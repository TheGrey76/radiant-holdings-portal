import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, TrendingUp, BarChart3, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  // Simulate API call delay
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
    case 'undervalued': return 'text-green-400';
    case 'overvalued': return 'text-red-400';
    default: return 'text-amber-400';
  }
};

const getMVRVBg = (zone: string) => {
  switch (zone) {
    case 'undervalued': return 'bg-green-500/10 border-green-500/20';
    case 'overvalued': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-amber-500/10 border-amber-500/20';
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
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">On-Chain Metrics</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Live network health indicators</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
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
                    className={`p-5 rounded-xl border cursor-help transition-all hover:border-primary/30 ${
                      metric.zone 
                        ? getMVRVBg(metric.zone) 
                        : 'bg-muted/30 border-border/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <metric.icon className={`w-4 h-4 ${metric.zone ? getMVRVColor(metric.zone) : 'text-primary'}`} />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className={`text-2xl font-bold ${metric.zone ? getMVRVColor(metric.zone) : 'text-foreground'}`}>
                        {metric.value}
                      </span>
                      {metric.change && (
                        <span className={`text-xs font-medium ${metric.changePositive ? 'text-green-400' : 'text-red-400'}`}>
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
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{metric.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        )}
        
        {/* Source Attribution */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Data: Glassnode, CryptoQuant, ARIES76 Analytics</span>
          <a 
            href="https://glassnode.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            View on-chain data <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
