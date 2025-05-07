
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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

  // Improved navigation function with smooth scrolling
  const handleNavigation = (path: string) => {
    // Always close mobile menu when navigating
    setMobileMenuOpen(false);
    
    console.log("Navigation requested to:", path);
    
    if (path.includes('#')) {
      // Extract the route and anchor parts
      const [route, anchor] = path.split('#');
      
      // Determine if we need to navigate to a new page first
      const targetRoute = route ? `/${route}` : '/';
      const needsRouteChange = location.pathname !== targetRoute;
      
      // If we need to change route, do that first
      if (needsRouteChange) {
        console.log(`Changing route from ${location.pathname} to ${targetRoute}`);
        navigate(targetRoute);
        
        // After navigation, scroll to the anchor
        setTimeout(() => {
          console.log(`Trying to scroll to #${anchor} after navigation`);
          const targetElement = document.getElementById(anchor);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.error(`Element with id '${anchor}' not found after navigation`);
          }
        }, 800); // Longer timeout to ensure the page has fully loaded
      } else {
        // We're already on the correct route, just scroll to the anchor
        console.log(`Already on correct route, scrolling to #${anchor}`);
        const targetElement = document.getElementById(anchor);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error(`Element with id '${anchor}' not found`);
        }
      }
    } else {
      // For regular routes without anchors
      console.log(`Navigating to route: ${path}`);
      navigate(path);
    }
  };

  // Direct email function for contact button
  const handleContact = () => {
    window.location.href = "mailto:quinley.martini@aries76.com";
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
          <button 
            onClick={() => handleNavigation('/')} 
            className="focus:outline-none"
            aria-label="Go to homepage"
          >
            <img 
              src="/lovable-uploads/3fb70498-7bc0-4d2c-aa59-d7605f5f5319.png" 
              alt="Aries76 Logo" 
              className="h-48 md:h-52" 
            />
          </button>
        </motion.div>
        
        <nav className={`hidden md:flex items-center space-x-8`}>
          <button 
            onClick={() => handleNavigation('/#services')} 
            className="nav-link font-medium text-aries-navy hover:text-aries-blue transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => handleNavigation('/#about')} 
            className="nav-link font-medium text-aries-navy hover:text-aries-blue transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => handleNavigation('/#clients')} 
            className="nav-link font-medium text-aries-navy hover:text-aries-blue transition-colors"
          >
            Clients
          </button>
          <button 
            onClick={() => handleNavigation('/#contact')} 
            className="nav-link font-medium text-aries-navy hover:text-aries-blue transition-colors"
          >
            Contact
          </button>
          
          <motion.button 
            className="px-5 py-2 bg-aries-navy text-white rounded-md font-medium transition-all hover:bg-aries-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContact}
          >
            Contact Quinley Martini
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
              onClick={() => handleNavigation('/#services')} 
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigation('/#about')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('/#clients')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Clients
            </button>
            <button 
              onClick={() => handleNavigation('/#contact')}
              className="py-2 text-aries-navy hover:text-aries-blue text-left"
            >
              Contact
            </button>
            <button 
              onClick={handleContact}
              className="mt-2 py-2 w-full bg-aries-navy text-white rounded-md font-medium"
            >
              Contact Quinley Martini
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
