
-- =============================================
-- SECURITY FIX: Comprehensive RLS & function hardening
-- =============================================

-- 1. contact_inquiries: already fixed, skip

-- 2. Fix abc_linkedin_templates: restrict to ABC authorized users
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'abc_linkedin_templates' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.abc_linkedin_templates', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "ABC authorized users can view templates"
  ON public.abc_linkedin_templates FOR SELECT
  USING (public.is_abc_authorized(auth.uid()));

-- 3. Fix curated_content: restrict DELETE/UPDATE/INSERT to admin
DROP POLICY IF EXISTS "Allow deleting curated content for CMS" ON public.curated_content;
DROP POLICY IF EXISTS "Admins can delete curated content" ON public.curated_content;
CREATE POLICY "Admins can delete curated content"
  ON public.curated_content FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow updating curated content for CMS" ON public.curated_content;
DROP POLICY IF EXISTS "Admins can update curated content" ON public.curated_content;
CREATE POLICY "Admins can update curated content"
  ON public.curated_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow inserting curated content for AI processing" ON public.curated_content;
DROP POLICY IF EXISTS "Admins can insert curated content" ON public.curated_content;
CREATE POLICY "Admins can insert curated content"
  ON public.curated_content FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Fix swing_positions: restrict DELETE/INSERT to admin
DROP POLICY IF EXISTS "Allow anonymous delete swing_positions" ON public.swing_positions;
DROP POLICY IF EXISTS "Admins can delete swing_positions" ON public.swing_positions;
CREATE POLICY "Admins can delete swing_positions"
  ON public.swing_positions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous insert swing_positions" ON public.swing_positions;
DROP POLICY IF EXISTS "Admins can insert swing_positions" ON public.swing_positions;
CREATE POLICY "Admins can insert swing_positions"
  ON public.swing_positions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also fix swing UPDATE if open
DROP POLICY IF EXISTS "Allow anonymous update swing_positions" ON public.swing_positions;
DROP POLICY IF EXISTS "Admins can update swing_positions" ON public.swing_positions;
CREATE POLICY "Admins can update swing_positions"
  ON public.swing_positions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Fix abc_kpi_snapshots: restrict to admin
DROP POLICY IF EXISTS "Authenticated users can insert KPI snapshots" ON public.abc_kpi_snapshots;
DROP POLICY IF EXISTS "Admins can insert KPI snapshots" ON public.abc_kpi_snapshots;
CREATE POLICY "Admins can insert KPI snapshots"
  ON public.abc_kpi_snapshots FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can update KPI snapshots" ON public.abc_kpi_snapshots;
DROP POLICY IF EXISTS "Admins can update KPI snapshots" ON public.abc_kpi_snapshots;
CREATE POLICY "Admins can update KPI snapshots"
  ON public.abc_kpi_snapshots FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Fix portfolio_configurations: restrict UPDATE to owner
DROP POLICY IF EXISTS "Authenticated users can update portfolio configurations" ON public.portfolio_configurations;
DROP POLICY IF EXISTS "Users can update their own portfolio configurations" ON public.portfolio_configurations;
CREATE POLICY "Users can update own portfolio configs"
  ON public.portfolio_configurations FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 7. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 8. Fix blog_posts: only show published posts publicly
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'blog_posts' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_posts', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Published posts viewable or admin sees all"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

-- 9. Fix network_profiles: restrict to authenticated
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'network_profiles' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.network_profiles', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY "Authenticated users can view profiles"
  ON public.network_profiles FOR SELECT
  USING (auth.role() = 'authenticated');
