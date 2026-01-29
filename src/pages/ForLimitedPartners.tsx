import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileSearch, 
  PieChart, 
  Compass,
  Shield,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  Building2,
  Brain,
  Handshake,
  BarChart3,
  TrendingUp,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ForLimitedPartners = () => {
  const fundSelectionServices = [
    {
      title: 'GP Screening Service',
      description: 'Systematic identification and pre-qualification of PE/VC funds matching your investment criteria.',
      features: [
        'Customized screening criteria development',
        'Quarterly shortlist of 15-25 qualified funds',
        'Summary profiles (2-page briefs)',
        'Preliminary assessment & recommendation',
        'Introduction facilitation to selected GPs'
      ]
    },
    {
      title: 'Fund Due Diligence',
      description: 'Comprehensive due diligence on specific PE/VC funds being considered for commitment.',
      features: [
        'Investment strategy analysis',
        'Track record verification & attribution',
        'Team assessment & references',
        'Operational due diligence',
        'Terms analysis & benchmarking'
      ]
    },
    {
      title: 'Reference Check Program',
      description: 'Comprehensive reference checking including portfolio company executives, co-investors, and LPs.',
      features: [
        '10-15 structured reference calls',
        'Pattern identification & red flag assessment',
        'Summary report with recommendation',
        'Optional background verification'
      ]
    }
  ];

  const portfolioServices = [
    {
      icon: BarChart3,
      title: 'Fund Monitoring & Reporting',
      description: 'Ongoing monitoring and analysis of your PE/VC fund investments.',
      features: ['Quarterly performance analysis', 'Benchmark comparison', 'Cash flow forecasting', 'Annual portfolio review']
    },
    {
      icon: TrendingUp,
      title: 'Co-Investment Sourcing',
      description: 'Identify and facilitate co-investment opportunities from existing GP relationships.',
      features: ['Co-invest strategy development', 'Opportunity screening', 'Due diligence support', 'Execution coordination']
    },
    {
      icon: Handshake,
      title: 'Secondary Advisory',
      description: 'Buy-side or sell-side support for PE/VC fund interest transactions.',
      features: ['Portfolio valuation guidance', 'Buyer/seller identification', 'Process management', 'Negotiation support']
    }
  ];

  const strategicServices = [
    {
      title: 'PE/VC Allocation Strategy',
      description: 'Design or optimize your private equity and venture capital investment program.',
      phases: [
        { name: 'Assessment', items: ['Current portfolio analysis', 'Peer benchmarking', 'Gap identification'] },
        { name: 'Strategy', items: ['Target allocation framework', 'Manager selection criteria', 'Pacing model'] },
        { name: 'Implementation', items: ['Manager pipeline', 'Commitment schedule', 'Governance framework'] }
      ]
    },
    {
      title: 'Emerging Manager Program',
      description: 'Design and implement a program for investing in first-time and emerging fund managers.',
      phases: [
        { name: 'Design', items: ['Program strategy & rationale', 'Risk framework', 'Selection criteria'] },
        { name: 'Pipeline', items: ['Manager identification', 'DD process design', '25-50 manager pipeline'] },
        { name: 'Management', items: ['Ongoing oversight', 'Performance tracking', 'Portfolio construction'] }
      ]
    }
  ];

  const quickWins = [
    { title: 'GP Landscape Map', description: 'Who\'s raising in your target strategy?', timeline: '3 weeks' },
    { title: 'Portfolio Health Check', description: 'How is your PE/VC portfolio performing?', timeline: '3 weeks' },
    { title: 'Terms Benchmarking', description: 'Are these fund terms fair?', timeline: '1 week' },
    { title: 'Reference Fast-Track', description: 'Quick read on a specific GP', timeline: '1 week' },
  ];

  const differentiators = [
    {
      icon: Shield,
      title: '100% Independent',
      description: 'We do not raise capital for GPs. We do not receive placement fees. Our only client is you.'
    },
    {
      icon: Brain,
      title: 'Specialist Focus',
      description: 'Deep expertise in fintech, AI, and technology sectors—not generalist coverage.'
    },
    {
      icon: Users,
      title: 'Senior-Led Engagement',
      description: 'Direct access to experienced professionals, not junior staff delivery.'
    },
    {
      icon: Building2,
      title: 'Efficient Model',
      description: 'Tailored approach without the overhead pricing of large consulting firms.'
    }
  ];

  const idealClients = [
    'Pension funds with PE/VC allocation',
    'Insurance companies entering private markets',
    'Family offices building institutional programs',
    'Fund of funds seeking specialist support',
    'Endowments optimizing existing programs',
    'Organizations expanding PE/VC allocation'
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
              <Handshake className="w-4 h-4" />
              <span className="text-sm font-light uppercase tracking-wider">Services for Limited Partners</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              LP Services
            </h1>
            <p className="text-2xl md:text-3xl font-light text-white/90 mb-8">
              Independent advisory for PE/VC allocators
            </p>
            <p className="text-xl font-light text-white/70 max-w-4xl mx-auto mb-12">
              Building and managing a PE/VC portfolio is resource-intensive. Source quality funds, conduct thorough due diligence, and optimize allocation—we level the playing field.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8"
                >
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fund Selection Section */}
      <section className="py-24 px-6 md:px-10 bg-background" id="fund-selection">
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
                <FileSearch className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Fund Selection & <span className="text-accent">Due Diligence</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Find the right funds. Avoid the wrong ones. Institutional-grade process, regardless of your team size.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {fundSelectionServices.map((service, index) => (
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

      {/* Portfolio Management Section */}
      <section className="py-24 px-6 md:px-10 bg-muted/30" id="portfolio-management">
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
                <PieChart className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Portfolio <span className="text-accent">Management Support</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Maximize value from existing commitments. Consistent reporting, unlocked co-investments, expert secondary guidance.
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

      {/* Strategic Advisory Section */}
      <section className="py-24 px-6 md:px-10 bg-background" id="strategic-advisory">
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
                <Compass className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Strategic <span className="text-accent">Advisory</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              Build or optimize your private markets program with objective advice and practical recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {strategicServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-smooth-lg transition-all">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-light text-foreground mb-4 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {service.phases.map((phase, i) => (
                        <div key={i} className="text-center">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                            <span className="text-accent font-light">{i + 1}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-2">{phase.name}</p>
                          <ul className="space-y-1">
                            {phase.items.map((item, j) => (
                              <li key={j} className="text-xs text-muted-foreground">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
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

      {/* Independence Section */}
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
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Independence matters. Our advice is always in your interest—never influenced by what's easiest to sell.
            </p>
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
                  {idealClients.map((item, i) => (
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

      {/* Compliance Note */}
      <section className="py-12 px-6 md:px-10 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-900 dark:text-amber-200 font-light">
                <strong className="font-medium">For Professional Investors Only:</strong> Aries76 exclusively engages with professional and institutional investors as defined by applicable regulations. Details on specific services and engagements are provided subject to eligibility verification.
              </p>
            </div>
          </motion.div>
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
              30-Minute <span className="text-accent">Consultation</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
              Discuss your current PE/VC program, challenges you're facing, and where independent support could add value. No commitment required.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8">
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
