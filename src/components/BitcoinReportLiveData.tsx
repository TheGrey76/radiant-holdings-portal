import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Clock, DollarSign, Activity, Target, BarChart3 } from 'lucide-react';
import { useBitcoinReportData } from '@/hooks/useBitcoinReportData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';

export const BitcoinReportLiveData = () => {
  const { data, loading, error, lastUpdate, refreshData } = useBitcoinReportData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success('Data updated successfully');
    } catch (err) {
      toast.error('Error updating data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'EXPANSION':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'STRESS':
        return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'ACCUMULATION':
      default:
        return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    }
  };

  const getRegimeDescription = (regime: string) => {
    switch (regime) {
      case 'EXPANSION':
        return 'Negative real rates favor risk assets';
      case 'STRESS':
        return 'High real rates disfavor risk assets';
      case 'ACCUMULATION':
      default:
        return 'Favorable conditions for gradual accumulation';
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-zinc-800" />
          <Skeleton className="h-4 w-32 bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
        <p className="text-zinc-400 mb-4">
          {error || 'No data available. Click to refresh.'}
        </p>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Load Data
        </Button>
      </div>
    );
  }

  const change24h = data.raw_data?.bitcoin?.change_24h || 0;
  const isPositive = change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Live Report Data</h3>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock className="w-3 h-3" />
              {lastUpdate && <span>Updated: {formatDate(lastUpdate)}</span>}
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                Live
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Bitcoin Price */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            <span>BTC Price</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatPrice(data.bitcoin_price_usd)}
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change24h.toFixed(2)}%
          </div>
        </div>

        {/* Current Regime */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Current Regime</span>
          </div>
          <div className={`inline-flex px-3 py-1 rounded-full border text-sm font-semibold ${getRegimeColor(data.current_regime)}`}>
            {data.current_regime}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Confidence: {formatPercent(data.regime_confidence)}
          </div>
        </div>

        {/* Price Target Range */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
            <Target className="w-4 h-4" />
            <span>2026 Target Range</span>
          </div>
          <div className="text-lg font-bold text-white">
            {formatPrice(data.price_target_low)} - {formatPrice(data.price_target_high)}
          </div>
          <div className="text-xs text-zinc-500">
            Probability: {formatPercent(data.probability)}
          </div>
        </div>

        {/* Institutional Target */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
            <Activity className="w-4 h-4" />
            <span>Institutional Target</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {formatPrice(data.institutional_target)}
          </div>
          <div className="text-xs text-zinc-500">
            Probability-Weighted
          </div>
        </div>
      </div>

      {/* Regime Description */}
      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 ${
            data.current_regime === 'EXPANSION' ? 'bg-emerald-400' :
            data.current_regime === 'STRESS' ? 'bg-red-400' : 'bg-orange-400'
          }`} />
          <div>
            <p className="text-zinc-300 text-sm">
              <strong>{data.current_regime} Regime:</strong> {getRegimeDescription(data.current_regime)}
            </p>
            {data.real_rate !== 0 && (
              <p className="text-zinc-500 text-xs mt-1">
                Current real rate: {data.real_rate.toFixed(2)}% | M2: ${(data.m2_value / 1000).toFixed(1)}B
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>Sources: CoinGecko (Bitcoin), FRED (Macro Data)</span>
        <span>Auto-updated daily at 6:00 AM CET</span>
      </div>
    </motion.div>
  );
};

export default BitcoinReportLiveData;
