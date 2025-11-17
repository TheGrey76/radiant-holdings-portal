-- Create table for Mazal Innovation access requests
CREATE TABLE public.mazal_innovation_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  access_granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mazal_innovation_access ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert their email
CREATE POLICY "Anyone can request access"
ON public.mazal_innovation_access
FOR INSERT
WITH CHECK (true);

-- Create policy to allow reading own access
CREATE POLICY "Users can view their own access"
ON public.mazal_innovation_access
FOR SELECT
USING (true);

-- Create table for investor brief requests
CREATE TABLE public.mazal_investor_brief_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mazal_investor_brief_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit a request
CREATE POLICY "Anyone can submit investor brief request"
ON public.mazal_investor_brief_requests
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_mazal_innovation_access_email ON public.mazal_innovation_access(email);
CREATE INDEX idx_mazal_investor_brief_requests_email ON public.mazal_investor_brief_requests(email);