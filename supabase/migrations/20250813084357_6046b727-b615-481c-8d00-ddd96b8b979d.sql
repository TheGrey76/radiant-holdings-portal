-- Fix RLS policies for brochure_downloads table
-- First, drop the existing problematic policy
DROP POLICY IF EXISTS "Allow admin read access" ON public.brochure_downloads;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create proper admin policy for reading brochure downloads
CREATE POLICY "Admins can view brochure downloads" 
ON public.brochure_downloads 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Also fix the existing database functions to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;