-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule daily update at 6:00 AM UTC
SELECT cron.schedule(
  'update-bitcoin-treasuries-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/fetch-bitcoin-treasuries',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);