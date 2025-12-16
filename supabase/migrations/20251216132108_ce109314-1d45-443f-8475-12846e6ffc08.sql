-- Create blog_posts table for original articles
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'insights',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author TEXT NOT NULL DEFAULT 'ARIES76 Research',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_sources table for RSS feeds and API configurations
CREATE TABLE public.news_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('rss', 'api', 'manual')),
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  fetch_interval_minutes INTEGER DEFAULT 60,
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create aggregated_news table for collected news items
CREATE TABLE public.aggregated_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES public.news_sources(id) ON DELETE SET NULL,
  external_id TEXT,
  title TEXT NOT NULL,
  original_url TEXT NOT NULL,
  original_content TEXT,
  image_url TEXT,
  source_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  published_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_processed BOOLEAN NOT NULL DEFAULT false,
  is_curated BOOLEAN NOT NULL DEFAULT false,
  relevance_score INTEGER DEFAULT 0,
  UNIQUE(external_id, source_id)
);

-- Create curated_content table for AI-processed summaries
CREATE TABLE public.curated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES public.aggregated_news(id) ON DELETE CASCADE,
  ai_summary TEXT NOT NULL,
  ai_commentary TEXT,
  ai_tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts FOR ALL 
USING (get_current_user_role() = 'admin');

-- RLS Policies for news_sources (admin only)
CREATE POLICY "Admins can manage news sources" 
ON public.news_sources FOR ALL 
USING (get_current_user_role() = 'admin');

-- RLS Policies for aggregated_news
CREATE POLICY "Anyone can view aggregated news" 
ON public.aggregated_news FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage aggregated news" 
ON public.aggregated_news FOR ALL 
USING (get_current_user_role() = 'admin');

-- RLS Policies for curated_content
CREATE POLICY "Anyone can view published curated content" 
ON public.curated_content FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all curated content" 
ON public.curated_content FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create indexes for performance
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_aggregated_news_source ON public.aggregated_news(source_id);
CREATE INDEX idx_aggregated_news_processed ON public.aggregated_news(is_processed);
CREATE INDEX idx_curated_content_status ON public.curated_content(status);

-- Update trigger for timestamps
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_sources_updated_at
BEFORE UPDATE ON public.news_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curated_content_updated_at
BEFORE UPDATE ON public.curated_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default news sources for PE/VC/FO sectors
INSERT INTO public.news_sources (name, source_type, url, category) VALUES
('Private Equity International', 'rss', 'https://www.privateequityinternational.com/feed/', 'private_equity'),
('PitchBook News', 'rss', 'https://pitchbook.com/news/rss', 'venture_capital'),
('Institutional Investor PE', 'rss', 'https://www.institutionalinvestor.com/rss/private-equity', 'private_equity'),
('Preqin Insights', 'rss', 'https://www.preqin.com/insights/rss', 'alternatives'),
('Bloomberg Crypto', 'rss', 'https://www.bloomberg.com/crypto/rss', 'digital_assets'),
('CoinDesk', 'rss', 'https://www.coindesk.com/arc/outboundfeeds/rss/', 'digital_assets'),
('Family Capital', 'rss', 'https://www.famcap.com/feed/', 'family_office'),
('Finnhub API', 'api', 'https://finnhub.io/api/v1/news', 'markets');