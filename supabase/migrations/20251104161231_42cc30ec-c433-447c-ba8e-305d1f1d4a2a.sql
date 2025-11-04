-- Create table for LP registrations
CREATE TABLE public.lp_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT,
  jurisdiction TEXT,
  investor_type TEXT,
  areas_of_interest TEXT[],
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lp_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to submit registration
CREATE POLICY "Anyone can submit LP registration"
ON public.lp_registrations
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to view registrations
CREATE POLICY "Admins can view LP registrations"
ON public.lp_registrations
FOR SELECT
USING (get_current_user_role() = 'admin');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lp_registrations_updated_at
BEFORE UPDATE ON public.lp_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_lp_registrations_email ON public.lp_registrations(email);
CREATE INDEX idx_lp_registrations_created_at ON public.lp_registrations(created_at DESC);
CREATE INDEX idx_lp_registrations_status ON public.lp_registrations(status);