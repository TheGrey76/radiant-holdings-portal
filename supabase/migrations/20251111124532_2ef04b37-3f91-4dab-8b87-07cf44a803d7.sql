-- Create table for fundraising readiness report requests
CREATE TABLE public.fundraising_report_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  fund_type TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

-- Enable Row Level Security
ALTER TABLE public.fundraising_report_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all report requests"
  ON public.fundraising_report_requests
  FOR SELECT
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Anyone can submit report requests"
  ON public.fundraising_report_requests
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fundraising_report_requests_updated_at
  BEFORE UPDATE ON public.fundraising_report_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();