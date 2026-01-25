-- Schedule Telegram Bitcoin Analysis at 6 AM CET (5 AM UTC)
SELECT cron.schedule(
  'telegram-bitcoin-analysis-morning',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url := 'https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-publish',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body := '{"action": "publish", "type": "bitcoin"}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule Telegram Bitcoin Analysis at 17:30 CET (16:30 UTC)
SELECT cron.schedule(
  'telegram-bitcoin-analysis-afternoon',
  '30 16 * * *',
  $$
  SELECT net.http_post(
    url := 'https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-publish',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body := '{"action": "publish", "type": "bitcoin"}'::jsonb
  ) AS request_id;
  $$
);