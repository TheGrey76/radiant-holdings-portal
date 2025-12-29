-- Create a SECURITY DEFINER function to check mazal innovation access without exposing emails
CREATE OR REPLACE FUNCTION public.check_mazal_innovation_access(check_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.mazal_innovation_access
    WHERE LOWER(email) = LOWER(check_email)
  )
$$;

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own access" ON public.mazal_innovation_access;

-- Create restrictive SELECT policy - only admins can view the full table
CREATE POLICY "Only admins can view mazal_innovation_access" 
ON public.mazal_innovation_access 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));