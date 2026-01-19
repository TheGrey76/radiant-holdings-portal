import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart, Lightbulb, HelpCircle, Shield, Globe, Scale, Calendar, Zap, AlertTriangle, GitBranch, LogOut, Send, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  BitcoinPriceChart, 
  M2LiquidityChart, 
  RealRatesChart, 
  PriceScenariosChart, 
  ETFFlowChart, 
  MiningEconomicsChart 
} from "@/components/InstitutionalCharts";
import { ReportSearch } from "@/components/ReportSearch";
import { FearGreedIndex } from "@/components/FearGreedIndex";
import { OnChainMetrics } from "@/components/OnChainMetrics";
import { ETFFlowsTracker } from "@/components/ETFFlowsTracker";
import { ModelBacktesting } from "@/components/ModelBacktesting";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { useBitcoinReportData } from "@/hooks/useBitcoinReportData";
import { useTwelveDataBtc } from "@/hooks/useTwelveDataBtc";

// Glossary definitions
const glossary: Record<string, string> = {
  "M2": "Monetary aggregate that includes cash, bank deposits, and short-term financial instruments.",
  "real rates": "Real interest rates, calculated by subtracting inflation from nominal rates.",
  "ETF flows": "Capital inflows or outflows from Bitcoin ETFs. Key indicator of institutional demand.",
  "halving": "Programmatic event that halves the mining reward for Bitcoin every 210,000 blocks.",
  "store of value": "Asset that maintains its value over time without depreciating.",
  "hash rate": "Total computational power of the Bitcoin network.",
  "on-chain": "Data derived directly from the Bitcoin blockchain.",
  "QE": "Quantitative Easing - expansionary monetary policy.",
  "Fed pivot": "Change in direction of Federal Reserve monetary policy.",
  "risk-on": "Market environment where investors are willing to take risks.",
  "liquidity conditions": "Availability of capital in the financial system.",
  "ETF": "Exchange-Traded Fund - investment fund traded on stock exchanges.",
  "macro-liquidity": "Aggregate of global liquidity determined by central bank monetary policies."
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
      className="mb-24 scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
    <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-background border-2 border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Key Takeaways</h3>
      </div>
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-5 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} border-2`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
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

const BitcoinResearch = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { data: bitcoinData, loading: bitcoinLoading } = useBitcoinReportData();
  const { data: twelveData, isLoading: twelveLoading } = useTwelveDataBtc();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.getAttribute('data-section') || '');
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample data for charts
  const btcHistoricalData = [
    { year: "2020", price: 29000 },
    { year: "2021", price: 69000 },
    { year: "2022", price: 16500 },
    { year: "2023", price: 42000 },
    { year: "2024", price: 73000 },
    { year: "2025", price: 98000 },
  ];

  const m2LiquidityData = [
    { year: "2020", m2: 18.5 },
    { year: "2021", m2: 20.1 },
    { year: "2022", m2: 21.5 },
    { year: "2023", m2: 21.0 },
    { year: "2024", m2: 21.4 },
    { year: "2025", m2: 22.4 },
  ];

  const realRatesData = [
    { year: "2020", rate: -1.0 },
    { year: "2021", rate: -2.5 },
    { year: "2022", rate: 1.5 },
    { year: "2023", rate: 2.1 },
    { year: "2024", rate: 1.5 },
    { year: "2025", rate: 0.9 },
  ];

  const priceScenarioData = [
    { month: "Q1", base: 98, high: 115, stress: 75 },
    { month: "Q2", base: 110, high: 145, stress: 65 },
    { month: "Q3", base: 120, high: 180, stress: 55 },
    { month: "Q4", base: 132, high: 220, stress: 50 },
  ];

  const chapters = [
    { id: "chapter-1", number: "I", title: "Executive Summary", icon: TrendingUp },
    { id: "chapter-9", number: "IX", title: "Scenario Analysis", icon: Target },
    { id: "chapter-10", number: "X", title: "2026 Price Targets", icon: TrendingUp },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <Helmet>
        <title>Bitcoin Research 2026 | ARIES76</title>
        <meta name="description" content="Free Bitcoin research with real-time data, ETF flows, on-chain metrics, and institutional analysis. Open access to macro-liquidity framework." />
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
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Free Access</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Bitcoin</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Research 2026</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Real-time data, institutional analysis, and macro-liquidity framework — open access
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
                    <span className="text-lg font-semibold text-gray-300 tabular-nums">
                      €{(twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 ml-2">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <ReportSearch chapters={chapters} glossary={glossary} />
              </motion.div>

              <motion.div 
                className="flex flex-wrap items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-semibold text-white">ARIES76</span>
                    <span className="text-sm text-gray-500 ml-2">Capital Intelligence</span>
                  </div>
                </div>
                {bitcoinData?.current_regime && (
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                    bitcoinData.current_regime === 'EXPANSION' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : bitcoinData.current_regime === 'CONTRACTION'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <Activity className={`w-3.5 h-3.5 ${
                      bitcoinData.current_regime === 'EXPANSION' ? 'text-green-400' : bitcoinData.current_regime === 'CONTRACTION' ? 'text-red-400' : 'text-blue-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      bitcoinData.current_regime === 'EXPANSION' ? 'text-green-400' : bitcoinData.current_regime === 'CONTRACTION' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {bitcoinData.current_regime.charAt(0) + bitcoinData.current_regime.slice(1).toLowerCase()} Regime
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Live Data Banner */}
        <div className="bg-gradient-to-r from-green-500/10 via-primary/10 to-green-500/10 border-y border-green-500/30">
          <div className="container max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Live Data</span>
              </div>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <span className="text-sm text-foreground">Updated daily at 6:00 AM CET</span>
            </div>
          </div>
        </div>

        {/* Fear & Greed + Live Market Intelligence */}
        <div className="container max-w-6xl mx-auto px-6 pt-8">
          <div className="max-w-md mb-8">
            <FearGreedIndex />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Live Market Intelligence</h2>
            <p className="text-muted-foreground">Real-time data powering institutional analysis</p>
          </div>
          
          <div className="grid gap-6">
            <OnChainMetrics />
            <ETFFlowsTracker />
            <ModelBacktesting />
            <CorrelationMatrix />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="container max-w-6xl mx-auto px-6 pt-16 pb-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-10 border border-primary/20 shadow-xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <span className="text-primary">Executive Summary</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</span>
                <p className="text-muted-foreground leading-relaxed">
                  Bitcoin's 2026 trajectory is governed by global <GlossaryTerm term="M2">M2</GlossaryTerm> liquidity impulses and <GlossaryTerm term="real rates">real-rate</GlossaryTerm> dynamics—not simplistic halving cycles.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</span>
                <p className="text-muted-foreground leading-relaxed">
                  Institutional target: $138,000 (probability-weighted). Base case ($96k-$132k, 60%), High convexity ($180k-$260k, 25%), Stress ($45k-$60k, 15%).
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</span>
                <p className="text-muted-foreground leading-relaxed">
                  Our quantitative framework integrates Hidden Markov regime models, ETF flow dynamics, derivatives positioning, and on-chain supply elasticity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-6 pb-16">
          {/* Chapter I - Macro Analysis */}
          <ChapterSection id="chapter-1" dataSection="chapter-1">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter I</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Macro–Liquidity Regime Analysis
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Bitcoin has evolved into a <GlossaryTerm term="liquidity conditions">liquidity-sensitive</GlossaryTerm> macro asset whose price formation is dominated by global <GlossaryTerm term="M2">M2</GlossaryTerm> impulses, <GlossaryTerm term="real rates">real-rate</GlossaryTerm> dynamics, and <GlossaryTerm term="ETF">ETF</GlossaryTerm> market maker flows.
                </p>
              </div>

              <BitcoinPriceChart data={btcHistoricalData} />
              <M2LiquidityChart data={m2LiquidityData} />
              <RealRatesChart data={realRatesData} />

              <KeyTakeaways insights={[
                "Bitcoin is now dominated by global M2 impulses and real-rate dynamics rather than halving cycles.",
                "M2 acceleration produces convex upside responses; stagnation triggers volatility spikes.",
                "Declining real yields reduce opportunity cost for non-yielding assets like Bitcoin.",
                "Institutional ETF flows increasingly govern price formation."
              ]} />
            </div>
          </ChapterSection>

          {/* Chapter IX - Scenario Analysis */}
          <ChapterSection id="chapter-9" dataSection="chapter-9">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter IX</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Scenario Analysis & Risk Framework
              </h2>
            </div>

            <PriceScenariosChart data={priceScenarioData} />

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <h4 className="font-bold text-foreground mb-2">Base Case</h4>
                <p className="text-sm text-foreground/70">$96,000 – $132,000</p>
                <p className="text-xs text-muted-foreground mt-2">Moderate liquidity expansion, gradual Fed easing</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">25%</div>
                <h4 className="font-bold text-foreground mb-2">High Convexity</h4>
                <p className="text-sm text-foreground/70">$180,000 – $260,000</p>
                <p className="text-xs text-muted-foreground mt-2">Aggressive M2 growth, declining real yields</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/40">
                <div className="text-3xl font-bold text-muted-foreground mb-2">15%</div>
                <h4 className="font-bold text-foreground mb-2">Stress Scenario</h4>
                <p className="text-sm text-foreground/70">$45,000 – $60,000</p>
                <p className="text-xs text-muted-foreground mt-2">Renewed tightening, liquidity contraction</p>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Base case ($96k-$132k) assumes moderate Fed easing and gradual M2 expansion.",
              "High convexity scenario requires sustained global liquidity growth and declining real yields.",
              "Stress scenario only materializes under aggressive monetary tightening.",
              "Probability-weighted target: $138,000 for 2026."
            ]} />
          </ChapterSection>

          {/* Chapter X - Price Targets */}
          <ChapterSection id="chapter-10" dataSection="chapter-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter X</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                2026 Price Targets
              </h2>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 mb-8">
              <div className="text-center mb-8">
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Institutional Target (Probability-Weighted)</div>
                <div className="text-6xl font-black text-primary">$138,000</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-2xl font-bold text-foreground">$96k – $132k</div>
                  <div className="text-sm text-muted-foreground">Base Case Range</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-2xl font-bold text-accent">$180k – $260k</div>
                  <div className="text-sm text-muted-foreground">High Convexity</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50">
                  <div className="text-2xl font-bold text-muted-foreground">$45k – $60k</div>
                  <div className="text-sm text-muted-foreground">Stress Floor</div>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Our institutional target of $138,000 represents probability-weighted average across all scenarios.",
              "Real-time regime detection and macro indicators will refine targets quarterly.",
              "Price targets are dynamic and will be updated as M2 and real-rate data evolves."
            ]} />
          </ChapterSection>

          {/* CTA to Paid Allocation Models */}
          <div className="mt-16 p-10 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-500/10 border-2 border-orange-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-foreground">Dynamic Allocation Models</h2>
            </div>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Access our proprietary allocation framework with quarterly-updated portfolio models: Conservative, Balanced, and Aggressive allocations with dynamic price ranges and regime-based rebalancing signals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/bitcoin-2026-report-preview">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  View Allocation Models — €99
                </Button>
              </Link>
              <Link to="/bitcoin-2026-report-preview">
                <Button size="lg" variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="container max-w-6xl mx-auto px-6 pb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40">
            <h3 className="text-lg font-bold text-foreground mb-3">Disclaimer</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              This research is provided for informational purposes only and does not constitute investment advice. Bitcoin and digital assets are highly volatile. Investors should conduct their own due diligence and consult qualified financial advisors.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-border/40 mt-6">
              <p className="text-xs text-muted-foreground">© 2025 ARIES76 Capital Intelligence</p>
              <a href="mailto:edoardo.grigione@aries76.com" className="text-primary hover:text-accent transition-colors text-sm font-medium">
                edoardo.grigione@aries76.com
              </a>
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

export default BitcoinResearch;