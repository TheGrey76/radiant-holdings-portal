import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, TrendingUp, PieChart, Target, BarChart3, FileCheck, ArrowRight } from "lucide-react";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "gp@aries76.com"
];

const AssetGUProposal = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("assetgu_authorized_email");
    
    if (!email) {
      navigate("/asset-gu-access");
      return;
    }

    if (AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      setIsAuthorized(true);
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <Card className="max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You are not authorized to view this proposal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please contact edoardo.grigione@aries76.com for access.
            </p>
            <Button onClick={() => navigate("/asset-gu-access")} variant="outline" className="w-full">
              Return to Access Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-600/20 text-amber-500 border-amber-600/30">
              Confidential Client Proposal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Asset G.U.
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-6">
              Portfolio Architecture & Structured Solutions
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
              Aries76 presents a strategic asset allocation framework based on a 50/30/20 risk profile, 
              with total projected assets of €2.2 million (January 2026). The portfolio integrates a 
              dedicated 20% structured-products sleeve designed to enhance yield generation while 
              maintaining strict risk controls.
            </p>
          </div>

          {/* Allocation Chart Visual */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-white text-xl">50%</CardTitle>
                <CardDescription className="text-slate-400">Capital Preservation</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-white">€1,100,000</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-white text-xl">30%</CardTitle>
                <CardDescription className="text-slate-400">Medium Risk</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-white">€660,000</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-amber-500" />
                </div>
                <CardTitle className="text-white text-xl">20%</CardTitle>
                <CardDescription className="text-slate-400">Aggressive</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-white">€440,000</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Client Profile & Objectives */}
      <section className="py-16 px-4 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-bold text-white">Client Profile & Objectives</h2>
          </div>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Asset G.U. represents a private client / family wealth mandate with a time horizon 
            of 5–10 years. The portfolio is structured according to a disciplined 50/30/20 risk 
            framework that balances capital preservation, stable income generation, and selective 
            growth opportunities.
          </p>

          <Card className="bg-slate-800/50 border-amber-600/30 backdrop-blur">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Preserve capital</span> on at least 50% of total wealth 
                    through high-grade fixed income and capital-guaranteed solutions
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Generate stable income</span> with controlled volatility 
                    on the medium-risk bucket through diversified funds and defensive structured products
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Allocate 20% to higher-risk strategies</span> with clearly 
                    defined risk limits and enhanced return potential via thematic equity and structured notes
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Current Position Summary */}
      <section className="py-16 px-4 bg-slate-900/50 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-bold text-white">Current Portfolio Snapshot</h2>
          </div>

          <p className="text-lg text-slate-300 mb-8">
            Current total assets approximately <span className="font-semibold text-white">€1,135,000</span>, 
            distributed across government bonds, discretionary mandates, and insurance wrappers.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Asset Category</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Amount (€)</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 text-slate-200">BOT/BTP (2028–2034)</td>
                  <td className="text-right py-3 px-4 text-white font-semibold">360,000</td>
                  <td className="text-right py-3 px-4 text-slate-300">31.7%</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 text-slate-200">Discretionary Mandates (US, Europe, Robotics)</td>
                  <td className="text-right py-3 px-4 text-white font-semibold">450,000</td>
                  <td className="text-right py-3 px-4 text-slate-300">39.6%</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 text-slate-200">TFR in Arca Mixed Funds (Italy bonds & equities)</td>
                  <td className="text-right py-3 px-4 text-white font-semibold">250,000</td>
                  <td className="text-right py-3 px-4 text-slate-300">22.0%</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 text-slate-200">Zurich Multi Invest (minimum guaranteed)</td>
                  <td className="text-right py-3 px-4 text-white font-semibold">75,000</td>
                  <td className="text-right py-3 px-4 text-slate-300">6.6%</td>
                </tr>
                <tr className="bg-slate-800/30">
                  <td className="py-3 px-4 text-white font-bold">Total</td>
                  <td className="text-right py-3 px-4 text-white font-bold">1,135,000</td>
                  <td className="text-right py-3 px-4 text-white font-bold">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-white mb-3">Key Observations</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Portfolio is currently underweight in capital-preservation assets relative to the 50% target</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Significant allocation to traditional equity funds without explicit downside protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>No dedicated structured-products allocation in current portfolio</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Target Strategic Allocation */}
      <section className="py-16 px-4 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-bold text-white">Target Strategic Allocation – €2.2M</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">50%</Badge>
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <CardTitle className="text-white">Capital Preservation</CardTitle>
                <CardDescription className="text-emerald-200/70">€1,100,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  BOT/BTP ladder, high-grade government and corporate bonds, 
                  capital-guaranteed structured solutions, and money market instruments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">30%</Badge>
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle className="text-white">Medium Risk</CardTitle>
                <CardDescription className="text-blue-200/70">€660,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Diversified mutual funds across global equities, defensive structured products 
                  with moderate barriers, and multi-asset strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-700/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">20%</Badge>
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <CardTitle className="text-white">Aggressive</CardTitle>
                <CardDescription className="text-amber-200/70">€440,000</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Thematic equity strategies (AI, robotics, semiconductors), 
                  high-conviction sector funds, and higher-beta structured notes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Visual Bar */}
          <div className="h-12 flex rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-semibold" style={{width: '50%'}}>
              50% Safe
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold" style={{width: '30%'}}>
              30% Medium
            </div>
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center text-white font-semibold" style={{width: '20%'}}>
              20% Aggressive
            </div>
          </div>
        </div>
      </section>

      {/* Structured Products Sleeve */}
      <section className="py-16 px-4 bg-slate-900/50 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-bold text-white">Structured-Products Sleeve – 20% of Total Assets</h2>
          </div>

          <p className="text-lg text-slate-300 mb-10">
            A total of <span className="font-semibold text-white">€440,000</span> will be allocated to structured products, 
            organized into three distinct risk clusters with defined barriers, underlyings, and return objectives.
          </p>

          <div className="space-y-6">
            {/* Defensive Income Notes */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                    Defensive Income
                  </Badge>
                  <span className="text-2xl font-bold text-white">€200,000</span>
                </div>
                <CardTitle className="text-white text-xl">Defensive Income Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Underlyings</p>
                    <p className="text-slate-200">Major indices: SX5E, S&P 500, SMI, FTSE 100</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Barriers</p>
                    <p className="text-slate-200">40–50% (European style)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Maturity</p>
                    <p className="text-slate-200">18–36 months</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Target Coupon</p>
                    <p className="text-emerald-400 font-semibold">7–10% gross p.a.</p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Objective:</span> Provide stable coupon income 
                  while stabilizing overall equity exposure through broad market indices.
                </p>
              </CardContent>
            </Card>

            {/* Thematic & Sector Notes */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                    Thematic & Sector
                  </Badge>
                  <span className="text-2xl font-bold text-white">€140,000</span>
                </div>
                <CardTitle className="text-white text-xl">Thematic & Sector Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Underlyings</p>
                    <p className="text-slate-200">Robotics, AI, semiconductors, luxury, global quality growth</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Barriers</p>
                    <p className="text-slate-200">50–60%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Maturity</p>
                    <p className="text-slate-200">18–36 months</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Target Coupon</p>
                    <p className="text-blue-400 font-semibold">10–14% gross p.a.</p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Objective:</span> Bridge medium and aggressive 
                  risk buckets through selective thematic exposure with enhanced yield potential.
                </p>
              </CardContent>
            </Card>

            {/* Opportunistic High-Yield Notes */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">
                    Opportunistic High-Yield
                  </Badge>
                  <span className="text-2xl font-bold text-white">€100,000</span>
                </div>
                <CardTitle className="text-white text-xl">Opportunistic High-Yield Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Underlyings</p>
                    <p className="text-slate-200">Baskets of 3–4 high-beta stocks (selective tech, cyclicals)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Barriers</p>
                    <p className="text-slate-200">~60–70%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Maturity</p>
                    <p className="text-slate-200">12–24 months</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Target Coupon</p>
                    <p className="text-amber-400 font-semibold">15–25% gross p.a.</p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Objective:</span> Maximize income generation 
                  within a clearly ring-fenced aggressive bucket with defined risk tolerance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration with Existing Holdings */}
      <section className="py-16 px-4 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Integration with Existing Assets</h2>

          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-emerald-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Capital Preservation Block (50%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Maintain and extend the existing BOT/BTP ladder with additional government bonds 
                  and capital-guaranteed solutions to reach the €1.1M target. Consider high-grade 
                  corporate bonds (EUR IG) and short-duration fixed income for liquidity management.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-blue-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Medium-Risk Block (30%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Retain selected existing discretionary mandates and diversified equity funds. 
                  Integrate defensive and thematic structured notes (€200K + €140K) to add yield 
                  enhancement and downside cushion while maintaining global equity exposure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-amber-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Aggressive Block (20%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Combine high-conviction thematic equity funds (robotics, AI, semiconductors) 
                  with opportunistic high-yield structured notes (€100K) to create a clearly defined 
                  20% risk budget. This bucket targets superior returns with explicit downside limits.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-amber-600" />
              Transition Timeline
            </h3>
            <p className="text-slate-300 mb-4">
              The portfolio will be gradually rebalanced from the current structure into the 
              target 50/30/20 allocation over a 6–12 month period, with quarterly reviews to 
              assess market conditions and adjust the transition pace accordingly.
            </p>
          </div>
        </div>
      </section>

      {/* Governance & Monitoring */}
      <section className="py-16 px-4 bg-slate-900/50 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Governance, Monitoring & Risk Management</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Policy Framework</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-300">Formal 50/30/20 strategic asset allocation policy with defined rebalancing bands</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-300">Structured-products investment guidelines: minimum BBB-rated issuers, barriers ≥40%, maximum single-issuer concentration 25%</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-300">Quarterly monitoring and comprehensive reporting on portfolio performance, risk metrics, and barrier distances</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-slate-300">Annual strategic review to assess continued suitability of the allocation framework</p>
                </li>
              </ul>
            </div>

            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-700/50">
              <CardHeader>
                <CardTitle className="text-white">Transparency & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Full transparency on each structured note with detailed quarterly reporting including:
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    Distance to barrier and autocall probability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    Mark-to-market valuation scenarios
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    Issuer credit quality monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    Coupon payment schedule and performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Next Steps</h2>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-600/30 backdrop-blur">
            <CardContent className="pt-8">
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-500 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Validation of Framework</h3>
                    <p className="text-slate-300">Review and approve the 50/30/20 strategic allocation policy and confirm alignment with long-term objectives</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-500 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Approval of Structured-Products Envelope</h3>
                    <p className="text-slate-300">Confirm the €440K allocation to structured products and validate investment guidelines (issuers, barriers, concentration limits)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-500 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">First Issuance Wave</h3>
                    <p className="text-slate-300">Launch initial structured-products portfolio with 3–5 carefully selected notes across defensive, thematic, and opportunistic buckets</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-500 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Quarterly Review Process</h3>
                    <p className="text-slate-300">Establish regular monitoring cadence with detailed performance reporting and risk metrics tracking</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700 mb-8" />

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8"
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  Request Full Proposal PDF
                </Button>
                <p className="text-sm text-slate-400 mt-4">
                  For questions or to schedule a review meeting, contact{" "}
                  <a href="mailto:edoardo.grigione@aries76.com" className="text-amber-500 hover:text-amber-400 underline">
                    edoardo.grigione@aries76.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-slate-500">
            This proposal is confidential and intended solely for Asset G.U. 
            All information herein is proprietary to Aries76 Ltd.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © {new Date().getFullYear()} Aries76 Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AssetGUProposal;
