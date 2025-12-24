import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BitcoinReportData {
  timestamp: string;
  bitcoin_price_usd: number;
  bitcoin_price_eur: number;
  m2_value: number;
  real_rate: number;
  current_regime: string;
  regime_confidence: number;
  price_target_low: number;
  price_target_high: number;
  probability: number;
  institutional_target: number;
  raw_data: {
    bitcoin?: {
      market_cap_usd?: number;
      volume_24h?: number;
      change_24h?: number;
    };
    macro?: {
      unemployment_rate?: number;
      inflation_rate?: number;
    };
  };
}

export function useBitcoinReportData() {
  const [data, setData] = useState<BitcoinReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      
      const { data: latestData, error: fetchError } = await supabase
        .from('bitcoin_report_latest')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (latestData) {
        setData(latestData as unknown as BitcoinReportData);
        setLastUpdate(new Date(latestData.timestamp));
      }
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento dati:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiornare manualmente i dati (chiama la edge function)
  const refreshData = async () => {
    try {
      const { data: result, error } = await supabase.functions.invoke('bitcoin-report-updater');
      
      if (error) throw error;
      
      // Ricarica i dati dopo l'aggiornamento
      await fetchLatestData();
      
      return result;
    } catch (err) {
      console.error('Errore nell\'aggiornamento:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLatestData();

    // Sottoscrivi ai cambiamenti in tempo reale
    const channel = supabase
      .channel('bitcoin-report-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bitcoin_report_latest'
        },
        (payload) => {
          console.log('Bitcoin Report data updated:', payload);
          if (payload.new) {
            setData(payload.new as unknown as BitcoinReportData);
            setLastUpdate(new Date((payload.new as any).timestamp));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch: fetchLatestData,
    refreshData,
  };
}
