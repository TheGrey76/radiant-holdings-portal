import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Shield, BarChart3, DollarSign, Target, Calendar, Percent, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { GUPortfolioAccessGate } from "@/components/GUPortfolioAccessGate";

const StructuredProductsGU = () => {
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
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-slate-200 shadow-sm">
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
        </div>
      </section>

      {/* Instruments Included - Final Selection */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Instruments Included — Final Selection</h2>
            <p className="text-slate-600 text-lg">Five certificates with complementary roles</p>
          </div>

          <div className="space-y-6">
            {/* Instrument A - Morgan Stanley Phoenix */}
            <Card className="border-l-4 border-l-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-slate-700 text-white">A</Badge>
                      <span className="text-sm text-slate-500 font-mono">DE000MS0H1P0</span>
                      <a 
                        href="https://www.boerse-frankfurt.de/certificate/DE000MS0H1P0" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Real-Time Price
                      </a>
                    </div>
                    <CardTitle className="text-xl text-slate-900">Morgan Stanley Phoenix "Mixed Basket"</CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600">
                      Primary cash-flow generator, high structural quality
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-slate-300 text-slate-700">Phoenix Worst-of</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Underlyings</p>
                    <p className="font-semibold text-slate-900">Enel, Alphabet (GOOGL), UniCredit</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Coupon</p>
                    <p className="font-semibold text-slate-900">2.33% quarterly</p>
                    <p className="text-sm text-slate-600">(9.32% annual)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Barriers</p>
                    <p className="font-semibold text-slate-900">65% / 65%</p>
                    <p className="text-sm text-slate-600">Coupon / Capital</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Maturity</p>
                    <p className="font-semibold text-slate-900">27 Nov 2030</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Memory</Badge>
                    <Badge variant="secondary" className="text-xs">European Barrier</Badge>
                    <span className="text-sm text-slate-600 ml-2">Role: <span className="font-semibold">Core Income</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument B - UBS Phoenix Healthcare */}
            <Card className="border-l-4 border-l-blue-600 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600">B</Badge>
                      <span className="text-sm text-slate-500 font-mono">DE000UQ23YT1</span>
                      <a 
                        href="https://www.boerse-frankfurt.de/certificate/DE000UQ23YT1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Real-Time Price
                      </a>
                    </div>
                    <CardTitle className="text-xl text-slate-900">UBS Phoenix "Healthcare Basket"</CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600">
                      Defensive thematic income with strong sector fundamentals
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">Phoenix Memory</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Underlyings</p>
                    <p className="font-semibold text-slate-900">Novo Nordisk, Merck KGaA, CVS Health</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Coupon</p>
                    <p className="font-semibold text-slate-900">2.50% quarterly</p>
                    <p className="text-sm text-slate-600">(10% annual)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Barriers</p>
                    <p className="font-semibold text-slate-900">60% / 60%</p>
                    <p className="text-sm text-slate-600">Coupon / Capital</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Maturity</p>
                    <p className="font-semibold text-slate-900">13 Nov 2028</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Memory</Badge>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Healthcare</Badge>
                    <span className="text-sm text-slate-600 ml-2">Role: <span className="font-semibold">Defensive Income</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument C - UBS Memory Cash Collect */}
            <Card className="border-l-4 border-l-emerald-600 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-600">C</Badge>
                      <span className="text-sm text-slate-500 font-mono">DE000UQ0LUM5</span>
                      <a 
                        href="https://www.boerse-frankfurt.de/certificate/DE000UQ0LUM5" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Real-Time Price
                      </a>
                    </div>
                    <CardTitle className="text-xl text-slate-900">UBS Memory Cash Collect (Monthly)</CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600">
                      High-yield income engine with monthly cash flow
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">Memory Cash Collect</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Underlyings</p>
                    <p className="font-semibold text-slate-900">Diversified Italian Large Caps</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Coupon</p>
                    <p className="font-semibold text-slate-900">1% monthly</p>
                    <p className="text-sm text-slate-600">(12% annual)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Barriers</p>
                    <p className="font-semibold text-slate-900">65% / 65%</p>
                    <p className="text-sm text-slate-600">Coupon / Capital</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Maturity</p>
                    <p className="font-semibold text-slate-900">09 Sep 2030</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Memory</Badge>
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">Monthly Payout</Badge>
                    <span className="text-sm text-slate-600 ml-2">Role: <span className="font-semibold">Income Engine</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument D - Barclays Phoenix Italy Consumer & Luxury */}
            <Card className="border-l-4 border-l-amber-600 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-amber-600">D</Badge>
                      <span className="text-sm text-slate-500 font-mono">XS3153270833</span>
                      <a 
                        href="https://www.boerse-stuttgart.de/en/certificates/XS3153270833" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Real-Time Price
                      </a>
                    </div>
                    <CardTitle className="text-xl text-slate-900">Barclays Phoenix "Italy Consumer & Luxury"</CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600">
                      Premium consumer/luxury exposure, low event risk
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">Phoenix Memory</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Underlyings</p>
                    <p className="font-semibold text-slate-900">Ferrari, Brunello Cucinelli, Campari</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Coupon</p>
                    <p className="font-semibold text-slate-900">2% quarterly</p>
                    <p className="text-sm text-slate-600">(8% annual)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Barriers</p>
                    <p className="font-semibold text-slate-900">65%</p>
                    <p className="text-sm text-slate-600">Unified</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Maturity</p>
                    <p className="font-semibold text-slate-900">22 Oct 2029</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Memory</Badge>
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">Luxury / Consumer</Badge>
                    <span className="text-sm text-slate-600 ml-2">Role: <span className="font-semibold">Thematic Exposure</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument E - Barclays Capital Protected */}
            <Card className="border-l-4 border-l-green-600 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600">E</Badge>
                      <span className="text-sm text-slate-500 font-mono">XS3153397073</span>
                      <a 
                        href="https://www.boerse-stuttgart.de/en/certificates/XS3153397073" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Real-Time Price
                      </a>
                    </div>
                    <CardTitle className="text-xl text-slate-900">Barclays Capital Protected "KG on Indices"</CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600">
                      Defensive anchor, stabilizer of portfolio volatility
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700">Capital Protected</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Underlyings</p>
                    <p className="font-semibold text-slate-900">NDX, NKY, SMI, Euro Stoxx Banks</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Capital Protection</p>
                    <p className="font-semibold text-green-700">100% at maturity</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Participation</p>
                    <p className="font-semibold text-slate-900">100% up to +50% cap</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Maturity</p>
                    <p className="font-semibold text-slate-900">24 Oct 2030</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">No Coupon</Badge>
                    <Badge variant="secondary" className="text-xs">CPPI-style</Badge>
                    <span className="text-sm text-slate-600 ml-2">Role: <span className="font-semibold">Portfolio Stabilizer</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Allocation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Portfolio Allocation</h2>
            <p className="text-slate-600 text-lg">EUR 400,000 Total</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Table */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Breakdown by Instrument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">A — Morgan Stanley Phoenix</p>
                    <p className="text-sm text-slate-600">DE000MS0H1P0</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-700">30%</p>
                    <p className="text-sm text-slate-600">€120,000</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-semibold text-slate-900">B — UBS Phoenix Healthcare</p>
                    <p className="text-sm text-slate-600">DE000UQ23YT1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-700">20%</p>
                    <p className="text-sm text-slate-600">€80,000</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <p className="font-semibold text-slate-900">C — UBS Memory Cash Collect</p>
                    <p className="text-sm text-slate-600">DE000UQ0LUM5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-700">20%</p>
                    <p className="text-sm text-slate-600">€80,000</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-semibold text-slate-900">D — Barclays Luxury/Consumer</p>
                    <p className="text-sm text-slate-600">XS3153270833</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-700">15%</p>
                    <p className="text-sm text-slate-600">€60,000</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-semibold text-slate-900">E — Barclays Capital Protected</p>
                    <p className="text-sm text-slate-600">XS3153397073</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">15%</p>
                    <p className="text-sm text-slate-600">€60,000</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-900">Total Portfolio</p>
                    <p className="text-2xl font-bold text-slate-900">€400,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Split */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Strategic Split</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Core Income (A + B)</span>
                    <span className="text-sm font-bold text-slate-900">50%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-slate-600 to-blue-600" style={{ width: '50%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Morgan Stanley + UBS Healthcare</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">High-Yield Engine (C)</span>
                    <span className="text-sm font-bold text-slate-900">20%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">UBS Monthly Cash Collect</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Premium Thematic (D)</span>
                    <span className="text-sm font-bold text-slate-900">15%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600" style={{ width: '15%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Luxury & Consumer</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Capital Protected (E)</span>
                    <span className="text-sm font-bold text-slate-900">15%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: '15%' }}></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">100% Protection Layer</p>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The portfolio balances <span className="font-semibold text-slate-900">regular coupon income</span> (85% of allocation) 
                    with <span className="font-semibold text-slate-900">full capital protection</span> (15%) to ensure downside 
                    resilience while maintaining attractive yield potential.
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
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-slate-600">
            © 2025 ARIES76 Capital Intelligence | Confidential Portfolio Presentation — Client G.U.
          </p>
        </div>
      </section>
    </div>
    </GUPortfolioAccessGate>
  );
};

export default StructuredProductsGU;