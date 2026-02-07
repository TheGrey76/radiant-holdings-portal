
-- Table for post templates by type
CREATE TABLE public.telegram_post_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_type TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  schedule_hour INTEGER NOT NULL,
  schedule_minute INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  template_format TEXT,
  assets_to_track TEXT[] DEFAULT ARRAY['bitcoin','ethereum','solana','ripple','cardano','polkadot','avalanche-2','chainlink','polygon-pos','litecoin'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_post_templates ENABLE ROW LEVEL SECURITY;

-- Public read, admin write
CREATE POLICY "Anyone can read telegram post templates"
  ON public.telegram_post_templates FOR SELECT USING (true);

CREATE POLICY "Admins can manage telegram post templates"
  ON public.telegram_post_templates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed with the 7-slot schedule
INSERT INTO public.telegram_post_templates (post_type, display_name, description, schedule_hour, schedule_minute) VALUES
  ('morning_briefing', 'Morning Briefing', 'Market overview with BTC macro context and regime', 6, 0),
  ('watchlist', 'Digital Assets Watchlist', 'Top 10 crypto prices with 24h/7d changes', 9, 0),
  ('midday_pulse', 'Midday Pulse', 'Top movers and price alerts (±5%)', 12, 0),
  ('news_digest', 'News Digest', 'Top 3-5 curated crypto news', 15, 0),
  ('afternoon_analysis', 'Afternoon Analysis', 'Deep BTC analysis with targets and regime', 17, 30),
  ('institutional_watch', 'Institutional Watch', 'ETF flows, whale movements, on-chain signals', 20, 0),
  ('daily_wrap', 'Daily Wrap-up', '24h performance summary of top assets', 22, 0);

-- Trigger for updated_at
CREATE TRIGGER update_telegram_post_templates_updated_at
  BEFORE UPDATE ON public.telegram_post_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
