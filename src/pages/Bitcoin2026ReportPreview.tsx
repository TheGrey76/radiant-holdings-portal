// Bitcoin 2026 - Live Intelligence Page
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Loader2,
  Circle
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

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const AccessCard = ({ className = '', compact = false }: { className?: string; compact?: boolean }) => (
    <motion.div 
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className={`relative bg-gradient-to-b from-zinc-900/95 to-zinc-950 border border-zinc-800/80 rounded-2xl backdrop-blur-sm ${compact ? 'p-6' : 'p-8'}`}>
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs text-accent uppercase tracking-[0.2em] font-medium">Live Intelligence</span>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-white mb-2">Bitcoin 2026</h3>
          <p className="text-zinc-500 text-sm">Continuous access · Real-time data</p>
        </div>

        <div className="text-center py-5 mb-6 border-y border-zinc-800/60">
          <div className="text-4xl font-light text-white tracking-tight">€99</div>
          <p className="text-zinc-600 text-sm mt-2">Ongoing updates included</p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus:border-accent/50 focus:ring-accent/20 h-12"
          />
          <Button 
            onClick={handleAccess}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-medium h-12 text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
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

        <p className="text-[11px] text-zinc-600 text-center mt-5 tracking-wide">
          Ongoing updates included · Continuous access · No static reports
        </p>
      </div>
    </motion.div>
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

      <div className="min-h-screen bg-zinc-950">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0">
            {/* Gradient mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.15),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,hsl(var(--accent)/0.08),transparent)]" />
            
            {/* Subtle grid */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--accent)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)/0.5) 1px, transparent 1px)`,
                backgroundSize: '64px 64px'
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                
                {/* Left: Content */}
                <motion.div 
                  className="lg:col-span-7"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                    </span>
                    <span className="text-accent text-sm font-medium tracking-wide">Live · Updated in real time</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 leading-[1.1] tracking-tight">
                    Bitcoin 2026
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-zinc-300 mb-6 leading-relaxed max-w-xl">
                    A live Bitcoin intelligence page for long-term decision makers
                  </p>
                  
                  <p className="text-lg text-zinc-500 mb-8 leading-relaxed max-w-lg">
                    Continuously updated with real-time price data, key statistics, and evolving long-term context.<br />
                    <span className="text-zinc-400">Not a PDF. Not a forecast. A living intelligence layer.</span>
                  </p>

                  <p className="text-sm text-zinc-600 max-w-md">
                    Designed for strategic allocation and informed positioning, not short-term trading.
                  </p>
                </motion.div>

                {/* Right: Access Card */}
                <div className="lg:col-span-5">
                  <AccessCard />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
        </section>

        {/* ===== CONTENT SECTIONS ===== */}
        <div className="relative">
          {/* Accent line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-accent/5 to-transparent hidden lg:block" />

          {/* ===== WHY THIS EXISTS ===== */}
          <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Circle className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">Context</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
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
              </motion.div>
            </div>
          </section>

          {/* ===== WHAT CHANGES WITH CONTINUOUS CONTEXT ===== */}
          <section className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Circle className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">The Difference</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
                  What changes when Bitcoin intelligence updates in real time
                </h2>
                
                <div className="space-y-8">
                  <p className="text-zinc-300 text-xl leading-relaxed border-l-2 border-accent/30 pl-6">
                    Instead of reacting to price movements, you operate within a consistent strategic framework.
                  </p>
                  <p className="text-zinc-300 text-xl leading-relaxed border-l-2 border-accent/30 pl-6">
                    Instead of consuming fragmented information, you access a single, evolving source of truth.
                  </p>
                  <p className="text-zinc-300 text-xl leading-relaxed border-l-2 border-accent/30 pl-6">
                    Instead of revisiting static reports, your understanding updates alongside the market.
                  </p>
                </div>
                <p className="text-zinc-600 text-lg mt-10">
                  This page is designed to support better decisions over time, not to trigger short-term actions.
                </p>
              </motion.div>
            </div>
          </section>

          {/* ===== WHAT YOU ACCESS ===== */}
          <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Circle className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">What You Get</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
                  What you access with Bitcoin 2026
                </h2>
                
                <div className="grid gap-6">
                  <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <p className="text-zinc-300 text-lg leading-relaxed">
                      Access a continuously updated Bitcoin price view, integrated with key market and statistical indicators.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <p className="text-zinc-300 text-lg leading-relaxed">
                      Follow the evolution of a long-term thesis extending toward 2026, updated as conditions change.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <p className="text-zinc-300 text-lg leading-relaxed">
                      Monitor relevant data points without relying on multiple disconnected tools or sources.
                    </p>
                  </div>
                </div>
                <p className="text-zinc-600 text-lg mt-8">
                  Everything is presented in a clear, sober, institutional format focused on clarity and usability.
                </p>
              </motion.div>
            </div>
          </section>

          {/* ===== WHO THIS IS FOR ===== */}
          <section className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Circle className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">For Whom</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
                  Who this page is designed for
                </h2>
                
                <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                  <p className="text-zinc-300 text-xl">
                    Bitcoin 2026 is designed for investors, professionals, and decision-makers who already have — or are evaluating — long-term exposure to Bitcoin and require ongoing clarity rather than episodic research.
                  </p>
                  <p className="text-zinc-600">
                    It is not designed for day traders, signal-driven strategies, or speculative short-term positioning.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ===== A LIVING PRODUCT ===== */}
          <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4 mb-8">
                  <Circle className="w-2 h-2 text-accent fill-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">Living Product</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
                  A living product, not a one-time document
                </h2>
                
                <div className="space-y-4 text-zinc-400 text-xl leading-relaxed">
                  <p>This page evolves over time.</p>
                  <p>Data refreshes continuously.</p>
                  <p>The strategic framework adapts as the market changes.</p>
                </div>
                <p className="text-zinc-600 text-lg mt-8">
                  What you access today is not identical to what you will see in six months — by design.
                </p>
              </motion.div>
            </div>
          </section>
        </div>

        {/* ===== ACCESS AND UPDATES ===== */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-zinc-900/80 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,hsl(var(--accent)/0.1),transparent)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8 leading-tight">
                Access and updates
              </h2>
              
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed mb-16">
                <p>
                  Access is provided via subscription to ensure continuous updates, maintenance of real-time data, and ongoing analytical refinement.
                </p>
                <p className="text-zinc-600">
                  This is not a one-off purchase of static content, but ongoing access to a maintained intelligence page.
                </p>
              </div>

              {/* Final CTA */}
              <div className="max-w-md mx-auto">
                <AccessCard compact />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <section className="py-16 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-600 text-sm tracking-wide">
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
