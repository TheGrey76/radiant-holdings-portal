
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle navigation for anchor links and regular routes
  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    
    if (path.includes('#')) {
      const [route, anchor] = path.split('#');
      
      // If we're already on the correct route, just scroll to the anchor
      if (location.pathname === '/' + (route || '')) {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to the route first, then scroll to anchor after page loads
        navigate(route ? `/${route}` : '/');
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } else {
      // For non-anchor links, just navigate
      navigate(path);
    }
  };

  const handleGetInTouch = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/#contact');
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
        scrolled ? 'py-3 bg-white/90 backdrop-blur-sm shadow-smooth' : 'py-6'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Link to="/" onClick={() => handleNavigation('/')}>
            <img 
              src="/lovable-uploads/3fb70498-7bc0-4d2c-aa59-d7605f5f5319.png" 
              alt="Aries76 Logo" 
              className="h-48 md:h-52" 
            />
          </Link>
        </motion.div>
        
        <nav className={`hidden md:flex items-center space-x-8`}>
          <button onClick={() => handleNavigation('/#portfolio')} className="nav-link">Portfolio</button>
          <button onClick={() => handleNavigation('/#about')} className="nav-link">About</button>
          <button onClick={() => handleNavigation('/#contact')} className="nav-link">Contact</button>
          <button onClick={() => handleNavigation('/network')} className="nav-link">Network</button>
          <button onClick={() => handleNavigation('/profile')} className="nav-link flex items-center gap-2">
            <User size={18} />
            <span>Profile</span>
          </button>
          
          <motion.button 
            className="px-5 py-2 bg-aries-navy text-white rounded-md font-medium transition-all hover:bg-aries-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetInTouch}
          >
            Get in Touch
          </motion.button>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden text-aries-navy"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg py-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col space-y-4 px-6">
            <button 
              onClick={() => handleNavigation('/#portfolio')} 
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Portfolio
            </button>
            <button 
              onClick={() => handleNavigation('/#about')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('/#contact')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Contact
            </button>
            <button 
              onClick={() => handleNavigation('/network')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Network
            </button>
            <button 
              onClick={() => handleNavigation('/profile')}
              className="py-2 flex items-center gap-2 text-aries-navy hover:text-aries-blue text-left"
            >
              <User size={18} />
              <span>Profile</span>
            </button>
            <button 
              onClick={handleGetInTouch}
              className="mt-2 py-2 w-full bg-aries-navy text-white rounded-md font-medium"
            >
              Get in Touch
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
