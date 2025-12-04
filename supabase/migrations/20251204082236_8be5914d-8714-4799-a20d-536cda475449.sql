-- Drop the restrictive admin-only policies and create permissive policies for ABC investor tables
-- Note: ABC Console uses client-side email authentication, not Supabase auth

-- abc_investors
DROP POLICY IF EXISTS "Admins can manage abc_investors" ON public.abc_investors;
CREATE POLICY "Allow all access to abc_investors" 
ON public.abc_investors 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- abc_investor_notes
DROP POLICY IF EXISTS "Admins can manage abc_investor_notes" ON public.abc_investor_notes;
CREATE POLICY "Allow all access to abc_investor_notes" 
ON public.abc_investor_notes 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- abc_investor_activities
DROP POLICY IF EXISTS "Admins can manage abc_investor_activities" ON public.abc_investor_activities;
CREATE POLICY "Allow all access to abc_investor_activities" 
ON public.abc_investor_activities 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- abc_investor_documents
DROP POLICY IF EXISTS "Admins can manage abc_investor_documents" ON public.abc_investor_documents;
CREATE POLICY "Allow all access to abc_investor_documents" 
ON public.abc_investor_documents 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- abc_investor_followups
DROP POLICY IF EXISTS "Admins can manage abc_investor_followups" ON public.abc_investor_followups;
CREATE POLICY "Allow all access to abc_investor_followups" 
ON public.abc_investor_followups 
FOR ALL 
USING (true) 
WITH CHECK (true);