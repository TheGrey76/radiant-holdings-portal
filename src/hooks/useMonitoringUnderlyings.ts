import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Underlying {
  id: string;
  name: string;
  ticker: string;
  certificate: string;
  certificateId: string;
  barrier: number;
  strikePrice: number;
  currentPrice: number;
  lastUpdate: string;
}

interface PortfolioHolding {
  position_label: string;
  isin: string;
  name: string;
  underlyings: string;
  coupon_barrier: string;
  capital_barrier: string;
}

// Mapping of underlying names to their tickers and strike prices
const UNDERLYING_CONFIG: Record<string, { ticker: string; strikePrice: number }> = {
  // Certificate A - UBS Italian Basket (new)
  'Stellantis': { ticker: 'STLA.MI', strikePrice: 12.50 },
  'Nexi': { ticker: 'NEXI.MI', strikePrice: 5.80 },
  'STM': { ticker: 'STM', strikePrice: 24.00 },
  'STMicroelectronics': { ticker: 'STM', strikePrice: 24.00 },
  
  // Certificate B - Healthcare
  'Novo Nordisk': { ticker: 'NVO', strikePrice: 110.00 },
  'Merck KGaA': { ticker: 'MRK.DE', strikePrice: 150.00 },
  'CVS Health': { ticker: 'CVS', strikePrice: 58.00 },
  
  // Certificate C - Italian Large Caps
  'Intesa Sanpaolo': { ticker: 'ISP.MI', strikePrice: 3.80 },
  'Eni': { ticker: 'ENI.MI', strikePrice: 14.00 },
  
  // Certificate D - Luxury
  'Ferrari': { ticker: 'RACE.MI', strikePrice: 420.00 },
  'Brunello Cucinelli': { ticker: 'BC.MI', strikePrice: 95.00 },
  'Campari': { ticker: 'CPR.MI', strikePrice: 6.50 },
  
  // Old Certificate A underlyings (for historical reference)
  'Enel': { ticker: 'ENEL.MI', strikePrice: 6.50 },
  'Alphabet': { ticker: 'GOOGL', strikePrice: 175.00 },
  'UniCredit': { ticker: 'UCG.MI', strikePrice: 38.00 },
};

function parseBarrier(barrierStr: string): number {
  if (!barrierStr) return 65;
  const match = barrierStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 65;
}

function parseUnderlyings(underlyingsStr: string): string[] {
  if (!underlyingsStr) return [];
  return underlyingsStr.split(',').map(u => u.trim()).filter(Boolean);
}

function generateCertificateName(positionLabel: string, name: string): string {
  const labelMap: Record<string, string> = {
    'A': 'A - UBS Italian Basket',
    'B': 'B - UBS Phoenix Healthcare',
    'C': 'C - UBS Memory Cash Collect',
    'D': 'D - Barclays Phoenix Luxury',
    'E': 'E - Barclays Capital Protected',
  };
  return labelMap[positionLabel] || `${positionLabel} - ${name}`;
}

export function useMonitoringUnderlyings() {
  const [underlyings, setUnderlyings] = useState<Underlying[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnderlyings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get portfolio configuration
      const { data: configData, error: configError } = await supabase
        .from('portfolio_configurations')
        .select('id')
        .eq('client_code', 'GU')
        .eq('is_active', true)
        .single();

      if (configError) throw configError;

      // Get holdings
      const { data: holdings, error: holdingsError } = await supabase
        .from('portfolio_holdings')
        .select('position_label, isin, name, underlyings, coupon_barrier, capital_barrier')
        .eq('portfolio_id', configData.id)
        .order('position_label');

      if (holdingsError) throw holdingsError;

      // Transform holdings to underlyings
      const transformedUnderlyings: Underlying[] = [];

      for (const holding of holdings as PortfolioHolding[]) {
        // Skip capital protected products (no underlyings to monitor)
        if (holding.position_label === 'E') continue;

        const barrier = parseBarrier(holding.capital_barrier);
        const underlyingNames = parseUnderlyings(holding.underlyings);
        const certificateName = generateCertificateName(holding.position_label, holding.name);

        for (const underlyingName of underlyingNames) {
          const config = UNDERLYING_CONFIG[underlyingName];
          if (config) {
            transformedUnderlyings.push({
              id: underlyingName.toLowerCase().replace(/\s+/g, '-'),
              name: underlyingName,
              ticker: config.ticker,
              certificate: certificateName,
              certificateId: holding.isin,
              barrier,
              strikePrice: config.strikePrice,
              currentPrice: 0,
              lastUpdate: '',
            });
          }
        }
      }

      setUnderlyings(transformedUnderlyings);
    } catch (err) {
      console.error('Error fetching underlyings:', err);
      setError(err instanceof Error ? err.message : 'Error loading underlyings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnderlyings();
  }, [fetchUnderlyings]);

  return {
    underlyings,
    loading,
    error,
    refetch: fetchUnderlyings,
  };
}
