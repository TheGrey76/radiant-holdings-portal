
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ClientCard = ({ title, description, index }: { title: string; description: string; index: number }) => {
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
      <h3 className="text-xl font-semibold text-aries-navy mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const ClientTypes = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  const clients = [
    {
      title: "GPs & Emerging Managers",
      description: "We help fund managers streamline their fundraising process, connect with qualified investors, and optimize their capital raising strategy."
    },
    {
      title: "M&A Advisors and Boutique Firms",
      description: "Our solutions amplify the reach and effectiveness of advisory firms, providing advanced tools for deal distribution and investor engagement."
    },
    {
      title: "Startup Founders in high-growth sectors",
      description: "We support founders with strategic guidance and investor access to secure the right funding for their growth stage and business model."
    }
  ];
  
  return (
    <section id="clients" className="py-20 md:py-32 bg-aries-gray/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-navy/10 text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Our Clients
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            For Whom
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We tailor our approach to meet the unique needs of different clients across the capital raising ecosystem.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {clients.map((client, index) => (
            <ClientCard 
              key={index}
              title={client.title}
              description={client.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTypes;
