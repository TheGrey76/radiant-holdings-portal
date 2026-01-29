import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Search, 
  Users, 
  Briefcase,
  Shield,
  Brain,
  ArrowRight,
  Building2,
  Handshake,
  FileSearch,
  PieChart,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Services = () => {
  const gpServices = [
    {
      icon: Search,
      title: 'Deal Sourcing as a Service',
      description: 'Proactive sector monitoring, qualified deal flow, and exclusive first-look opportunities. Our AI platform monitors 500+ European fintech/AI companies continuously.',
      features: ['Weekly deal flow digest', 'Pre-qualified opportunities', 'Exclusive access programs']
    },
    {
      icon: TrendingUp,
      title: 'Portfolio Value Creation',
      description: 'Full-service support for portfolio companies: follow-on fundraising, strategic partnerships, and exit preparation with M&A advisory.',
      features: ['Series A-C fundraising support', 'Strategic partner introductions', 'Exit readiness & M&A execution']
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Actionable sector analysis, competitive intelligence, and valuation benchmarking to support smarter investment decisions.',
      features: ['Sector deep dives', 'Competitive analysis', 'Valuation benchmarking']
    }
  ];

  const lpServices = [
    {
      icon: FileSearch,
      title: 'Fund Selection & Due Diligence',
      description: 'Systematic GP screening, comprehensive fund due diligence, and structured reference programs. Independent analysis, no GP conflicts.',
      features: ['Quarterly fund shortlists', 'Full DD packages', 'Reference check programs']
    },
    {
      icon: PieChart,
      title: 'Portfolio Management Support',
      description: 'Ongoing fund monitoring, co-investment sourcing, and secondary market advisory. Maximize value from existing commitments.',
      features: ['Quarterly performance analysis', 'Co-invest opportunity sourcing', 'Secondary buy/sell support']
    },
    {
      icon: Compass,
      title: 'Strategic Advisory',
      description: 'PE/VC allocation strategy design, emerging manager programs, and full program implementation support.',
      features: ['Allocation strategy design', 'Emerging manager programs', 'Program implementation']
    }
  ];

  const differentiators = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Our proprietary AIRES platform delivers data-driven investor targeting and market intelligence.'
    },
    {
      icon: Users,
      title: '26+ Years Experience',
      description: 'Deep capital markets relationships and proven execution across Europe and beyond.'
    },
    {
      icon: Shield,
      title: 'Independence & Alignment',
      description: 'No conflicts of interest. Our advice is always in your interest—LP or GP.'
    },
    {
      icon: Building2,
      title: 'London & Milan Presence',
      description: 'Strategic positioning across key European financial centres.'
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
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 uppercase">
              Our <span className="text-accent">Services</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90 mb-8 max-w-3xl mx-auto">
              Technology-powered solutions for PE/VC funds and institutional investors
            </p>
            <p className="text-lg font-light text-white/70 max-w-4xl mx-auto">
              Aries76 combines institutional expertise with AI-driven intelligence to deliver superior outcomes 
              for fund managers and limited partners across Europe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For GPs Section */}
      <section className="py-24 px-6 md:px-10 bg-background" id="for-gps">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <Briefcase className="w-10 h-10 text-accent" strokeWidth={1.5} />
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                For <span className="text-accent">Fund Managers</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Stop relying on inbound. Start sourcing proactively, maximize portfolio value, and make smarter investment decisions with our technology-powered solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {gpServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/gp-capital-advisory">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider">
                Explore GP Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* For LPs Section */}
      <section className="py-24 px-6 md:px-10 bg-muted/30" id="for-lps">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <Handshake className="w-10 h-10 text-accent" strokeWidth={1.5} />
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                For <span className="text-accent">Limited Partners</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Level the playing field with independent advisory. Find the right funds, maximize existing commitments, and build or optimize your private markets program.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {lpServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/for-limited-partners">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider">
                Explore LP Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
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
              What Makes Us <span className="text-accent">Different</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((item, index) => (
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

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-10 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Ready to <span className="text-accent">Get Started</span>?
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
              Whether you're a fund manager seeking to optimize your capital formation or an LP looking for independent advisory, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8">
                  Schedule a Conversation
                </Button>
              </Link>
              <Link to="/strategic-partnerships">
                <Button size="lg" variant="outline" className="font-light uppercase tracking-wider px-8">
                  Explore Partnerships
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
