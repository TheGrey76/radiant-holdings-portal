-- Add LinkedIn connection status to track whether an investor is already connected
ALTER TABLE public.abc_investors 
ADD COLUMN linkedin_connection_status text DEFAULT 'unknown';

-- Valid values: 'unknown', 'connected', 'not_connected', 'pending_request'
COMMENT ON COLUMN public.abc_investors.linkedin_connection_status IS 'LinkedIn connection status: unknown, connected, not_connected, pending_request';