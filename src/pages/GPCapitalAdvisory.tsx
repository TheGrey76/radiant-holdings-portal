import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Users2, TrendingUp, Scale, FileText, UserCheck, Target, Coins, BarChart3, Globe2, Network, Brain, Shield, Zap, CircleDollarSign, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GPCapitalAdvisory = () => {
  const pillars = [
    {
      icon: CircleDollarSign,
      title: 'GP Equity Investments',
      description: 'Minority and majority stake structuring for strategic growth capital.'
    },
    {
      icon: Handshake,
      title: 'GP M&A Transactions',
      description: 'Strategic acquisitions and consolidation opportunities for management companies.'
    },
    {
      icon: TrendingUp,
      title: 'GP Financing',
      description: 'Debt, preferred equity, and hybrid instruments tailored to management company needs.'
    },
    {
      icon: Users2,
      title: 'Minority Stakes & Liquidity Options',
      description: 'Partial monetization and liquidity solutions for founding partners.'
    },
    {
      icon: UserCheck,
      title: 'Succession Planning & Partner Alignment',
      description: 'Next-generation leadership transition and incentive restructuring.'
    },
    {
      icon: Scale,
      title: 'Valuation & Forecasting',
      description: 'Independent management company valuation and performance modeling.'
    }
  ];

  const useCases = [
    {
      title: 'Geographic & Product Expansion',
      description: 'GP-equity investment enabling multi-strategy platform development and cross-border presence.'
    },
    {
      title: 'Partial Divestiture & Governance Realignment',
      description: 'Strategic sale to financial or industry buyer with governance optimization.'
    },
    {
      title: 'Operational & Technology Enhancement',
      description: 'Debt or preferred financing for infrastructure, technology, and talent investment.'
    },
    {
      title: 'Succession & Partner Incentivization',
      description: 'Structured succession program with refreshed partnership economics and retention mechanisms.'
    },
    {
      title: 'Fee-Based Revenue Stabilization',
      description: 'Partial monetization through structured liquidity while maintaining alignment with LP base.'
    },
    {
      title: 'Multi-Strategy Platform Alignment',
      description: 'GP/LP structural alignment across diverse fund vehicles and investment mandates.'
    }
  ];

  const advisoryModules = [
    {
      title: 'Strategy & Positioning',
      items: ['Management company narrative', 'Governance structure review', 'Incentive design optimization', 'Operating model assessment']
    },
    {
      title: 'Structuring & Execution',
      items: ['Capital structure options', 'Term sheet negotiation', 'Documentation coordination', 'Counterparty selection process']
    },
    {
      title: 'Valuation & Investor Access',
      items: ['GP valuation modeling', 'Benchmarking & metrics', 'Pipeline integration', 'Qualified investor outreach']
    }
  ];

  const processSteps = [
    'Diagnostics & Current State Assessment',
    'Strategy Memo & Options Analysis',
    'Market Soundings & Investor Engagement',
    'Deal Structuring & Term Sheet',
    'Execution & Negotiations',
    'Closing & Transition Plan'
  ];

  const valuationDrivers = [
    'Fee Income Quality & Recurring Revenue',
    'Carry Economics & Realization Profile',
    'Product Pipeline & Fund Launch Trajectory',
    'Team Retention & Succession Readiness',
    'Operating Leverage & Margin Efficiency',
    'Governance & Compliance Infrastructure'
  ];

  const whyAries = [
    {
      icon: Globe2,
      title: 'Global Network Access',
      description: 'Direct reach to LPs, family offices, and allocators across UK, Europe, and MENA.'
    },
    {
      icon: Network,
      title: 'Cross-Border Expertise',
      description: 'Proven execution experience in London, Zurich, Luxembourg, and Budapest.'
    },
    {
      icon: Shield,
      title: 'Integrated Advisory Model',
      description: 'Unified strategy, capital formation, and investor relations capability.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Intelligence (AIRES)',
      description: 'Advanced analytics for investor targeting, engagement optimization, and market intelligence.'
    }
  ];

  const sectors = [
    'Digital Infrastructure & AI Infrastructure',
    'Healthcare & Life Sciences',
    'Sustainability & Energy Transition',
    'Industrial Technology',
    'Consumer & Luxury (Selective)'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white py-32 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`
          }} />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              GP Capital Advisory
            </h1>
            <p className="text-2xl md:text-3xl font-light text-white/90 mb-8">
              Strategic advisory for management companies and GP platforms.
            </p>
            <p className="text-xl font-light text-white/80 max-w-4xl mx-auto mb-12">
              We advise leading private markets managers on GP equity, M&A, financing, valuation and succession—strengthening management companies to scale across Europe, the UK and select global regions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8"
                >
                  Schedule an Introductory Call
                </Button>
              </Link>
              <Button 
                size="lg"
                disabled
                className="bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 font-light uppercase tracking-wider px-8 transition-all opacity-50 cursor-not-allowed"
              >
                Download Overview (Coming Soon)
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Aries76 & Focus */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              About Aries76 & <span className="text-accent">Our Focus</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border/50 bg-card h-full">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-light text-foreground mb-6 tracking-tight">
                    Who We Are
                  </h3>
                  <p className="text-lg font-light text-muted-foreground leading-relaxed">
                    Aries76 Ltd is a London-based boutique advisory firm supporting international GPs in capital formation and investor access. We operate at the intersection of private markets, structured solutions, and investor relations, combining institutional rigor with boutique execution.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-border/50 bg-card h-full">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-light text-foreground mb-6 tracking-tight">
                    Our Target Clients
                  </h3>
                  <p className="text-lg font-light text-muted-foreground leading-relaxed mb-4">
                    Second/later-generation GPs, typically managing €1–5bn in AUM.
                  </p>
                  <p className="text-sm font-light text-muted-foreground/80">
                    <strong className="text-foreground">Geographies:</strong> Luxembourg, London, Paris, Nordics
                  </p>
                  <p className="text-sm font-light text-muted-foreground/80 mt-2">
                    <strong className="text-foreground">Sectors:</strong> Digital infrastructure & AI, healthcare, sustainability/energy transition, industrial tech, selective consumer & luxury
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is GP Capital Advisory */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              What is <span className="text-accent">GP Capital Advisory</span>
            </h2>
            <p className="text-xl font-light text-white/80 max-w-4xl mx-auto">
              Advisory dedicated to the management company of the GP: structuring, growth, capital attraction, and strategic options on the GP entity itself—not solely on the fund.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                      <pillar.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-light mb-3 tracking-tight text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Representative <span className="text-accent">Use Cases</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card hover:shadow-smooth-lg transition-shadow h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light text-foreground mb-3 tracking-tight">
                      {useCase.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Modules */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-[#0f1729]/5 to-[#1a2744]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Advisory <span className="text-accent">Modules</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisoryModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light text-foreground mb-6 tracking-tight">
                      {module.title}
                    </h3>
                    <ul className="space-y-3">
                      {module.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-muted-foreground font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Our <span className="text-accent">Process</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-accent font-light">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-foreground font-light">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Valuation & Metrics */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-[#0f1729]/5 to-[#1a2744]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Valuation & <span className="text-accent">Key Metrics</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground max-w-3xl mx-auto">
              Data-driven approach integrating AIRES analytics for investor targeting and engagement optimization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-10">
                <h3 className="text-2xl font-light text-foreground mb-8 text-center tracking-tight">
                  Key Valuation Drivers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {valuationDrivers.map((driver, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground font-light">{driver}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Aries76 */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Why <span className="text-accent">Aries76</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyAries.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card hover:shadow-smooth-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light text-foreground mb-3 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors & Themes */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-[#0f1729]/5 to-[#1a2744]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Sectors & <span className="text-accent">Investment Themes</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {sectors.map((sector, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="px-6 py-3 text-sm font-light border-accent/30 text-foreground hover:bg-accent/10 transition-colors"
              >
                {sector}
              </Badge>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Explore a <span className="text-accent">Strategic Partnership</span>
            </h2>
            <p className="text-xl font-light text-white/80 mb-10 max-w-2xl mx-auto">
              Let's discuss in confidence your GP growth plan: equity, M&A, financing, succession, and valuation strategies.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8 mb-8"
              >
                Arrange a 15-Minute Intro
              </Button>
            </Link>
            <p className="text-white/60 font-light">
              Contact: <a href="mailto:quinley.martini@aries76.com" className="text-accent hover:underline">quinley.martini@aries76.com</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GPCapitalAdvisory;