import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Zap, BarChart3, Shield, Target, TrendingUp, Brain } from "lucide-react";

const Platforms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-xs tracking-[0.4em] uppercase text-accent mb-6 font-medium">
              Aries76 Ecosystem
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-foreground tracking-tight leading-[1.1]">
              Two platforms.<br />
              <span className="text-accent">One vision.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              Purpose-built technology for capital markets professionals — 
              currently in development and launching in 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Raise Platform */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(220, 30%, 7%) 0%, hsl(220, 25%, 12%) 50%, hsl(25, 40%, 12%) 100%)",
            }}
          >
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
              style={{ background: "hsl(25, 95%, 55%)" }} />

            <div className="relative z-10 p-8 md:p-16 lg:p-20">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                {/* Left: Content */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(25, 95%, 55%)" }} />
                    <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(25, 95%, 65%)" }}>
                      In Development
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2" style={{ color: "hsl(0, 0%, 95%)" }}>
                    Raise
                  </h2>
                  <p className="text-base md:text-lg font-light tracking-wide mb-8" style={{ color: "hsl(25, 90%, 60%)" }}>
                    AI-Powered Capital Intelligence
                  </p>

                  <p className="text-base leading-relaxed mb-8 font-light" style={{ color: "hsl(220, 15%, 70%)" }}>
                    The complete platform for managing investor relationships, tracking commitments, 
                    and closing fundraises faster. Built for fund managers and corporates navigating 
                    complex capital formation across European and global markets.
                  </p>

                  <a
                    href="https://www.raiseplatform.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 hover:gap-4"
                    style={{
                      background: "hsl(25, 95%, 55%)",
                      color: "hsl(0, 0%, 100%)",
                    }}
                  >
                    Visit raiseplatform.eu
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Right: Feature highlights */}
                <div className="space-y-5">
                  {[
                    { icon: Target, title: "Investor CRM", desc: "Unified pipeline tracking with intelligent scoring and relationship mapping." },
                    { icon: Zap, title: "AI Enrichment", desc: "Automated prospect research and engagement signals powered by machine learning." },
                    { icon: Shield, title: "Compliance Ready", desc: "Built-in regulatory workflows for cross-border fundraising in Europe." },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                      className="flex gap-4 p-5 rounded-xl border transition-colors duration-300"
                      style={{
                        background: "hsl(220, 25%, 10% / 0.6)",
                        borderColor: "hsl(220, 20%, 20%)",
                      }}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "hsl(25, 95%, 55% / 0.15)" }}>
                        <feature.icon className="w-5 h-5" style={{ color: "hsl(25, 90%, 60%)" }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1" style={{ color: "hsl(0, 0%, 90%)" }}>{feature.title}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: "hsl(220, 15%, 55%)" }}>{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AlphaFlow */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(230, 25%, 6%) 0%, hsl(225, 20%, 10%) 50%, hsl(20, 30%, 10%) 100%)",
            }}
          >
            {/* Glow accent */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
              style={{ background: "hsl(25, 95%, 55%)" }} />

            <div className="relative z-10 p-8 md:p-16 lg:p-20">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                {/* Left: Feature highlights */}
                <div className="space-y-5 order-2 md:order-1">
                  {[
                    { icon: TrendingUp, title: "Systematic Signals", desc: "Quantitative trading signals across multi-asset classes with transparent methodology." },
                    { icon: BarChart3, title: "Portfolio Analytics", desc: "Risk attribution, factor analysis, and performance benchmarking in real time." },
                    { icon: Brain, title: "Research Engine", desc: "Data-driven insights combining macro indicators with on-chain and sentiment data." },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                      className="flex gap-4 p-5 rounded-xl border transition-colors duration-300"
                      style={{
                        background: "hsl(225, 20%, 9% / 0.6)",
                        borderColor: "hsl(225, 15%, 18%)",
                      }}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "hsl(25, 95%, 55% / 0.12)" }}>
                        <feature.icon className="w-5 h-5" style={{ color: "hsl(25, 90%, 60%)" }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1" style={{ color: "hsl(0, 0%, 90%)" }}>{feature.title}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: "hsl(225, 15%, 55%)" }}>{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right: Content */}
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(25, 95%, 55%)" }} />
                    <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(25, 90%, 65%)" }}>
                      Building in Progress
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2" style={{ color: "hsl(0, 0%, 95%)" }}>
                    AlphaFlow
                  </h2>
                  <p className="text-base md:text-lg font-light tracking-wide mb-8" style={{ color: "hsl(25, 90%, 60%)" }}>
                    Systematic Trading & Research
                  </p>

                  <p className="text-base leading-relaxed mb-8 font-light" style={{ color: "hsl(225, 15%, 65%)" }}>
                    A research-driven platform delivering systematic trading signals, portfolio analytics, 
                    and quantitative insights for professional investors seeking alpha generation 
                    through disciplined, data-backed strategies.
                  </p>

                  <a
                    href="https://www.alphaflow.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 hover:gap-4"
                    style={{
                      background: "hsl(25, 95%, 55%)",
                      color: "hsl(0, 0%, 100%)",
                    }}
                  >
                    Visit alphaflow.network
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom note */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs tracking-widest uppercase text-muted-foreground font-light">Launching 2026</span>
            </div>
            <p className="text-base text-muted-foreground/70 leading-relaxed font-light">
              Both platforms are developed in-house by Aries76 Ltd. 
              Launch updates will be communicated through our official channels.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Platforms;
