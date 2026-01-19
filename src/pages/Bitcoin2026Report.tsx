import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { ArrowUp, TrendingUp, Target, Lightbulb, HelpCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FearGreedIndex } from "@/components/FearGreedIndex";
import { OnChainMetrics } from "@/components/OnChainMetrics";
import { ETFFlowsTracker } from "@/components/ETFFlowsTracker";
import { ModelBacktesting } from "@/components/ModelBacktesting";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { useBitcoinReportData } from "@/hooks/useBitcoinReportData";
import { useTwelveDataBtc } from "@/hooks/useTwelveDataBtc";
import { useBitcoinAllocationModels } from "@/hooks/useBitcoinAllocationModels";
import { supabase } from "@/integrations/supabase/client";
import BitcoinDynamicAllocationHero from "@/components/BitcoinDynamicAllocationHero";
import { 
  ModelDashboard, 
  ModelComparisonTable, 
  DynamicRanges, 
  QuarterlyCommentary, 
  MethodologyDisclaimer 
} from "@/components/bitcoin";

// Glossary definitions
const glossary: Record<string, string> = {
  "M2": "Monetary aggregate that includes cash, bank deposits, and short-term financial instruments.",
  "real rates": "Real interest rates, calculated by subtracting inflation from nominal rates.",
  "ETF flows": "Capital inflows or outflows from Bitcoin ETFs. Key indicator of institutional demand.",
  "halving": "Programmatic event that halves the mining reward every 210,000 blocks.",
};

// Glossary Term Component
const GlossaryTerm = ({ term, children }: { term: string; children: React.ReactNode }) => {
  const definition = glossary[term];
  if (!definition) return <>{children}</>;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted decoration-primary/50 cursor-help hover:decoration-primary transition-colors inline-flex items-baseline gap-0.5">
          {children}
          <HelpCircle className="w-3 h-3 text-primary/60 inline" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{definition}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Animated Chapter Section Component
const ChapterSection = ({ children, id, dataSection }: { children: React.ReactNode; id: string; dataSection: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      data-section={dataSection}
      className="mb-16 scroll-mt-20 print-section"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ willChange: 'auto' }}
    >
      {children}
    </motion.section>
  );
};

