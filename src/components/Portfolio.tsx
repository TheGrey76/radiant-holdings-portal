
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const PortfolioItem = ({ title, description, icon, delay }: { title: string; description: string; icon: string; delay: number }) => {
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
        <span className="text-2xl text-aries-navy">{icon}</span>
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
            title="NeuralLogic Systems"
            description="Pioneering machine learning algorithms that enhance decision-making processes across financial services."
            icon="💡"
            delay={0.3}
          />
          <PortfolioItem 
            title="QuantumVision AI"
            description="Developing next-generation computer vision technology for autonomous systems and smart infrastructure."
            icon="🔍"
            delay={0.4}
          />
          <PortfolioItem 
            title="SynthLabs"
            description="Creating synthetic data solutions that accelerate AI development while maintaining privacy and compliance."
            icon="🧪"
            delay={0.5}
          />
          <PortfolioItem 
            title="CogniHealth"
            description="Using AI to revolutionize healthcare diagnostics and personalized treatment plans."
            icon="⚕️"
            delay={0.6}
          />
          <PortfolioItem 
            title="AgroIntelligence"
            description="Optimizing agricultural processes through predictive analytics and IoT integration."
            icon="🌱"
            delay={0.7}
          />
          <PortfolioItem 
            title="FinanceAI Solutions"
            description="Development of advanced AI solutions for financial analysis, risk management, and automated trading."
            icon="💹"
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
