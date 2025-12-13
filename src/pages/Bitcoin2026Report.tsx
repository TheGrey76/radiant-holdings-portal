import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart, Lightbulb, HelpCircle, Shield, Globe, Scale, Calendar, Zap, AlertTriangle, GitBranch, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  "balance-sheet": "Financial statement showing assets, liabilities, and equity of an entity. For central banks, it indicates monetary expansion or contraction."
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

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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

  // Custom Tooltip Components
  const CustomPriceTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-4 shadow-2xl animate-fade-in">
          <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">{payload[0].payload.month} 2026</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">High Case:</span>
              <span className="text-sm font-bold text-accent">${payload[0].payload.high}k</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Base Case:</span>
              <span className="text-sm font-bold text-primary">${payload[0].payload.base}k</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Stress Case:</span>
              <span className="text-sm font-bold text-muted-foreground">${payload[0].payload.stress}k</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40">
            <p className="text-xs text-foreground/60">Range: ${payload[0].payload.stress}k - ${payload[0].payload.high}k</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomETFTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const netFlow = payload[0].payload.inflows - payload[0].payload.outflows;
      return (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-4 shadow-2xl animate-fade-in">
          <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">{payload[0].payload.week}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Inflows:</span>
              <span className="text-sm font-bold text-primary">${payload[0].payload.inflows}M</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Outflows:</span>
              <span className="text-sm font-bold text-muted-foreground">${payload[0].payload.outflows}M</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/60">Net Flow:</span>
              <span className={`text-sm font-bold ${netFlow > 0 ? 'text-primary' : 'text-destructive'}`}>
                {netFlow > 0 ? '+' : ''}{netFlow}M
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomMiningTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const margin = ((payload[0].payload.price - payload[0].payload.cost) / payload[0].payload.cost * 100).toFixed(1);
      return (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-4 shadow-2xl animate-fade-in">
          <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">{payload[0].payload.quarter} 2026</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">BTC Price:</span>
              <span className="text-sm font-bold text-primary">${payload[0].payload.price}k</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Mining Cost:</span>
              <span className="text-sm font-bold text-muted-foreground">${payload[0].payload.cost}k</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/60">Profit Margin:</span>
              <span className={`text-sm font-bold ${parseFloat(margin) > 0 ? 'text-primary' : 'text-destructive'}`}>
                {margin}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Historical data for Figure 1 (Bitcoin Price 2013-2025)
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

  // Historical data for Figure 2 (Global M2 2013-2025)
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

  // Historical data for Figure 3 (Real Rates 2013-2025)
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

  // Sample data for charts
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

  const supplyDistributionData = [
    { category: "Exchanges", percentage: 12, amount: 2520 },
    { category: "Long-term Holders", percentage: 65, amount: 13650 },
    { category: "Short-term Holders", percentage: 18, amount: 3780 },
    { category: "Miners", percentage: 5, amount: 1050 },
  ];

  const miningCostData = [
    { quarter: "Q1", cost: 42, price: 98 },
    { quarter: "Q2", cost: 45, price: 115 },
    { quarter: "Q3", cost: 48, price: 125 },
    { quarter: "Q4", cost: 51, price: 130 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Detect active section
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chapters = [
    { id: "chapter-1", number: "I", title: "Executive Summary & Macro Analysis", icon: TrendingUp },
    { id: "chapter-2", number: "II", title: "Advanced Price Framework", icon: BarChart3 },
    { id: "chapter-3", number: "III", title: "Quantitative Regime Models", icon: Layers },
    { id: "chapter-4", number: "IV", title: "ETF Flow Dynamics & Market Microstructure", icon: Network },
    { id: "chapter-5", number: "V", title: "On-Chain Analytics & Entity Behavior", icon: Database },
    { id: "chapter-6", number: "VI", title: "Derivatives Markets & Positioning", icon: Activity },
    { id: "chapter-7", number: "VII", title: "Mining Economics & Hashrate Analysis", icon: Coins },
    { id: "chapter-8", number: "VIII", title: "Supply Dynamics & Long-Term Holders", icon: LineChart },
    { id: "chapter-9", number: "IX", title: "Scenario Analysis & Risk Framework", icon: Target },
    { id: "chapter-10", number: "X", title: "2026 Price Targets & Investment Implications", icon: TrendingUp },
    { id: "chapter-11", number: "XI", title: "Risk Management Framework", icon: Shield },
    { id: "chapter-12", number: "XII", title: "Cross-Asset Correlations", icon: GitBranch },
    { id: "chapter-13", number: "XIII", title: "Regulatory Landscape 2026", icon: Scale },
    { id: "chapter-14", number: "XIV", title: "Institutional Adoption Metrics", icon: Globe },
    { id: "chapter-15", number: "XV", title: "Macro Calendar & Key Dates 2026", icon: Calendar },
    { id: "chapter-16", number: "XVI", title: "Geopolitical Risk Analysis", icon: AlertTriangle },
    { id: "chapter-17", number: "XVII", title: "Historical Cycle Comparison", icon: Activity },
    { id: "chapter-18", number: "XVIII", title: "Exit Strategy Framework", icon: LogOut },
    { id: "chapter-19", number: "XIX", title: "Lightning Network & Layer 2", icon: Zap },
  ];

  return (
    <TooltipProvider>
      <Helmet>
        <title>Bitcoin 2026: Institutional Analysis | ARIES76</title>
        <meta 
          name="description" 
          content="Comprehensive institutional analysis of Bitcoin's 2026 trajectory through macro-liquidity framework and quantitative modeling." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          <div className="container max-w-6xl mx-auto px-6 py-24 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Institutional Research</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                Bitcoin 2026
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Macro-Liquidity Regime Analysis & Quantitative Valuation Framework
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <span className="font-medium">ARIES76 Capital Intelligence</span>
                </div>
              </div>
            </div>
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
                  Bitcoin's 2026 trajectory is NOT driven by halving cycles—it's governed by global M2 liquidity impulses and real-rate dynamics. Our proprietary macro-liquidity framework reveals that marginal M2 acceleration produces convex upside responses while stagnation triggers volatility spikes.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</span>
                <p className="text-muted-foreground leading-relaxed">
                  Institutional target: $138,000 (probability-weighted across three scenarios). Base case ($96k-$132k, 60% probability) assumes moderate liquidity expansion. High convexity scenario ($180k-$260k, 25%) requires sustained M2 growth + declining real yields. Stress regime ($45k-$60k, 15%) emerges only under aggressive monetary tightening.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</span>
                <p className="text-muted-foreground leading-relaxed">
                  The ARIES76 Edge: While competitors rely on simplistic cycle analysis, our quantitative framework integrates Hidden Markov regime models, ETF flow dynamics, derivatives positioning, and on-chain supply elasticity into a coherent valuation architecture. This multidimensional approach captures the complex institutional market dynamics that narrative-driven models miss.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Edge: The ARIES76 Methodology */}
        <div className="container max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-gradient-to-br from-accent/10 via-background to-accent/5 rounded-lg p-10 border border-accent/20 shadow-xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Edge: <span className="text-primary">The ARIES76 Methodology</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              What sets ARIES76 apart from competitors like ARK Invest, Messari Pro, and Glassnode is our proprietary macro-liquidity driven approach. While others rely on historical cycle patterns and simplistic technical analysis, we integrate real-time global M2 dynamics, shadow banking elasticity, and institutional flow mechanics into a coherent quantitative framework.
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Our methodology combines:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Hidden Markov Models for regime identification</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Real-time macro-liquidity impulse tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Derivatives-implied positioning analysis</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Entity-adjusted on-chain metrics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">ETF flow microstructure dynamics</p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-6 italic border-l-4 border-primary pl-4">
              This multidimensional approach provides institutional-grade intelligence that narrative-driven models cannot capture.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Table of Contents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  const element = document.getElementById(chapter.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  activeSection === chapter.id
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border/40 bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    activeSection === chapter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}>
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

        {/* Content with Sidebar */}
        <div className="container max-w-7xl mx-auto px-6 pb-24">
          <div className="flex gap-12">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Chapter I */}
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
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Bitcoin's trajectory over the 2025–2026 horizon must be interpreted within a refined <GlossaryTerm term="macro-liquidity">macro-liquidity</GlossaryTerm> framework rather than through the simplistic heuristics that characterised earlier cycles. Bitcoin has evolved into a liquidity-sensitive macro asset whose price formation is dominated by global <GlossaryTerm term="M2">M2</GlossaryTerm> impulses, <GlossaryTerm term="real rates">real-rate</GlossaryTerm> dynamics, cross-border dollar transmission, and the <GlossaryTerm term="balance-sheet">balance-sheet</GlossaryTerm> elasticity of shadow banking intermediaries and <GlossaryTerm term="ETF">ETF</GlossaryTerm> market makers.
                </p>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={btcHistoricalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      label={{ value: 'BTC Price ($k)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '2px solid hsl(var(--primary) / 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(1)}k`, 'BTC Price']}
                      labelStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center font-medium">
                  Figure 1 — Synthetic Bitcoin Price (2013–2025)
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                Figure 1 illustrates the synthetic price path of Bitcoin from 2013 to 2025. Although purely model-based, the series reproduces the core structural features of Bitcoin's historical behaviour: extended appreciation phases coinciding with abundant global liquidity, deep drawdowns during periods of tightening and quantitative tightening, and regime transitions triggered by policy inflection points and funding shocks.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    Global Liquidity
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Global <GlossaryTerm term="M2">M2</GlossaryTerm> remains the most important macro variable. What matters is the marginal <GlossaryTerm term="liquidity conditions">liquidity</GlossaryTerm> impulse: accelerations produce convex responses in Bitcoin, while stagnation coincides with volatility spikes.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                    Real Rates Impact
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Rising <GlossaryTerm term="real rates">real yields</GlossaryTerm> increase opportunity cost of non-yielding assets. Declining <GlossaryTerm term="real rates">real yields</GlossaryTerm> reduce that cost and incentivise search for convex, high-beta exposures like Bitcoin.
                  </p>
                </div>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={m2LiquidityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorM2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Index (2013=100)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '2px solid hsl(var(--accent) / 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                      }}
                      formatter={(value: number) => [value.toFixed(0), 'M2 Index']}
                      labelStyle={{ color: 'hsl(var(--accent))', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="m2" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorM2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center font-medium">
                  Figure 2 — Global M2 Liquidity Proxy (2013–2025)
                </p>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={realRatesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Real Rate (%)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '2px solid hsl(var(--primary) / 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Real Rate']}
                      labelStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
                    />
                    {/* Zero line reference */}
                    <Line 
                      type="monotone" 
                      dataKey={() => 0} 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 text-center font-medium">
                  Figure 3 — Real Rates Regime (2013–2025)
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                <h4 className="text-xl font-bold text-foreground mb-4">Key Synthesis</h4>
                <p className="text-foreground/80 leading-relaxed">
                  The combined evidence supports a clear macro identity for Bitcoin. It is a high-convexity, liquidity-sensitive asset whose price behaviour is governed less by "cycles" and more by the interplay between global <GlossaryTerm term="M2">M2</GlossaryTerm> growth, <GlossaryTerm term="real rates">real-rate</GlossaryTerm> trends, shadow <GlossaryTerm term="liquidity conditions">liquidity</GlossaryTerm> and institutional flow channels.
                </p>
              </div>

              <KeyTakeaways insights={[
                "Bitcoin has evolved into a macro liquidity-sensitive asset whose price is now dominated by global M2 impulses, real-rate dynamics, and institutional ETF flows rather than simplistic halving cycles.",
                "Global M2 acceleration produces convex upside responses while stagnation triggers volatility spikes—the marginal liquidity impulse matters more than absolute levels.",
                "Declining real yields reduce the opportunity cost of holding non-yielding assets like Bitcoin, creating powerful tailwinds when combined with monetary expansion.",
                "Bitcoin's structural transformation into an institutional asset class means its price formation is increasingly governed by balance-sheet elasticity of shadow banks and ETF market makers."
              ]} />

              {/* Investment Implications */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-background to-primary/5 border-2 border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  Investment Implications
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Retail High-Net-Worth Investors</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Consider a strategic allocation of 3-5% of liquid portfolio to Bitcoin with a 24-month horizon. The macro-liquidity framework suggests accumulation during M2 stagnation periods when volatility spikes create entry opportunities. Avoid chasing momentum during parabolic phases.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Family Offices & Institutional Allocators</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Bitcoin now functions as a liquidity-sensitive macro asset suitable for portfolio diversification. Our base case scenario supports allocations in the 2-4% range as part of alternative investments bucket. Focus on ETF vehicles for regulatory clarity and operational simplicity. Rebalancing triggers should be tied to regime transitions rather than fixed time periods.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Quantitative Traders</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      The regime model provides actionable signals for tactical positioning. Transitions from accumulation to expansion regimes (identified via HMM) offer high-conviction long entries. Derivatives positioning metrics can identify overextension points for mean-reversion trades. Monitor ETF flow velocity as a leading indicator for institutional demand shifts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ChapterSection>

          {/* Chapter II */}
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
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Bitcoin's valuation throughout the 2025–2026 horizon requires a structural departure from narrative-driven models. The asset's behaviour is now determined by a multidimensional system of liquidity conditions, derivatives-implied flow constraints, treasury absorption, and mining economics.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-primary mb-2">$96k–$132k</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Equilibrium Band</div>
                  <p className="text-sm text-foreground/70">Base case scenario with 60% probability</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-accent mb-2">$180k–$260k</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">High Convexity</div>
                  <p className="text-sm text-foreground/70">Bull scenario with 25% probability</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">$45k–$60k</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Stress Regime</div>
                  <p className="text-sm text-foreground/70">Bear scenario with 15% probability</p>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                The Advanced Price Framework integrates macro-liquidity vectors, regime theory, microstructure indicators and supply elasticity models into a coherent investment architecture. This multidimensional approach moves beyond simple cycle analysis to capture the complex dynamics of institutional Bitcoin markets.
              </p>

              {/* Interactive Price Scenario Chart */}
              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-lg font-bold text-foreground mb-6">2026 Price Scenarios (Monthly Progression)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={priceScenarioData}>
                    <defs>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: '$k', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip content={<CustomPriceTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="high" stroke="hsl(var(--accent))" fill="url(#colorHigh)" name="High Case" />
                    <Area type="monotone" dataKey="base" stroke="hsl(var(--primary))" fill="url(#colorBase)" name="Base Case" />
                    <Area type="monotone" dataKey="stress" stroke="hsl(var(--muted-foreground))" fill="transparent" name="Stress Case" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <KeyTakeaways insights={[
                "Bitcoin valuation requires structural departure from narrative models—price is now determined by multidimensional liquidity conditions, derivatives flows, and institutional balance-sheet dynamics.",
                "Quantitative regime models using Hidden Markov frameworks outperform simplistic technical analysis by identifying distinct market states driven by macro-liquidity shifts.",
                "Advanced price framework combines M2 growth rates, real-rate trends, ETF flow velocity, and on-chain metrics to generate probabilistic scenario distributions rather than single-point forecasts."
              ]} />

            </div>
          </ChapterSection>
          <ChapterSection id="chapter-3" dataSection="chapter-3">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter III</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Quantitative Regime Models & Methodology
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                The quantitative framework employs Hidden Markov Models to identify distinct market regimes, liquidity-adjusted demand functions to model institutional flows, and derivatives-implied positioning to capture market microstructure dynamics.
              </p>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                <h4 className="text-xl font-bold text-foreground mb-6">Institutional Target: $138,000</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <span className="text-sm font-medium text-foreground">Base Case (60%)</span>
                    <span className="text-lg font-bold text-primary">$96k–$132k</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <span className="text-sm font-medium text-foreground">High Case (25%)</span>
                    <span className="text-lg font-bold text-accent">$180k–$260k</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <span className="text-sm font-medium text-foreground">Stress Case (15%)</span>
                    <span className="text-lg font-bold text-muted-foreground">$45k–$60k</span>
                  </div>
                </div>
              </div>

              <KeyTakeaways insights={[
                "Hidden Markov Models identify three distinct market regimes—accumulation, expansion, and distribution—each with characteristic volatility, return profiles, and transition probabilities.",
                "Institutional target of $138,000 represents probability-weighted expected value across Base ($96k-$132k, 60%), High ($180k-$260k, 25%), and Stress ($45k-$60k, 15%) scenarios.",
                "Quantitative methodology integrates macro liquidity impulses, on-chain supply elasticity, and derivatives positioning into coherent valuation framework that outperforms heuristic cycle models."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-4" dataSection="chapter-4">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter IV</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                ETF Flow Dynamics & Market Microstructure
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  The introduction of spot Bitcoin ETFs has fundamentally altered market microstructure. Institutional flows now move through regulated vehicles, creating new arbitrage channels and liquidity patterns that differ markedly from the pre-ETF era.
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                ETF authorized participants (APs) arbitrage NAV-spot price differentials, compressing spreads but also creating structural dependencies on dealer balance sheets. During periods of elevated volatility, AP capacity constraints can amplify price swings as creation-redemption mechanisms face friction.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">ETF Inflows</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Sustained ETF inflows reduce free float and create quasi-inelastic supply channels. Institutional buyers through ETFs typically hold longer than retail spot buyers, reducing circulating supply elasticity.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">Market Depth</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    ETF market makers hedge delta exposure through spot and futures, concentrating liquidity provision in fewer hands. This creates efficiency gains in normal markets but potential fragility during stress events.
                  </p>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                The correlation between ETF net flows and Bitcoin price appreciation has been statistically significant. Large institutional allocators rebalance portfolios through ETFs, creating persistent demand that differs from speculative retail flows.
              </p>

              {/* ETF Flow Chart */}
              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-lg font-bold text-foreground mb-6">Weekly ETF Flow Dynamics</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={etfFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: '$M', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip content={<CustomETFTooltip />} />
                    <Legend />
                    <Bar dataKey="inflows" fill="hsl(var(--primary))" name="Inflows" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="outflows" fill="hsl(var(--muted-foreground))" name="Outflows" radius={[8, 8, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <KeyTakeaways insights={[
                "Spot Bitcoin ETFs fundamentally altered market microstructure—institutional flows now channel through regulated vehicles creating new arbitrage dynamics and liquidity patterns distinct from pre-ETF era.",
                "Sustained ETF inflows reduce circulating supply elasticity as institutional buyers demonstrate longer holding periods than retail spot buyers, creating quasi-inelastic supply channels.",
                "ETF authorized participants arbitrage NAV-spot differentials but face capacity constraints during volatility spikes—this creates efficiency in normal markets but potential fragility during stress events.",
                "Statistical correlation between ETF net flows and Bitcoin price appreciation confirms persistent institutional demand differs fundamentally from speculative retail flow patterns."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-5" dataSection="chapter-5">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter V</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                On-Chain Analytics & Entity Behavior
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                On-chain data provides direct visibility into supply distribution, holder behavior, and transaction patterns. Entity-adjusted metrics distinguish between genuine holders and custodial aggregation, revealing the true composition of Bitcoin ownership.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <h4 className="text-lg font-bold text-foreground mb-3">Long-Term Holder Dynamics</h4>
                <p className="text-sm text-foreground/70 leading-relaxed m-0">
                  Long-term holders (LTH)—defined as addresses holding for 155+ days—represent the most conviction-driven segment. LTH supply peaks typically precede market tops, while LTH accumulation during drawdowns signals bottom formation.
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                Entity-adjusted metrics correct for exchange consolidation and custodial structures. Raw address counts overstate distribution; entity clustering reveals concentrated ownership but also identifies genuine retail participation growth through regulated custodians.
              </p>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Key On-Chain Signals</h4>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Realized price—aggregate cost basis—acts as psychological support during corrections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>MVRV ratio (market cap / realized cap) signals overextension above 3.5 and capitulation below 1.0</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Exchange net flows reveal institutional accumulation (outflows) vs. retail distribution (inflows)</span>
                  </li>
                </ul>
              </div>

              {/* Supply Distribution Table */}
              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-lg font-bold text-foreground mb-6">Bitcoin Supply Distribution Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-4 px-4 text-sm font-bold text-foreground">Category</th>
                        <th className="text-right py-4 px-4 text-sm font-bold text-foreground">Percentage</th>
                        <th className="text-right py-4 px-4 text-sm font-bold text-foreground">Amount (k BTC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyDistributionData.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 text-sm font-medium text-foreground">{row.category}</td>
                          <td className="py-4 px-4 text-right text-sm text-foreground/80">
                            <span className="inline-flex items-center gap-2">
                              {row.percentage}%
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all duration-500"
                                  style={{ width: `${row.percentage}%` }}
                                ></div>
                              </div>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-primary">{row.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <KeyTakeaways insights={[
                "On-chain analytics reveal entity behavior patterns—realized price acts as aggregate cost basis and psychological support, while MVRV ratio signals overextension (>3.5) and capitulation (<1.0) phases.",
                "Exchange net flows distinguish institutional accumulation (persistent outflows to cold storage) from retail distribution (inflows preceding selling), providing leading indicators of conviction.",
                "Long-term holder supply (12+ months) creates supply inelasticity—as illiquid supply grows through ETF and corporate treasury accumulation, available float shrinks amplifying upside convexity during demand shocks."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-6" dataSection="chapter-6">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Derivatives Markets & Positioning
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Derivatives markets—futures, options, perpetual swaps—now determine price formation as much as spot markets. Open interest, funding rates, and implied volatility surfaces provide real-time signals of positioning and sentiment.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-primary mb-2">Futures OI</div>
                  <p className="text-xs text-muted-foreground">CME open interest reflects institutional positioning and hedging demand</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-accent mb-2">Funding Rates</div>
                  <p className="text-xs text-muted-foreground">Perpetual swap funding indicates leverage and directional bias in retail markets</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border/40">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">Implied Vol</div>
                  <p className="text-xs text-muted-foreground">Options skew and term structure signal tail-risk perception and hedging flows</p>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                Rising open interest during uptrends confirms conviction; rising OI during downtrends suggests forced liquidations. Funding rate extremes—both positive and negative—historically precede reversals as overleveraged positions unwind.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Options markets reveal institutional hedging patterns. Put-call skew, volatility smiles, and gamma exposure indicate where large players are positioned and where reflexive price action may occur during sharp moves.
                </p>
              </div>

              <KeyTakeaways insights={[
                "Derivatives markets now determine price formation as much as spot—futures open interest, perpetual funding rates, and options implied volatility provide real-time positioning signals.",
                "Rising open interest during uptrends confirms conviction; rising OI during downtrends suggests forced liquidations. Funding rate extremes precede reversals as overleveraged positions unwind.",
                "Options markets reveal institutional hedging patterns through put-call skew and volatility surfaces, indicating where large players position and where reflexive gamma-driven price action may occur."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-7" dataSection="chapter-7">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Mining Economics & Hashrate Analysis
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Mining economics establish a dynamic production cost floor for Bitcoin. Hashrate growth, energy costs, and miner profitability metrics reveal the marginal cost of supply and potential capitulation thresholds during prolonged drawdowns.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">Hashrate Security</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Rising hashrate reflects increasing capital investment in mining infrastructure, signaling long-term confidence despite short-term price volatility. Network security scales with computational power.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">Production Costs</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Aggregate production costs—electricity, hardware amortization, operational overhead—create a dynamic price floor. When Bitcoin trades below production cost, marginal miners capitulate.
                  </p>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                Miner revenue composition shifts post-halving. Block subsidies decline while fee markets become more relevant. Transaction fee volatility during network congestion creates revenue uncertainty for miners but demonstrates organic demand for block space.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed m-0">
                  Publicly-traded miners reveal operational efficiency through disclosed hashrate, energy costs, and treasury holdings. Miner selling pressure during bear markets represents predictable supply but also creates accumulation opportunities for long-term holders.
                </p>
              </div>

              {/* Mining Cost vs Price Chart */}
              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-lg font-bold text-foreground mb-6">Mining Cost vs Bitcoin Price (2026 Projection)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={miningCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: '$k', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip content={<CustomMiningTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="hsl(var(--muted-foreground))" strokeWidth={3} name="Production Cost" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} name="Bitcoin Price" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <KeyTakeaways insights={[
                "Post-halving mining economics create dynamic price floor—when Bitcoin trades below aggregate production costs (electricity, hardware, operations), marginal miners capitulate reducing network hashrate until equilibrium restores.",
                "Miner revenue composition shifts as block subsidies decline—transaction fee markets become increasingly relevant, with fee volatility during congestion demonstrating organic block space demand.",
                "Publicly-traded miner disclosures reveal operational efficiency through hashrate per watt, treasury holdings, and debt structures—miner selling pressure represents predictable supply but also accumulation opportunities for long-term holders."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-8" dataSection="chapter-8">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter VIII</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Supply Dynamics & Long-Term Holders
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Bitcoin supply is absolutely capped at 21 million coins, but circulating supply elasticity varies with holder behavior. Long-term holders remove supply from active circulation, while new issuance and miner selling inject marginal supply.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <h4 className="text-lg font-bold text-foreground mb-3">Illiquid Supply Growth</h4>
                <p className="text-sm text-foreground/70 leading-relaxed m-0">
                  Illiquid supply—coins held by entities unlikely to sell—has grown steadily through ETF accumulation, corporate treasuries, and long-term holder conviction. This reduces available float and amplifies upside convexity during demand shocks.
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                The progression from liquid to illiquid supply follows predictable patterns. Coins move from speculative retail hands to long-term institutional custody during bull markets, then consolidate further during bear market capitulations as weak hands exit.
              </p>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Supply Distribution Metrics</h4>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Highly liquid supply: coins held less than 3 months, typically retail and speculative</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Liquid supply: 3–12 months holding period, transitional ownership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Illiquid supply: 12+ months, institutiona l and conviction-driven holders</span>
                  </li>
                </ul>
              </div>

              <KeyTakeaways insights={[
                "Bitcoin's 21 million cap is absolute, but circulating supply elasticity varies with holder behavior—long-term holders remove supply from active circulation while miner issuance injects marginal supply.",
                "Illiquid supply growth through ETF accumulation, corporate treasuries, and conviction-driven holders reduces available float and amplifies upside convexity during institutional demand shocks.",
                "Supply transitions follow predictable patterns—coins move from speculative retail to institutional custody during bull markets, then consolidate further as weak hands capitulate during bear phases.",
                "65% of supply now held by long-term holders represents structural shift creating quasi-inelastic supply dynamics fundamentally different from earlier retail-dominated cycles."
              ]} />
            </div>
          </ChapterSection>
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
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-foreground/80 leading-relaxed">
                Institutional allocators require probabilistic scenario frameworks rather than single-point forecasts. The following scenarios integrate macro-liquidity conditions, derivatives positioning, on-chain behavior, and mining economics into coherent narratives.
              </p>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-foreground">Base Case Scenario (60% Probability)</h4>
                    <span className="text-2xl font-bold text-primary">$96k–$132k</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Gradual liquidity expansion, stable ETF inflows, orderly mining transitions post-halving. Real rates decline modestly as central banks ease. Institutional adoption continues through regulated vehicles. Derivatives positioning remains balanced without extreme leverage.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-foreground">High Case Scenario (25% Probability)</h4>
                    <span className="text-2xl font-bold text-accent">$180k–$260k</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Accelerated liquidity expansion, sovereign adoption or major sovereign wealth fund allocation, persistent ETF inflows exceeding new supply. Real rates turn negative. Reflexive positioning amplifies upside as gamma squeezes and short covering create convex price action.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/20 to-muted/10 border-2 border-border/40">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-foreground">Stress Case Scenario (15% Probability)</h4>
                    <span className="text-2xl font-bold text-muted-foreground">$45k–$60k</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Liquidity contraction, regulatory disruption affecting ETFs or custody, miner capitulation as hashrate collapses. Real rates spike on renewed inflation or credit stress. Leveraged liquidation cascades through derivatives markets. Institutional outflows accelerate during risk-off environment.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40">
                <h4 className="text-lg font-bold text-foreground mb-4">Risk Factors & Mitigants</h4>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Regulatory risk: ETF approval reversal, custody restrictions, mining bans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Macro risk: credit crisis, sovereign debt defaults, unexpected monetary tightening</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Technical risk: protocol vulnerabilities, quantum computing threats, network splits</span>
                  </li>
                </ul>
              </div>

              <KeyTakeaways insights={[
                "Probabilistic scenario framework integrates macro-liquidity, derivatives positioning, on-chain behavior, and mining economics into coherent narratives—Base Case ($96k-$132k, 60%), High Case ($180k-$260k, 25%), Stress Case ($45k-$60k, 15%).",
                "Base scenario assumes gradual liquidity expansion, stable ETF flows, orderly mining transitions, and modest real-rate declines—institutional adoption continues through regulated vehicles without extreme leverage.",
                "High case requires accelerated M2 expansion, sovereign adoption or major SWF allocation, and persistent ETF inflows exceeding new supply—negative real rates create reflexive gamma squeeze dynamics.",
                "Stress scenario triggered by liquidity contraction, regulatory disruption, miner capitulation, real-rate spikes, or leveraged liquidation cascades—institutional outflows accelerate during risk-off environment."
              ]} />
            </div>
          </ChapterSection>
          <ChapterSection id="chapter-10" dataSection="chapter-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Chapter X</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                2026 Price Targets & Investment Implications
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20">
                <div className="text-center mb-6">
                  <div className="text-sm uppercase tracking-wider text-primary font-bold mb-2">Institutional Weighted Target</div>
                  <div className="text-5xl font-bold text-foreground mb-2">$138,000</div>
                  <div className="text-sm text-muted-foreground">Scenario-weighted expected value for 2026</div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Plausible Maximum</div>
                    <div className="text-xl font-bold text-accent">$220,000</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Base Range</div>
                    <div className="text-xl font-bold text-primary">$96k–$132k</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Stress Floor</div>
                    <div className="text-xl font-bold text-muted-foreground">$50,000</div>
                  </div>
                </div>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                The institutional target of $138,000 represents a scenario-weighted expected value derived from the quantitative framework presented across this report. This figure integrates macro-liquidity impulses, supply dynamics, derivatives positioning, and historical regime behavior.
              </p>

              {/* Scenario Probability Distribution */}
              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <h4 className="text-lg font-bold text-foreground mb-6">Scenario Probability Distribution</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Base Case ($96k-$132k)</span>
                      <span className="font-bold text-primary">60%</span>
                    </div>
                    <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out animate-fade-in flex items-center justify-end pr-3"
                        style={{ width: '60%' }}
                      >
                        <span className="text-xs font-bold text-primary-foreground">60%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">High Case ($180k-$260k)</span>
                      <span className="font-bold text-accent">25%</span>
                    </div>
                    <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-1000 ease-out animate-fade-in flex items-center justify-end pr-3"
                        style={{ width: '25%', animationDelay: '0.2s' }}
                      >
                        <span className="text-xs font-bold text-accent-foreground">25%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Stress Case ($45k-$60k)</span>
                      <span className="font-bold text-muted-foreground">15%</span>
                    </div>
                    <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-muted-foreground to-muted-foreground/80 rounded-full transition-all duration-1000 ease-out animate-fade-in flex items-center justify-end pr-3"
                        style={{ width: '15%', animationDelay: '0.4s' }}
                      >
                        <span className="text-xs font-bold text-background">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">For Institutional Allocators</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Position Bitcoin as a convex macro hedge within multi-asset portfolios. Size allocations based on risk appetite and liquidity horizon. Consider dollar-cost averaging to smooth entry volatility.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/40">
                  <h4 className="text-lg font-bold text-foreground mb-3">For Macro Desks</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Monitor M2 growth rates, real yield curves, and ETF flows for directional signals. Use derivatives for tactical positioning. Hedge tail risks through options during periods of low implied volatility.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <h4 className="text-lg font-bold text-foreground mb-3">Conclusion</h4>
                <p className="text-foreground/80 leading-relaxed m-0">
                  Bitcoin in 2026 is no longer a speculative retail phenomenon. It is a macro liquidity instrument embedded in institutional portfolios, derivatives markets, and regulated investment vehicles. The valuation framework must evolve accordingly—from narrative-driven heuristics to quantitative regime models grounded in observable macro and microstructure data. The $138,000 target reflects this analytical rigor, offering institutional allocators a defensible framework for Bitcoin exposure within a diversified asset allocation strategy.
                </p>
              </div>

              <KeyTakeaways insights={[
                "$138,000 institutional price target represents probability-weighted expected value combining quantitative regime models, macro-liquidity framework, and derivatives-implied positioning analysis.",
                "For institutional allocators: Position Bitcoin as convex macro hedge within multi-asset portfolios, size allocations based on risk appetite and liquidity horizon, consider dollar-cost averaging to smooth volatility.",
                "For macro desks: Monitor M2 growth rates, real yield curves, and ETF flows for directional signals—use derivatives for tactical positioning and hedge tail risks through options during low implied volatility.",
                "Bitcoin has evolved from speculative retail asset to institutional macro instrument—valuation frameworks must shift from narrative heuristics to quantitative models grounded in observable liquidity and microstructure data."
              ]} />

              {/* Investment Implications */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-background to-primary/5 border-2 border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  Investment Implications
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Retail High-Net-Worth Investors</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      The 2026 price targets provide a roadmap for profit-taking and rebalancing. Consider reducing exposure by 30-40% if Bitcoin reaches the upper end of the base case range ($132k). Full position exit is warranted if high convexity scenario materializes ($180k+) as risk-reward becomes unfavorable. Maintain core 2-3% allocation through cycles.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Family Offices & Institutional Allocators</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Institutional portfolios should establish clear rebalancing bands tied to scenario outcomes. If base case unfolds, maintain target allocation through periodic rebalancing. High convexity scenario warrants profit-taking to restore allocation discipline. Stress scenario ($45k-$60k) represents accumulation opportunity for long-term holders with conviction in the macro-liquidity thesis.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                    <h4 className="text-lg font-semibold text-primary mb-3">For Quantitative Traders</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Price targets should be viewed as probability distributions rather than point forecasts. Volatility surface dynamics will shift as scenarios unfold. Monitor implied volatility term structure for regime change signals. Breakout above $140k increases probability of high convexity scenario and warrants momentum strategies. Breakdown below $90k signals potential regime shift to stress scenario.
                    </p>
                  </div>
                </div>
              </div>
            </div>
              </ChapterSection>

              {/* Chapter XI - Risk Management Framework */}
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
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <p className="text-foreground/90 leading-relaxed m-0">
                      Bitcoin's volatility and regime-dependent behavior require sophisticated risk management beyond simple stop-losses. This framework provides institutional-grade risk controls across different market conditions.
                    </p>
                  </div>

                  {/* Position Sizing Guidelines */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Position Sizing Guidelines
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Maximum allocation should be determined by portfolio volatility tolerance and correlation assumptions. For diversified portfolios, Bitcoin allocation of 2-5% provides meaningful upside exposure while limiting drawdown impact. Conservative portfolios (retirees, capital preservation mandates) should cap allocation at 2%. Growth-oriented portfolios (young investors, high risk tolerance) can extend to 7.5% as Fidelity research suggests.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <div className="text-lg font-bold text-muted-foreground mb-2">Conservative</div>
                        <div className="text-3xl font-bold text-primary mb-2">2%</div>
                        <p className="text-sm text-foreground/70">Capital preservation focus</p>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <div className="text-lg font-bold text-foreground mb-2">Balanced</div>
                        <div className="text-3xl font-bold text-primary mb-2">2-5%</div>
                        <p className="text-sm text-foreground/70">Diversified portfolios</p>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <div className="text-lg font-bold text-accent mb-2">Growth</div>
                        <div className="text-3xl font-bold text-primary mb-2">5-7.5%</div>
                        <p className="text-sm text-foreground/70">High risk tolerance</p>
                      </div>
                    </div>
                  </div>

                  {/* Regime-Based Stop Losses */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Regime-Based Stop Losses
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Static stop-losses fail in regime-shifting markets. Our HMM framework identifies three regimes with distinct volatility profiles:
                    </p>
                    <div className="space-y-3">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-foreground">Accumulation Regime</h4>
                          <span className="text-xl font-bold text-primary">15%</span>
                        </div>
                        <p className="text-sm text-foreground/70">Trailing stop from local highs</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-foreground">Expansion Regime</h4>
                          <span className="text-xl font-bold text-accent">25%</span>
                        </div>
                        <p className="text-sm text-foreground/70">Higher volatility tolerance during bull phases</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-foreground">Distribution Regime</h4>
                          <span className="text-xl font-bold text-destructive">10%</span>
                        </div>
                        <p className="text-sm text-foreground/70">Tight stop for capital preservation priority</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mt-4">
                      Regime transitions trigger stop-loss adjustments automatically.
                    </p>
                  </div>

                  {/* Hedging Strategies */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Hedging Strategies
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      For allocations exceeding 5%, consider protective strategies:
                    </p>
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-card border border-border/40">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">Protective Puts</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              10-15% out-of-money puts with 3-6 month expiry provide tail risk protection
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 rounded-xl bg-card border border-border/40">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">Collar Strategies</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              Sell upside calls to finance protective puts for cost-neutral hedging
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 rounded-xl bg-card border border-border/40">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">Dynamic Hedging</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              Increase hedge ratio as volatility rises above 60% (VIX equivalent for Bitcoin)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stress Testing */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Stress Testing
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Portfolio stress tests should incorporate the three scenarios from our framework:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="text-sm font-bold text-primary mb-3">Base Case</h4>
                        <p className="text-sm text-foreground/70 mb-2">-20% to +40% range from current levels</p>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="text-sm font-bold text-accent mb-3">High Convexity</h4>
                        <p className="text-sm text-foreground/70 mb-2">+100% to +180% upside</p>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="text-sm font-bold text-destructive mb-3">Stress Regime</h4>
                        <p className="text-sm text-foreground/70 mb-2">-45% to -60% drawdown</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mt-4">
                      Monte Carlo simulations using regime-dependent return distributions provide robust risk metrics.
                    </p>
                  </div>

                  {/* Rebalancing Discipline */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Rebalancing Discipline
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Systematic rebalancing prevents concentration risk:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-foreground/80">Quarterly rebalancing if allocation drifts &gt;25% from target</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-foreground/80">Opportunistic rebalancing during regime transitions</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-foreground/80">Tax-loss harvesting during stress regimes for taxable accounts</p>
                      </div>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Position sizing should be determined by portfolio volatility tolerance—Conservative (2%), Balanced (2-5%), Growth (5-7.5%)—with allocations exceeding 5% requiring protective hedging strategies.",
                    "Regime-based stop losses adapt to market conditions: 15% trailing stop in accumulation, 25% in expansion (higher volatility tolerance), 10% tight stop in distribution regime for capital preservation.",
                    "Protective strategies for larger allocations include out-of-money puts (10-15%, 3-6 months), collar strategies (sell calls to finance puts), and dynamic hedging with increased hedge ratios when volatility exceeds 60%.",
                    "Systematic rebalancing prevents concentration risk through quarterly adjustments if allocation drifts >25%, opportunistic rebalancing during regime transitions, and tax-loss harvesting in stress scenarios."
                  ]} />
                </div>
              </ChapterSection>

              {/* ===== CHAPTER XII: CROSS-ASSET CORRELATIONS ===== */}
              <ChapterSection id="chapter-12" dataSection="chapter-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <GitBranch className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XII</div>
                    <h2 className="text-3xl font-bold text-foreground">Cross-Asset Correlations</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    Understanding Bitcoin's correlation dynamics across asset classes is essential for portfolio construction. These relationships are regime-dependent, shifting dramatically between risk-on and risk-off environments.
                  </p>

                  {/* Correlation Matrix */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Rolling 90-Day Correlation Matrix (Current)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="py-3 px-4 text-left text-foreground font-semibold">Asset</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">BTC</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">Gold</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">S&P 500</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">Nasdaq</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">US Bonds</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 font-medium text-foreground">Bitcoin</td>
                            <td className="py-3 px-4 text-center text-primary font-bold">1.00</td>
                            <td className="py-3 px-4 text-center text-accent">0.42</td>
                            <td className="py-3 px-4 text-center text-accent">0.58</td>
                            <td className="py-3 px-4 text-center text-accent">0.65</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.28</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 font-medium text-foreground">Gold</td>
                            <td className="py-3 px-4 text-center text-accent">0.42</td>
                            <td className="py-3 px-4 text-center text-primary font-bold">1.00</td>
                            <td className="py-3 px-4 text-center text-muted-foreground">0.12</td>
                            <td className="py-3 px-4 text-center text-muted-foreground">0.08</td>
                            <td className="py-3 px-4 text-center text-accent">0.35</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 font-medium text-foreground">S&P 500</td>
                            <td className="py-3 px-4 text-center text-accent">0.58</td>
                            <td className="py-3 px-4 text-center text-muted-foreground">0.12</td>
                            <td className="py-3 px-4 text-center text-primary font-bold">1.00</td>
                            <td className="py-3 px-4 text-center text-accent">0.92</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.45</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 font-medium text-foreground">Nasdaq</td>
                            <td className="py-3 px-4 text-center text-accent">0.65</td>
                            <td className="py-3 px-4 text-center text-muted-foreground">0.08</td>
                            <td className="py-3 px-4 text-center text-accent">0.92</td>
                            <td className="py-3 px-4 text-center text-primary font-bold">1.00</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.52</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-foreground">US Bonds (TLT)</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.28</td>
                            <td className="py-3 px-4 text-center text-accent">0.35</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.45</td>
                            <td className="py-3 px-4 text-center text-destructive">-0.52</td>
                            <td className="py-3 px-4 text-center text-primary font-bold">1.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Regime-Dependent Correlations */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Regime-Dependent Correlation Shifts
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <h4 className="text-lg font-bold text-foreground mb-3">Risk-On Environment</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li className="flex justify-between"><span>BTC-Nasdaq:</span> <span className="text-accent font-semibold">+0.75</span></li>
                          <li className="flex justify-between"><span>BTC-Gold:</span> <span className="text-muted-foreground font-semibold">+0.15</span></li>
                          <li className="flex justify-between"><span>BTC-Bonds:</span> <span className="text-destructive font-semibold">-0.40</span></li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3 italic">Bitcoin trades as a high-beta tech proxy</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                        <h4 className="text-lg font-bold text-foreground mb-3">Risk-Off Environment</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li className="flex justify-between"><span>BTC-Nasdaq:</span> <span className="text-accent font-semibold">+0.85</span></li>
                          <li className="flex justify-between"><span>BTC-Gold:</span> <span className="text-accent font-semibold">+0.55</span></li>
                          <li className="flex justify-between"><span>BTC-Bonds:</span> <span className="text-muted-foreground font-semibold">-0.15</span></li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3 italic">Gold correlation rises during stress</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                        <h4 className="text-lg font-bold text-foreground mb-3">Liquidity Crisis</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li className="flex justify-between"><span>All Assets:</span> <span className="text-accent font-semibold">→ +0.90</span></li>
                          <li className="flex justify-between"><span>Correlations:</span> <span className="text-destructive font-semibold">Converge to 1</span></li>
                          <li className="flex justify-between"><span>Diversification:</span> <span className="text-destructive font-semibold">Fails</span></li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3 italic">"In a crisis, all correlations go to 1"</p>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Implications */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-3">Portfolio Construction Implications</h4>
                    <div className="space-y-3 text-foreground/80">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p><strong>Diversification benefit diminishes</strong> when you need it most—during market stress, Bitcoin correlates strongly with risk assets</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p><strong>Gold remains the superior hedge</strong> for tail risk protection; Bitcoin should be viewed as a convexity play, not a safe haven</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p><strong>Optimal allocation window</strong> is during Accumulation regime when correlations are lower and entry prices more attractive</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "Bitcoin's correlation to Nasdaq (0.65) confirms its role as a high-beta risk asset, not digital gold",
                  "Regime-dependent correlations require dynamic hedging—static allocations ignore changing risk dynamics",
                  "Gold correlation rises during stress (0.55) but Bitcoin still sells off with equities in acute crises",
                  "Portfolio diversification benefits from Bitcoin are maximized in Accumulation regime, not Expansion"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XIII: REGULATORY LANDSCAPE 2026 ===== */}
              <ChapterSection id="chapter-13" dataSection="chapter-13">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Scale className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XIII</div>
                    <h2 className="text-3xl font-bold text-foreground">Regulatory Landscape 2026</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    The regulatory environment for Bitcoin is undergoing its most significant transformation since inception. 2025-2026 will see major frameworks finalized across key jurisdictions, creating both opportunities and risks for institutional allocators.
                  </p>

                  {/* Regional Breakdown */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Jurisdiction Analysis
                    </h3>

                    {/* Europe - MiCA */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🇪🇺</span>
                        <h4 className="text-xl font-bold text-foreground">European Union: MiCA Implementation</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Key Provisions (Effective Dec 2024)</h5>
                          <ul className="space-y-2 text-sm text-foreground/70">
                            <li>• Crypto Asset Service Provider (CASP) licensing mandatory</li>
                            <li>• Stablecoin reserve requirements (1:1 backing)</li>
                            <li>• Market manipulation and insider trading rules</li>
                            <li>• Consumer protection and disclosure requirements</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Investment Implications</h5>
                          <ul className="space-y-2 text-sm text-foreground/70">
                            <li>• <span className="text-accent">Positive:</span> Regulatory clarity attracts institutional capital</li>
                            <li>• <span className="text-accent">Positive:</span> EU becomes crypto-friendly jurisdiction</li>
                            <li>• <span className="text-destructive">Risk:</span> Compliance costs consolidate market</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* United States */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🇺🇸</span>
                        <h4 className="text-xl font-bold text-foreground">United States: SEC & CFTC Dynamics</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Current Status (2025)</h5>
                          <ul className="space-y-2 text-sm text-foreground/70">
                            <li>• Spot Bitcoin ETFs approved and trading</li>
                            <li>• SEC maintains "regulation by enforcement" stance</li>
                            <li>• CFTC claims jurisdiction over BTC as commodity</li>
                            <li>• Congressional legislation stalled</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">2026 Outlook</h5>
                          <ul className="space-y-2 text-sm text-foreground/70">
                            <li>• <span className="text-accent">Likely:</span> ETF options expansion (approved late 2024)</li>
                            <li>• <span className="text-accent">Possible:</span> FIT21 or similar framework passes</li>
                            <li>• <span className="text-destructive">Risk:</span> Continued regulatory uncertainty</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Asia */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🌏</span>
                        <h4 className="text-xl font-bold text-foreground">Asia-Pacific: Divergent Approaches</h4>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Hong Kong</h5>
                          <ul className="space-y-1 text-sm text-foreground/70">
                            <li>• Spot ETFs approved (Apr 2024)</li>
                            <li>• Retail trading permitted</li>
                            <li>• <span className="text-accent">Pro-crypto stance</span></li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Singapore</h5>
                          <ul className="space-y-1 text-sm text-foreground/70">
                            <li>• Strict retail restrictions</li>
                            <li>• Institutional-friendly framework</li>
                            <li>• <span className="text-muted-foreground">Cautious approach</span></li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Japan</h5>
                          <ul className="space-y-1 text-sm text-foreground/70">
                            <li>• Comprehensive licensing regime</li>
                            <li>• Stablecoin framework established</li>
                            <li>• <span className="text-accent">Mature regulatory environment</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Regulatory Risk Matrix */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Regulatory Risk Matrix
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-accent mb-3">Low Risk (Bullish)</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li>• Spot ETF options expansion</li>
                          <li>• Clear commodity classification</li>
                          <li>• Banking integration (custody)</li>
                          <li>• 401(k) access expansion</li>
                        </ul>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-destructive mb-3">High Risk (Bearish)</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li>• Mining ban (environmental)</li>
                          <li>• Self-custody restrictions</li>
                          <li>• Punitive taxation (unrealized gains)</li>
                          <li>• CBDC competition mandates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "MiCA creates regulatory clarity in EU—expect institutional capital flows to accelerate in 2025-2026",
                  "US regulatory uncertainty persists but ETF approval signals de facto acceptance of Bitcoin as legitimate asset",
                  "Hong Kong's pro-crypto stance positions it as Asia's digital asset hub, with potential mainland China implications",
                  "Key risk: Environmental regulations targeting proof-of-work mining could create supply-side disruption"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XIV: INSTITUTIONAL ADOPTION METRICS ===== */}
              <ChapterSection id="chapter-14" dataSection="chapter-14">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XIV</div>
                    <h2 className="text-3xl font-bold text-foreground">Institutional Adoption Metrics</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    Institutional adoption has moved beyond speculation into measurable allocation trends. Tracking these metrics provides leading indicators for sustained price support.
                  </p>

                  {/* Adoption Categories */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Institutional Holder Categories
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Corporate Treasury */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <h4 className="text-xl font-bold text-foreground mb-4">Corporate Treasury Holdings</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <a href="https://www.google.com/finance/quote/MSTR:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors underline decoration-dotted">Strategy (MSTR)</a>
                            <span className="text-primary font-bold">660,624 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <a href="https://www.google.com/finance/quote/MARA:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors underline decoration-dotted">MARA Holdings (MARA)</a>
                            <span className="text-primary font-bold">53,250 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <a href="https://www.google.com/finance/quote/TSLA:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors underline decoration-dotted">Tesla (TSLA)</a>
                            <span className="text-primary font-bold">11,509 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <a href="https://www.google.com/finance/quote/XYZ:NYSE" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors underline decoration-dotted">Block (XYZ)</a>
                            <span className="text-primary font-bold">8,780 BTC</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 italic">Total corporate holdings: ~500,000+ BTC (2.4% of supply)</p>
                      </div>

                      {/* ETF Holdings */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                        <h4 className="text-xl font-bold text-foreground mb-4">Spot ETF Holdings (US)</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <span className="text-foreground/80">BlackRock IBIT</span>
                            <span className="text-accent font-bold">~550,000 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <span className="text-foreground/80">Fidelity FBTC</span>
                            <span className="text-accent font-bold">~205,000 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/20">
                            <span className="text-foreground/80">Grayscale GBTC</span>
                            <span className="text-accent font-bold">~210,000 BTC</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-foreground/80">Other ETFs</span>
                            <span className="text-accent font-bold">~150,000 BTC</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 italic">Total ETF holdings: ~1.1M BTC (5.2% of supply)</p>
                      </div>
                    </div>
                  </div>

                  {/* Emerging Institutional Categories */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Emerging Institutional Categories (2025-2026 Watch)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-foreground mb-2">Sovereign Wealth Funds</h4>
                        <p className="text-sm text-foreground/70 mb-3">Norway GPFG, Singapore GIC, Abu Dhabi ADIA exploring allocations</p>
                        <div className="text-xs text-accent">Potential: $50-200B inflows</div>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-foreground mb-2">Pension Funds</h4>
                        <p className="text-sm text-foreground/70 mb-3">Wisconsin State, Houston Firefighters, UK pensions testing waters</p>
                        <div className="text-xs text-accent">Potential: $100-500B TAM</div>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-foreground mb-2">Insurance Companies</h4>
                        <p className="text-sm text-foreground/70 mb-3">MassMutual, TIAA-CREF precedents set; regulatory barriers easing</p>
                        <div className="text-xs text-accent">Potential: $50-150B TAM</div>
                      </div>
                    </div>
                  </div>

                  {/* Adoption Velocity Metrics */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Adoption Velocity Indicators</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">1,100+</div>
                        <p className="text-sm text-foreground/70">13F Filers with BTC ETF exposure</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent mb-1">$120B+</div>
                        <p className="text-sm text-foreground/70">Total ETF AUM (US + Global)</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">7.6%</div>
                        <p className="text-sm text-foreground/70">Supply held by institutions</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent mb-1">+2.5%</div>
                        <p className="text-sm text-foreground/70">YoY institutional growth</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "ETFs have absorbed 1.1M BTC (5.2% of supply) in 12 months—fastest institutional adoption of any asset class in history",
                  "Corporate treasury adoption remains concentrated (Strategy ~90% of total) but provides price floor support",
                  "Sovereign wealth funds and pension funds represent the next wave—2026 may see first major SWF allocation announcements",
                  "Institutional supply absorption rate exceeds new issuance by 3x, creating structural demand-supply imbalance"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XV: MACRO CALENDAR 2026 ===== */}
              <ChapterSection id="chapter-15" dataSection="chapter-15">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XV</div>
                    <h2 className="text-3xl font-bold text-foreground">Macro Calendar & Key Dates 2026</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    Critical dates for portfolio positioning. Our framework integrates scheduled events with regime probability shifts to optimize entry/exit timing.
                  </p>

                  {/* Q1 2026 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <div className="px-3 py-1 rounded bg-primary/20 text-primary text-sm font-bold">Q1 2026</div>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Jan 28-29</div>
                          <div className="text-sm text-foreground/70">FOMC Meeting</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">High Impact</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Mar 17-18</div>
                          <div className="text-sm text-foreground/70">FOMC Meeting + Dot Plot</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Critical</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Mar 26</div>
                          <div className="text-sm text-foreground/70">CME BTC Options Quarterly Expiry</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">High Impact</span>
                      </div>
                    </div>
                  </div>

                  {/* Q2 2026 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <div className="px-3 py-1 rounded bg-accent/20 text-accent text-sm font-bold">Q2 2026</div>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Apr 17</div>
                          <div className="text-sm text-foreground/70">Halving Anniversary (2 years post-halving)</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-primary/30 text-primary font-bold">Cycle Milestone</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">May 5-6</div>
                          <div className="text-sm text-foreground/70">FOMC Meeting</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">High Impact</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Jun 16-17</div>
                          <div className="text-sm text-foreground/70">FOMC Meeting + SEP Update</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Critical</span>
                      </div>
                    </div>
                  </div>

                  {/* Q3-Q4 2026 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-sm font-bold">Q3-Q4 2026</div>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Sep 15-16</div>
                          <div className="text-sm text-foreground/70">FOMC Meeting + Dot Plot</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Critical</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Nov 3</div>
                          <div className="text-sm text-foreground/70">US Midterm Elections</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Critical</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-foreground">Dec 15-16</div>
                          <div className="text-sm text-foreground/70">FOMC Year-End Meeting</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">High Impact</span>
                      </div>
                    </div>
                  </div>

                  {/* Positioning Framework */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                    <h4 className="text-lg font-bold text-foreground mb-4">Event-Based Positioning Framework</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Pre-FOMC (7 days before)</h5>
                        <p className="text-sm text-foreground/70">Reduce position size by 20-30%; elevated volatility expected. Avoid new entries.</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Post-FOMC (3 days after)</h5>
                        <p className="text-sm text-foreground/70">Optimal entry window if dovish surprise. Wait for dust to settle before adding.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "April 2026 marks 2-year post-halving—historically the peak probability zone for cycle tops",
                  "FOMC meetings with dot plots (Mar, Jun, Sep, Dec) drive largest volatility spikes",
                  "Reduce exposure 7 days before critical events; add on dovish surprises post-meeting",
                  "Q4 2026 US midterm elections could trigger policy uncertainty and volatility regime"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XVI: GEOPOLITICAL RISK ANALYSIS ===== */}
              <ChapterSection id="chapter-16" dataSection="chapter-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <AlertTriangle className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XVI</div>
                    <h2 className="text-3xl font-bold text-foreground">Geopolitical Risk Analysis</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    Bitcoin's narrative as "digital gold" and hedge against monetary debasement gains strength during geopolitical instability. Understanding these dynamics is critical for institutional positioning.
                  </p>

                  {/* Key Geopolitical Themes */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Key Geopolitical Themes for 2026
                    </h3>

                    <div className="space-y-4">
                      {/* Dedollarization */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                        <h4 className="text-xl font-bold text-foreground mb-3">Dedollarization & BRICS Expansion</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                              BRICS+ now represents 45% of global population and 35% of GDP. Active efforts to create alternative settlement systems (mBridge, bilateral agreements) reduce USD dominance.
                            </p>
                            <p className="text-sm text-accent">Bitcoin implication: Neutral settlement layer gains appeal as geopolitical tensions fragment traditional systems.</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background/50">
                            <h5 className="font-semibold text-foreground mb-2">Key Developments</h5>
                            <ul className="space-y-1 text-sm text-foreground/70">
                              <li>• China-Russia energy trade in RMB</li>
                              <li>• Saudi Arabia pricing oil in multiple currencies</li>
                              <li>• Central bank gold accumulation accelerating</li>
                              <li>• BRICS payment system development</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* US-China Tensions */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                        <h4 className="text-xl font-bold text-foreground mb-3">US-China Technology Decoupling</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                              Semiconductor export controls, investment restrictions, and technology sanctions fragment global supply chains. Bitcoin mining hardware (ASICs) caught in crossfire.
                            </p>
                            <p className="text-sm text-destructive">Risk: Mining hardware supply disruption could impact hashrate and security.</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background/50">
                            <h5 className="font-semibold text-foreground mb-2">Scenario Analysis</h5>
                            <ul className="space-y-1 text-sm text-foreground/70">
                              <li>• Taiwan tensions → supply chain crisis</li>
                              <li>• Further sanctions → hashrate migration</li>
                              <li>• Currency wars → BTC as neutral asset</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Monetary Sovereignty */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                        <h4 className="text-xl font-bold text-foreground mb-3">Monetary Sovereignty & CBDCs</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                              130+ countries exploring CBDCs. China's digital yuan in advanced rollout. ECB digital euro targeted for 2026. Privacy concerns drive alternative demand.
                            </p>
                            <p className="text-sm text-accent">Bitcoin implication: CBDCs highlight privacy value proposition; potential regulatory pushback against self-custody.</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background/50">
                            <h5 className="font-semibold text-foreground mb-2">CBDC Timeline</h5>
                            <ul className="space-y-1 text-sm text-foreground/70">
                              <li>• 🇨🇳 China: Live (limited rollout)</li>
                              <li>• 🇪🇺 EU: 2026-2027 target launch</li>
                              <li>• 🇺🇸 US: Research phase (politically contentious)</li>
                              <li>• 🇬🇧 UK: 2025-2026 consultation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Black Swan Scenarios */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-destructive rounded-full"></div>
                      Black Swan Scenarios
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-card border border-destructive/30">
                        <h4 className="font-bold text-destructive mb-2">Quantum Computing Breakthrough</h4>
                        <p className="text-sm text-foreground/70">Cryptographic vulnerability exposure. Timeline: 10-15 years for practical threat, but announcements could trigger panic selling.</p>
                        <div className="mt-2 text-xs text-muted-foreground">Probability: Very Low | Impact: Severe</div>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-destructive/30">
                        <h4 className="font-bold text-destructive mb-2">Major Exchange Failure</h4>
                        <p className="text-sm text-foreground/70">FTX-scale collapse at remaining major venues. Contagion risk to custody providers and lending platforms.</p>
                        <div className="mt-2 text-xs text-muted-foreground">Probability: Low-Medium | Impact: High</div>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-destructive/30">
                        <h4 className="font-bold text-destructive mb-2">Coordinated G20 Ban</h4>
                        <p className="text-sm text-foreground/70">Synchronized regulatory action citing financial stability or environmental concerns. Increasingly unlikely post-ETF approval.</p>
                        <div className="mt-2 text-xs text-muted-foreground">Probability: Very Low | Impact: Severe</div>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-destructive/30">
                        <h4 className="font-bold text-destructive mb-2">Protocol-Level Bug</h4>
                        <p className="text-sm text-foreground/70">Critical vulnerability in Bitcoin Core. 15-year track record provides confidence, but tail risk remains.</p>
                        <div className="mt-2 text-xs text-muted-foreground">Probability: Very Low | Impact: Catastrophic</div>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "Dedollarization accelerates Bitcoin's 'neutral money' narrative—BRICS expansion is structurally bullish",
                  "US-China decoupling creates mining supply chain risks but reinforces censorship-resistance value",
                  "CBDC rollouts paradoxically strengthen Bitcoin's privacy and self-custody value proposition",
                  "Black swan risks require position sizing discipline—never allocate more than you can afford to lose entirely"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XVII: HISTORICAL CYCLE COMPARISON ===== */}
              <ChapterSection id="chapter-17" dataSection="chapter-17">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XVII</div>
                    <h2 className="text-3xl font-bold text-foreground">Historical Cycle Comparison</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    While we caution against relying solely on cycle analysis, understanding historical patterns provides context for current positioning. This cycle differs fundamentally due to ETF-driven institutional flows.
                  </p>

                  {/* Cycle Comparison Table */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Cycle Metrics Comparison
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="py-3 px-4 text-left text-foreground font-semibold">Metric</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">2013 Cycle</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">2017 Cycle</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">2021 Cycle</th>
                            <th className="py-3 px-4 text-center text-primary font-semibold">2024-25 Cycle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-foreground">Halving Date</td>
                            <td className="py-3 px-4 text-center text-foreground/70">Nov 2012</td>
                            <td className="py-3 px-4 text-center text-foreground/70">Jul 2016</td>
                            <td className="py-3 px-4 text-center text-foreground/70">May 2020</td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">Apr 2024</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-foreground">Cycle Low</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$2</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$152</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$3,850</td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">$15,500</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-foreground">Cycle High</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$1,150</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$19,700</td>
                            <td className="py-3 px-4 text-center text-foreground/70">$69,000</td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">$108,000 (ATH)</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-foreground">Peak Multiplier</td>
                            <td className="py-3 px-4 text-center text-accent font-semibold">575x</td>
                            <td className="py-3 px-4 text-center text-accent font-semibold">130x</td>
                            <td className="py-3 px-4 text-center text-accent font-semibold">18x</td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">7x (so far)</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-foreground">Days to Peak (post-halving)</td>
                            <td className="py-3 px-4 text-center text-foreground/70">367</td>
                            <td className="py-3 px-4 text-center text-foreground/70">525</td>
                            <td className="py-3 px-4 text-center text-foreground/70">546</td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">~240 (ongoing)</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-foreground">Peak Drawdown</td>
                            <td className="py-3 px-4 text-center text-destructive font-semibold">-87%</td>
                            <td className="py-3 px-4 text-center text-destructive font-semibold">-84%</td>
                            <td className="py-3 px-4 text-center text-destructive font-semibold">-77%</td>
                            <td className="py-3 px-4 text-center text-muted-foreground">TBD</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Differences This Cycle */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                      Why This Cycle Is Different
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                        <h4 className="font-bold text-foreground mb-2">ETF-Driven Demand</h4>
                        <p className="text-sm text-foreground/70">First cycle with regulated spot ETFs. Institutional inflows create persistent bid that didn't exist before. Daily ETF flows now exceed mining issuance by 5-10x.</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <h4 className="font-bold text-foreground mb-2">Macro Regime Dominance</h4>
                        <p className="text-sm text-foreground/70">M2 liquidity and real rates now dominate price action over halving supply dynamics. 2020-2021 proved QE correlation; 2022 proved QT correlation.</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                        <h4 className="font-bold text-foreground mb-2">Reduced Volatility</h4>
                        <p className="text-sm text-foreground/70">Institutional participation dampens extremes. 30-day realized vol trending lower each cycle. Expect shallower drawdowns but also compressed upside.</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                        <h4 className="font-bold text-foreground mb-2">Mature Derivatives</h4>
                        <p className="text-sm text-foreground/70">CME futures, options, and institutional hedging tools allow position management. Reduces forced liquidation cascades that amplified previous cycle peaks/troughs.</p>
                      </div>
                    </div>
                  </div>

                  {/* Cycle Position Indicator */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Where Are We in the Cycle?</h4>
                    <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-4">
                      <div className="absolute left-0 top-0 h-full w-[65%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <div className="absolute left-[65%] top-0 h-full w-1 bg-white"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Cycle Low</span>
                      <span>Accumulation</span>
                      <span>Expansion ← You Are Here</span>
                      <span>Distribution</span>
                      <span>Cycle Top</span>
                    </div>
                    <p className="text-sm text-foreground/70 mt-4">Based on our HMM regime model, we are currently in mid-Expansion phase with 60-70% of typical cycle gains realized. Historical peak timing suggests Q2-Q4 2026 as highest probability window for cycle top.</p>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "Diminishing returns each cycle: 575x → 130x → 18x → ~10x expected. Maturation compresses multiples.",
                  "Historical peak timing: 12-18 months post-halving (Apr 2025 - Oct 2025) for primary peak",
                  "ETF flows fundamentally alter supply/demand—institutional bid provides higher floor than prior cycles",
                  "Expect shallower drawdown (50-60% vs 80%+) but also compressed upside relative to prior cycles"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XVIII: EXIT STRATEGY FRAMEWORK ===== */}
              <ChapterSection id="chapter-18" dataSection="chapter-18">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <LogOut className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XVIII</div>
                    <h2 className="text-3xl font-bold text-foreground">Exit Strategy Framework</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    The difference between paper gains and realized profits is an exit strategy. Our regime-based framework provides systematic rules for taking profits while maintaining upside exposure.
                  </p>

                  {/* Exit Triggers */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Regime-Based Exit Signals
                    </h3>
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                            <span className="text-destructive font-bold">!</span>
                          </div>
                          <h4 className="text-xl font-bold text-foreground">DISTRIBUTION Regime Confirmation</h4>
                        </div>
                        <p className="text-foreground/80 mb-4">Primary exit signal. When our HMM model transitions from EXPANSION to DISTRIBUTION:</p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-background/50">
                            <div className="text-2xl font-bold text-destructive mb-1">Sell 30%</div>
                            <p className="text-sm text-foreground/70">On first confirmation</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background/50">
                            <div className="text-2xl font-bold text-destructive mb-1">Sell 30%</div>
                            <p className="text-sm text-foreground/70">On sustained (7+ days)</p>
                          </div>
                          <div className="p-4 rounded-lg bg-background/50">
                            <div className="text-2xl font-bold text-destructive mb-1">Hold 40%</div>
                            <p className="text-sm text-foreground/70">For potential blow-off top</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price-Based Targets */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                      Price-Based Profit Taking Ladder
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="py-3 px-4 text-left text-foreground font-semibold">Price Level</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">Action</th>
                            <th className="py-3 px-4 text-center text-foreground font-semibold">Cumulative Sold</th>
                            <th className="py-3 px-4 text-left text-foreground font-semibold">Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-accent font-bold">$120,000</td>
                            <td className="py-3 px-4 text-center text-foreground">Sell 10%</td>
                            <td className="py-3 px-4 text-center text-foreground/70">10%</td>
                            <td className="py-3 px-4 text-foreground/70">Psychological resistance; secure initial profits</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-accent font-bold">$150,000</td>
                            <td className="py-3 px-4 text-center text-foreground">Sell 15%</td>
                            <td className="py-3 px-4 text-center text-foreground/70">25%</td>
                            <td className="py-3 px-4 text-foreground/70">Base case upper bound; lock in core gains</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-accent font-bold">$180,000</td>
                            <td className="py-3 px-4 text-center text-foreground">Sell 15%</td>
                            <td className="py-3 px-4 text-center text-foreground/70">40%</td>
                            <td className="py-3 px-4 text-foreground/70">High convexity scenario entry; elevated caution</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-4 text-primary font-bold">$200,000</td>
                            <td className="py-3 px-4 text-center text-foreground">Sell 20%</td>
                            <td className="py-3 px-4 text-center text-foreground/70">60%</td>
                            <td className="py-3 px-4 text-foreground/70">Major psychological level; extended territory</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-primary font-bold">$250,000+</td>
                            <td className="py-3 px-4 text-center text-foreground">Sell 25%</td>
                            <td className="py-3 px-4 text-center text-foreground/70">85%</td>
                            <td className="py-3 px-4 text-foreground/70">Blow-off top territory; preserve moonbag only</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-muted-foreground italic">Note: Adjust levels based on entry price and individual risk tolerance. This is a framework, not financial advice.</p>
                  </div>

                  {/* Warning Signs */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-destructive rounded-full"></div>
                      Distribution Warning Signs
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-foreground mb-3">On-Chain Signals</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Long-term holder selling accelerates</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Exchange inflows spike</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Miner outflows increase</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> MVRV Z-Score enters overvalued zone (&gt;7)</li>
                        </ul>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/40">
                        <h4 className="font-bold text-foreground mb-3">Market Structure Signals</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Funding rates persistently &gt;0.1%</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Open interest at cycle highs</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> ETF flows turn negative</li>
                          <li className="flex items-start gap-2"><span className="text-destructive">⚠️</span> Retail euphoria (Google Trends spike)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Reentry Framework */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20">
                    <h4 className="text-lg font-bold text-foreground mb-4">Reentry Framework</h4>
                    <p className="text-foreground/80 mb-4">After taking profits, deploy capital back during the next ACCUMULATION regime:</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-accent mb-1">DCA 30%</div>
                        <p className="text-sm text-foreground/70">When -50% from peak</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-accent mb-1">DCA 40%</div>
                        <p className="text-sm text-foreground/70">On ACCUMULATION confirmation</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-accent mb-1">DCA 30%</div>
                        <p className="text-sm text-foreground/70">Over next 6 months</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "DISTRIBUTION regime confirmation is the primary exit signal—sell 60% systematically on transition",
                  "Price-based ladder provides structure: 10% at $120k, then 15% increments at key levels",
                  "Watch on-chain distribution (LTH selling, exchange inflows) and derivatives (funding, OI) for confirmation",
                  "Always keep 15-20% 'moonbag' for potential blow-off top; reentry on ACCUMULATION regime"
                ]} />
              </ChapterSection>

              {/* ===== CHAPTER XIX: LIGHTNING NETWORK & LAYER 2 ===== */}
              <ChapterSection id="chapter-19" dataSection="chapter-19">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Chapter XIX</div>
                    <h2 className="text-3xl font-bold text-foreground">Lightning Network & Layer 2</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    Lightning Network represents Bitcoin's scaling solution, enabling instant, low-cost transactions. While not directly impacting price, network growth validates the "medium of exchange" narrative alongside "store of value."
                  </p>

                  {/* Network Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Network Capacity Metrics
                    </h3>
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

                  {/* Adoption Drivers */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                      Key Adoption Drivers
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-card border border-border/40">
                        <h4 className="text-lg font-bold text-foreground mb-3">US Strategic Reserve & Corporate Treasury</h4>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                          Trump administration's Strategic Bitcoin Reserve proposal represents potential paradigm shift. Strategy (ex-MicroStrategy) pioneered corporate treasury strategy now replicated by dozens of companies.
                        </p>
                        <ul className="space-y-1 text-sm text-foreground/70">
                          <li>• US Strategic Reserve bill under Congressional review</li>
                          <li>• <a href="https://www.google.com/finance/quote/MSTR:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline">Strategy (MSTR)</a>: 660,624 BTC ($66B+)</li>
                          <li>• <a href="https://www.google.com/finance/quote/MARA:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline">MARA</a>, <a href="https://www.google.com/finance/quote/TSLA:NASDAQ" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline">Tesla</a>, <a href="https://www.google.com/finance/quote/XYZ:NYSE" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline">Block</a> maintain BTC treasuries</li>
                          <li>• State-level reserve proposals (Texas, Wyoming)</li>
                        </ul>
                      </div>
                      <div className="p-6 rounded-xl bg-card border border-border/40">
                        <h4 className="text-lg font-bold text-foreground mb-3">ETF & Exchange Integration</h4>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                          US Spot ETFs exceeded $100B AUM in 2024. Major exchanges (Coinbase, Kraken, OKX) fully integrated Lightning. Strike, Cash App driving retail adoption.
                        </p>
                        <ul className="space-y-1 text-sm text-foreground/70">
                          <li>• Spot ETF AUM: $100B+ (BlackRock, Fidelity lead)</li>
                          <li>• ETF options launched Nov 2024</li>
                          <li>• Lightning adoption on all major exchanges</li>
                          <li>• Institutional custody solutions mature</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Investment Implications */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Investment Implications</h4>
                    <div className="space-y-3 text-foreground/80">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                        <p><strong>Long-term bullish:</strong> Addresses scalability concerns; validates Bitcoin's utility beyond speculation</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                        <p><strong>Emerging market adoption:</strong> Remittance corridors (US-LatAm, Africa) drive real-world usage</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p><strong>Not a near-term catalyst:</strong> Capacity (~$500M) too small to impact price directly; narrative value only</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0"></div>
                        <p><strong>Technical risks:</strong> Channel management complexity, liquidity fragmentation, potential protocol vulnerabilities</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "Lightning capacity up 120% YoY—network effects accelerating but total value (~$500M) remains immaterial to price",
                  "US Strategic Reserve proposal and corporate treasury adoption signal mainstream institutional acceptance",
                  "Exchange integration (Coinbase, Kraken, OKX) drives accessibility and normalizes Lightning usage",
                  "Long-term narrative value significant; near-term price impact minimal. Monitor as adoption metric, not trading signal."
                ]} />
              </ChapterSection>

              {/* About the ARIES76 Team */}
              <div className="mt-24 p-10 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/20">
                <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                  About the ARIES76 Team
                </h2>
                
                <div className="space-y-6">
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    ARIES76 Capital Intelligence is a London-based advisory firm specializing in quantitative analysis of digital assets and private markets. Our team combines deep expertise in macro-liquidity analysis, derivatives pricing, and institutional portfolio construction.
                  </p>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">Our Expertise:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-2">Quantitative Research</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          PhDs in Financial Economics and Applied Mathematics
                        </p>
                      </div>
                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-2">Institutional Experience</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          Former analysts from leading investment banks and hedge funds
                        </p>
                      </div>
                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-2">Macro Analysis</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          Specialized in global liquidity dynamics and central bank policy transmission
                        </p>
                      </div>
                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-2">Digital Assets</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          7+ years tracking Bitcoin and crypto markets through multiple cycles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-primary/10">
                    <h3 className="text-xl font-bold text-foreground mb-3">What Makes Us Different:</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      While competitors focus on narrative-driven analysis and historical cycle patterns, ARIES76 employs rigorous quantitative frameworks grounded in macro-liquidity theory. Our proprietary models integrate real-time data across derivatives markets, on-chain analytics, ETF flows, and global M2 dynamics to provide institutional-grade intelligence.
                    </p>
                  </div>

                  <div className="mt-8 p-6 rounded-xl bg-card/50 border border-border/40">
                    <h3 className="text-xl font-bold text-foreground mb-3">Track Record:</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Our macro-liquidity framework successfully identified the 2023 bottom and the 2024 ETF-driven rally before consensus. Our clients include family offices, institutional allocators, and sophisticated individual investors seeking data-driven insights beyond mainstream crypto commentary.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Our Clients Say */}
              <div className="mt-16 p-10 rounded-2xl bg-gradient-to-br from-accent/5 via-background to-primary/5 border-2 border-accent/20">
                <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-accent rounded-full"></div>
                  What Our Clients Say
                </h2>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-card/50 border border-border/40 relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl text-primary">"</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed mb-4 italic">
                      ARIES76's macro-liquidity framework provided the conviction we needed to increase our Bitcoin allocation in early 2024. Their quantitative approach stands apart from the narrative-driven analysis flooding the market.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">CIO</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Chief Investment Officer</p>
                        <p className="text-xs text-muted-foreground">European Family Office</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40 relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl text-primary">"</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed mb-4 italic">
                      The regime-based risk management framework has been invaluable for our institutional portfolio. Finally, a research provider that understands how Bitcoin fits into a diversified allocation.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">PM</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Portfolio Manager</p>
                        <p className="text-xs text-muted-foreground">Multi-Strategy Fund</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-card/50 border border-border/40 relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl text-primary">"</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed mb-4 italic">
                      ARIES76's analysis goes far beyond simplistic cycle theory. Their integration of ETF flows, derivatives positioning, and on-chain metrics provides actionable intelligence we can't find elsewhere.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">P</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Principal</p>
                        <p className="text-xs text-muted-foreground">Crypto-Focused Hedge Fund</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-24 p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full bg-primary rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">Disclaimer</h3>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        This report is provided for informational purposes only and does not constitute investment advice. Bitcoin and digital assets are highly volatile. Investors should conduct their own due diligence and consult qualified financial advisors.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground">© 2025 ARIES76 Capital Intelligence</p>
                    </div>
                    <div className="text-sm">
                      <a href="mailto:edoardo.grigione@aries76.com" className="text-primary hover:text-accent transition-colors font-medium">
                        edoardo.grigione@aries76.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Table of Contents */}
            <div className="hidden xl:block w-72 flex-shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)]">
                <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider sticky top-0 bg-card/90 backdrop-blur-sm py-2 -mt-2">Contents</h3>
                  <nav className="space-y-2">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          const element = document.getElementById(chapter.id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className={`group w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                          activeSection === chapter.id
                            ? 'bg-primary/10 border-l-2 border-primary'
                            : 'hover:bg-muted/50 border-l-2 border-transparent'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          activeSection === chapter.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        }`}>
                          {chapter.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug transition-colors ${
                            activeSection === chapter.id
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}>
                            {chapter.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
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

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @media print {
          /* Reset page settings */
          @page {
            size: A4;
            margin: 1.5cm;
          }

          /* Body and container */
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Hide non-print elements */
          nav, 
          footer,
          .fixed,
          button[aria-label="Back to top"],
          .hidden.xl\\:block {
            display: none !important;
          }

          /* Show all content */
          .min-h-screen {
            min-height: auto !important;
          }

          /* Ensure backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Section page breaks */
          section[data-section] {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 2rem !important;
          }

          /* Prevent breaks inside cards and tables */
          .rounded-2xl,
          .rounded-xl,
          table,
          .recharts-wrapper {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Force page break before major chapters */
          #executive-summary,
          #chapter-2,
          #chapter-5,
          #chapter-7,
          #chapter-10 {
            page-break-before: always;
            break-before: page;
          }

          /* Charts - ensure they print */
          .recharts-wrapper {
            overflow: visible !important;
          }

          .recharts-surface {
            overflow: visible !important;
          }

          /* Typography adjustments */
          h1 { font-size: 28pt !important; }
          h2 { font-size: 20pt !important; }
          h3 { font-size: 14pt !important; }
          p, li { font-size: 10pt !important; line-height: 1.5 !important; }

          /* Remove animations */
          * {
            animation: none !important;
            transition: none !important;
          }

          /* Remove backdrop blur (not supported in print) */
          .backdrop-blur-sm,
          .backdrop-blur-lg {
            backdrop-filter: none !important;
            background-color: white !important;
          }

          /* Ensure gradients print */
          .bg-gradient-to-br,
          .bg-gradient-to-r {
            background: #f8f9fa !important;
            border: 1px solid #e5e7eb !important;
          }

          /* Table styling for print */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          th, td {
            border: 1px solid #d1d5db !important;
            padding: 8px !important;
            text-align: left !important;
          }

          th {
            background-color: #f3f4f6 !important;
            font-weight: bold !important;
          }

          /* Links styling */
          a {
            color: #1a2332 !important;
            text-decoration: none !important;
          }

          /* Container width */
          .container,
          .max-w-5xl {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }

          /* Remove sticky positioning */
          .sticky {
            position: relative !important;
          }

          /* Key Takeaways styling */
          .from-muted\\/30 {
            background-color: #f8f9fa !important;
            border: 2px solid #e5e7eb !important;
          }

          /* Icon containers for print */
          .bg-primary\\/10,
          .bg-primary\\/20,
          .bg-accent\\/10 {
            background-color: #e5e7eb !important;
          }

          /* Remove opacity classes */
          .opacity-0 {
            opacity: 1 !important;
          }

          /* Testimonials section */
          .from-accent\\/5 {
            background-color: #fafafa !important;
          }

          /* Print header on each page */
          .print-header {
            display: block !important;
          }
        }

        /* Print-only elements hidden on screen */
        .print-only {
          display: none;
        }

        @media print {
          .print-only {
            display: block !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </TooltipProvider>
  );
};

export default Bitcoin2026Report;
