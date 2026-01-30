-- Drop the permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view contact inquiries" ON public.contact_inquiries;

-- Create admin-only SELECT policy
CREATE POLICY "Admins can view contact inquiries" 
ON public.contact_inquiries
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));