import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Database, Target, BarChart3, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AiresData = () => {
  const stats = [
    { value: '£500M+', label: 'Capital Raised' },
    { value: '200+', label: 'Institutional Investors' },
    { value: '15+', label: 'Countries Reached' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Driven Analytics',
      description: 'Proprietary algorithms analyze investor behavior, preferences, and historical patterns to optimize fundraising strategies.',
    },
    {
      icon: Target,
      title: 'Data-Based Investor Targeting',
      description: 'Precision matching using comprehensive investor databases and sentiment analysis to identify the most relevant capital partners.',
    },
    {
      icon: BarChart3,
      title: 'Institutional Innovation',
      description: 'Combining traditional advisory expertise with cutting-edge technology to deliver superior outcomes for emerging and established managers.',
    },
  ];

  const services = [
    {
      icon: Database,
      title: 'Fund Placement 2.0',
      description: 'Next-generation fund placement leveraging AI-powered investor profiling and sentiment analysis to dramatically improve GP-LP matching accuracy.',
      features: [
        'Predictive investor appetite modeling',
        'Automated deal-investor matching at scale',
        'Real-time market intelligence dashboards',
      ],
    },
    {
      icon: Globe,
      title: 'Fund Advisory',
      description: 'Strategic guidance across the complete fund lifecycle, from inception through close and beyond.',
      features: [
        'Fund structuring and positioning',
        'Marketing strategy development',
        'Investor relations optimization',
      ],
    },
    {
      icon: Users,
      title: 'LP Relations 3.0',
      description: 'AI-enhanced limited partner engagement and relationship management powered by behavioral analytics.',
      features: [
        'Sentiment tracking and analysis',
        'Automated stakeholder communications',
        'Portfolio performance dashboards',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920')] bg-cover bg-center opacity-10 z-0" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
          <motion.div
            className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI-Native Infrastructure
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            AI-native Fundraising
            <br />
            <span className="font-normal text-accent">Infrastructure</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-6 font-light max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Institutional-grade capital raising powered by artificial intelligence.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-white/70 mb-12 font-light max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Data-driven investor targeting for GPs, funds, and sponsors.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="https://airesdata.net" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Discover How We Reinvent Capital Raising
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="https://airesdata.net" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
                Book a Call
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-light text-accent mb-2">{stat.value}</div>
                <div className="text-white/70 font-light">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">
              About <span className="text-accent">Aires Data</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                UK-Based Advisory Excellence
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Aires Data is a premier UK-based advisory and data-driven fundraising company, supporting General Partners, fund managers, and sponsors in connecting with institutional investors worldwide.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our expertise spans <span className="text-accent font-medium">Private Equity</span>, <span className="text-accent font-medium">Venture Capital</span>, and <span className="text-accent font-medium">Alternative Investments</span>, delivering sophisticated solutions for complex capital raising challenges.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                    <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-light text-foreground mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920')] bg-cover bg-center opacity-5 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Our <span className="text-accent">Services</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Comprehensive capital raising solutions powered by AI and institutional expertise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-6">
                  <service.icon size={28} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">{service.title}</h3>
                <p className="text-white/70 leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start text-white/60">
                      <ArrowRight className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <a href="https://airesdata.net" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Learn More at airesdata.net
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AiresData;
