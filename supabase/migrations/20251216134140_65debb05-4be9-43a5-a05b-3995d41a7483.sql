-- Drop restrictive SELECT policy and add permissive one for admin CMS
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

CREATE POLICY "Allow public select on blog_posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);