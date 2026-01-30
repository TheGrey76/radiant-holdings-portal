-- Reset all LinkedIn URLs to NULL for fresh enrichment from verified sources only
UPDATE abc_investors SET linkedin = NULL WHERE linkedin IS NOT NULL AND linkedin != '';