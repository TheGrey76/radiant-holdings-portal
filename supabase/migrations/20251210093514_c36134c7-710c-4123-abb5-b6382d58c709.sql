-- Create table for email open tracking
CREATE TABLE public.abc_email_opens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.abc_email_campaign_history(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_email_opens ENABLE ROW LEVEL SECURITY;

-- Create policy for full access (same as other ABC tables)
CREATE POLICY "Allow all access to abc_email_opens" 
ON public.abc_email_opens 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_abc_email_opens_campaign_id ON public.abc_email_opens(campaign_id);
CREATE INDEX idx_abc_email_opens_recipient_email ON public.abc_email_opens(recipient_email);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE abc_email_opens;