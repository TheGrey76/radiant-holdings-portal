
-- Allow anon users to read portfolio configurations (access is gated by email check on gu_portfolio_access)
CREATE POLICY "Anon users can view portfolio configurations"
ON public.portfolio_configurations
FOR SELECT
TO anon
USING (true);

-- Allow anon users to read portfolio holdings (access is gated by email check on gu_portfolio_access)
CREATE POLICY "Anon users can view portfolio holdings"
ON public.portfolio_holdings
FOR SELECT
TO anon
USING (true);
