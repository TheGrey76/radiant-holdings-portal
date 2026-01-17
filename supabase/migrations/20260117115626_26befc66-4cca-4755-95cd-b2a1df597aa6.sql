-- Fix x-auto-post cron to call the Supabase Edge Function endpoint directly
-- 1) Remove the existing job (currently points to cloud.lovable.dev)
SELECT cron.unschedule(4);

-- 2) Re-create the hourly job calling the correct Supabase Functions URL
SELECT cron.schedule(
  'x-auto-post-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/x-auto-post',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'timestamp', now())
  ) AS request_id;
  $$
);