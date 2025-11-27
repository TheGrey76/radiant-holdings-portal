import { Helmet } from "react-helmet";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import btcPriceFig from "@/assets/bitcoin_2026_fig1_btc.png";
import m2LiquidityFig from "@/assets/bitcoin_2026_fig2_m2.png";
import realRatesFig from "@/assets/bitcoin_2026_fig3_real_rates.png";

const Bitcoin2026Report = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                      Published: December 2024
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      © 2024 ARIES76 Capital Intelligence. All rights reserved.
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
