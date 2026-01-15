import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Aries76 branding image URL
const ARIES76_IMAGE_URL = 'https://aries76.lovable.app/aries76-x-card.png';

interface ContentItem {
  type: 'bitcoin' | 'ai' | 'tech';
  content: string;
  hashtags: string[];
}

// Bitcoin-focused content templates
const bitcoinTemplates = [
  "📊 Bitcoin Market Update: BTC continues to demonstrate resilience in the current macro environment. Key levels to watch for institutional positioning.",
  "⚡ #Bitcoin adoption accelerates as more corporations add BTC to their treasury reserves. The digital gold narrative strengthens.",
  "🔗 On-chain data shows strong accumulation patterns among long-term holders. Smart money positioning for the next leg up.",
  "💡 Bitcoin's monetary policy remains unchanged: 21 million cap, halving every 4 years. In a world of infinite money printing, scarcity matters.",
  "📈 Institutional BTC ETF flows continue positive trend. Wall Street's embrace of Bitcoin marks a new era for the asset class.",
  "🌐 Bitcoin hashrate reaches new ATH, securing the network with unprecedented computational power. Security = Value.",
  "🏦 Central banks worldwide exploring CBDCs while Bitcoin offers a decentralized alternative. The monetary revolution unfolds.",
];

// AI-focused content templates  
const aiTemplates = [
  "🤖 AI is transforming financial analysis. Machine learning models now process market data at unprecedented scale and speed.",
  "🧠 The intersection of AI and blockchain creates new possibilities for automated trading, risk management, and portfolio optimization.",
  "💻 Large Language Models are revolutionizing how we consume and analyze financial information. The future of research is AI-augmented.",
  "🔮 Predictive analytics powered by AI helps institutional investors identify patterns invisible to human analysis.",
  "⚙️ AI-driven automation is reshaping capital markets. From execution to compliance, intelligent systems lead the transformation.",
  "📱 Conversational AI is democratizing access to sophisticated financial analysis. Everyone gets a personal analyst.",
  "🎯 Machine learning models for regime detection help investors navigate changing market conditions with data-driven precision.",
];

// Tech-focused content templates
const techTemplates = [
  "🚀 Digital infrastructure investment accelerates as enterprises embrace cloud-native architectures and edge computing.",
  "🔐 Cybersecurity becomes mission-critical as digital transformation expands attack surfaces. Security-first mindset essential.",
  "📡 5G and IoT convergence unlocks new use cases across industries. Connected devices reshape how we live and work.",
  "💾 Data is the new oil, but AI is the refinery. Companies that master both gain competitive advantage.",
  "🌍 Tech enables global access to financial services. Fintech bridges gaps that traditional banking left open.",
  "⚡ Quantum computing advances promise to revolutionize cryptography, optimization, and scientific simulation.",
  "🔄 DevOps and continuous delivery accelerate innovation cycles. Ship fast, iterate faster, scale globally.",
];

const hashtags = {
  bitcoin: ["#Bitcoin", "#BTC", "#Crypto", "#DigitalGold", "#HODL", "#Blockchain"],
  ai: ["#AI", "#MachineLearning", "#ArtificialIntelligence", "#DeepLearning", "#DataScience", "#Tech"],
  tech: ["#Tech", "#Innovation", "#DigitalTransformation", "#Fintech", "#Startup", "#Future"],
};

function getRandomContent(): ContentItem {
  const types: ('bitcoin' | 'ai' | 'tech')[] = ['bitcoin', 'ai', 'tech'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let templates: string[];
  switch (type) {
    case 'bitcoin':
      templates = bitcoinTemplates;
      break;
    case 'ai':
      templates = aiTemplates;
      break;
    case 'tech':
      templates = techTemplates;
      break;
  }
  
  const content = templates[Math.floor(Math.random() * templates.length)];
  const selectedHashtags = hashtags[type].slice(0, 3 + Math.floor(Math.random() * 2));
  
  return { type, content, hashtags: selectedHashtags };
}

// OAuth 1.0a signature generation for X API
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');
  
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  const hmac = createHmac('sha1', signingKey);
  hmac.update(signatureBaseString);
  return hmac.digest('base64');
}

