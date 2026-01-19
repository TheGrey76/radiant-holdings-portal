import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const CHANNEL_ID = '@aries76_bitcoin';
// Banner URL - using the bitcoin OG image (works with Telegram)
const BANNER_URL = 'https://www.aries76.com/bitcoin-2026-og.png';

// Fetch live prices from CoinGecko (reliable, no rate limits for basic use)
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
    // Return fallback values
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

// Format market cap in billions
function formatMarketCap(marketCap: number): string {
  const billions = marketCap / 1_000_000_000;
  return `$${billions.toFixed(0)}B`;
}

// Format percentage
function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
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
  // Use live CoinGecko data for price
  const price = liveData?.usd ? formatPrice(liveData.usd) : '$94,000';
  const priceEur = liveData?.eur ? formatPrice(liveData.eur, '€') : '€86,500';
  const change24h = liveData?.change24h ? formatChange(liveData.change24h) : '-0.74%';
  
  // Use database data for regime/targets or defaults
  const regime = dbData?.regime || 'ACCUMULATION';
  const regimeConfidence = dbData?.regimeConfidence ? `${dbData.regimeConfidence}%` : '60%';
  const targetLow = dbData?.targetLow ? formatPrice(dbData.targetLow) : '$96,000';
  const targetHigh = dbData?.targetHigh ? formatPrice(dbData.targetHigh) : '$132,000';
  const institutionalTarget = dbData?.institutionalTarget ? formatPrice(dbData.institutionalTarget) : '$138,000';
  const m2Value = dbData?.m2Value ? `$${(dbData.m2Value / 1_000_000_000_000).toFixed(1)}T` : '$22.3T';
  const realRate = dbData?.realRate ? formatChange(dbData.realRate) : '+1.45%';

  // Determine signal based on regime
  let signal = 'HOLD 🟡';
  if (regime === 'ACCUMULATION' || regime === 'EXPANSION') {
    signal = 'BUY 🟢';
  } else if (regime === 'CONTRACTION') {
    signal = 'SELL 🔴';
  }

  // Regime emoji
  let regimeEmoji = '🟡';
  if (regime === 'EXPANSION') regimeEmoji = '🟢';
  else if (regime === 'ACCUMULATION') regimeEmoji = '🔵';
  else if (regime === 'CONTRACTION') regimeEmoji = '🔴';

  return `<b>📊 BITCOIN Q1 2026 ANALYSIS</b>
<i>powered by ARIES76 Macro Model</i>

<b>💰 Price:</b> ${price} | ${priceEur}
<b>📉 24h:</b> ${change24h}

<b>🎯 Current Regime:</b> ${regime} ${regimeEmoji}
<b>📈 Confidence:</b> ${regimeConfidence}

<b>🔮 Price Targets (12M):</b>
├ Conservative: ${targetLow}
├ Base Case: ${targetHigh}
└ Institutional: ${institutionalTarget}

<b>📊 Macro Indicators:</b>
├ Global M2: ${m2Value}
└ Real Rate: ${realRate}

<b>⚡ Signal:</b> ${signal}

📖 <a href="https://www.aries76.com/bitcoin-2026-report-preview">Full Report →</a>

#Bitcoin #BTC #Crypto #MacroAnalysis #ARIES76`;
}

function generateEthereumAnalysis(liveData?: {
  usd: number;
  eur: number;
  change24h: number;
  marketCap: number;
}) {
  // Use live data or defaults
  const price = liveData?.usd ? formatPrice(liveData.usd) : '$3,100';
  const priceEur = liveData?.eur ? formatPrice(liveData.eur, '€') : '€2,850';
  const change24h = liveData?.change24h ? formatChange(liveData.change24h) : '+0.30%';
  const marketCap = liveData?.marketCap ? formatMarketCap(liveData.marketCap) : '$370B';
  
  // Determine sentiment and signal based on 24h change
  let sentiment = 'NEUTRAL 🟡';
  let signal = 'HOLD 🟡';
  if (liveData?.change24h) {
    if (liveData.change24h > 3) {
      sentiment = 'BULLISH 🟢';
      signal = 'BUY 🟢';
    } else if (liveData.change24h < -3) {
      sentiment = 'BEARISH 🔴';
      signal = 'SELL 🔴';
    }
  }
  
  // Calculate dynamic support/resistance (approximate)
  const priceNum = liveData?.usd || 3100;
  const resistance = formatPrice(Math.round(priceNum * 1.02));
  const support = formatPrice(Math.round(priceNum * 0.98));

  return `<b>📊 ETHEREUM ANALYSIS</b>
<i>powered by ARIES76</i>

<b>💰 Price:</b> ${price} | ${priceEur}
<b>📉 24h:</b> ${change24h}
<b>📊 Market Cap:</b> ${marketCap}
<b>🎯 Sentiment:</b> ${sentiment}

<b>Technical Levels:</b>
🔴 Resistance: ${resistance}
🟢 Support: ${support}

<b>⚡ Signal:</b> ${signal}

📖 <a href="https://www.aries76.com/bitcoin-2026-report-preview">Full Report →</a>

#Ethereum #ETH #Crypto #Analysis #ARIES76`;
}

