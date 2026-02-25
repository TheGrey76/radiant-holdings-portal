
-- Allow anon insert/update on swing_reports and swing_positions
-- (page is already protected by whitelist access check)

CREATE POLICY "Allow anon insert swing_reports"
  ON public.swing_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anon update swing_reports"
  ON public.swing_reports FOR UPDATE
  USING (true);

CREATE POLICY "Allow anon insert swing_positions"
  ON public.swing_positions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anon update swing_positions"
  ON public.swing_positions FOR UPDATE
  USING (true);

CREATE POLICY "Allow anon delete swing_positions"
  ON public.swing_positions FOR DELETE
  USING (true);
