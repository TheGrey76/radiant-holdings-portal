-- Create portfolio_metrics table for storing portfolio analysis data
CREATE TABLE IF NOT EXISTS public.portfolio_metrics (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assets TEXT[] NOT NULL,
  weights FLOAT8[] NOT NULL,
  metrics JSONB NOT NULL,
  timeframe TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_metrics_created_at 
ON public.portfolio_metrics(created_at DESC);

-- Create sentiment_metrics table for storing sentiment analysis data
CREATE TABLE IF NOT EXISTS public.sentiment_metrics (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fear_greed_index INT4 NOT NULL,
  mvrv_zscore FLOAT8,
  active_addresses INT8,
  exchange_flows FLOAT8,
  interpretation TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sentiment_metrics_created_at 
ON public.sentiment_metrics(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on portfolio_metrics"
ON public.portfolio_metrics FOR SELECT
USING (true);

CREATE POLICY "Allow public read on sentiment_metrics"
ON public.sentiment_metrics FOR SELECT
USING (true);

-- Create policies for service role write access (edge functions)
CREATE POLICY "Allow service role insert on portfolio_metrics"
ON public.portfolio_metrics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow service role insert on sentiment_metrics"
ON public.sentiment_metrics FOR INSERT
WITH CHECK (true);