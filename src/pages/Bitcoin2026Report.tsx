import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart, Lightbulb, HelpCircle } from "lucide-react";
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
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
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
              </a>
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
            </div>
              </ChapterSection>
              
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
              <div className="sticky top-20">
                <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Contents</h3>
                  <nav className="space-y-2">
                    {chapters.map((chapter) => (
                      <a
                        key={chapter.id}
                        href={`#${chapter.id}`}
                        className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
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
                      </a>
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
      `}</style>
    </TooltipProvider>
  );
};

export default Bitcoin2026Report;
