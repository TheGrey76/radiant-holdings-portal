import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart, Lightbulb, HelpCircle, Shield, Globe, Scale, Calendar, Zap, AlertTriangle, GitBranch, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  "M2": "Monetary aggregate that includes cash, bank deposits, and short-term financial instruments. Measures the total amount of money available in the economy.",
  "real rates": "Real interest rates, calculated by subtracting inflation from nominal rates. Negative real rates make Bitcoin more attractive as a store of value.",
  "ETF flows": "Capital inflows or outflows from Bitcoin ETFs. Key indicator of institutional demand and professional investor sentiment.",
  "halving": "Programmatic event that halves the mining reward for Bitcoin every 210,000 blocks (approximately every 4 years), reducing the supply of new Bitcoin.",
  "store of value": "Asset that maintains its value over time without depreciating. Bitcoin is increasingly considered a 'digital gold' with this function.",
  "hash rate": "Total computational power of the Bitcoin network, a measure of security and miner adoption.",
  "on-chain": "Data and metrics derived directly from the Bitcoin blockchain, such as transactions, active addresses, and trading volume.",
  "QE": "Quantitative Easing - expansionary monetary policy in which central banks purchase assets to increase liquidity in the financial system.",
  "Fed pivot": "Change in direction of Federal Reserve monetary policy, typically from restrictive (high rates) to expansionary (low rates).",
  "risk-on": "Market environment where investors are willing to take risks and allocate capital to more volatile assets like stocks and cryptocurrencies.",
  "liquidity conditions": "Availability of capital in the financial system. Greater liquidity tends to favor assets like Bitcoin.",
  "ETF": "Exchange-Traded Fund - investment fund traded on stock exchanges that tracks an underlying asset or index, allowing simplified exposure.",
  "macro-liquidity": "Aggregate of global liquidity determined by central bank monetary policies, M2 growth, and credit conditions.",
  "balance-sheet": "Financial statement showing assets, liabilities, and equity of an entity. For central banks, it indicates monetary expansion or contraction.",
  "LADM": "Liquidity-Adjusted Demand Model - framework that models Bitcoin as a convex response to marginal liquidity impulse.",
  "HMM": "Hidden Markov Model - statistical model used for regime classification in financial markets.",
  "LTH": "Long-Term Holder - Bitcoin holders who have held their coins for extended periods, typically 155+ days.",
  "gamma": "Options Greek measuring the rate of change of delta. Dealer gamma positioning affects short-term price dynamics.",
  "contango": "Market condition where futures prices are higher than spot prices, typically reflecting confidence and liquidity expansion.",
  "backwardation": "Market condition where futures prices are lower than spot prices, often coinciding with funding stress.",
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
    { year: "2013", price: 0.1 },
    { year: "2014", price: 0.4 },
    { year: "2015", price: 0.3 },
    { year: "2016", price: 0.6 },
    { year: "2017", price: 19.5 },
    { year: "2018", price: 3.8 },
    { year: "2019", price: 7.2 },
    { year: "2020", price: 29.0 },
    { year: "2021", price: 69.0 },
    { year: "2022", price: 16.5 },
    { year: "2023", price: 42.0 },
    { year: "2024", price: 73.0 },
    { year: "2025", price: 108.0 },
  ];

  const m2LiquidityData = [
    { year: "2013", m2: 100 },
    { year: "2014", m2: 108 },
    { year: "2015", m2: 115 },
    { year: "2016", m2: 123 },
    { year: "2017", m2: 135 },
    { year: "2018", m2: 142 },
    { year: "2019", m2: 148 },
    { year: "2020", m2: 178 },
    { year: "2021", m2: 198 },
    { year: "2022", m2: 185 },
    { year: "2023", m2: 192 },
    { year: "2024", m2: 205 },
    { year: "2025", m2: 218 },
  ];

  const realRatesData = [
    { year: "2013", rate: -0.8 },
    { year: "2014", rate: -0.5 },
    { year: "2015", rate: 0.2 },
    { year: "2016", rate: -0.3 },
    { year: "2017", rate: 0.5 },
    { year: "2018", rate: 1.2 },
    { year: "2019", rate: 0.3 },
    { year: "2020", rate: -1.5 },
    { year: "2021", rate: -4.2 },
    { year: "2022", rate: 1.8 },
    { year: "2023", rate: 2.1 },
    { year: "2024", rate: 1.5 },
    { year: "2025", rate: 0.8 },
  ];

  const priceScenarioData = [
    { month: "Jan", base: 98, high: 185, stress: 52 },
    { month: "Mar", base: 105, high: 198, stress: 48 },
    { month: "May", base: 115, high: 215, stress: 50 },
    { month: "Jul", base: 120, high: 230, stress: 55 },
    { month: "Sep", base: 125, high: 245, stress: 52 },
    { month: "Nov", base: 130, high: 258, stress: 58 },
  ];

  const etfFlowData = [
    { week: "W1", inflows: 450, outflows: 120 },
    { week: "W2", inflows: 520, outflows: 95 },
    { week: "W3", inflows: 380, outflows: 150 },
    { week: "W4", inflows: 610, outflows: 110 },
    { week: "W5", inflows: 490, outflows: 130 },
    { week: "W6", inflows: 580, outflows: 105 },
  ];

  const miningCostData = [
    { quarter: "Q1", cost: 42, price: 98 },
    { quarter: "Q2", cost: 45, price: 115 },
    { quarter: "Q3", cost: 48, price: 125 },
    { quarter: "Q4", cost: 51, price: 130 },
  ];

  const chapters = [
    { id: "chapter-1", number: "I", title: "Executive Summary & Macro Analysis", icon: TrendingUp },
    { id: "chapter-2", number: "II", title: "Advanced Price Framework", icon: BarChart3 },
    { id: "chapter-3", number: "III", title: "On-Chain Intelligence", icon: Database },
    { id: "chapter-4", number: "IV", title: "Treasuries & Mining Economics", icon: Coins },
    { id: "chapter-5", number: "V", title: "Regulatory Outlook", icon: Scale },
    { id: "chapter-6", number: "VI", title: "Scenario Analysis", icon: Target },
    { id: "chapter-7", number: "VII", title: "2026 Price Projection", icon: TrendingUp },
    { id: "chapter-8", number: "VIII", title: "Risks & Uncertainties", icon: AlertTriangle },
    { id: "chapter-9", number: "IX", title: "ETF Flow Dynamics", icon: Network },
    { id: "chapter-10", number: "X", title: "Derivatives & Positioning", icon: Activity },
    { id: "chapter-11", number: "XI", title: "Risk Management Framework", icon: Shield },
    { id: "chapter-12", number: "XII", title: "Cross-Asset Correlations", icon: GitBranch },
    { id: "chapter-13", number: "XIII", title: "Macro Calendar 2026", icon: Calendar },
    { id: "chapter-14", number: "XIV", title: "Exit Strategy Framework", icon: LogOut },
    { id: "chapter-15", number: "XV", title: "Lightning Network & Layer 2", icon: Zap },
    { id: "chapter-16", number: "XVI", title: "Institutional & Sovereign Adoption", icon: Globe },
    { id: "chapter-17", number: "XVII", title: "Portfolio Construction Framework", icon: Layers },
    { id: "chapter-18", number: "XVIII", title: "Future Outlook & Catalysts", icon: LineChart },
    { id: "chapter-19", number: "XIX", title: "Conclusion & Methodology", icon: Target },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <Helmet>
        <title>Bitcoin Research | ARIES76</title>
        <meta name="description" content="Comprehensive Bitcoin research with real-time data, ETF flows, on-chain metrics, and institutional analysis. Full macro-liquidity framework, price scenarios, and technical analysis." />
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
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Research</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Institutional-grade analysis with real-time data, macro-liquidity framework, and comprehensive technical research
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

        {/* Table of Contents */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Table of Contents</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  const element = document.getElementById(chapter.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`group text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  activeSection === chapter.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/40 bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeSection === chapter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}>
                    <chapter.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-muted-foreground mb-1">
                      {chapter.number}
                    </div>
                    <h3 className="text-xs font-semibold text-foreground leading-snug">
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        <div className="container max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-10 border border-primary/20 shadow-xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <span className="text-primary">Executive Summary</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</span>
                <p className="text-muted-foreground leading-relaxed">
                  Bitcoin's 2026 trajectory is governed by global <GlossaryTerm term="M2">M2</GlossaryTerm> liquidity impulses and <GlossaryTerm term="real rates">real-rate</GlossaryTerm> dynamics—not simplistic halving cycles. Our <GlossaryTerm term="LADM">LADM</GlossaryTerm> framework captures Bitcoin's convex response to marginal liquidity.
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
                  Our quantitative framework integrates <GlossaryTerm term="HMM">Hidden Markov</GlossaryTerm> regime models, ETF flow dynamics, derivatives positioning, and on-chain supply elasticity.
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
                Executive Summary & Macro–Liquidity Regime Analysis
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

          {/* Chapter II - Advanced Price Framework */}
          <ChapterSection id="chapter-2" dataSection="chapter-2">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter II</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Advanced Price Framework & Quantitative Modelling
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Bitcoin's valuation throughout the 2025–2026 horizon requires a structural departure from narrative-driven models. The asset's behaviour is now determined by a multidimensional system of liquidity conditions, derivatives-implied flow constraints, treasury absorption, and mining economics.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <h4 className="text-lg font-bold text-foreground mb-3">Liquidity-Adjusted Demand Model (LADM)</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The cornerstone of Bitcoin's modern valuation. Rather than treating price as a function of adoption cycles, <GlossaryTerm term="LADM">LADM</GlossaryTerm> models Bitcoin as a convex response to the marginal liquidity impulse. Bitcoin's supply is fixed, but demand is highly sensitive to liquidity expansion and contraction.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h4 className="text-lg font-bold text-foreground mb-3">Regime Analysis via Hidden Markov Models</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    <GlossaryTerm term="HMM">HMM</GlossaryTerm> provides efficient regime classification: low-volatility accumulation, trending expansion, and corrective deleveraging phases. Identifying regime transitions helps build forward-looking scenario structures.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Derivatives-Implied Market Structure</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Options Skew</h5>
                    <p className="text-sm text-foreground/70">Post-ETF environment shows flatter skew due to institutional call overwriting and structured product flows.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Dealer <GlossaryTerm term="gamma">Gamma</GlossaryTerm></h5>
                    <p className="text-sm text-foreground/70">Short gamma amplifies volatility; long gamma compresses it. Gamma flips often precede major moves.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">CME Futures</h5>
                    <p className="text-sm text-foreground/70"><GlossaryTerm term="contango">Contango</GlossaryTerm> reflects confidence; <GlossaryTerm term="backwardation">backwardation</GlossaryTerm> signals stress.</p>
                  </div>
                </div>
              </div>

              <KeyTakeaways insights={[
                "LADM models Bitcoin as a liquidity derivative with convex response to marginal liquidity impulse.",
                "HMM regime analysis identifies accumulation, expansion, and deleveraging phases.",
                "Derivatives positioning (gamma, skew, basis) provides directional signals.",
                "Post-2024 halving marks structural break—abandon halving-based models."
              ]} />
            </div>
          </ChapterSection>

          {/* Chapter III - On-Chain Intelligence */}
          <ChapterSection id="chapter-3" dataSection="chapter-3">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter III</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Advanced On-Chain Intelligence & Market Microstructure
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Institutional <GlossaryTerm term="on-chain">on-chain</GlossaryTerm> analysis provides a structural, entity-adjusted view of Bitcoin's internal liquidity and supply dynamics. The objective is to map how long-horizon entities, corporate holders, ETF custodians, and macro-driven actors shape Bitcoin's supply.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Whale Net Positioning</h4>
                  <p className="text-sm text-foreground/70">Institutional entities exhibit persistent net accumulation during liquidity expansions and orderly reduction during macro tightening.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Exchange Reserve Dynamics</h4>
                  <p className="text-sm text-foreground/70">Declining reserves = structural absorption by ETFs and <GlossaryTerm term="LTH">LTH</GlossaryTerm>. Rising reserves = leveraged inflows or distribution.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3"><GlossaryTerm term="LTH">LTH</GlossaryTerm> Cost Basis</h4>
                  <p className="text-sm text-foreground/70">Acts as structural floor under supportive liquidity. Compressions toward it signal capitulation.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Dormancy Analysis</h4>
                  <p className="text-sm text-foreground/70">Revival spikes anticipate distribution waves. Sustained dormancy indicates conviction and long-term anchoring.</p>
                </div>
              </div>

              <KeyTakeaways insights={[
                "Entity-adjusted whale positioning reveals structural accumulation patterns.",
                "Exchange reserves decline indicates ETF and LTH absorption of supply.",
                "LTH cost basis provides structural price floor during expansions.",
                "Dormancy flows signal distribution waves or conviction holding."
              ]} />
            </div>
          </ChapterSection>

          {/* Chapter IV - Treasuries & Mining */}
          <ChapterSection id="chapter-4" dataSection="chapter-4">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter IV</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Bitcoin Treasuries, Technology Outlook & Mining Economics
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <h4 className="text-lg font-bold text-foreground mb-3">Corporate Treasury Adoption</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    Corporates increasingly employ Bitcoin as a balance sheet hedge against monetary debasement, sovereign duration risk, and liquidity erosion.
                  </p>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Public companies: Inflation & cash dilution hedge</li>
                    <li>• Tech firms: FX-neutral global cash flows</li>
                    <li>• Multinationals: Cross-border portability premium</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h4 className="text-lg font-bold text-foreground mb-3">Sovereign Strategies</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    Emerging markets facing currency depreciation increasingly view Bitcoin as strategic optionality tool.
                  </p>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• FX-unstable EM: Reserve diversification</li>
                    <li>• Resource-rich states: Mining-driven accumulation</li>
                    <li>• Financial hubs: Strategic reserve hedge</li>
                  </ul>
                </div>
              </div>

              <MiningEconomicsChart data={miningCostData} />

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Post-Halving Mining Economics</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <div className="text-2xl font-bold text-primary mb-1">Difficulty</div>
                    <p className="text-xs text-foreground/70">Responsive to hash fluctuations—stabilising effect</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <div className="text-2xl font-bold text-accent mb-1">Energy</div>
                    <p className="text-xs text-foreground/70">Lower cost regions dominate—reduced floor sensitivity</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <div className="text-2xl font-bold text-blue-400 mb-1">Fees</div>
                    <p className="text-xs text-foreground/70">Ordinals + settlement—higher structural floor</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Issuance</div>
                    <p className="text-xs text-foreground/70">Reduced post-halving—supply tightening</p>
                  </div>
                </div>
              </div>

              <KeyTakeaways insights={[
                "Corporate and sovereign treasuries create persistent structural demand for Bitcoin.",
                "ETF custodians form a continuous buyer, absorbing supply from exchanges.",
                "Post-halving mining profitability depends on energy arbitrage and operational efficiency.",
                "Fee market evolution (Ordinals, settlement) provides higher structural price floor."
              ]} />
            </div>
          </ChapterSection>

          {/* Chapter V - Regulatory Outlook */}
          <ChapterSection id="chapter-5" dataSection="chapter-5">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter V</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Regulatory Outlook 2025–2026
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    United States
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Spot ETFs have normalised institutional exposure. SEC supervision of custody and disclosures influences ETF behaviours. CFTC reinforces derivatives oversight.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    Europe (MiCA)
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    MiCA introduces harmonised regulation, integrating custody, exchange operations, and stablecoin requirements. Enhances institutional certainty.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Asia
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Japan maintains strict rules. Singapore focuses on risk-based frameworks. Hong Kong positions as regional institutional hub.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    MENA
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    UAE enhances licensing clarity to attract global asset managers. Growing as crypto-friendly jurisdiction.
                  </p>
                </div>
              </div>

              <KeyTakeaways insights={[
                "US spot ETFs have normalised institutional exposure pathways.",
                "MiCA provides regulatory harmonisation across EU for enhanced certainty.",
                "Asia shows heterogeneous approaches—Hong Kong emerging as institutional hub.",
                "Regulatory trajectory supports growing institutional participation globally."
              ]} />
            </div>
          </ChapterSection>

          {/* Chapter VI - Scenario Analysis */}
          <ChapterSection id="chapter-6" dataSection="chapter-6">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Scenario Analysis for 2026
              </h2>
            </div>

            <PriceScenariosChart data={priceScenarioData} />

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <h4 className="font-bold text-foreground mb-2">Base Case: Structural Expansion</h4>
                <p className="text-sm text-foreground/70">$96,000 – $132,000</p>
                <p className="text-xs text-muted-foreground mt-2">Moderate global liquidity improvement, stable regulatory environment, steady ETF inflows.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">25%</div>
                <h4 className="font-bold text-foreground mb-2">High Case: Liquidity Reflation</h4>
                <p className="text-sm text-foreground/70">$180,000 – $260,000</p>
                <p className="text-xs text-muted-foreground mt-2">Accelerated balance-sheet expansion, falling real rates, sovereign/corporate treasury accumulation.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/40">
                <div className="text-3xl font-bold text-muted-foreground mb-2">15%</div>
                <h4 className="font-bold text-foreground mb-2">Stress Case: Risk-Off</h4>
                <p className="text-sm text-foreground/70">$45,000 – $60,000</p>
                <p className="text-xs text-muted-foreground mt-2">Macro deleveraging, regulatory fragmentation, liquidity contraction, rising real yields.</p>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Base case assumes moderate Fed easing and gradual M2 expansion.",
              "High convexity scenario requires sustained global liquidity growth and declining real yields.",
              "Stress scenario only materializes under aggressive monetary tightening.",
              "Scenario frameworks enable probability-weighted allocation decisions."
            ]} />
          </ChapterSection>

          {/* Chapter VII - 2026 Price Projection */}
          <ChapterSection id="chapter-7" dataSection="chapter-7">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Bitcoin Pricing Projection
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

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                The equilibrium band is derived from: Liquidity-adjusted demand (<GlossaryTerm term="LADM">LADM</GlossaryTerm>), volatility regime clustering, derivatives-implied flows, treasury absorption, and mining elasticity floors.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Bitcoin's price distribution is right-skewed due to supply inelasticity—tight lower bound anchored in <GlossaryTerm term="LTH">LTH</GlossaryTerm> cost basis, expansive upper tail driven by liquidity convexity.
              </p>
            </div>

            <KeyTakeaways insights={[
              "Institutional target of $138,000 represents probability-weighted average across scenarios.",
              "Equilibrium range derived from LADM, regime models, and supply elasticity.",
              "Right-skewed distribution reflects supply inelasticity and liquidity convexity.",
              "Price targets are dynamic and will be updated as macro data evolves."
            ]} />
          </ChapterSection>

          {/* Chapter VIII - Risks & Uncertainties */}
          <ChapterSection id="chapter-8" dataSection="chapter-8">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VIII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Risks and Uncertainties
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                <h4 className="font-bold text-foreground mb-3">Liquidity & Macro Shocks</h4>
                <p className="text-sm text-foreground/70">Sudden liquidity withdrawal, rising real yields, or shadow banking contractions pose systemic risks to Bitcoin's price formation.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                <h4 className="font-bold text-foreground mb-3">Regulatory Fragmentation</h4>
                <p className="text-sm text-foreground/70">Divergent approaches may disrupt global market access, ETF flows, and liquidity transmission between regions.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                <h4 className="font-bold text-foreground mb-3">ETF Outflows</h4>
                <p className="text-sm text-foreground/70">Large-scale redemptions can overwhelm exchange liquidity and trigger forced selling through AP arbitrage.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                <h4 className="font-bold text-foreground mb-3">Mining Centralisation</h4>
                <p className="text-sm text-foreground/70">Rising operational costs and geographic concentration could increase network vulnerability.</p>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Liquidity shocks and rising real yields are primary systemic risks.",
              "Regulatory fragmentation may disrupt global ETF flows and market access.",
              "Large ETF outflows can trigger forced selling and liquidity stress.",
              "Risk assessment enables disciplined allocation and hedging strategies."
            ]} />
          </ChapterSection>

          {/* Chapter IX - ETF Flow Dynamics */}
          <ChapterSection id="chapter-9" dataSection="chapter-9">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter IX</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                ETF Flow Dynamics & Market Microstructure
              </h2>
            </div>

            <ETFFlowChart data={etfFlowData} />

            <div className="prose prose-lg max-w-none space-y-8 mt-8">
              <p className="text-foreground/80 leading-relaxed">
                Spot ETFs impose a structural liquidity channel: creations absorb supply from exchanges or OTC desks, while redemptions inject supply. ETF authorised participants (APs) rebalance across CME futures, spot books, and collateral pools.
              </p>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Global Bitcoin Liquidity Grid</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">U.S. Session</h5>
                    <p className="text-sm text-foreground/70">ETF Creations, CME Futures — Deep institutional liquidity</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Europe Session</h5>
                    <p className="text-sm text-foreground/70">ETP Markets, Cross-venue arbitrage — Price stabilisation</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Asia Session</h5>
                    <p className="text-sm text-foreground/70">Perpetual Swaps, Derivatives Funding — Volatility amplification</p>
                  </div>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "US Spot ETFs exceeded $100B AUM—structural demand channel.",
              "ETF creations absorb supply; redemptions inject selling pressure.",
              "24-hour liquidity grid shows regional specialisation in flow types.",
              "AP rebalancing links ETF flows to futures and spot markets."
            ]} />
          </ChapterSection>

          {/* Chapter X - Derivatives & Positioning */}
          <ChapterSection id="chapter-10" dataSection="chapter-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter X</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Derivatives Markets & Positioning
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-3">Funding Rates</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Persistently elevated funding rates (&gt;0.1%) indicate overextended leverage. Normalised rates suggest balanced positioning with room for directional moves.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-3">Open Interest</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  OI at cycle highs signals elevated leverage risk. Watch for OI-to-price divergences as early warning for liquidation cascades.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-3">Options Implied Volatility</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  IV compression precedes major moves. IV spikes during corrections often mark capitulation points.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-3">CME Basis & Term Structure</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Sustained <GlossaryTerm term="contango">contango</GlossaryTerm> reflects institutional confidence. <GlossaryTerm term="backwardation">Backwardation</GlossaryTerm> indicates funding stress or imminent de-risking.
                </p>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Funding rates above 0.1% signal overextended leverage.",
              "Open interest at cycle highs increases liquidation cascade risk.",
              "IV compression often precedes major price moves.",
              "CME basis structure provides institutional sentiment signals."
            ]} />
          </ChapterSection>

          {/* Chapter XI - Risk Management */}
          <ChapterSection id="chapter-11" dataSection="chapter-11">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Risk Management Framework
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Institutional Bitcoin allocation requires structured risk management. Position sizing, rebalancing triggers, and stop-loss frameworks should be tied to regime transitions rather than fixed thresholds.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">2-5%</div>
                  <h4 className="font-bold text-foreground mb-2">Strategic Allocation</h4>
                  <p className="text-sm text-foreground/70">Recommended portfolio weight for institutional allocators</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">Quarterly</div>
                  <h4 className="font-bold text-foreground mb-2">Rebalancing</h4>
                  <p className="text-sm text-foreground/70">Regime-based triggers, not fixed calendar dates</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-muted-foreground mb-2">-30%</div>
                  <h4 className="font-bold text-foreground mb-2">Drawdown Limit</h4>
                  <p className="text-sm text-foreground/70">Maximum tolerable drawdown before position review</p>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Position sizing should align with overall portfolio risk tolerance (2-5% typical).",
              "Rebalancing tied to regime transitions, not fixed calendar dates.",
              "Stop-loss frameworks should account for Bitcoin's structural volatility.",
              "Hedging via options or futures can reduce tail risk exposure."
            ]} />
          </ChapterSection>

          {/* Chapter XII - Cross-Asset Correlations */}
          <ChapterSection id="chapter-12" dataSection="chapter-12">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Cross-Asset Correlations
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                Bitcoin's correlation structure is regime-dependent. During <GlossaryTerm term="risk-on">risk-on</GlossaryTerm> environments, correlation with equities and tech stocks increases. In stress periods, correlation spikes with risk assets before potential decorrelation.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Risk-On Correlation</h4>
                  <p className="text-sm text-foreground/70">BTC-NASDAQ correlation: 0.6-0.8 during liquidity expansions. Declines during crypto-specific rallies.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Gold Correlation</h4>
                  <p className="text-sm text-foreground/70">Low but increasing correlation with gold as "digital gold" narrative strengthens among institutions.</p>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "BTC-equity correlation is regime-dependent and increases during risk-on periods.",
              "Correlation with gold is low but strengthening as institutional adoption grows.",
              "Stress periods show temporary correlation spikes before potential decorrelation.",
              "Portfolio diversification benefits depend on macro regime context."
            ]} />
          </ChapterSection>

          {/* Chapter XIII - Macro Calendar */}
          <ChapterSection id="chapter-13" dataSection="chapter-13">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XIII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Macro Calendar & Key Dates 2026
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-4">Q1 2026</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• FOMC meetings: Jan 28-29, Mar 17-18</li>
                  <li>• US CPI releases: Monthly</li>
                  <li>• ECB rate decisions: Jan, Mar</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-4">Q2 2026</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• FOMC meetings: May 5-6, Jun 16-17</li>
                  <li>• Bitcoin Conference (anticipated)</li>
                  <li>• ETF flow reporting deadlines</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-4">Q3 2026</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• FOMC meetings: Jul 28-29, Sep 15-16</li>
                  <li>• Jackson Hole Symposium: Aug</li>
                  <li>• MiCA full implementation reviews</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="font-bold text-foreground mb-4">Q4 2026</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• FOMC meetings: Nov 3-4, Dec 15-16</li>
                  <li>• Year-end institutional rebalancing</li>
                  <li>• Tax-loss harvesting season</li>
                </ul>
              </div>
            </div>

            <KeyTakeaways insights={[
              "FOMC meetings are primary volatility catalysts—monitor for policy signals.",
              "CPI releases drive real-rate expectations and Bitcoin positioning.",
              "Year-end rebalancing creates predictable flow patterns.",
              "Regulatory milestones may trigger structural market shifts."
            ]} />
          </ChapterSection>

          {/* Chapter XIV - Exit Strategy */}
          <ChapterSection id="chapter-14" dataSection="chapter-14">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XIV</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Exit Strategy Framework
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <h4 className="text-lg font-bold text-foreground mb-4">Price-Based Distribution Ladder</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="py-2 text-left text-foreground">Price Level</th>
                        <th className="py-2 text-center text-foreground">Action</th>
                        <th className="py-2 text-center text-foreground">Cumulative Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20">
                        <td className="py-2 text-accent font-bold">$120,000</td>
                        <td className="py-2 text-center">Sell 10%</td>
                        <td className="py-2 text-center">10%</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 text-accent font-bold">$150,000</td>
                        <td className="py-2 text-center">Sell 15%</td>
                        <td className="py-2 text-center">25%</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 text-primary font-bold">$180,000</td>
                        <td className="py-2 text-center">Sell 15%</td>
                        <td className="py-2 text-center">40%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-primary font-bold">$200,000+</td>
                        <td className="py-2 text-center">Sell 20%</td>
                        <td className="py-2 text-center">60%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "DISTRIBUTION regime confirmation is the primary exit signal.",
              "Price-based ladder provides structure: 10% at $120k, then incremental sales.",
              "Watch on-chain distribution (LTH selling, exchange inflows) for confirmation.",
              "Always keep 15-20% 'moonbag' for potential extended upside."
            ]} />
          </ChapterSection>

          {/* Chapter XV - Lightning Network */}
          <ChapterSection id="chapter-15" dataSection="chapter-15">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XV</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Lightning Network & Layer 2
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Lightning Network represents Bitcoin's scaling solution, enabling instant, low-cost transactions. While not directly impacting price, network growth validates the "medium of exchange" narrative alongside "store of value."
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">~5,400 BTC</div>
                  <p className="text-sm text-foreground/70">Total Network Capacity</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">~16,000</div>
                  <p className="text-sm text-foreground/70">Active Nodes</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">~75,000</div>
                  <p className="text-sm text-foreground/70">Payment Channels</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">+120%</div>
                  <p className="text-sm text-foreground/70">YoY Capacity Growth</p>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Lightning capacity up 120% YoY—network effects accelerating.",
              "Exchange integration (Coinbase, Kraken, OKX) drives accessibility.",
              "Long-term narrative value significant; near-term price impact minimal.",
              "Monitor as adoption metric, not trading signal."
            ]} />
          </ChapterSection>

          {/* Chapter XVI - Institutional & Sovereign Adoption */}
          <ChapterSection id="chapter-16" dataSection="chapter-16">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XVI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Institutional & Sovereign Adoption
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                The 2024–2026 period marks the transition from speculative retail-driven markets to institutional and sovereign participation. This structural shift fundamentally alters Bitcoin's demand profile and volatility characteristics.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <h4 className="font-bold text-foreground mb-3">Corporate Treasury Adoption</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Following MicroStrategy's pioneering strategy, corporate treasuries increasingly view Bitcoin as a hedge against fiat debasement. Public companies now hold over 500,000 BTC in aggregate.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h4 className="font-bold text-foreground mb-3">Sovereign Wealth Funds</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Early-mover sovereign funds (Norway, Singapore, Abu Dhabi) are building indirect exposure through ETF holdings and mining investments.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Pension Fund Allocations</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    U.S. state pension funds (Wisconsin, Florida) have initiated Bitcoin ETF positions, signalling mainstream institutional acceptance.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Central Bank Reserves</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    El Salvador continues accumulating BTC as legal tender. Other emerging markets are exploring Bitcoin as reserve diversification.
                  </p>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Corporate treasuries now hold 500,000+ BTC—structural demand floor.",
              "Sovereign wealth funds building indirect exposure via ETFs and mining.",
              "Pension fund participation signals mainstream institutional acceptance.",
              "Central bank reserve diversification remains early-stage but growing."
            ]} />
          </ChapterSection>

          {/* Chapter XVII - Portfolio Construction Framework */}
          <ChapterSection id="chapter-17" dataSection="chapter-17">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XVII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Portfolio Construction Framework
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Bitcoin's role in a diversified portfolio requires structured thinking about position sizing, rebalancing triggers, and correlation dynamics across market regimes.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1-3%</div>
                  <h4 className="font-bold text-foreground mb-2">Conservative</h4>
                  <p className="text-sm text-foreground/70">Traditional institutions, endowments with strict volatility limits</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">3-5%</div>
                  <h4 className="font-bold text-foreground mb-2">Balanced</h4>
                  <p className="text-sm text-foreground/70">Family offices, sophisticated investors seeking asymmetric returns</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40 text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">5-10%</div>
                  <h4 className="font-bold text-foreground mb-2">Aggressive</h4>
                  <p className="text-sm text-foreground/70">High-conviction allocators with long time horizons</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Rebalancing Triggers</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Threshold-Based</h5>
                    <p className="text-sm text-foreground/70">Rebalance when allocation drifts ±50% from target (e.g., 3% target → rebalance at 1.5% or 4.5%)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30">
                    <h5 className="font-semibold text-foreground mb-2">Regime-Based</h5>
                    <p className="text-sm text-foreground/70">Adjust allocation based on macro regime transitions (expansion vs. contraction)</p>
                  </div>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "1-3% allocation for conservative institutions; 5-10% for high-conviction investors.",
              "Threshold-based rebalancing prevents emotional decision-making.",
              "Regime-based adjustments align allocation with macro conditions.",
              "Position sizing should reflect individual risk tolerance and time horizon."
            ]} />
          </ChapterSection>

          {/* Chapter XVIII - Future Outlook & Catalysts */}
          <ChapterSection id="chapter-18" dataSection="chapter-18">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XVIII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Future Outlook & Catalysts
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Bitcoin's 2026 trajectory will be shaped by a convergence of macro, regulatory, and adoption catalysts. Understanding these drivers enables forward-looking positioning.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <h4 className="font-bold text-green-400 mb-3">Bullish Catalysts</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Fed pivot to rate cuts / QE resumption</li>
                    <li>• Sovereign adoption beyond El Salvador</li>
                    <li>• Ethereum ETF approval driving crypto inflows</li>
                    <li>• MiCA implementation enhancing EU access</li>
                    <li>• Continued corporate treasury accumulation</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                  <h4 className="font-bold text-destructive mb-3">Bearish Catalysts</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Sustained high real rates / liquidity contraction</li>
                    <li>• Regulatory fragmentation or hostile legislation</li>
                    <li>• Major exchange or custodian failure</li>
                    <li>• Geopolitical escalation impacting risk appetite</li>
                    <li>• Mining centralisation or network security concerns</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">2026 Milestone Watchlist</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">Q1</div>
                    <p className="text-xs text-foreground/70">Fed policy direction clarity</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-accent mb-1">Q2</div>
                    <p className="text-xs text-foreground/70">MiCA full implementation</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">Q3</div>
                    <p className="text-xs text-foreground/70">Institutional rebalancing</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Q4</div>
                    <p className="text-xs text-foreground/70">Year-end positioning</p>
                  </div>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Fed pivot remains the primary bullish catalyst for 2026.",
              "Regulatory fragmentation poses the greatest structural risk.",
              "Sovereign and corporate adoption provides demand floor.",
              "Monitor quarterly milestones for regime transition signals."
            ]} />
          </ChapterSection>

          {/* Chapter XIX - Conclusion & Methodology */}
          <ChapterSection id="chapter-19" dataSection="chapter-19">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter XIX</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Conclusion & Methodology
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20">
                <h4 className="text-lg font-bold text-foreground mb-4">Research Summary</h4>
                <p className="text-foreground/80 leading-relaxed">
                  This research presents a comprehensive, institutional-grade framework for understanding Bitcoin's 2026 trajectory. Our analysis integrates macro-liquidity dynamics, on-chain intelligence, derivatives positioning, and regulatory developments to construct probability-weighted scenarios.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Methodology</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• <GlossaryTerm term="LADM">LADM</GlossaryTerm> for liquidity-price modelling</li>
                    <li>• <GlossaryTerm term="HMM">HMM</GlossaryTerm> for regime classification</li>
                    <li>• Entity-adjusted on-chain analysis</li>
                    <li>• Derivatives flow and positioning data</li>
                    <li>• ETF creation/redemption tracking</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="font-bold text-foreground mb-3">Data Sources</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Glassnode, CryptoQuant (on-chain)</li>
                    <li>• Bloomberg, TradingView (price data)</li>
                    <li>• CME, Deribit (derivatives)</li>
                    <li>• FRED, ECB (macro indicators)</li>
                    <li>• SEC filings, ETF issuers (flows)</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Key Conclusions</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">Bitcoin is now a macro-liquidity asset whose price is governed by M2 dynamics and real-rate trajectories rather than halving cycles.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">Institutional adoption via ETFs has structurally changed Bitcoin's demand profile and reduced volatility clustering.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">The probability-weighted institutional target of $138,000 reflects base case expansion with asymmetric upside potential.</p>
                  </div>
                </div>
              </div>
            </div>

            <KeyTakeaways insights={[
              "Bitcoin is a macro-liquidity asset—abandon halving-centric models.",
              "Institutional adoption has structurally altered demand dynamics.",
              "Probability-weighted $138k target with asymmetric upside.",
              "Continuous regime monitoring enables disciplined allocation."
            ]} />
          </ChapterSection>

        </div>

        {/* Disclaimer */}
        <div className="container max-w-6xl mx-auto px-6 pb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40">
            <h3 className="text-lg font-bold text-foreground mb-3">Disclaimer</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              This research is provided for informational purposes only and does not constitute investment advice. Bitcoin and digital assets are highly volatile. Investors should conduct their own due diligence and consult qualified financial advisors. Past performance does not guarantee future results.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-border/40 mt-6">
              <p className="text-xs text-muted-foreground">© 2026 ARIES76 Capital Intelligence</p>
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
