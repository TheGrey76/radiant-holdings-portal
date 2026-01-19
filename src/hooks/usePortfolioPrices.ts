import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  type: "etf" | "certificates" = "etf",
  autoRefresh: boolean = true,
  refreshInterval: number = 60000
): UsePricesResult => {
  const isinsKey = useMemo(() => [...isins].sort().join(","), [isins]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["portfolio-prices", type, isinsKey],
    enabled: isins.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-portfolio-prices", {
        body: { isins, type },
      });

      if (error) throw new Error(error.message);
      if (!data?.results) {
        return {
          prices: {} as Record<string, PriceData>,
          lastUpdated: null as Date | null,
        };
      }

      const priceMap: Record<string, PriceData> = {};
      (data.results as PriceData[]).forEach((r) => {
        priceMap[r.isin] = r;
      });

      return {
        prices: priceMap,
        lastUpdated: data.timestamp ? new Date(data.timestamp) : new Date(),
      };
    },
    // Important: only auto-refresh if requested
    refetchInterval: autoRefresh && refreshInterval > 0 ? refreshInterval : false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    prices: data?.prices ?? {},
    loading: isLoading || isFetching,
    error: error instanceof Error ? error.message : null,
    lastUpdated: data?.lastUpdated ?? null,
    refetch: async () => {
      await refetch();
    },
  };
};
