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

      {/* Christmas Tree */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="mb-6"
      >
        <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tree shadow */}
          <ellipse cx="60" cy="142" rx="35" ry="6" fill="#000" opacity="0.2"/>
          
          {/* Tree trunk */}
          <rect x="50" y="125" width="20" height="18" fill="#5D3A1A"/>
          <rect x="52" y="125" width="4" height="18" fill="#7D4A2A"/>
          
          {/* Tree layers - bottom to top with gradients */}
          <path d="M60 15 L85 50 H72 L95 80 H78 L105 115 H15 L42 80 H25 L48 50 H35 Z" fill="url(#treeGradient)"/>
          <path d="M60 15 L85 50 H72 L95 80 H78 L105 115 H60 V15" fill="#1a4a2e" opacity="0.3"/>
          
          {/* Snow on branches */}
          <path d="M35 50 Q42 45 48 50" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M72 50 Q78 45 85 50" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M25 80 Q35 73 48 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M72 80 Q85 73 95 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M15 115 Q30 105 42 115" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M78 115 Q90 105 105 115" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
          
          {/* Star on top */}
          <path d="M60 2 L63 12 L74 12 L65 19 L68 30 L60 23 L52 30 L55 19 L46 12 L57 12 Z" fill="#ffd700">
            <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite"/>
          </path>
          <path d="M60 5 L62 11 L68 11 L63 15 L65 21 L60 17 L55 21 L57 15 L52 11 L58 11 Z" fill="#fff5cc"/>
          
          {/* Garland/Tinsel */}
          <path d="M38 55 Q50 62 62 55 Q74 48 82 58" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M30 85 Q45 92 60 85 Q75 78 90 88" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
          </path>
          
          {/* Ornaments - more and varied */}
          <circle cx="45" cy="45" r="5" fill="#ff3333">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="75" cy="48" r="5" fill="#3399ff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="38" cy="70" r="6" fill="#ff69b4">
            <animate attributeName="opacity" values="1;0.5;1" dur="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="60" cy="65" r="5" fill="#ffd700">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="82" cy="72" r="5" fill="#44ff44">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="30" cy="100" r="6" fill="#ff3333">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="55" cy="95" r="5" fill="#9966ff">
            <animate attributeName="opacity" values="1;0.5;1" dur="1.3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="75" cy="98" r="6" fill="#3399ff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="90" cy="105" r="5" fill="#ffd700">
            <animate attributeName="opacity" values="1;0.5;1" dur="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="45" cy="110" r="5" fill="#44ff44">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Ornament shine effects */}
          <circle cx="43" cy="43" r="1.5" fill="white" opacity="0.7"/>
          <circle cx="73" cy="46" r="1.5" fill="white" opacity="0.7"/>
          <circle cx="36" cy="68" r="1.5" fill="white" opacity="0.7"/>
          <circle cx="58" cy="63" r="1.5" fill="white" opacity="0.7"/>
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2d5a3d"/>
              <stop offset="50%" stopColor="#1e4a2e"/>
              <stop offset="100%" stopColor="#143d22"/>
            </linearGradient>
          </defs>
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
