
-- Remove old telegram cron jobs
SELECT cron.unschedule('telegram-bitcoin-analysis-morning');
SELECT cron.unschedule('telegram-bitcoin-analysis-afternoon');

-- 06:00 CET = 05:00 UTC — Morning Briefing
SELECT cron.schedule(
  'telegram-morning-briefing',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "morning_briefing"}'::jsonb
  ) AS request_id;
  $$
);

-- 09:00 CET = 08:00 UTC — Watchlist
SELECT cron.schedule(
  'telegram-watchlist',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "watchlist"}'::jsonb
  ) AS request_id;
  $$
);

-- 12:00 CET = 11:00 UTC — Midday Pulse
SELECT cron.schedule(
  'telegram-midday-pulse',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "midday_pulse"}'::jsonb
  ) AS request_id;
  $$
);

-- 15:00 CET = 14:00 UTC — News Digest
SELECT cron.schedule(
  'telegram-news-digest',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "news_digest"}'::jsonb
  ) AS request_id;
  $$
);

-- 17:30 CET = 16:30 UTC — Afternoon Analysis
SELECT cron.schedule(
  'telegram-afternoon-analysis',
  '30 16 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "afternoon_analysis"}'::jsonb
  ) AS request_id;
  $$
);

-- 20:00 CET = 19:00 UTC — Institutional Watch
SELECT cron.schedule(
  'telegram-institutional-watch',
  '0 19 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "institutional_watch"}'::jsonb
  ) AS request_id;
  $$
);

-- 22:00 CET = 21:00 UTC — Daily Wrap-up
SELECT cron.schedule(
  'telegram-daily-wrap',
  '0 21 * * *',
  $$
  SELECT net.http_post(
    url:='https://dvwmyljnssspwfpwocof.supabase.co/functions/v1/telegram-multi-asset',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d215bGpuc3NzcHdmcHdvY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjI2MTUsImV4cCI6MjA1MjY5ODYxNX0.bhJ41w6gV6BsIxcPlHiJhc0uWm1Z3lc3G6NX7PUgpL0"}'::jsonb,
    body:='{"post_type": "daily_wrap"}'::jsonb
  ) AS request_id;
  $$
);
