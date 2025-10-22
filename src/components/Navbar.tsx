
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import aries76Logo from '@/assets/aries76-wordmark.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Legal', path: '/legal' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
        scrolled ? 'py-3 bg-white/95 backdrop-blur-sm shadow-sm' : 'py-4 bg-white/90 backdrop-blur-sm'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <img 
            src={aries76Logo} 
            alt="Aries76 Logo" 
            className="h-12 md:h-14" 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm uppercase tracking-wider text-aries-navy hover:text-aries-copper transition-colors font-light"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-aries-navy"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.nav
          className="md:hidden mt-4 pb-4 space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm uppercase tracking-wider text-aries-navy hover:text-aries-copper transition-colors font-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Navbar;
