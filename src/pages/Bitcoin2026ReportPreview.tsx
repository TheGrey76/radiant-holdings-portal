// Bitcoin 2026 Report Preview Page
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
  BookOpen,
  Loader2,
  ArrowRight,
  Lock
} from 'lucide-react';

const Bitcoin2026ReportPreview = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Inserisci un indirizzo email valido');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting checkout...');
      const { data, error } = await supabase.functions.invoke('create-bitcoin-report-checkout', {
        body: { 
          email,
          successUrl: `${window.location.origin}/bitcoin-2026-report?success=true`,
          cancelUrl: `${window.location.origin}/bitcoin-2026-report-preview?canceled=true`
        }
      });

      console.log('Checkout response:', { data, error });

      if (error) throw error;
      
      if (data?.url) {
        console.log('Redirecting to:', data.url);
        // Try window.open first, fallback to location.href
        const newWindow = window.open(data.url, '_self');
        if (!newWindow) {
          // If blocked, try direct assignment
          window.location.assign(data.url);
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Errore durante il checkout. Riprova.');
      setIsLoading(false);
    }
  };

  const chapters = [
    { num: 'I', title: 'Macro-Liquidity Analysis', desc: 'Global M2, real rates, and monetary policy impact' },
    { num: 'II', title: 'Price Framework', desc: 'Historical patterns and valuation models' },
    { num: 'III', title: 'Quantitative Models', desc: 'Stock-to-flow and power law analysis' },
    { num: 'IV', title: 'ETF Flow Dynamics', desc: 'Institutional adoption metrics' },
    { num: 'V', title: 'On-Chain Analytics', desc: 'Supply distribution and holder behavior' },
    { num: 'VI', title: 'Derivatives & Market Structure', desc: 'Futures, options, and funding rates' },
    { num: 'VII', title: 'Mining Economics', desc: 'Hash rate, difficulty, and profitability' },
    { num: 'VIII', title: 'Supply Dynamics', desc: 'Halving impact and scarcity analysis' },
    { num: 'IX', title: 'Scenario Analysis', desc: 'Bull, base, and bear case projections' },
    { num: 'X', title: 'Price Targets', desc: 'Probability-weighted 2026 forecasts' },
    { num: 'XI', title: 'Risk Management', desc: 'Portfolio sizing and drawdown analysis' },
  ];

  const features = [
    'Proprietary macro-liquidity framework',
    '11 comprehensive chapters',
    '3 detailed price scenarios for 2026',
    'Institutional-grade quantitative models',
    'On-chain and derivatives analysis',
    'Risk management framework',
    'Quarterly update access',
  ];

  return (
    <>
      <Helmet>
        <title>Bitcoin 2026 Report | ARIES76 Capital Intelligence</title>
        <meta name="description" content="Institutional research report on Bitcoin's 2026 outlook. Macro-liquidity framework, quantitative models, and price scenarios." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.1),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30">
                Institutional Research
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Bitcoin 2026
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                A Macro-Liquidity Framework for Institutional Positioning
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-zinc-300">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                  <span>XI Chapters</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>3 Price Scenarios</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Quantitative Models</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Left Column - Features & Chapters */}
              <div className="lg:col-span-2 space-y-12">
                {/* What's Included */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table of Contents */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Table of Contents</h2>
                  <div className="grid gap-3">
                    {chapters.map((chapter) => (
                      <div 
                        key={chapter.num}
                        className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <span className="text-orange-400 font-bold text-lg w-8">{chapter.num}</span>
                        <div>
                          <h3 className="text-white font-medium">{chapter.title}</h3>
                          <p className="text-sm text-zinc-500">{chapter.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Methodology Preview */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">The ARIES76 Methodology</h3>
                  <p className="text-zinc-400 mb-4">
                    Our proprietary framework combines macro-liquidity analysis with on-chain metrics 
                    and derivatives data to provide a comprehensive view of Bitcoin's market dynamics.
                  </p>
                  <div className="flex items-center gap-2 text-orange-400">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Data-driven institutional insights</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Purchase Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 bg-zinc-900 border-zinc-700">
                  <CardContent className="p-6 space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
                        <span className="text-white text-2xl font-bold">₿</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Bitcoin 2026 Report</h3>
                      <p className="text-zinc-400 text-sm">Institutional Research by ARIES76</p>
                    </div>

                    <div className="text-center py-4 border-y border-zinc-700">
                      <div className="text-4xl font-bold text-white">€1</div>
                      <p className="text-zinc-500 text-sm mt-1">Test price (normally €99)</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Instant PDF download</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Lock className="w-4 h-4 text-blue-400" />
                        <span>Secure Stripe payment</span>
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
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Purchase Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                      By purchasing, you agree to our terms of service. 
                      Report will be delivered to your email.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 border-t border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-lg font-bold tracking-[0.3em] text-white/90 mb-2">
                ARIES76
              </div>
              <div className="text-sm tracking-[0.2em] text-zinc-500 uppercase mb-6">
                Capital Intelligence
              </div>
              <p className="text-zinc-400">
                25+ years of experience in private banking, hedge funds, and alternative investments.
                Our research combines institutional rigor with cutting-edge data analysis.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Bitcoin2026ReportPreview;
