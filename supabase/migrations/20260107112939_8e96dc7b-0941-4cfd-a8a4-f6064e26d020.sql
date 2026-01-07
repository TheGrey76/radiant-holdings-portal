CREATE OR REPLACE FUNCTION public.calculate_investor_engagement_score(investor_id_param uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  opens_weight INTEGER := 5;
  responses_weight INTEGER := 25;
  meetings_weight INTEGER := 30;
  notes_weight INTEGER := 10;
  total_score INTEGER := 0;
  opens_count INTEGER;
  responses_count INTEGER;
  meetings_count INTEGER;
  notes_count INTEGER;
  inv_email TEXT;
  inv_name TEXT;
  inv_full_name TEXT;
BEGIN
  -- Get investor email and name
  SELECT email, nome, nome || ' - ' || azienda 
  INTO inv_email, inv_name, inv_full_name 
  FROM abc_investors WHERE id = investor_id_param;
  
  -- Count email opens for this investor
  SELECT COUNT(*) INTO opens_count 
  FROM abc_email_opens eo
  WHERE eo.recipient_email = inv_email;
  
  -- Count responses
  SELECT COUNT(*) INTO responses_count 
  FROM abc_email_responses er
  WHERE er.investor_id = investor_id_param OR er.investor_email = inv_email;
  
  -- Count meetings (activities with type 'Meeting')
  SELECT COUNT(*) INTO meetings_count 
  FROM abc_investor_activities ia
  WHERE ia.investor_name ILIKE '%' || inv_name || '%'
    AND ia.activity_type ILIKE '%meeting%';
  
  -- Count notes
  SELECT COUNT(*) INTO notes_count 
  FROM abc_investor_notes n
  WHERE n.investor_name = inv_full_name;
  
  -- Calculate score (capped at 100)
  total_score := LEAST(100, 
    (COALESCE(opens_count, 0) * opens_weight) + 
    (COALESCE(responses_count, 0) * responses_weight) + 
    (COALESCE(meetings_count, 0) * meetings_weight) + 
    (COALESCE(notes_count, 0) * notes_weight)
  );
  
  RETURN total_score;
END;
$function$;