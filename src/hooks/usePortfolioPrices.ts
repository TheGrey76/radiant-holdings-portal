import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PriceData {
  isin: string;
  ticker?: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  source: string;
  error?: string;
}

interface UsePricesResult {
  prices: Record<string, PriceData>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export const usePortfolioPrices = (
  isins: string[],
  type: 'etf' | 'certificates' = 'etf',
  autoRefresh: boolean = true,
  refreshInterval: number = 60000 // 1 minute default
): UsePricesResult => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Stabilize isins reference to prevent infinite loops
  const isinsKey = isins.join(',');
  const isinsRef = useRef(isins);
  isinsRef.current = isins;

  const fetchPrices = useCallback(async () => {
    const currentIsins = isinsRef.current;
    if (currentIsins.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-portfolio-prices', {
        body: { isins: currentIsins, type }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.results) {
        const priceMap: Record<string, PriceData> = {};
        data.results.forEach((result: PriceData) => {
          priceMap[result.isin] = result;
        });
        setPrices(priceMap);
        setLastUpdated(new Date(data.timestamp));
      }
    } catch (err) {
      console.error('Error fetching portfolio prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, [isinsKey, type]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchPrices]);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refetch: fetchPrices
  };
};
