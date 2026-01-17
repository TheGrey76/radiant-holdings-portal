-- Schedule X auto-post every 2 hours
SELECT cron.schedule(
  'x-auto-post-every-2h',
  '0 */2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/x-auto-post',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body := '{"action": "auto-post"}'::jsonb
  ) AS request_id;
  $$
);