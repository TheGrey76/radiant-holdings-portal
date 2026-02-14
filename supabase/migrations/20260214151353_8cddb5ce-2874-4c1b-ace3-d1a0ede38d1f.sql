
-- Fix remaining permissive RLS policies

-- swing_price_cache: restrict to admin (used by edge functions via service role)
DROP POLICY IF EXISTS "Allow anonymous insert on swing_price_cache" ON public.swing_price_cache;
CREATE POLICY "Service insert swing_price_cache"
  ON public.swing_price_cache FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous update on swing_price_cache" ON public.swing_price_cache;
CREATE POLICY "Service update swing_price_cache"
  ON public.swing_price_cache FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- swing_reports: restrict to admin
DROP POLICY IF EXISTS "Allow anonymous delete swing_reports" ON public.swing_reports;
CREATE POLICY "Admins can delete swing_reports"
  ON public.swing_reports FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous insert swing_reports" ON public.swing_reports;
CREATE POLICY "Admins can insert swing_reports"
  ON public.swing_reports FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous update swing_reports" ON public.swing_reports;
CREATE POLICY "Admins can update swing_reports"
  ON public.swing_reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- swing_upload_tokens: restrict to admin
DROP POLICY IF EXISTS "Allow anonymous delete swing_upload_tokens" ON public.swing_upload_tokens;
CREATE POLICY "Admins can delete swing_upload_tokens"
  ON public.swing_upload_tokens FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous insert swing_upload_tokens" ON public.swing_upload_tokens;
CREATE POLICY "Admins can insert swing_upload_tokens"
  ON public.swing_upload_tokens FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow anonymous update swing_upload_tokens" ON public.swing_upload_tokens;
CREATE POLICY "Admins can update swing_upload_tokens"
  ON public.swing_upload_tokens FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- x_post_log: restrict to admin
DROP POLICY IF EXISTS "Service role can insert X posts" ON public.x_post_log;
CREATE POLICY "Admins can insert X posts"
  ON public.x_post_log FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- distribution_logs: restrict to admin
DROP POLICY IF EXISTS "Service role can insert distribution logs" ON public.distribution_logs;
CREATE POLICY "Admins can insert distribution logs"
  ON public.distribution_logs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- sentiment_metrics: restrict to admin
DROP POLICY IF EXISTS "Allow service role insert on sentiment_metrics" ON public.sentiment_metrics;
CREATE POLICY "Admins can insert sentiment_metrics"
  ON public.sentiment_metrics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- portfolio_metrics: restrict to admin
DROP POLICY IF EXISTS "Allow service role insert on portfolio_metrics" ON public.portfolio_metrics;
CREATE POLICY "Admins can insert portfolio_metrics"
  ON public.portfolio_metrics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- bitcoin_funnel_leads: restrict INSERT (edge function uses service role)
DROP POLICY IF EXISTS "Service role can insert leads" ON public.bitcoin_funnel_leads;
CREATE POLICY "Service insert bitcoin leads"
  ON public.bitcoin_funnel_leads FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
