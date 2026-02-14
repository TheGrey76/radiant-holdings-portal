INSERT INTO page_access (email, page_slug) VALUES 
  ('edoardo.grigione@aries76.com', 'criptos-portfolio'),
  ('jgor.bazze@gmail.com', 'criptos-portfolio')
ON CONFLICT DO NOTHING;