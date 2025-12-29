-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Anyone can check their own email authorization" ON public.abc_console_access;

-- Create a SECURITY DEFINER function to check email authorization
-- This prevents exposing the full table while allowing email verification
CREATE OR REPLACE FUNCTION public.check_abc_console_access(check_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.abc_console_access
    WHERE LOWER(email) = LOWER(check_email)
  )
$$;

-- Create a restrictive policy - only admins can view the table directly
CREATE POLICY "Only admins can view abc_console_access"
ON public.abc_console_access
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow service role for management
CREATE POLICY "Service role can manage abc_console_access"
ON public.abc_console_access
FOR ALL
USING (auth.role() = 'service_role');