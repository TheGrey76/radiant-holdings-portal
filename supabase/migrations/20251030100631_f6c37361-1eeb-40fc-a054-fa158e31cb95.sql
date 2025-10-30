-- Create table to store sent newsletters
CREATE TABLE public.sent_newsletters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text NOT NULL,
  preheader text,
  heading text NOT NULL,
  content text NOT NULL,
  cta_text text,
  cta_link text,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_by uuid REFERENCES auth.users(id),
  recipients_count integer NOT NULL DEFAULT 0,
  successful_sends integer NOT NULL DEFAULT 0,
  failed_sends integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sent_newsletters ENABLE ROW LEVEL SECURITY;

-- Admins can view all sent newsletters
CREATE POLICY "Admins can view sent newsletters" 
ON public.sent_newsletters 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert sent newsletters
CREATE POLICY "Admins can insert sent newsletters" 
ON public.sent_newsletters 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_sent_newsletters_sent_at ON public.sent_newsletters(sent_at DESC);