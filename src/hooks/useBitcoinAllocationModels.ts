import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AllocationModel {
  id: string;
  model_name: string;
  display_name: string;
  description: string | null;
  current_allocation: number;
  allocation_min: number;
  allocation_max: number;
  historical_mean: number;
  distance_from_mean: string | null;
  current_regime: string;
  target_range_low: number | null;
  target_range_high: number | null;
  stress_floor: number | null;
  exposure_level: string;
  color_theme: string;
  sort_order: number;
  updated_at: string;
}

export interface QuarterlyCommentary {
  id: string;
  quarter: string;
  year: number;
  commentary_text: string;
  regime_summary: string | null;
  is_current: boolean;
  published_at: string;
  updated_at: string;
}

export function useBitcoinAllocationModels() {
  const [models, setModels] = useState<AllocationModel[]>([]);
  const [commentary, setCommentary] = useState<QuarterlyCommentary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const hasFetched = useRef(false);

  const fetchData = async (isInitial = false) => {
    try {
      // Only show loading on initial fetch
      if (isInitial) {
        setLoading(true);
      }
      
      // Fetch allocation models
      const { data: modelsData, error: modelsError } = await supabase
        .from('bitcoin_allocation_models')
        .select('*')
        .order('sort_order', { ascending: true });

      if (modelsError) throw modelsError;

      // Fetch current quarterly commentary
      const { data: commentaryData, error: commentaryError } = await supabase
        .from('bitcoin_quarterly_commentary')
        .select('*')
        .eq('is_current', true)
        .maybeSingle();

      if (commentaryError) throw commentaryError;

      if (modelsData) {
        setModels(modelsData as unknown as AllocationModel[]);
        // Get the most recent update timestamp
        const latestUpdate = modelsData.reduce((latest, model) => {
          const modelDate = new Date(model.updated_at);
          return modelDate > latest ? modelDate : latest;
        }, new Date(0));
        setLastUpdate(latestUpdate);
      }

      if (commentaryData) {
        setCommentary(commentaryData as unknown as QuarterlyCommentary);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading allocation models:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent double fetch in development mode
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchData(true);
  }, []);

  // Helper to get model by name
  const getModel = (name: 'conservative' | 'balanced' | 'aggressive') => {
    return models.find(m => m.model_name === name) || null;
  };

  // Get current quarter string
  const getCurrentQuarter = () => {
    if (commentary) {
      return `${commentary.quarter} ${commentary.year}`;
    }
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    return `Q${quarter} ${now.getFullYear()}`;
  };

  return {
    models,
    commentary,
    loading,
    error,
    lastUpdate,
    refetch: () => fetchData(false),
    getModel,
    getCurrentQuarter,
  };
}
