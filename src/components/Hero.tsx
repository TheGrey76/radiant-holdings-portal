
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#252b70" strokeWidth="2">
            <path className="circuit-line" d="M100,100 L300,100 L300,300 L500,300 L500,500 L700,500" />
            <path className="circuit-line" d="M200,200 L400,200 L400,400 L600,400 L600,600" />
            <path className="circuit-line" d="M100,300 L200,300 L200,500 L400,500 L400,700" />
            <path className="circuit-line" d="M300,100 L300,200 L500,200 L500,400 L700,400 L700,600" />
            <circle cx="100" cy="100" r="5" fill="#252b70" />
            <circle cx="300" cy="100" r="5" fill="#252b70" />
            <circle cx="300" cy="300" r="5" fill="#252b70" />
            <circle cx="500" cy="300" r="5" fill="#252b70" />
            <circle cx="500" cy="500" r="5" fill="#252b70" />
            <circle cx="700" cy="500" r="5" fill="#252b70" />
            <circle cx="200" cy="200" r="5" fill="#252b70" />
            <circle cx="400" cy="200" r="5" fill="#252b70" />
            <circle cx="400" cy="400" r="5" fill="#252b70" />
            <circle cx="600" cy="400" r="5" fill="#252b70" />
            <circle cx="600" cy="600" r="5" fill="#252b70" />
            <circle cx="100" cy="300" r="5" fill="#252b70" />
            <circle cx="200" cy="300" r="5" fill="#252b70" />
            <circle cx="200" cy="500" r="5" fill="#252b70" />
            <circle cx="400" cy="500" r="5" fill="#252b70" />
            <circle cx="400" cy="700" r="5" fill="#252b70" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-aries-navy mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-blue-orange">
              Strategic Capital Advisory meets AI-driven Execution
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Aries76 helps GPs, founders and advisors scale fundraising globally through bespoke solutions and intelligent automation.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a 
              href="mailto:quinley.martini@aries76.com" 
              className="px-8 py-3 bg-aries-navy text-white rounded-md font-medium text-lg transition-all hover:bg-aries-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Quinley Martini
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
            className="w-1.5 h-1.5 bg-aries-orange rounded-full mt-2"
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
