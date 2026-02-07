-- Allow anonymous INSERT/UPDATE/DELETE on swing tables (access is protected by SwingAccessGate)
CREATE POLICY "Allow anonymous insert swing_reports"
ON public.swing_reports FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous update swing_reports"
ON public.swing_reports FOR UPDATE
USING (true);

CREATE POLICY "Allow anonymous delete swing_reports"
ON public.swing_reports FOR DELETE
USING (true);

CREATE POLICY "Allow anonymous insert swing_positions"
ON public.swing_positions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous update swing_positions"
ON public.swing_positions FOR UPDATE
USING (true);

CREATE POLICY "Allow anonymous delete swing_positions"
ON public.swing_positions FOR DELETE
USING (true);

CREATE POLICY "Allow anonymous insert swing_upload_tokens"
ON public.swing_upload_tokens FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous update swing_upload_tokens"
ON public.swing_upload_tokens FOR UPDATE
USING (true);

CREATE POLICY "Allow anonymous delete swing_upload_tokens"
ON public.swing_upload_tokens FOR DELETE
USING (true);