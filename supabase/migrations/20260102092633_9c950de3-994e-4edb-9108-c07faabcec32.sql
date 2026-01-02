-- Create access table for ReelImmobiliare page
CREATE TABLE public.reel_immobiliare_access (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    access_granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reel_immobiliare_access ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (needed for email verification)
CREATE POLICY "Anyone can check email access" 
ON public.reel_immobiliare_access 
FOR SELECT 
USING (true);

-- Authorize edoardo.grigione@aries76.com immediately
INSERT INTO public.reel_immobiliare_access (email) 
VALUES ('edoardo.grigione@aries76.com');