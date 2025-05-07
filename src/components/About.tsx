
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutCard = ({ title, description, index }: { title: string; description: string; index: number }) => {
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
        <div className="w-10 h-10 bg-aries-navy/10 text-aries-navy flex items-center justify-center rounded-full font-display font-semibold">
          {index + 1}
        </div>
        <h3 className="text-xl font-semibold text-aries-navy ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const About = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  const values = [
    {
      title: "Innovation",
      description: "We foster environments where breakthrough ideas flourish and transform into market-defining technologies."
    },
    {
      title: "Integrity",
      description: "We uphold the highest standards of ethics in AI development, focusing on transparency and responsible deployment."
    },
    {
      title: "Impact",
      description: "We invest in solutions that create meaningful change across industries and improve lives globally."
    },
    {
      title: "Collaboration",
      description: "We believe the future of AI will be built through partnerships across disciplines, industries, and cultures."
    }
  ];
  
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
            A Vision-Driven Portfolio
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            At Aries76, we identify, nurture, and scale AI technologies that solve complex challenges and create enduring value.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-16">
          {values.map((value, index) => (
            <AboutCard 
              key={index}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-smooth p-8 md:p-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-aries-navy mb-6">Our Approach</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                We take a hands-on approach to investing, providing not just capital, but strategic guidance, technical expertise, and access to our global network of industry partners.
              </p>
              <p className="text-gray-600">
                Through our unique blend of operational experience and deep understanding of AI, we help promising companies navigate challenges and accelerate growth.
              </p>
              <div className="mt-8">
                <motion.a 
                  href="#contact" 
                  className="inline-flex items-center text-aries-navy font-medium hover:text-aries-blue transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Connect with our team
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
