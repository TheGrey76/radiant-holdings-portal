import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const CHANNEL_ID = '@aries76_bitcoin';

// Fetch live prices from CoinGecko
async function fetchLiveCryptoPrices(): Promise<{
  bitcoin: { usd: number; eur: number; change24h: number; marketCap: number };
  ethereum: { usd: number; eur: number; change24h: number; marketCap: number };
}> {
  try {
    console.log('Fetching live crypto prices from CoinGecko...');
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true'
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('CoinGecko response:', JSON.stringify(data));
    
    return {
      bitcoin: {
        usd: data.bitcoin?.usd || 0,
        eur: data.bitcoin?.eur || 0,
        change24h: data.bitcoin?.usd_24h_change || 0,
        marketCap: data.bitcoin?.usd_market_cap || 0,
      },
      ethereum: {
        usd: data.ethereum?.usd || 0,
        eur: data.ethereum?.eur || 0,
        change24h: data.ethereum?.usd_24h_change || 0,
        marketCap: data.ethereum?.usd_market_cap || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return {
      bitcoin: { usd: 0, eur: 0, change24h: 0, marketCap: 0 },
      ethereum: { usd: 0, eur: 0, change24h: 0, marketCap: 0 },
    };
  }
}

// Format price with commas
function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// Format market cap in billions/trillions
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1_000_000_000_000) {
    return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
  }
  return `$${(marketCap / 1_000_000_000).toFixed(0)}B`;
}

// Format percentage change
function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

// Get formatted date
function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Get formatted time
function getFormattedTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Europe/Rome'
  }) + ' CET';
}

interface PublishRequest {
  action: 'publish' | 'schedule' | 'check-scheduled';
  type?: 'bitcoin' | 'ethereum' | 'news';
  data?: {
    price?: string;
    change24h?: string;
    sentiment?: string;
    signal?: string;
    resistance?: string;
    support?: string;
    news?: Array<{ title: string; source: string; url?: string }>;
  };
  scheduleTime?: string;
}

function generateBitcoinAnalysis(liveData?: {
  usd: number;
  eur: number;
  change24h: number;
  marketCap: number;
}, dbData?: {
  regime?: string;
  regimeConfidence?: number;
  targetLow?: number;
  targetHigh?: number;
  institutionalTarget?: number;
  m2Value?: number;
  realRate?: number;
}) {
  const priceUsd = liveData?.usd || 0;
  const priceEur = liveData?.eur || 0;
  const change24h = liveData?.change24h || 0;
  const marketCap = liveData?.marketCap || 0;
  
  const regime = dbData?.regime || 'ACCUMULATION';
  const regimeConfidence = dbData?.regimeConfidence || 60;
  const targetLow = dbData?.targetLow || 96000;
  const targetHigh = dbData?.targetHigh || 132000;
  const institutionalTarget = dbData?.institutionalTarget || 138000;
  const m2Value = dbData?.m2Value || 22300000000000;
  const realRate = dbData?.realRate || 1.45;

  // Determine signal based on regime
  let signal = 'NEUTRAL';
  let signalEmoji = '⚖️';
  if (regime === 'ACCUMULATION') {
    signal = 'ACCUMULATE';
    signalEmoji = '🟡';
  } else if (regime === 'EXPANSION') {
    signal = 'BULLISH';
    signalEmoji = '🟢';
  } else if (regime === 'CONTRACTION') {
    signal = 'RISK-OFF';
    signalEmoji = '🔴';
  }

  const changeEmoji = change24h >= 0 ? '📈' : '📉';

  return `
<b>ARIES76</b>
Bitcoin Market Intelligence

${getFormattedDate()}
${getFormattedTime()}


<b>PRICE</b>

${formatPrice(priceUsd)} USD
${formatPrice(priceEur, '€')} EUR
${changeEmoji} ${formatChange(change24h)} (24h)


<b>MARKET DATA</b>

Market Cap: ${formatMarketCap(marketCap)}
Global M2: $${(m2Value / 1_000_000_000_000).toFixed(1)}T
Real Rate: ${realRate >= 0 ? '+' : ''}${realRate.toFixed(2)}%


<b>REGIME ANALYSIS</b>

${signalEmoji} ${regime}
Confidence: ${regimeConfidence}%
Signal: ${signal}


<b>12-MONTH TARGETS</b>

Conservative: ${formatPrice(targetLow)}
Base Case: ${formatPrice(targetHigh)}
Institutional: ${formatPrice(institutionalTarget)}


—
aries76.com/bitcoin-research
#Bitcoin #BTC`;
}

