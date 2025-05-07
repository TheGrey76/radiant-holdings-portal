
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, ChartBar, Handshake } from 'lucide-react';

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon,
  index 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  index: number 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div 
      ref={ref}
      className="bg-white rounded-xl shadow-smooth p-6 md:p-8 h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-aries-navy/10 text-aries-navy flex items-center justify-center rounded-full">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-aries-navy ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  const services = [
    {
      title: "AI-powered Fundraising Tools",
      description: "Leverage cutting-edge AI technology to enhance your fundraising process, from investor targeting to pitch optimization.",
      icon: Zap
    },
    {
      title: "Deal Sourcing & Investor Matching",
      description: "Connect with the right investors for your specific needs through our proprietary data-driven matching algorithms.",
      icon: ChartBar
    },
    {
      title: "Strategic Capital Structuring",
      description: "Optimize your capital structure with expert guidance tailored to your growth objectives and market conditions.",
      icon: Handshake
    }
  ];
  
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-navy/10 text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What We Offer
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comprehensive solutions to optimize your capital raising journey with AI-enhanced tools and expert guidance.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
