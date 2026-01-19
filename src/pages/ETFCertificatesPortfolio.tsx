import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Wallet, TrendingUp, CalendarDays, FileText, 
  PieChart, DollarSign, AlertTriangle, Calendar as CalendarIcon,
  Upload, RefreshCw, ArrowLeft, Info, FileUp, CheckCircle, XCircle, Loader2, Download,
  TrendingDown, Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import { format, addMonths, startOfMonth, isBefore, isAfter } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ETFPortfolioAccessGate from '@/components/ETFPortfolioAccessGate';
import { usePortfolioPrices } from '@/hooks/usePortfolioPrices';

// PDF Market Data - Simulazione dati estratti dal PDF
const PDF_CERTIFICATES_DATA = [
  { isin: 'XS3189071965', name: 'Energy Basket', ask: 97.4, irr: 12.77, coupon: 12.0, barrier: 65 },
  { isin: 'XS3120925063', name: 'Semiconductor Basket', ask: 91.08, irr: 18.21, coupon: 15.6, barrier: 65 },
  { isin: 'DE000VJ1P3J8', name: 'Luxury Basket', ask: 98.6, irr: 10.52, coupon: 11.92, barrier: 65 },
  { isin: 'CH1505566112', name: 'US Tech Autocallable', ask: 100.23, irr: 11.96, coupon: 12.0, barrier: 60 },
  { isin: 'CH1491786658', name: 'Italian Equity Capital Protected', ask: 99.63, irr: null, coupon: null, barrier: 100 },
  { isin: 'XS3167626897', name: 'ITA Basket', ask: 96.64, irr: 13.09, coupon: 12.0, barrier: 60 },
  { isin: 'XS3221979696', name: 'Quantum Computing Basket', ask: null, irr: 27.4, coupon: 28.44, barrier: 55 },
  { isin: 'DE000VH8P6R1', name: 'AI Quantum Basket', ask: 89.3, irr: 33.43, coupon: 28.28, barrier: 40 },
  { isin: 'XS3167625907', name: 'FinTech Basket', ask: 87.96, irr: 17.46, coupon: 15.0, barrier: 50 },
  { isin: 'XS3153270833', name: 'Look Back Ita Basket', ask: 97.94, irr: 9.02, coupon: 8.0, barrier: 65 },
];

interface MatchResult {
  isin: string;
  nome: string;
  inPortfolio: boolean;
  marketAsk?: number | null;
  marketIRR?: number | null;
  opportunity?: 'buy' | 'close' | 'hold' | 'new';
  reason?: string;
}

interface PortfolioOrder {
  id: string;
  isin: string;
  nome: string;
  tipo: 'acquisto' | 'vendita' | 'incremento';
  quantita?: number;
  importo?: number;
  note?: string;
  status: 'pending' | 'confirmed' | 'executed';
  createdAt: Date;
}

// Descrizioni ruoli ETF in italiano
const ROLE_DESCRIPTIONS: { [key: string]: string } = {
  'Core Equity Globale': 'Esposizione diversificata ai mercati azionari mondiali. Costituisce la base del portafoglio per la crescita a lungo termine.',
  'Riduzione Drawdown': 'Azioni di qualità con bassa volatilità. Riduce le perdite massime durante le correzioni di mercato.',
  'Stabilità': 'Obbligazioni investment grade in euro. Fornisce stabilità e reddito regolare con basso rischio.',
  'Decorrelazione': 'Oro fisico come bene rifugio. Protegge il portafoglio durante crisi e inflazione.',
  'Liquidità Tattica': 'Replica il tasso overnight BCE. Parcheggio liquidità con rendimento superiore al conto corrente.'
};

