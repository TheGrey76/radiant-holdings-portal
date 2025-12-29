-- Allow authenticated users to insert themselves if their email is in abc_console_access
CREATE POLICY "Authorized users can self-register"
ON public.abc_authorized_users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND check_abc_console_access(email)
);

-- Also ensure they can view their own record after inserting
-- (this policy already exists but let's make sure INSERT works)