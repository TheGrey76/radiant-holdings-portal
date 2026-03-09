import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getStoredApiKey } from "./ApiKeySettings";
import type { UploadedDoc, ExtractionResult, ProcessingStep } from "./ai-types";

const EXTRACTION_SYSTEM_PROMPT = `You are an expert institutional due diligence analyst working for Aries76, a capital intelligence firm. You are analyzing GP/fund documents to extract data points for a quantitative scoring framework.

Extract ALL relevant data points and map them to the scoring framework below. For each metric, provide:
1. The raw data point(s) you found
2. Which document and approximate page/section it came from
3. A confidence level (high/medium/low)
4. A suggested score (0, 1, 3, or 5) based on the thresholds
5. A brief rationale for the suggested score

SCORING FRAMEWORK:

PILLAR 1 — THE TEAM (30 pts):
- Senior Team Stability (10 pts): 5=>90% together >7yr, 3=70-90% >5yr, 1=<70% or <5yr, 0=high turnover
- Attribution Analysis (10 pts): 5=>80% value from current key persons, 3=60-80%, 1=<60%, 0=key persons departed
- Relevant Experience (5 pts): 5=avg >15yr India PE/VC, 3=10-15yr, 1=<10yr, 0=limited India exp
- GP Commitment (5 pts): 5=>3% fund size, 3=1.5-3%, 1=1-1.5%, 0=<1%

PILLAR 2 — THE TRACK RECORD (35 pts):
- Net IRR USD (10 pts): 5=top quartile >22%, 3=15-22%, 1=10-15%, 0=<10%
- Net MOIC USD (10 pts): 5=>2.5x, 3=2.0-2.5x, 1=1.5-2.0x, 0=<1.5x
- DPI Cash Returns (10 pts): 5=>1.2x mature, 3=0.8-1.2x, 1=0.5-0.8x, 0=<0.5x
- Loss Ratio (5 pts): 5=<5%, 3=5-10%, 1=10-15%, 0=>15%

PILLAR 3 — THE STRATEGY (20 pts):
- Strategy-Market Fit (10 pts): 5=clear differentiated niche, 3=solid but generic, 1=unclear, 0=misaligned
- Fund Size Discipline (5 pts): 5=<1.5x prior, 3=1.5-2x, 1=>2x, 0=significant increase
- Vintage Focus (5 pts): 5=Fund II/III, 3=Fund IV, 1=Fund I or V+, 0=N/A

PILLAR 4 — GOVERNANCE & OPERATIONS (15 pts):
- ILPA Compliance (5 pts): 5=full ILPA 3.0, 3=partial, 1=limited, 0=non-compliant
- Fee Structure (5 pts): 5=mgmt<2% carry=20% hurdle>8%, 3=standard 2/20/8, 1=above-market, 0=egregious
- Operational DD (5 pts): 5=passes all checks, 3=minor issues, 1=significant concerns, 0=fails

Also extract general fund information:
- Fund name, GP name, fund number/vintage, target size, management fee, carry, hurdle rate, GP commitment percentage, key person names and titles.

Return ONLY a JSON object with this exact structure (no markdown, no backticks, no preamble):

{
  "fund_info": {
    "fund_name": { "value": "", "confidence": "high|medium|low", "source": "" },
    "gp_name": { "value": "", "confidence": "high|medium|low", "source": "" },
    "fund_number": { "value": "", "confidence": "high|medium|low", "source": "" },
    "target_size_usd_m": { "value": null, "confidence": "high|medium|low", "source": "" },
    "management_fee_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "carry_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "hurdle_rate_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "gp_commitment_pct": { "value": null, "confidence": "high|medium|low", "source": "" },
    "key_persons": [{ "name": "", "title": "", "years_experience": null }]
  },
  "metrics": {
    "senior_team_stability": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "attribution_analysis": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "relevant_experience": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "gp_commitment": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "net_irr_usd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "net_moic_usd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "dpi_cash_returns": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "loss_ratio": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "strategy_market_fit": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "fund_size_discipline": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "vintage_focus": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "ilpa_compliance": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "fee_structure": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" },
    "operational_dd": { "raw_data": "", "source_document": "", "source_location": "", "confidence": "high|medium|low", "suggested_score": 0, "rationale": "" }
  }
}`;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMediaType(file: File): string {
  if (file.type === 'application/pdf') return 'application/pdf';
  if (file.type.startsWith('image/')) return file.type;
  return 'application/pdf'; // fallback
}

export function useAIExtraction() {
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('reading');
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);

  const analyze = useCallback(async (documents: UploadedDoc[]): Promise<ExtractionResult | null> => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      toast.error('Please configure your Anthropic API key first');
      return null;
    }

    if (documents.length === 0) {
      toast.error('No documents to analyze');
      return null;
    }

    setProcessing(true);
    setProcessingStep('reading');

    try {
      // Step 1: Read documents
      const contentParts: any[] = [];
      for (const doc of documents) {
        const base64 = await fileToBase64(doc.file);
        const mediaType = getMediaType(doc.file);

        if (doc.file.type.startsWith('image/')) {
          contentParts.push({
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          });
        } else if (doc.file.type === 'application/pdf') {
          contentParts.push({
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          });
        } else {
          // For DOCX/XLSX, send as document with generic type
          contentParts.push({
            type: 'document',
            source: { type: 'base64', media_type: mediaType || 'application/octet-stream', data: base64 },
          });
        }
      }

      setProcessingStep('extracting');

      // Step 2: API call
      contentParts.push({
        type: 'text',
        text: 'Analyze these GP/fund documents and extract all data points relevant to our scoring framework. Return ONLY valid JSON.',
      });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: EXTRACTION_SYSTEM_PROMPT,
          messages: [{ role: "user", content: contentParts }],
        }),
      });

      setProcessingStep('mapping');

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text || '';

      setProcessingStep('scoring');

      // Parse JSON from response
      let parsed: ExtractionResult;
      try {
        // Try to extract JSON from potential markdown wrapping
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error('Failed to parse AI response');
      }

      setProcessingStep('done');
      setExtraction(parsed);
      toast.success('Document analysis complete');
      return parsed;
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed');
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const generateNotes = useCallback(async (pillarName: string, pillarData: any): Promise<string | null> => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      toast.error('API key required');
      return null;
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior due diligence analyst at Aries76, a capital intelligence firm. Write a concise, professional Investment Committee memo paragraph summarizing the assessment of this pillar. Use specific numbers and data points. Write in third person, institutional tone. 3-5 sentences max.",
          messages: [{
            role: "user",
            content: `Write an IC memo paragraph for the ${pillarName} pillar. Scores and data: ${JSON.stringify(pillarData)}`,
          }],
        }),
      });

      if (!res.ok) throw new Error('API call failed');

      const data = await res.json();
      return data.content?.[0]?.text || null;
    } catch {
      toast.error('Failed to generate summary');
      return null;
    }
  }, []);

  return { processing, processingStep, extraction, setExtraction, analyze, generateNotes };
}
