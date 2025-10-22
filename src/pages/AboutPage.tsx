import { motion } from 'framer-motion';
import { Target, TrendingUp, Cpu } from 'lucide-react';

const AboutPage = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8 tracking-tight uppercase">
            A Global Advisory Firm
            <br />
            <span className="text-accent">with Local Precision</span>
          </h1>
          
          <div className="max-w-3xl">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">
              Founded by Edoardo Grigione, Aries76 Ltd combines over 25 years of experience across hedge funds, private equity, and venture capital.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              With a presence in London, we act as a strategic advisor to selected fund managers, family-backed businesses, and institutional investors.
            </p>
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
