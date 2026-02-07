-- Create a simple price cache table for swing prices
CREATE TABLE public.swing_price_cache (
  ticker TEXT PRIMARY KEY,
  price_data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allow anonymous access (same as other swing tables)
ALTER TABLE public.swing_price_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read on swing_price_cache"
  ON public.swing_price_cache FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert on swing_price_cache"
  ON public.swing_price_cache FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update on swing_price_cache"
  ON public.swing_price_cache FOR UPDATE USING (true);
