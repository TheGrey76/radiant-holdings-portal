-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create own GP registration" ON public.gp_registrations;

-- Create a new policy that allows INSERT during signup
-- This checks that the user_id exists in auth.users, even if not yet authenticated
CREATE POLICY "Allow GP registration during signup" 
ON public.gp_registrations 
FOR INSERT 
WITH CHECK (
  user_id IN (SELECT id FROM auth.users)
);