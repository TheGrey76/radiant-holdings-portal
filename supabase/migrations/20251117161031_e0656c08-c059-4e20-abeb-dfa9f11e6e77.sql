-- Create table for content distribution configuration and tracking
CREATE TABLE IF NOT EXISTS public.content_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- 'linkedin', 'twitter', etc.
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for tracking individual distributions
CREATE TABLE IF NOT EXISTS public.distribution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_title TEXT NOT NULL,
  content_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- 'sent', 'failed'
  distributed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.content_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_logs ENABLE ROW LEVEL SECURITY;

-- Policies for content_distributions (admin only)
CREATE POLICY "Admins can manage content distributions"
  ON public.content_distributions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for distribution_logs (admin can view)
CREATE POLICY "Admins can view distribution logs"
  ON public.distribution_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy to allow edge function to insert logs
CREATE POLICY "Service role can insert distribution logs"
  ON public.distribution_logs
  FOR INSERT
  WITH CHECK (true);

-- Add update trigger for content_distributions
CREATE TRIGGER update_content_distributions_updated_at
  BEFORE UPDATE ON public.content_distributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();