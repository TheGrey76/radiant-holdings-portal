import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstitutionalDataViz from '@/components/InstitutionalDataViz';

const GPCapitalAdvisory = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white overflow-hidden">
        <InstitutionalDataViz />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-40 md:py-52">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/services" className="text-sm text-white/50 hover:text-white/70 transition-colors font-light uppercase tracking-[0.2em]">
              Services
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-sm text-accent font-light uppercase tracking-[0.2em]">
              For Fund Managers
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[0.95]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Capital formation,
            <br />
            reinvented
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We partner with GPs, sponsors, and emerging managers across Europe to raise capital through intelligent, data-driven processes.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </section>

      {/* Fund Placement */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-accent/60 font-light tabular-nums">01</span>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mt-4 mb-8 leading-tight">
                Fund Placement
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Our AI-powered platform maps investor appetite across 200+ institutional LPs, enabling precision targeting that dramatically improves conversion rates.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                From fund structuring and positioning through to final close, we bring strategic clarity and disciplined execution to every mandate — supporting capital raises from €10M to €100M+.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Portfolio Value Creation */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                We support your portfolio companies through their critical growth phases — from follow-on fundraising and strategic partnerships to full exit preparation.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Our 26-year network spans corporate strategics, co-investors, and acquirers, enabling warm introductions that accelerate timelines and improve outcomes.
              </p>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-accent/60 font-light tabular-nums">02</span>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mt-4 mb-8 leading-tight">
                Portfolio Value Creation
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Market Intelligence */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-accent/60 font-light tabular-nums">03</span>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mt-4 mb-8 leading-tight">
                Market Intelligence
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Our proprietary AIRES platform continuously monitors market dynamics, investor sentiment, and competitive landscapes — delivering actionable intelligence before the market catches up.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Sector deep dives, valuation benchmarking, and competitive analysis — all powered by AI, validated by experienced professionals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Aries76 band */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white py-32 overflow-hidden">
        <InstitutionalDataViz className="opacity-40" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-accent mb-6 font-light">
              Why Aries76
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight max-w-3xl">
              The intelligence advantage in private markets
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'AI-Powered Targeting', description: 'Predictive analytics and machine learning for precision investor matching.' },
              { title: 'Deep Relationships', description: '26+ years of capital markets experience across UK, Europe, and MENA.' },
              { title: 'Cross-Border Reach', description: 'Track record spanning London, Zurich, Luxembourg, Paris, and the Nordics.' },
              { title: 'Aligned Incentives', description: 'Flexible engagement models — retainer, project, or success-based.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-8 h-px bg-accent mb-6" />
                <h3 className="text-lg font-light text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 tracking-tight leading-tight">
              Ready to start a conversation?
            </h2>
            <p className="text-lg text-muted-foreground font-light mb-12 leading-relaxed">
              An honest discussion about your capital formation challenges, and whether Aries76 is the right partner.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-10">
                Schedule a Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GPCapitalAdvisory;
