
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, BrainCircuit, Database, Stethoscope, LineChart, Coins, TrendingUp, Globe, Bitcoin } from 'lucide-react';

const PortfolioItem = ({ title, description, icon: Icon, delay }: { title: string; description: string; icon: any; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div 
      ref={ref}
      className="bg-white rounded-xl shadow-smooth p-6 transition-all duration-300 hover:shadow-smooth-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
    >
      <div className="w-12 h-12 bg-aries-gray rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-aries-navy" />
      </div>
      <h3 className="text-xl font-semibold text-aries-navy mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Portfolio = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  return (
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-gray text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Our Portfolio
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Innovating Across Industries
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our diverse portfolio spans cutting-edge AI companies transforming how businesses operate and innovate.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PortfolioItem 
            title="CogniHealth"
            description="Using AI to revolutionize healthcare diagnostics and personalized treatment plans."
            icon={Stethoscope}
            delay={0.3}
          />
          <PortfolioItem 
            title="Bitcoin"
            description="Strategic investment in the world's first and largest cryptocurrency, providing a decentralized store of value."
            icon={Bitcoin}
            delay={0.4}
          />
          <PortfolioItem 
            title="FinanceAI Solutions"
            description="Development of advanced AI solutions for financial analysis, risk management, and automated trading."
            icon={LineChart}
            delay={0.5}
          />
          <PortfolioItem 
            title="Kraken (Pre-IPO)"
            description="Strategic investment in one of the world's largest cryptocurrency exchanges, offering secure digital asset trading solutions."
            icon={Coins}
            delay={0.6}
          />
          <PortfolioItem 
            title="Upgrade Inc (Pre-IPO)"
            description="Early-stage investment in this fintech innovator providing credit and banking services with a focus on financial health."
            icon={TrendingUp}
            delay={0.7}
          />
          <PortfolioItem 
            title="AiresData.net"
            description="A pioneering data analytics platform leveraging AI to transform raw data into actionable business intelligence."
            icon={Globe}
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
