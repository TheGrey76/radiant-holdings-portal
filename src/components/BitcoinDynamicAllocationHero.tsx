import { motion } from "framer-motion";
import { Compass, ShieldCheck, Brain, Target, TrendingUp, Clock, Sparkles } from "lucide-react";

const BitcoinDynamicAllocationHero = () => {
  return (
    <div className="relative overflow-hidden border-b border-orange-500/20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d12] via-[#0d1117] to-[#0a0d12]"></div>
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(247, 147, 26, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-[120px]"></div>
      
      <div className="container max-w-5xl mx-auto px-6 py-20 md:py-28 relative z-10">
        {/* Opening Hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
            <Compass className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">Decision Framework</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
            This is not a prediction.
            <br />
            <span className="text-gray-500">This is not an opinion.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
            The Bitcoin Dynamic Allocation Model is an operating reference for those who refuse to let emotion govern their capital decisions. In a market built on volatility, this is your structured discipline layer.
          </p>
        </motion.div>

        {/* Reframing Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 border border-orange-500/15">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Brain className="w-6 h-6 text-orange-400" />
              The Real Problem with Bitcoin Investing
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The challenge is not predicting where Bitcoin will be in twelve months. No one knows. The challenge is managing your behavior when the market moves against you—or seduces you into overconfidence when it moves in your favor.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Volatility is not the enemy. Emotional reaction to volatility is. Most investors lose money not because they lack information, but because they lack a stable framework for decision-making. They sell at the bottom, they buy at the top, and they repeat this pattern until capital is depleted or conviction is abandoned.
            </p>
          </div>
        </motion.div>

        {/* What It Is */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
            <Target className="w-6 h-6 text-orange-400" />
            What Is the Bitcoin Dynamic Allocation Model?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-card/30 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Rules-Based Framework</h4>
              <p className="text-gray-400 leading-relaxed">
                A standardized operating system for Bitcoin allocation. No guessing. No discretionary calls. Clear parameters, defined triggers, documented rationale.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/30 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Quarterly Updated</h4>
              <p className="text-gray-400 leading-relaxed">
                Data-driven and continuously refreshed. Real-time prices, macro regime indicators, and quantitative targets updated every quarter—so you always have current intelligence.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/30 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Institutional Logic</h4>
              <p className="text-gray-400 leading-relaxed">
                Built on macro-liquidity analysis, regime models, and quantitative valuation frameworks—the same methodologies used by institutional allocators and sovereign funds.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card/30 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Consult Repeatedly</h4>
              <p className="text-gray-400 leading-relaxed">
                Not a one-time read. A reference to revisit when markets move, when emotions spike, when you need an external anchor for your investment thesis.
              </p>
            </div>
          </div>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            This is your decision console. A place to return when the market noise becomes overwhelming. A framework that remains consistent while prices fluctuate wildly around it.
          </p>
        </motion.div>

        {/* What It Is NOT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 border border-red-500/15">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-red-400" />
              What This Is NOT
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0"></div>
                <p className="text-gray-300">Not financial advice or personalized recommendations</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0"></div>
                <p className="text-gray-300">Not a trading system or buy/sell signals</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0"></div>
                <p className="text-gray-300">Not portfolio management or asset custody</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0"></div>
                <p className="text-gray-300">Not a guarantee of returns or alpha generation</p>
              </div>
            </div>
            <p className="mt-6 text-gray-400 leading-relaxed">
              We provide the framework. You make the decisions. We offer structured intelligence. You apply it to your unique circumstances. This separation is fundamental to how we operate.
            </p>
          </div>
        </motion.div>

        {/* Why It Exists */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">The Value: Decision Discipline</h3>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            In an asset class defined by structural volatility, the most valuable thing you can have is not another opinion—it's a consistent reference point. The Bitcoin Dynamic Allocation Model provides exactly that: reduced decision anxiety, maintained coherence across market cycles, and a stable intellectual anchor in an inherently unstable environment.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            When Bitcoin drops 30% in a week, you need something more than Twitter threads and YouTube analysis. You need a framework you've already internalized, one that anticipated the volatility and provides clear guidance on what to do—or more importantly, what not to do.
          </p>
        </motion.div>

        {/* Why €99 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-green-500/5 via-transparent to-orange-500/5 border border-green-500/15">
            <h3 className="text-2xl font-semibold text-white mb-6">Why €99?</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Institutional-grade research typically costs thousands of euros per year. We've democratized access by leveraging AI-powered data processing and scalable delivery—without compromising on analytical depth.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              €99 is a one-time payment that includes all quarterly updates through 2026. No subscriptions. No upsells. One investment in decision discipline that pays for itself the first time it prevents an emotional mistake.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="text-3xl font-bold text-orange-400">€99</div>
              <div className="text-sm text-gray-500">
                One-time payment<br />
                All updates included
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center"
        >
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/20">
            <p className="text-xl md:text-2xl text-white font-medium mb-6">
              You're not buying a prediction.
              <br />
              <span className="text-orange-400">You're buying a better way to decide.</span>
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Scroll down to explore the complete framework: macro-liquidity analysis, regime models, quantitative targets, and the decision architecture that transforms how you approach Bitcoin allocation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BitcoinDynamicAllocationHero;
