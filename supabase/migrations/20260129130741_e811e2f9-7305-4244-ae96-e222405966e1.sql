INSERT INTO public.reel_immobiliare_access (email)
VALUES 
  ('jasonarresi@gmail.com'),
  ('pierluigituccimanagement@gmail.com'),
  ('elena@petaliebonbons.it'),
  ('nihad.elhilal@outlook.it')
ON CONFLICT (email) DO NOTHING;