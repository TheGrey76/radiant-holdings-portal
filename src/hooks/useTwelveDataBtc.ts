import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TwelveDataBtcResult {
  bitcoin_price_usd: number | null;
  bitcoin_price_eur: number | null;
  change_24h: number | null;
  timestamp: string | null;
  source: string;
}

export const useTwelveDataBtc = () => {
  const [data, setData] = useState<TwelveDataBtcResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: result, error: fnError } = await supabase.functions.invoke('fetch-twelve-data-btc');
      
      if (fnError) {
        throw new Error(fnError.message);
      }
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err) {
      console.error('Error fetching Twelve Data BTC:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};
