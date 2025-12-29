-- Drop existing SELECT policies to recreate with proper restrictions
DROP POLICY IF EXISTS "Admins can view all GP registrations" ON public.gp_registrations;
DROP POLICY IF EXISTS "Users can view own GP registration" ON public.gp_registrations;

-- Create a single, secure SELECT policy combining both cases
CREATE POLICY "Authenticated users can view own or admin can view all"
ON public.gp_registrations
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin')
);

-- Ensure RLS is enabled
ALTER TABLE public.gp_registrations ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well
ALTER TABLE public.gp_registrations FORCE ROW LEVEL SECURITY;