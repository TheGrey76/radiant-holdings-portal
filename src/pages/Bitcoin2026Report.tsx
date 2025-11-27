import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import btcPriceFig from "@/assets/bitcoin_2026_fig1_btc.png";
import m2LiquidityFig from "@/assets/bitcoin_2026_fig2_m2.png";
import realRatesFig from "@/assets/bitcoin_2026_fig3_real_rates.png";

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-accent rounded-full"></div>
                  <span>January 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-4">
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
                  <p className="text-sm font-semibold text-foreground mb-1">Published: January 2025</p>
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
