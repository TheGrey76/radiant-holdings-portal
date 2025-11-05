-- Remove the foreign key constraint that's causing issues
ALTER TABLE public.gp_registrations 
DROP CONSTRAINT IF EXISTS gp_registrations_user_id_fkey;

-- Add an index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_gp_registrations_user_id 
ON public.gp_registrations(user_id);