-- Remove old cron jobs if they exist (ignore errors)
DO $$
BEGIN
  PERFORM cron.unschedule('x-auto-post-every-2h');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('x-auto-post-hourly');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Schedule new hourly cron job
SELECT cron.schedule(
  'x-auto-post-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://cloud.lovable.dev/api/a02cb249-9f4f-423d-b6db-b29df5fdc498/functions/v1/x-auto-post',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'timestamp', now())
  );
  $$
);