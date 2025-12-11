-- Create function to cascade delete investor related records
CREATE OR REPLACE FUNCTION public.cascade_delete_investor_records()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  investor_full_name TEXT;
BEGIN
  -- Build the investor name pattern used in related tables
  investor_full_name := OLD.nome || ' - ' || OLD.azienda;
  
  -- Delete related notes
  DELETE FROM public.abc_investor_notes 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%';
  
  -- Delete related activities
  DELETE FROM public.abc_investor_activities 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%';
  
  -- Delete related follow-ups
  DELETE FROM public.abc_investor_followups 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%';
  
  -- Delete related commitments
  DELETE FROM public.abc_investor_commitments 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%'
     OR investor_id = OLD.id;
  
  -- Delete related documents
  DELETE FROM public.abc_investor_documents 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%';
  
  -- Delete related email responses
  DELETE FROM public.abc_email_responses 
  WHERE investor_id = OLD.id 
     OR investor_email = OLD.email;
  
  -- Delete related notifications
  DELETE FROM public.abc_notifications 
  WHERE investor_name = investor_full_name 
     OR investor_name ILIKE '%' || OLD.nome || '%';

  RETURN OLD;
END;
$$;

-- Create trigger on abc_investors table
DROP TRIGGER IF EXISTS trigger_cascade_delete_investor ON public.abc_investors;

CREATE TRIGGER trigger_cascade_delete_investor
BEFORE DELETE ON public.abc_investors
FOR EACH ROW
EXECUTE FUNCTION public.cascade_delete_investor_records();

-- Clean up any existing orphaned records
DELETE FROM public.abc_investor_notes 
WHERE investor_name NOT IN (
  SELECT nome || ' - ' || azienda FROM public.abc_investors
);

DELETE FROM public.abc_investor_activities 
WHERE investor_name NOT IN (
  SELECT nome || ' - ' || azienda FROM public.abc_investors
) AND investor_name NOT IN (
  SELECT nome FROM public.abc_investors
);

DELETE FROM public.abc_investor_followups 
WHERE investor_name NOT IN (
  SELECT nome || ' - ' || azienda FROM public.abc_investors
) AND investor_name NOT IN (
  SELECT nome FROM public.abc_investors
);