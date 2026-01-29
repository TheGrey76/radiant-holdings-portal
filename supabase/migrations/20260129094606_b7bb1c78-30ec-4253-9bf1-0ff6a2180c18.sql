-- Create table to track email link clicks
CREATE TABLE public.abc_email_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.abc_email_campaign_history(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  link_url TEXT NOT NULL,
  link_label TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_email_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "ABC authorized users can manage email clicks"
ON public.abc_email_clicks
FOR ALL
USING (is_abc_authorized(auth.uid()))
WITH CHECK (is_abc_authorized(auth.uid()));

-- Add index for fast lookups
CREATE INDEX idx_abc_email_clicks_campaign ON public.abc_email_clicks(campaign_id);
CREATE INDEX idx_abc_email_clicks_recipient ON public.abc_email_clicks(recipient_email);

-- Add investor_id to abc_email_opens for better linking
ALTER TABLE public.abc_email_opens ADD COLUMN IF NOT EXISTS investor_id UUID REFERENCES public.abc_investors(id);

-- Create index on investor_id
CREATE INDEX IF NOT EXISTS idx_abc_email_opens_investor ON public.abc_email_opens(investor_id);