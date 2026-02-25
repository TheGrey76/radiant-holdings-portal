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
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-3xl mx-auto">
              Two purpose-built products currently in development, designed to serve 
              the evolving needs of fund managers and professional investors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Raise Platform */}
      <section className="py-24 md:py-32 border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Status */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-light">
                  In Development
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-3">
                Raise
              </h2>
              <p className="text-lg text-accent font-light tracking-wide mb-10">
                AI-Powered Capital Intelligence
              </p>

              {/* Description */}
              <div className="max-w-3xl space-y-6 mb-12">
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  The complete platform for managing investor relationships, tracking commitments, 
                  and closing fundraises faster. Raise is designed for fund managers and corporates 
                  navigating complex capital formation processes across European and global markets.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  Built on the operational experience accumulated through Aries76's advisory mandates, 
                  Raise transforms fragmented fundraising workflows into a unified, intelligent system.
                </p>
              </div>

              {/* Link */}
              <a
                href="https://www.raiseplatform.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm tracking-widest uppercase font-light"
              >
                raiseplatform.eu
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alpha Flow */}
      <section className="py-24 md:py-32 border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Status */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-light">
                  Building in Progress
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-3">
                AlphaFlow
              </h2>
              <p className="text-lg text-accent font-light tracking-wide mb-10">
                Systematic Trading & Research
              </p>

              {/* Description */}
              <div className="max-w-3xl space-y-6 mb-12">
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  A research-driven platform delivering systematic trading signals, portfolio analytics, 
                  and quantitative insights for professional investors seeking alpha generation 
                  through disciplined, data-backed strategies.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  AlphaFlow combines institutional-grade tooling with transparent methodology, 
                  offering a structured approach to multi-asset allocation and risk management.
                </p>
              </div>

              {/* Link */}
              <a
                href="https://www.alphaflow.network"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm tracking-widest uppercase font-light"
              >
                alphaflow.network
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
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
            className="max-w-3xl mx-auto text-center text-lg text-muted-foreground/60 leading-relaxed font-light"
          >
            Both platforms are developed in-house by Aries76 Ltd. 
            Launch updates will be communicated through our official channels.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Platforms;
