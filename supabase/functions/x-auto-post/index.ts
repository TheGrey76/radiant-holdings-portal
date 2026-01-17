import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// No image - text only posts

interface ContentItem {
  type: 'bitcoin' | 'ai' | 'tech';
  content: string;
  hashtags: string[];
}

// Bitcoin-focused content templates - engaging, provocative, viral
const bitcoinTemplates = [
  "Unpopular opinion:\n\nBitcoin at $100K isn't expensive.\n\nIt's still early.\n\nHere's why most people will realize this too late 🧵",
  "I studied 100+ billionaire portfolios.\n\nEvery single one now holds Bitcoin.\n\nThis wasn't true 3 years ago.\n\nThe wealth transfer is happening. Are you positioned?",
  "2025: \"Bitcoin is too volatile\"\n2030: \"I wish I bought at $100K\"\n\nThis pattern has repeated every cycle.\n\nDon't be the person who waits for \"confirmation.\"",
  "BlackRock didn't build a Bitcoin ETF for fun.\n\nThey built it because their clients demanded it.\n\nWhen the smartest money in the room speaks, you listen.",
  "Hot take:\n\nBitcoin isn't an investment anymore.\n\nIt's a savings technology.\n\nThe difference? Investments can fail. Sound money can't.",
  "Everyone wants Bitcoin's returns.\n\nNo one wants Bitcoin's volatility.\n\nBut you can't have one without the other.\n\nThis is the cost of admission.",
  "Your bank pays 4% interest.\n\nInflation runs at 7%.\n\nYou're losing 3% a year by \"being safe.\"\n\nBitcoin holders know this game is rigged.",
  "The average Bitcoin holder has outperformed:\n\n• 99% of hedge funds\n• Every fiat currency\n• Most real estate markets\n\nBy simply... holding.\n\nTime preference matters.",
  "Central banks printed $10T in 3 years.\n\nBitcoin printed exactly 0 new coins.\n\n21 million. Forever.\n\nMathematics beats politics.",
  "MicroStrategy's playbook:\n\n1. Buy Bitcoin\n2. Hold Bitcoin\n3. Repeat\n\nStock up 1,000%+ in 4 years.\n\nSometimes the simple strategy wins.",
  "\"Bitcoin has no intrinsic value\"\n\n- Same people who think the dollar does\n\nThe dollar lost 96% of its value since 1913.\n\nBitcoin gained 1,000,000%+ in 15 years.",
  "Generational wealth isn't built by following the crowd.\n\nIt's built by understanding what the crowd will want next.\n\nEvery institution now wants Bitcoin.\n\nWhat does that tell you?",
];

// AI-focused content templates - thought-provoking
const aiTemplates = [
  "AI won't replace you.\n\nBut someone using AI will.\n\nThis is the skill gap of our generation.\n\nAre you on the right side of it?",
  "Every job posting in 2025:\n\n\"AI experience preferred\"\n\nEvery job posting in 2030:\n\n\"AI experience required\"\n\nThe window to adapt is now.",
  "ChatGPT hit 100M users in 2 months.\n\nFacebook took 4.5 years.\n\nInstagram took 2.5 years.\n\nWe're witnessing the fastest technology adoption in human history.",
  "Unpopular opinion:\n\nAI won't destroy jobs.\n\nIt will destroy job descriptions.\n\nEvery role is being rewritten. Adapt or become obsolete.",
  "I automated 40 hours of weekly tasks to 4 hours.\n\nNo one taught me this.\n\nI just started experimenting.\n\nCuriosity is the most valuable skill in the AI era.",
  "The AI revolution isn't coming.\n\nIt arrived in November 2022.\n\nMost people are still in denial.\n\nEarly adopters are already 10x more productive.",
  "In 5 years, there will be two types of companies:\n\n1. AI-native companies\n2. Dead companies\n\nDigital transformation is no longer optional.",
  "AI is the new electricity.\n\nIn 1900, factories resisted electricity.\n\nIn 2025, companies resist AI.\n\nHistory rhymes for those paying attention.",
  "The question isn't IF AI will transform your industry.\n\nIt's WHEN and HOW FAST.\n\nFirst movers win. Fast followers survive. The rest disappear.",
  "Hot take:\n\nLearning to prompt AI well is more valuable than learning to code.\n\nCode is becoming a commodity.\n\nThinking is becoming premium.",
];

// Tech & Finance content templates - engaging insights
const techTemplates = [
  "Silicon Valley secret:\n\nThe best founders aren't the smartest.\n\nThey're the most resilient.\n\n90% of success is surviving long enough to get lucky.",
  "Every major tech company started with skeptics:\n\n\"Email will never replace fax\"\n\"Nobody needs a smartphone\"\n\"Crypto is a scam\"\n\nSkepticism is the early warning sign of opportunity.",
  "The best investment I ever made:\n\nLearning how technology actually works.\n\nTech literacy isn't optional anymore. It's survival.",
  "VC insight:\n\nThe best pitches aren't about technology.\n\nThey're about the problem being solved.\n\nTechnology is just the tool. Customer pain is the opportunity.",
  "In 10 years, every company will be a tech company.\n\nNot because they want to be.\n\nBecause they have to be.\n\nDigitize or die.",
  "The companies winning in 2025:\n\n• AI-first operations\n• Data-driven decisions\n• Remote-friendly culture\n\nThe playbook has changed. Have you?",
  "Fintech is eating traditional banking.\n\nNot because it's better.\n\nBecause it's 10x faster and 10x cheaper.\n\nSpeed and cost always win eventually.",
  "The new status symbols:\n\n• Time freedom\n• Location independence\n• Skill optionality\n\nNot fancy cars. Not big houses.\n\nFlexibility is the new wealth.",
  "Most people overestimate what they can do in 1 year.\n\nAnd underestimate what they can do in 10.\n\nCompounding works for skills too, not just money.",
  "Contrarian take:\n\nThe best career move isn't following trends.\n\nIt's mastering fundamentals that never change.\n\nTrends fade. Principles compound.",
];

// Engaging hashtags - mix of reach and niche
const hashtags = {
  bitcoin: ["#Bitcoin", "#BTC", "#Crypto", "#DigitalGold", "#CryptoTwitter", "#Web3", "#Blockchain", "#HODL", "#BitcoinNews", "#WealthBuilding", "#FinancialFreedom", "#Investing"],
  ai: ["#AI", "#ChatGPT", "#ArtificialIntelligence", "#FutureOfWork", "#Productivity", "#TechTwitter", "#MachineLearning", "#Innovation", "#Automation", "#CareerGrowth", "#DigitalTransformation", "#AITools"],
  tech: ["#Tech", "#Startups", "#Fintech", "#Entrepreneurship", "#VentureCapital", "#Innovation", "#DigitalTransformation", "#Leadership", "#FutureOfWork", "#BusinessStrategy", "#TechCareers", "#Growth"],
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

// No media upload - text only

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
    
    // Post text only - no image
    const result = await postToX(tweetText);
    
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
          content: tweetText.substring(0, 100) + '...'
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
