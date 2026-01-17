import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Aries76 branding image URL - Capital Intelligence
const ARIES76_IMAGE_URL = 'https://www.aries76.com/aries76-x-card-new.png';

interface ContentItem {
  type: 'bitcoin' | 'ai' | 'tech';
  content: string;
  hashtags: string[];
}

// Bitcoin-focused content templates - more engaging, detailed content
const bitcoinTemplates = [
  "📊 Bitcoin Market Update\n\nBTC continues to demonstrate resilience in the current macro environment.\n\nKey observations:\n• Institutional accumulation accelerating\n• Hash rate at all-time highs\n• On-chain metrics show strong holder conviction\n\nThe digital gold thesis strengthens daily.",
  "⚡ Bitcoin Adoption Alert\n\nMore corporations are adding BTC to their treasury reserves.\n\nWhy it matters:\n• Inflation hedge for corporate balance sheets\n• Store of value in uncertain times\n• Network effects compound over time\n\nWall Street is finally paying attention.",
  "🔗 On-Chain Intelligence\n\nLong-term holder accumulation patterns signal confidence.\n\nWhat smart money sees:\n• Supply shock potential\n• Declining exchange reserves\n• Whale addresses growing\n\nThe data tells the story before price does.",
  "💡 Bitcoin's Monetary Revolution\n\n21 million cap. Halving every 4 years. No CEO.\n\nIn a world of infinite money printing:\n• Scarcity becomes invaluable\n• Hard money wins long-term\n• Code is law\n\nMathematical certainty vs. political promises.",
  "📈 Institutional BTC Flows\n\nETF inflows continue their positive trajectory.\n\nMarket dynamics shifting:\n• Traditional finance embracing crypto\n• Regulatory clarity improving\n• Infrastructure maturing rapidly\n\nA new era for Bitcoin as an asset class.",
  "🌐 Network Security Update\n\nBitcoin hashrate reaches new ATH.\n\nWhat this means:\n• Most secure network in history\n• Miners betting on future value\n• Decentralization strengthening\n\nSecurity = Value. The math doesn't lie.",
  "🏦 Central Banks vs Bitcoin\n\nCBDCs are coming. But they're not Bitcoin.\n\nKey differences:\n• Centralized vs decentralized\n• Surveillance vs privacy\n• Inflationary vs deflationary\n\nThe monetary revolution is permissionless.",
  "🎯 Bitcoin Price Levels\n\nKey technical zones to monitor:\n\n• Support holding strong\n• Resistance zones being tested\n• Volume confirming moves\n\nPatience is the ultimate edge in this market.",
];

// AI-focused content templates  
const aiTemplates = [
  "🤖 AI Transforms Finance\n\nMachine learning is revolutionizing how we analyze markets.\n\nImpact areas:\n• Pattern recognition at scale\n• Real-time risk assessment\n• Predictive modeling\n\nThe future of analysis is AI-augmented.",
  "🧠 AI + Blockchain Convergence\n\nTwo transformative technologies merging.\n\nOpportunities emerging:\n• Automated trading strategies\n• Smart contract optimization\n• Decentralized AI models\n\nThe intersection creates new possibilities.",
  "💻 LLMs in Finance\n\nLarge Language Models are changing research.\n\nUse cases expanding:\n• Document analysis at scale\n• Market sentiment processing\n• Automated report generation\n\nEveryone gets a personal analyst now.",
  "🔮 Predictive Analytics\n\nAI identifies patterns invisible to humans.\n\nAdvantages:\n• Process millions of data points\n• Remove emotional bias\n• 24/7 market monitoring\n\nData-driven decisions outperform intuition.",
  "⚙️ AI Automation in Capital Markets\n\nFrom execution to compliance, AI leads.\n\nTransformation areas:\n• Trade execution optimization\n• Regulatory compliance automation\n• Risk management enhancement\n\nEfficiency meets intelligence.",
  "🎯 Machine Learning for Regime Detection\n\nAI helps navigate changing markets.\n\nCapabilities:\n• Identify market regime shifts\n• Adapt strategies dynamically\n• Reduce drawdown risk\n\nPrecision meets adaptability.",
];

// Tech-focused content templates
const techTemplates = [
  "🚀 Digital Infrastructure Boom\n\nEnterprises embrace cloud-native architectures.\n\nKey trends:\n• Edge computing expansion\n• Hybrid cloud adoption\n• API-first strategies\n\nDigital transformation accelerates.",
  "🔐 Cybersecurity Imperative\n\nAs digital footprints expand, so do threats.\n\nPriorities:\n• Zero-trust architecture\n• AI-powered threat detection\n• Security-first culture\n\nProtection is the new competitive advantage.",
  "📡 5G + IoT Convergence\n\nConnected devices reshape industries.\n\nImpact areas:\n• Smart manufacturing\n• Autonomous systems\n• Real-time analytics\n\nEverything that can be connected, will be.",
  "💾 Data as Strategic Asset\n\nData is the new oil. AI is the refinery.\n\nWinning formula:\n• Collect strategically\n• Process intelligently\n• Act decisively\n\nCompetitive advantage flows from data mastery.",
  "🌍 Fintech Bridges Gaps\n\nTechnology enables global financial access.\n\nBreakthroughs:\n• Borderless payments\n• Democratized investing\n• Financial inclusion\n\nBanking the unbanked becomes reality.",
  "⚡ Quantum Computing Advances\n\nThe next computing revolution approaches.\n\nImplications:\n• Cryptography transformation\n• Optimization breakthroughs\n• Scientific acceleration\n\nPrepare for the quantum era.",
];

// More hashtags for better reach - targeting 10k followers
const hashtags = {
  bitcoin: ["#Bitcoin", "#BTC", "#Crypto", "#DigitalGold", "#HODL", "#Blockchain", "#Web3", "#DeFi", "#CryptoTwitter", "#BitcoinNews", "#CryptoInvesting", "#Satoshi"],
  ai: ["#AI", "#MachineLearning", "#ArtificialIntelligence", "#DeepLearning", "#DataScience", "#Tech", "#ChatGPT", "#GenerativeAI", "#AINews", "#TechTwitter", "#Innovation", "#FutureOfWork"],
  tech: ["#Tech", "#Innovation", "#DigitalTransformation", "#Fintech", "#Startup", "#Future", "#Technology", "#CloudComputing", "#Cybersecurity", "#IoT", "#TechNews", "#Entrepreneurship"],
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
  // Use 5-7 hashtags for better reach
  const shuffledHashtags = [...hashtags[type]].sort(() => Math.random() - 0.5);
  const selectedHashtags = shuffledHashtags.slice(0, 5 + Math.floor(Math.random() * 3));
  
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
