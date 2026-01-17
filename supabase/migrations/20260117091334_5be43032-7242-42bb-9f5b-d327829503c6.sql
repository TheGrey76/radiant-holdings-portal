-- Update the cron job to run every hour instead of every 2 hours
SELECT cron.unschedule('x-auto-post-every-2h');

SELECT cron.schedule(
  'x-auto-post-hourly',
  '0 * * * *', -- every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://cloud.lovable.dev/api/a02cb249-9f4f-423d-b6db-b29df5fdc498/functions/v1/x-auto-post',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaWVzNzYtcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5MjI0MDAwLCJleHAiOjIwMjQ4MDAwMDB9.placeholder'
    ),
    body := jsonb_build_object('scheduled', true, 'timestamp', now())
  );
  $$
);