// ETF Data (€20.000)
const ETF_DATA = [
  { isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World UCITS ETF', importo: 8000, weight: 40, role: 'Core Equity Globale' },
  { isin: 'IE00BP3QZ601', name: 'iShares MSCI World Quality Factor UCITS ETF', importo: 4000, weight: 20, role: 'Riduzione Drawdown' },
  { isin: 'IE00B3DKXQ41', name: 'iShares Core € Aggregate Bond UCITS ETF', importo: 4000, weight: 20, role: 'Stabilità' },
  { isin: 'IE00B579F325', name: 'Invesco Physical Gold ETC', importo: 2000, weight: 10, role: 'Decorrelazione' },
  { isin: 'LU0290358497', name: 'Xtrackers II EUR Overnight Rate Swap UCITS ETF', importo: 2000, weight: 10, role: 'Liquidità Tattica' },
];

// Certificates Data (€10.000)
const CERTIFICATES_DATA = [
  { 
    isin: 'XS3189071965', 
    emittente: 'Barclays', 
    nome: 'Energy Basket',
    cedola: 12.0, 
    frequenza: 'Trimestrale', 
    barriera: 60,
    importoInvestito: 2500,
    dataEmissione: new Date(2024, 10, 15),
    scadenza: new Date(2027, 10, 15)
  },
  { 
    isin: 'XS3120925063', 
    emittente: 'Barclays', 
    nome: 'Semiconductor',
    cedola: 15.6, 
    frequenza: 'Trimestrale', 
    barriera: 60,
    importoInvestito: 2000,
    dataEmissione: new Date(2024, 10, 13),
    scadenza: new Date(2027, 10, 13)
  },
  { 
    isin: 'DE000VJ1P3J8', 
    emittente: 'Vontobel', 
    nome: 'Luxury',
    cedola: 10.52, 
    frequenza: 'Trimestrale', 
    barriera: 60,
    importoInvestito: 1500,
    dataEmissione: new Date(2024, 9, 20),
    scadenza: new Date(2027, 9, 20)
  },
  { 
    isin: 'CH1505566112', 
    emittente: 'Leonteq', 
    nome: 'US Tech',
    cedola: 12.0, 
    frequenza: 'Mensile', 
    barriera: 60,
    importoInvestito: 1500,
    dataEmissione: new Date(2024, 11, 1),
    scadenza: new Date(2027, 11, 1)
  },
  { 
    isin: 'CH1491786658', 
    emittente: 'Leonteq', 
    nome: 'Capital Protected IT',
    cedola: 0, 
    frequenza: 'A scadenza', 
    barriera: 100,
    importoInvestito: 1500,
    dataEmissione: new Date(2024, 11, 1),
    scadenza: new Date(2029, 11, 1)
  },
  { 
    isin: 'XS3167626897', 
    emittente: 'Barclays', 
    nome: 'ITA Basket',
    cedola: 12.0, 
    frequenza: 'Trimestrale', 
    barriera: 60,
    importoInvestito: 1000,
    dataEmissione: new Date(2024, 10, 1),
    scadenza: new Date(2027, 10, 1)
  },
];

interface CashFlowEvent {
  date: Date;
  isin: string;
  nome: string;
  tipo: 'cedola' | 'scadenza';
  importo: number;
}

interface WeeklyReport {
  lastUpdated: Date;
  rendimentoStimato: number;
  rischioPortafoglio: string;
  commentoAI: string;
  variazioni: {
    tipo: string;
    descrizione: string;
  }[];
}

const ETFCertificatesPortfolio = () => {
  const [cashFlowActive, setCashFlowActive] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PortfolioOrder[]>([]);
  const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport>({
    lastUpdated: new Date(),
    rendimentoStimato: 7.8,
    rischioPortafoglio: 'Moderato',
    commentoAI: 'Il portafoglio mantiene un profilo bilanciato con focus su income generation. I certificates continuano a pagare cedole regolari. Nessuna barriera è stata violata. Si consiglia di monitorare i titoli del settore healthcare per possibili opportunità di ribilanciamento.',
    variazioni: [
      { tipo: 'Positivo', descrizione: 'Cedola DE000UQ0LUM5 incassata (+€800)' },
      { tipo: 'Neutro', descrizione: 'Mercati stabili, volatilità contenuta' },
    ]
  });

  // Real-time price hooks
  const etfIsins = ETF_DATA.map(e => e.isin);
  const certIsins = CERTIFICATES_DATA.map(c => c.isin);
  
  const { 
    prices: etfPrices, 
    loading: etfLoading, 
    lastUpdated: etfLastUpdated,
    refetch: refetchEtf 
  } = usePortfolioPrices(etfIsins, 'etf', true, 60000);
  
  const { 
    prices: certPrices, 
    loading: certLoading, 
    lastUpdated: certLastUpdated,
    refetch: refetchCert 
  } = usePortfolioPrices(certIsins, 'certificates', true, 60000);

  const handleRefreshPrices = async () => {
    toast.info('Aggiornamento prezzi in corso...');
    await Promise.all([refetchEtf(), refetchCert()]);
    toast.success('Prezzi aggiornati');
  };

  // Funzione per creare un ordine
  const createOrder = (isin: string, nome: string, tipo: 'acquisto' | 'vendita' | 'incremento', importo?: number) => {
    const newOrder: PortfolioOrder = {
      id: crypto.randomUUID(),
      isin,
      nome,
      tipo,
      importo,
      status: 'pending',
      createdAt: new Date()
    };
    setPendingOrders(prev => [...prev, newOrder]);
    toast.success(`Ordine ${tipo} aggiunto`, { description: `${nome} (${isin})` });
  };

  const removeOrder = (orderId: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    toast.info('Ordine rimosso');
  };

  const confirmOrders = () => {
    if (pendingOrders.length === 0) return;
    
    // Genera email con gli ordini
    const ordersList = pendingOrders.map(o => 
      `• ${o.tipo.toUpperCase()}: ${o.nome} (${o.isin})${o.importo ? ` - €${o.importo.toLocaleString('it-IT')}` : ''}`
    ).join('\n');
    
    const emailBody = encodeURIComponent(
      `Gentili,\n\nSi prega di eseguire i seguenti ordini sul portafoglio:\n\n${ordersList}\n\nCordiali saluti`
    );
    
    window.open(`mailto:operazioni@bancasella.it?subject=Disposizione%20Ordini%20Portafoglio&body=${emailBody}`);
    
    setPendingOrders(prev => prev.map(o => ({ ...o, status: 'confirmed' as const })));
    toast.success('Ordini confermati', { description: 'Email disposizione preparata' });
  };

  // Funzione per analizzare PDF e confrontare con portafoglio
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setShowMarketAnalysis(true);

    // Simulazione analisi PDF
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Confronto con certificati in portafoglio
    const results: MatchResult[] = [];
    
    // Controlla certificati in portafoglio
    CERTIFICATES_DATA.forEach(cert => {
      const marketData = PDF_CERTIFICATES_DATA.find(p => p.isin === cert.isin);
      if (marketData) {
        let opportunity: 'buy' | 'close' | 'hold' = 'hold';
        let reason = 'Nessuna variazione significativa';
        
        if (marketData.ask && marketData.ask < 95) {
          opportunity = 'buy';
          reason = `Prezzo interessante (${marketData.ask}%), possibile incremento`;
        } else if (marketData.irr && marketData.irr < 5) {
          opportunity = 'close';
          reason = `IRR basso (${marketData.irr}%), valutare chiusura`;
        }
        
        results.push({
          isin: cert.isin,
          nome: cert.nome,
          inPortfolio: true,
          marketAsk: marketData.ask,
          marketIRR: marketData.irr,
          opportunity,
          reason
        });
      }
    });

    // Nuove opportunità non in portafoglio
    PDF_CERTIFICATES_DATA.forEach(pdfCert => {
      const inPortfolio = CERTIFICATES_DATA.some(c => c.isin === pdfCert.isin);
      if (!inPortfolio && pdfCert.irr && pdfCert.irr > 15) {
        results.push({
          isin: pdfCert.isin,
          nome: pdfCert.name,
          inPortfolio: false,
          marketAsk: pdfCert.ask,
          marketIRR: pdfCert.irr,
          opportunity: 'new',
          reason: `Alto IRR (${pdfCert.irr}%), potenziale acquisto`
        });
      }
    });

    setMatchResults(results);
    setIsAnalyzing(false);
    toast.success('Analisi completata', { description: `${results.length} certificati analizzati` });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calcoli portafoglio
  const totalETFValue = 20000; // Valore ETF
  const totalCertificatesValue = CERTIFICATES_DATA.reduce((sum, c) => sum + c.importoInvestito, 0);
  const totalPortfolioValue = totalETFValue + totalCertificatesValue;
  
  const etfAllocation = (totalETFValue / totalPortfolioValue * 100).toFixed(1);
  const certAllocation = (totalCertificatesValue / totalPortfolioValue * 100).toFixed(1);

  // Calcolo yield atteso
  const expectedYield = useMemo(() => {
    if (!cashFlowActive) return 0;
    
    const totalCedoleAnnue = CERTIFICATES_DATA.reduce((sum, cert) => {
      if (cert.cedola === 0) return sum;
      return sum + (cert.importoInvestito * cert.cedola / 100);
    }, 0);
    
    // ETF dividend yield medio stimato ~2.5%
    const etfDividends = totalETFValue * 0.025;
    
    return ((totalCedoleAnnue + etfDividends) / totalPortfolioValue * 100).toFixed(2);
  }, [cashFlowActive]);

  // Generazione cash flow events
  const cashFlowEvents = useMemo(() => {
    if (!cashFlowActive) return [];
    
    const events: CashFlowEvent[] = [];
    const endDate = addMonths(startDate, 24); // 2 anni di proiezione
    
    CERTIFICATES_DATA.forEach(cert => {
      if (cert.cedola === 0) return;
      
      let currentDate = startOfMonth(startDate);
      const interval = cert.frequenza === 'Mensile' ? 1 : 3;
      
      while (isBefore(currentDate, endDate)) {
        if (isAfter(currentDate, startDate) && isBefore(currentDate, cert.scadenza)) {
          const importoCedola = cert.frequenza === 'Mensile' 
            ? cert.importoInvestito * cert.cedola / 100 / 12
            : cert.importoInvestito * cert.cedola / 100 / 4;
          
          events.push({
            date: currentDate,
            isin: cert.isin,
            nome: cert.nome,
            tipo: 'cedola',
            importo: importoCedola
          });
        }
        currentDate = addMonths(currentDate, interval);
      }
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [cashFlowActive, startDate]);

  // Raggruppamento per mese
  const monthlyAggregatedCashFlow = useMemo(() => {
    const grouped: { [key: string]: { total: number; events: CashFlowEvent[] } } = {};
    
    cashFlowEvents.forEach(event => {
      const key = format(event.date, 'yyyy-MM');
      if (!grouped[key]) {
        grouped[key] = { total: 0, events: [] };
      }
      grouped[key].total += event.importo;
      grouped[key].events.push(event);
    });
    
    return grouped;
  }, [cashFlowEvents]);

  // Totale cedole annuo
  const annualCashFlow = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return cashFlowEvents
      .filter(e => e.date.getFullYear() === currentYear)
      .reduce((sum, e) => sum + e.importo, 0);
  }, [cashFlowEvents]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // PDF Export function
  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Ordini Portafoglio - OF COURSE!!!!', margin, y);
    y += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Data: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: it })}`, margin, y);
    y += 15;
    
    // Portfolio Summary
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Riepilogo Portafoglio', margin, y);
    y += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Valore Totale: ${formatCurrency(totalPortfolioValue)}`, margin, y);
    y += 6;
    pdf.text(`Allocazione ETF: ${formatCurrency(totalETFValue)} (${etfAllocation}%)`, margin, y);
    y += 6;
    pdf.text(`Allocazione Certificates: ${formatCurrency(totalCertificatesValue)} (${certAllocation}%)`, margin, y);
    y += 15;
    
    // ETF Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ETF - Ordini di Acquisto', margin, y);
    y += 10;
    
    // ETF Table Header
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ISIN', margin, y);
    pdf.text('Nome', margin + 35, y);
    pdf.text('Importo', pageWidth - margin - 20, y, { align: 'right' });
    y += 2;
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
    
    // ETF Rows
    pdf.setFont('helvetica', 'normal');
    ETF_DATA.forEach((etf) => {
      pdf.text(etf.isin, margin, y);
      const truncatedName = etf.name.length > 40 ? etf.name.substring(0, 40) + '...' : etf.name;
      pdf.text(truncatedName, margin + 35, y);
      pdf.text(formatCurrency(etf.importo), pageWidth - margin - 20, y, { align: 'right' });
      y += 6;
    });
    
    y += 10;
    
    // Certificates Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Certificates - Ordini di Acquisto', margin, y);
    y += 10;
    
    // Certificates Table Header
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ISIN', margin, y);
    pdf.text('Emittente', margin + 35, y);
    pdf.text('Nome', margin + 60, y);
    pdf.text('Cedola', margin + 100, y);
    pdf.text('Importo', pageWidth - margin - 20, y, { align: 'right' });
    y += 2;
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
    
    // Certificates Rows
    pdf.setFont('helvetica', 'normal');
    CERTIFICATES_DATA.forEach((cert) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(cert.isin, margin, y);
      pdf.text(cert.emittente, margin + 35, y);
      pdf.text(cert.nome, margin + 60, y);
      pdf.text(cert.cedola > 0 ? `${cert.cedola}%` : '-', margin + 100, y);
      pdf.text(formatCurrency(cert.importoInvestito), pageWidth - margin - 20, y, { align: 'right' });
      y += 6;
    });
    
    y += 15;
    
    // Totals
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTALE ORDINI:', margin, y);
    pdf.text(formatCurrency(totalPortfolioValue), pageWidth - margin - 20, y, { align: 'right' });
    
    y += 20;
    
    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Documento generato automaticamente', margin, y);
    pdf.text('Per esecuzione ordini, contattare il proprio intermediario finanziario.', margin, y + 5);
    
    // Save PDF
    const fileName = `Ordini_Portafoglio_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
    toast.success('PDF generato', { description: fileName });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla home
        </Link>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Portafoglio ETF & Certificates – Income Strategy
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              {etfLastUpdated ? (
                <>
                  <Activity className="h-3.5 w-3.5 text-green-500" />
                  Prezzi live • {format(etfLastUpdated, 'HH:mm:ss', { locale: it })}
                </>
              ) : (
                <>Aggiornata Settimanale • {format(weeklyReport.lastUpdated, 'dd MMMM yyyy', { locale: it })}</>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshPrices}
              className="gap-2"
              disabled={etfLoading || certLoading}
            >
              <RefreshCw className={cn("h-4 w-4", (etfLoading || certLoading) && "animate-spin")} />
              Aggiorna Prezzi
            </Button>
            <Button 
              variant="default" 
              onClick={exportToPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Esporta PDF
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Valore Portafoglio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPortfolioValue)}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Allocazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                  ETF {etfAllocation}%
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                  Cert {certAllocation}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Yield Atteso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {cashFlowActive ? `${expectedYield}%` : '—'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Flusso Cedolare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Switch
                  checked={cashFlowActive}
                  onCheckedChange={setCashFlowActive}
                />
                <Badge variant={cashFlowActive ? 'default' : 'secondary'}>
                  {cashFlowActive ? 'ON' : 'OFF'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow Start Date */}
        {cashFlowActive && (
          <Card className="mb-8 bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Data inizio flusso cedolare:</span>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      {format(startDate, 'dd MMMM yyyy', { locale: it })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            setStartDate(date);
                            setCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="etf" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="etf">Allocazione ETF</TabsTrigger>
            <TabsTrigger value="certificates">Certificates & Cedole</TabsTrigger>
            <TabsTrigger value="market" className="relative">
              Analisi Mercato
              {matchResults.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {matchResults.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          {/* ETF Tab */}
          <TabsContent value="etf">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Allocazione ETF
                </CardTitle>
                <CardDescription>
                  Valore totale ETF: {formatCurrency(totalETFValue)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ISIN</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Prezzo</TableHead>
                        <TableHead className="text-right">Var %</TableHead>
                        <TableHead className="text-right">Importo</TableHead>
                        <TableHead className="text-right">Peso %</TableHead>
                        <TableHead>Ruolo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ETF_DATA.map((etf) => {
                        const priceData = etfPrices[etf.isin];
                        const hasPrice = priceData?.price !== null && priceData?.price !== undefined;
                        const changePercent = priceData?.changePercent;
                        const isPositive = changePercent && changePercent > 0;
                        const isNegative = changePercent && changePercent < 0;
                        
                        return (
                          <TableRow key={etf.isin}>
                            <TableCell className="font-mono text-sm">{etf.isin}</TableCell>
                            <TableCell>{etf.name}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {etfLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin inline" />
                              ) : hasPrice ? (
                                `€${priceData.price.toFixed(2)}`
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {hasPrice && changePercent !== null ? (
                                <span className={cn(
                                  "flex items-center justify-end gap-1 font-medium",
                                  isPositive && "text-green-600",
                                  isNegative && "text-red-600"
                                )}>
                                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                                  {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(etf.importo)}</TableCell>
                            <TableCell className="text-right font-semibold">{etf.weight}%</TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 cursor-help">
                                    <Badge variant="outline">{etf.role}</Badge>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-[280px]">
                                  <p className="text-sm">{ROLE_DESCRIPTIONS[etf.role] || etf.role}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Certificates & Cedole
                </CardTitle>
                <CardDescription>
                  Valore totale Certificates: {formatCurrency(totalCertificatesValue)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ISIN</TableHead>
                        <TableHead>Emittente</TableHead>
                        <TableHead className="text-right">Prezzo</TableHead>
                        <TableHead className="text-right">Var %</TableHead>
                        <TableHead className="text-right">Cedola %</TableHead>
                        <TableHead>Frequenza</TableHead>
                        <TableHead className="text-right">Barriera</TableHead>
                        <TableHead className="text-right">Investito</TableHead>
                        <TableHead className="text-right">Cedola/Periodo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CERTIFICATES_DATA.map((cert) => {
                        const cedolaPeriodo = cert.frequenza === 'Mensile' 
                          ? cert.importoInvestito * cert.cedola / 100 / 12
                          : cert.frequenza === 'Trimestrale'
                            ? cert.importoInvestito * cert.cedola / 100 / 4
                            : 0;
                        
                        const priceData = certPrices[cert.isin];
                        const hasPrice = priceData?.price !== null && priceData?.price !== undefined;
                        const changePercent = priceData?.changePercent;
                        const isPositive = changePercent && changePercent > 0;
                        const isNegative = changePercent && changePercent < 0;
                        
                        return (
                          <TableRow key={cert.isin}>
                            <TableCell className="font-mono text-sm">{cert.isin}</TableCell>
                            <TableCell>{cert.emittente}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {certLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin inline" />
                              ) : hasPrice ? (
                                `€${priceData.price.toFixed(2)}`
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {hasPrice && changePercent !== null ? (
                                <span className={cn(
                                  "flex items-center justify-end gap-1 font-medium",
                                  isPositive && "text-green-600",
                                  isNegative && "text-red-600"
                                )}>
                                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                                  {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {cert.cedola > 0 ? `${cert.cedola}%` : '—'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                cert.frequenza === 'Mensile' && 'bg-green-500/10 text-green-600 border-green-500/30',
                                cert.frequenza === 'Trimestrale' && 'bg-blue-500/10 text-blue-600 border-blue-500/30',
                                cert.frequenza === 'A scadenza' && 'bg-gray-500/10 text-gray-600 border-gray-500/30'
                              )}>
                                {cert.frequenza}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{cert.barriera}%</TableCell>
                            <TableCell className="text-right">{formatCurrency(cert.importoInvestito)}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {cedolaPeriodo > 0 ? formatCurrency(cedolaPeriodo) : '—'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashflow">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Calendario Cash Flow Certificati
                </CardTitle>
                <CardDescription>
                  {cashFlowActive 
                    ? `Cedole certificati anno corrente: ${formatCurrency(annualCashFlow)}`
                    : 'Attiva il flusso cedolare per visualizzare il calendario cedole certificati'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!cashFlowActive ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Attiva il toggle "Flusso Cedolare" per visualizzare il calendario</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(monthlyAggregatedCashFlow).slice(0, 12).map(([monthKey, data]) => (
                      <div key={monthKey} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-foreground">
                            {format(new Date(monthKey + '-01'), 'MMMM yyyy', { locale: it })}
                          </h4>
                          <Badge className="bg-green-600">
                            {formatCurrency(data.total)}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {data.events.map((event, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground flex justify-between">
                              <span>{event.nome}</span>
                              <span className="text-green-600">{formatCurrency(event.importo)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Report Settimanale
                      </CardTitle>
                      <CardDescription>
                        Last updated: {format(weeklyReport.lastUpdated, 'dd MMMM yyyy, HH:mm', { locale: it })}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Carica Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Rendimento Stimato</p>
                      <p className="text-2xl font-bold text-green-600">{weeklyReport.rendimentoStimato}%</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Profilo di Rischio</p>
                      <p className="text-2xl font-bold text-foreground">{weeklyReport.rischioPortafoglio}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Variazioni */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Variazioni della Settimana
                    </h4>
                    <div className="space-y-2">
                      {weeklyReport.variazioni.map((v, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Badge variant={v.tipo === 'Positivo' ? 'default' : 'secondary'} className={cn(
                            v.tipo === 'Positivo' && 'bg-green-600',
                            v.tipo === 'Negativo' && 'bg-red-600'
                          )}>
                            {v.tipo}
                          </Badge>
                          <span>{v.descrizione}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* AI Commentary */}
                  <div>
                    <h4 className="font-semibold mb-3">Weekly Portfolio Update (AI)</h4>
                    <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                      <p className="text-sm text-muted-foreground italic">
                        "{weeklyReport.commentoAI}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">Disclaimer</p>
                      <p>
                        Le informazioni contenute in questa pagina sono fornite a scopo puramente informativo 
                        e non costituiscono consulenza finanziaria, offerta o sollecitazione all'acquisto o 
                        vendita di strumenti finanziari. I rendimenti passati non sono indicativi di quelli futuri. 
                        Investire comporta rischi, inclusa la possibile perdita del capitale.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market">
            <div className="space-y-6">
              {/* Import Section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        Analisi Lista Certificati
                      </CardTitle>
                      <CardDescription>
                        Importa una lista PDF per confrontare con il portafoglio
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="gap-2"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileUp className="h-4 w-4" />
                        )}
                        {isAnalyzing ? 'Analisi in corso...' : 'Importa Lista PDF'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Results */}
              {matchResults.length > 0 && (
                <>
                  {/* Certificati in Portafoglio */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Certificati in Portafoglio
                      </CardTitle>
                      <CardDescription>
                        Confronto con i prezzi di mercato attuali
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {matchResults.filter(r => r.inPortfolio).map(result => (
                          <div key={result.isin} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex-1">
                              <p className="font-semibold">{result.nome}</p>
                              <p className="text-sm text-muted-foreground font-mono">{result.isin}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {result.marketAsk && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Ask</p>
                                  <p className="font-semibold">{result.marketAsk}%</p>
                                </div>
                              )}
                              {result.marketIRR && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">IRR</p>
                                  <p className="font-semibold">{result.marketIRR}%</p>
                                </div>
                              )}
                              <Badge 
                                variant={result.opportunity === 'hold' ? 'secondary' : 'default'}
                                className={cn(
                                  "min-w-[100px] justify-center",
                                  result.opportunity === 'buy' && 'bg-green-600 hover:bg-green-700',
                                  result.opportunity === 'close' && 'bg-red-600 hover:bg-red-700'
                                )}
                              >
                                {result.opportunity === 'hold' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {result.opportunity === 'buy' && <TrendingUp className="h-3 w-3 mr-1" />}
                                {result.opportunity === 'close' && <XCircle className="h-3 w-3 mr-1" />}
                                {result.opportunity === 'hold' ? 'OK' : result.opportunity === 'buy' ? 'Incrementare' : 'Chiudere'}
                              </Badge>
                              <div className="flex gap-1">
                                {result.opportunity === 'buy' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => createOrder(result.isin, result.nome, 'incremento')}
                                    className="text-green-600 border-green-600/50 hover:bg-green-600/10"
                                  >
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    Incrementa
                                  </Button>
                                )}
                                {result.opportunity === 'close' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => createOrder(result.isin, result.nome, 'vendita')}
                                    className="text-red-600 border-red-600/50 hover:bg-red-600/10"
                                  >
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                    Vendi
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nuove Opportunità */}
                  {matchResults.filter(r => !r.inPortfolio).length > 0 && (
                    <Card className="bg-green-500/5 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="h-5 w-5" />
                          Nuove Opportunità
                        </CardTitle>
                        <CardDescription>
                          Certificati con alto IRR non presenti in portafoglio
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {matchResults.filter(r => !r.inPortfolio).map(result => (
                            <div key={result.isin} className="flex items-center justify-between p-4 border border-green-500/30 rounded-lg bg-background">
                              <div className="flex-1">
                                <p className="font-semibold">{result.nome}</p>
                                <p className="text-sm text-muted-foreground font-mono">{result.isin}</p>
                                <p className="text-sm text-green-600 mt-1">{result.reason}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                {result.marketAsk && (
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Ask</p>
                                    <p className="font-semibold">{result.marketAsk}%</p>
                                  </div>
                                )}
                                {result.marketIRR && (
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">IRR</p>
                                    <p className="font-semibold text-green-600">{result.marketIRR}%</p>
                                  </div>
                                )}
                                <Button 
                                  size="sm"
                                  onClick={() => createOrder(result.isin, result.nome, 'acquisto')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Acquista
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Empty State */}
              {matchResults.length === 0 && !isAnalyzing && (
                <Card className="bg-muted/20 border-dashed">
                  <CardContent className="py-16">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        Nessuna analisi attiva
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Importa una lista PDF di certificati per analizzarla e confrontarla con il tuo portafoglio
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        Importa Lista PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Orders */}
              {pendingOrders.length > 0 && (
                <Card className="bg-amber-500/5 border-amber-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-amber-600">
                          <FileText className="h-5 w-5" />
                          Ordini in Attesa ({pendingOrders.length})
                        </CardTitle>
                        <CardDescription>
                          Conferma per inviare la disposizione alla banca
                        </CardDescription>
                      </div>
                      <Button onClick={confirmOrders} className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Conferma e Invia Disposizione
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pendingOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                          <div className="flex items-center gap-3">
                            <Badge className={cn(
                              order.tipo === 'acquisto' && 'bg-green-600',
                              order.tipo === 'vendita' && 'bg-red-600',
                              order.tipo === 'incremento' && 'bg-blue-600'
                            )}>
                              {order.tipo.toUpperCase()}
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">{order.nome}</p>
                              <p className="text-xs text-muted-foreground font-mono">{order.isin}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeOrder(order.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Wrapped component with access gate
const ETFCertificatesPortfolioPage = () => (
  <ETFPortfolioAccessGate>
    <ETFCertificatesPortfolio />
  </ETFPortfolioAccessGate>
);

export default ETFCertificatesPortfolioPage;
