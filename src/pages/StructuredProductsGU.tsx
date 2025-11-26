import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Shield, BarChart3, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const StructuredProductsGU = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <Badge variant="outline" className="text-base px-6 py-2 border-primary/30">
              Institutional Portfolio Factsheet
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Structured Products Portfolio
            </h1>
            <p className="text-2xl text-muted-foreground font-light">
              Client G.U.
            </p>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Portfolio Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl">Portfolio Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed">
              <p className="text-muted-foreground">
                This portfolio presents a sophisticated structured-products allocation built on{" "}
                <span className="font-semibold text-foreground">five listed certificates</span> across European markets. 
                The selection includes multiple ISIN instruments strategically allocated to balance{" "}
                <span className="font-semibold text-foreground">income generation</span>,{" "}
                <span className="font-semibold text-foreground">conditional capital protection</span>,{" "}
                <span className="font-semibold text-foreground">sector diversification</span> (technology, energy, utilities), 
                and <span className="font-semibold text-foreground">long-term stability</span>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Income Generation</p>
                    <p className="text-sm text-muted-foreground">Quarterly coupons with Memory features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Capital Protection</p>
                    <p className="text-sm text-muted-foreground">100% protection on defensive anchor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Sector Diversification</p>
                    <p className="text-sm text-muted-foreground">Tech, Energy, Utilities, Financials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Autocall Optionality</p>
                    <p className="text-sm text-muted-foreground">Early redemption opportunities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Instruments Included */}
      <section className="py-16 px-4 bg-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Instruments Included</h2>
            <p className="text-muted-foreground text-lg">Key characteristics and strategic roles</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Instrument 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">DE000MS0H1P0 – Morgan Stanley Phoenix Mixed Basket</CardTitle>
                    <CardDescription className="text-base mt-2">Primary Income Generator</CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit">Phoenix Worst-Of</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Basket</p>
                    <p className="font-semibold">Enel, Alphabet (GOOGL), UniCredit</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Maturity</p>
                    <p className="font-semibold">27.11.2030</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Coupon</p>
                    <p className="font-semibold">2.33% quarterly (9.32% p.a.)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Coupon Barrier</p>
                    <p className="font-semibold">65%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Capital Barrier</p>
                    <p className="font-semibold">65% European</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Memory Feature</p>
                    <p className="font-semibold text-primary">Yes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument 2 */}
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">XS3153397073 – Barclays Capital Protected "KG on Indices"</CardTitle>
                    <CardDescription className="text-base mt-2">Defensive Anchor & Portfolio Stabilizer</CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit">Capital Protected</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Underlyings</p>
                    <p className="font-semibold">NDX, NKY, SMI, SX7E</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Maturity</p>
                    <p className="font-semibold">24.10.2030</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Capital Protection</p>
                    <p className="font-semibold text-green-600">100% at maturity</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Participation</p>
                    <p className="font-semibold">100% up to 50% cap</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Coupon</p>
                    <p className="font-semibold">None</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">CPPI-style</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument 3 */}
            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">XS3188986858 – Barclays AutoCallable (Tech/AI Basket)</CardTitle>
                    <CardDescription className="text-base mt-2">High-Beta Growth Component</CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit">Autocallable</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Market</p>
                    <p className="font-semibold">EuroTLX</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Underlyings</p>
                    <p className="font-semibold">AMD, Tesla, Nvidia, Antw</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Structure</p>
                    <p className="font-semibold">Autocallable with Memory</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Sector Focus</p>
                    <p className="font-semibold">Technology / AI</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Risk Profile</p>
                    <p className="font-semibold text-orange-600">High Beta</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Potential</p>
                    <p className="font-semibold text-primary">High Coupons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instrument 4 */}
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">XS3189071965 – Barclays AutoCallable (Energy/Utilities Basket)</CardTitle>
                    <CardDescription className="text-base mt-2">Sector-Balanced Income Enhancer</CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit">Autocallable</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Market</p>
                    <p className="font-semibold">EuroTLX</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Underlyings</p>
                    <p className="font-semibold">Constellation, Engie, ENI, Total</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Structure</p>
                    <p className="font-semibold">Autocallable with Memory</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Sector Focus</p>
                    <p className="font-semibold">Energy / Utilities</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Risk Profile</p>
                    <p className="font-semibold text-yellow-600">Moderate</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-semibold">Income + Diversification</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Proposed Allocation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Proposed Allocation</h2>
            <p className="text-muted-foreground text-lg">Strategic balance across €100,000 portfolio</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Table */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold">MS Phoenix (DE000MS0H1P0)</p>
                      <p className="text-sm text-muted-foreground">Income Generator</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">40%</p>
                      <p className="text-sm text-muted-foreground">€40,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-600/5 rounded-lg border border-blue-600/20">
                    <div>
                      <p className="font-semibold">Barclays CPPI (XS3153397073)</p>
                      <p className="text-sm text-muted-foreground">Capital Protected</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">20%</p>
                      <p className="text-sm text-muted-foreground">€20,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-600/5 rounded-lg border border-purple-600/20">
                    <div>
                      <p className="font-semibold">Barclays Tech/AI (XS3188986858)</p>
                      <p className="text-sm text-muted-foreground">High Beta Growth</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">20%</p>
                      <p className="text-sm text-muted-foreground">€20,000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-600/5 rounded-lg border border-green-600/20">
                    <div>
                      <p className="font-semibold">Barclays Energy (XS3189071965)</p>
                      <p className="text-sm text-muted-foreground">Sector Balance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">20%</p>
                      <p className="text-sm text-muted-foreground">€20,000</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Total Portfolio</p>
                    <p className="text-2xl font-bold">€100,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Income Generation</span>
                      <span className="text-sm font-semibold text-primary">40%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '40%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Predictable quarterly cash flows</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Capital Protection</span>
                      <span className="text-sm font-semibold text-blue-600">20%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '20%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">100% principal guarantee at maturity</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Autocall Optionality</span>
                      <span className="text-sm font-semibold text-purple-600">40%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: '40%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">High-yield + early redemption potential</p>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Key Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Diversified issuer exposure (Morgan Stanley, Barclays)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Partial capital protection reduces downside risk</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Multi-sector allocation (Tech, Energy, Financials, Utilities)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cash Flow Analysis */}
      <section className="py-16 px-4 bg-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cash Flow Analysis</h2>
            <p className="text-muted-foreground text-lg">Known and estimated income streams</p>
          </div>

          <div className="space-y-8">
            {/* Guaranteed Cash Flow */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Guaranteed Cash Flow Component</CardTitle>
                    <CardDescription className="mt-1">DE000MS0H1P0 – Quarterly Coupon Stream</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Investment</p>
                    <p className="text-2xl font-bold text-primary">€40,000</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Quarterly Coupon</p>
                    <p className="text-2xl font-bold text-primary">€932</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
                    <p className="text-2xl font-bold text-primary">€3,728</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Effective Yield</p>
                    <p className="text-2xl font-bold text-primary">9.32%</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Projected Quarterly Flow (Year 1)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => (
                      <div key={idx} className="p-3 bg-background rounded border text-center">
                        <p className="text-xs text-muted-foreground mb-1">{quarter} 2025</p>
                        <p className="font-bold text-primary">€932</p>
                        <p className="text-xs text-muted-foreground mt-1">if barrier respected</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                  <p className="text-sm">
                    <span className="font-semibold">Note:</span> Coupons are conditional on all basket components 
                    remaining above 65% of initial levels. Memory feature ensures missed coupons are paid 
                    retroactively when conditions are met.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Capital Protected Component */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Capital-Protected Component</CardTitle>
                    <CardDescription className="mt-1">XS3153397073 – Maturity Payoff Structure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-600/5 rounded-lg border border-blue-600/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Investment</p>
                    <p className="text-2xl font-bold text-blue-600">€20,000</p>
                  </div>
                  <div className="p-4 bg-green-600/5 rounded-lg border border-green-600/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Minimum Redemption</p>
                    <p className="text-2xl font-bold text-green-600">€20,000</p>
                    <p className="text-xs text-muted-foreground mt-1">100% protected</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Maximum Redemption</p>
                    <p className="text-2xl font-bold text-primary">€30,000</p>
                    <p className="text-xs text-muted-foreground mt-1">+50% cap</p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-600/10 to-primary/10 rounded-lg border">
                  <h4 className="font-semibold mb-4 text-center">Payoff Diagram (Simplified)</h4>
                  <div className="flex items-end justify-between h-32 gap-2">
                    <div className="flex-1 bg-blue-600 rounded-t flex items-end justify-center pb-2" style={{ height: '50%' }}>
                      <span className="text-xs font-semibold text-white">Base</span>
                    </div>
                    <div className="flex-1 bg-green-600 rounded-t flex items-end justify-center pb-2" style={{ height: '75%' }}>
                      <span className="text-xs font-semibold text-white">+25%</span>
                    </div>
                    <div className="flex-1 bg-primary rounded-t flex items-end justify-center pb-2" style={{ height: '100%' }}>
                      <span className="text-xs font-semibold text-white">+50%</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Worst Case</span>
                    <span>Mid Performance</span>
                    <span>Best Case (Cap)</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-sm">
                    <span className="font-semibold">Structure:</span> Entire payout delivered at maturity (24.10.2030). 
                    No interim coupons. Principal is fully protected regardless of index performance. 
                    Upside participation limited to 50% gain.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Autocallable Components */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <div>
                    <CardTitle>Autocallable Components</CardTitle>
                    <CardDescription className="mt-1">XS3188986858 & XS3189071965 – Scenario Analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                  <p className="text-sm">
                    <span className="font-semibold">Disclosure:</span> Full KID/Term Sheets not included in uploaded documentation. 
                    These notes typically provide conditional coupons, autocall features, and Memory mechanisms. 
                    Capital at risk below protection barriers.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Typical Scenario Framework</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-green-600/5 rounded-lg border border-green-600/20">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white font-bold mb-2">
                          ↗
                        </div>
                        <h5 className="font-semibold text-green-600">Positive Scenario</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Early autocall triggered</li>
                        <li>✓ High coupons paid</li>
                        <li>✓ Capital returned early</li>
                        <li className="text-green-600 font-semibold">Best outcome</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-yellow-600/5 rounded-lg border border-yellow-600/20">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 text-white font-bold mb-2">
                          →
                        </div>
                        <h5 className="font-semibold text-yellow-600">Base Case</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Coupons paid regularly</li>
                        <li>✓ Memory feature active</li>
                        <li>✓ Full redemption at maturity</li>
                        <li className="text-yellow-600 font-semibold">Expected outcome</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-red-600/5 rounded-lg border border-red-600/20">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white font-bold mb-2">
                          ↘
                        </div>
                        <h5 className="font-semibold text-red-600">Negative Scenario</h5>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>✗ Underlyings breach barrier</li>
                        <li>✗ Worst-of activated</li>
                        <li>✗ Capital loss potential</li>
                        <li className="text-red-600 font-semibold">Risk scenario</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-purple-600/10 to-green-600/10 rounded-lg border">
                  <h4 className="font-semibold mb-3 text-center">Combined Investment (€40,000)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Tech/AI Basket</p>
                      <p className="text-xl font-bold text-purple-600">€20,000</p>
                      <p className="text-xs text-muted-foreground mt-1">High beta exposure</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Energy/Utilities Basket</p>
                      <p className="text-xl font-bold text-green-600">€20,000</p>
                      <p className="text-xs text-muted-foreground mt-1">Sector balance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk/Return Profile */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Risk/Return Profile</h2>
            <p className="text-muted-foreground text-lg">Portfolio characteristics and risk assessment</p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side - Key Characteristics */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Key Characteristics</h3>
                  
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">40%</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Predictable Income Driver</p>
                      <p className="text-sm text-muted-foreground">
                        Morgan Stanley Phoenix provides quarterly cash flows with 9.32% annualized yield
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-blue-600/5 rounded-lg border border-blue-600/10">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-blue-600">20%</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Full Capital Protection</p>
                      <p className="text-sm text-muted-foreground">
                        Barclays CPPI guarantees 100% principal at maturity with upside participation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-600/5 rounded-lg border border-purple-600/10">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-purple-600">40%</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">High-Yield Optionality</p>
                      <p className="text-sm text-muted-foreground">
                        Autocallable structures offer enhanced coupons and early redemption potential
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg border">
                    <h4 className="font-semibold mb-3">Diversification Factors</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span><span className="font-medium">Issuer diversity:</span> Morgan Stanley, Barclays</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span><span className="font-medium">Sector spread:</span> Tech, Energy, Utilities, Financials</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span><span className="font-medium">Structure mix:</span> Phoenix, CPPI, Autocallables</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span><span className="font-medium">Geography:</span> Pan-European and US underlyings</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right side - Risk Bar and Assessment */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Risk Assessment</h3>
                  
                  <div className="p-6 bg-gradient-to-br from-secondary/50 to-secondary/20 rounded-lg border">
                    <h4 className="font-semibold mb-4 text-center">Overall Portfolio Risk Level</h4>
                    
                    {/* Risk Bar */}
                    <div className="relative h-12 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 rounded-full mb-4">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-4 border-primary shadow-lg" />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mb-6">
                      <span>Low</span>
                      <span className="font-semibold text-foreground">Moderate / Balanced</span>
                      <span>High</span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Income Stability</span>
                        <span className="font-semibold text-green-600">Strong</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Capital Protection</span>
                        <span className="font-semibold text-green-600">Partial (20%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Volatility Exposure</span>
                        <span className="font-semibold text-yellow-600">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Downside Risk</span>
                        <span className="font-semibold text-yellow-600">Controlled</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>Upside Potential</span>
                        <span className="font-semibold text-primary">Asymmetric</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-4">Risk Mitigation Strategies</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Defensive Allocation</p>
                          <p className="text-muted-foreground">20% fully capital-protected component reduces portfolio beta</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Barrier Protection</p>
                          <p className="text-muted-foreground">65% barriers on Phoenix provide cushion against market volatility</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Sector Diversification</p>
                          <p className="text-muted-foreground">Multi-sector exposure reduces concentration risk</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <p className="text-sm">
                      <span className="font-semibold">Important:</span> Past performance does not guarantee future results. 
                      Structured products involve issuer credit risk and may result in capital loss if barriers are breached. 
                      Suitable for investors with moderate risk tolerance and medium-to-long term horizon.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final Summary */}
      <section className="py-24 px-4 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-4">Portfolio Summary for Client G.U.</CardTitle>
              <CardDescription className="text-base">
                A balanced structured-product solution for sophisticated investors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="prose prose-sm max-w-none">
                <p className="text-base leading-relaxed text-muted-foreground">
                  This portfolio framework represents a <span className="font-semibold text-foreground">sophisticated allocation</span> combining 
                  income generation, capital protection, and thematic market exposure through five carefully selected structured certificates. 
                  The construction balances <span className="font-semibold text-foreground">quarterly cash flows</span> from the Morgan Stanley Phoenix note 
                  with <span className="font-semibold text-foreground">full principal protection</span> on 20% of assets and 
                  <span className="font-semibold text-foreground"> high-yield autocall optionality</span> across technology and energy sectors.
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  Key advantages include <span className="font-semibold text-foreground">sector diversification</span> spanning technology, energy, utilities, 
                  and financials; <span className="font-semibold text-foreground">credit diversification</span> across Morgan Stanley and Barclays as issuers; 
                  and a <span className="font-semibold text-foreground">long-term strategic horizon</span> extending to 2030 with multiple maturity profiles.
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  The expected profile delivers <span className="font-semibold text-foreground">moderate volatility</span> with 
                  <span className="font-semibold text-foreground"> asymmetric payoff characteristics</span>: predictable income from the Phoenix structure, 
                  autocall premium from the dual autocallable positions, and a defensive layer ensuring partial capital preservation regardless of market conditions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="p-4 text-center bg-primary/5 rounded-lg border border-primary/20">
                  <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Income Focus</p>
                  <p className="text-xs text-muted-foreground mt-1">9.32% p.a. from Phoenix</p>
                </div>
                <div className="p-4 text-center bg-blue-600/5 rounded-lg border border-blue-600/20">
                  <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Protection Layer</p>
                  <p className="text-xs text-muted-foreground mt-1">20% fully guaranteed</p>
                </div>
                <div className="p-4 text-center bg-purple-600/5 rounded-lg border border-purple-600/20">
                  <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Upside Optionality</p>
                  <p className="text-xs text-muted-foreground mt-1">40% autocallable exposure</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground italic text-center">
                  "This framework can be adapted to different capital amounts and risk preferences. 
                  The structure is scalable and customizable based on individual investor requirements."
                </p>
              </div>

              <div className="pt-6 flex justify-center">
                <Button size="lg" className="text-base px-8">
                  Request Detailed Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default StructuredProductsGU;