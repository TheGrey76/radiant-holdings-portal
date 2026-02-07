import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const CHANNEL_ID = '@aries76_bitcoin';

// ── Asset Configuration ──────────────────────────────────────────
const TOP_ASSETS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'matic-network', symbol: 'POL', name: 'Polygon' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
];

// ── Helpers ──────────────────────────────────────────────────────
function fmt(n: number, prefix = '$'): string {
  if (n >= 1_000_000_000_000) return `${prefix}${(n / 1e12).toFixed(2)}T`;
  if (n >= 1_000_000_000) return `${prefix}${(n / 1e9).toFixed(1)}B`;
  if (n >= 1_000_000) return `${prefix}${(n / 1e6).toFixed(1)}M`;
  return `${prefix}${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function fmtPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

function trend(change: number): string {
  if (change >= 5) return '🟢🟢';
  if (change >= 2) return '🟢';
  if (change <= -5) return '🔴🔴';
  if (change <= -2) return '🔴';
  return '🟡';
}

function sign(n: number): string {
  return n >= 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;
}

function getDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function getTime(): string {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome'
  }) + ' CET';
}

// ── CoinGecko Fetch ──────────────────────────────────────────────
interface AssetData {
  id: string;
  symbol: string;
  name: string;
  usd: number;
  eur: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
}

async function fetchAllAssets(): Promise<AssetData[]> {
  const ids = TOP_ASSETS.map(a => a.id).join(',');

  // Try CoinGecko
  try {
    console.log('Fetching multi-asset data from CoinGecko...');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();

    return TOP_ASSETS.map(asset => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      usd: data[asset.id]?.usd || 0,
      eur: data[asset.id]?.eur || 0,
      change24h: data[asset.id]?.usd_24h_change || 0,
      change7d: data[asset.id]?.usd_7d_change || 0,
      marketCap: data[asset.id]?.usd_market_cap || 0,
      volume24h: data[asset.id]?.usd_24h_vol || 0,
    }));
  } catch (err) {
    console.error('CoinGecko multi-asset failed:', err);
  }

  // Fallback: CoinCap
  try {
    console.log('Trying CoinCap fallback...');
    const results: AssetData[] = [];
    for (const asset of TOP_ASSETS) {
      const res = await fetch(`https://api.coincap.io/v2/assets/${asset.id}`);
      const json = await res.json();
      const d = json.data;
      if (d) {
        const priceUsd = parseFloat(d.priceUsd) || 0;
        results.push({
          id: asset.id, symbol: asset.symbol, name: asset.name,
          usd: priceUsd, eur: priceUsd * 0.92,
          change24h: parseFloat(d.changePercent24Hr) || 0,
          change7d: 0,
          marketCap: parseFloat(d.marketCapUsd) || 0,
          volume24h: parseFloat(d.volumeUsd24Hr) || 0,
        });
      }
    }
    return results;
  } catch (err) {
    console.error('CoinCap fallback also failed:', err);
    return [];
  }
}

// ── Post Generators ──────────────────────────────────────────────

function generateMorningBriefing(assets: AssetData[], dbData?: any): string {
  const btc = assets.find(a => a.symbol === 'BTC');
  const eth = assets.find(a => a.symbol === 'ETH');
  if (!btc) return 'No BTC data available.';

  const regime = dbData?.current_regime || 'ACCUMULATION';
  const confidenceRaw = dbData?.regime_confidence || 0.6;
  const confidence = confidenceRaw < 1 ? Math.round(confidenceRaw * 100) : Math.round(confidenceRaw);
  const m2 = dbData?.m2_value ? (dbData.m2_value / 1000).toFixed(1) : '22.3';
  const realRate = dbData?.real_rate ?? 1.45;

  const totalMcap = assets.reduce((s, a) => s + a.marketCap, 0);
  const totalVol = assets.reduce((s, a) => s + a.volume24h, 0);
  const gainers = assets.filter(a => a.change24h > 0).length;

  return `<b>☀️ ARIES76 — Morning Briefing</b>
${getDate()} · ${getTime()}

<b>Bitcoin</b> ${fmtPrice(btc.usd)} ${trend(btc.change24h)} ${sign(btc.change24h)}
<b>Ethereum</b> ${fmtPrice(eth?.usd || 0)} ${trend(eth?.change24h || 0)} ${sign(eth?.change24h || 0)}

Market cap (top 10): ${fmt(totalMcap)}
24h volume: ${fmt(totalVol)}
Gainers/Losers: ${gainers}/${assets.length - gainers}

<b>Macro context:</b>
• Regime: <b>${regime}</b> (${confidence}% confidence)
• Global M2: $${m2}T
• US Real Rate: ${realRate >= 0 ? '+' : ''}${realRate.toFixed(2)}%

<i>Institutional positioning remains ${regime === 'EXPANSION' ? 'aggressive' : regime === 'CONTRACTION' ? 'defensive' : 'measured'}.</i>

—
#Bitcoin #Crypto #Morning #Markets`;
}

