-- Drop the problematic policy
DROP POLICY IF EXISTS "Allow GP registration during signup" ON public.gp_registrations;

-- Create a simple policy that allows authenticated users to insert their own registration
CREATE POLICY "Users can insert own GP registration" 
ON public.gp_registrations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);