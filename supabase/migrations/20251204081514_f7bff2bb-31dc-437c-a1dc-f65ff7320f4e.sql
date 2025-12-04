-- Fix ABC Investor tables RLS policies to require admin authentication

-- 1. Drop existing "Allow all access" policies
DROP POLICY IF EXISTS "Allow all access to abc_investors" ON abc_investors;
DROP POLICY IF EXISTS "Allow all access to abc_investor_notes" ON abc_investor_notes;
DROP POLICY IF EXISTS "Allow all access to abc_investor_activities" ON abc_investor_activities;
DROP POLICY IF EXISTS "Allow all access to abc_investor_documents" ON abc_investor_documents;
DROP POLICY IF EXISTS "Allow all access to abc_investor_followups" ON abc_investor_followups;

-- 2. Create secure admin-only policies for abc_investors
CREATE POLICY "Admins can manage abc_investors" ON abc_investors
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. Create secure admin-only policies for abc_investor_notes
CREATE POLICY "Admins can manage abc_investor_notes" ON abc_investor_notes
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Create secure admin-only policies for abc_investor_activities
CREATE POLICY "Admins can manage abc_investor_activities" ON abc_investor_activities
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 5. Create secure admin-only policies for abc_investor_documents
CREATE POLICY "Admins can manage abc_investor_documents" ON abc_investor_documents
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. Create secure admin-only policies for abc_investor_followups
CREATE POLICY "Admins can manage abc_investor_followups" ON abc_investor_followups
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));