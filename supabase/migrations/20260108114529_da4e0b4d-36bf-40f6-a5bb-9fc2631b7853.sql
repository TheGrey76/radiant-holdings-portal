
-- Bitcoin Funnel Leads table
CREATE TABLE public.bitcoin_funnel_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'direct',
  status TEXT NOT NULL DEFAULT 'preview',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_id TEXT,
  CONSTRAINT valid_source CHECK (source IN ('linkedin', 'dm', 'email', 'direct', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('preview', 'requested', 'paid'))
);

-- LinkedIn Posts table
CREATE TABLE public.bitcoin_funnel_linkedin_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  angle TEXT NOT NULL DEFAULT 'positioning',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_angle CHECK (angle IN ('de-education', 'positioning', 'qualifying')),
  CONSTRAINT valid_post_status CHECK (status IN ('draft', 'published', 'retired'))
);

-- DM Templates table
CREATE TABLE public.bitcoin_funnel_dm_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email Sequences table
CREATE TABLE public.bitcoin_funnel_email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  trigger_hours_after_request INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_email_status CHECK (status IN ('active', 'paused'))
);

-- Funnel Settings table
CREATE TABLE public.bitcoin_funnel_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- Automation Log table
CREATE TABLE public.bitcoin_funnel_automation_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.bitcoin_funnel_leads(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Iteration Notes table
CREATE TABLE public.bitcoin_funnel_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_text TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.bitcoin_funnel_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_linkedin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_dm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_automation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_funnel_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can access
CREATE POLICY "Admins can manage funnel leads" ON public.bitcoin_funnel_leads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage linkedin posts" ON public.bitcoin_funnel_linkedin_posts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage dm templates" ON public.bitcoin_funnel_dm_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage email sequences" ON public.bitcoin_funnel_email_sequences
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage funnel settings" ON public.bitcoin_funnel_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view automation log" ON public.bitcoin_funnel_automation_log
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage funnel notes" ON public.bitcoin_funnel_notes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to insert leads (for public form submissions)
CREATE POLICY "Service role can insert leads" ON public.bitcoin_funnel_leads
  FOR INSERT WITH CHECK (true);

-- Insert default DM templates
INSERT INTO public.bitcoin_funnel_dm_templates (name, content, is_active) VALUES
  ('DM Soft', 'Hi [Name], I noticed you''re interested in institutional-grade Bitcoin analysis. We''ve just released our 2026 macro framework — would you like me to share the preview?', true),
  ('DM Direct', 'Hi [Name], our Bitcoin 2026 report is now live. It covers macro regimes, price targets, and institutional allocation frameworks. Request access here: [URL]', true),
  ('DM Qualifying', 'Hi [Name], before I share access — are you currently advising clients on digital asset allocation, or evaluating for your own portfolio?', true);

-- Insert default email sequences
INSERT INTO public.bitcoin_funnel_email_sequences (sequence_order, name, subject, body, status, trigger_hours_after_request) VALUES
  (1, 'Email 1: Access confirmation', 'Your Bitcoin 2026 Access Request', 'Thank you for requesting access to the Bitcoin 2026 Intelligence Page. Your request has been received and is being processed.', 'active', 0),
  (2, 'Email 2: Why not a report', 'This is not a report', 'Most Bitcoin analyses are static PDFs. Our 2026 Intelligence Page updates continuously with live macro data, regime detection, and institutional frameworks.', 'active', 24),
  (3, 'Email 3: Risk framing', 'The cost of waiting', 'Market regimes shift. Waiting for confirmation often means missing the move. Our framework helps you position ahead of consensus.', 'active', 72),
  (4, 'Email 4: Final access reminder', 'Final reminder: Bitcoin 2026 access', 'This is your final reminder to complete your access to the Bitcoin 2026 Intelligence Page. After this, we''ll assume you''re not interested.', 'active', 168);

-- Insert default settings
INSERT INTO public.bitcoin_funnel_settings (setting_key, setting_value) VALUES
  ('active_cta_copy', 'Request full access to the Bitcoin 2026 live intelligence page'),
  ('preview_url', '/bitcoin-2026-report-preview'),
  ('full_access_url', '/bitcoin-2026-report');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_bitcoin_funnel_leads_updated_at
  BEFORE UPDATE ON public.bitcoin_funnel_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bitcoin_funnel_linkedin_posts_updated_at
  BEFORE UPDATE ON public.bitcoin_funnel_linkedin_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bitcoin_funnel_dm_templates_updated_at
  BEFORE UPDATE ON public.bitcoin_funnel_dm_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bitcoin_funnel_email_sequences_updated_at
  BEFORE UPDATE ON public.bitcoin_funnel_email_sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bitcoin_funnel_settings_updated_at
  BEFORE UPDATE ON public.bitcoin_funnel_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
