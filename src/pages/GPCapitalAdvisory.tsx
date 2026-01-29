import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Handshake,
  FileText,
  Zap,
  Globe2,
  Brain,
  Shield,
  ArrowRight,
  CheckCircle,
  Building2,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GPCapitalAdvisory = () => {
  const dealSourcingServices = [
    {
      title: 'Sector Monitoring Subscription',
      description: 'Real-time intelligence on fintech/AI companies across Europe, delivered through regular briefings and alerts.',
      features: [
        'Weekly deal flow digest (15-25 companies)',
        'Real-time alerts on funding rounds & key hires',
        'Monthly sector trend analysis',
        'Quarterly market map updates',
        'Direct analyst access for ad-hoc questions'
      ]
    },
    {
      title: 'Qualified Deal Flow Partnership',
      description: 'Proactive sourcing of investment opportunities matching your specific thesis, with full qualification before introduction.',
      features: [
        'Customized sourcing criteria development',
        'Monthly pipeline of 10-20 pre-qualified opportunities',
        'Investment memo summaries (2-3 pages)',
        'Warm introductions to founders',
        'Ongoing tracking of introduced companies'
      ]
    },
    {
      title: 'Exclusive First-Look Program',
      description: 'Premium access to curated opportunities before they reach the broader market.',
      features: [
        '3-5 exclusive opportunities per quarter',
        '2-week exclusivity window',
        'Full investment memo with financial model',
        'Management meeting facilitation',
        'Deal structuring support'
      ]
    }
  ];

  const portfolioServices = [
    {
      icon: TrendingUp,
      title: 'Follow-on Fundraising',
      description: 'Full-service fundraising support for portfolio companies raising Series A through Series C.',
      features: ['Strategy & timeline development', 'Investor targeting (200+ mapped)', 'Materials preparation', 'Process management through closing']
    },
    {
      icon: Handshake,
      title: 'Strategic Partnership Development',
      description: 'Identify and facilitate strategic partnerships—customers, distribution, technology partners.',
      features: ['Partnership strategy workshop', 'Target mapping (50-100 partners)', 'Introduction facilitation', 'Deal structuring advisory']
    },
    {
      icon: Target,
      title: 'Exit Preparation & M&A',
      description: 'Comprehensive preparation for portfolio exits—trade sale, secondary, or IPO track.',
      features: ['Exit readiness assessment', 'Buyer landscape mapping', 'Data room preparation', 'Process execution & negotiation']
    }
  ];

  const intelligenceServices = [
    {
      title: 'Sector Deep Dive Reports',
      description: 'Comprehensive analysis of specific fintech/AI verticals with actionable investment intelligence.',
      deliverables: ['Market sizing & projections', 'Competitive landscape (50-100 companies)', 'Investment activity & valuations', 'Target company profiles (10-15)']
    },
    {
      title: 'Competitive Intelligence',
      description: 'Detailed company analysis for investment evaluation or strategic planning.',
      deliverables: ['Business model analysis', 'Financial estimates & metrics', 'Team & funding history', 'Competitive positioning']
    },
    {
      title: 'Valuation Benchmarking',
      description: 'Comparable company analysis and valuation framework for investment decisions.',
      deliverables: ['Comparable company set (10-20)', 'Trading & transaction multiples', 'Valuation range derivation', 'Key value driver analysis']
    }
  ];

  const quickWins = [
    { title: 'Fund Positioning Audit', description: 'Assess messaging and materials resonance', timeline: '2 weeks' },
    { title: 'LP Readiness Assessment', description: 'Evaluate institutional capital readiness', timeline: '3 weeks' },
    { title: 'European Market Entry Brief', description: 'Landscape for funds entering Europe', timeline: '4 weeks' },
    { title: 'Co-Investor Mapping', description: 'Identify syndication partners for deals', timeline: '10 days' },
  ];

  const whyAries = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Our AIRES platform monitors 500+ companies continuously, delivering insights 3-6 months before market.'
    },
    {
      icon: Users,
      title: '26+ Years Experience',
      description: 'Deep capital markets relationships with proven execution across UK, Europe, and MENA.'
    },
    {
      icon: Globe2,
      title: 'Cross-Border Expertise',
      description: 'Track record in London, Zurich, Luxembourg, Paris, and Nordics.'
    },
    {
      icon: Shield,
      title: 'Partnership Approach',
      description: 'Aligned incentives through flexible engagement models—retainer, project, or success-based.'
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent mb-8">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-light uppercase tracking-wider">Services for Fund Managers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              GP Services
            </h1>
            <p className="text-2xl md:text-3xl font-light text-white/90 mb-8">
              Technology-powered solutions for PE/VC funds
            </p>
            <p className="text-xl font-light text-white/70 max-w-4xl mx-auto mb-12">
              Deploy capital efficiently, differentiate your deal flow, support portfolio companies through exit—all while competing with funds that have deeper pockets. We help you punch above your weight.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8"
                >
                  Schedule a Discovery Call
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deal Sourcing Section */}
      <section className="py-24 px-6 md:px-10 bg-background" id="deal-sourcing">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Deal Sourcing <span className="text-accent">as a Service</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Stop relying on inbound. Start sourcing proactively with AI-powered intelligence and human qualification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {dealSourcingServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light text-foreground mb-4 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
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

      {/* Portfolio Support Section */}
      <section className="py-24 px-6 md:px-10 bg-muted/30" id="portfolio-support">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Portfolio <span className="text-accent">Value Creation</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Maximize returns through your portfolio lifecycle with structured processes and 26 years of capital markets relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                      <service.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-4 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {feature}
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

      {/* Market Intelligence Section */}
      <section className="py-24 px-6 md:px-10 bg-background" id="market-intelligence">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Market <span className="text-accent">Intelligence</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Make smarter investment decisions, faster. Proprietary data and methodology, not generic research.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intelligenceServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light text-foreground mb-4 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs uppercase tracking-wider text-accent mb-3">Deliverables</p>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Wins Section */}
      <section className="py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Quick-Win <span className="text-accent">Packages</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light">
              Fixed scope, fast delivery. Entry points for new relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickWins.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-light text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light mb-4">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                      {item.timeline}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Aries76 Section */}
      <section className="py-24 px-6 md:px-10 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Why <span className="text-accent">Aries76</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyAries.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70 font-light text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal Client Section */}
      <section className="py-24 px-6 md:px-10 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-10">
                <h2 className="text-3xl font-light text-foreground mb-6 tracking-tight">
                  Ideal Client Profile
                </h2>
                <p className="text-lg text-muted-foreground font-light mb-6">
                  We work best with:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'PE/VC funds with €50M+ AUM',
                    'Focus on fintech, AI, or B2B software',
                    'European investment mandate',
                    'Appetite for process-driven approaches',
                    'Teams that value quality over quantity',
                    'Funds entering European market'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              15-Minute <span className="text-accent">Discovery Call</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
              No pitch. No pressure. An honest conversation about your sourcing and portfolio challenges, and whether Aries76 is the right fit.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8">
                Schedule a Conversation
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
