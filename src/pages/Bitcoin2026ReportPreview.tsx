// Bitcoin 2026 Report Premium Sales Page
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Shield, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Lock,
  XCircle,
  AlertTriangle,
  Zap,
  FileSpreadsheet,
  LineChart,
  PlayCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Quote,
  CreditCard
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const Bitcoin2026ReportPreview = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-bitcoin-report-checkout', {
        body: { 
          email,
          successUrl: `${window.location.origin}/bitcoin-2026-report?success=true`,
          cancelUrl: `${window.location.origin}/bitcoin-2026-report-preview?canceled=true`
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        const newWindow = window.open(data.url, '_self');
        if (!newWindow) {
          window.location.assign(data.url);
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout error. Please try again.');
      setIsLoading(false);
    }
  };

  // Probability-weighted price scenarios data (blurred for preview)
  const scenarioData = [
    { name: 'Stress', range: '$XX-$XXk', displayRange: '$45k-$60k', probability: 15, fill: '#ef4444' },
    { name: 'Base Case', range: '$XXk-$XXXk', displayRange: '$96k-$132k', probability: 60, fill: '#22c55e' },
    { name: 'High Convexity', range: '$XXXk-$XXXk', displayRange: '$180k-$260k', probability: 25, fill: '#f59e0b' },
  ];

  // Backtesting performance data
  const backtestData = [
    { event: 'Q4 2022 Bottom', model: 'ACCUMULATION', competitor: '"Further downside to $10k"', correct: true },
    { event: 'Q1 2024 ETF Rally', model: 'EXPANSION', competitor: '"Sell the news event"', correct: true },
    { event: 'May 2021 Crash', model: 'DISTRIBUTION', competitor: '"To the moon!"', correct: true },
  ];

  // Flawed methods comparison
  const flawedMethods = [
    { method: 'Halving Cycles', limit: 'Ignores macro drivers (M2, real rates)', consequence: 'You enter and exit at the wrong times' },
    { method: 'Retail Technical Analysis', limit: 'Noise, not signal', consequence: 'You follow the crowd, become liquidity for institutions' },
    { method: 'Free Reports (e.g., ARK)', limit: 'Narrative analysis, not quantitative. Slow.', consequence: 'Decisions based on old and incomplete data' },
  ];

  // Competition comparison
  const competitorData = [
    { feature: 'Methodology', aries: 'Macro-Liquidity & Quant', messari: 'On-Chain & News', glassnode: 'Pure On-Chain', ark: 'Thematic Narrative' },
    { feature: 'Predictive Models', aries: true, messari: false, glassnode: false, ark: false },
    { feature: 'Public Backtesting', aries: true, messari: false, glassnode: false, ark: false },
    { feature: 'Actionable Signals', aries: true, messari: false, glassnode: false, ark: false },
    { feature: 'Excel Models', aries: true, messari: false, glassnode: false, ark: false },
    { feature: 'Price', aries: '€99 (One-Time)', messari: '$2,400/year', glassnode: '$3,588/year', ark: 'Free' },
  ];

  // What you get items
  const deliverables = [
    { icon: FileSpreadsheet, title: 'Full 120-Page PDF Report', desc: 'Complete analysis, chapter by chapter' },
    { icon: BarChart3, title: 'Interactive Scenario Calculator (Excel)', desc: 'Input your M2 and rate assumptions to generate price targets' },
    { icon: LineChart, title: 'Real-Time Regime Dashboard', desc: 'Private dashboard link showing current market regime (Live Status: EXPANSION)' },
    { icon: Target, title: 'Backtesting Performance Data (Excel)', desc: 'Historical data proving our model accuracy' },
    { icon: Download, title: 'Downloadable Charts & Graphics', desc: 'High-resolution visualizations for your presentations' },
    { icon: PlayCircle, title: 'Quarterly Video Updates', desc: 'Access to quarterly update videos on model and targets' },
    { icon: Zap, title: 'Actionable Trade Signal Summary', desc: 'Clear entry/exit signals based on current regime' },
  ];

  // FAQ items
  const faqItems = [
    { 
      q: 'What happens after purchase?', 
      a: 'You receive an email with immediate download links for the full report, Excel models, and dashboard access. Everything is delivered instantly.' 
    },
    { 
      q: 'Is the model difficult to use?', 
      a: 'No. We provide clear documentation and the report explains everything step by step. The Excel models are user-friendly with built-in instructions.' 
    },
    { 
      q: 'Why is this not a subscription?', 
      a: 'We want to provide exceptional value. Quarterly updates are included in your one-time purchase. No recurring fees, no hidden costs.' 
    },
    { 
      q: 'What if I am not satisfied?', 
      a: 'You have a 30-day money-back guarantee. If the report does not meet your expectations, we will refund you in full, no questions asked.' 
    },
    { 
      q: 'Who is behind ARIES76?', 
      a: 'A team of PhDs in Financial Economics, former hedge fund analysts, and institutional investors with 25+ years of combined experience in private markets and alternative assets.' 
    },
  ];

  const PurchaseCard = ({ className = '' }: { className?: string }) => (
    <Card className={`bg-zinc-900/95 border-zinc-700 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6 space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mb-3">
            <span className="text-white text-xl font-bold">₿</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Bitcoin 2026 Report</h3>
          <p className="text-zinc-400 text-sm">Institutional Research by ARIES76</p>
        </div>

        <div className="text-center py-3 border-y border-zinc-700">
          <div className="text-4xl font-bold text-white">€99</div>
          <p className="text-zinc-500 text-sm mt-1">One-time purchase • Lifetime access</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-zinc-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Includes Excel Models & Dashboards</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Lock className="w-4 h-4 text-orange-400" />
            <span>Secure Stripe Payment</span>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Button 
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Instant Access for €99
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Trusted by CIOs at European Family Offices & Multi-Strategy Funds
        </p>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Bitcoin 2026 Report | Institutional Macro-Liquidity Framework | ARIES76</title>
        <meta name="description" content="Access the quantitative model that outperformed 95% of crypto analysts. Proprietary macro-liquidity framework with backtested predictions. Price target: $138,000." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        
        {/* ===== SECTION 1: HERO ABOVE THE FOLD ===== */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-10 items-start">
                {/* Left: Main Content */}
                <div className="lg:col-span-3 text-center lg:text-left">
                  <Badge className="mb-5 bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs tracking-wide">
                    INSTITUTIONAL RESEARCH
                  </Badge>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
                    Bitcoin 2026: The Institutional Macro-Liquidity Framework
                  </h1>

                  <p className="text-lg md:text-xl text-zinc-300 mb-4">
                    Access the Quantitative Model That <span className="text-orange-400 font-semibold">Outperformed 95% of Crypto Analysts.</span>
                  </p>
                  
                  <p className="text-base md:text-lg text-zinc-400 mb-6">
                    Stop relying on simplistic halving cycles. Our proprietary Macro-Liquidity Model, backtested since 2013, gives you the unfair advantage.
                  </p>

                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 mb-8">
                    <Target className="w-6 h-6 text-emerald-400" />
                    <div className="text-left">
                      <div className="text-xs text-emerald-400/80 uppercase tracking-wide">Probability-Weighted Target</div>
                      <div className="text-2xl font-bold text-emerald-400 blur-sm select-none">$XXX,XXX</div>
                    </div>
                    <Lock className="w-4 h-4 text-emerald-400/50" />
                  </div>

                  {/* Trust Elements */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>30-Day Money-Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                      <span>Excel Models Included</span>
                    </div>
                  </div>
                </div>

                {/* Right: Purchase Card */}
                <div className="lg:col-span-2">
                  <PurchaseCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: YOUR ANALYSIS IS FLAWED ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  THE PROBLEM
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Your Current Bitcoin Analysis Is Flawed. Here's Why.
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  Models based on halving cycles, retail technical analysis, and narratives are destined to fail in the new institutional regime.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Traditional Method</th>
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Limitation</th>
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Consequence for You</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flawedMethods.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        <td className="py-4 px-4 text-white font-medium">{item.method}</td>
                        <td className="py-4 px-4 text-zinc-400">{item.limit}</td>
                        <td className="py-4 px-4 text-red-400/80 flex items-start gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          {item.consequence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-5 rounded-xl bg-zinc-800/30 border border-zinc-700/50 text-center">
                <p className="text-zinc-300 italic">
                  "In the institutional era, you need an institutional-grade framework. Relying on old models is like navigating a storm with a tourist map."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: THE ARIES76 EDGE ===== */}
        <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
                  OUR EDGE
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  The ARIES76 Proprietary Macro-Liquidity Framework
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                  We don't predict. We model. Our framework is built on the two pillars that truly drive Bitcoin's price: <span className="text-orange-400">Global M2 Liquidity</span> and <span className="text-blue-400">Real-Rate Dynamics</span>.
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Proprietary Quantitative Models</h3>
                  <p className="text-zinc-400 text-sm">
                    Developed by PhDs in Financial Economics, our Hidden Markov Models identify market regimes (Accumulation, Expansion, Distribution) with <span className="text-emerald-400 font-semibold">87% historical accuracy</span>.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Real-Time Data Integration</h3>
                  <p className="text-zinc-400 text-sm">
                    We don't use static data. Our framework integrates <span className="text-blue-400">live feeds</span> for ETF flows, derivatives positioning, and on-chain elasticity.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Backtested & Proven</h3>
                  <p className="text-zinc-400 text-sm">
                    Our model correctly identified the 2023 bottom, the 2024 ETF rally, and <span className="text-emerald-400">every major regime shift since 2017</span>. We show you the proof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: WHAT YOU GET ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <FileSpreadsheet className="w-3 h-3 mr-1" />
                  WHAT YOU GET
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  An Arsenal of Institutional-Grade Tools for €99
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: PRICE TARGETS ===== */}
        <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Target className="w-3 h-3 mr-1" />
                  PRICE TARGETS
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Our 2026 Price Targets Are Not Guesses. They Are Probabilities.
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  We provide a probabilistic framework, not a single number. This allows you to manage risk and size your positions like an institution.
                </p>
              </div>

              {/* Probability Chart */}
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-10">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioData} layout="vertical">
                      <XAxis type="number" domain={[0, 70]} tick={{ fill: '#a1a1aa' }} axisLine={{ stroke: '#3f3f46' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#fafafa' }} axisLine={{ stroke: '#3f3f46' }} width={100} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        labelStyle={{ color: '#fafafa' }}
                        formatter={(value: number) => [`${value}%`, 'Probability']}
                      />
                      <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                        {scenarioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {scenarioData.map((scenario, i) => (
                    <div key={i} className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">{scenario.name}</div>
                        <div className="text-2xl font-bold blur-sm select-none" style={{ color: scenario.fill }}>{scenario.range}</div>
                      </div>
                      <Badge style={{ backgroundColor: `${scenario.fill}20`, color: scenario.fill, borderColor: `${scenario.fill}40` }}>
                        {scenario.probability}% Prob
                      </Badge>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm pt-2">
                    <Lock className="w-4 h-4" />
                    <span>Exact price targets revealed in full report</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 relative">
                <div className="text-zinc-400 text-sm uppercase tracking-wide mb-2">Probability-Weighted Institutional Target</div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 blur-md select-none">$XXX,XXX</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/90 rounded-lg border border-emerald-500/30">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Unlock with Purchase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: BACKTESTING PROOF ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  PROOF
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Don't Just Take Our Word For It. See the Proof.
                </h2>
              </div>

              {/* Backtesting Table */}
              <div className="overflow-x-auto mb-12">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Event</th>
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">ARIES76 Model</th>
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Competitor Consensus</th>
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestData.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        <td className="py-4 px-4 text-white font-medium">{item.event}</td>
                        <td className="py-4 px-4">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{item.model}</Badge>
                        </td>
                        <td className="py-4 px-4 text-zinc-500 italic">{item.competitor}</td>
                        <td className="py-4 px-4">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Correct
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Testimonials */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <Quote className="w-8 h-8 text-orange-400/30 mb-4" />
                  <p className="text-zinc-300 mb-4 italic">
                    "ARIES76's macro-liquidity framework provided the conviction we needed to size our Bitcoin allocation appropriately. It stands apart from the narrative-driven analysis flooding the market."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">C</div>
                    <div>
                      <div className="text-white font-medium">Chief Investment Officer</div>
                      <div className="text-zinc-500 text-sm">European Family Office</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <Quote className="w-8 h-8 text-orange-400/30 mb-4" />
                  <p className="text-zinc-300 mb-4 italic">
                    "The regime-based risk management framework has been invaluable for our portfolio construction. Finally, a research provider that understands how Bitcoin fits into a diversified allocation."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">P</div>
                    <div>
                      <div className="text-white font-medium">Portfolio Manager</div>
                      <div className="text-zinc-500 text-sm">Multi-Strategy Fund</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 7: COMPETITION COMPARISON ===== */}
        <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
                  COMPARISON
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  ARIES76 vs. The Competition
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-4 px-4 text-zinc-400 font-medium text-sm">Feature</th>
                      <th className="py-4 px-4 text-center">
                        <span className="text-orange-400 font-bold">ARIES76</span>
                        <div className="text-emerald-400 text-xs mt-1">€99</div>
                      </th>
                      <th className="py-4 px-4 text-center text-zinc-400">
                        Messari
                        <div className="text-zinc-500 text-xs mt-1">$200/mo</div>
                      </th>
                      <th className="py-4 px-4 text-center text-zinc-400">
                        Glassnode
                        <div className="text-zinc-500 text-xs mt-1">$299/mo</div>
                      </th>
                      <th className="py-4 px-4 text-center text-zinc-400">
                        ARK
                        <div className="text-zinc-500 text-xs mt-1">Free</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorData.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        <td className="py-4 px-4 text-white">{item.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.aries === 'boolean' ? (
                            item.aries ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-zinc-600 mx-auto" />
                          ) : (
                            <span className="text-orange-400 font-semibold text-sm">{item.aries}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.messari === 'boolean' ? (
                            item.messari ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-zinc-600 mx-auto" />
                          ) : (
                            <span className="text-zinc-400 text-sm">{item.messari}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.glassnode === 'boolean' ? (
                            item.glassnode ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-zinc-600 mx-auto" />
                          ) : (
                            <span className="text-zinc-400 text-sm">{item.glassnode}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.ark === 'boolean' ? (
                            item.ark ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-zinc-600 mx-auto" />
                          ) : (
                            <span className="text-zinc-400 text-sm">{item.ark}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 text-center p-5 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                <p className="text-zinc-300">
                  Get <span className="text-orange-400 font-semibold">institutional-grade, actionable intelligence</span> for a fraction of the cost of data-only platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 8: FAQ ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border border-zinc-700/50 rounded-lg bg-zinc-800/30 px-5">
                    <AccordionTrigger className="text-white hover:text-orange-400 hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-400 pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ===== SECTION 9: FINAL CTA ===== */}
        <section className="py-20 bg-gradient-to-t from-zinc-950 to-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop Guessing. Start Modeling.
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                Gain the institutional edge in the Bitcoin market. For €99, you get the full report, the Excel models, the backtesting data, and the real-time dashboards. This is the most comprehensive, actionable framework available at this price point.
              </p>

              <div className="max-w-md mx-auto mb-8">
                <div className="flex gap-3 mb-4">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                  <Button 
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Unlock for €99
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Trust Elements */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Secure Stripe Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Branding */}
        <section className="py-12 border-t border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-lg font-bold tracking-[0.3em] text-white/90 mb-2">
                ARIES76
              </div>
              <div className="text-sm tracking-[0.2em] text-zinc-500 uppercase mb-4">
                Capital Intelligence
              </div>
              <p className="text-zinc-500 text-sm">
                25+ years of experience in private banking, hedge funds, and alternative investments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Bitcoin2026ReportPreview;
