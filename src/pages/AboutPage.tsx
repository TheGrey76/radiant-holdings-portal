import { motion } from 'framer-motion';
import { Target, TrendingUp, Cpu } from 'lucide-react';
import edoardoImage from '@/assets/edoardo-grigione.jpg';

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
      <div className="max-w-4xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 uppercase tracking-tight">
            Edoardo Grigione
          </h1>
          <p className="text-xl text-accent mb-8 font-light uppercase tracking-wider">
            Founder & Principal Advisor
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <img 
              src={edoardoImage} 
              alt="Edoardo Grigione - Founder of Aries76"
              className="w-64 h-auto rounded-lg shadow-lg"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 max-w-3xl"
          >
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              With over 25 years of experience across hedge funds, private equity, and alternative investments, Edoardo founded Aries76 Ltd to provide strategic advisory services to select institutional investors and fund managers.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Based in London, Aries76 combines global market expertise with local precision, acting as a trusted advisor to family-backed businesses and institutional investors seeking strategic capital formation and market intelligence.
            </p>
          </motion.div>
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
