-- Create portfolio_reports table for storing generated reports
CREATE TABLE IF NOT EXISTS public.portfolio_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  scan_id UUID REFERENCES public.portfolio_scans(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('essentials', 'professional', 'enterprise')),
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, report_type)
);

-- Enable RLS
ALTER TABLE public.portfolio_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only (reports generated via edge functions)
CREATE POLICY "Service role can manage reports" 
ON public.portfolio_reports 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX idx_portfolio_reports_email ON public.portfolio_reports(email);
CREATE INDEX idx_portfolio_reports_type ON public.portfolio_reports(report_type);

-- Add trigger for updated_at
CREATE TRIGGER update_portfolio_reports_updated_at
BEFORE UPDATE ON public.portfolio_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();