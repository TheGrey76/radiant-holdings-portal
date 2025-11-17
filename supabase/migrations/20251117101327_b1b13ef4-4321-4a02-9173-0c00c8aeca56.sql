-- Authorize andrea.orsi@mazalcapital.it to access Mazal Innovation page
INSERT INTO public.mazal_innovation_access (email)
SELECT 'andrea.orsi@mazalcapital.it'
WHERE NOT EXISTS (
  SELECT 1 FROM public.mazal_innovation_access 
  WHERE email = 'andrea.orsi@mazalcapital.it'
);