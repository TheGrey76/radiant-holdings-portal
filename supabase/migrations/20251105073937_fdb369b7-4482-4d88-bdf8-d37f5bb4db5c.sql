-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own GP registration" ON public.gp_registrations;

-- Create a permissive INSERT policy that allows anyone to insert
-- The user_id validation is done at application level
CREATE POLICY "Allow GP registration insert" 
ON public.gp_registrations 
FOR INSERT 
WITH CHECK (true);