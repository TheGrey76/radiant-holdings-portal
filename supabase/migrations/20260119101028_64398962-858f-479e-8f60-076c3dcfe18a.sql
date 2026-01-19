-- Create table for Bitcoin allocation models (portfolio management)
CREATE TABLE public.bitcoin_allocation_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name text NOT NULL, -- 'conservative', 'balanced', 'aggressive'
  display_name text NOT NULL,
  description text,
  current_allocation numeric NOT NULL DEFAULT 0,
  allocation_min numeric NOT NULL DEFAULT 0,
  allocation_max numeric NOT NULL DEFAULT 100,
  historical_mean numeric NOT NULL DEFAULT 0,
  distance_from_mean text, -- e.g., '+0.3σ', 'At mean', '-0.5σ'
  current_regime text NOT NULL DEFAULT 'Neutral', -- 'Neutral', 'Expansion', 'Contraction'
  target_range_low numeric,
  target_range_high numeric,
  stress_floor numeric,
  exposure_level text NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
  color_theme text NOT NULL DEFAULT 'amber', -- 'emerald', 'amber', 'orange'
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bitcoin_allocation_models ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for paid users to see the models)
CREATE POLICY "Anyone can view allocation models" 
ON public.bitcoin_allocation_models 
FOR SELECT 
USING (true);

-- Service role can manage (for admin updates)
CREATE POLICY "Service role can manage allocation models" 
ON public.bitcoin_allocation_models 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create table for quarterly commentary
CREATE TABLE public.bitcoin_quarterly_commentary (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quarter text NOT NULL, -- 'Q1 2026', 'Q2 2026', etc.
  year integer NOT NULL,
  commentary_text text NOT NULL,
  regime_summary text,
  is_current boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bitcoin_quarterly_commentary ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view quarterly commentary" 
ON public.bitcoin_quarterly_commentary 
FOR SELECT 
USING (true);

-- Service role can manage
CREATE POLICY "Service role can manage quarterly commentary" 
ON public.bitcoin_quarterly_commentary 
FOR ALL 
USING (auth.role() = 'service_role');

-- Insert initial model data
INSERT INTO public.bitcoin_allocation_models (model_name, display_name, description, current_allocation, allocation_min, allocation_max, historical_mean, distance_from_mean, current_regime, target_range_low, target_range_high, stress_floor, exposure_level, color_theme, sort_order)
VALUES 
  ('conservative', 'Conservative Model', 'Exposure control focus', 5, 0, 10, 5, 'At mean', 'Neutral', 85000, 120000, 52000, 'Low', 'emerald', 1),
  ('balanced', 'Balanced Model', 'Cycle-aware participation', 12, 5, 20, 12.5, '-0.5σ', 'Expansion', 100000, 165000, 58000, 'Medium', 'amber', 2),
  ('aggressive', 'Aggressive Model', 'Asymmetric long-term exposure', 25, 10, 40, 25, '+0.3σ', 'Expansion', 130000, 258000, 65000, 'High', 'orange', 3);

-- Insert initial quarterly commentary
INSERT INTO public.bitcoin_quarterly_commentary (quarter, year, commentary_text, regime_summary, is_current)
VALUES 
  ('Q1', 2026, 'All three models currently operate within their expected allocation ranges given the prevailing macro-liquidity environment. The Conservative Model remains at its historical mean (5%), reflecting neutral positioning despite elevated Bitcoin prices. The Balanced Model sits slightly below its long-term average, consistent with the model''s tendency to reduce exposure during rapid price appreciation phases.

The Aggressive Model maintains elevated exposure (25%), which aligns with its design philosophy of capturing asymmetric upside during expansion regimes. Current M2 growth trajectories and real rate dynamics support this positioning—though the model makes no judgment on near-term price direction.', 
  'The macro-liquidity framework currently labels the environment as "Expansion" based on global M2 growth exceeding 8% YoY and real rates remaining below historical averages. This classification does not imply that Bitcoin will rise—it describes the structural backdrop within which the models operate.',
  true);