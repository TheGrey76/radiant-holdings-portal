import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, TrendingUp, Shield, BarChart3, DollarSign, Target, Calendar, Percent, ExternalLink, Activity, RefreshCcw, FileText, AlertTriangle, Save, Loader2, History, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GUPortfolioAccessGate } from "@/components/GUPortfolioAccessGate";
import { CertificateListManager, Certificate } from "@/components/CertificateListManager";
import { PortfolioPDFExport } from "@/components/PortfolioPDFExport";
import { PortfolioChangeHistory } from "@/components/PortfolioChangeHistory";
import { PortfolioInstrumentsList } from "@/components/PortfolioInstrumentsList";
import { usePortfolioGU } from "@/hooks/usePortfolioGU";
import { toast } from "sonner";

const StructuredProductsGU = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [replacingCert, setReplacingCert] = useState<{ isin: string; positionLabel: string; name: string } | null>(null);
  const [selectedReplacement, setSelectedReplacement] = useState<Certificate | null>(null);

  const { portfolio, loading: portfolioLoading, saving, replaceCertificate, refetch } = usePortfolioGU();

  const handleStartReplacement = (isin: string, positionLabel: string, name: string) => {
    setReplacingCert({ isin, positionLabel, name });
    setActiveTab("certificates");
    toast.info(`Seleziona un certificato per sostituire ${name}`);
  };

  const handleSelectReplacement = (cert: Certificate) => {
    setSelectedReplacement(cert);
    toast.success(`Selezionato: ${cert.theme} (${cert.isin})`);
    setActiveTab("portfolio");
  };

  const handleSaveReplacement = async () => {
    if (!selectedReplacement || !replacingCert) return;

    const success = await replaceCertificate({
      positionLabel: replacingCert.positionLabel,
      oldIsin: replacingCert.isin,
      oldName: replacingCert.name,
      newCertificate: {
        isin: selectedReplacement.isin,
        issuer: selectedReplacement.issuer,
        name: selectedReplacement.theme,
        couponPa: selectedReplacement.couponPa,
        couponFrequency: selectedReplacement.couponFrequency,
        couponBarrier: selectedReplacement.couponBarrier,
        capitalBarrier: selectedReplacement.capitalBarrier,
        maturity: selectedReplacement.maturity,
        underlyings: selectedReplacement.underlyings
      },
      reason: `Certificate ${replacingCert.isin} replaced on ${new Date().toLocaleDateString('it-IT')}`
    });

    if (success) {
      setReplacingCert(null);
      setSelectedReplacement(null);
      refetch(); // Refresh portfolio data
    }
  };
  return (
    <GUPortfolioAccessGate>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <Badge variant="outline" className="text-sm px-4 py-1.5 border-slate-400 text-slate-300">
              Institutional Portfolio Factsheet
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Structured Products Portfolio
            </h1>
            <p className="text-xl text-slate-300 font-light">
              Client G.U. — Allocation on EUR 400,000
            </p>
            <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link to="/underlying-monitoring">
                <Button variant="outline" className="border-slate-400 text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Activity className="h-4 w-4 mr-2" />
                  Monitoring Sottostanti
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-amber-400 text-amber-300 hover:bg-amber-700 hover:text-white"
                onClick={() => {
                  // Find first certificate to offer replacement
                  if (portfolio?.holdings?.[0]) {
                    const h = portfolio.holdings[0];
                    handleStartReplacement(h.isin, h.position_label, h.name);
                  }
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Ribilancia Portafoglio
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alert Banner for Replacement */}
      {replacingCert && (
        <section className="py-4 px-4 bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span className="text-amber-800">
                  <strong>Sostituzione in corso:</strong> Certificato {replacingCert.isin} ({replacingCert.name}) — Posizione {replacingCert.positionLabel}
                  {selectedReplacement && (
                    <span className="ml-2 text-emerald-700">
                      → Sostituto: <strong>{selectedReplacement.theme}</strong> ({selectedReplacement.isin})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedReplacement && (
                  <Button 
                    onClick={handleSaveReplacement} 
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salva Sostituzione
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => { setReplacingCert(null); setSelectedReplacement(null); }}>
                  Annulla
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Action Bar with PDF Export */}
      {portfolio && !replacingCert && (
        <section className="py-4 px-4 bg-slate-100 border-b border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <History className="h-4 w-4" />
                <span>Ultimo aggiornamento: {new Date(portfolio.updated_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <PortfolioPDFExport portfolio={portfolio} variant="default" size="sm" />
            </div>
          </div>
        </section>
      )}

      {/* Tabs for Portfolio vs Certificate List */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Portafoglio
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Certificati
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Storico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="certificates">
              <CertificateListManager 
                replacingIsin={replacingCert?.isin || undefined}
                onSelectReplacement={handleSelectReplacement}
              />
            </TabsContent>

            <TabsContent value="history">
              <PortfolioChangeHistory portfolioId={portfolio?.id || null} />
            </TabsContent>

            <TabsContent value="portfolio">
      {/* Introduction */}
      <Card className="border-slate-200 shadow-sm mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-7 w-7 text-slate-700" />
                <CardTitle className="text-2xl text-slate-900">Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-slate-700">
              <p>
                This portfolio is constructed using <span className="font-semibold text-slate-900">five high-quality listed certificates</span> selected through a comprehensive market scan across European structured products exchanges.
              </p>
              <p>
                The allocation strategy is designed to achieve three core objectives:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <DollarSign className="h-5 w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Sustainable Income Generation</p>
                    <p className="text-sm text-slate-600 mt-1">Consistent coupon flows from memory structures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Shield className="h-5 w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Controlled Downside Risk</p>
                    <p className="text-sm text-slate-600 mt-1">Defensive barriers and capital protection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <BarChart3 className="h-5 w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Diversification</p>
                    <p className="text-sm text-slate-600 mt-1">Multiple issuers, sectors, and structures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Instruments Included - Dynamic from Database */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Strumenti in Portafoglio</h2>
            <p className="text-slate-600 text-lg">
              {portfolio?.holdings?.length || 0} certificati — Allocazione EUR {portfolio?.total_value?.toLocaleString() || '400,000'}
            </p>
          </div>

          <PortfolioInstrumentsList 
            holdings={portfolio?.holdings || []}
            loading={portfolioLoading}
            onStartReplacement={handleStartReplacement}
          />
        </div>
      </section>

      {/* Portfolio Allocation - Dynamic */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Allocazione Portafoglio</h2>
            <p className="text-slate-600 text-lg">EUR {portfolio?.total_value?.toLocaleString() || '400,000'} Totale</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Table - Dynamic */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Ripartizione per Strumento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio?.holdings?.map((holding) => {
                  const bgColors: Record<string, string> = {
                    'A': 'bg-slate-50 border-slate-200',
                    'B': 'bg-blue-50 border-blue-200',
                    'C': 'bg-emerald-50 border-emerald-200',
                    'D': 'bg-amber-50 border-amber-200',
                    'E': 'bg-green-50 border-green-200',
                  };
                  const textColors: Record<string, string> = {
                    'A': 'text-slate-700',
                    'B': 'text-blue-700',
                    'C': 'text-emerald-700',
                    'D': 'text-amber-700',
                    'E': 'text-green-700',
                  };
                  return (
                    <div 
                      key={holding.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${bgColors[holding.position_label] || bgColors['A']}`}
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{holding.position_label} — {holding.issuer} {holding.name}</p>
                        <p className="text-sm text-slate-600">{holding.isin}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${textColors[holding.position_label] || textColors['A']}`}>
                          {holding.allocation_percent}%
                        </p>
                        <p className="text-sm text-slate-600">€{holding.allocation_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-slate-300">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-900">Totale Portafoglio</p>
                    <p className="text-2xl font-bold text-slate-900">€{portfolio?.total_value?.toLocaleString() || '400,000'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Split - Dynamic */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Ripartizione Strategica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolio?.holdings?.map((holding) => {
                  const colors: Record<string, string> = {
                    'A': 'bg-slate-600',
                    'B': 'bg-blue-600',
                    'C': 'bg-emerald-600',
                    'D': 'bg-amber-600',
                    'E': 'bg-green-600',
                  };
                  return (
                    <div key={holding.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{holding.role || holding.name}</span>
                        <span className="text-sm font-bold text-slate-900">{holding.allocation_percent}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[holding.position_label] || colors['A']}`} 
                          style={{ width: `${holding.allocation_percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{holding.issuer} — {holding.underlyings}</p>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-slate-300">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Portafoglio dinamico con <span className="font-semibold text-slate-900">tracking completo</span> delle modifiche. 
                    Ogni sostituzione viene registrata nello storico per una visione completa dell'evoluzione del portafoglio.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cash Flow Overview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Cash Flow Overview</h2>
            <p className="text-slate-600 text-lg">Base case income expectations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Annual Income Potential */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-slate-700" />
                  <CardTitle className="text-slate-900">Annual Income Potential</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-700">A — Morgan Stanley</p>
                      <p className="text-xs text-slate-500">€120k × 9.32%</p>
                    </div>
                    <p className="font-bold text-slate-900">€11,184</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <div>
                      <p className="text-sm font-medium text-slate-700">B — UBS Healthcare</p>
                      <p className="text-xs text-slate-500">€80k × 10%</p>
                    </div>
                    <p className="font-bold text-slate-900">€8,000</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded border border-emerald-200">
                    <div>
                      <p className="text-sm font-medium text-slate-700">C — UBS Cash Collect</p>
                      <p className="text-xs text-slate-500">€80k × 12%</p>
                    </div>
                    <p className="font-bold text-slate-900">€9,600</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded border border-amber-200">
                    <div>
                      <p className="text-sm font-medium text-slate-700">D — Barclays Luxury</p>
                      <p className="text-xs text-slate-500">€60k × 8%</p>
                    </div>
                    <p className="font-bold text-slate-900">€4,800</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                    <div>
                      <p className="text-sm font-medium text-slate-700">E — Barclays Protected</p>
                      <p className="text-xs text-slate-500">No income (capital-protected)</p>
                    </div>
                    <p className="font-bold text-slate-900">€0</p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-300">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">Total Annual Income</p>
                    <p className="text-2xl font-bold text-slate-900">€33,584</p>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    * Assuming all coupon barriers are met throughout observation periods
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quarterly vs Monthly Flow */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-slate-700" />
                  <CardTitle className="text-slate-900">Payment Frequency</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Monthly Coupons</h4>
                    <Badge className="bg-emerald-600">20%</Badge>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Instrument C</span> — UBS Memory Cash Collect
                    </p>
                    <p className="text-xs text-slate-600 mt-1">1% monthly (€800 per month)</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Quarterly Coupons</h4>
                    <Badge className="bg-slate-600">65%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <p className="text-sm text-slate-700"><span className="font-semibold">Instrument A</span> — Morgan Stanley</p>
                      <p className="text-xs text-slate-600">2.33% quarterly (€2,796 per quarter)</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-slate-700"><span className="font-semibold">Instrument B</span> — UBS Healthcare</p>
                      <p className="text-xs text-slate-600">2.50% quarterly (€2,000 per quarter)</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded border border-amber-200">
                      <p className="text-sm text-slate-700"><span className="font-semibold">Instrument D</span> — Barclays Luxury</p>
                      <p className="text-xs text-slate-600">2% quarterly (€1,200 per quarter)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Final Payoff Only</h4>
                    <Badge className="bg-green-600">15%</Badge>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Instrument E</span> — Barclays Capital Protected
                    </p>
                    <p className="text-xs text-slate-600 mt-1">No coupons, 100% protection + participation at maturity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Management Structure */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Risk Management Structure</h2>
            <p className="text-slate-600 text-lg">Multi-layered approach to downside protection</p>
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-700" />
                      <p className="font-semibold text-slate-900">15% Fully Capital Protected</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Barclays CPPI-style note ensures 100% capital return at maturity regardless of market performance
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-700" />
                      <p className="font-semibold text-slate-900">50% High-Quality Phoenix</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Morgan Stanley and UBS Phoenix structures with memory features and defensive 60-65% barriers
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-emerald-700" />
                      <p className="font-semibold text-slate-900">20% Monthly Cash Collect</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      UBS structure with 65% barriers providing regular monthly income with memory protection
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-amber-700" />
                      <p className="font-semibold text-slate-900">15% Luxury/Consumer Exposure</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Premium Italian brands with strong pricing power and defensive business models
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Issuer Diversification</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-slate-400 text-slate-700">Morgan Stanley</Badge>
                    <Badge variant="outline" className="border-slate-400 text-slate-700">UBS (2 products)</Badge>
                    <Badge variant="outline" className="border-slate-400 text-slate-700">Barclays (2 products)</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    Three globally systemically important banks (G-SIBs) ensure issuer credit quality and regulatory oversight
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">Overall Risk Profile</span>
                      <span className="text-sm font-medium text-slate-600">Moderate / Balanced</span>
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600" 
                        style={{ width: '100%' }}
                      ></div>
                      <div 
                        className="relative -mt-4 ml-[50%] w-1 h-4 bg-slate-900"
                        style={{ transform: 'translateX(-50%)' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Low Risk</span>
                      <span>Moderate</span>
                      <span>High Risk</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The portfolio is positioned as <span className="font-semibold text-slate-900">moderate risk</span>, 
                    balancing income generation with downside protection through capital-protected components, 
                    defensive barriers (60-65%), and issuer diversification across institutional-grade counterparties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-white">Executive Summary for Client G.U.</h2>
            <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
          </div>

          <Card className="shadow-lg bg-slate-800/50 border-slate-700">
            <CardContent className="pt-8 space-y-6 text-slate-200">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-base leading-relaxed">
                    The portfolio is designed to target <span className="font-semibold text-white">stable recurring income</span>, 
                    controlled volatility, and meaningful sector diversification across five institutional-grade 
                    structured products.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-base leading-relaxed">
                    Income expectations exceed <span className="font-semibold text-white">€33,000 per year</span> in 
                    normal market conditions, with monthly and quarterly cash flows providing liquidity flexibility.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-base leading-relaxed">
                    Downside risk is mitigated through <span className="font-semibold text-white">defensive barriers 
                    (60-65%)</span> on all income-generating certificates and a <span className="font-semibold text-white">15% 
                    fully capital-protected component</span> providing portfolio stability.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-base leading-relaxed">
                    The allocation is suitable for investors seeking <span className="font-semibold text-white">recurring 
                    coupon flows</span> combined with <span className="font-semibold text-white">disciplined risk 
                    management</span>, institutional-grade issuers, and exposure to high-quality sectors including 
                    healthcare, luxury consumer, and diversified large-cap equities.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-400 text-center">
                  This presentation is provided for informational purposes only and does not constitute investment advice. 
                  Past performance is not indicative of future results. Please review all offering documentation before investing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Note */}
      <div className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-slate-600">
            © 2025 ARIES76 Capital Intelligence | Confidential Portfolio Presentation — Client G.U.
          </p>
        </div>
      </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
    </GUPortfolioAccessGate>
  );
};

export default StructuredProductsGU;