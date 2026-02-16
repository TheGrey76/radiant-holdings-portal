import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { Certificate } from '@/components/CertificateListManager';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface CertificateUploaderProps {
  onCertificatesParsed: (certificates: Certificate[], fileName: string, date: string) => void;
  currentFileName?: string;
  currentDate?: string;
}

// Parse a percentage string like "65%" or "11.36%" to number
const tryParsePercent = (val: string): string => {
  const cleaned = val.replace(/[^0-9.,%-]/g, '').trim();
  if (!cleaned || cleaned === '-') return '-';
  return cleaned.includes('%') ? cleaned : cleaned + '%';
};

// Extract date from filename like "List_ITA_R5_-_20260216.pdf"
const extractDateFromFilename = (filename: string): string => {
  const match = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return new Date().toLocaleDateString('it-IT');
};

// Detect certificate type from underlyings count and structure
const detectType = (underlyings: string, capitalBarrier: string): string => {
  if (capitalBarrier === '100%' || capitalBarrier === '-') return 'Capital Protected';
  const count = underlyings.split(',').length;
  if (count === 1) return 'Phoenix Single';
  if (count === 2) return 'Phoenix WO-2';
  if (count === 3) return 'Phoenix WO-3';
  return `Phoenix WO-${count}`;
};

// Detect coupon frequency from text
const detectFrequency = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes('monthly') || lower.includes('mensile')) return 'Monthly';
  if (lower.includes('quarterly') || lower.includes('trimestrale')) return 'Quarterly';
  if (lower.includes('semi') || lower.includes('semestrale')) return 'Semi-Annual';
  if (lower.includes('annual') || lower.includes('annuale')) return 'Annual';
  return 'Quarterly'; // default
};

