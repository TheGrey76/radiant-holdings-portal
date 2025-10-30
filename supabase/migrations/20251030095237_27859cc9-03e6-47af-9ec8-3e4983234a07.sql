-- Update get_current_user_role to check user_roles table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;