-- Clean LinkedIn URLs: remove query parameters and trailing slashes
UPDATE abc_investors 
SET linkedin = RTRIM(SPLIT_PART(linkedin, '?', 1), '/')
WHERE linkedin IS NOT NULL 
  AND linkedin != '' 
  AND linkedin != 'null'
  AND (linkedin LIKE '%?%' OR linkedin LIKE '%/');