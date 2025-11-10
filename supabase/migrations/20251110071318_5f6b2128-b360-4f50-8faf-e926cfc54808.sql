-- Create financial_advisers table
CREATE TABLE IF NOT EXISTS public.financial_advisers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text NOT NULL,
  birth_date text,
  age integer,
  city text,
  province text,
  intermediary text,
  phone text,
  email text,
  role text,
  region text,
  portfolio text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.financial_advisers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since it's a portal for viewing advisers)
CREATE POLICY "Anyone can view financial advisers"
  ON public.financial_advisers
  FOR SELECT
  USING (true);

-- Create policy for admins to manage advisers
CREATE POLICY "Admins can manage financial advisers"
  ON public.financial_advisers
  FOR ALL
  USING (get_current_user_role() = 'admin');

-- Create index for faster searches
CREATE INDEX idx_financial_advisers_full_name ON public.financial_advisers(full_name);
CREATE INDEX idx_financial_advisers_region ON public.financial_advisers(region);
CREATE INDEX idx_financial_advisers_intermediary ON public.financial_advisers(intermediary);
CREATE INDEX idx_financial_advisers_email ON public.financial_advisers(email);

-- Create trigger for updated_at
CREATE TRIGGER update_financial_advisers_updated_at
  BEFORE UPDATE ON public.financial_advisers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();