-- Create a temporary password reset for user
-- This will allow the user to login with a new password

-- First, we'll update the user's password to a known temporary one
-- User ID: 55533895-0a80-4afa-ad37-ee4d4c9229f6

-- Note: This creates a secure password hash for "TempPassword2025!"
-- The user should change this immediately after login

UPDATE auth.users
SET encrypted_password = crypt('TempPassword2025!', gen_salt('bf'))
WHERE email = 'edoardo.grigione@aries76.com';