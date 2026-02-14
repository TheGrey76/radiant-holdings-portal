INSERT INTO public.page_access (email, page_slug, access_type)
VALUES ('julio.elizondo@aries76.com', 'std', 'whitelist')
ON CONFLICT DO NOTHING;