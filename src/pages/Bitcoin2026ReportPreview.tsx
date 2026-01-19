// Bitcoin Dynamic Allocation - Live Models Preview Page
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
  Shield,
  Target,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Bitcoin2026ReportPreview = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAccessRequest = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem('bitcoin_report_email', email.toLowerCase().trim());
      
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('src') || 'direct';
      
      const { data, error } = await supabase.functions.invoke('create-bitcoin-report-checkout', {
        body: { 
          email,
          source,
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

  // Allocation Model Card Component
  const AllocationModelCard = ({ 
    name, 
    objective, 
    status, 
    statusColor 
  }: { 
    name: string; 
    objective: string; 
    status: string;
    statusColor: 'low' | 'medium' | 'high';
  }) => {
    const statusColors = {
      low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      high: 'text-orange-400 bg-orange-400/10 border-orange-400/30'
    };

    return (
      <motion.div 
        className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-1">{name}</h4>
          <p className="text-sm text-zinc-400">{objective}</p>
        </div>
        
        <div className="mb-4">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Current Status</span>
          <div className={`mt-2 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[statusColor]}`}>
            {status}
          </div>
        </div>
        
        <p className="text-xs text-zinc-500 italic">
          Full allocation ranges and targets available with access
        </p>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Bitcoin Dynamic Allocation – Live Models | ARIES76</title>
        <meta name="description" content="A rules-based framework to observe how Bitcoin exposure evolves over time. Not a report. Not advice. A live reference model updated quarterly." />
        
        <meta property="og:title" content="Bitcoin Dynamic Allocation – Live Models" />
        <meta property="og:description" content="A rules-based framework to observe how Bitcoin exposure evolves over time." />
        <meta property="og:image" content="https://aries76.com/bitcoin-2026-og.png" />
        <meta property="og:url" content="https://aries76.com/bitcoin-2026-report-preview" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitcoin Dynamic Allocation | ARIES76" />
        <meta name="twitter:description" content="A rules-based framework to observe how Bitcoin exposure evolves over time." />
        <meta name="twitter:image" content="https://aries76.com/bitcoin-2026-og.png" />
      </Helmet>

      <div className="min-h-screen bg-zinc-950">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative overflow-hidden border-b border-zinc-800/40">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }} />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px]" />
          
          <div className="container max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              {/* Bitcoin Logo */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-5xl md:text-6xl font-bold text-white">₿</span>
                  </motion.div>
                  <div className="absolute -inset-2 rounded-full border border-orange-500/30 animate-pulse" />
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Bitcoin Dynamic Allocation</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="text-lg md:text-xl text-zinc-300 mb-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                A rules-based framework to observe how Bitcoin exposure evolves over time
              </motion.p>
              
              {/* Micro text */}
              <motion.p 
                className="text-base text-zinc-500 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Not a report. Not advice.
              </motion.p>
              
              <motion.p 
                className="text-base text-zinc-400 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                A live reference model updated quarterly.
              </motion.p>

              {/* Micro-framing */}
              <motion.p 
                className="text-sm text-zinc-500 italic mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Designed for investors who want structure, not predictions.
              </motion.p>

              {/* Hero CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('access-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-accent hover:bg-accent/90 text-white font-medium h-14 px-8 text-base"
                >
                  Get 12-month access – €99
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 2: WHAT THIS IS ===== */}
        <section className="py-20 md:py-28 border-b border-zinc-800/40">
          <div className="container max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                What you are accessing
              </h2>
              
              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <p>
                  This is not a PDF you download once and forget. It's not a price prediction dressed up as research, and it's certainly not financial advice tailored to your specific situation.
                </p>
                
                <p>
                  What you're accessing is a <span className="text-white font-medium">dynamic, continuously updated page</span> that tracks how a rules-based allocation framework behaves over time. The data refreshes. The target levels evolve. The models adapt to changing market conditions—automatically, transparently, and without emotional interference.
                </p>
                
                <p>
                  The AI behind this system maintains consistency in the framework's logic. It doesn't make decisions for you. It provides a stable reference point—a disciplined lens through which to view Bitcoin allocation, updated quarterly with fresh data and recalibrated thresholds.
                </p>
                
                <p className="text-zinc-400 border-l-2 border-accent/40 pl-4 italic">
                  When you purchase access, you're not buying a file. You're buying ongoing access to a living model.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 3: STANDARD ALLOCATION MODELS ===== */}
        <section className="py-20 md:py-28 border-b border-zinc-800/40 bg-zinc-900/20">
          <div className="container max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Standard Allocation Models – Current Status
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Three distinct models for different risk profiles, each with their own rules and thresholds.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <AllocationModelCard 
                name="Conservative Allocation Model"
                objective="Exposure control"
                status="Low Exposure"
                statusColor="low"
              />
              
              <AllocationModelCard 
                name="Balanced Allocation Model"
                objective="Cycle-aware participation"
                status="Medium Exposure"
                statusColor="medium"
              />
              
              <AllocationModelCard 
                name="Aggressive Allocation Model"
                objective="Asymmetric long-term exposure"
                status="High Exposure"
                statusColor="high"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: HOW THE MODELS WORK ===== */}
        <section className="py-20 md:py-28 border-b border-zinc-800/40">
          <div className="container max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                How these models behave
              </h2>
              
              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <p>
                  Each model operates on a shared set of fundamental rules. They observe price levels, measure volatility regimes, and track drawdown thresholds. But each model applies these inputs differently—calibrated for its specific risk tolerance and time horizon.
                </p>
                
                <p>
                  The framework is designed for <span className="text-white font-medium">multi-year horizons</span>. It doesn't chase headlines or react to daily noise. News events, Twitter drama, and short-term speculation are explicitly excluded from the decision logic.
                </p>
                
                <p>
                  Updates happen <span className="text-white font-medium">quarterly</span>. Each revision recalibrates target levels based on realized data—not forecasts, not opinions. The goal is consistency: a stable reference that you can return to without wondering if the rules changed overnight.
                </p>
                
                <p>
                  Crucially, these are <span className="text-white font-medium">observation models, not trading signals</span>. There are no buy or sell alerts. No notifications telling you what to do. The framework shows you where the model stands; what you do with that information is entirely your decision.
                </p>
              </div>

              {/* Key characteristics */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <RefreshCw className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Quarterly Updates</p>
                    <p className="text-xs text-zinc-400">Models recalibrate every quarter</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <Target className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Rules-Based Logic</p>
                    <p className="text-xs text-zinc-400">No discretionary overrides</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">No Trading Signals</p>
                    <p className="text-xs text-zinc-400">Observation only, your decisions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <TrendingUp className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Multi-Year Horizon</p>
                    <p className="text-xs text-zinc-400">Built for patient capital</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 5: PRICING & ACCESS ===== */}
        <section id="access-section" className="py-20 md:py-28">
          <div className="container max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Simple access. No tiers.
              </h2>
              
              <div className="mt-8 p-8 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="mb-6">
                  <span className="text-5xl md:text-6xl font-bold text-white">€99</span>
                  <p className="text-zinc-400 mt-2">12 months access</p>
                </div>
                
                <div className="space-y-3 text-sm text-zinc-300 mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All three allocation models</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All quarterly updates</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All future revisions</span>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-sm mx-auto">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-accent focus:ring-accent/30 h-12 text-center"
                    onKeyDown={(e) => e.key === 'Enter' && handleAccessRequest()}
                  />
                  <Button 
                    onClick={handleAccessRequest}
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-medium h-12 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Unlock the allocation framework
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-zinc-500 mt-6">
                  One-time payment. No subscription. No hidden fees.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-zinc-800/40 py-12">
          <div className="container max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl mx-auto">
              This content is provided for informational purposes only and does not constitute financial, investment, or legal advice. 
              Past performance is not indicative of future results. Bitcoin is a highly volatile asset. 
              Always consult with a qualified financial advisor before making investment decisions.
            </p>
            <p className="text-xs text-zinc-600 mt-6">
              © 2026 ARIES76. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Bitcoin2026ReportPreview;
