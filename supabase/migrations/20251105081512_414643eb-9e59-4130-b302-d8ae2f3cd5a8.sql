-- Add flag to track if welcome email was sent
ALTER TABLE public.gp_registrations
ADD COLUMN IF NOT EXISTS welcome_email_sent boolean NOT NULL DEFAULT false;