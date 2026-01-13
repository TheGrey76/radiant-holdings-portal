-- Add permanent admin access to the Bitcoin 2026 Report
INSERT INTO public.page_access (email, page_slug, access_type, expires_at)
VALUES ('edoardo.grigione@aries76.com', 'bitcoin-2026-report', 'admin', NULL)
ON CONFLICT DO NOTHING;