function generateEthereumAnalysis(liveData?: {
  usd: number;
  eur: number;
  change24h: number;
  marketCap: number;
}) {
  const priceUsd = liveData?.usd || 0;
  const priceEur = liveData?.eur || 0;
  const change24h = liveData?.change24h || 0;
  const marketCap = liveData?.marketCap || 0;
  
  let signal = 'NEUTRAL';
  let signalEmoji = '⚖️';
  if (change24h > 3) {
    signal = 'BULLISH';
    signalEmoji = '🟢';
  } else if (change24h < -3) {
    signal = 'BEARISH';
    signalEmoji = '🔴';
  }
  
  const resistance = Math.round(priceUsd * 1.05);
  const support = Math.round(priceUsd * 0.95);
  const changeEmoji = change24h >= 0 ? '📈' : '📉';

  return `
<b>ARIES76</b>
Ethereum Market Intelligence

${getFormattedDate()}
${getFormattedTime()}


<b>PRICE</b>

${formatPrice(priceUsd)} USD
${formatPrice(priceEur, '€')} EUR
${changeEmoji} ${formatChange(change24h)} (24h)


<b>MARKET DATA</b>

Market Cap: ${formatMarketCap(marketCap)}


<b>TECHNICAL LEVELS</b>

Resistance: ${formatPrice(resistance)}
Support: ${formatPrice(support)}


<b>SIGNAL</b>

${signalEmoji} ${signal}


—
aries76.com/bitcoin-research
#Ethereum #ETH`;
}

function generateNewsDigest(news: Array<{ title: string; source: string; url?: string }>) {
  if (news.length === 0) {
    return `
<b>ARIES76</b>
Market Digest

${getFormattedDate()}
${getFormattedTime()}

No significant news at this time.

—
aries76.com/bitcoin-research`;
  }

  const newsItems = news.slice(0, 5).map((item, i) => {
    return `${i + 1}. ${item.title}
   ${item.source}`;
  }).join('\n\n');

  return `
<b>ARIES76</b>
Market Digest

${getFormattedDate()}
${getFormattedTime()}


<b>TOP STORIES</b>

${newsItems}


—
aries76.com/bitcoin-research
#Crypto #News`;
}

// Fetch news from database - excluding already published ones
async function fetchNewsFromDatabase(supabase: ReturnType<typeof createClient>): Promise<Array<{ title: string; source: string; url: string }>> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: publishedLogs } = await supabase
    .from('telegram_publication_logs')
    .select('message_content')
    .eq('publication_type', 'news')
    .eq('status', 'published')
    .gte('published_at', sevenDaysAgo.toISOString());
  
  const publishedTitles = new Set<string>();
  if (publishedLogs) {
    for (const log of publishedLogs) {
      const titleMatches = log.message_content?.match(/\d+\.\s+([^\n]+)/g) || [];
      for (const match of titleMatches) {
        const title = match.replace(/^\d+\.\s+/, '').trim().toLowerCase();
        publishedTitles.add(title);
      }
    }
  }
  
  console.log(`Found ${publishedTitles.size} already published news titles`);
  
  const { data, error } = await supabase
    .from('aggregated_news')
    .select('title, source_name, original_url')
    .or('category.eq.digital_assets,title.ilike.%bitcoin%,title.ilike.%btc%,title.ilike.%crypto%,title.ilike.%ethereum%,title.ilike.%eth%')
    .order('published_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching news from database:', error);
    return [];
  }

  const freshNews = (data || [])
    .filter(item => !publishedTitles.has(item.title.trim().toLowerCase()))
    .slice(0, 5)
    .map(item => ({
      title: item.title,
      source: item.source_name,
      url: item.original_url
    }));
  
  console.log(`Returning ${freshNews.length} fresh news items`);
  return freshNews;
}

