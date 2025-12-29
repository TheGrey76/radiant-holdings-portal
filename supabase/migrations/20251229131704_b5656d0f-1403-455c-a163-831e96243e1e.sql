-- =============================================
-- ARIES76 Research Hub - Database Schema
-- =============================================

-- 1. Reports table - main report metadata
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    price_eur DECIMAL(10,2) NOT NULL DEFAULT 99.00,
    stripe_price_id TEXT,
    cover_image_url TEXT,
    preview_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    category TEXT NOT NULL DEFAULT 'research',
    author TEXT NOT NULL DEFAULT 'ARIES76 Research',
    edition TEXT,
    has_live_data BOOLEAN NOT NULL DEFAULT false,
    live_data_source TEXT,
    metadata JSONB DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Report sections - ordered content blocks
CREATE TABLE public.report_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    section_type TEXT NOT NULL CHECK (section_type IN ('hero', 'text', 'chart', 'table', 'callout', 'image', 'quote', 'divider', 'live_data')),
    title TEXT,
    subtitle TEXT,
    content_md TEXT,
    chart_config JSONB,
    table_data JSONB,
    image_url TEXT,
    css_classes TEXT,
    is_preview BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Report purchases - track who bought what
CREATE TABLE public.report_purchases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT,
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'eur',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    access_token UUID DEFAULT gen_random_uuid(),
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create indexes for performance
CREATE INDEX idx_reports_slug ON public.reports(slug);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_category ON public.reports(category);
CREATE INDEX idx_report_sections_report_id ON public.report_sections(report_id);
CREATE INDEX idx_report_sections_order ON public.report_sections(report_id, order_index);
CREATE INDEX idx_report_purchases_email ON public.report_purchases(user_email);
CREATE INDEX idx_report_purchases_report ON public.report_purchases(report_id);
CREATE INDEX idx_report_purchases_session ON public.report_purchases(stripe_session_id);

-- 5. Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_purchases ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for reports
CREATE POLICY "Published reports are publicly viewable"
ON public.reports FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage all reports"
ON public.reports FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 7. RLS Policies for report_sections
CREATE POLICY "Sections of published reports are viewable"
ON public.report_sections FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.reports 
        WHERE reports.id = report_sections.report_id 
        AND reports.status = 'published'
    )
);

CREATE POLICY "Admins can manage all sections"
ON public.report_sections FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 8. RLS Policies for report_purchases
CREATE POLICY "Users can view their own purchases by email"
ON public.report_purchases FOR SELECT
USING (true);

CREATE POLICY "Service role can manage purchases"
ON public.report_purchases FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can insert purchases via edge function"
ON public.report_purchases FOR INSERT
WITH CHECK (true);

-- 9. Function to check report access
CREATE OR REPLACE FUNCTION public.check_report_access(
    p_report_slug TEXT,
    p_user_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.report_purchases rp
        JOIN public.reports r ON r.id = rp.report_id
        WHERE r.slug = p_report_slug
        AND LOWER(rp.user_email) = LOWER(p_user_email)
        AND rp.status = 'completed'
        AND (rp.expires_at IS NULL OR rp.expires_at > NOW())
    );
END;
$$;

-- 10. Trigger to update updated_at
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_sections_updated_at
    BEFORE UPDATE ON public.report_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();