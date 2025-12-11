import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvestorData {
  nome: string;
  azienda: string;
  ruolo?: string;
  citta?: string;
  categoria: string;
  email?: string;
  status?: string;
  pipeline_value?: number;
  last_contact_date?: string;
  engagement_score?: number;
}

interface GenerateEmailRequest {
  investor: InvestorData;
  emailType: 'first_contact' | 'follow_up' | 'meeting_request' | 'proposal' | 'custom';
  customPrompt?: string;
  previousInteractions?: string[];
  language?: 'it' | 'en';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { investor, emailType, customPrompt, previousInteractions, language = 'it' } = await req.json() as GenerateEmailRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about the investor
    const investorContext = `
Informazioni sull'investitore:
- Nome: ${investor.nome}
- Azienda: ${investor.azienda}
- Ruolo: ${investor.ruolo || 'Non specificato'}
- Città: ${investor.citta || 'Non specificata'}
- Categoria: ${investor.categoria}
- Status nel pipeline: ${investor.status || 'Non specificato'}
- Valore pipeline: ${investor.pipeline_value ? `€${investor.pipeline_value.toLocaleString()}` : 'Non specificato'}
- Ultimo contatto: ${investor.last_contact_date || 'Mai contattato'}
- Engagement Score: ${investor.engagement_score || 0}/100
`.trim();

    const previousInteractionsContext = previousInteractions?.length 
      ? `\n\nInterazioni precedenti:\n${previousInteractions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`
      : '';

    // Define email type prompts
    const emailTypePrompts: Record<string, string> = {
      first_contact: `Genera un'email professionale per il PRIMO CONTATTO con questo investitore per presentare l'opportunità di investimento in ABC Company (Club Deal da €10M). 
L'email deve:
- Essere personalizzata in base alla categoria dell'investitore (${investor.categoria})
- Menzionare brevemente i punti di forza di ABC Company (207 aziende in portafoglio, track record di successo)
- Proporre un incontro esplorativo
- Essere concisa ma professionale`,

      follow_up: `Genera un'email di FOLLOW-UP professionale per questo investitore. 
L'email deve:
- Fare riferimento al contatto precedente
- Fornire un aggiornamento rilevante sull'opportunità
- Proporre i prossimi passi
- Mantenere un tono cordiale ma professionale`,

      meeting_request: `Genera un'email per RICHIEDERE UN MEETING con questo investitore.
L'email deve:
- Proporre date/orari specifici (lasciare placeholder)
- Spiegare brevemente l'agenda del meeting
- Offrire flessibilità nella modalità (video call, in persona)
- Essere diretta e rispettosa del tempo dell'investitore`,

      proposal: `Genera un'email per INVIARE UNA PROPOSTA FORMALE a questo investitore.
L'email deve:
- Riassumere i punti chiave discussi
- Allegare/riferirsi alla documentazione (pitch deck, term sheet)
- Indicare i prossimi passi per procedere
- Trasmettere urgenza appropriata senza essere pressante`,

      custom: customPrompt || 'Genera un\'email professionale per questo investitore.'
    };

    const systemPrompt = `Sei un esperto di fundraising e investor relations per ABC Company, un veicolo di investimento che supporta PMI italiane. 
Scrivi email professionali, persuasive ma non aggressive, in ${language === 'it' ? 'italiano' : 'inglese'}.
Le email devono essere:
- Personalizzate per il destinatario
- Concise (max 200 parole per il corpo)
- Con oggetto accattivante
- Con call-to-action chiara
- Formattate con placeholder per personalizzazione: {nome}, {azienda}, {ruolo}, {citta}

Rispondi SOLO con il JSON nel formato:
{
  "subject": "Oggetto dell'email",
  "content": "Corpo dell'email con placeholder"
}`;

    const userPrompt = `${investorContext}${previousInteractionsContext}

${emailTypePrompts[emailType]}`;

    console.log('Generating email draft for investor:', investor.nome);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated");
    }

    // Parse the JSON response
    let emailDraft;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emailDraft = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse email draft");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback: use raw content
      emailDraft = {
        subject: "ABC Company - Opportunità di Investimento",
        content: generatedContent
      };
    }

    console.log('Email draft generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      draft: emailDraft 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating email draft:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to generate email draft" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