function generateNewsDigest(news: Array<{ title: string; source: string; url?: string }>) {
  if (news.length === 0) {
    return `<b>📰 DIGITAL ASSETS NEWS</b>
<i>powered by ARIES76</i>

No news available at the moment.

📖 <a href="https://www.aries76.com/bitcoin-2026-report-preview">Full Report →</a>

#Crypto #News #DigitalAssets #ARIES76`;
  }

  const newsItems = news.slice(0, 5).map((item, i) => {
    const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i] || '▪️';
    if (item.url) {
      return `${emoji} <a href="${item.url}">${item.title}</a>\n<i>${item.source}</i>`;
    }
    return `${emoji} ${item.title}\n<i>${item.source}</i>`;
  }).join('\n\n');

  return `<b>📰 DIGITAL ASSETS NEWS</b>
<i>powered by ARIES76</i>

${newsItems}

━━━━━━━━━━━━━━━━━━━━

📖 <a href="https://www.aries76.com/bitcoin-2026-report-preview">Bitcoin 2026 Report →</a>

#Crypto #News #DigitalAssets #ARIES76`;
}

// Fetch news from database with actual article URLs - excluding already published ones
async function fetchNewsFromDatabase(supabase: ReturnType<typeof createClient>): Promise<Array<{ title: string; source: string; url: string }>> {
  // First, get IDs of news already published to Telegram in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: publishedLogs } = await supabase
    .from('telegram_publication_logs')
    .select('message_content')
    .eq('publication_type', 'news')
    .eq('status', 'published')
    .gte('published_at', sevenDaysAgo.toISOString());
  
  // Extract titles from already published messages
  const publishedTitles = new Set<string>();
  if (publishedLogs) {
    for (const log of publishedLogs) {
      // Extract titles from the message content (they appear after emoji numbers)
      const titleMatches = log.message_content?.match(/(?:1️⃣|2️⃣|3️⃣|4️⃣|5️⃣)\s*<a[^>]*>([^<]+)<\/a>/g) || [];
      for (const match of titleMatches) {
        const titleMatch = match.match(/>([^<]+)<\/a>/);
        if (titleMatch) {
          publishedTitles.add(titleMatch[1].trim().toLowerCase());
        }
      }
    }
  }
  
  console.log(`Found ${publishedTitles.size} already published news titles`);
  
  // Fetch more news than needed to filter out already published ones
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

  // Filter out already published news
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

async function publishToTelegram(message: string, withPhoto: boolean = true): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return { success: false, error: 'Telegram bot token not configured' };
  }

  console.log('Attempting to publish to Telegram channel:', CHANNEL_ID);
  console.log('With photo:', withPhoto);

  try {
    let url: string;
    let body: Record<string, unknown>;

    if (withPhoto) {
      // Send photo with caption
      url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
      body = {
        chat_id: CHANNEL_ID,
        photo: BANNER_URL,
        caption: message,
        parse_mode: 'HTML',
      };
    } else {
      // Send text only
      url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      body = {
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };
    }
    
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
      // Fetch live prices from CoinGecko
      const livePrices = await fetchLiveCryptoPrices();
      console.log('Live prices fetched:', JSON.stringify(livePrices));
      
      // Fetch regime data from database for Bitcoin
      let dbReportData = null;
      if (type === 'bitcoin') {
        const { data: reportData } = await supabase
          .from('bitcoin_report_latest')
          .select('current_regime, regime_confidence, price_target_low, price_target_high, institutional_target, m2_value, real_rate')
          .single();
        dbReportData = reportData;
        console.log('DB report data:', JSON.stringify(dbReportData));
      }

      // Generate message based on type
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
          // Use provided news or fetch from database
          const providedNews = data?.news || [];
          const newsToPublish = providedNews.length > 0 ? providedNews : await fetchNewsFromDatabase(supabase);
          message = generateNewsDigest(newsToPublish);
          break;
        default:
          message = generateBitcoinAnalysis(livePrices.bitcoin);
      }

      // Publish to Telegram
      const result = await publishToTelegram(message);

      // Log the publication
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

    if (action === 'check-scheduled') {
      // Get current time in HH:MM format
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      
      // Get scheduled publications that haven't been published today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: schedules, error } = await supabase
        .from('telegram_scheduled_publications')
        .select('*')
        .eq('is_active', true)
        .lte('scheduled_time', currentTime);

      if (error) {
        throw error;
      }

      // Fetch live prices once for all scheduled publications
      const livePrices = await fetchLiveCryptoPrices();
      console.log('Live prices for scheduled:', JSON.stringify(livePrices));
      
      // Fetch DB report data once
      const { data: dbReportData } = await supabase
        .from('bitcoin_report_latest')
        .select('current_regime, regime_confidence, price_target_low, price_target_high, institutional_target, m2_value, real_rate')
        .single();

      const published = [];
      for (const schedule of schedules || []) {
        // Check if already published today
        const { data: recentLogs } = await supabase
          .from('telegram_publication_logs')
          .select('id')
          .eq('publication_id', schedule.id)
          .gte('published_at', `${today}T00:00:00Z`)
          .limit(1);

        if (recentLogs && recentLogs.length > 0) {
          continue; // Already published today
        }

        // Generate and publish with live data
        let message = '';
        switch (schedule.publication_type) {
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
            const scheduledNews = await fetchNewsFromDatabase(supabase);
            message = generateNewsDigest(scheduledNews);
            break;
          default:
            message = generateBitcoinAnalysis(livePrices.bitcoin);
        }

        const result = await publishToTelegram(message);

        // Log the publication
        await supabase.from('telegram_publication_logs').insert({
          publication_id: schedule.id,
          publication_type: schedule.publication_type,
          message_content: message,
          telegram_message_id: result.messageId,
          status: result.success ? 'published' : 'failed',
          error_message: result.error,
          published_at: new Date().toISOString(),
        });

        if (result.success) {
          // Update last_published_at
          await supabase
            .from('telegram_scheduled_publications')
            .update({ last_published_at: new Date().toISOString() })
            .eq('id', schedule.id);

          published.push({ id: schedule.id, type: schedule.publication_type });
        }
      }

      return new Response(JSON.stringify({ success: true, published }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