async function publishToTelegram(message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return { success: false, error: 'Telegram bot token not configured' };
  }

  console.log('Attempting to publish to Telegram channel:', CHANNEL_ID);

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: CHANNEL_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true, // Disable all link previews
    };
    
    console.log('Request URL:', url.replace(TELEGRAM_BOT_TOKEN, 'BOT_TOKEN_HIDDEN'));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log('Telegram API response:', JSON.stringify(result));
    
    if (result.ok) {
      console.log('Message published successfully, ID:', result.result.message_id);
      return { success: true, messageId: String(result.result.message_id) };
    } else {
      console.error('Telegram API error:', result.description, 'Error code:', result.error_code);
      return { success: false, error: `${result.description} (code: ${result.error_code})` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: PublishRequest = await req.json();
    const { action, type = 'bitcoin', data } = body;

    if (action === 'publish') {
      const livePrices = await fetchLiveCryptoPrices();
      console.log('Live prices fetched:', JSON.stringify(livePrices));
      
      let dbReportData = null;
      if (type === 'bitcoin') {
        const { data: reportData } = await supabase
          .from('bitcoin_report_latest')
          .select('current_regime, regime_confidence, price_target_low, price_target_high, institutional_target, m2_value, real_rate')
          .single();
        dbReportData = reportData;
        console.log('DB report data:', JSON.stringify(dbReportData));
      }

      let message = '';
      switch (type) {
        case 'bitcoin':
          message = generateBitcoinAnalysis(livePrices.bitcoin, dbReportData ? {
            regime: dbReportData.current_regime,
            regimeConfidence: dbReportData.regime_confidence,
            targetLow: dbReportData.price_target_low,
            targetHigh: dbReportData.price_target_high,
            institutionalTarget: dbReportData.institutional_target,
            m2Value: dbReportData.m2_value,
            realRate: dbReportData.real_rate,
          } : undefined);
          break;
        case 'ethereum':
          message = generateEthereumAnalysis(livePrices.ethereum);
          break;
        case 'news':
          const providedNews = data?.news || [];
          const newsToPublish = providedNews.length > 0 ? providedNews : await fetchNewsFromDatabase(supabase);
          message = generateNewsDigest(newsToPublish);
          break;
        default:
          message = generateBitcoinAnalysis(livePrices.bitcoin);
      }

      const result = await publishToTelegram(message);

      await supabase.from('telegram_publication_logs').insert({
        publication_type: type,
        message_content: message,
        telegram_message_id: result.messageId,
        status: result.success ? 'published' : 'failed',
        error_message: result.error,
        published_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500,
      });
    }

    if (action === 'schedule') {
      const scheduleTime = body.scheduleTime;
      if (!scheduleTime) {
        return new Response(JSON.stringify({ error: 'scheduleTime is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      await supabase.from('telegram_scheduled_posts').insert({
        publication_type: type,
        scheduled_for: scheduleTime,
        status: 'scheduled',
        created_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ success: true, message: `Scheduled ${type} post for ${scheduleTime}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check-scheduled') {
      const now = new Date().toISOString();
      
      const { data: scheduledPosts, error } = await supabase
        .from('telegram_scheduled_posts')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_for', now);

      if (error) {
        console.error('Error fetching scheduled posts:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      const results = [];
      for (const post of scheduledPosts || []) {
        const livePrices = await fetchLiveCryptoPrices();
        
        let dbReportData = null;
        if (post.publication_type === 'bitcoin') {
          const { data: reportData } = await supabase
            .from('bitcoin_report_latest')
            .select('current_regime, regime_confidence, price_target_low, price_target_high, institutional_target, m2_value, real_rate')
            .single();
          dbReportData = reportData;
        }

        let message = '';
        switch (post.publication_type) {
          case 'bitcoin':
            message = generateBitcoinAnalysis(livePrices.bitcoin, dbReportData ? {
              regime: dbReportData.current_regime,
              regimeConfidence: dbReportData.regime_confidence,
              targetLow: dbReportData.price_target_low,
              targetHigh: dbReportData.price_target_high,
              institutionalTarget: dbReportData.institutional_target,
              m2Value: dbReportData.m2_value,
              realRate: dbReportData.real_rate,
            } : undefined);
            break;
          case 'ethereum':
            message = generateEthereumAnalysis(livePrices.ethereum);
            break;
          case 'news':
            const newsItems = await fetchNewsFromDatabase(supabase);
            message = generateNewsDigest(newsItems);
            break;
        }

        const publishResult = await publishToTelegram(message);

        await supabase
          .from('telegram_scheduled_posts')
          .update({ 
            status: publishResult.success ? 'published' : 'failed',
            published_at: new Date().toISOString(),
          })
          .eq('id', post.id);

        await supabase.from('telegram_publication_logs').insert({
          publication_type: post.publication_type,
          message_content: message,
          telegram_message_id: publishResult.messageId,
          status: publishResult.success ? 'published' : 'failed',
          error_message: publishResult.error,
          published_at: new Date().toISOString(),
        });

        results.push({
          postId: post.id,
          type: post.publication_type,
          success: publishResult.success,
        });
      }

      return new Response(JSON.stringify({ processed: results.length, results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
