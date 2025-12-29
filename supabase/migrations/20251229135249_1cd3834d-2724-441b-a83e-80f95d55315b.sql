-- Insert demo report
INSERT INTO public.reports (
  slug,
  title,
  subtitle,
  description,
  author,
  category,
  edition,
  price_eur,
  status,
  has_live_data,
  cover_image_url,
  published_at,
  seo_title,
  seo_description
) VALUES (
  'private-equity-outlook-2025',
  'Private Equity Outlook 2025',
  'Strategic Analysis & Investment Opportunities',
  'Comprehensive analysis of private equity market trends, emerging opportunities, and strategic considerations for institutional investors in 2025 and beyond.',
  'ARIES76 Research',
  'Private Equity',
  'Q1 2025',
  149,
  'published',
  false,
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  NOW(),
  'Private Equity Outlook 2025 | ARIES76 Research',
  'In-depth analysis of PE market trends and investment opportunities for 2025'
);

-- Insert demo sections
WITH report_ref AS (
  SELECT id FROM public.reports WHERE slug = 'private-equity-outlook-2025' LIMIT 1
)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, subtitle, content_md, is_preview)
SELECT 
  report_ref.id,
  1,
  'text',
  'Executive Summary',
  'Key Findings & Strategic Recommendations',
  '<p>The private equity landscape in 2025 presents a unique confluence of challenges and opportunities. After a period of adjustment following the interest rate normalization cycle, we observe several key trends:</p><ul><li><strong>Dry powder at record levels:</strong> Over $2.5 trillion in committed capital</li><li><strong>GP-led secondaries surge:</strong> Continuation vehicles becoming mainstream</li><li><strong>AI-driven value creation:</strong> Portfolio companies leveraging AI</li></ul>',
  true
FROM report_ref;

WITH report_ref AS (
  SELECT id FROM public.reports WHERE slug = 'private-equity-outlook-2025' LIMIT 1
)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, content_md, is_preview)
SELECT 
  report_ref.id,
  2,
  'callout',
  'Key Insight',
  'Fundraising cycles are extending to 18-24 months on average. LPs are concentrating allocations with proven managers while selectively backing emerging managers.',
  true
FROM report_ref;

WITH report_ref AS (
  SELECT id FROM public.reports WHERE slug = 'private-equity-outlook-2025' LIMIT 1
)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, chart_config, is_preview)
SELECT 
  report_ref.id,
  3,
  'chart',
  'Global PE Fundraising by Strategy (2020-2025E)',
  '{"type":"bar","xKey":"year","yKeys":[{"key":"buyout","name":"Buyout","color":"#C9A227"},{"key":"growth","name":"Growth","color":"#1E3A5F"}],"data":[{"year":"2020","buyout":280,"growth":120},{"year":"2021","buyout":420,"growth":180},{"year":"2022","buyout":380,"growth":150},{"year":"2023","buyout":320,"growth":130},{"year":"2024","buyout":350,"growth":140},{"year":"2025E","buyout":380,"growth":160}]}'::jsonb,
  false
FROM report_ref;

WITH report_ref AS (
  SELECT id FROM public.reports WHERE slug = 'private-equity-outlook-2025' LIMIT 1
)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, table_data, is_preview)
SELECT 
  report_ref.id,
  4,
  'table',
  'Top PE Strategies by Expected Returns',
  '{"headers":["Strategy","Target IRR","Risk Level","Outlook"],"rows":[["Secondary Buyouts","18-22%","Medium","Positive"],["GP-Led Secondaries","15-20%","Medium-Low","Strong"],["Growth Equity","25-35%","High","Selective"]],"highlightRows":[1]}'::jsonb,
  false
FROM report_ref;

WITH report_ref AS (
  SELECT id FROM public.reports WHERE slug = 'private-equity-outlook-2025' LIMIT 1
)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, content_md, is_preview)
SELECT 
  report_ref.id,
  5,
  'text',
  'Sector Deep Dive: Technology & AI',
  '<p>Technology remains the dominant sector for PE investment. Enterprise software companies with strong recurring revenue continue to command premium valuations at 8-12x EV/Revenue.</p><p>The AI value chain presents opportunities across compute, model, and application layers.</p>',
  false
FROM report_ref;