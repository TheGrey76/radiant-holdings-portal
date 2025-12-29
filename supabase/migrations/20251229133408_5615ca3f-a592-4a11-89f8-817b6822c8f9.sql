-- Drop and recreate policies to ensure consistency
-- First check what exists and add missing ones

-- Enable RLS (idempotent)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_purchases ENABLE ROW LEVEL SECURITY;

-- Add policy for public to view published reports (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Anyone can view published reports'
  ) THEN
    CREATE POLICY "Anyone can view published reports"
    ON public.reports FOR SELECT
    USING (status = 'published');
  END IF;
END $$;

-- Add sections policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'report_sections' AND policyname = 'Anyone can view sections of published reports'
  ) THEN
    CREATE POLICY "Anyone can view sections of published reports"
    ON public.report_sections FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.reports 
        WHERE reports.id = report_sections.report_id 
        AND reports.status = 'published'
      )
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'report_sections' AND policyname = 'Admins can manage all report sections'
  ) THEN
    CREATE POLICY "Admins can manage all report sections"
    ON public.report_sections FOR ALL
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Add purchases policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'report_purchases' AND policyname = 'Users can view their own purchases'
  ) THEN
    CREATE POLICY "Users can view their own purchases"
    ON public.report_purchases FOR SELECT
    USING (
      LOWER(user_email) = LOWER((SELECT email FROM auth.users WHERE id = auth.uid()))
      OR public.has_role(auth.uid(), 'admin')
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'report_purchases' AND policyname = 'Service role can manage purchases'
  ) THEN
    CREATE POLICY "Service role can manage purchases"
    ON public.report_purchases FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;