// Key Takeaways Component
const KeyTakeaways = ({ insights }: { insights: string[] }) => {
  const colors = [
    'from-primary/10 to-primary/5 border-primary/20',
    'from-accent/10 to-accent/5 border-accent/20',
    'from-blue-500/10 to-blue-500/5 border-blue-500/20',
    'from-purple-500/10 to-purple-500/5 border-purple-500/20',
  ];

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-background border-2 border-border/60">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Key Takeaways</h3>
      </div>
      <div className="grid gap-3">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} border`}
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{insight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [accessChecking, setAccessChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessEmail, setAccessEmail] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState<string>("");
  const { data: bitcoinData, loading: bitcoinLoading } = useBitcoinReportData();
  const { data: twelveData, isLoading: twelveLoading } = useTwelveDataBtc();
  const { models, commentary, loading: modelsLoading, lastUpdate: modelsLastUpdate, getCurrentQuarter } = useBitcoinAllocationModels();

  const ADMIN_EMAILS = ["edoardo.grigione@aries76.com"];

  // Check access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storedEmail = localStorage.getItem("bitcoin_report_email");
        const userEmail = user?.email || storedEmail;
        setAccessEmail(userEmail || null);

        if (userEmail && ADMIN_EMAILS.some(admin => admin.toLowerCase() === userEmail.toLowerCase())) {
          setHasAccess(true);
          setAccessChecking(false);
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true' && storedEmail) {
          const { data, error } = await supabase.functions.invoke("check-page-access", {
            body: { email: storedEmail, page_slug: "bitcoin-2026-report" },
          });
          if (!error && data?.hasAccess === true) {
            setHasAccess(true);
            setAccessChecking(false);
            return;
          }
        }

        if (!userEmail) {
          setHasAccess(false);
          setAccessChecking(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke("check-page-access", {
          body: { email: userEmail, page_slug: "bitcoin-2026-report" },
        });

        setHasAccess(!error && data?.hasAccess === true);
      } catch (err) {
        console.error("Access check failed:", err);
        setHasAccess(false);
      } finally {
        setAccessChecking(false);
      }
    };

    checkAccess();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (accessChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  const handleManualEmailVerify = async () => {
    const email = manualEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    
    setAccessChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-page-access", {
        body: { email, page_slug: "bitcoin-2026-report" },
      });
      
      if (!error && data?.hasAccess === true) {
        localStorage.setItem('bitcoin_report_email', email);
        setAccessEmail(email);
        setHasAccess(true);
      } else {
        window.location.href = '/bitcoin-2026-report-preview';
      }
    } catch {
      window.location.href = '/bitcoin-2026-report-preview';
    } finally {
      setAccessChecking(false);
    }
  };

  if (!hasAccess) {
    if (!accessEmail) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold text-foreground">Access Required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email you used to purchase or receive access.
            </p>
            <div className="mt-5 space-y-3">
              <Input
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="you@company.com"
                inputMode="email"
                autoComplete="email"
                onKeyDown={(e) => e.key === 'Enter' && handleManualEmailVerify()}
              />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleManualEmailVerify} disabled={accessChecking}>
                  {accessChecking ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Continue'}
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = '/bitcoin-2026-report-preview')}>
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/bitcoin-2026-report-preview" replace />;
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <TooltipProvider>
      <Helmet>
        <title>Bitcoin Dynamic Allocation | ARIES76</title>
        <meta name="description" content="Bitcoin Dynamic Allocation Model: A rules-based decision framework for disciplined Bitcoin capital allocation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
          
          <div className="container max-w-5xl mx-auto px-6 py-20 md:py-28 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 mb-6 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Institutional Research</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-[0.9] tracking-tight">
                <span className="text-white">Bitcoin</span><br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Dynamic Allocation</span><br />
                <span className="text-2xl md:text-3xl lg:text-4xl text-gray-400 font-medium tracking-wide">Q1 2026 Edition</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-6 leading-relaxed max-w-2xl font-light">
                Rules-Based Decision Framework for Disciplined Bitcoin Capital Allocation
              </p>

              {/* Live Bitcoin Price */}
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-400">₿</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Live Price</span>
                    <AnimatePresence mode="wait">
                      {(twelveLoading && bitcoinLoading) ? (
                        <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse" />
                      ) : (
                        <motion.span
                          key={twelveData?.bitcoin_price_usd || bitcoinData?.bitcoin_price_usd}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold text-white tabular-nums"
                        >
                          ${(twelveData?.bitcoin_price_usd || bitcoinData?.bitcoin_price_usd)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="w-px h-10 bg-orange-500/20"></div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">EUR</span>
                  <span className="text-lg font-semibold text-gray-300 tabular-nums">
                    €{(twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                  </span>
                </div>
                {twelveData?.change_24h !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${twelveData.change_24h >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <ArrowUp className={`w-3.5 h-3.5 ${twelveData.change_24h >= 0 ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                    <span className={`text-sm font-semibold tabular-nums ${twelveData.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(twelveData.change_24h).toFixed(2)}%
                    </span>
                    <span className="text-xs text-gray-500">24h</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <span className="text-xs text-green-400">LIVE</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Positioning Hero */}
        <BitcoinDynamicAllocationHero />

        {/* Main Content */}
        <div className="container max-w-5xl mx-auto px-6 py-12">
          
          {/* ===== SECTION 1: EXECUTIVE SUMMARY ===== */}
          <ChapterSection id="executive-summary" dataSection="executive-summary">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Executive Summary</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Macro Analysis & Price Framework
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Bitcoin enters 2026 within a structural bull market supported by unprecedented institutional adoption through spot ETFs, corporate treasury strategies, and potential sovereign reserve policies. Our quantitative framework integrates macro-liquidity impulses, on-chain supply dynamics, and derivatives positioning to generate scenario-weighted price targets.
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                The macroeconomic backdrop remains constructive. <GlossaryTerm term="M2">Global M2</GlossaryTerm> expansion continues as central banks pivot toward accommodation, while <GlossaryTerm term="real rates">real rates</GlossaryTerm> compress, enhancing Bitcoin's relative attractiveness as a non-yielding asset with asymmetric return potential.
              </p>

              {/* Price Targets Summary */}
              <div className="p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" />
                  2026 Price Target Scenarios
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Base Case (60%)</div>
                    <div className="text-2xl font-bold text-primary">$96k – $132k</div>
                    <div className="text-xs text-muted-foreground mt-2">Post-halving normalization</div>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center">
                    <div className="text-sm text-muted-foreground mb-1">High Case (25%)</div>
                    <div className="text-2xl font-bold text-accent">$180k – $260k</div>
                    <div className="text-xs text-muted-foreground mt-2">ETF flows + macro tailwinds</div>
                  </div>
                  <div className="p-5 rounded-xl bg-card border border-border/40 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Stress Case (15%)</div>
                    <div className="text-2xl font-bold text-muted-foreground">$45k – $60k</div>
                    <div className="text-xs text-muted-foreground mt-2">Macro risk-off scenario</div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Probability-Weighted Target</span>
                    <span className="text-xl font-bold text-primary">$138,000</span>
                  </div>
                </div>
              </div>

              <KeyTakeaways insights={[
                "Institutional target of $138,000 represents probability-weighted expected value across Base ($96k-$132k, 60%), High ($180k-$260k, 25%), and Stress ($45k-$60k, 15%) scenarios.",
                "Macro-liquidity backdrop remains constructive: M2 expansion continues while real rates compress, enhancing Bitcoin's relative attractiveness.",
                "ETF flows create quasi-inelastic demand channels with longer holding periods than retail spot buyers, reducing circulating supply elasticity."
              ]} />
            </div>
          </ChapterSection>

          {/* ===== SECTION 2: REAL-TIME DATA MODULES ===== */}
          <ChapterSection id="real-time-data" dataSection="real-time-data">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Real-Time Market Intelligence</h2>
              <p className="text-muted-foreground">Live data feeds from institutional-grade sources</p>
            </div>

            {/* Fear & Greed Index */}
            <div className="mb-8">
              <FearGreedIndex />
            </div>

            {/* ETF Flows */}
            <div className="mb-8">
              <ETFFlowsTracker />
            </div>

            {/* On-Chain Metrics */}
            <div className="mb-8">
              <OnChainMetrics />
            </div>

            {/* Correlation Matrix */}
            <div className="mb-8">
              <CorrelationMatrix />
            </div>

            {/* Model Backtesting */}
            <div className="mb-8">
              <ModelBacktesting />
            </div>
          </ChapterSection>

          {/* ===== SECTION 3: MODEL DASHBOARD ===== */}
          <ChapterSection id="model-dashboard" dataSection="model-dashboard">
            <ModelDashboard 
              models={models} 
              quarter={getCurrentQuarter()} 
              lastUpdate={modelsLastUpdate} 
              loading={modelsLoading} 
            />
          </ChapterSection>

          {/* ===== SECTION 4: MODEL COMPARISON ===== */}
          <ChapterSection id="model-comparison" dataSection="model-comparison">
            <ModelComparisonTable models={models} loading={modelsLoading} />
          </ChapterSection>

          {/* ===== SECTION 5: DYNAMIC RANGES ===== */}
          <ChapterSection id="dynamic-ranges" dataSection="dynamic-ranges">
            <DynamicRanges models={models} loading={modelsLoading} />
          </ChapterSection>

          {/* ===== SECTION 6: QUARTERLY COMMENTARY ===== */}
          <ChapterSection id="model-commentary" dataSection="model-commentary">
            <QuarterlyCommentary 
              commentary={commentary} 
              quarter={getCurrentQuarter()} 
              loading={modelsLoading} 
            />
          </ChapterSection>

          {/* ===== SECTION 7: METHODOLOGY ===== */}
          <MethodologyDisclaimer />

          {/* Disclaimer Footer */}
          <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full bg-primary rounded-full"></div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Disclaimer</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    This report is provided for informational purposes only and does not constitute investment advice. Bitcoin and digital assets are highly volatile. Investors should conduct their own due diligence and consult qualified financial advisors.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground">© 2025 ARIES76 Capital Intelligence</p>
                <a href="mailto:edoardo.grigione@aries76.com" className="text-sm text-primary hover:text-accent transition-colors font-medium">
                  edoardo.grigione@aries76.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-4 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </TooltipProvider>
  );
};

export default Bitcoin2026Report;
