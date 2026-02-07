
-- Swing Reports table: stores uploaded markdown reports
CREATE TABLE public.swing_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  capital NUMERIC,
  risk_profile TEXT,
  sectors TEXT[],
  horizon TEXT,
  report_date DATE,
  week_range TEXT,
  raw_content TEXT NOT NULL,
  file_name TEXT,
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Swing Positions table: individual trading positions with P&L tracking
CREATE TABLE public.swing_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.swing_reports(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  name TEXT,
  sector TEXT,
  status TEXT NOT NULL DEFAULT 'WATCHLIST',
  entry_zone_low NUMERIC,
  entry_zone_high NUMERIC,
  stop_loss NUMERIC,
  target_1 NUMERIC,
  target_2 NUMERIC,
  target_3 NUMERIC,
  risk_reward NUMERIC,
  allocation_pct NUMERIC,
  allocation_amount NUMERIC,
  confidence TEXT,
  shares NUMERIC,
  entry_price NUMERIC,
  fees NUMERIC DEFAULT 0,
  exit_price NUMERIC,
  exit_date TIMESTAMPTZ,
  realized_pnl NUMERIC,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Upload tokens for external access (Julio)
CREATE TABLE public.swing_upload_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  label TEXT NOT NULL DEFAULT 'Default',
  notification_email TEXT NOT NULL DEFAULT 'info@aries76.com',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.swing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swing_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swing_upload_tokens ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admin can manage swing reports"
ON public.swing_reports FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage swing positions"
ON public.swing_positions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage upload tokens"
ON public.swing_upload_tokens FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on positions
CREATE TRIGGER update_swing_positions_updated_at
BEFORE UPDATE ON public.swing_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
