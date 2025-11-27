import { Helmet } from "react-helmet";
import { ArrowLeft, ArrowUp, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import btcPriceFig from "@/assets/bitcoin_2026_fig1_btc.png";
import m2LiquidityFig from "@/assets/bitcoin_2026_fig2_m2.png";
import realRatesFig from "@/assets/bitcoin_2026_fig3_real_rates.png";

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedPosition, setSavedPosition] = useState(0);

  useEffect(() => {
    // Load saved reading position
    const saved = localStorage.getItem("bitcoin2026-reading-position");
    if (saved) {
      const position = parseInt(saved);
      setSavedPosition(position);
      // Show resume prompt if user has scrolled significantly (> 500px)
      if (position > 500) {
        setShowResumePrompt(true);
      }
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setReadingProgress(progress);
      setShowBackToTop(scrollTop > 400);
      
      // Save reading position every 1000px of scroll
      if (scrollTop % 100 === 0) {
        localStorage.setItem("bitcoin2026-reading-position", scrollTop.toString());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowResumePrompt(false);
  };

  const resumeReading = () => {
    window.scrollTo({ top: savedPosition, behavior: "smooth" });
    setShowResumePrompt(false);
  };

  const dismissResumePrompt = () => {
    setShowResumePrompt(false);
    localStorage.removeItem("bitcoin2026-reading-position");
  };

  return (
    <>
      <Helmet>
        <title>Bitcoin 2026: Macro-Liquidity Regime Analysis | ARIES76</title>
        <meta 
          name="description" 
          content="Institutional analysis of Bitcoin's 2025-2026 trajectory through macro-liquidity framework, global M2 dynamics, and derivatives-implied positioning." 
        />
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div 
          className="h-full bg-slate-900 dark:bg-slate-100 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Resume Reading Prompt */}
      {showResumePrompt && (
        <div className="fixed top-20 right-8 z-40 bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 rounded-lg p-4 max-w-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100 mb-1">
                Continue Reading
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Pick up where you left off in your last session.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={resumeReading}
                  size="sm"
                  className="text-xs"
                >
                  Resume
                </Button>
                <Button
                  onClick={dismissResumePrompt}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="px-12 py-10 border-b border-slate-200 dark:border-slate-800">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>

              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">
                Bitcoin 2026: Macro-Liquidity Regime Analysis
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                ARIES76 Capital Intelligence | Institutional Research
              </p>
            </div>

            <div className="px-12 py-10 space-y-8">
              {/* Table of Contents */}
              <div className="mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6">
                  Table of Contents
                </h2>
                <nav className="space-y-3">
                  <a 
                    href="#chapter-1" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter I</span> — Executive Summary & Macro–Liquidity Regime Analysis
                  </a>
                  <a 
                    href="#chapter-2" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter II</span> — Advanced Price Framework & Quantitative Modelling
                  </a>
                  <a 
                    href="#chapter-3" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter III</span> — Advanced On-Chain Intelligence & Market Microstructure
                  </a>
                  <a 
                    href="#chapter-4" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter IV</span> — Bitcoin Treasuries, Technology Outlook & Mining Economics
                  </a>
                  <a 
                    href="#chapter-5" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter V</span> — Regulatory Outlook 2025–2026
                  </a>
                  <a 
                    href="#chapter-6" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter VI</span> — Scenario Analysis for 2026
                  </a>
                  <a 
                    href="#chapter-7" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter VII</span> — Bitcoin 2026 Pricing Projection
                  </a>
                  <a 
                    href="#chapter-8" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter VIII</span> — Risks and Uncertainties
                  </a>
                  <a 
                    href="#chapter-9" 
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 py-1"
                  >
                    <span className="font-medium">Chapter IX</span> — Appendix
                  </a>
                </nav>
              </div>

              <h2 id="chapter-1" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 scroll-mt-20">
                Chapter I — Executive Summary & Macro–Liquidity Regime Analysis
              </h2>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's trajectory over the 2025–2026 horizon must be interpreted within a refined macro-liquidity framework rather than through the simplistic heuristics that characterised earlier cycles. Bitcoin has evolved into a liquidity-sensitive macro asset whose price formation is dominated by global M2 impulses, real-rate dynamics, cross-border dollar transmission, and the balance-sheet elasticity of shadow banking intermediaries and ETF market makers. The increasingly institutionalised microstructure—featuring CME futures, spot ETFs and professionalised delta-neutral liquidity provisioning—has fundamentally altered the conditions under which Bitcoin reacts to liquidity shocks and volatility clusters.
              </p>

              <figure className="my-10 max-w-3xl mx-auto">
                <img 
                  src={btcPriceFig} 
                  alt="Figure 1 — Synthetic Bitcoin Price (2013–2025)" 
                  className="w-full h-auto border border-slate-200 dark:border-slate-700"
                />
                <figcaption className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center font-medium">
                  Figure 1 — Synthetic Bitcoin Price (2013–2025)
                </figcaption>
              </figure>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Figure 1 illustrates the synthetic price path of Bitcoin from 2013 to 2025. Although purely model-based, the series reproduces the core structural features of Bitcoin's historical behaviour: extended appreciation phases coinciding with abundant global liquidity, deep drawdowns during periods of tightening and quantitative tightening, and regime transitions triggered by policy inflection points and funding shocks. The main purpose of this synthetic series is not to replicate the exact historical path, but to capture the macro signature that will inform the equilibrium band analysis for 2026.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The equilibrium trajectory for Bitcoin in 2026 is not the deterministic extension of past four-year cycles. It emerges from the interaction between liquidity-adjusted demand, derivatives-implied positioning and the progressive reduction in free float caused by treasury and ETF absorption. Institutional ownership through regulated funds creates a quasi-inelastic supply channel, amplifying upside convexity whenever liquidity expands, and exacerbating drawdowns in deleveraging regimes. In other words, Bitcoin increasingly trades as a global liquidity derivative rather than as a purely sentiment-driven speculative asset.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Global Liquidity as the Valuation Denominator
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Global M2 remains the most important macro variable in understanding Bitcoin's medium-term dynamics. What matters for Bitcoin is not the level of money supply, but the marginal liquidity impulse: accelerations in M2 growth tend to produce convex responses in Bitcoin, while stagnation or contraction in liquidity often coincide with volatility spikes and price compression. This is because Bitcoin's supply is absolutely inelastic, while the free float available for trading is further constrained by long-term holders, custodial solutions and ETF structures.
              </p>

              <figure className="my-10 max-w-3xl mx-auto">
                <img 
                  src={m2LiquidityFig} 
                  alt="Figure 2 — Global M2 Liquidity Proxy (Synthetic, 2013–2025)" 
                  className="w-full h-auto border border-slate-200 dark:border-slate-700"
                />
                <figcaption className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center font-medium">
                  Figure 2 — Global M2 Liquidity Proxy (Synthetic, 2013–2025)
                </figcaption>
              </figure>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Figure 2 shows a synthetic proxy for global M2 from 2013 to 2025. The secular upward trend reflects the structural expansion of monetary aggregates in developed and emerging markets, interrupted by periods of stabilisation or modest contraction. These inflection points, rather than the overall trend, are what matter for Bitcoin. In phases where the slope of the M2 curve steepens, Bitcoin tends to transition into an expansionary regime; when the slope flattens or turns negative, Bitcoin shifts toward consolidation or drawdown regimes.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This behaviour justifies treating Bitcoin as a liquidity-sensitive macro instrument: a convex expression of the marginal dollar, rather than as a simple "digital commodity". As liquidity is withdrawn from the system, balance-sheet constraints tighten across dealers, banks and non-bank financial institutions, reducing their risk-taking capacity and suppressing demand for Bitcoin. When liquidity is injected or the pace of withdrawal slows, balance-sheet elasticity returns and Bitcoin becomes a natural recipient of that marginal risk capital.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Real Rates and the Opportunity Cost Channel
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                If global M2 defines the denominator for Bitcoin valuation, real interest rates shape the slope of the demand curve. Rising real yields increase the opportunity cost of holding non-yielding assets, encourage allocation into cash and high-quality duration, and force deleveraging across risk assets. Conversely, declining real yields reduce that opportunity cost and incentivise the search for convex, high-beta exposures to improving liquidity conditions. Bitcoin sits precisely in that slot.
              </p>

              <figure className="my-10 max-w-3xl mx-auto">
                <img 
                  src={realRatesFig} 
                  alt="Figure 3 — Real Rates Regime (Synthetic, 2013–2025)" 
                  className="w-full h-auto border border-slate-200 dark:border-slate-700"
                />
                <figcaption className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center font-medium">
                  Figure 3 — Real Rates Regime (Synthetic, 2013–2025)
                </figcaption>
              </figure>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Figure 3 presents a synthetic real-rates series consistent with the tightening and easing phases observed over the past decade. The oscillatory pattern highlights how episodes of rising real yields coincide with periods of pressure on risk premia, while episodes of declining real yields create windows for renewed risk appetite. Bitcoin's negative correlation with real yields is not simply a consequence of investor sentiment; it reflects a structural interaction with balance-sheet capacity. When real rates are high and rising, the carry on safe assets becomes attractive, funding becomes more expensive and risk capital is rationed. When real rates compress, the carry on safe assets erodes and investors are forced to move out the risk curve.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                For the 2025–2026 period, the combination of high sovereign debt loads, elevated refinancing needs and rising interest burdens makes it increasingly difficult for developed-market central banks to sustain a regime of structurally positive and rising real yields. As maturity walls approach and fiscal arithmetic becomes more challenging, the probability of a transition toward a lower real-rate environment increases. From Bitcoin's perspective, this constitutes a supportive macro backdrop, particularly when combined with gradual easing of quantitative tightening.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Shadow Liquidity, Stablecoins and Cross-Border Dollar Flow
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The official monetary aggregates captured by M2 do not exhaust the definition of liquidity relevant for Bitcoin. A growing share of effective liquidity is created in the shadow banking system: through repo markets, derivatives margins, collateral transformations, eurodollar credit lines and, in the digital-asset space, through stablecoins. Stablecoins in particular function as offshore dollar transmission channels, allowing capital to move across jurisdictions and trading venues without touching the traditional correspondent banking infrastructure.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                When stablecoin supply expands, it effectively increases the pool of risk capital that can be deployed into Bitcoin spot, futures and options. Market makers gain balance-sheet flexibility, funding costs decline at the margin and the liquidity multiplier in Bitcoin markets increases. Conversely, contractions in stablecoin aggregates, whether due to regulatory interventions, redemptions or risk aversion, act as a tightening of synthetic liquidity. The result is a deterioration in order-book depth, wider spreads and an increased likelihood of displacement events when large orders hit a thin market.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's integration into this shadow-liquidity complex reinforces its behaviour as a macro liquidity derivative. The asset no longer depends solely on "crypto-native" flows; instead, it is entangled with cross-border dollar dynamics, dealer risk budgets and the evolution of USD funding conditions globally. The framework used in this report therefore treats official M2, real rates and shadow liquidity as a single vector shaping Bitcoin's equilibrium range.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. ETF Flows and the Institutionalisation of Liquidity
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Since the launch of spot Bitcoin ETFs, liquidity conditions in Bitcoin markets have become increasingly institutional. Authorized participants arbitrage differences between ETF net asset value, spot prices on centralised exchanges and CME futures. This intermediation compresses spreads in normal conditions, but it also creates a new transmission channel through which macro flows can rapidly affect Bitcoin. A change in risk appetite at large asset managers can translate into ETF creations or redemptions, which in turn force market makers to transact in spot and futures markets.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The presence of ETFs means that Bitcoin is now embedded in multi-asset allocation frameworks and risk systems. Portfolio rebalancing decisions by large institutions—often driven by volatility-, drawdown- or VaR-based rules—can trigger structural inflows or outflows independent of crypto-native sentiment. As later chapters will show, ETF flows and CME open interest have become central state variables in models of Bitcoin's short- and medium-term price formation.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Synthesis for the 2025–2026 Horizon
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The combined evidence from Figures 1, 2 and 3 supports a clear macro identity for Bitcoin. It is a high-convexity, liquidity-sensitive asset whose price behaviour is governed less by "cycles" and more by the interplay between global M2 growth, real-rate trends, shadow liquidity and institutional flow channels. In an environment where quantitative tightening reaches its practical limits, where real rates face downward pressure due to fiscal constraints and where ETF structures continue to absorb supply into sticky institutional hands, Bitcoin's medium-term equilibrium band shifts upward.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The remainder of this report builds on this macro foundation. Subsequent chapters will introduce quantitative regime models based on Hidden Markov Methods, liquidity-adjusted demand functions, derivatives-implied positioning, entity-adjusted on-chain analytics and mining-economics-based floor estimates. The goal is to translate the qualitative macro picture sketched in this first chapter into a fully fledged, probabilistic framework for Bitcoin pricing in 2026 that is usable by institutional allocators, CIOs and macro desks.
              </p>

              <h2 id="chapter-2" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter II — Advanced Price Framework & Quantitative Modelling
              </h2>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's valuation throughout the 2025–2026 horizon requires a structural departure from the narrative-driven models that dominated earlier phases of market development. The asset's behaviour is now determined by a multidimensional system of liquidity conditions, derivatives-implied flow constraints, treasury absorption, long-term holder dynamics and mining economics. This chapter introduces the Advanced Price Framework, the analytical backbone used to construct the equilibrium price range for Bitcoin in 2026. The framework integrates macro-liquidity vectors, regime theory, microstructure indicators and supply elasticity models into a coherent investment architecture.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Liquidity-Adjusted Demand Model (LADM)
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The cornerstone of Bitcoin's modern valuation is the liquidity-adjusted demand curve. Rather than treating price as a function of adoption cycles or speculative phases, the LADM models Bitcoin as a convex response to the marginal liquidity impulse. Its structure captures the empirical reality that global M2, shadow banking liquidity and stablecoin aggregates collectively shape the availability of balance-sheet capacity in the system. Bitcoin's supply is fixed, but the demand curve is highly sensitive to liquidity expansion and contraction. When global liquidity rises, Bitcoin exhibits a disproportionate upward reaction due to limited supply elasticity and shrinking free float. When liquidity contracts, the price compresses sharply as derivative leverage unwinds and ETF flow constraints tighten.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The key conclusion of LADM is that Bitcoin's valuation is a liquidity derivative. Its equilibrium price depends not on long-term adoption narratives, but on the interaction between macro-liquidity conditions and supply inelasticity. This insight is essential for constructing the 2026 equilibrium pricing band.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Regime Analysis via Hidden Markov Models
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's volatility structure is non-linear and regime-driven. Hidden Markov Models provide an efficient method for classifying volatility into discrete states that reflect the underlying forces driving price formation. Three regimes appear consistently in quantitative analysis: low-volatility accumulation phases, trending expansion regimes and corrective deleveraging phases driven by funding stress and shadow liquidity withdrawal.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Regime analysis matters because Bitcoin does not transition smoothly between volatility states. Expansion regimes tend to follow liquidity inflection points, rising stablecoin issuance, dealer gamma flips and ETF-driven net inflows. Deleveraging regimes typically coincide with spikes in real yields, funding squeezes, ETF outflows and contractions in shadow liquidity. Identifying regime transitions helps build forward-looking scenario structures and improves the fidelity of equilibrium range modelling.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Derivatives-Implied Market Structure
              </h3>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.1 Options Skew
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's options market has undergone structural transformation. Historically, persistent negative skew reflected downside hedging pressure. In the post-ETF environment, skew is flatter due to the presence of institutional call overwriting, structured product flows and arbitrage dynamics. Deviations from this new equilibrium skew provide directional signals regarding volatility expectations and flow imbalances.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.2 Dealer Gamma Positioning
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Dealer gamma is a primary driver of short-term price dynamics. When dealers are short gamma, their hedging behaviour amplifies volatility and reinforces directional trends. When they are long gamma, volatility compresses and market stability increases. Gamma flips often precede major rallies or corrections and are now tightly linked to ETF creation/redemption flows and CME futures positioning.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.3 CME Futures and Basis
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                CME futures serve as the anchor for global Bitcoin price discovery. The term structure, basis spreads and open interest levels provide information about institutional risk appetite, hedging flows and leverage conditions. Sustained contango regimes typically reflect confidence and liquidity expansion, while backwardation frequently coincides with funding stress or de-risking.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Long-Term Holder Cost Basis & Realised Price Bands
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Long-term holder (LTH) cost basis acts as a structural support level in Bitcoin's valuation. Bitcoin rarely trades sustainably below its LTH cost basis during liquidity expansions, and compressions toward it often signal capitulation in tightening regimes. Realised price bands, representing the aggregated cost basis of the entire network, reflect stress conditions and maturity of market structure. Tightening of these bands indicates reduced speculative churn and increased dominance of committed holders.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Hash-Based Difficulty Elasticity Model
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Mining economics define the elasticity of Bitcoin's supply. Difficulty adjusts dynamically to miner profitability, energy costs and issuance conditions. As miners move toward stranded energy exploitation and dynamic load management, difficulty responds more quickly to price changes. This increased elasticity reduces severe miner capitulation risk and contributes to a stabilising floor during downtrends. Post-halving issuance reduction further amplifies this effect.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                6. The Post-2024 Halving Structural Break
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The 2024 halving introduced a structural break in Bitcoin's market behaviour. Earlier cycles were dominated by retail participation, speculative leverage and predictable supply shocks. The current environment is shaped by ETF flows, macro-liquidity conditions, derivatives hedging and institutional risk frameworks. Supply shocks still matter, but they no longer determine cycle timing. This justifies abandoning halving-based price models in favour of quantitative frameworks such as LADM, HMM clustering, derivatives positioning analysis and mining elasticity modelling.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                7. Synthesis for the Equilibrium Price Range
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The Advanced Price Framework integrates all of the structural components described above into a unified modelling architecture. Bitcoin's 2026 equilibrium band is not a forecast, but a probabilistic range derived from liquidity conditions, supply constraints, volatility regime classification, derivatives-implied flows and mining economics. Later chapters will translate these components into explicit equilibrium pricing corridors, distribution curves and scenario-based outcomes suitable for institutional capital allocation decisions.
              </p>

              <h2 id="chapter-3" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter III — Advanced On‑Chain Intelligence & Market Microstructure
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Introduction
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's on‑chain structure is the closest equivalent to a transparent, real‑time balance sheet for a globally traded macro asset. Unlike equities or commodities, Bitcoin exposes its internal liquidity, supply concentration, capital efficiency and investor behaviour directly on‑chain. For institutional allocators, this makes on‑chain intelligence not a speculative toy, but an empirical dataset capable of revealing structural shifts long before they appear in price.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This chapter provides a deeply expanded and fully institutional reinterpretation. It blends narrative analysis, entity‑adjusted indicators, microstructure schematics, liquidity‑flow tables and compact ASCII visualisations. The aim is to show Bitcoin's internal functioning as a macro‑sensitive liquidity system, not a retail-driven curiosity. The structure reflects the analytical style of large macro funds, volatility‑targeting allocators and ETF market‑making desks.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Entity‑Adjusted On‑Chain Architecture
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Entity‑adjusted metrics correct for address fragmentation, exchange hot‑wallet clustering and custodial aggregation. This produces a clearer picture of supply concentration and structural demand.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                2.1 Whale Net Positioning (Entity‑Adjusted)
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Large‑entity flows act as slow‑moving structural demand. Their behaviour is not cyclical but liquidity‑sensitive. When monetary aggregates expand, whales accumulate; when real rates rise, accumulation stalls or reverses.
              </p>

              <div className="my-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">ASCII Micro‑Chart: Whale Net Positioning (Conceptual)</p>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`Accumulation:   ███████████████
Neutral:        ██████
Distribution:   ██`}
                </pre>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Interpretation:</span> A regime of <em>deep accumulation</em> by large entities historically precedes upward price repricing in the presence of improving liquidity conditions. Distribution spikes usually coincide with deleveraging episodes or ETF‑linked supply rotations.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Exchange Reserve Dynamics
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Exchange reserves serve as a proxy for liquid supply. A structural decline reflects long‑term holder absorption, ETF custodian concentration and corporate treasury storage. Rising reserves indicate short‑term risk appetite or incoming leveraged buying.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.1 Reserve Regime Table
              </h4>

              <div className="my-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Reserve Trend</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Interpretation</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Market Signal</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">↓ Persistent</td>
                      <td className="px-6 py-4">Structural absorption (ETFs, LTH, OTC)</td>
                      <td className="px-6 py-4">Bullish liquidity tightening</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">→ Stable</td>
                      <td className="px-6 py-4">Transitional / equilibrium regime</td>
                      <td className="px-6 py-4">Neutral</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">↑ Rising</td>
                      <td className="px-6 py-4">Leverage entering, speculative flows</td>
                      <td className="px-6 py-4">Volatility ahead</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.2 Liquidity Activation Sequence
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                A typical liquidity activation path looks like this:
              </p>

              <div className="my-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">ASCII Diagram: Liquidity Reactivation</p>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`Stablecoins ↑ → Exchange Reserves ↓ → Futures OI ↑ → Spot Depth ↑ → Trend Expansion`}
                </pre>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This path has repeated historically at macro inflection points.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Long‑Term Holder Cost Basis (LTH‑CB)
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The LTH Cost Basis acts as a structural gravitational centre for Bitcoin's pricing. When liquidity is supportive, price rarely sustains below LTH‑CB. When liquidity compresses, price approaches LTH‑CB during deleveraging or capitulation periods.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                4.1 LTH‑CB Elasticity Model
              </h4>

              <div className="my-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Liquidity Regime</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">LTH‑CB Role</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Expansion</td>
                      <td className="px-6 py-4">Structural floor</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Neutral</td>
                      <td className="px-6 py-4">Magnetic anchor</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Contraction</td>
                      <td className="px-6 py-4">Stress‑test boundary</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The tightening of LTH‑CB around realised price bands suggests market maturity and reduced speculative churn. This is an essential contributor to the 2026 equilibrium floor estimation.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Dormancy & Revival Dynamics
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Dormancy captures the "age" of spent outputs. High dormancy indicates old supply re‑entering the market. Revival spikes often anticipate distribution phases or macro‑environmental shocks.
              </p>

              <div className="my-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">ASCII Micro‑Chart: Dormancy Signals (Conceptual)</p>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`Dormant Coins Reactivated → ████░░░░  
Low Dormancy → ██████████`}
                </pre>
              </div>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                Interpretation:
              </h4>

              <ul className="list-disc list-inside text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6 space-y-2">
                <li>Sustained <em>low dormancy</em> → long‑term conviction, supply immobility, upward convexity.</li>
                <li><em>High revival</em> → supply unlocking, increasing probability of microstructure stress.</li>
              </ul>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                6. On‑Chain Leverage & Capital Efficiency
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Capital efficiency on‑chain is measured through derivatives collateralisation, stablecoin reserves, and funding structures.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                6.1 Leverage Heatmap (Institutional‑Grade)
              </h4>

              <div className="my-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Indicator</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Low Regime</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Neutral Regime</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">High Regime</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Perp Funding Rates</td>
                      <td className="px-6 py-4">↓</td>
                      <td className="px-6 py-4">→</td>
                      <td className="px-6 py-4">↑↑</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">On‑Chain Collateral (BTC)</td>
                      <td className="px-6 py-4">Low</td>
                      <td className="px-6 py-4">Medium</td>
                      <td className="px-6 py-4">High</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Open Interest (USD)</td>
                      <td className="px-6 py-4">Modest</td>
                      <td className="px-6 py-4">Stable</td>
                      <td className="px-6 py-4">Elevated</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Liquidation Sensitivity</td>
                      <td className="px-6 py-4">Low</td>
                      <td className="px-6 py-4">Moderate</td>
                      <td className="px-6 py-4">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                High leverage regimes introduce nonlinear downside risk due to cascading liquidation thresholds.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                7. Market Microstructure: Global Multi‑Venue Liquidity Grid
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin trades in a three‑region, 24‑hour liquidity loop: U.S. → Europe → Asia. Each region has unique market structure.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                7.1 Global Bitcoin Liquidity Grid (GBLG)
              </h4>

              <div className="my-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Region</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Liquidity Inputs</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Characteristics</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">U.S.</td>
                      <td className="px-6 py-4">ETF creations, CME futures, AP arbitrage</td>
                      <td className="px-6 py-4">Deepest liquidity, directional flows</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Europe</td>
                      <td className="px-6 py-4">ETP flows, OTC desks, cross‑venue arbitrage</td>
                      <td className="px-6 py-4">Stabilising, mid‑depth liquidity</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Asia</td>
                      <td className="px-6 py-4">Perpetual futures funding, leverage clusters</td>
                      <td className="px-6 py-4">Volatility amplification, thin depth</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This grid reveals the timing of vulnerability windows, especially during macro announcements.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                7.2 ASCII Microstructure Diagram
              </h4>

              <div className="my-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`[U.S. ETFs] → Depth ↑ → Spread ↓  
          ↘  
           [CME OI ↑] → Price Discovery  
          ↗  
[Asia Perps] → Funding → Liquidations → Volatility ↑`}
                </pre>
              </div>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                ETF flows in the U.S. now anchor global price discovery. Perpetual markets in Asia amplify volatility and propagate liquidations. Europe acts as the stabiliser.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                8. Slippage, Depth and Liquidity Fragmentation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Liquidity fragmentation is structural and predictable. Orderbook depth correlates with:
              </p>

              <ul className="list-disc list-inside text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6 space-y-2">
                <li>ETF flows</li>
                <li>futures open interest</li>
                <li>offshore stablecoin liquidity</li>
                <li>AP arbitrage behaviour</li>
              </ul>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                8.1 Depth Elasticity Table
              </h4>

              <div className="my-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Condition</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Depth Behaviour</th>
                      <th className="px-6 py-4 text-left font-serif font-bold text-slate-900 dark:text-slate-100">Market Impact</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">ETF Inflows ↑</td>
                      <td className="px-6 py-4">Depth Thickens</td>
                      <td className="px-6 py-4">Lower volatility</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Funding Spikes ↑</td>
                      <td className="px-6 py-4">Depth Evaporates</td>
                      <td className="px-6 py-4">Liquidation cascades</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Stablecoin Supply ↑</td>
                      <td className="px-6 py-4">Depth Restored</td>
                      <td className="px-6 py-4">Trend continuation</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Regulatory Shock</td>
                      <td className="px-6 py-4">Depth Fragmented</td>
                      <td className="px-6 py-4">Sharp dislocations</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                9. Synthesis for Price Formation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The interaction between:
              </p>

              <ul className="list-disc list-inside text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6 space-y-2">
                <li>entity‑adjusted accumulation,</li>
                <li>reserve drain,</li>
                <li>dormancy suppression,</li>
                <li>capital efficiency,</li>
                <li>global liquidity fragmentation,</li>
                <li>ETF flow anchoring,</li>
                <li>and derivatives funding regimes</li>
              </ul>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                creates a <strong>structural tightening of circulating supply</strong>.
              </p>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This produces three key implications for Bitcoin's 2026 price behaviour:
              </p>

              <ol className="list-decimal list-inside text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6 space-y-3">
                <li><strong>Structural Upward Drift:</strong> Circulating supply is shrinking as ETFs and long-horizon entities dominate absorption.</li>
                <li><strong>Higher Floor:</strong> LTH‑CB + mining elasticity define a structurally rising price floor.</li>
                <li><strong>Convex Upside:</strong> Liquidity expansions produce amplified upward repricing due to inelastic supply.</li>
              </ol>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                This chapter is foundational for the <strong>2026 Equilibrium Price Model</strong> developed later.
              </p>

              <h2 id="chapter-4" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter IV — Bitcoin Treasuries, Technology Outlook & Mining Economics
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Introduction
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's integration into corporate, sovereign and institutional treasuries marks one of the most profound structural shifts in the global macro landscape. Treasury behaviour no longer reflects episodic speculation but a steady migration toward non-sovereign reserves. At the same time, the technological foundations of Bitcoin—Layer 2 architectures, settlement frameworks and emerging programmability—are evolving to support institutional‑scale operations. Mining economics, once cyclical and precarious, now form part of a global energy‑driven arbitrage ecosystem. These three pillars—treasuries, technology and mining—jointly shape Bitcoin's long‑term equilibrium structure.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Corporate & Sovereign Treasuries
              </h3>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                2.1 Corporate Treasury Behaviour
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Corporations increasingly view Bitcoin not as a speculative allocation but as a treasury hedge against liquidity decay, fiscal deterioration and currency debasement. High‑growth firms and multinational technology companies treat Bitcoin as an ultra‑liquid reserve asset with global portability. Unlike sovereign currencies, Bitcoin does not depend on jurisdictional integrity or central bank policy cycles, allowing corporates to diversify their treasury base without incurring geopolitical or FX concentration risks.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                2.2 Sovereign Treasury Optionality
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Several emerging markets face persistent currency pressures, capital‑flight dynamics and fragile financial institutions. For these jurisdictions, Bitcoin represents optionality rather than replacement: a strategic layer of reserves that cannot be diluted, seized or politically weaponised. Resource‑rich states with abundant hydro, geothermal or stranded energy increasingly accumulate Bitcoin via mining‑driven monetisation of excess electrical output. Sovereign adoption remains early but exhibits a clear directional bias: Bitcoin is becoming a reserve hedge for countries seeking insulation from systemic fragility.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                2.3 Institutional Treasury Dynamics
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Endowments, hedge funds and macro allocators use Bitcoin as a convex macro hedge. The launch of spot ETFs has normalised exposure pathways, enabling institutions to maintain Bitcoin on balance sheets with the same operational simplicity as gold ETFs. This institutional absorption mechanically removes liquid supply from exchanges, tightening free float and reinforcing Bitcoin's scarcity premium.
              </p>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Technology Outlook to 2026
              </h3>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.1 Layer‑2 Settlement Architecture
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's Layer‑2 systems—Lightning, rollup‑like constructions, federated mints—are redefining the architecture of global settlement. Lightning evolves from a payment rail into a high‑throughput settlement substrate. Meanwhile, emerging rollup structures anchored to Bitcoin provide programmability while preserving the security of the base layer.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.2 Programmable Primitives
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Miniscript, PSBT workflows and covenant‑style policy frameworks enable secure vaulting, institutional custody logic and multi‑step spending conditions. These primitives represent a subtle but critical shift: Bitcoin is becoming programmable without drifting from its core guarantees.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                3.3 Federated Systems
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Federated architectures such as Fedi and Cashu revive the concept of cryptographic communal banking. They enable privacy‑preserving digital cash that is anchored to Bitcoin, offering institutions and communities alternative custody models that scale without compromising independence.
              </p>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Mining Economics: Post‑Halving Dynamics
              </h3>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                4.1 Post‑Halving Profitability
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Mining economics are increasingly shaped by energy arbitrage rather than simple block rewards. The profitability of miners depends on access to low‑cost power, advanced ASIC fleets and dynamic load‑balancing arrangements with energy producers.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                4.2 Hashprice Behaviour
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Hashprice stabilises at structurally higher levels due to dual revenue streams: block subsidies and increasingly volatile fee markets fuelled by inscriptions, settlement demand and blockspace competition.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                4.3 Difficulty Elasticity
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Difficulty acts as a responsive stabiliser. When price declines, inefficient miners exit, lowering difficulty and restoring economic viability. When price rises, the network absorbs new hashrate, ensuring competitive neutrality.
              </p>

              <h4 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3">
                4.4 Global Energy Arbitrage
              </h4>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Mining operates as a global buyer of last‑resort energy. It monetises curtailed wind, excess hydro, flare gas and stranded solar, transforming power systems and stabilising grids. For several regions, Bitcoin mining becomes an integral component of energy strategy.
              </p>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Synthesis
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Treasuries, technology and mining form a reinforcing feedback loop: treasury accumulation tightens free float, technological scaling broadens Bitcoin's addressable market and mining economics strengthen security while integrating Bitcoin into global energy markets. Together, these forces converge into a structural upward bias in Bitcoin's long‑term equilibrium state.
              </p>

              <h2 id="chapter-5" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter V — Regulatory Outlook 2025–2026
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Introduction
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's regulatory environment in 2025–2026 is defined by the convergence of institutional adoption, cross-jurisdictional compliance requirements, and the global integration of digital asset markets. Regulatory frameworks increasingly shape liquidity access, investor participation, and the evolution of spot and derivatives products.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. United States: SEC, CFTC and Legislative Evolution
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The U.S. remains the global regulatory anchor due to the dominance of USD capital markets and CME futures. Spot ETFs have normalised exposure pathways for institutions, while ongoing legislative efforts aim to define commodity vs. security classification. The CFTC continues to reinforce its oversight of derivatives markets, while SEC supervision of custody and disclosures influences ETF behaviours and authorised participants.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Europe: MiCA Implementation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                MiCA introduces harmonised regulation across the EU, integrating custody, exchange operations, stablecoin issuance and transparency requirements. For Bitcoin, MiCA enhances institutional certainty, facilitating passported services and compliant structured products.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Asia and MENA: Divergent Models
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Asia exhibits heterogeneity. Japan maintains strict custody and exchange rules, Singapore focuses on risk-based frameworks, while Hong Kong positions itself as a regional institutional hub. MENA jurisdictions—especially the UAE—enhance licensing clarity to attract global asset managers.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Stablecoin and Taxation Trends
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Stablecoin regulation intensifies globally, focusing on reserve quality, auditability and cross-border remittance oversight. Taxation frameworks move toward clarity on capital gains, staking, derivative income and corporate treasury treatment.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                6. Synthesis
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The regulatory trajectory supports growing institutional participation, deeper liquidity pools and the normalisation of Bitcoin as a cross-border macro asset.
              </p>

              <h2 id="chapter-6" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter VI — Scenario Analysis for 2026
              </h2>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Regulation defines accessibility, liquidity channels and institutional comfort. Bitcoin's regulatory environment is shifting from fragmented experimentation to structured integration. The trajectory across major jurisdictions indicates that Bitcoin is being normalised as a macro‑financial asset rather than treated as a speculative anomaly.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. United States
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The U.S. anchors global Bitcoin liquidity. The approval of spot ETFs triggered a regime shift by enabling regulated exposure through custodians, authorised participants and familiar wrappers. The SEC maintains strict oversight on custody, disclosures and market integrity, while the CFTC continues to regulate derivatives markets through CME. Legislative clarity on digital asset classification—commodity vs. security—is progressing slowly but directionally.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Europe: MiCA
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                MiCA introduces harmonised rules for exchanges, custodians and stablecoin issuers. For Bitcoin, MiCA reinforces operational certainty for institutions, enabling compliant structured products, ETPs and cross‑border distribution. It significantly lowers friction for asset managers seeking pan‑European Bitcoin exposure.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Asia and MENA
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Asia remains heterogeneous:
              </p>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li>Japan prioritises consumer protection.</li>
                <li>Singapore focuses on risk‑based licensing and institutional access.</li>
                <li>Hong Kong positions itself as a global digital‑asset financial centre.</li>
              </ul>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                In MENA, the UAE accelerates licensing frameworks designed to attract global asset managers.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Stablecoin, Custody and Taxation Trends
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Stablecoins face increasing regulatory scrutiny, particularly over reserve quality, auditability and cross‑border flows. Taxation frameworks aim to clarify capital gains treatment, staking income and corporate treasury holding rules. Custody regulations emphasise segregation of client assets and institutional‑grade operational standards.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Synthesis
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Regulatory developments in 2025–2026 are structurally supportive. They expand the addressable market for institutional capital, reinforce consumer protections and strengthen liquidity pathways.
              </p>

              <h2 id="chapter-6" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter VI — Scenario Analysis for 2026
              </h2>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Scenario analysis does not attempt to forecast deterministic outcomes. Instead, it evaluates the structure of possible states of the world and the liquidity configurations that accompany them.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Base Case — Structural Expansion
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Global liquidity stabilises, real rates trend lower and ETF inflows remain steady. Treasury and long‑term holder absorption tighten supply. In this regime, Bitcoin experiences moderate but sustained upward repricing driven by structural supply inelasticity.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. High Case — Liquidity Reflation + Corporate/Sovereign Demand
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Should major central banks re‑expand balance sheets or corporates announce large treasury allocations, Bitcoin's price reacts convexly. ETF inflows accelerate and free‑float supply collapses. In such a scenario, upward repricing becomes nonlinear.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Stress Case — Macro Deleveraging + ETF Outflows
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Rising real rates, liquidity contraction or regulatory fragmentation trigger risk‑off dynamics. ETF redemptions push sell‑pressure into spot markets. Orderbook depth evaporates. Bitcoin approaches structural floors defined by long‑term holder cost basis and mining elasticity.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Interpretation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Across all scenarios, the lower bound rises over time due to structural supply tightening. The upper bound becomes more convex due to decreasing free float and institutionalised liquidity demand.
              </p>

              <h2 id="chapter-7" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter VII — Bitcoin 2026 Pricing Projection
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Introduction
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's valuation cannot be summarised in a single number. Instead, it emerges from interacting liquidity forces, supply inelasticity and regime‑dependent volatility. The pricing model for 2026 incorporates macro‑liquidity conditions, derivatives flows, on‑chain behaviour and institutional treasury absorption.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Equilibrium Pricing Band
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The equilibrium band is constructed around:
              </p>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li>the long‑term holder cost‑basis floor,</li>
                <li>liquidity‑adjusted demand functions,</li>
                <li>ETF‑driven supply absorption,</li>
                <li>and mining elasticity.</li>
              </ul>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Under median liquidity conditions, Bitcoin stabilises within a band corresponding to 0.9–1.3 standard deviations above LTH‑CB. In supportive regimes, convexity lifts the upper bound significantly.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Probability Distribution
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin's distribution is right‑skewed. The left tail is compressed by structural floors; the right tail expands under liquidity reflation. This asymmetry explains why Bitcoin's expected value tends to drift upward over long horizons despite periodic drawdowns.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Institutional Conviction Score
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                A composite conviction score integrates:
              </p>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li>liquidity regime outlook,</li>
                <li>ETF flows,</li>
                <li>on‑chain structural indicators,</li>
                <li>mining fundamentals,</li>
                <li>and global macro conditions.</li>
              </ul>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                High conviction emerges when liquidity expands and supply tightens.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Synthesis
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                The pricing model highlights Bitcoin's asymmetric payoff structure: constrained downside, convex upside, and sensitivity to liquidity regimes. Its 2026 valuation is defined more by macro liquidity than by endogenous halving cycles.
              </p>

              <h2 id="chapter-8" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter VIII — Risks and Uncertainties
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Liquidity Risk
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin is acutely sensitive to liquidity conditions. Rapid increases in real rates, QT acceleration or shadow‑banking stress can suppress demand and trigger deleveraging.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Regulatory Fragmentation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Divergent global regulations may impede liquidity transmission. Sudden enforcement events can trigger exchange outflows, reduced market depth and elevated volatility.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. ETF Outflow Risk
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Large‑scale redemptions translate directly into sell‑pressure. Orderbook depth may not absorb these flows efficiently, especially during macro stress events.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Technological Risks
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Bitcoin is robust, but tail risks remain: protocol‑level vulnerabilities, L2 security incidents, or critical custody failures could affect market confidence.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                5. Mining Centralisation
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                As inefficient miners exit and capital‑heavy operations dominate, geographic concentration may increase. This introduces potential political and operational risk.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                6. Synthesis
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Risk assessment is essential for allocation sizing and hedging. Bitcoin remains a high‑convexity macro asset, requiring disciplined risk management frameworks.
              </p>

              <h2 id="chapter-9" className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 mt-16 scroll-mt-20">
                Chapter IX — Appendix
              </h2>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                1. Definitions
              </h3>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li><strong>Liquidity‑Adjusted Demand Model (LADM):</strong> A framework linking price to changes in global liquidity.</li>
                <li><strong>Hidden Markov Models (HMM):</strong> Regime classifiers for volatility and market states.</li>
                <li><strong>Long‑Term Holders (LTH):</strong> Entities holding Bitcoin for &gt;155 days.</li>
                <li><strong>Realised Price:</strong> Aggregate cost basis of all coins in circulation.</li>
              </ul>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                2. Methodological Notes
              </h3>

              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                Models incorporate nonlinear relationships, regime changes and supply‑elasticity dynamics. Projection methods include scenario analysis, stochastic modelling and cost‑basis stratification.
              </p>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                3. Glossary
              </h3>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li><strong>Convexity:</strong> Amplified sensitivity to marginal liquidity changes.</li>
                <li><strong>Hashprice:</strong> USD revenue per unit of hashrate.</li>
                <li><strong>ETF APs:</strong> Authorised participants enabling ETF creations/redemptions.</li>
              </ul>

              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
                4. Assumptions
              </h3>

              <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <li>Stable protocol rules.</li>
                <li>No major exchange failures.</li>
                <li>ETF markets remain functional.</li>
              </ul>
            </div>

            {/* Report Footer */}
            <div className="px-12 py-10 mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="space-y-8">
                {/* Disclaimer */}
                <div>
                  <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Important Disclaimer
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    This report is provided for informational and educational purposes only and does not constitute investment advice, financial advice, trading advice, or any other type of advice. The information contained herein is based on sources believed to be reliable but is not guaranteed for accuracy or completeness. Past performance is not indicative of future results. Bitcoin and digital assets are highly volatile and speculative instruments. Investors should conduct their own due diligence and consult with qualified financial advisors before making any investment decisions. ARIES76 and its affiliates assume no liability for any losses or damages arising from the use of this report.
                  </p>
                </div>

                {/* Publication Info & Copyright */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      Published: December 2025
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      © 2025 ARIES76 Capital Intelligence. All rights reserved.
                    </p>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Contact</p>
                    <p>ARIES76 Capital Intelligence</p>
                    <p className="mt-1">
                      <a href="mailto:edoardo.grigione@aries76.com" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        edoardo.grigione@aries76.com
                      </a>
                    </p>
                    <p className="mt-1">
                      <a href="https://www.aries76.com" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        www.aries76.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};

export default Bitcoin2026Report;
