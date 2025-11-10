-- Create email campaigns table to track mass mailings
CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_by UUID REFERENCES auth.users(id),
  campaign_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  successful_sends INTEGER NOT NULL DEFAULT 0,
  failed_sends INTEGER NOT NULL DEFAULT 0,
  filter_region TEXT,
  filter_intermediary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed'))
);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Admin can view all campaigns
CREATE POLICY "Admins can view all campaigns"
ON public.email_campaigns
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admin can create campaigns
CREATE POLICY "Admins can create campaigns"
ON public.email_campaigns
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin can update campaigns
CREATE POLICY "Admins can update campaigns"
ON public.email_campaigns
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_email_campaigns_sent_at ON public.email_campaigns(sent_at DESC);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);