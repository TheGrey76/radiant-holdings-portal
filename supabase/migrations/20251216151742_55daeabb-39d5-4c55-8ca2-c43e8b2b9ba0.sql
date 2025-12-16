-- Add policy to allow reading all curated content for CMS purposes
CREATE POLICY "Allow reading all curated content for CMS"
ON public.curated_content
FOR SELECT
USING (true);

-- Drop the old restrictive policy since the new one is more permissive
DROP POLICY IF EXISTS "Anyone can view published curated content" ON public.curated_content;