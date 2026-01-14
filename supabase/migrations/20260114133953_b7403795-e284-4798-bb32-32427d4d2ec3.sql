-- Add authorized emails for ETF/Certificates portfolio page
INSERT INTO public.page_access (email, page_slug, access_type, granted_at)
VALUES 
  ('edoardo.grigione@aries76.com', 'etf-sp-af', 'whitelist', now()),
  ('fiorellinoantonio@gmail.com', 'etf-sp-af', 'whitelist', now())
ON CONFLICT (email, page_slug) DO NOTHING;