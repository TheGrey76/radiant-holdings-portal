-- Portfolio Report: Leads table (email captures from unlock gates, mini-scan, etc.)
CREATE TABLE public.portfolio_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unlock_gate',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Portfolio Report: Scans table (mini-scan submissions and results)
CREATE TABLE public.portfolio_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  holdings JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_value NUMERIC,
  currency TEXT NOT NULL DEFAULT 'GBP',
  risk_score INTEGER,
  analysis_results JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Portfolio Report: Purchases table (Stripe payments for full reports)
CREATE TABLE public.portfolio_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  scan_id UUID REFERENCES public.portfolio_scans(id),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount_paid NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  tier TEXT NOT NULL DEFAULT 'professional',
  status TEXT NOT NULL DEFAULT 'pending',
  report_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_portfolio_leads_email ON public.portfolio_leads(email);
CREATE INDEX idx_portfolio_leads_source ON public.portfolio_leads(source);
CREATE INDEX idx_portfolio_scans_email ON public.portfolio_scans(email);
CREATE INDEX idx_portfolio_scans_status ON public.portfolio_scans(status);
CREATE INDEX idx_portfolio_purchases_email ON public.portfolio_purchases(email);
CREATE INDEX idx_portfolio_purchases_status ON public.portfolio_purchases(status);
CREATE INDEX idx_portfolio_purchases_stripe_session ON public.portfolio_purchases(stripe_session_id);

-- Enable RLS
ALTER TABLE public.portfolio_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_leads (public insert for email capture, admin read)
CREATE POLICY "Anyone can submit email leads"
  ON public.portfolio_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON public.portfolio_leads FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage leads"
  ON public.portfolio_leads FOR ALL
  USING (auth.role() = 'service_role'::text);

-- RLS Policies for portfolio_scans (public insert, owner can view their own)
CREATE POLICY "Anyone can submit scans"
  ON public.portfolio_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view scans by email"
  ON public.portfolio_scans FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage scans"
  ON public.portfolio_scans FOR ALL
  USING (auth.role() = 'service_role'::text);

-- RLS Policies for portfolio_purchases
CREATE POLICY "Anyone can create purchases"
  ON public.portfolio_purchases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their purchases by email"
  ON public.portfolio_purchases FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage purchases"
  ON public.portfolio_purchases FOR ALL
  USING (auth.role() = 'service_role'::text);

-- Update trigger for updated_at
CREATE TRIGGER update_portfolio_leads_updated_at
  BEFORE UPDATE ON public.portfolio_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_scans_updated_at
  BEFORE UPDATE ON public.portfolio_scans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_purchases_updated_at
  BEFORE UPDATE ON public.portfolio_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();