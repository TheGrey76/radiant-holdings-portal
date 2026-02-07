import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstitutionalDataViz from '@/components/InstitutionalDataViz';

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white overflow-hidden">
        <InstitutionalDataViz />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-40 md:py-52">
          <motion.p
            className="text-sm uppercase tracking-[0.3em] text-accent mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Expertise
          </motion.p>
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[0.95]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Advisory for
            <br />
            Private Markets
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We combine institutional expertise with AI-driven intelligence to deliver superior outcomes for fund managers and investors across Europe.
          </motion.p>
        </div>

        {/* Accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </section>

      {/* For Fund Managers */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-accent mb-6 font-light">
                For Fund Managers
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-8 leading-tight">
                Capital formation, reinvented
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10">
                We partner with GPs, sponsors, and emerging managers to structure and execute fundraising mandates. Our AI-driven approach identifies the right investors, at the right time, with the right message.
              </p>
              <Link to="/gp-capital-advisory">
                <Button variant="outline" className="font-light uppercase tracking-wider group">
                  Explore GP Services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="space-y-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {[
                {
                  title: 'Fund Placement',
                  description: 'AI-powered investor targeting and data-driven fundraising execution across Europe and MENA.',
                },
                {
                  title: 'Portfolio Value Creation',
                  description: 'Follow-on fundraising, strategic partnerships, and exit preparation for portfolio companies.',
                },
                {
                  title: 'Market Intelligence',
                  description: 'Proprietary sector analysis and competitive intelligence powered by our AIRES platform.',
                },
              ].map((service, index) => (
                <div key={service.title} className="group">
                  <div className="flex items-baseline gap-6">
                    <span className="text-sm text-accent/60 font-light tabular-nums">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-light text-foreground mb-3 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="mt-12 h-px bg-border ml-12" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* For Limited Partners */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Services first on desktop (right side) */}
            <motion.div
              className="space-y-12 order-2 lg:order-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {[
                {
                  title: 'Fund Selection & Due Diligence',
                  description: 'Systematic GP screening, comprehensive fund analysis, and independent recommendation — no conflicts.',
                },
                {
                  title: 'Portfolio Management',
                  description: 'Ongoing monitoring, co-investment sourcing, and secondary market advisory for your PE/VC commitments.',
                },
                {
                  title: 'Strategic Advisory',
                  description: 'Private markets allocation strategy, emerging manager programs, and full program implementation.',
                },
              ].map((service, index) => (
                <div key={service.title} className="group">
                  <div className="flex items-baseline gap-6">
                    <span className="text-sm text-accent/60 font-light tabular-nums">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-light text-foreground mb-3 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="mt-12 h-px bg-border ml-12" />
                  )}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-accent mb-6 font-light">
                For Limited Partners
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-8 leading-tight">
                Independent advisory, institutional rigour
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10">
                We provide fully independent advisory to pension funds, insurance companies, and family offices navigating private markets — with no GP conflicts of interest.
              </p>
              <Link to="/for-limited-partners">
                <Button variant="outline" className="font-light uppercase tracking-wider group">
                  Explore LP Services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
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
              Our Approach
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Institutional expertise,
              <br />
              amplified by technology
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'AI-Driven Intelligence', description: 'Proprietary data infrastructure and predictive analytics for investor targeting.' },
              { title: '26+ Years Experience', description: 'Deep capital markets relationships across the UK, Europe, and MENA.' },
              { title: 'Complete Independence', description: 'No conflicts of interest. Advice always aligned with your objectives.' },
              { title: 'London & Milan', description: 'Strategically positioned across Europe\'s key financial centres.' },
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
              Let's discuss how we can help
            </h2>
            <p className="text-lg text-muted-foreground font-light mb-12 leading-relaxed">
              Whether you're raising capital or deploying it, we bring clarity and execution to complex private market transactions.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-10">
                Start a Conversation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
