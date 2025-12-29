-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Authorized users can self-register" ON public.abc_authorized_users;

-- Recreate as PERMISSIVE policy so it works with the other policies
CREATE POLICY "Authorized users can self-register"
ON public.abc_authorized_users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND check_abc_console_access(email)
);

-- Also add edoardo.grigione@aries76.com directly to abc_authorized_users
INSERT INTO public.abc_authorized_users (user_id, email, granted_by)
VALUES (
  '55533895-0a80-4afa-ad37-ee4d4c9229f6',
  'edoardo.grigione@aries76.com',
  'system-admin'
) ON CONFLICT DO NOTHING;