// Bitcoin 2026 - Live Intelligence Page
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowRight,
  Loader2,
  RefreshCw,
  Activity
} from 'lucide-react';

const Bitcoin2026ReportPreview = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAccess = async () => {
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
        window.location.assign(data.url);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const AccessCard = ({ className = '' }: { className?: string }) => (
    <Card className={`bg-gradient-to-br from-zinc-900 to-zinc-950 border-accent/20 ${className}`}>
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-accent uppercase tracking-widest mb-4">
            <Activity className="w-3 h-3" />
            Live Intelligence
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Bitcoin 2026</h3>
          <p className="text-zinc-400 text-sm">Continuous access to live data and strategic context</p>
        </div>

        <div className="text-center py-4 border-y border-zinc-800">
          <div className="text-3xl font-semibold text-white">€99</div>
          <p className="text-zinc-500 text-sm mt-1">Ongoing updates included</p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-accent"
          />
          <Button 
            onClick={handleAccess}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Access the live Bitcoin intelligence page
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Ongoing updates included · Continuous access · No static reports
        </p>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Bitcoin 2026 | Live Bitcoin Intelligence for Long-Term Decision Makers | ARIES76</title>
        <meta name="description" content="A continuously updated Bitcoin intelligence page. Real-time price data, key statistics, and evolving long-term context for strategic allocation decisions." />
        
        <meta property="og:title" content="Bitcoin 2026 | Live Bitcoin Intelligence" />
        <meta property="og:description" content="Continuously updated with real-time price data, key statistics, and evolving long-term context. Designed for strategic allocation, not short-term trading." />
        <meta property="og:image" content="https://aries76.com/bitcoin-2026-og.png" />
        <meta property="og:url" content="https://aries76.com/bitcoin-2026-report-preview" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitcoin 2026 | ARIES76" />
        <meta name="twitter:description" content="Live Bitcoin intelligence for long-term decision makers." />
        <meta name="twitter:image" content="https://aries76.com/bitcoin-2026-og.png" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          {/* Subtle gradient accents */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.08),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-12 items-start">
                
                {/* Left: Content */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 text-accent text-sm mb-6">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Live · Updated in real time</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
                    Bitcoin 2026
                  </h1>
                  
                  <p className="text-xl text-zinc-200 mb-4">
                    A live Bitcoin intelligence page for long-term decision makers
                  </p>
                  
                  <p className="text-lg text-zinc-400 mb-6">
                    Continuously updated with real-time price data, key statistics, and evolving long-term context.<br />
                    Not a PDF. Not a forecast. A living intelligence layer.
                  </p>

                  <p className="text-sm text-zinc-500">
                    Designed for strategic allocation and informed positioning, not short-term trading.
                  </p>
                </div>

                {/* Right: Access Card */}
                <div className="lg:col-span-2">
                  <AccessCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY THIS EXISTS ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Why a static Bitcoin report is no longer enough
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  Most Bitcoin research becomes obsolete the moment it is published. Markets evolve, narratives shift, and data changes daily. Long-term investors do not need more opinions — they need continuous context.
                </p>
                <p>
                  Bitcoin 2026 was created to address this gap: a single, continuously updated page that combines long-term strategic thinking with real-time market visibility, reducing fragmentation and decision fatigue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT CHANGES WITH CONTINUOUS CONTEXT ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                What changes when Bitcoin intelligence updates in real time
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  Instead of reacting to price movements, you operate within a consistent strategic framework.
                </p>
                <p>
                  Instead of consuming fragmented information, you access a single, evolving source of truth.
                </p>
                <p>
                  Instead of revisiting static reports, your understanding updates alongside the market.
                </p>
                <p className="text-zinc-500">
                  This page is designed to support better decisions over time, not to trigger short-term actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT YOU ACCESS ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                What you access with Bitcoin 2026
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  Access a continuously updated Bitcoin price view, integrated with key market and statistical indicators.
                </p>
                <p>
                  Follow the evolution of a long-term thesis extending toward 2026, updated as conditions change.
                </p>
                <p>
                  Monitor relevant data points without relying on multiple disconnected tools or sources.
                </p>
                <p className="text-zinc-500">
                  Everything is presented in a clear, sober, institutional format focused on clarity and usability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHO THIS IS FOR ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Who this page is designed for
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  Bitcoin 2026 is designed for investors, professionals, and decision-makers who already have — or are evaluating — long-term exposure to Bitcoin and require ongoing clarity rather than episodic research.
                </p>
                <p className="text-zinc-500">
                  It is not designed for day traders, signal-driven strategies, or speculative short-term positioning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== A LIVING PRODUCT ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                A living product, not a one-time document
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  This page evolves over time.
                </p>
                <p>
                  Data refreshes continuously.
                </p>
                <p>
                  The strategic framework adapts as the market changes.
                </p>
                <p className="text-zinc-500">
                  What you access today is not identical to what you will see in six months — by design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ACCESS AND UPDATES ===== */}
        <section className="py-20 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Access and updates
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed mb-12">
                <p>
                  Access is provided via subscription to ensure continuous updates, maintenance of real-time data, and ongoing analytical refinement.
                </p>
                <p className="text-zinc-500">
                  This is not a one-off purchase of static content, but ongoing access to a maintained intelligence page.
                </p>
              </div>

              {/* Final CTA */}
              <div className="max-w-md mx-auto">
                <AccessCard />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <section className="py-12 border-t border-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-500 text-sm">
                ARIES76 · Capital Intelligence
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Bitcoin2026ReportPreview;
