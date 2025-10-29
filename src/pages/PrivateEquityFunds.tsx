import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, Globe2, Network, Brain, Shield, Zap, Flame, ArrowUp, ArrowRight, Minus } from 'lucide-react';
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

  const fundraisingSentiment = [
    {
      sector: 'Digital Infrastructure & AI Infrastructure',
      hype: 3,
      demand: 'High Growth',
      insight: 'Top-performing segment, combining technology scalability with real-asset stability. Strong crossover with data centers, edge computing, and AI infrastructure.'
    },
    {
      sector: 'Healthcare & Life Sciences',
      hype: 2,
      demand: 'Strong Growth',
      insight: 'Structural growth, defensive sector with high investor conviction in medtech, diagnostics, and specialty clinics.'
    },
    {
      sector: 'Sustainability & Energy Transition',
      hype: 2,
      demand: 'Strong Growth',
      insight: 'ESG-driven but increasingly quantitative; LPs focus on tangible climate metrics, circular economy, and clean industry plays.'
    },
    {
      sector: 'Industrial Technology & Automation',
      hype: 1,
      demand: 'Moderate Growth',
      insight: 'Re-emerging theme driven by nearshoring, robotics, and AI-assisted manufacturing efficiency.'
    },
    {
      sector: 'Consumer & Luxury',
      hype: 0,
      demand: 'Stable',
      insight: 'Selective rebound focused on scalable premium brands, digital distribution, and global lifestyle platforms.'
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

      {/* 2026 Fundraising Sentiment */}
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
              2026 Private Equity <span className="text-accent">Fundraising Sentiment</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              The current fundraising cycle is increasingly defined by sectoral resilience and investor conviction. While capital concentration favors established GPs, sector specialization and cross-over strategies are driving differentiated performance. The following overview captures the 2026 sentiment across the most active private equity verticals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <Card className="border-border/50 bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left p-6 font-light text-sm uppercase tracking-wider text-foreground">Sector</th>
                        <th className="text-center p-6 font-light text-sm uppercase tracking-wider text-foreground">Hype Level</th>
                        <th className="text-center p-6 font-light text-sm uppercase tracking-wider text-foreground">LP Demand Trend</th>
                        <th className="text-left p-6 font-light text-sm uppercase tracking-wider text-foreground">Strategic Insight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundraisingSentiment.map((item, index) => (
                        <tr 
                          key={index}
                          className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                          }`}
                        >
                          <td className="p-6 font-light text-foreground">{item.sector}</td>
                          <td className="p-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {item.hype === 3 && (
                                <>
                                  <Flame className="w-4 h-4 text-accent" />
                                  <Flame className="w-4 h-4 text-accent" />
                                  <Flame className="w-4 h-4 text-accent" />
                                </>
                              )}
                              {item.hype === 2 && (
                                <>
                                  <Flame className="w-4 h-4 text-accent" />
                                  <Flame className="w-4 h-4 text-accent" />
                                </>
                              )}
                              {item.hype === 1 && <Zap className="w-4 h-4 text-muted-foreground" />}
                              {item.hype === 0 && <Minus className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-light text-foreground">{item.demand}</span>
                              {item.demand === 'High Growth' && (
                                <>
                                  <ArrowUp className="w-3 h-3 text-accent" />
                                  <ArrowUp className="w-3 h-3 text-accent" />
                                  <ArrowUp className="w-3 h-3 text-accent" />
                                </>
                              )}
                              {item.demand === 'Strong Growth' && (
                                <>
                                  <ArrowUp className="w-3 h-3 text-accent" />
                                  <ArrowUp className="w-3 h-3 text-accent" />
                                </>
                              )}
                              {item.demand === 'Moderate Growth' && <ArrowUp className="w-3 h-3 text-muted-foreground" />}
                              {item.demand === 'Stable' && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                            </div>
                          </td>
                          <td className="p-6 font-light text-muted-foreground leading-relaxed">{item.insight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-muted/10 border-t border-border/30">
                  <p className="text-xs font-light text-muted-foreground italic text-center">
                    Data insights and sector sentiment are derived from Aries76's ongoing research and proprietary intelligence frameworks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
