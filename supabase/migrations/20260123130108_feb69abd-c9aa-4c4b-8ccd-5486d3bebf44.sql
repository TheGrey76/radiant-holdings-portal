-- Create table for portfolio configurations (GU and other clients)
CREATE TABLE public.portfolio_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  total_value NUMERIC NOT NULL DEFAULT 400000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- Create table for portfolio holdings (certificates in each portfolio)
CREATE TABLE public.portfolio_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolio_configurations(id) ON DELETE CASCADE,
  position_label TEXT NOT NULL, -- A, B, C, D, E
  isin TEXT NOT NULL,
  issuer TEXT NOT NULL,
  name TEXT NOT NULL,
  allocation_percent NUMERIC NOT NULL,
  allocation_amount NUMERIC NOT NULL,
  coupon_pa TEXT,
  coupon_frequency TEXT,
  coupon_barrier TEXT,
  capital_barrier TEXT,
  maturity_date DATE,
  underlyings TEXT,
  role TEXT, -- Core Income, Defensive, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  replaced_isin TEXT, -- Track which ISIN this replaced
  replaced_at TIMESTAMP WITH TIME ZONE
);

-- Create table for portfolio change history
CREATE TABLE public.portfolio_change_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolio_configurations(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- 'replacement', 'rebalance', 'add', 'remove'
  old_isin TEXT,
  new_isin TEXT,
  old_name TEXT,
  new_name TEXT,
  position_label TEXT,
  reason TEXT,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_change_log ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (advisors can view/edit)
CREATE POLICY "Authenticated users can view portfolio configurations" 
ON public.portfolio_configurations FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert portfolio configurations" 
ON public.portfolio_configurations FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio configurations" 
ON public.portfolio_configurations FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view portfolio holdings" 
ON public.portfolio_holdings FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage portfolio holdings" 
ON public.portfolio_holdings FOR ALL 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view change log" 
ON public.portfolio_change_log FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert change log" 
ON public.portfolio_change_log FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_configurations_updated_at
BEFORE UPDATE ON public.portfolio_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial GU portfolio configuration
INSERT INTO public.portfolio_configurations (client_code, client_name, total_value, notes)
VALUES ('GU', 'Client G.U.', 400000, 'Initial portfolio setup');

-- Insert initial holdings for GU portfolio
INSERT INTO public.portfolio_holdings (portfolio_id, position_label, isin, issuer, name, allocation_percent, allocation_amount, coupon_pa, coupon_frequency, coupon_barrier, capital_barrier, maturity_date, underlyings, role)
SELECT 
  id,
  'A',
  'DE000MS0H1P0',
  'Morgan Stanley',
  'Morgan Stanley Phoenix "Mixed Basket"',
  30,
  120000,
  '9.32%',
  'Quarterly',
  '65%',
  '65%',
  '2030-11-27',
  'Enel, Alphabet (GOOGL), UniCredit',
  'Core Income'
FROM public.portfolio_configurations WHERE client_code = 'GU';

INSERT INTO public.portfolio_holdings (portfolio_id, position_label, isin, issuer, name, allocation_percent, allocation_amount, coupon_pa, coupon_frequency, coupon_barrier, capital_barrier, maturity_date, underlyings, role)
SELECT 
  id,
  'B',
  'DE000UQ23YT1',
  'UBS',
  'UBS Phoenix "Healthcare Basket"',
  20,
  80000,
  '10%',
  'Quarterly',
  '60%',
  '60%',
  '2028-11-13',
  'Novo Nordisk, Merck KGaA, CVS Health',
  'Defensive Income'
FROM public.portfolio_configurations WHERE client_code = 'GU';

INSERT INTO public.portfolio_holdings (portfolio_id, position_label, isin, issuer, name, allocation_percent, allocation_amount, coupon_pa, coupon_frequency, coupon_barrier, capital_barrier, maturity_date, underlyings, role)
SELECT 
  id,
  'C',
  'DE000UQ0LUM5',
  'UBS',
  'UBS Memory Cash Collect (Monthly)',
  20,
  80000,
  '12%',
  'Monthly',
  '65%',
  '65%',
  '2030-09-09',
  'Diversified Italian Large Caps',
  'Income Engine'
FROM public.portfolio_configurations WHERE client_code = 'GU';

INSERT INTO public.portfolio_holdings (portfolio_id, position_label, isin, issuer, name, allocation_percent, allocation_amount, coupon_pa, coupon_frequency, coupon_barrier, capital_barrier, maturity_date, underlyings, role)
SELECT 
  id,
  'D',
  'XS3153270833',
  'Barclays',
  'Barclays Phoenix "Italy Consumer & Luxury"',
  15,
  60000,
  '8%',
  'Quarterly',
  '65%',
  '65%',
  '2029-10-22',
  'Ferrari, Brunello Cucinelli, Campari',
  'Thematic Exposure'
FROM public.portfolio_configurations WHERE client_code = 'GU';

INSERT INTO public.portfolio_holdings (portfolio_id, position_label, isin, issuer, name, allocation_percent, allocation_amount, coupon_pa, coupon_frequency, coupon_barrier, capital_barrier, maturity_date, underlyings, role)
SELECT 
  id,
  'E',
  'XS3153397073',
  'Barclays',
  'Barclays Capital Protected "KG on Indices"',
  15,
  60000,
  '-',
  '-',
  '-',
  '100%',
  '2030-10-24',
  'NDX, NKY, SMI, Euro Stoxx Banks',
  'Portfolio Stabilizer'
FROM public.portfolio_configurations WHERE client_code = 'GU';