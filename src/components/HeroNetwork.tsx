import { useEffect, useState, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Globe, Cpu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import NetworkParticles from './NetworkParticles';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

const stats = [
  { icon: TrendingUp, value: 500, suffix: 'M+', prefix: '€', label: 'Capital Advised' },
  { icon: Users, value: 25, suffix: '+', label: 'Years Experience' },
  { icon: Globe, value: 15, suffix: '+', label: 'European Markets' },
  { icon: Cpu, value: 100, suffix: '%', label: 'AI-Enabled' },
];

const serviceLinks = [
  { label: 'Fund Placement', path: '/private-equity-funds' },
  { label: 'GP Capital Advisory', path: '/gp-capital-advisory' },
  { label: 'Structured Products', path: '/structured-products' },
  { label: 'For Limited Partners', path: '/for-limited-partners' },
];

export default function HeroNetwork() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceClick = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      {/* 3D Network Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0f1729]" />}>
        <NetworkParticles />
      </Suspense>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-transparent to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1729]/50 via-transparent to-transparent z-[1]" />
      
      {/* Radial Glow - using accent orange */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] z-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Capital Intelligence Company
          </span>
        </motion.div>

        {/* Main Headline - Cinematic Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight"
        >
          <span className="block">Connecting</span>
          <span className="block mt-2 text-accent font-normal">
            Capital & Vision
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          AI-amplified capital formation and investor intelligence 
          for the European private markets ecosystem
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-6 text-base group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Explore Services
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a2744] border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-[240px]"
                >
                  {serviceLinks.map((service, index) => (
                    <button
                      key={service.path}
                      onClick={() => handleServiceClick(service.path)}
                      className="w-full text-left px-5 py-3.5 text-white/80 hover:text-white hover:bg-accent/20 transition-colors text-sm font-medium flex items-center gap-3 group"
                    >
                      <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {service.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-6 text-base backdrop-blur-sm"
          >
            <Link to="/contact">
              Connect With Us
            </Link>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
            >
              <stat.icon className="w-6 h-6 text-accent mb-3 mx-auto" />
              <div className="text-3xl md:text-4xl font-light text-white mb-1">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix} 
                  prefix={stat.prefix} 
                />
              </div>
              <div className="text-sm text-white/50 font-medium tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