function generateOAuthHeader(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessTokenSecret: string,
  additionalParams: Record<string, string> = {}
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID().replace(/-/g, '');
  
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: '1.0',
    ...additionalParams
  };
  
  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    apiSecret,
    accessTokenSecret
  );
  
  oauthParams.oauth_signature = signature;
  
  const headerParts = Object.keys(oauthParams)
    .filter(key => key.startsWith('oauth_'))
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  return `OAuth ${headerParts}`;
}

// Upload media to X using v1.1 API
async function uploadMediaToX(
  imageUrl: string,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return { success: false, error: `Failed to fetch image: ${imageResponse.status}` };
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
    
    const authHeader = generateOAuthHeader(
      'POST',
      uploadUrl,
      apiKey,
      apiSecret,
      accessToken,
      accessTokenSecret
    );
    
    const formData = new FormData();
    formData.append('media_data', base64Image);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Media upload error:', data);
      return { success: false, error: data.errors?.[0]?.message || 'Failed to upload media' };
    }
    
    console.log('Media uploaded successfully, media_id:', data.media_id_string);
    return { success: true, mediaId: data.media_id_string };
  } catch (error) {
    console.error('Error uploading media:', error);
    return { success: false, error: error.message };
  }
}

async function postToX(text: string, mediaId?: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  const apiKey = Deno.env.get('X_API_KEY');
  const apiSecret = Deno.env.get('X_API_SECRET');
  const accessToken = Deno.env.get('X_ACCESS_TOKEN');
  const accessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET');
  
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    return { success: false, error: 'Missing X API credentials' };
  }
  
  const url = 'https://api.twitter.com/2/tweets';
  
  const authHeader = generateOAuthHeader(
    'POST',
    url,
    apiKey,
    apiSecret,
    accessToken,
    accessTokenSecret
  );
  
  try {
    const tweetBody: { text: string; media?: { media_ids: string[] } } = { text };
    
    // Attach media if provided
    if (mediaId) {
      tweetBody.media = { media_ids: [mediaId] };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweetBody),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('X API error:', data);
      return { success: false, error: data.detail || data.title || 'Failed to post' };
    }
    
    return { success: true, tweetId: data.data?.id };
  } catch (error) {
    console.error('Error posting to X:', error);
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
    
    const apiKey = Deno.env.get('X_API_KEY')!;
    const apiSecret = Deno.env.get('X_API_SECRET')!;
    const accessToken = Deno.env.get('X_ACCESS_TOKEN')!;
    const accessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET')!;
    
    let action = 'auto-post';
    let customContent: string | null = null;
    
    if (req.method === 'POST') {
      const body = await req.json();
      action = body.action || 'auto-post';
      customContent = body.content || null;
    }
    
    let tweetText: string;
    let contentType: string;
    
    if (action === 'custom' && customContent) {
      tweetText = customContent;
      contentType = 'custom';
    } else {
      // Generate random content from templates
      const contentItem = getRandomContent();
      tweetText = `${contentItem.content}\n\n${contentItem.hashtags.join(' ')}\n\n🔗 aries76.com`;
      contentType = contentItem.type;
    }
    
    console.log(`Posting ${contentType} content to X:`, tweetText.substring(0, 50) + '...');
    
    // Upload the Aries76 branding image
    console.log('Uploading Aries76 branding image...');
    const mediaUpload = await uploadMediaToX(
      ARIES76_IMAGE_URL,
      apiKey,
      apiSecret,
      accessToken,
      accessTokenSecret
    );
    
    let mediaId: string | undefined;
    if (mediaUpload.success && mediaUpload.mediaId) {
      mediaId = mediaUpload.mediaId;
      console.log('Image uploaded, media_id:', mediaId);
    } else {
      console.warn('Failed to upload image, posting without media:', mediaUpload.error);
    }
    
    const result = await postToX(tweetText, mediaId);
    
    // Log the post to database
    const { error: logError } = await supabase
      .from('x_post_log')
      .insert({
        content: tweetText,
        content_type: contentType,
        status: result.success ? 'published' : 'failed',
        tweet_id: result.tweetId,
        error_message: result.error,
      });
    
    if (logError) {
      console.error('Error logging post:', logError);
    }
    
    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Posted to X successfully',
          tweetId: result.tweetId,
          content: tweetText.substring(0, 100) + '...',
          hasImage: !!mediaId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in x-auto-post:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
