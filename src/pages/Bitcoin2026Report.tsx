import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { ArrowUp, Target, BarChart3, TrendingUp, Lightbulb, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MethodologyDisclaimer,
  PortfolioAnalysisDashboard 
} from "@/components/bitcoin";

// Animated Chapter Section Component
const ChapterSection = ({ children, id, dataSection }: { children: React.ReactNode; id: string; dataSection: string }) => {
  const ref = useRef(null);

  return (
    <motion.section
      ref={ref}
      id={id}
      data-section={dataSection}
      className="mb-24 scroll-mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

const Bitcoin2026Report = () => {
  const [accessChecking, setAccessChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessEmail, setAccessEmail] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState<string>("");
  const { data: bitcoinData, loading: bitcoinLoading } = useBitcoinReportData();
  const { data: twelveData, isLoading: twelveLoading } = useTwelveDataBtc();
  const { models, commentary, loading: modelsLoading, lastUpdate: modelsLastUpdate, getCurrentQuarter } = useBitcoinAllocationModels();

  // Admin emails with permanent access
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
        const successParam = urlParams.get('success');
        
        if (successParam === 'true' && storedEmail) {
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

        if (error) {
          console.error("check-page-access error:", error);
          setHasAccess(false);
        } else {
          setHasAccess(data?.hasAccess === true);
        }
      } catch (err) {
        console.error("Access check failed:", err);
        setHasAccess(false);
      } finally {
        setAccessChecking(false);
      }
    };

    checkAccess();
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
        window.location.href = '/bitcoin-dynamic-allocation-preview';
      }
    } catch (err) {
      console.error("Manual verification failed:", err);
      window.location.href = '/bitcoin-dynamic-allocation-preview';
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
                <Button
                  className="flex-1"
                  onClick={handleManualEmailVerify}
                  disabled={accessChecking}
                >
                  {accessChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = '/bitcoin-dynamic-allocation-preview')}>
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <Navigate to="/bitcoin-dynamic-allocation-preview" replace />;
  }

  const chapters = [
    { id: "model-dashboard", number: "XX", title: "Model Dashboard – Current Quarter", icon: Target },
    { id: "model-comparison", number: "XXI", title: "Model Comparison Table", icon: BarChart3 },
    { id: "dynamic-ranges", number: "XXII", title: "Bitcoin 2026 – Dynamic Ranges", icon: TrendingUp },
    { id: "model-commentary", number: "XXIII", title: "Quarterly Model Commentary", icon: Lightbulb },
    { id: "portfolio-analysis", number: "XXIV", title: "Portfolio Analysis Engine", icon: BarChart3 },
  ];

  return (
    <>
      <Helmet>
        <title>Bitcoin Dynamic Allocation | ARIES76</title>
        <meta 
          name="description" 
          content="Bitcoin Dynamic Allocation Model: A rules-based decision framework for disciplined Bitcoin capital allocation. Institutional logic, quarterly updates, macro-liquidity analysis." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <motion.div 
            className="absolute top-1/2 right-[10%] -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-48 h-48 rounded-full border-2 border-orange-500/30 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-4 rounded-full border border-orange-500/20"></div>
                <div className="absolute inset-8 rounded-full border border-dashed border-orange-500/15"></div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-orange-500/80">₿</span>
              </div>
            </div>
          </motion.div>
          
          <div className="container max-w-6xl mx-auto px-6 py-28 md:py-36 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Paid Access</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Bitcoin</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Dynamic Allocation</span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-gray-400 font-medium tracking-wide">Q1 2026 Edition</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Rules-Based Decision Framework for Disciplined Bitcoin Capital Allocation
              </motion.p>

              {/* Live Bitcoin Price Ticker */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-400">₿</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Live Price</span>
                      <AnimatePresence mode="wait">
                        {(twelveLoading && bitcoinLoading) ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-8 w-32 bg-gray-700/50 rounded animate-pulse"
                          />
                        ) : (
                          <motion.span
                            key={twelveData?.bitcoin_price_usd || bitcoinData?.bitcoin_price_usd}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
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
                    <AnimatePresence mode="wait">
                      {(twelveLoading && bitcoinLoading) ? (
                        <motion.div
                          key="loading-eur"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"
                        />
                      ) : (
                        <motion.span
                          key={twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-lg font-semibold text-gray-300 tabular-nums"
                        >
                          €{(twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* 24h Change */}
                  {(twelveData?.change_24h !== undefined && twelveData?.change_24h !== null) ? (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      twelveData.change_24h >= 0 
                        ? 'bg-green-500/10' 
                        : 'bg-red-500/10'
                    }`}>
                      {twelveData.change_24h >= 0 ? (
                        <ArrowUp className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-red-400 rotate-180" />
                      )}
                      <span className={`text-sm font-semibold tabular-nums ${
                        twelveData.change_24h >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {Math.abs(twelveData.change_24h).toFixed(2)}%
                      </span>
                      <span className="text-xs text-gray-500">24h</span>
                    </div>
                  ) : bitcoinData?.raw_data?.bitcoin?.change_24h !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      bitcoinData.raw_data.bitcoin.change_24h >= 0 
                        ? 'bg-green-500/10' 
                        : 'bg-red-500/10'
                    }`}>
                      {bitcoinData.raw_data.bitcoin.change_24h >= 0 ? (
                        <ArrowUp className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-red-400 rotate-180" />
                      )}
                      <span className={`text-sm font-semibold tabular-nums ${
                        bitcoinData.raw_data.bitcoin.change_24h >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {Math.abs(bitcoinData.raw_data.bitcoin.change_24h).toFixed(2)}%
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
            </motion.div>
          </div>
        </div>

        {/* Positioning Hero - Decision Framework Framing */}
        <BitcoinDynamicAllocationHero />

        {/* Table of Contents - Gated Modules Only */}
        <div className="container max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Allocation Framework Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  const element = document.getElementById(chapter.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group text-left p-6 rounded-2xl border-2 border-border/40 bg-card hover:border-orange-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <chapter.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-muted-foreground mb-1">
                      CHAPTER {chapter.number}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gated Content - Allocation Models */}
        <div className="container max-w-5xl mx-auto px-6 pb-24">
          
          {/* Chapter XX: Model Dashboard */}
          <ChapterSection id="model-dashboard" dataSection="model-dashboard">
            <ModelDashboard 
              models={models} 
              quarter={getCurrentQuarter()} 
              lastUpdate={modelsLastUpdate} 
              loading={modelsLoading} 
            />
          </ChapterSection>

          {/* Chapter XXI: Model Comparison Table */}
          <ChapterSection id="model-comparison" dataSection="model-comparison">
            <ModelComparisonTable models={models} loading={modelsLoading} />
          </ChapterSection>

          {/* Chapter XXII: Dynamic Ranges */}
          <ChapterSection id="dynamic-ranges" dataSection="dynamic-ranges">
            <DynamicRanges models={models} loading={modelsLoading} />
          </ChapterSection>

          {/* Chapter XXIII: Quarterly Commentary */}
          <ChapterSection id="model-commentary" dataSection="model-commentary">
            <QuarterlyCommentary 
              commentary={commentary} 
              quarter={getCurrentQuarter()} 
              loading={modelsLoading} 
            />
          </ChapterSection>

          {/* Chapter XXIV: Portfolio Analysis Engine */}
          <ChapterSection id="portfolio-analysis" dataSection="portfolio-analysis">
            <PortfolioAnalysisDashboard />
          </ChapterSection>

          {/* Methodology & Disclaimers */}
          <MethodologyDisclaimer />

          {/* Free Research CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-background border border-border/40 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Looking for the full technical analysis?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Access our comprehensive Bitcoin research including macro-liquidity frameworks, price scenarios, ETF flow analysis, on-chain metrics, and more.
            </p>
            <Button 
              variant="outline" 
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={() => window.location.href = '/bitcoin-research'}
            >
              View Free Bitcoin Research →
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bitcoin2026Report;
