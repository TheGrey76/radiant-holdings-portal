-- Add DELETE policy for admins on lp_registrations table
CREATE POLICY "Admins can delete LP registrations"
ON public.lp_registrations
FOR DELETE
USING (get_current_user_role() = 'admin');