-- Create access control tables for confidential proposal pages
-- Following the gu_portfolio_access pattern

-- ABC Company Console Access
CREATE TABLE IF NOT EXISTS public.abc_console_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  access_granted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_console_access ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check their own email authorization
CREATE POLICY "Anyone can check their own email authorization"
  ON public.abc_console_access
  FOR SELECT
  USING (true);

-- Asset GU Access (separate from gu_portfolio_access which is for structured products)
CREATE TABLE IF NOT EXISTS public.asset_gu_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  access_granted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.asset_gu_access ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check their own email authorization
CREATE POLICY "Anyone can check their own email authorization"
  ON public.asset_gu_access
  FOR SELECT
  USING (true);

-- Underlying Monitoring Access
CREATE TABLE IF NOT EXISTS public.monitoring_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  access_granted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monitoring_access ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check their own email authorization
CREATE POLICY "Anyone can check their own email authorization"
  ON public.monitoring_access
  FOR SELECT
  USING (true);

-- Seed initial authorized users for ABC Console
INSERT INTO public.abc_console_access (email) VALUES
  ('edoardo.grigione@aries76.com'),
  ('stefano.taioli@abccompany.it'),
  ('alessandro.catullo@aries76.com'),
  ('enrico.sobacchi@abccompany.it'),
  ('lorenzo.delforno@abccompany.it')
ON CONFLICT (email) DO NOTHING;

-- Seed initial authorized users for Asset GU
INSERT INTO public.asset_gu_access (email) VALUES
  ('edoardo.grigione@aries76.com'),
  ('gp@aries76.com'),
  ('alessandro.catullo@aries76.com')
ON CONFLICT (email) DO NOTHING;

-- Seed initial authorized users for Monitoring
INSERT INTO public.monitoring_access (email) VALUES
  ('edoardo.grigione@aries76.com'),
  ('admin@aries76.com'),
  ('alessandro.catullo@aries76.com')
ON CONFLICT (email) DO NOTHING;