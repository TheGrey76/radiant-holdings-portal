UPDATE public.abc_investors 
SET linkedin = 'https://www.linkedin.com/in/carlo-pajusco/' 
WHERE nome ILIKE '%carlo%' AND (nome ILIKE '%paiusco%' OR nome ILIKE '%pajusco%');