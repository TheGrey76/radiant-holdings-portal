import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      // Fallback to template-based generation
      console.log('No OpenAI key, using templates');
      return new Response(
        JSON.stringify(generateTemplateContent(title, excerpt, category, slug, readTime, fullUrl)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI-powered content for each platform
    const systemPrompt = `Sei un esperto di content marketing per servizi finanziari B2B. 
Genera contenuti ottimizzati per diverse piattaforme social a partire da un articolo di blog.
Il tono deve essere professionale ma accessibile, autorevole ma non arrogante.
L'azienda è ARIES76, una boutique di advisory specializzata in private markets.
Rispondi SOLO con il JSON richiesto, senza markdown code blocks.`;

    const userPrompt = `Genera contenuti ottimizzati per la distribuzione cross-platform di questo articolo:

TITOLO: ${title}
CATEGORIA: ${category}
EXCERPT: ${excerpt}
URL: ${fullUrl}
TEMPO DI LETTURA: ${readTime}

Genera un JSON con questi campi:
1. "linkedin": Post breve (max 2500 caratteri) con emoji appropriate, hook iniziale forte, e 3-5 hashtag rilevanti
2. "linkedinNewsletter": Versione newsletter completa (1500+ parole) con struttura: intro, punti chiave, analisi, conclusioni
3. "medium": Articolo SEO-ottimizzato in Markdown con H2/H3, intro accattivante, e nota canonical URL
4. "substack": Newsletter personale e conversazionale con saluto, contenuto principale, takeaways numerati, e firma personale

Usa tono italiano professionale. Include sempre il link all'articolo originale.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('OpenAI API error');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let generatedContent;
    try {
      // Clean up potential markdown code blocks
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback to template
      generatedContent = generateTemplateContent(title, excerpt, category, slug, readTime, fullUrl);
    }

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

L'analisi completa è disponibile sul nostro blog.

👉 ${fullUrl}

#PrivateMarkets #PrivateEquity #InvestmentStrategy #WealthManagement #FamilyOffice`,
    
    linkedinNewsletter: `# ${title}

${excerpt}

---

## Punti chiave

In questo articolo analizziamo:

• Le tendenze emergenti nel settore
• Le implicazioni per gli investitori istituzionali  
• Le strategie operative consigliate

---

## Analisi approfondita

[Inserisci qui il contenuto principale dell'articolo, mantenendo paragrafi brevi e inserendo sottotitoli ogni 2-3 paragrafi]

---

## Conclusioni

[Riassumi i takeaway principali]

---

📖 Leggi l'articolo completo: ${fullUrl}

💼 Per approfondimenti: edoardo.grigione@aries76.com

---

*ARIES76 | Capital Intelligence*
*Private Markets Advisory | GP Capital Formation | Structured Solutions*`,

    medium: `# ${title}

*${category} | ${readTime}*

![Cover Image](https://www.aries76.com/og-image.png)

${excerpt}

---

## Introduzione

[Espandi l'introduzione con contesto di mercato e rilevanza per il lettore]

## Analisi

[Corpo principale dell'articolo con sottosezioni]

### [Sottotitolo 1]

[Contenuto dettagliato]

### [Sottotitolo 2]

[Contenuto dettagliato]

## Implicazioni per gli investitori

[Conclusioni operative e raccomandazioni]

---

*Questo articolo è stato originariamente pubblicato su [ARIES76](${fullUrl})*

*Per ricevere analisi esclusive sui private markets, iscriviti alla nostra newsletter.*

---

Tags: ${category}, Private Markets, Investment Strategy, Wealth Management`,

    substack: `# ${title}

*Ciao,*

*Questa settimana analizziamo un tema cruciale per chi opera nei mercati privati.*

---

## Il contesto

${excerpt}

## Cosa significa per te

[Personalizza con implicazioni pratiche per il lettore]

## I nostri takeaway

1. **[Punto chiave 1]** - [Spiegazione]
2. **[Punto chiave 2]** - [Spiegazione]
3. **[Punto chiave 3]** - [Spiegazione]

---

## Per approfondire

L'analisi completa con tutti i dati e le fonti è disponibile sul nostro sito:

👉 [Leggi l'articolo completo](${fullUrl})

---

*A presto,*

*Edoardo Grigione*
*Founder, ARIES76*

---

📩 Hai domande? Rispondi a questa email.
🔗 [LinkedIn](https://www.linkedin.com/company/aries76) | [Website](https://www.aries76.com)`
  };
}
