import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TreasuryData {
  rank: number;
  company_name: string;
  ticker: string | null;
  country: string | null;
  bitcoin_holdings: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Bitcoin Treasury data from bitcointreasuries.net...');

    // Use Firecrawl to scrape the page
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://bitcointreasuries.net/',
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to scrape data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log('Received markdown, length:', markdown.length);

    // Parse the markdown table to extract treasury data
    const treasuries: TreasuryData[] = [];
    const lines = markdown.split('\n');
    
    // Extract BTC price from the page
    let btcPrice = 0;
    const priceMatch = markdown.match(/\$([0-9,]+)/);
    if (priceMatch) {
      btcPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    }
    console.log('BTC Price detected:', btcPrice);

    // Parse table rows
    for (const line of lines) {
      // Match table rows like: | 1 | [Strategy](...) | ... | MSTR | 671,268 |
      const tableMatch = line.match(/^\|\s*(\d+)\s*\|.*?\[(.*?)\].*?\|\s*.*?\s*\|\s*([A-Z]+)\s*\|\s*([0-9,]+)\s*\|/);
      
      if (tableMatch) {
        const rank = parseInt(tableMatch[1]);
        const companyName = tableMatch[2].trim();
        const ticker = tableMatch[3].trim();
        const holdings = parseFloat(tableMatch[4].replace(/,/g, ''));
        
        if (rank <= 20) { // Top 20 companies
          treasuries.push({
            rank,
            company_name: companyName,
            ticker: ticker || null,
            country: 'USA', // Default, can be enhanced
            bitcoin_holdings: holdings,
          });
        }
      }
    }

    console.log(`Parsed ${treasuries.length} treasury entries`);

    // If we couldn't parse the table, try a simpler regex
    if (treasuries.length === 0) {
      console.log('Trying alternative parsing...');
      
      // Look for patterns like "Strategy ... MSTR 671,268"
      const companyPatterns = [
        { name: 'Strategy', ticker: 'MSTR' },
        { name: 'MARA Holdings', ticker: 'MARA' },
        { name: 'Twenty One Capital', ticker: 'XXI' },
        { name: 'Metaplanet', ticker: 'MTPLF' },
        { name: 'Bitcoin Standard Treasury', ticker: 'CEPO' },
        { name: 'Bullish', ticker: 'BLSH' },
        { name: 'Riot Platforms', ticker: 'RIOT' },
        { name: 'Coinbase', ticker: 'COIN' },
        { name: 'Galaxy Digital', ticker: 'GLXY' },
        { name: 'Hut 8', ticker: 'HUT' },
      ];

      let rank = 1;
      for (const pattern of companyPatterns) {
        // Look for the holdings number near the ticker
        const regex = new RegExp(`${pattern.ticker}\\s*\\|\\s*([0-9,]+)`, 'i');
        const match = markdown.match(regex);
        
        if (match) {
          treasuries.push({
            rank: rank++,
            company_name: pattern.name,
            ticker: pattern.ticker,
            country: 'USA',
            bitcoin_holdings: parseFloat(match[1].replace(/,/g, '')),
          });
        }
      }
      
      console.log(`Alternative parsing found ${treasuries.length} entries`);
    }

    // Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (treasuries.length > 0) {
      // Upsert the data
      for (const treasury of treasuries) {
        const { error } = await supabase
          .from('bitcoin_treasuries')
          .upsert({
            rank: treasury.rank,
            company_name: treasury.company_name,
            ticker: treasury.ticker,
            country: treasury.country,
            bitcoin_holdings: treasury.bitcoin_holdings,
            btc_price_usd: btcPrice,
            value_usd: treasury.bitcoin_holdings * btcPrice,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'ticker',
          });

        if (error) {
          console.error('Error upserting treasury:', treasury.ticker, error);
        }
      }

      console.log('Successfully saved treasury data to database');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: treasuries,
        btc_price: btcPrice,
        count: treasuries.length,
        updated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-bitcoin-treasuries:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
