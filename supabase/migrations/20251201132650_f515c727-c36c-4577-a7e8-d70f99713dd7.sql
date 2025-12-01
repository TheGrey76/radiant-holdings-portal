-- Create ABC investors table for CRM management
CREATE TABLE IF NOT EXISTS public.abc_investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  azienda text NOT NULL,
  ruolo text,
  categoria text NOT NULL,
  citta text,
  fonte text,
  linkedin text,
  email text,
  phone text,
  priorita text DEFAULT 'high',
  status text NOT NULL DEFAULT 'To Contact',
  pipeline_value numeric NOT NULL DEFAULT 0,
  probability integer DEFAULT 50,
  expected_close date,
  relationship_owner text DEFAULT 'Edoardo Grigione',
  rilevanza text,
  last_contact_date timestamp with time zone,
  next_follow_up_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_investors ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can manage investors
CREATE POLICY "Authenticated users can manage investors"
  ON public.abc_investors
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on status for faster filtering
CREATE INDEX idx_abc_investors_status ON public.abc_investors(status);

-- Create index on categoria for filtering
CREATE INDEX idx_abc_investors_categoria ON public.abc_investors(categoria);

-- Trigger for updated_at
CREATE TRIGGER update_abc_investors_updated_at
  BEFORE UPDATE ON public.abc_investors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();