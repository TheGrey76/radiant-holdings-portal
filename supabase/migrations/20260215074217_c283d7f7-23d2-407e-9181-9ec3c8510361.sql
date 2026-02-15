
-- Table for AriesDB contacts with enrichment fields
CREATE TABLE public.ariesdb_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  headline TEXT,
  job_title TEXT,
  location TEXT,
  company TEXT,
  website TEXT,
  linkedin_url TEXT,
  connected_on TEXT,
  year TEXT,
  industry TEXT,
  region TEXT,
  -- Enriched fields
  enriched_email TEXT,
  enriched_phone TEXT,
  enriched_linkedin_url TEXT,
  enriched_title TEXT,
  enriched_company TEXT,
  enriched_location TEXT,
  enrichment_source TEXT,
  enrichment_status TEXT NOT NULL DEFAULT 'pending',
  enriched_at TIMESTAMP WITH TIME ZONE,
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Dedup key
  dedup_key TEXT NOT NULL,
  UNIQUE(dedup_key)
);

-- Enable RLS
ALTER TABLE public.ariesdb_contacts ENABLE ROW LEVEL SECURITY;

-- Admin-only access (uses has_role function already in DB)
CREATE POLICY "Admins can do everything on ariesdb_contacts"
  ON public.ariesdb_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow service role full access (for edge functions)
CREATE POLICY "Service role full access on ariesdb_contacts"
  ON public.ariesdb_contacts FOR ALL
  USING (auth.role() = 'service_role');

-- Index for fast lookups
CREATE INDEX idx_ariesdb_contacts_dedup ON public.ariesdb_contacts(dedup_key);
CREATE INDEX idx_ariesdb_contacts_enrichment ON public.ariesdb_contacts(enrichment_status);

-- Trigger for updated_at
CREATE TRIGGER update_ariesdb_contacts_updated_at
  BEFORE UPDATE ON public.ariesdb_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
