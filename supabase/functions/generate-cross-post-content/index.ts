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
