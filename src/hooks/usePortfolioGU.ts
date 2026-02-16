import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PortfolioHolding {
  id: string;
  position_label: string;
  isin: string;
  issuer: string;
  name: string;
  allocation_percent: number;
  allocation_amount: number;
  coupon_pa: string | null;
  coupon_frequency: string | null;
  coupon_barrier: string | null;
  capital_barrier: string | null;
  maturity_date: string | null;
  underlyings: string | null;
  role: string | null;
  replaced_isin: string | null;
  replaced_at: string | null;
}

export interface PortfolioConfig {
  id: string;
  client_code: string;
  client_name: string;
  total_value: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  notes: string | null;
  holdings: PortfolioHolding[];
}

interface ReplacementData {
  positionLabel: string;
  oldIsin: string;
  oldName: string;
  newCertificate: {
    isin: string;
    issuer: string;
    name: string;
    couponPa: string;
    couponFrequency: string;
    couponBarrier: string;
    capitalBarrier: string;
    maturity: string;
    underlyings: string;
  };
  reason?: string;
}

export function usePortfolioGU() {
  const [portfolio, setPortfolio] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the portfolio configuration for GU
      const { data: configData, error: configError } = await supabase
        .from('portfolio_configurations')
        .select('*')
        .eq('client_code', 'GU')
        .eq('is_active', true)
        .maybeSingle();

      if (configError) throw configError;
      
      if (!configData) {
        // Auth may not be ready yet — retry once after a short delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data: retryData, error: retryError } = await supabase
          .from('portfolio_configurations')
          .select('*')
          .eq('client_code', 'GU')
          .eq('is_active', true)
          .maybeSingle();
        if (retryError) throw retryError;
        if (!retryData) throw new Error('Portfolio GU non trovato');
        Object.assign(configData ?? {}, retryData);
        // Use retryData for the rest
        const { data: holdingsData, error: holdingsError } = await supabase
          .from('portfolio_holdings')
          .select('*')
          .eq('portfolio_id', retryData.id)
          .order('position_label');
        if (holdingsError) throw holdingsError;
        setPortfolio({ ...retryData, holdings: holdingsData || [] });
        return;
      }

      // Then get the holdings
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('portfolio_id', configData.id)
        .order('position_label');

      if (holdingsError) throw holdingsError;

      setPortfolio({
        ...configData,
        holdings: holdingsData || []
      });
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err instanceof Error ? err.message : 'Error loading portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const replaceCertificate = async (data: ReplacementData): Promise<boolean> => {
    if (!portfolio) return false;

    try {
      setSaving(true);

      // Find the holding to replace
      const holdingToReplace = portfolio.holdings.find(
        h => h.position_label === data.positionLabel && h.isin === data.oldIsin
      );

      if (!holdingToReplace) {
        throw new Error(`Holding not found: ${data.positionLabel} - ${data.oldIsin}`);
      }

      // Update the holding with new certificate data
      const { error: updateError } = await supabase
        .from('portfolio_holdings')
        .update({
          isin: data.newCertificate.isin,
          issuer: data.newCertificate.issuer,
          name: data.newCertificate.name,
          coupon_pa: data.newCertificate.couponPa,
          coupon_frequency: data.newCertificate.couponFrequency,
          coupon_barrier: data.newCertificate.couponBarrier,
          capital_barrier: data.newCertificate.capitalBarrier,
          underlyings: data.newCertificate.underlyings,
          replaced_isin: data.oldIsin,
          replaced_at: new Date().toISOString()
        })
        .eq('id', holdingToReplace.id);

      if (updateError) throw updateError;

      // Log the change
      const { error: logError } = await supabase
        .from('portfolio_change_log')
        .insert({
          portfolio_id: portfolio.id,
          change_type: 'replacement',
          old_isin: data.oldIsin,
          new_isin: data.newCertificate.isin,
          old_name: data.oldName,
          new_name: data.newCertificate.name,
          position_label: data.positionLabel,
          reason: data.reason || 'Certificate closed/matured'
        });

      if (logError) {
        console.error('Error logging change:', logError);
        // Don't throw - logging is not critical
      }

      // Update portfolio updated_at
      await supabase
        .from('portfolio_configurations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', portfolio.id);

      toast.success('Portafoglio aggiornato con successo!');
      
      // Refresh the portfolio data
      await fetchPortfolio();
      
      return true;
    } catch (err) {
      console.error('Error replacing certificate:', err);
      toast.error('Errore durante la sostituzione');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getChangeHistory = async () => {
    if (!portfolio) return [];

    const { data, error } = await supabase
      .from('portfolio_change_log')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Error fetching change history:', error);
      return [];
    }

    return data;
  };

  return {
    portfolio,
    loading,
    saving,
    error,
    refetch: fetchPortfolio,
    replaceCertificate,
    getChangeHistory
  };
}