function generateWatchlist(assets: AssetData[]): string {
  const lines = assets.map((a, i) => {
    const rank = i + 1;
    return `${rank}. <b>${a.symbol}</b> ${fmtPrice(a.usd)} ${trend(a.change24h)} ${sign(a.change24h)} · 7d: ${sign(a.change7d)}`;
  });

  const totalMcap = assets.reduce((s, a) => s + a.marketCap, 0);
  const btcDom = assets[0] ? ((assets[0].marketCap / totalMcap) * 100).toFixed(1) : '0';

  return `<b>📊 ARIES76 — Digital Assets Watchlist</b>
${getDate()} · ${getTime()}

${lines.join('\n')}

BTC dominance (top 10): ${btcDom}%
Total market cap: ${fmt(totalMcap)}

—
#Crypto #Watchlist #DigitalAssets`;
}

function generateMiddayPulse(assets: AssetData[]): string {
  const sorted = [...assets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
  const topMovers = sorted.slice(0, 5);
  const alerts = assets.filter(a => Math.abs(a.change24h) >= 5);

  const moverLines = topMovers.map(a =>
    `${trend(a.change24h)} <b>${a.symbol}</b> ${fmtPrice(a.usd)} (${sign(a.change24h)})`
  );

  let alertSection = '';
  if (alerts.length > 0) {
    const alertLines = alerts.map(a =>
      `⚡ <b>${a.symbol}</b> ${a.change24h >= 5 ? 'surging' : 'dropping'} ${sign(a.change24h)}`
    );
    alertSection = `\n<b>🚨 Price Alerts (±5%):</b>\n${alertLines.join('\n')}\n`;
  }

  return `<b>⚡ ARIES76 — Midday Pulse</b>
${getDate()} · ${getTime()}

<b>Top movers:</b>
${moverLines.join('\n')}
${alertSection}
<i>Volatility is ${alerts.length >= 3 ? 'elevated' : alerts.length >= 1 ? 'moderate' : 'contained'} across digital assets.</i>

—
#Crypto #Movers #Markets`;
}

function generateNewsDigest(news: Array<{ title: string; source: string; url?: string }>): string {
  if (news.length === 0) {
    return `<b>📰 ARIES76 — News Digest</b>
${getDate()} · ${getTime()}

Quiet session. No major headlines in the past few hours. Monitoring continues.

—
#Crypto #News`;
  }

  const items = news.slice(0, 5).map((item, i) => {
    const title = item.url ? `<a href="${item.url}">${item.title}</a>` : item.title;
    return `<b>${i + 1}.</b> ${title}\n<i>— ${item.source}</i>`;
  }).join('\n\n');

  return `<b>📰 ARIES76 — News Digest</b>
${getDate()} · ${getTime()}

${items}

—
#Crypto #News #Markets`;
}

function generateAfternoonAnalysis(assets: AssetData[], dbData?: any): string {
  const btc = assets.find(a => a.symbol === 'BTC');
  if (!btc) return 'No BTC data available.';

  const regime = dbData?.current_regime || 'ACCUMULATION';
  const confidenceRaw = dbData?.regime_confidence || 0.6;
  const confidence = confidenceRaw < 1 ? Math.round(confidenceRaw * 100) : Math.round(confidenceRaw);
  const targetLow = dbData?.price_target_low || 96000;
  const targetHigh = dbData?.price_target_high || 132000;
  const instTarget = dbData?.institutional_target || 138000;
  const m2 = dbData?.m2_value ? (dbData.m2_value / 1000).toFixed(1) : '22.3';
  const realRate = dbData?.real_rate ?? 1.45;

  let outlook = 'neutral';
  if (regime === 'EXPANSION') outlook = 'constructive';
  else if (regime === 'CONTRACTION') outlook = 'cautious';
  else if (regime === 'ACCUMULATION') outlook = 'moderately constructive';

  return `<b>📈 ARIES76 — Bitcoin Analysis</b>
${getDate()} · ${getTime()}

Bitcoin is trading at <b>${fmtPrice(btc.usd)}</b> (€${btc.eur.toLocaleString('en-US', { maximumFractionDigits: 0 })}), ${btc.change24h >= 0 ? 'up' : 'down'} ${Math.abs(btc.change24h).toFixed(1)}% in 24h. Market cap: ${fmt(btc.marketCap)}.

<b>Macro backdrop:</b>
• Global M2: $${m2}T
• US Real Rate: ${realRate >= 0 ? '+' : ''}${realRate.toFixed(2)}%
• Regime: <b>${regime}</b> (${confidence}%)

<b>12-month targets:</b>
• Conservative: ${fmtPrice(targetLow)}
• Base case: ${fmtPrice(targetHigh)}
• Institutional: ${fmtPrice(instTarget)}

Outlook: <i>${outlook}</i>

—
#Bitcoin #BTC #Analysis`;
}

function generateInstitutionalWatch(assets: AssetData[]): string {
  const btc = assets.find(a => a.symbol === 'BTC');
  const eth = assets.find(a => a.symbol === 'ETH');

  // Simulated institutional signals based on volume/price action
  const btcVolStrength = btc && btc.volume24h > 30_000_000_000 ? 'high' : btc && btc.volume24h > 15_000_000_000 ? 'moderate' : 'low';
  const ethVolStrength = eth && eth.volume24h > 15_000_000_000 ? 'high' : eth && eth.volume24h > 8_000_000_000 ? 'moderate' : 'low';

  const btcSignal = btc && btc.change24h > 3 ? '📥 Accumulation signals detected' :
    btc && btc.change24h < -3 ? '📤 Distribution signals detected' : '➡️ Neutral flow';
  const ethSignal = eth && eth.change24h > 3 ? '📥 Accumulation signals' :
    eth && eth.change24h < -3 ? '📤 Distribution signals' : '➡️ Neutral flow';

  return `<b>🏦 ARIES76 — Institutional Watch</b>
${getDate()} · ${getTime()}

<b>Bitcoin:</b>
• 24h volume: ${fmt(btc?.volume24h || 0)} (${btcVolStrength})
• ${btcSignal}

<b>Ethereum:</b>
• 24h volume: ${fmt(eth?.volume24h || 0)} (${ethVolStrength})
• ${ethSignal}

<b>Market structure:</b>
• BTC market cap: ${fmt(btc?.marketCap || 0)}
• ETH market cap: ${fmt(eth?.marketCap || 0)}
• BTC/ETH ratio: ${btc && eth && eth.usd > 0 ? (btc.usd / eth.usd).toFixed(1) : 'N/A'}

<i>Institutional activity is ${btcVolStrength === 'high' ? 'elevated' : 'measured'} this session.</i>

—
#Institutional #ETF #Whale #OnChain`;
}

function generateDailyWrap(assets: AssetData[]): string {
  const gainers = assets.filter(a => a.change24h > 0).sort((a, b) => b.change24h - a.change24h);
  const losers = assets.filter(a => a.change24h < 0).sort((a, b) => a.change24h - b.change24h);

  const bestPerf = gainers[0];
  const worstPerf = losers[0];

  const totalMcap = assets.reduce((s, a) => s + a.marketCap, 0);
  const totalVol = assets.reduce((s, a) => s + a.volume24h, 0);
  const avgChange = assets.reduce((s, a) => s + a.change24h, 0) / assets.length;

  const summary = assets.map(a =>
    `${trend(a.change24h)} <b>${a.symbol}</b> ${fmtPrice(a.usd)} (${sign(a.change24h)})`
  );

  return `<b>🌙 ARIES76 — Daily Wrap-up</b>
${getDate()} · ${getTime()}

${summary.join('\n')}

<b>Session summary:</b>
• Best performer: ${bestPerf ? `${bestPerf.symbol} ${sign(bestPerf.change24h)}` : 'N/A'}
• Worst performer: ${worstPerf ? `${worstPerf.symbol} ${sign(worstPerf.change24h)}` : 'N/A'}
• Avg. change: ${sign(avgChange)}
• Total volume: ${fmt(totalVol)}
• Total market cap: ${fmt(totalMcap)}

<i>Session was ${avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'mixed'}. See you tomorrow.</i>

—
#Crypto #DailyWrap #Markets`;
}

// ── Telegram Publish ─────────────────────────────────────────────
async function publishToTelegram(message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    return { success: false, error: 'TELEGRAM_BOT_TOKEN not set' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (result.ok) {
      return { success: true, messageId: String(result.result.message_id) };
    }
    return { success: false, error: `${result.description} (code: ${result.error_code})` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── News from DB ─────────────────────────────────────────────────
async function fetchNewsFromDB(supabase: ReturnType<typeof createClient>): Promise<Array<{ title: string; source: string; url: string }>> {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Check already published news titles
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: publishedLogs } = await supabase
    .from('telegram_publication_logs')
    .select('message_content')
    .eq('publication_type', 'news_digest')
    .eq('status', 'published')
    .gte('published_at', sevenDaysAgo.toISOString());

  const publishedTitles = new Set<string>();
  if (publishedLogs) {
    for (const log of publishedLogs) {
      const matches = log.message_content?.match(/\d+\.\s+([^\n]+)/g) || [];
      for (const m of matches) {
        publishedTitles.add(m.replace(/^\d+\.\s+/, '').trim().toLowerCase());
      }
    }
  }

  const { data } = await supabase
    .from('aggregated_news')
    .select('title, source_name, original_url')
    .or('category.eq.digital_assets,title.ilike.%bitcoin%,title.ilike.%btc%,title.ilike.%crypto%,title.ilike.%ethereum%')
    .gte('published_at', twoDaysAgo.toISOString())
    .order('published_at', { ascending: false })
    .limit(30);

  return (data || [])
    .filter(item => !publishedTitles.has(item.title.trim().toLowerCase()))
    .slice(0, 5)
    .map(item => ({ title: item.title, source: item.source_name, url: item.original_url }));
}

// ── Main Handler ─────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const postType: string = body.post_type || 'watchlist';

    console.log(`[telegram-multi-asset] Processing post_type: ${postType}`);

    // Fetch live asset data
    const assets = await fetchAllAssets();
    console.log(`[telegram-multi-asset] Fetched ${assets.length} assets`);

    // Fetch BTC report data for posts that need macro context
    let dbReportData: any = null;
    if (['morning_briefing', 'afternoon_analysis'].includes(postType)) {
      const { data } = await supabase
        .from('bitcoin_report_latest')
        .select('current_regime, regime_confidence, price_target_low, price_target_high, institutional_target, m2_value, real_rate')
        .single();
      dbReportData = data;
      console.log(`[telegram-multi-asset] DB report data:`, JSON.stringify(dbReportData));
    }

    // Generate message based on post type
    let message = '';
    switch (postType) {
      case 'morning_briefing':
        message = generateMorningBriefing(assets, dbReportData);
        break;
      case 'watchlist':
        message = generateWatchlist(assets);
        break;
      case 'midday_pulse':
        message = generateMiddayPulse(assets);
        break;
      case 'news_digest':
        const news = await fetchNewsFromDB(supabase);
        message = generateNewsDigest(news);
        break;
      case 'afternoon_analysis':
        message = generateAfternoonAnalysis(assets, dbReportData);
        break;
      case 'institutional_watch':
        message = generateInstitutionalWatch(assets);
        break;
      case 'daily_wrap':
        message = generateDailyWrap(assets);
        break;
      default:
        message = generateWatchlist(assets);
    }

    // Publish
    const result = await publishToTelegram(message);
    console.log(`[telegram-multi-asset] Publish result:`, JSON.stringify(result));

    // Log to DB
    await supabase.from('telegram_publication_logs').insert({
      publication_type: postType,
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

  } catch (error) {
    console.error('[telegram-multi-asset] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
