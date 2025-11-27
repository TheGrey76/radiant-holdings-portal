import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import btcPriceFig from "@/assets/bitcoin_2026_fig1_btc.png";
import m2LiquidityFig from "@/assets/bitcoin_2026_fig2_m2.png";
import realRatesFig from "@/assets/bitcoin_2026_fig3_real_rates.png";

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
    <>
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

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-6 pb-24">
          {/* Chapter I */}
          <section id="chapter-1" data-section="chapter-1" className="mb-24 scroll-mt-20">
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
                  Bitcoin's trajectory over the 2025–2026 horizon must be interpreted within a refined macro-liquidity framework rather than through the simplistic heuristics that characterised earlier cycles. Bitcoin has evolved into a liquidity-sensitive macro asset whose price formation is dominated by global M2 impulses, real-rate dynamics, cross-border dollar transmission, and the balance-sheet elasticity of shadow banking intermediaries and ETF market makers.
                </p>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <img 
                  src={btcPriceFig} 
                  alt="Bitcoin Price Analysis" 
                  className="w-full h-auto rounded-lg"
                />
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
                    Global M2 remains the most important macro variable. What matters is the marginal liquidity impulse: accelerations produce convex responses in Bitcoin, while stagnation coincides with volatility spikes.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                    Real Rates Impact
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Rising real yields increase opportunity cost of non-yielding assets. Declining real yields reduce that cost and incentivise search for convex, high-beta exposures like Bitcoin.
                  </p>
                </div>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <img 
                  src={m2LiquidityFig} 
                  alt="Global M2 Liquidity Proxy" 
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4 text-center font-medium">
                  Figure 2 — Global M2 Liquidity Proxy (2013–2025)
                </p>
              </div>

              <div className="my-12 p-8 rounded-2xl bg-card border-2 border-border/40 shadow-lg">
                <img 
                  src={realRatesFig} 
                  alt="Real Rates Regime" 
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4 text-center font-medium">
                  Figure 3 — Real Rates Regime (2013–2025)
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                <h4 className="text-xl font-bold text-foreground mb-4">Key Synthesis</h4>
                <p className="text-foreground/80 leading-relaxed">
                  The combined evidence supports a clear macro identity for Bitcoin. It is a high-convexity, liquidity-sensitive asset whose price behaviour is governed less by "cycles" and more by the interplay between global M2 growth, real-rate trends, shadow liquidity and institutional flow channels.
                </p>
              </div>
            </div>
          </section>

          {/* Chapter II */}
          <section id="chapter-2" data-section="chapter-2" className="mb-24 scroll-mt-20">
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="high" stroke="hsl(var(--accent))" fill="url(#colorHigh)" name="High Case" />
                    <Area type="monotone" dataKey="base" stroke="hsl(var(--primary))" fill="url(#colorBase)" name="Base Case" />
                    <Area type="monotone" dataKey="stress" stroke="hsl(var(--muted-foreground))" fill="transparent" name="Stress Case" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Chapter III */}
          <section id="chapter-3" data-section="chapter-3" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Chapter IV */}
          <section id="chapter-4" data-section="chapter-4" className="mb-24 scroll-mt-20">
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="inflows" fill="hsl(var(--primary))" name="Inflows" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="outflows" fill="hsl(var(--muted-foreground))" name="Outflows" radius={[8, 8, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Chapter V */}
          <section id="chapter-5" data-section="chapter-5" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Chapter VI */}
          <section id="chapter-6" data-section="chapter-6" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Chapter VII */}
          <section id="chapter-7" data-section="chapter-7" className="mb-24 scroll-mt-20">
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="hsl(var(--muted-foreground))" strokeWidth={3} name="Production Cost" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} name="Bitcoin Price" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Chapter VIII */}
          <section id="chapter-8" data-section="chapter-8" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Chapter IX */}
          <section id="chapter-9" data-section="chapter-9" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Chapter X */}
          <section id="chapter-10" data-section="chapter-10" className="mb-24 scroll-mt-20">
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
            </div>
          </section>

          {/* Footer */}
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
    </>
  );
};

export default Bitcoin2026Report;
