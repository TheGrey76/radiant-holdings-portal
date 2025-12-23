import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Static content to index
const staticContent = [
  // Pages
  { content_type: 'page', title: 'About Us - Who We Are', description: 'Learn about ARIES76 Capital Intelligence, our mission, values, and approach to private markets advisory.', url: '/about', tags: ['about', 'company', 'mission'] },
  { content_type: 'page', title: 'Leadership Team', description: 'Meet the experienced professionals leading ARIES76 Capital Intelligence.', url: '/leadership-team', tags: ['team', 'leadership', 'people'] },
  { content_type: 'page', title: 'Contact Us', description: 'Get in touch with ARIES76 for private markets advisory, fund placement, and capital solutions.', url: '/contact', tags: ['contact', 'inquiry', 'reach out'] },
  { content_type: 'page', title: 'FAQ - Frequently Asked Questions', description: 'Find answers to common questions about our services and private markets advisory.', url: '/faq', tags: ['faq', 'questions', 'help'] },
  { content_type: 'page', title: 'For Limited Partners', description: 'Exclusive opportunities and services for institutional investors and limited partners seeking quality fund investments.', url: '/for-limited-partners', tags: ['LP', 'limited partners', 'investors', 'institutional'] },
  { content_type: 'page', title: 'Strategic Partnerships', description: 'Explore partnership opportunities with ARIES76 Capital Intelligence.', url: '/strategic-partnerships', tags: ['partnerships', 'collaboration', 'alliance'] },
  
  // Services
  { content_type: 'service', title: 'Private Equity Fund Placement', description: 'Comprehensive fund placement services connecting GPs with institutional investors across Europe and globally.', url: '/private-equity-funds', tags: ['fund placement', 'private equity', 'GP', 'fundraising'] },
  { content_type: 'service', title: 'GP Capital Advisory', description: 'Strategic capital solutions for general partners including GP stakes, continuation vehicles, and management company financing.', url: '/gp-capital-advisory', tags: ['GP capital', 'GP stakes', 'continuation', 'NAV financing'] },
  { content_type: 'service', title: 'Family Office Advisory', description: 'Tailored advisory services for family offices seeking private market opportunities and portfolio optimization.', url: '/family-office-advisory', tags: ['family office', 'wealth management', 'UHNW', 'private wealth'] },
  { content_type: 'service', title: 'Structured Products', description: 'Custom structured products and investment certificates for sophisticated investors seeking tailored risk-return profiles.', url: '/structured-products', tags: ['structured products', 'certificates', 'derivatives', 'yield enhancement'] },
  
  // Reports
  { content_type: 'report', title: 'Bitcoin 2026: Institutional Adoption Report', description: 'Comprehensive analysis of Bitcoin institutional adoption trends, corporate treasury strategies, and macro drivers for 2026.', url: '/bitcoin-2026-report', tags: ['bitcoin', 'crypto', 'institutional', 'treasury', 'macro'] },
  
  // Blog posts (from blogPosts.ts)
  { content_type: 'blog', title: 'GP Capital Advisory in 2025: Record Activity and Strategic Imperatives', description: 'An in-depth analysis of the evolving GP capital advisory landscape, featuring record transaction volumes, emerging deal structures, and the strategic priorities shaping management company growth.', url: '/blog/gp-capital-advisory-trends-2025', tags: ['GP Capital Advisory', '2025', 'trends'] },
  { content_type: 'blog', title: "Big Tech's $50 Billion AI Bet on India: What It Means for Global Investors", description: 'Microsoft, Amazon, and Google commit over $50 billion to AI infrastructure in India in under 24 hours. We analyze the strategic implications for institutional investors and the emerging AI infrastructure opportunity.', url: '/blog/big-tech-ai-investment-india-2025', tags: ['AI', 'Technology', 'India', 'infrastructure'] },
  { content_type: 'blog', title: 'Family Office Asset Allocation in 2026: The New Paradigm', description: 'How family offices are reshaping their portfolios for 2026. From private markets expansion to AI-driven strategies, discover the allocation trends defining wealth preservation and growth.', url: '/blog/family-office-allocation-2026', tags: ['Family Offices', 'allocation', '2026'] },
  { content_type: 'blog', title: 'Investment Certificates in 2025: Navigating the New Era of Structured Solutions', description: 'How investment certificates are evolving to meet sophisticated investor demands in a high-volatility environment.', url: '/blog/investment-certificates-2025-new-era', tags: ['Structured Products', 'certificates', '2025'] },
  { content_type: 'blog', title: '5 Key Trends Shaping Private Equity Fundraising in 2026', description: 'The era of easy capital is over. Discover the five fundamental trends every GP must understand to succeed in fundraising in 2026.', url: '/blog/private-equity-fundraising-trends-2026', tags: ['Private Equity', 'fundraising', '2026'] },
  { content_type: 'blog', title: 'Does Venture Capital Still Make Sense in 2025? A Strategic Reassessment', description: 'After challenging years for VC, we examine whether venture capital still offers value to sophisticated investors.', url: '/blog/venture-capital-value-proposition-2025', tags: ['Venture Capital', 'VC', '2025'] },
  { content_type: 'blog', title: 'The Digital Revolution in Structured Products: Tokenization and AI Transform the Market in 2025', description: 'How blockchain tokenization, AI-powered structuring, and digital distribution are reshaping the €500 billion European structured products market.', url: '/blog/structured-products-digital-revolution-2025', tags: ['Structured Products', 'tokenization', 'blockchain', 'AI'] },
  { content_type: 'blog', title: "Italy's Structured Products Market Reaches Record €8 Billion in Q3 2025", description: 'The Italian certificates market achieves unprecedented volumes with €8 billion placed in Q3 2025.', url: '/blog/italy-structured-products-record-q3-2025', tags: ['Structured Products', 'Italy', 'certificates'] },
  { content_type: 'blog', title: 'AI-Driven Due Diligence: How Machine Learning is Reshaping Private Markets', description: 'Artificial intelligence is revolutionizing the way GPs analyze deals and LPs evaluate fund managers.', url: '/blog/ai-driven-due-diligence-private-markets', tags: ['AI', 'due diligence', 'private markets'] },
  { content_type: 'blog', title: 'AIRES: Transforming Investor Targeting with AI-Powered Precision', description: 'Discover how AIRES leverages artificial intelligence to revolutionize investor targeting in private markets.', url: '/blog/aires-transforming-investor-targeting', tags: ['AIRES', 'AI', 'investor targeting'] },
  { content_type: 'blog', title: 'GP Equity: The Next Frontier in Private Markets Capital Formation', description: 'As private markets continue to mature, GP equity is emerging as a critical tool for management company growth.', url: '/blog/gp-equity-next-frontier', tags: ['GP Equity', 'capital formation', 'private markets'] },
  { content_type: 'blog', title: 'Succession Planning for Private Equity Firms: A Strategic Imperative', description: 'How second-generation GPs can navigate leadership transitions while maintaining performance and investor confidence.', url: '/blog/succession-planning-strategic-imperative', tags: ['Succession', 'private equity', 'leadership'] },
  { content_type: 'blog', title: 'Valuing Management Companies: Beyond AUM and Carry', description: "Traditional valuation metrics don't capture the full picture of a modern GP platform.", url: '/blog/valuing-management-companies', tags: ['valuation', 'management company', 'GP'] },
  { content_type: 'blog', title: 'Digital Infrastructure & AI: The New Core Allocation', description: 'Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation.', url: '/blog/digital-infrastructure-ai-core-allocation', tags: ['infrastructure', 'AI', 'allocation'] },
  { content_type: 'blog', title: 'Cross-Border Fund Structuring: Navigating European Private Markets', description: 'A comprehensive guide to structuring private equity funds across European jurisdictions.', url: '/blog/cross-border-fund-structuring', tags: ['fund structuring', 'Europe', 'regulation'] },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting search index seeding...');

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('search_index')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing search index:', deleteError);
    }

    // Insert static content
    const { data, error: insertError } = await supabase
      .from('search_index')
      .insert(staticContent)
      .select();

    if (insertError) {
      console.error('Error inserting content:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully indexed ${data?.length || 0} items`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Indexed ${data?.length || 0} items`,
        items: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Seeding error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
