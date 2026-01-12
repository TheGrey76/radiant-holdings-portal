-- Create table for scheduled Telegram publications
CREATE TABLE public.telegram_scheduled_publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_time TIME NOT NULL,
  publication_type TEXT NOT NULL DEFAULT 'bitcoin',
  message_template TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for publication logs
CREATE TABLE public.telegram_publication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_id UUID REFERENCES public.telegram_scheduled_publications(id) ON DELETE SET NULL,
  publication_type TEXT NOT NULL,
  message_content TEXT,
  telegram_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_scheduled_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_publication_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can manage scheduled publications" 
ON public.telegram_scheduled_publications 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view publication logs" 
ON public.telegram_publication_logs 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default schedule (6:00, 9:00, 18:00, 18:30)
INSERT INTO public.telegram_scheduled_publications (scheduled_time, publication_type, message_template) VALUES
('06:00', 'bitcoin', NULL),
('09:00', 'ethereum', NULL),
('18:00', 'news', NULL),
('18:30', 'bitcoin', NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_telegram_scheduled_publications_updated_at
BEFORE UPDATE ON public.telegram_scheduled_publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();