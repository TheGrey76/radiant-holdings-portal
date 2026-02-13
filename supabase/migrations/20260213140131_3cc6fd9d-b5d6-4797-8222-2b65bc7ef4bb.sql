-- Remove all Telegram cron jobs
SELECT cron.unschedule('telegram-morning-briefing');
SELECT cron.unschedule('telegram-watchlist');
SELECT cron.unschedule('telegram-midday-pulse');
SELECT cron.unschedule('telegram-news-digest');
SELECT cron.unschedule('telegram-afternoon-analysis');
SELECT cron.unschedule('telegram-institutional-watch');
SELECT cron.unschedule('telegram-daily-wrap');

-- Disable all Telegram post templates
UPDATE telegram_post_templates SET is_active = false WHERE is_active = true;