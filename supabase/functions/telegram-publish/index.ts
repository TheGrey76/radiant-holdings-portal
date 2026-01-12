import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const CHANNEL_ID = '@aries76_bitcoin';
// Banner URL - uses the published site
const BANNER_URL = 'https://www.aries76.com/telegram-bitcoin-banner.png';

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
    news?: Array<{ title: string; source: string }>;
  };
  scheduleTime?: string;
}

function generateBitcoinAnalysis(data: PublishRequest['data']) {
  const {
    price = '$90,000',
    change24h = '+0.50%',
    sentiment = 'NEUTRAL 🟡',
    signal = 'BUY 🟢',
    resistance = '$92,000',
    support = '$88,000',
  } = data || {};

  return `<b>📊 BITCOIN ANALYSIS</b>

<b>Price:</b> ${price}
<b>24h Change:</b> ${change24h}
<b>Market Cap:</b> $1.8T
<b>Sentiment:</b> ${sentiment}

<b>Technical Levels:</b>
🔴 Resistance: ${resistance}
🟢 Support: ${support}

<b>Signal:</b> ${signal}

🔗 Full Report:
https://www.aries76.com/bitcoin-2026-report

#Bitcoin #Trading #Analysis #ARIES76`;
}

function generateEthereumAnalysis(data: PublishRequest['data']) {
  const {
    price = '$3,100',
    change24h = '+0.30%',
    sentiment = 'NEUTRAL 🟡',
    signal = 'HOLD 🟡',
    resistance = '$3,150',
    support = '$3,050',
  } = data || {};

  return `<b>📊 ETHEREUM ANALYSIS</b>

<b>Price:</b> ${price}
<b>24h Change:</b> ${change24h}
<b>Market Cap:</b> $370B
<b>Sentiment:</b> ${sentiment}

<b>Technical Levels:</b>
🔴 Resistance: ${resistance}
🟢 Support: ${support}

<b>Signal:</b> ${signal}

🔗 Full Report:
https://www.aries76.com/bitcoin-2026-report

#Ethereum #Trading #Analysis #ARIES76`;
}

function generateNewsDigest(data: PublishRequest['data']) {
  const news = data?.news || [
    { title: 'Bitcoin market update', source: 'CoinTelegraph' },
    { title: 'Ethereum network upgrades', source: 'The Block' },
    { title: 'DeFi protocols update', source: 'Cointelegraph' },
  ];

  const newsItems = news.slice(0, 3).map((item, i) => 
    `${i + 1}️⃣ ${item.title}\nSource: ${item.source}`
  ).join('\n\n');

  return `<b>📰 DIGITAL ASSETS NEWS</b>

${newsItems}

🔗 Full Report:
https://www.aries76.com/bitcoin-2026-report

#Crypto #News #Trading #ARIES76`;
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
      // Generate message based on type
      let message = '';
      switch (type) {
        case 'bitcoin':
          message = generateBitcoinAnalysis(data);
          break;
        case 'ethereum':
          message = generateEthereumAnalysis(data);
          break;
        case 'news':
          message = generateNewsDigest(data);
          break;
        default:
          message = generateBitcoinAnalysis(data);
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

        // Generate and publish
        let message = '';
        switch (schedule.publication_type) {
          case 'bitcoin':
            message = generateBitcoinAnalysis({});
            break;
          case 'ethereum':
            message = generateEthereumAnalysis({});
            break;
          case 'news':
            message = generateNewsDigest({});
            break;
          default:
            message = generateBitcoinAnalysis({});
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
