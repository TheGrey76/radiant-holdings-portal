-- Fix RLS policies to use has_role function which is more robust

-- 1. Fix abc_investors table
DROP POLICY IF EXISTS "Admins can manage investors" ON public.abc_investors;
CREATE POLICY "Admins can manage investors" ON public.abc_investors
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 2. Fix abc_investor_notes table
DROP POLICY IF EXISTS "Admins can manage notes" ON public.abc_investor_notes;
CREATE POLICY "Admins can manage notes" ON public.abc_investor_notes
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. Fix abc_investor_activities table
DROP POLICY IF EXISTS "Admins can manage activities" ON public.abc_investor_activities;
CREATE POLICY "Admins can manage activities" ON public.abc_investor_activities
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Fix abc_investor_documents table
DROP POLICY IF EXISTS "Admins can manage documents" ON public.abc_investor_documents;
CREATE POLICY "Admins can manage documents" ON public.abc_investor_documents
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 5. Fix abc_investor_followups table
DROP POLICY IF EXISTS "Admins can manage followups" ON public.abc_investor_followups;
CREATE POLICY "Admins can manage followups" ON public.abc_investor_followups
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));