// Main parsing function — extracts structured data from PDF text
function parseCertificatesFromText(fullText: string): Certificate[] {
  const certificates: Certificate[] = [];
  const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Look for ISIN patterns (starts with 2 letters followed by alphanumeric)
  const isinPattern = /\b([A-Z]{2}[A-Z0-9]{9,10}\d)\b/g;
  
  // Collect all ISINs found
  const isinPositions: { isin: string; lineIndex: number }[] = [];
  lines.forEach((line, idx) => {
    let match;
    while ((match = isinPattern.exec(line)) !== null) {
      isinPositions.push({ isin: match[1], lineIndex: idx });
    }
  });

  // For each ISIN, try to extract certificate data from surrounding context
  const seenIsins = new Set<string>();
  
  isinPositions.forEach(({ isin, lineIndex }, posIdx) => {
    if (seenIsins.has(isin)) return;
    seenIsins.add(isin);

    // Gather context: lines around the ISIN
    const contextStart = Math.max(0, lineIndex - 2);
    const contextEnd = Math.min(lines.length - 1, lineIndex + 8);
    const context = lines.slice(contextStart, contextEnd + 1).join(' ');

    // Extract issuer
    let issuer = 'Unknown';
    const issuerPatterns = [
      { pattern: /Barclays/i, name: 'Barclays' },
      { pattern: /UBS/i, name: 'UBS' },
      { pattern: /Vontobel/i, name: 'Vontobel' },
      { pattern: /Leonteq/i, name: 'Leonteq' },
      { pattern: /Morgan\s*Stanley/i, name: 'Morgan Stanley' },
      { pattern: /BNP/i, name: 'BNP Paribas' },
      { pattern: /Citigroup|Citi/i, name: 'Citigroup' },
      { pattern: /Goldman/i, name: 'Goldman Sachs' },
      { pattern: /Societe\s*Generale|SocGen/i, name: 'Societe Generale' },
      { pattern: /Deutsche\s*Bank/i, name: 'Deutsche Bank' },
      { pattern: /HSBC/i, name: 'HSBC' },
      { pattern: /Natixis/i, name: 'Natixis' },
    ];
    for (const ip of issuerPatterns) {
      if (ip.pattern.test(context)) {
        issuer = ip.name;
        break;
      }
    }

    // Also try to detect from ISIN prefix
    if (issuer === 'Unknown') {
      if (isin.startsWith('DE000VJ') || isin.startsWith('DE000VQ')) issuer = 'Vontobel';
      else if (isin.startsWith('DE000UQ')) issuer = 'UBS';
      else if (isin.startsWith('DE000MS')) issuer = 'Morgan Stanley';
      else if (isin.startsWith('XS')) issuer = 'Barclays'; // common for XS
      else if (isin.startsWith('CH')) issuer = 'Leonteq'; // common for CH
    }

    // Extract percentages from context
    const percents = context.match(/\d+[.,]?\d*%/g) || [];
    
    // Try to find coupon p.a.
    let couponPa = '-';
    let irr = '-';
    let couponBarrier = '-';
    let capitalBarrier = '-';
    let ask = '-';

    // Coupon p.a. usually appears near "coupon" or "cedola" or is the first prominent percentage
    const couponMatch = context.match(/(?:coupon|cedola|cpn)[:\s]*(\d+[.,]?\d*%)/i);
    if (couponMatch) {
      couponPa = couponMatch[1];
    } else if (percents.length >= 1) {
      // Heuristic: first percentage is often coupon
      couponPa = percents[0];
    }

    // IRR
    const irrMatch = context.match(/(?:IRR|rendimento)[:\s]*(\d+[.,]?\d*%)/i);
    if (irrMatch) {
      irr = irrMatch[1];
    }

    // Barriers — look for patterns like "65/65" or "barrier 65%"
    const barrierPairMatch = context.match(/(?:barrier[ae]?|barr\.?)[:\s]*(\d+[.,]?\d*)%?\s*[\/\-]\s*(\d+[.,]?\d*)%/i);
    if (barrierPairMatch) {
      couponBarrier = barrierPairMatch[1] + '%';
      capitalBarrier = barrierPairMatch[2] + '%';
    } else {
      const barrierMatch = context.match(/(?:barrier[ae]?|barr\.?|prot\.?)[:\s]*(\d+[.,]?\d*%)/i);
      if (barrierMatch) {
        couponBarrier = barrierMatch[1];
        capitalBarrier = barrierMatch[1];
      } else if (percents.length >= 3) {
        // Heuristic: barriers are often repeated percentages
        const uniquePercents = [...new Set(percents)];
        if (uniquePercents.length >= 2) {
          // Lower percentages are likely barriers
          const sorted = uniquePercents.map(p => parseFloat(p)).filter(n => n > 0 && n < 100).sort((a, b) => a - b);
          if (sorted.length >= 1 && sorted[0] <= 70) {
            couponBarrier = sorted[0] + '%';
            capitalBarrier = sorted[0] + '%';
          }
        }
      }
    }

    // Maturity
    let maturity = '-';
    const maturityMatch = context.match(/(\d+)\s*(?:year|anni|yr)/i);
    if (maturityMatch) {
      maturity = maturityMatch[1] + ' Year';
    } else {
      const dateMatch = context.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
      if (dateMatch) {
        const matDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
        const yearsToMaturity = Math.round((matDate.getTime() - Date.now()) / (365.25 * 24 * 60 * 60 * 1000));
        if (yearsToMaturity > 0) maturity = yearsToMaturity + ' Year';
      }
    }

    // Underlyings — look for company names
    let underlyings = '-';
    const underlyingsMatch = context.match(/(?:sottostant[ie]|underlying|basket)[:\s]*(.+?)(?:\.|$|\d+%)/i);
    if (underlyingsMatch) {
      underlyings = underlyingsMatch[1].trim();
    }

    // Theme
    let theme = '';
    const themeMatch = context.match(/(?:tema|theme|name)[:\s]*(.+?)(?:\.|$)/i);
    if (themeMatch) {
      theme = themeMatch[1].trim();
    }
    if (!theme) {
      theme = underlyings !== '-' ? underlyings.substring(0, 40) : `Certificate ${isin}`;
    }

    // Frequency
    const frequency = detectFrequency(context);

    // Type
    const type = detectType(underlyings, capitalBarrier);

    certificates.push({
      id: certificates.length + 1,
      isin,
      issuer,
      theme,
      type,
      couponPa: tryParsePercent(couponPa),
      couponFrequency: frequency,
      couponBarrier: tryParsePercent(couponBarrier),
      capitalBarrier: tryParsePercent(capitalBarrier),
      maturity,
      irr: tryParsePercent(irr),
      ask: tryParsePercent(ask),
      underlyings,
      isNew: true,
    });
  });

  return certificates;
}

export const CertificateUploader = ({ onCertificatesParsed, currentFileName, currentDate }: CertificateUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Per favore carica un file PDF');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedCount(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      const certificates = parseCertificatesFromText(fullText);
      const dateStr = extractDateFromFilename(file.name);

      if (certificates.length === 0) {
        setError('Nessun certificato trovato nel PDF. Verifica che sia il formato corretto (Lista R5).');
        toast.error('Nessun certificato trovato');
      } else {
        setParsedCount(certificates.length);
        onCertificatesParsed(certificates, file.name, dateStr);
        toast.success(`${certificates.length} certificati estratti dal PDF`);
      }
    } catch (err) {
      console.error('PDF parsing error:', err);
      setError('Errore durante la lettura del PDF');
      toast.error('Errore durante la lettura del PDF');
    } finally {
      setLoading(false);
      // Reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Carica Lista Certificati (PDF)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="cert-pdf-upload"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {loading ? 'Analisi in corso...' : 'Seleziona PDF R5'}
          </Button>

          {currentFileName && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>
                <strong>{currentFileName}</strong> — {currentDate}
              </span>
              {parsedCount !== null && (
                <Badge variant="secondary">{parsedCount} certificati</Badge>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <p className="text-xs text-slate-500">
          Carica il PDF settimanale della lista R5 per aggiornare automaticamente i certificati disponibili e il confronto con il portafoglio.
        </p>
      </CardContent>
    </Card>
  );
};
