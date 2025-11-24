import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Users2, TrendingUp, Globe2, Network, Brain, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FamilyOfficeAdvisory = () => {
  const capabilities = [
    {
      icon: Target,
      title: 'Portfolio Strategy & Allocation Framework',
      description: 'Develop coherent multi-asset roadmaps aligned with long-term family objectives and risk appetite.'
    },
    {
      icon: Users2,
      title: 'GP & Manager Evaluation',
      description: 'Independent assessment of fund managers, track records, and operational capabilities.'
    },
    {
      icon: FileCheck,
      title: 'Direct Deal Screening & Due Diligence',
      description: 'Rigorous analysis of co-investment opportunities and direct private market transactions.'
    },
    {
      icon: Globe2,
      title: 'Cross-Border Access & Execution',
      description: 'Leverage our international network to access differentiated opportunities across Europe and beyond.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Research Infrastructure',
      description: 'Data-driven insights and qualified opportunity pipelines through proprietary analytics.'
    },
    {
      icon: Shield,
      title: 'Independent Advisory',
      description: 'Conflict-free guidance with complete alignment to family office objectives.'
    }
  ];

  const serviceAreas = [
    {
      title: 'Strategic Positioning',
      items: [
        'Investment roadmap development',
        'Multi-asset allocation framework',
        'Strategic priority identification',
        'Governance structure enhancement'
      ]
    },
    {
      title: 'Private Markets Access',
      items: [
        'GP relationship development',
        'Fund manager due diligence',
        'Co-investment sourcing',
        'Direct deal evaluation'
      ]
    },
    {
      title: 'Specialized Solutions',
      items: [
        'Bespoke structured products',
        'Yield generation strategies',
        'Digital assets exposure',
        'Alternative credit opportunities'
      ]
    },
    {
      title: 'Platform Development',
      items: [
        'Pan-European investment platform',
        'International transaction flows',
        'Allocation discipline framework',
        'Risk management infrastructure'
      ]
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
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              Family Office Advisory
            </h1>
            <p className="text-2xl md:text-3xl font-light text-white/90 mb-8">
              Strategic advisory for sophisticated family capital.
            </p>
            <p className="text-xl font-light text-white/80 max-w-4xl mx-auto mb-12">
              We partner with single-family and multi-family offices to navigate complexity, strengthen strategic positioning, and access differentiated private market opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8"
                >
                  Schedule a Confidential Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-10">
                <p className="text-lg font-light text-foreground leading-relaxed mb-6">
                  Aries76 Ltd provides a dedicated advisory service for family offices seeking to strengthen their strategic positioning, expand their multi-asset capabilities, and access high-quality private market opportunities across Europe and beyond. Our approach combines deep sector expertise, disciplined investment analysis, and a global network developed through more than two decades in private equity, venture capital, structured products, and international capital raising.
                </p>
                <p className="text-lg font-light text-foreground leading-relaxed">
                  We support single-family and multi-family offices in navigating the increasing complexity of today's investment landscape. Our work spans portfolio strategy, manager evaluation, direct deal screening, and access to differentiated alternative investment opportunities sourced through our international relationships with GPs, sponsors, and corporate families.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
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
              Core <span className="text-accent">Capabilities</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {capabilities.map((capability, index) => (
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
                      <capability.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-light mb-3 tracking-tight text-white">
                      {capability.title}
                    </h3>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      {capability.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Advisory Offering */}
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
              Our Advisory <span className="text-accent">Offering</span>
            </h2>
            <p className="text-xl font-light text-muted-foreground max-w-4xl mx-auto">
              Designed to deliver clarity, alignment, and execution excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card mb-8">
              <CardContent className="p-10">
                <p className="text-lg font-light text-foreground leading-relaxed mb-6">
                  Our advisory offering is designed to deliver clarity, alignment, and execution excellence. We help family offices refine their investment roadmap, identify strategic priorities, and establish a coherent allocation framework across traditional and alternative asset classes. For clients seeking to expand into private markets, we act as a trusted partner in evaluating fund managers, assessing the strength of their track record, and conducting independent due diligence on opportunities in private equity, venture capital, credit, and digital assets.
                </p>
                <p className="text-lg font-light text-foreground leading-relaxed">
                  Through our AI-enabled research infrastructure and our proprietary data-driven processes, family offices gain access to qualified opportunities, structured analysis, and decision-ready insights. This includes our ability to design bespoke structured products for yield generation, identify co-investment opportunities with institutional-grade sponsors, and provide direct access to exclusive mandates within our network.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {serviceAreas.map((area, index) => (
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
                      {area.title}
                    </h3>
                    <ul className="space-y-3">
                      {area.items.map((item, i) => (
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

      {/* Independence & Alignment */}
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
              Independence & <span className="text-accent">Alignment</span>
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
                <p className="text-lg font-light text-foreground leading-relaxed">
                  Aries76 Ltd acts with full independence, avoiding conflicts of interest and maintaining complete alignment with the objectives of each family office. Whether supporting the development of a pan-European investment platform, creating access to international transaction flows, or strengthening governance and allocation discipline, we ensure a professional, high-integrity approach focused on long-term value creation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Ready to <span className="text-accent">Explore Partnership?</span>
            </h2>
            <p className="text-xl font-light text-white/80 mb-10 max-w-3xl mx-auto">
              Schedule a confidential consultation to discuss how we can support your family office's strategic objectives.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-10"
              >
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FamilyOfficeAdvisory;
