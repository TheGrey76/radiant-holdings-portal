-- Add scheduled_for, generated_content, and blog_post_id to linkedin posts
ALTER TABLE public.bitcoin_funnel_linkedin_posts 
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS generated_content TEXT,
ADD COLUMN IF NOT EXISTS blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL;

-- Create index for calendar queries
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_scheduled ON public.bitcoin_funnel_linkedin_posts(scheduled_for) WHERE scheduled_for IS NOT NULL;