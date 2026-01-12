-- Delete the incorrect entries and add with UTC times (Rome -1 hour)
DELETE FROM telegram_scheduled_publications WHERE scheduled_time IN ('10:45:00', '12:00:00', '15:00:00');

-- Add publications with correct UTC times for today
-- Rome 11:00 = UTC 10:00, Rome 13:00 = UTC 12:00, Rome 16:00 = UTC 15:00
INSERT INTO telegram_scheduled_publications (publication_type, scheduled_time, is_active) VALUES
('bitcoin', '09:50:00', true);  -- This will trigger in ~2 minutes (Rome 10:50)