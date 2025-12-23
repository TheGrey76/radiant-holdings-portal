-- Create search index table for full-text search
CREATE TABLE public.search_index (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'blog', 'page', 'service', 'report'
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT NOT NULL,
  tags TEXT[],
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GIN index for fast full-text search
CREATE INDEX search_index_search_vector_idx ON public.search_index USING GIN (search_vector);

-- Create index on content_type for filtering
CREATE INDEX search_index_content_type_idx ON public.search_index (content_type);

-- Enable RLS
ALTER TABLE public.search_index ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Search index is publicly readable"
  ON public.search_index
  FOR SELECT
  USING (true);

-- Allow service role to manage
CREATE POLICY "Service role can manage search index"
  ON public.search_index
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to update search vector on insert/update
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update search vector
CREATE TRIGGER update_search_index_vector
  BEFORE INSERT OR UPDATE ON public.search_index
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- Function for full-text search
CREATE OR REPLACE FUNCTION search_content(search_query TEXT, content_type_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  title TEXT,
  description TEXT,
  url TEXT,
  tags TEXT[],
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    si.id,
    si.content_type,
    si.title,
    si.description,
    si.url,
    si.tags,
    ts_rank(si.search_vector, plainto_tsquery('english', search_query)) AS rank
  FROM public.search_index si
  WHERE 
    si.search_vector @@ plainto_tsquery('english', search_query)
    AND (content_type_filter IS NULL OR si.content_type = content_type_filter)
  ORDER BY rank DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;