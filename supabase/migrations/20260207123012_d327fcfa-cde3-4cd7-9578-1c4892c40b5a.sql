-- Allow anonymous SELECT on swing tables since access is protected by SwingAccessGate
CREATE POLICY "Allow anonymous read swing_positions"
ON public.swing_positions
FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous read swing_reports"
ON public.swing_reports
FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous read swing_upload_tokens"
ON public.swing_upload_tokens
FOR SELECT
USING (true);