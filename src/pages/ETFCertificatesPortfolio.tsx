import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, TrendingUp, CalendarDays, FileText, 
  PieChart, DollarSign, AlertTriangle, Calendar as CalendarIcon,
  Upload, RefreshCw, ArrowLeft
} from 'lucide-react';
import { format, addMonths, startOfMonth, isBefore, isAfter, isSameMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ETF Data
const ETF_DATA = [
  { isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World UCITS ETF', weight: 25, role: 'Core Equity' },
  { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500 UCITS ETF', weight: 15, role: 'US Large Cap' },
  { isin: 'IE00BZ163G84', name: 'Vanguard EUR Corporate Bond UCITS ETF', weight: 20, role: 'Fixed Income' },
  { isin: 'IE00B4WXJJ64', name: 'iShares Core EUR Govt Bond UCITS ETF', weight: 15, role: 'Govt Bonds' },
  { isin: 'IE00B1XNHC34', name: 'iShares Global High Yield Corp Bond UCITS ETF', weight: 10, role: 'High Yield' },
  { isin: 'IE00BKM4GZ66', name: 'iShares Core EM IMI UCITS ETF', weight: 10, role: 'Emerging Markets' },
  { isin: 'LU0290358497', name: 'Xtrackers Physical Gold ETC', weight: 5, role: 'Commodity Hedge' },
];

// Certificates Data
const CERTIFICATES_DATA = [
  { 
    isin: 'DE000MS0H1P0', 
    emittente: 'Morgan Stanley', 
    nome: 'Phoenix Mixed Basket',
    cedola: 9.32, 
    frequenza: 'Trimestrale', 
    barriera: 65,
    importoInvestito: 6000,
    dataEmissione: new Date(2024, 10, 15),
    scadenza: new Date(2027, 10, 15)
  },
  { 
    isin: 'DE000UQ23YT1', 
    emittente: 'UBS', 
    nome: 'Phoenix Healthcare Basket',
    cedola: 10.0, 
    frequenza: 'Trimestrale', 
    barriera: 60,
    importoInvestito: 4000,
    dataEmissione: new Date(2024, 10, 13),
    scadenza: new Date(2028, 10, 13)
  },
  { 
    isin: 'DE000UQ0LUM5', 
    emittente: 'UBS', 
    nome: 'Memory Cash Collect Monthly',
    cedola: 12.0, 
    frequenza: 'Mensile', 
    barriera: 65,
    importoInvestito: 4000,
    dataEmissione: new Date(2024, 9, 20),
    scadenza: new Date(2027, 9, 20)
  },
  { 
    isin: 'XS3153270833', 
    emittente: 'Barclays', 
    nome: 'Phoenix Italy Consumer & Luxury',
    cedola: 8.0, 
    frequenza: 'Trimestrale', 
    barriera: 65,
    importoInvestito: 3000,
    dataEmissione: new Date(2024, 11, 1),
    scadenza: new Date(2028, 11, 1)
  },
  { 
    isin: 'XS3153397073', 
    emittente: 'Barclays', 
    nome: 'Capital Protected',
    cedola: 0, 
    frequenza: 'A scadenza', 
    barriera: 100,
    importoInvestito: 3000,
    dataEmissione: new Date(2024, 11, 1),
    scadenza: new Date(2029, 11, 1)
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

  // Calcoli portafoglio
  const totalETFValue = 10000; // Valore ETF
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla home
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Portafoglio ETF & Certificates – Income Strategy
          </h1>
          <p className="text-muted-foreground mt-2">
            Aggiornata Settimanale • Ultimo aggiornamento: {format(weeklyReport.lastUpdated, 'dd MMMM yyyy', { locale: it })}
          </p>
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
                      onSelect={(date) => {
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="etf">Allocazione ETF</TabsTrigger>
            <TabsTrigger value="certificates">Certificates & Cedole</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="report">Report Settimanale</TabsTrigger>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ISIN</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Peso %</TableHead>
                      <TableHead>Ruolo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ETF_DATA.map((etf) => (
                      <TableRow key={etf.isin}>
                        <TableCell className="font-mono text-sm">{etf.isin}</TableCell>
                        <TableCell>{etf.name}</TableCell>
                        <TableCell className="text-right font-semibold">{etf.weight}%</TableCell>
                        <TableCell>
                          <Badge variant="outline">{etf.role}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                        
                        return (
                          <TableRow key={cert.isin}>
                            <TableCell className="font-mono text-sm">{cert.isin}</TableCell>
                            <TableCell>{cert.emittente}</TableCell>
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
                  Calendario Cash Flow
                </CardTitle>
                <CardDescription>
                  {cashFlowActive 
                    ? `Cedole totali anno corrente: ${formatCurrency(annualCashFlow)}`
                    : 'Attiva il flusso cedolare per visualizzare il calendario'
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
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ETFCertificatesPortfolio;
