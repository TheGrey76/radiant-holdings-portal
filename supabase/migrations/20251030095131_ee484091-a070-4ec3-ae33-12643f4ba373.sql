-- Assign admin role to edoardo.grigione@aries76.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('55533895-0a80-4afa-ad37-ee4d4c9229f6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;