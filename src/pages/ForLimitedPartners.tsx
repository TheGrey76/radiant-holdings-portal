import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstitutionalDataViz from '@/components/InstitutionalDataViz';

const ForLimitedPartners = () => {
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
              For Limited Partners
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[0.95]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Independent advisory,
            <br />
            institutional rigour
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We advise pension funds, insurance companies, and family offices navigating private markets — with complete independence and no GP conflicts.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </section>

      {/* Fund Selection & Due Diligence */}
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
                Fund Selection &<br />Due Diligence
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
                We systematically identify and evaluate PE/VC funds that match your investment mandate, applying institutional-grade due diligence regardless of your team size.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                From GP screening and track record analysis to comprehensive reference programs, our process gives you confidence in every commitment decision.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Portfolio Management */}
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
                We help you maximise value from existing commitments through consistent monitoring, performance benchmarking, and proactive cash flow management.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Our team also identifies co-investment opportunities and provides expert guidance on secondary transactions — whether you're buying, selling, or restructuring positions.
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
                Portfolio Management
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

      {/* Strategic Advisory */}
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
                Strategic Advisory
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
                Whether you're building a private markets programme from scratch or optimising an existing one, we provide the strategic framework and hands-on support to get it right.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Allocation strategy, pacing models, emerging manager programs, and governance design — objective advice informed by deep market expertise and data-driven insights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Differentiators band */}
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
              Our Commitment
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight max-w-3xl">
              Your interests, and nothing else
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: '100% Independent', description: 'We do not raise capital for GPs. We do not receive placement fees. Our only client is you.' },
              { title: 'Specialist Focus', description: 'Deep expertise in technology, fintech, and AI sectors — not generalist coverage.' },
              { title: 'Senior-Led', description: 'Direct access to experienced professionals throughout the engagement.' },
              { title: 'Efficient Model', description: 'Tailored approach without the overhead pricing of large consulting firms.' },
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
              Let's discuss your programme
            </h2>
            <p className="text-lg text-muted-foreground font-light mb-12 leading-relaxed">
              A confidential conversation about your private markets objectives and how independent advisory can make a difference.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-10">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForLimitedPartners;
