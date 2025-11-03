import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const StructuredProducts = () => {
  const productTypes = [
    {
      type: 'Capital Protected Notes',
      description: 'Full or partial principal guarantee at maturity',
      features: ['100% capital protection', 'Participation in upside', 'European and COSI structures'],
      useCase: 'Defensive portfolios, wealth preservation, risk-averse investors'
    },
    {
      type: 'Yield Enhancement Certificates',
      description: 'Income-focused structures with enhanced coupon payments',
      features: ['Autocallable mechanisms', 'Reverse convertibles', 'Memory coupons', 'Barrier features'],
      useCase: 'Income strategies, moderate risk appetite, yield optimization'
    },
    {
      type: 'Participation Notes',
      description: 'Direct exposure to underlying assets with leverage options',
      features: ['Equity-linked', 'Index participation', 'Thematic baskets', 'Cap and floor structures'],
      useCase: 'Growth-oriented allocations, directional strategies'
    },
    {
      type: 'Credit & Hybrid Structures',
      description: 'Fixed income alternatives with enhanced returns',
      features: ['CLO-linked notes', 'Basket structures', 'Credit event triggers', 'Callable bonds'],
      useCase: 'Institutional yield optimization, credit exposure'
    }
  ];

  const marketData = [
    { label: 'Products Structured Annually', value: '500+', description: 'Across European and Swiss issuers' },
    { label: 'Average Ticket Size', value: '€2-50M', description: 'Institutional and private placement' },
    { label: 'Issuers Network', value: '15+', description: 'Top-tier European banks' },
    { label: 'Years in Structured Finance', value: '25+', description: 'Deep institutional expertise' },
  ];

  const complianceFrameworks = [
    {
      title: 'MiFID II',
      description: 'Full compliance with product governance, suitability assessment, and target market definition'
    },
    {
      title: 'PRIIPs Regulation',
      description: 'KID documentation with performance scenarios, risk indicators, and cost transparency'
    },
    {
      title: 'SFDR (where applicable)',
      description: 'ESG disclosure for sustainable investment products aligned with Article 8 or 9'
    },
    {
      title: 'Prospectus Regulation',
      description: 'Full documentation for public offerings and private placements across EU jurisdictions'
    }
  ];

  const structuringProcess = [
    { step: '01', title: 'Mandate Definition', description: 'Client objectives, risk appetite, target return, and investment horizon analysis' },
    { step: '02', title: 'Structuring & Pricing', description: 'Product design, issuer selection, term sheet creation, and competitive pricing' },
    { step: '03', title: 'Documentation', description: 'Legal documentation, KID/prospectus, compliance review, and regulatory filing' },
    { step: '04', title: 'Distribution & Settlement', description: 'Placement coordination, investor onboarding, settlement, and post-issuance reporting' },
  ];

  const underlyingAssets = [
    'Single stocks (European, US, Asian equities)',
    'Equity indices (EURO STOXX 50, S&P 500, MSCI World)',
    'Thematic baskets (ESG, Technology, Healthcare, Commodities)',
    'Interest rates and inflation-linked structures',
    'FX and multi-asset combinations',
    'Alternative assets (Real Estate, Infrastructure, Private Equity exposure)'
  ];

  return (
    <>
      <Helmet>
        <title>Structured Products | Aries76 Ltd</title>
        <meta name="description" content="Tailor-made investment certificates and structured notes by Aries76. Designed for private banks, wealth managers, and institutional investors." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-32 px-6 md:px-10 overflow-hidden bg-gradient-to-br from-primary to-accent">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight uppercase leading-tight">
                Structured Products &<br />Investment Solutions
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mb-12 leading-relaxed">
                Bespoke investment certificates and structured notes designed for private banks, wealth managers, and institutional investors seeking tailored risk-return profiles.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-white text-lg font-light hover:gap-4 transition-all border-b-2 border-white pb-1">
                Request a consultation <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Market Data Stats */}
        <section className="py-20 px-6 md:px-10 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {marketData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-light text-accent mb-2">{item.value}</div>
                  <div className="text-sm uppercase tracking-widest text-foreground mb-1 font-light">{item.label}</div>
                  <div className="text-xs text-muted-foreground font-light">{item.description}</div>
                </motion.div>
              ))}
            </div>
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
                Our Approach
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-4xl leading-relaxed">
                Aries76 designs and distributes bespoke structured investment solutions that combine capital protection, enhanced yield, and exposure to high-quality underlying assets. Our approach blends institutional structuring expertise with flexibility, transparency, and regulatory excellence across European markets.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-light text-foreground mb-4 uppercase tracking-wide">Structuring Expertise</h3>
                <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                  With 25+ years in private markets and structured finance, we design products that precisely match investor objectives, market conditions, and regulatory requirements. Our team combines quantitative modelling with practical market knowledge to deliver optimal structures.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-accent text-base font-light hover:gap-4 transition-all">
                  Discuss your requirements <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-light text-foreground mb-4 uppercase tracking-wide">Data & AI Integration</h3>
                <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                  Powered by our proprietary AiresData platform, we provide real-time pricing analytics, scenario modelling, and investor sentiment analysis. This technology enables faster structuring, competitive pricing, and enhanced transparency throughout the product lifecycle.
                </p>
                <Link to="/aires-data" className="inline-flex items-center gap-2 text-accent text-base font-light hover:gap-4 transition-all">
                  Explore AiresData <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Range */}
        <section className="py-24 px-6 md:px-10 bg-muted/20">
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
                We structure and advise across the full spectrum of risk-return profiles and market conditions, from defensive capital preservation to aggressive growth strategies.
              </p>
            </motion.div>

            <div className="space-y-8">
              {productTypes.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background border-l-4 border-accent p-8"
                >
                  <h3 className="text-2xl font-light text-foreground mb-3 uppercase tracking-wide">{product.type}</h3>
                  <p className="text-base text-muted-foreground font-light mb-4">{product.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-accent mb-2">Key Features</div>
                      <ul className="space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground font-light flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-accent mb-2">Typical Use Case</div>
                      <p className="text-sm text-muted-foreground font-light">{product.useCase}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* Underlying Assets */}
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
                Underlying Assets
              </h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                We structure products across a comprehensive range of underlying assets, enabling precise exposure to specific markets, sectors, or investment themes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {underlyingAssets.map((asset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-muted/20"
                >
                  <span className="text-accent text-2xl font-light">→</span>
                  <p className="text-base text-foreground font-light pt-1">{asset}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Structuring Process */}
        <section className="py-24 px-6 md:px-10 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                Structuring Process
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                Our end-to-end approach ensures seamless execution from initial mandate to final settlement.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {structuringProcess.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-6xl font-light text-accent/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-light text-foreground mb-3 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance */}
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
                Regulatory Compliance
              </h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                All products are designed and distributed under fully compliant European frameworks. Our team ensures each solution aligns with target market requirements, distribution rules, and investor protection standards.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-muted/20 border-l-2 border-accent"
                >
                  <h3 className="text-xl font-light text-foreground mb-2 uppercase tracking-wide">{framework.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{framework.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Issuer Network */}
        <section className="py-24 px-6 md:px-10 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
                Issuer Network
              </h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                We maintain active partnerships with 15+ top-tier European and Swiss banks, ensuring competitive pricing, optimal execution, and access to diverse structuring capabilities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="p-6 bg-background">
                <div className="text-3xl font-light text-accent mb-2">AAA to BBB+</div>
                <div className="text-sm uppercase tracking-widest text-foreground/70 mb-2">Credit Ratings</div>
                <p className="text-sm text-muted-foreground font-light">Investment-grade issuers with strong financial profiles</p>
              </div>
              <div className="p-6 bg-background">
                <div className="text-3xl font-light text-accent mb-2">€100M+</div>
                <div className="text-sm uppercase tracking-widest text-foreground/70 mb-2">Annual Issuance</div>
                <p className="text-sm text-muted-foreground font-light">Combined structuring capacity across our network</p>
              </div>
              <div className="p-6 bg-background">
                <div className="text-3xl font-light text-accent mb-2">48-72h</div>
                <div className="text-sm uppercase tracking-widest text-foreground/70 mb-2">Pricing Turnaround</div>
                <p className="text-sm text-muted-foreground font-light">Fast execution and competitive term sheet delivery</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 md:px-10 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-light text-foreground mb-6 uppercase tracking-tight leading-tight">
                Design Your Next<br />Structured Product
              </h2>
              <p className="text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
                Request a consultation to create tailored investment certificates for your clients or portfolio.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-3 text-accent text-2xl font-light hover:gap-5 transition-all border-b-2 border-accent pb-2">
                Get in Touch <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StructuredProducts;
