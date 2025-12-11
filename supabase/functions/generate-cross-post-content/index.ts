const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  readTime: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, excerpt, category, slug, readTime }: ContentRequest = await req.json();
    const fullUrl = `https://www.aries76.com/blog/${slug}`;
    
    console.log('Generating cross-post content for:', title);

    // Always use template for now - fast and reliable
    // AI generation can be enabled later with Lovable AI Gateway
    const generatedContent = generateTemplateContent(title, excerpt, category, slug, readTime, fullUrl);
    
    console.log('Generated content successfully');

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateTemplateContent(
  title: string, 
  excerpt: string, 
  category: string, 
  slug: string, 
  readTime: string,
  fullUrl: string
) {
  return {
    linkedin: `🎯 ${title}

${excerpt}

Read the full analysis on our blog.

👉 ${fullUrl}

#PrivateMarkets #PrivateEquity #InvestmentStrategy #WealthManagement #FamilyOffice`,
    
    linkedinNewsletter: `# ${title}

${excerpt}

---

## Key Takeaways

In this article, we analyze:

• Emerging trends in the sector
• Implications for institutional investors  
• Recommended operational strategies

---

## In-Depth Analysis

[Insert the main content of the article here, keeping paragraphs short and adding subheadings every 2-3 paragraphs]

---

## Conclusions

[Summarize the key takeaways]

---

📖 Read the full article: ${fullUrl}

💼 For more insights: edoardo.grigione@aries76.com

---

*ARIES76 | Capital Intelligence*
*Private Markets Advisory | GP Capital Formation | Structured Solutions*`,

    medium: `# ${title}

*${category} | ${readTime}*

![Cover Image](https://www.aries76.com/og-image.png)

${excerpt}

---

## Introduction

[Expand the introduction with market context and relevance for the reader]

## Analysis

[Main body of the article with subsections]

### [Subheading 1]

[Detailed content]

### [Subheading 2]

[Detailed content]

## Implications for Investors

[Operational conclusions and recommendations]

---

*This article was originally published on [ARIES76](${fullUrl})*

*Subscribe to our newsletter for exclusive private markets insights.*

---

Tags: ${category}, Private Markets, Investment Strategy, Wealth Management`,

    substack: `# ${title}

*Hello,*

*This week we analyze a crucial topic for those operating in private markets.*

---

## The Context

${excerpt}

## What This Means for You

[Customize with practical implications for the reader]

## Our Key Takeaways

1. **[Key Point 1]** - [Explanation]
2. **[Key Point 2]** - [Explanation]
3. **[Key Point 3]** - [Explanation]

---

## Learn More

The full analysis with all data and sources is available on our website:

👉 [Read the full article](${fullUrl})

---

*Best regards,*

*Edoardo Grigione*
*Founder, ARIES76*

---

📩 Questions? Reply to this email.
🔗 [LinkedIn](https://www.linkedin.com/company/aries76) | [Website](https://www.aries76.com)`
  };
}
