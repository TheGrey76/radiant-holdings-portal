import { motion } from 'framer-motion';
import { Target, TrendingUp, Cpu, Award, Users, BarChart3 } from 'lucide-react';

const AboutPage = () => {
  const metrics = [
    {
      icon: Award,
      value: '25+',
      label: 'Years Combined Experience'
    },
    {
      icon: Users,
      value: '$2B+',
      label: 'Capital Raised'
    },
    {
      icon: BarChart3,
      value: '40+',
      label: 'Successful Transactions'
    }
  ];

  const approaches = [
    {
      icon: Target,
      title: 'Strategic Advisory',
      description: 'Structuring and positioning investment opportunities.'
    },
    {
      icon: TrendingUp,
      title: 'Capital Formation',
      description: 'Targeted investor relations and institutional fundraising.'
    },
    {
      icon: Cpu,
      title: 'Innovation',
      description: 'Integrating AI-driven analytics to enhance investor targeting and market intelligence.'
    }
  ];

  const caseStudies = [
    {
      title: 'European Real Estate Fund',
      description: 'Structured and positioned a €150M real estate fund, achieving full subscription within 6 months.',
      impact: '150M+ raised'
    },
    {
      title: 'Tech-Enabled Investment Platform',
      description: 'Advised on capital formation strategy for innovative fintech platform, connecting institutional investors with alternative assets.',
      impact: '30+ investors onboarded'
    },
    {
      title: 'Family Office Portfolio Optimization',
      description: 'Delivered comprehensive market intelligence and strategic positioning for multi-generational family office.',
      impact: '25% portfolio growth'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6 uppercase tracking-tight">
            Proven Results
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
            Delivering strategic advisory excellence to institutional investors and fund managers across alternative investments.
          </p>
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-32"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center p-8 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors duration-300"
            >
              <metric.icon className="h-10 w-10 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <div className="text-4xl font-light text-foreground mb-2">{metric.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Case Studies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-32"
        >
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 uppercase tracking-wider text-center">
            Select Engagements
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-lg border border-border hover:border-accent/50 transition-colors duration-300"
              >
                <h3 className="text-lg font-normal text-foreground mb-3 uppercase tracking-wide">
                  {study.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  {study.description}
                </p>
                <div className="text-accent font-light uppercase text-sm tracking-wider">
                  {study.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 uppercase tracking-wider">
            Our Approach
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {approaches.map((approach, index) => (
              <motion.div
                key={approach.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div className="mb-6 inline-block p-4 rounded-lg bg-secondary/50 group-hover:bg-accent/10 transition-colors duration-300">
                  <approach.icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-normal text-foreground mb-3 uppercase tracking-wide">
                  {approach.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {approach.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
