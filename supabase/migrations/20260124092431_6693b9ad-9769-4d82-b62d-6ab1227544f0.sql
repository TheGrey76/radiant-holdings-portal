-- Create table for bitcoin research signups
CREATE TABLE public.bitcoin_research_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT false,
    verification_code TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    source TEXT DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bitcoin_research_signups ENABLE ROW LEVEL SECURITY;

-- Allow insert from edge functions (service role)
CREATE POLICY "Service role can manage signups"
ON public.bitcoin_research_signups
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_bitcoin_research_signups_email ON public.bitcoin_research_signups(email);
CREATE INDEX idx_bitcoin_research_signups_verified ON public.bitcoin_research_signups(verified);

-- Create trigger for updated_at
CREATE TRIGGER update_bitcoin_research_signups_updated_at
BEFORE UPDATE ON public.bitcoin_research_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();