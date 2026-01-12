-- Add publications for today (after 10:45 AM Rome time = 09:45 UTC)
INSERT INTO telegram_scheduled_publications (publication_type, scheduled_time, is_active) VALUES
('bitcoin', '10:45:00', true),
('ethereum', '12:00:00', true),
('news', '15:00:00', true);