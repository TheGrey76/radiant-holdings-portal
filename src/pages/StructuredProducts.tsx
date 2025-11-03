import { motion } from 'framer-motion';
import { Shield, TrendingUp, Database, CheckCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const StructuredProducts = () => {
  const productTypes = [
    {
      type: 'Capital Protected Notes',
      description: '100% or partial protection on principal',
      useCase: 'Defensive portfolios, wealth preservation'
    },
    {
      type: 'Yield Enhancement Certificates',
      description: 'Autocallable, Reverse Convertible, Coupon Notes',
      useCase: 'Income strategies, moderate risk appetite'
    },
    {
      type: 'Participation Notes',
      description: 'Equity, Index or Thematic-linked exposure',
      useCase: 'Growth-oriented allocations'
    },
    {
      type: 'Credit & Hybrid Structures',
      description: 'CLO-linked or basket exposure',
      useCase: 'Institutional yield optimization'
    }
  ];

  const highlights = [
    {
      icon: Shield,
      title: 'Tailored Design',
      description: 'Certificates and notes built around your client objectives.'
    },
    {
      icon: TrendingUp,
      title: 'Institutional Access',
      description: 'Partnerships with top-tier issuers, including European and Swiss banks.'
    },
    {
      icon: Database,
      title: 'Data & AI Integration',
      description: 'Real-time market analysis and pricing powered by AiresData technology.'
    }
  ];

  const edges = [
    '25+ years in private markets and structured finance',
    'Extensive network across European issuers and distributors',
    'Integration with AiresData for pricing, analytics, and investor sentiment'
  ];

  return (
    <>
      <Helmet>
        <title>Structured Products | Aries76 Ltd</title>
        <meta name="description" content="Tailor-made investment certificates and structured notes by Aries76. Designed for private banks, wealth managers, and institutional investors." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-32 px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight uppercase">
                Structured Products &<br />Investment Solutions
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto">
                Tailor-made investment certificates and structured notes designed for private banks, wealth managers, and institutional investors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                What We Offer
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-3xl">
                Aries76 designs and distributes bespoke structured investment solutions that combine capital protection, enhanced yield, and exposure to high-quality underlying assets. Our approach blends institutional structuring expertise with flexibility and transparency.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-8"
                >
                  <item.icon className="w-12 h-12 text-accent mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-foreground mb-3 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground font-light">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Range */}
        <section className="py-24 px-6 md:px-10 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                Product Range
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                We structure and advise across a full spectrum of risk-return profiles and market conditions.
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-widest text-foreground/70 font-light">Product Type</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-widest text-foreground/70 font-light">Description</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-widest text-foreground/70 font-light">Typical Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  {productTypes.map((product, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-6 px-4 font-light text-foreground">{product.type}</td>
                      <td className="py-6 px-4 font-light text-muted-foreground">{product.description}</td>
                      <td className="py-6 px-4 font-light text-muted-foreground">{product.useCase}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 text-center"
            >
              <Link to="/contact">
                <Button variant="outline" size="lg" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Request Term Sheet Examples
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Why Aries76 */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                Our Edge
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-3xl mb-8">
                What sets Aries76 apart is the combination of financial structuring experience and technological innovation. We work closely with banks, boutiques, and family offices to create tailor-made investment products, supported by our proprietary AI analytics and cross-border distribution capabilities.
              </p>
            </motion.div>

            <div className="space-y-4">
              {edges.map((edge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-accent mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-lg text-foreground font-light">{edge}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-24 px-6 md:px-10 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                Compliance & Investor Protection
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                All products are designed and distributed under fully compliant European frameworks (MiFID II, PRIIPs, SFDR where applicable). Our team ensures each solution aligns with local distribution rules and target-market requirements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-light text-foreground mb-6 uppercase tracking-tight">
                Let's Build Your<br />Structured Product
              </h2>
              <p className="text-xl text-muted-foreground font-light mb-8">
                Request a consultation to design tailored certificates for your clients.
              </p>
              <Link to="/contact">
                <Button size="lg" className="uppercase tracking-wider">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StructuredProducts;
