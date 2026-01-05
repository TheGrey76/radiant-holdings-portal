-- Ensure RLS is enabled on financial_advisers table
ALTER TABLE public.financial_advisers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypass)
ALTER TABLE public.financial_advisers FORCE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate with proper restrictions
DROP POLICY IF EXISTS "Admins can manage financial advisers" ON public.financial_advisers;

-- Create admin-only policy for all operations
CREATE POLICY "Admins can manage financial advisers" 
ON public.financial_advisers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));