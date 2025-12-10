-- Table for ABC email templates
CREATE TABLE public.abc_email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_email_templates ENABLE ROW LEVEL SECURITY;

-- Policy for full access (ABC console uses email-based auth)
CREATE POLICY "Allow all access to abc_email_templates" 
ON public.abc_email_templates 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Table for ABC campaign history
CREATE TABLE public.abc_email_campaign_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  successful_sends INTEGER NOT NULL DEFAULT 0,
  failed_sends INTEGER NOT NULL DEFAULT 0,
  filter_status TEXT,
  filter_category TEXT,
  sent_by TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recipients JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_email_campaign_history ENABLE ROW LEVEL SECURITY;

-- Policy for full access
CREATE POLICY "Allow all access to abc_email_campaign_history" 
ON public.abc_email_campaign_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE abc_email_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE abc_email_campaign_history;