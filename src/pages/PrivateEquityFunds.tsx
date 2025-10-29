import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, Globe2, Network, Brain, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PrivateEquityFunds = () => {
  const deliverables = [
    {
      icon: Building2,
      title: 'Fund Positioning & Structuring',
      description: 'Refining fund materials, investment narrative, and LP-facing documentation.'
    },
    {
      icon: TrendingUp,
      title: 'Capital Formation Advisory',
      description: 'Designing and executing investor engagement strategies for cross-border fundraising.'
    },
    {
      icon: Users,
      title: 'Investor Relations & Structured Access',
      description: 'Managing LP communication and developing tailored investment solutions, including co-investment and continuation vehicles.'
    }
  ];

  const valueProps = [
    {
      icon: Globe2,
      title: 'Global Network Access',
      description: 'Direct reach to LPs, family offices, and allocators across key financial hubs.'
    },
    {
      icon: Network,
      title: 'Cross-Border Expertise',
      description: 'Proven experience across London, Zurich, Luxembourg, and Budapest.'
    },
    {
      icon: Shield,
      title: 'Integrated Advisory Model',
      description: 'Fund strategy, investor relations, and structured product design under one platform.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Fundraising Intelligence',
      description: 'Leveraging data analytics to enhance targeting and LP engagement.'
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
              Strategic Advisory for International
              <br />
              <span className="text-accent">Private Equity Managers</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto">
              Supporting established GPs in cross-border capital formation and investor access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed text-center">
              Aries76 Ltd partners with mid-to-large international Private Equity funds (AUM &gt; €1bn) seeking to expand their investor base across Europe, the UK, and select global regions. Operating at the intersection of private markets, structured solutions, and investor relations, we deliver an institutional approach with boutique precision — connecting established fund managers with the capital and strategic partners they need to scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Work With */}
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
              Established Funds. <span className="text-accent">Global Ambitions.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-12">
                <p className="text-lg font-light text-muted-foreground leading-relaxed">
                  Aries76 collaborates with second or later-generation General Partners, typically managing between €1–5 billion, based globally. These managers operate in core sectors such as consumer & luxury, healthcare, digital infrastructure, industrial technology, and sustainability.
                </p>
                <p className="text-lg font-light text-muted-foreground leading-relaxed mt-6">
                  We support them in accessing private wealth, family offices, and non-traditional Limited Partners across the UK, Central and Eastern Europe, and MENA — enabling strategic capital formation beyond traditional institutional channels.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What We Deliver */}
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
              From Strategy to <span className="text-accent">Investor Access.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card hover:shadow-smooth-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                      <item.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Differentiation */}
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
              Institutional Insight. <span className="text-accent">Boutique Execution.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-12">
                <p className="text-lg font-light text-muted-foreground leading-relaxed">
                  Aries76 combines deep private markets expertise with a modern, data-driven approach powered by AI-driven intelligence (AIRES). We act as an external extension of a GP's capital formation team, offering bespoke access to qualified investors and strategic partners across Europe and beyond.
                </p>
                <p className="text-lg font-light text-muted-foreground leading-relaxed mt-6">
                  Our model integrates fund positioning, investor targeting, and structured solutions — ensuring that established managers receive strategic support tailored to their specific fundraising objectives and geographic ambitions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Aries76 */}
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
              Why Choose <span className="text-accent">Aries76</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valueProps.map((item, index) => (
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

      {/* Call to Action */}
      <section className="py-24 px-6 md:px-10 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Explore a <span className="text-accent">Strategic Partnership.</span>
            </h2>
            <p className="text-xl font-light text-white/80 mb-10 max-w-2xl mx-auto">
              We invite fund managers to discuss upcoming fundraisings or co-investment strategies. Let's explore how Aries76 can support your capital formation objectives.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-light uppercase tracking-wider px-8"
              >
                Request an Introductory Call
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivateEquityFunds;
