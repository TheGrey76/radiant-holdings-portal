-- Fix scheduled times: convert from Rome time to UTC (-1 hour)
UPDATE telegram_scheduled_publications 
SET scheduled_time = '05:00:00' 
WHERE scheduled_time = '06:00:00' AND publication_type = 'bitcoin';

UPDATE telegram_scheduled_publications 
SET scheduled_time = '08:00:00' 
WHERE scheduled_time = '09:00:00' AND publication_type = 'ethereum';

UPDATE telegram_scheduled_publications 
SET scheduled_time = '17:00:00' 
WHERE scheduled_time = '18:00:00' AND publication_type = 'news';

UPDATE telegram_scheduled_publications 
SET scheduled_time = '17:30:00' 
WHERE scheduled_time = '18:30:00' AND publication_type = 'bitcoin';

-- Delete the test entry at 09:50
DELETE FROM telegram_scheduled_publications 
WHERE scheduled_time = '09:50:00';