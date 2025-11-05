-- Create GP registrations table
CREATE TABLE public.gp_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  firm_website TEXT,
  work_email TEXT NOT NULL,
  aum_bracket TEXT NOT NULL,
  primary_strategy TEXT[] NOT NULL,
  main_fund_in_market TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.gp_registrations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own registration
CREATE POLICY "Users can view own GP registration"
ON public.gp_registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to create their own registration
CREATE POLICY "Users can create own GP registration"
ON public.gp_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own registration
CREATE POLICY "Users can update own GP registration"
ON public.gp_registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all GP registrations
CREATE POLICY "Admins can view all GP registrations"
ON public.gp_registrations
FOR SELECT
USING (get_current_user_role() = 'admin');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gp_registrations_updated_at
BEFORE UPDATE ON public.gp_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for GP call requests
CREATE TABLE public.gp_call_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  email TEXT NOT NULL,
  fund_in_market TEXT,
  preferred_timezone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public.gp_call_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create call requests
CREATE POLICY "Authenticated users can create call requests"
ON public.gp_call_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all call requests
CREATE POLICY "Admins can view all call requests"
ON public.gp_call_requests
FOR SELECT
USING (get_current_user_role() = 'admin');