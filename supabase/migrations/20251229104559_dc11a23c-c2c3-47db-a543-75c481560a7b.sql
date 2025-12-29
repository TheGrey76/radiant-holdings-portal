-- Remove public write access from blog_posts table
-- Keep public SELECT for reading published content

-- Drop overly permissive public policies
DROP POLICY IF EXISTS "Allow public delete on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public insert on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public update on blog_posts" ON public.blog_posts;

-- The "Admins can manage all blog posts" policy already exists and handles admin access
-- Verify it covers all operations (it uses ALL command)