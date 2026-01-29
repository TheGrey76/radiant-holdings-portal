INSERT INTO public.page_access (email, page_slug, access_type)
VALUES 
  ('jasonarresi@gmail.com', 'reelimmobiliare-social-strategy', 'whitelist'),
  ('pierluigituccimanagement@gmail.com', 'reelimmobiliare-social-strategy', 'whitelist'),
  ('elena@petaliebonbons.it', 'reelimmobiliare-social-strategy', 'whitelist'),
  ('nihad.elhilal@outlook.it', 'reelimmobiliare-social-strategy', 'whitelist')
ON CONFLICT (email, page_slug) DO NOTHING;