-- Create table to log X posts
CREATE TABLE public.x_post_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'auto',
  status TEXT DEFAULT 'pending',
  tweet_id TEXT,
  error_message TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.x_post_log ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all posts
CREATE POLICY "Admins can view all X posts"
ON public.x_post_log
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow service role to insert (for edge function)
CREATE POLICY "Service role can insert X posts"
ON public.x_post_log
FOR INSERT
WITH CHECK (true);

-- Create index for quick queries
CREATE INDEX idx_x_post_log_posted_at ON public.x_post_log(posted_at DESC);
CREATE INDEX idx_x_post_log_status ON public.x_post_log(status);