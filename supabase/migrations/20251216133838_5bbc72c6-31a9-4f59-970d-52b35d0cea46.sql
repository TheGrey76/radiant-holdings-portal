-- Add permissive RLS policies for blog_posts (admin CMS)
CREATE POLICY "Allow public insert on blog_posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on blog_posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on blog_posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);