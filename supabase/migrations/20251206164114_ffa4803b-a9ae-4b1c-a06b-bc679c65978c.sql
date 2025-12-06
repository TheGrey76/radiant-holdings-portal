-- Create table for tracking investor commitments
CREATE TABLE public.abc_investor_commitments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES public.abc_investors(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  commitment_type TEXT NOT NULL DEFAULT 'soft', -- 'soft' or 'hard'
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  commitment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_closing_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'converted', 'withdrawn'
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_investor_commitments ENABLE ROW LEVEL SECURITY;

-- Create policy for all access (matching other abc_ tables)
CREATE POLICY "Allow all access to abc_investor_commitments" 
ON public.abc_investor_commitments 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_abc_investor_commitments_updated_at
BEFORE UPDATE ON public.abc_investor_commitments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investor_commitments;