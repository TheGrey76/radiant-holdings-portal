
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Contact = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-navy/10 text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Let's Discuss Your Capital Raising Needs
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            To explore collaboration, deal placement or fund advisory, reach out directly to our virtual assistant Quinley Martini.
          </motion.p>
        </div>
        
        <div className="flex justify-center">
          <motion.a 
            href="mailto:quinley.martini@aries76.com" 
            className="px-8 py-4 bg-aries-navy text-white rounded-md font-medium text-lg transition-all hover:bg-aries-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Write to Quinley Martini
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
