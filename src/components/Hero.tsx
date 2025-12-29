import { motion } from 'framer-motion';
import { TrendingUp, Users, Database } from 'lucide-react';
import londonSkyline from '@/assets/london-skyline-1.jpg';
import londonBridge from '@/assets/london-bridge-2.jpg';
import londonBigBen from '@/assets/london-big-ben-3.jpg';

const services = [
  {
    icon: TrendingUp,
    title: 'Capital Formation & Investor Relations',
    description: 'We partner with GPs, sponsors, and entrepreneurs to structure and execute fundraising mandates across Europe, supporting capital raises from €10M to €100M+.'
  },
  {
    icon: Users,
    title: 'Family Office & LP Advisory',
    description: 'Tailored advisory for single and multi-family offices seeking curated access to private market opportunities with complete independence.'
  },
  {
    icon: Database,
    title: 'AI-Enabled Intelligence',
    description: 'Proprietary data infrastructure and AI-driven investor targeting through our AIRES platform, transforming capital formation in private markets.'
  }
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* London Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-white/80 z-10"></div>
        
        {/* Animated London images */}
        <motion.div 
          className="absolute -top-20 -left-20 w-60 h-40 rounded-2xl overflow-hidden opacity-10 animate-london-float-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 4, delay: 0.5 }}
        >
          <img 
            src={londonSkyline} 
            alt="London Skyline" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 -right-32 w-72 h-54 rounded-2xl overflow-hidden opacity-8 animate-london-float-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 4, delay: 1 }}
        >
          <img 
            src={londonBridge} 
            alt="London Bridge" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 -left-40 w-56 h-36 rounded-2xl overflow-hidden opacity-6 animate-london-float-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 4, delay: 1.5 }}
        >
          <img 
            src={londonBigBen} 
            alt="Big Ben London" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Background circuit pattern (reduced opacity) */}
      <div className="absolute inset-0 z-5 opacity-3">
        <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#252b70" strokeWidth="2">
            <path className="circuit-line" d="M100,100 L300,100 L300,300 L500,300 L500,500 L700,500" />
            <path className="circuit-line" d="M200,200 L400,200 L400,400 L600,400 L600,600" />
            <path className="circuit-line" d="M100,300 L200,300 L200,500 L400,500 L400,700" />
            <path className="circuit-line" d="M300,100 L300,200 L500,200 L500,400 L700,400 L700,600" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-aries-navy mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-blue-orange">
              AI Amplified
            </span>
          </motion.h1>

          <motion.p 
            className="text-sm md:text-base font-light tracking-wide text-gray-500 uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Capital Intelligence for Private Markets
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Aries76 Ltd is a London-based advisory firm supporting GPs, sponsors, and institutional investors in structuring and raising capital across private markets.
          </motion.p>

          {/* Services Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-12 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-accent/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-aries-navy mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.a 
              href="#portfolio" 
              className="px-8 py-3 bg-aries-navy text-white rounded-md font-medium text-lg transition-all hover:bg-aries-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Our Portfolio
            </motion.a>
            <motion.a 
              href="#contact" 
              className="px-8 py-3 bg-transparent border border-aries-navy text-aries-navy rounded-md font-medium text-lg transition-all hover:bg-aries-navy/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect With Us
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
        <div className="w-5 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"
            animate={{ 
              y: [0, 15, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
