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
      <div className="max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-16 tracking-tight uppercase">
            About <span className="text-accent">Aries76</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center md:justify-start"
            >
              <img 
                src={edoardoImage} 
                alt="Edoardo Grigione - Founder of Aries76"
                className="w-48 h-auto rounded-lg shadow-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 uppercase tracking-wide">
                Edoardo Grigione
              </h2>
              <p className="text-xl text-accent mb-6 font-light">Founder & Principal Advisor</p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
                With over 25 years of experience across hedge funds, private equity, and alternative investments, Edoardo founded Aries76 Ltd to provide strategic advisory services to select institutional investors and fund managers.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Based in London, Aries76 combines global market expertise with local precision, acting as a trusted advisor to family-backed businesses and institutional investors seeking strategic capital formation and market intelligence.
              </p>
            </motion.div>
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
