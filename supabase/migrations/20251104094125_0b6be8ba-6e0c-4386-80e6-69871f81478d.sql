-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('lp', 'gp', 'general')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can submit contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view (for admin purposes)
CREATE POLICY "Authenticated users can view contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);