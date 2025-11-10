-- Add linkedin_url column to financial_advisers table
ALTER TABLE financial_advisers 
ADD COLUMN IF NOT EXISTS linkedin_url text;