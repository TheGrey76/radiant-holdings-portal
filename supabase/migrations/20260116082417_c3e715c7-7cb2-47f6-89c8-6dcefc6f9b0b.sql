-- Create strategic advisory documents table
CREATE TABLE public.strategic_advisory_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  description TEXT,
  document_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Create index for slug lookups
CREATE INDEX idx_strategic_advisory_documents_slug ON public.strategic_advisory_documents(slug);
CREATE INDEX idx_strategic_advisory_documents_status ON public.strategic_advisory_documents(status);

-- Enable RLS
ALTER TABLE public.strategic_advisory_documents ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage strategic advisory documents"
ON public.strategic_advisory_documents
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Public can view published documents (access controlled via page_access)
CREATE POLICY "Published documents are viewable"
ON public.strategic_advisory_documents
FOR SELECT
USING (status = 'published');

-- Add strategic-advisory page access entries
-- (will be managed per-document via page_access table with slug pattern 'advisory/{slug}')

-- Create trigger for updated_at
CREATE TRIGGER update_strategic_advisory_documents_updated_at
BEFORE UPDATE ON public.strategic_advisory_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for advisory document assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('advisory-assets', 'advisory-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for advisory assets
CREATE POLICY "Advisory assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'advisory-assets');

CREATE POLICY "Authenticated users can upload advisory assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'advisory-assets' AND auth.role() = 'authenticated');