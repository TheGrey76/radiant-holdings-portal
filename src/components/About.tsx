
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  return (
    <section id="about" className="py-20 md:py-32 bg-aries-gray/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-navy/10 text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            About Aries76
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Capital Advisory for the Digital Age
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Aries76 Ltd is a London-based capital advisory firm that combines global investor access with the latest AI technologies to improve capital raising outcomes. We support fund managers, boutique advisors, and founders through every stage of the fundraising journey.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default About;
