-- Table for AI-generated crypto outlook
CREATE TABLE public.crypto_portfolio_outlook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  current_status TEXT,
  drivers TEXT[] DEFAULT '{}',
  medium_term_outlook TEXT,
  medium_term_sentiment TEXT DEFAULT 'neutral' CHECK (medium_term_sentiment IN ('bullish','neutral','bearish','speculative')),
  long_term_outlook TEXT,
  long_term_sentiment TEXT DEFAULT 'neutral' CHECK (long_term_sentiment IN ('bullish','neutral','bearish','speculative')),
  risks TEXT[] DEFAULT '{}',
  ai_commentary TEXT,
  fear_greed_at_update INTEGER,
  price_usd_at_update NUMERIC,
  change_24h_at_update NUMERIC,
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crypto_portfolio_outlook ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read crypto outlook"
  ON public.crypto_portfolio_outlook FOR SELECT USING (true);

-- Seed initial data (will be overwritten by AI)
INSERT INTO public.crypto_portfolio_outlook (symbol, name, medium_term_sentiment, long_term_sentiment) VALUES
  ('TON', 'Toncoin', 'neutral', 'bullish'),
  ('LINK', 'Chainlink', 'bullish', 'bullish'),
  ('ONDO', 'Ondo Finance', 'bullish', 'bullish'),
  ('TAO', 'Bittensor', 'speculative', 'speculative'),
  ('RENDER', 'Render Network', 'speculative', 'neutral'),
  ('SUI', 'Sui Network', 'neutral', 'bullish'),
  ('AAVE', 'Aave Protocol', 'neutral', 'neutral'),
  ('RSR', 'Reserve Rights', 'bearish', 'neutral');