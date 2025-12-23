-- Create table for Bitcoin Treasury data
CREATE TABLE public.bitcoin_treasuries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  ticker TEXT,
  country TEXT,
  bitcoin_holdings NUMERIC NOT NULL,
  btc_price_usd NUMERIC,
  value_usd NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ticker)
);

-- Enable RLS
ALTER TABLE public.bitcoin_treasuries ENABLE ROW LEVEL SECURITY;

-- Allow public read access (this is public market data)
CREATE POLICY "Bitcoin treasuries are publicly readable" 
ON public.bitcoin_treasuries 
FOR SELECT 
USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage treasuries" 
ON public.bitcoin_treasuries 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for fast queries
CREATE INDEX idx_bitcoin_treasuries_rank ON public.bitcoin_treasuries(rank);

-- Add trigger for updated_at
CREATE TRIGGER update_bitcoin_treasuries_updated_at
BEFORE UPDATE ON public.bitcoin_treasuries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();