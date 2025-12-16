-- Add policy to allow updating curated content for CMS purposes
CREATE POLICY "Allow updating curated content for CMS"
ON public.curated_content
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add policy to allow inserting curated content for AI processing
CREATE POLICY "Allow inserting curated content for AI processing"
ON public.curated_content
FOR INSERT
WITH CHECK (true);

-- Add policy to allow deleting curated content for CMS
CREATE POLICY "Allow deleting curated content for CMS"
ON public.curated_content
FOR DELETE
USING (true);