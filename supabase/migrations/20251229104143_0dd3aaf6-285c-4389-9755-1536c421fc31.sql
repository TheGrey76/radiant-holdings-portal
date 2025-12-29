-- Fix gp_registrations RLS policy to prevent public read access
-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view own or admin can view all" ON public.gp_registrations;

-- Create new restrictive SELECT policy that requires authentication
-- Users can only view their own registration, admins can view all
CREATE POLICY "Authenticated users can view own registration or admins view all" 
ON public.gp_registrations 
FOR SELECT 
TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'));