import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  history: {
    value: number;
    classification: string;
    date: string;
  }[];
}

export const useFearGreedIndex = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error: fnError } = await supabase.functions.invoke('fetch-fear-greed-index');
      
      if (fnError) {
        throw new Error(fnError.message);
      }
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err) {
      console.error('Error fetching Fear & Greed Index:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};
