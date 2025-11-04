-- Add DELETE policy for admins on contact_inquiries table
CREATE POLICY "Admins can delete contact inquiries"
ON public.contact_inquiries
FOR DELETE
TO authenticated
USING (get_current_user_role() = 'admin');