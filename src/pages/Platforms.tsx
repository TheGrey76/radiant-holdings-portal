import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const Platforms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-32 md:py-40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-foreground tracking-tight">
              Our Platforms
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-4xl mx-auto">
              Purpose-built digital products developed by Aries76 — currently in active development 
              and expected to launch in 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* RAISE PLATFORM */}
      <section className="py-24 md:py-32 border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            {/* Dark card mirroring Raise's dark UI + orange accent */}
            <div className="relative overflow-hidden rounded-none border border-border/20 bg-[hsl(220,30%,8%)] p-12 md:p-16 lg:p-20">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(25,90%,50%,0.06),transparent_70%)]" />
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                {/* Logo text */}
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
                    style={{ color: "hsl(25, 95%, 53%)" }}>
                  RAISE
                </h2>
                <p className="text-xs tracking-[0.35em] uppercase mb-8"
                   style={{ color: "hsl(25, 80%, 60%)" }}>
                  Platform
                </p>

                {/* Status badge */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase border mb-10"
                      style={{ 
                        borderColor: "hsl(25, 90%, 50%, 0.3)", 
                        color: "hsl(25, 80%, 60%)",
                        background: "hsl(25, 90%, 50%, 0.08)"
                      }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(25, 90%, 55%)" }} />
                  In Development
                </span>

                <h3 className="text-2xl md:text-3xl font-light text-white/90 mb-6 leading-snug">
                  AI-Powered Capital Intelligence
                </h3>
                <p className="text-base md:text-lg text-white/50 leading-relaxed font-light mb-10">
                  The complete platform for managing investor relationships, tracking commitments, 
                  and closing fundraises faster — designed for fund managers and corporates 
                  navigating complex capital formation processes.
                </p>

                <a
                  href="https://www.raiseplatform.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-light transition-all duration-300 hover:gap-3"
                  style={{ color: "hsl(25, 90%, 55%)" }}
                >
                  raiseplatform.eu
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ALPHA FLOW */}
      <section className="py-24 md:py-32 border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            {/* Dark card mirroring AlphaFlow's dark minimal UI */}
            <div className="relative overflow-hidden rounded-none border border-border/20 bg-[hsl(215,25%,9%)] p-12 md:p-16 lg:p-20">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(35,80%,50%,0.04),transparent_70%)]" />

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                {/* Logo text */}
                <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white/95 mb-1">
                  Alpha<span className="font-semibold">Flow</span>
                </h2>
                <p className="text-xs tracking-[0.4em] uppercase mb-8"
                   style={{ color: "hsl(35, 80%, 55%)" }}>
                  Trading System
                </p>

                {/* Status badge */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase border mb-10"
                      style={{ 
                        borderColor: "hsl(35, 70%, 50%, 0.3)", 
                        color: "hsl(35, 70%, 55%)",
                        background: "hsl(35, 70%, 50%, 0.08)"
                      }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(35, 80%, 50%)" }} />
                  Building in Progress
                </span>

                <h3 className="text-2xl md:text-3xl font-light text-white/90 mb-6 leading-snug">
                  Institutional-Grade Trading Tools
                </h3>
                <p className="text-base md:text-lg text-white/50 leading-relaxed font-light mb-10">
                  A research-driven platform delivering systematic trading signals, portfolio analytics, 
                  and quantitative insights — built for professional investors seeking alpha generation 
                  through disciplined, data-backed strategies.
                </p>

                <a
                  href="https://www.alphaflow.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-light transition-all duration-300 hover:gap-3"
                  style={{ color: "hsl(35, 80%, 55%)" }}
                >
                  alphaflow.network
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center text-lg md:text-xl text-muted-foreground/60 leading-relaxed font-light tracking-wide"
          >
            Both platforms are being developed in-house by Aries76 and reflect our commitment 
            to combining deep market expertise with advanced technology. Launch updates will be 
            shared through our channels.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Platforms;
