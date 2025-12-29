-- Insert demo sections for the existing report (created in previous migration)
-- Section 2: Callout (Preview) - replacing key_takeaway with callout
INSERT INTO public.report_sections (report_id, order_index, section_type, title, content_md, is_preview)
SELECT 
  r.id,
  2,
  'callout',
  'Key Insight',
  'Fundraising cycles are extending to 18-24 months on average, with first-time funds facing particular headwinds. LPs are concentrating allocations with proven managers while selectively backing emerging managers with differentiated strategies.',
  true
FROM public.reports r WHERE r.slug = 'private-equity-outlook-2025';

-- Section 3: Chart (Premium)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, chart_config, is_preview)
SELECT 
  r.id,
  3,
  'chart',
  'Global PE Fundraising by Strategy (2020-2025E)',
  '{
    "type": "bar",
    "xKey": "year",
    "yKeys": [
      {"key": "buyout", "name": "Buyout", "color": "#C9A227"},
      {"key": "growth", "name": "Growth Equity", "color": "#1E3A5F"},
      {"key": "venture", "name": "Venture Capital", "color": "#6B7280"}
    ],
    "showGrid": true,
    "showLegend": true,
    "data": [
      {"year": "2020", "buyout": 280, "growth": 120, "venture": 180},
      {"year": "2021", "buyout": 420, "growth": 180, "venture": 330},
      {"year": "2022", "buyout": 380, "growth": 150, "venture": 220},
      {"year": "2023", "buyout": 320, "growth": 130, "venture": 170},
      {"year": "2024", "buyout": 350, "growth": 140, "venture": 190},
      {"year": "2025E", "buyout": 380, "growth": 160, "venture": 210}
    ]
  }'::jsonb,
  false
FROM public.reports r WHERE r.slug = 'private-equity-outlook-2025';

-- Section 4: Table (Premium)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, table_data, is_preview)
SELECT 
  r.id,
  4,
  'table',
  'Top PE Strategies by Expected Returns',
  '{
    "headers": ["Strategy", "Target IRR", "Risk Level", "Outlook"],
    "rows": [
      ["Secondary Buyouts", "18-22%", "Medium", "Positive"],
      ["GP-Led Secondaries", "15-20%", "Medium-Low", "Strong"],
      ["Growth Equity (Tech)", "25-35%", "High", "Selective"],
      ["Infrastructure", "10-14%", "Low", "Stable"],
      ["Private Credit", "12-16%", "Medium", "Expanding"]
    ],
    "highlightRows": [1, 2]
  }'::jsonb,
  false
FROM public.reports r WHERE r.slug = 'private-equity-outlook-2025';

-- Section 5: Analysis (Premium)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, content_md, is_preview)
SELECT 
  r.id,
  5,
  'text',
  'Sector Deep Dive: Technology & AI',
  '<p>Technology remains the dominant sector for PE investment, but the focus has shifted dramatically:</p>
  <h4>Enterprise Software</h4>
  <p>Enterprise software companies with strong recurring revenue profiles continue to command premium valuations. The median EV/Revenue multiple for high-growth SaaS has stabilized at 8-12x, down from the 20x+ peaks of 2021.</p>
  <h4>AI Infrastructure</h4>
  <p>The AI value chain presents compelling opportunities across compute, model, and application layers.</p>
  <h4>Cybersecurity</h4>
  <p>With increasing regulatory requirements and threat sophistication, cybersecurity remains a defensive allocation with strong secular tailwinds.</p>',
  false
FROM public.reports r WHERE r.slug = 'private-equity-outlook-2025';

-- Section 6: Callout (Premium)
INSERT INTO public.report_sections (report_id, order_index, section_type, title, content_md, is_preview)
SELECT 
  r.id,
  6,
  'callout',
  'Strategic Recommendation',
  'LPs should consider increasing allocations to GP-led secondaries and continuation vehicles. These structures offer liquidity solutions while maintaining exposure to high-quality assets with extended runway for value creation.',
  false
FROM public.reports r WHERE r.slug = 'private-equity-outlook-2025';