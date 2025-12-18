import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HolidaySplashProps {
  onComplete: () => void;
}

const HolidaySplash = ({ onComplete }: HolidaySplashProps) => {
  const [showTeam, setShowTeam] = useState(false);
  
  const teamMembers = ['Edoardo', 'Alessandro', 'Julio', 'Quinley'];

  useEffect(() => {
    const teamTimer = setTimeout(() => setShowTeam(true), 1200);
    const completeTimer = setTimeout(() => onComplete(), 4500);
    
    return () => {
      clearTimeout(teamTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2332] via-[#0f1419] to-[#1a2332] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Snowflakes background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30"
            style={{ 
              left: `${Math.random() * 100}%`, 
              fontSize: `${10 + Math.random() * 20}px`,
              top: -20
            }}
            animate={{ 
              y: '100vh',
              rotate: 360,
              opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>

      {/* Christmas Tree Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="mb-6"
      >
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 5 L60 35 H48 L68 60 H52 L75 90 H5 L28 60 H12 L32 35 H20 Z" fill="#2d5a3d"/>
          <path d="M40 0 L43 8 L52 8 L45 13 L48 22 L40 16 L32 22 L35 13 L28 8 L37 8 Z" fill="#ffd700"/>
          <rect x="35" y="90" width="10" height="10" fill="#8B4513"/>
          <circle cx="30" cy="45" r="4" fill="#ff4444">
            <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="50" cy="40" r="4" fill="#ffd700">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="35" cy="60" r="4" fill="#44aaff">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="55" cy="55" r="4" fill="#ff69b4">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="25" cy="70" r="4" fill="#ffd700">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="58" cy="72" r="4" fill="#ff4444">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="40" cy="75" r="4" fill="#44ff44">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.3s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </motion.div>

      {/* Happy Holidays Text */}
      <motion.h1
        className="text-4xl md:text-6xl font-light text-white mb-2 tracking-wide"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Happy Holidays
      </motion.h1>

      {/* From Team Aries76 */}
      <motion.p
        className="text-lg md:text-xl text-white/70 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        from Team <span className="text-[#c9a55c] font-medium">ARIES76</span>
      </motion.p>

      {/* Team Members */}
      <AnimatePresence>
        {showTeam && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {teamMembers.map((name, index) => (
              <motion.span
                key={name}
                className="text-white/90 text-lg md:text-xl font-light"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.15,
                  type: 'spring',
                  bounce: 0.4
                }}
              >
                {name}
                {index < teamMembers.length - 1 && (
                  <span className="text-[#c9a55c] ml-4 md:ml-8">•</span>
                )}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative line */}
      <motion.div
        className="absolute bottom-20 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#c9a55c] to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      />
    </motion.div>
  );
};

export default HolidaySplash;
