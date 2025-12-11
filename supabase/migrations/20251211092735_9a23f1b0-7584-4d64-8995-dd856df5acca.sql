-- Add engagement tracking fields to abc_investors table
ALTER TABLE public.abc_investors 
ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_opens_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_responses_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS meetings_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes_count INTEGER DEFAULT 0;

-- Create table for tracking email responses (replies)
CREATE TABLE IF NOT EXISTS public.abc_email_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.abc_email_campaign_history(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES public.abc_investors(id) ON DELETE CASCADE,
  investor_email TEXT NOT NULL,
  investor_name TEXT,
  response_type TEXT NOT NULL DEFAULT 'reply', -- reply, bounce, unsubscribe
  response_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email responses
ALTER TABLE public.abc_email_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for email responses (allow all authenticated users)
CREATE POLICY "Allow all operations on abc_email_responses" 
ON public.abc_email_responses 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to calculate engagement score
CREATE OR REPLACE FUNCTION public.calculate_investor_engagement_score(investor_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  investor_email TEXT;
BEGIN
  -- Get investor email
  SELECT email INTO investor_email FROM abc_investors WHERE id = investor_id_param;
  
  -- Count email opens for this investor
  SELECT COUNT(*) INTO opens_count 
  FROM abc_email_opens 
  WHERE recipient_email = investor_email;
  
  -- Count responses
  SELECT COUNT(*) INTO responses_count 
  FROM abc_email_responses 
  WHERE investor_id = investor_id_param OR investor_email = investor_email;
  
  -- Count meetings (activities with type 'Meeting')
  SELECT COUNT(*) INTO meetings_count 
  FROM abc_investor_activities 
  WHERE investor_name LIKE '%' || (SELECT nome FROM abc_investors WHERE id = investor_id_param) || '%'
    AND activity_type ILIKE '%meeting%';
  
  -- Count notes
  SELECT COUNT(*) INTO notes_count 
  FROM abc_investor_notes 
  WHERE investor_name = (SELECT nome || ' - ' || azienda FROM abc_investors WHERE id = investor_id_param);
  
  -- Calculate score (capped at 100)
  total_score := LEAST(100, 
    (opens_count * opens_weight) + 
    (responses_count * responses_weight) + 
    (meetings_count * meetings_weight) + 
    (notes_count * notes_weight)
  );
  
  RETURN total_score;
END;
$$;

-- Create function to update engagement scores for all investors
CREATE OR REPLACE FUNCTION public.update_all_engagement_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv RECORD;
BEGIN
  FOR inv IN SELECT id FROM abc_investors LOOP
    UPDATE abc_investors 
    SET engagement_score = calculate_investor_engagement_score(inv.id)
    WHERE id = inv.id;
  END LOOP;
END;
$$;

-- Enable realtime for email responses
ALTER PUBLICATION supabase_realtime ADD TABLE abc_email_responses;