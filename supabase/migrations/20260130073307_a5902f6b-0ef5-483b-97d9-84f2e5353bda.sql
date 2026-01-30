-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can manage financial advisers" ON public.financial_advisers;

-- Create proper admin-only policy for authenticated users
CREATE POLICY "Admins can manage financial advisers" 
ON public.financial_advisers
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ensure no public/anon access
REVOKE ALL ON public.financial_advisers FROM anon;
REVOKE ALL ON public.financial_advisers FROM public;