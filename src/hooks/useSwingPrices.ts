import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface StockPrice {
  ticker: string;
  name: string;
  price: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  previous_close: number | null;
  change: number | null;
  percent_change: number | null;
  volume: number | null;
  exchange: string | null;
  currency: string;
  week_high?: number | null;
  week_low?: number | null;
  week_start?: string | null;
  error?: string;
}

export function useSwingPrices(tickers: string[], refreshInterval = 120000) {
  const tickersKey = useMemo(
    () => [...tickers].sort().join(","),
    [tickers]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["swing-prices", tickersKey],
    enabled: tickers.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "fetch-swing-prices",
        {
          body: { tickers },
        }
      );

      if (error) throw new Error(error.message);
      return data as {
        prices: Record<string, StockPrice>;
        timestamp: string;
      };
    },
    refetchInterval: refreshInterval,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    prices: data?.prices ?? {},
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    lastUpdated: data?.timestamp ? new Date(data.timestamp) : null,
    refetch: async () => {
      await refetch();
    },
  };
}
