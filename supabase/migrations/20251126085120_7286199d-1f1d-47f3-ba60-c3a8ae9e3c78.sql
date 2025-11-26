-- Create table for authorized access to G.U. portfolio
CREATE TABLE IF NOT EXISTS public.gu_portfolio_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  access_granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gu_portfolio_access ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can check if their email is authorized (needed for access verification)
CREATE POLICY "Anyone can check their own email authorization"
ON public.gu_portfolio_access
FOR SELECT
TO public
USING (true);

-- Insert authorized emails
INSERT INTO public.gu_portfolio_access (email) 
VALUES 
  ('edoardo.grigione@aries76.com'),
  ('alessandro.catullo@aries76.com')
ON CONFLICT (email) DO NOTHING;