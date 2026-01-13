-- Create unified page_access table
CREATE TABLE public.page_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'whitelist', -- 'whitelist', 'paid', 'subscription'
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL = never expires
  stripe_payment_id TEXT, -- For paid access
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, page_slug)
);

-- Create indexes for fast lookups
CREATE INDEX idx_page_access_email ON public.page_access(lower(email));
CREATE INDEX idx_page_access_page_slug ON public.page_access(page_slug);
CREATE INDEX idx_page_access_email_page ON public.page_access(lower(email), page_slug);

-- Enable RLS
ALTER TABLE public.page_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage all page_access" 
ON public.page_access 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage page_access" 
ON public.page_access 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can check their own access" 
ON public.page_access 
FOR SELECT 
USING (lower(email) = lower((SELECT email FROM auth.users WHERE id = auth.uid())));

-- Create function to check page access (used by Edge Functions)
CREATE OR REPLACE FUNCTION public.check_page_access(p_email TEXT, p_page_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.page_access
    WHERE lower(email) = lower(p_email)
    AND page_slug = p_page_slug
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

-- Migrate existing data from all access tables

-- ABC Console Access
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
SELECT email, 'abc-company-console', 'whitelist', access_granted_at
FROM public.abc_console_access
ON CONFLICT (email, page_slug) DO NOTHING;

-- Reel Immobiliare Access
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
SELECT email, 'reelimmobiliare', 'whitelist', access_granted_at
FROM public.reel_immobiliare_access
ON CONFLICT (email, page_slug) DO NOTHING;

-- Mazal Innovation Access
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
SELECT email, 'mazal-innovation', 'whitelist', access_granted_at
FROM public.mazal_innovation_access
ON CONFLICT (email, page_slug) DO NOTHING;

-- Asset GU Access
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
SELECT email, 'structured-products-gu', 'whitelist', access_granted_at
FROM public.asset_gu_access
ON CONFLICT (email, page_slug) DO NOTHING;

-- GU Portfolio Access
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
SELECT email, 'gu-portfolio', 'whitelist', access_granted_at
FROM public.gu_portfolio_access
ON CONFLICT (email, page_slug) DO NOTHING;

-- Bitcoin Funnel Leads (paid only)
INSERT INTO public.page_access (email, page_slug, access_type, granted_at, stripe_payment_id)
SELECT email, 'bitcoin-2026-report', 'paid', COALESCE(paid_at, updated_at), stripe_payment_id
FROM public.bitcoin_funnel_leads
WHERE status = 'paid'
ON CONFLICT (email, page_slug) DO NOTHING;

-- Report Purchases
INSERT INTO public.page_access (email, page_slug, access_type, granted_at, expires_at, stripe_payment_id)
SELECT rp.user_email, r.slug, 'paid', rp.purchased_at, rp.expires_at, rp.stripe_payment_intent
FROM public.report_purchases rp
JOIN public.reports r ON r.id = rp.report_id
WHERE rp.status = 'completed'
ON CONFLICT (email, page_slug) DO NOTHING;

-- Add admin bypass (your email gets access to everything)
INSERT INTO public.page_access (email, page_slug, access_type, metadata)
VALUES 
  ('edoardo.grigione@aries76.com', 'bitcoin-2026-report', 'whitelist', '{"reason": "admin"}'),
  ('edoardo.grigione@aries76.com', 'abc-company-console', 'whitelist', '{"reason": "admin"}'),
  ('edoardo.grigione@aries76.com', 'reelimmobiliare', 'whitelist', '{"reason": "admin"}'),
  ('edoardo.grigione@aries76.com', 'mazal-innovation', 'whitelist', '{"reason": "admin"}'),
  ('edoardo.grigione@aries76.com', 'structured-products-gu', 'whitelist', '{"reason": "admin"}'),
  ('edoardo.grigione@aries76.com', 'gu-portfolio', 'whitelist', '{"reason": "admin"}')
ON CONFLICT (email, page_slug) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_page_access_updated_at
BEFORE UPDATE ON public.page_access
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();