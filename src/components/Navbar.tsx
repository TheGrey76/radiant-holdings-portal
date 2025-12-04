import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

// Build timestamp for deployment verification - REMOVE AFTER TESTING
const BUILD_VERSION = "v2024120401";

const Navbar = () => {
  // Log version on mount to verify deployment
  useEffect(() => {
    console.log(`[Aries76 Navbar] Build: ${BUILD_VERSION}`);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
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

  const menuStructure = {
    about: [
      { name: 'Who We Are', path: '/about' },
      { name: 'Leadership Team', path: '/leadership-team' },
      { name: 'Our Clients', path: '/about' },
    ],
    advisory: [
      { name: 'Fund Placement', path: '/private-equity-funds' },
      { name: 'GP Capital Advisory', path: '/gp-capital-advisory' },
      { name: 'Family Office Advisory', path: '/family-office-advisory' },
      { name: 'Structured Products', path: '/structured-products' },
    ],
    insights: [
      { name: 'Articles & Analysis', path: '/blog' },
      { name: 'Case Studies', path: '/press' },
    ],
  };

  const mobileLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about', section: 'about' },
    { name: 'Who We Are', path: '/about', indent: true },
    { name: 'Leadership Team', path: '/leadership-team', indent: true },
    { name: 'Our Clients', path: '/about', indent: true },
    { name: 'Advisory Services', path: '#', section: 'advisory' },
    { name: 'Fund Placement', path: '/private-equity-funds', indent: true },
    { name: 'GP Capital Advisory', path: '/gp-capital-advisory', indent: true },
    { name: 'Family Office Advisory', path: '/family-office-advisory', indent: true },
    { name: 'Structured Products', path: '/structured-products', indent: true },
    { name: 'For LPs', path: '/for-limited-partners' },
    { name: 'Partnerships', path: '/strategic-partnerships' },
    { name: 'Insights', path: '#', section: 'insights' },
    { name: 'Articles & Analysis', path: '/blog', indent: true },
    { name: 'Case Studies', path: '/press', indent: true },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
        scrolled ? 'py-3 bg-white/98 backdrop-blur-md shadow-sm' : 'py-4 bg-white/95 backdrop-blur-md'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="text-3xl font-light tracking-wider text-foreground uppercase">
            ARIES<span className="text-accent">76</span>
          </span>
          <span className="text-[0.65rem] font-extralight tracking-[0.3em] text-accent uppercase -mt-0.5">
            Capital Intelligence
          </span>
        </Link>
        
        {/* Desktop Navigation - Custom Dropdowns */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Home */}
          <Link 
            to="/" 
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenMenu('about')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2">
              About
              <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'about' && (
              <div className="absolute top-full left-0 w-64 p-4 bg-background border border-border shadow-lg z-50">
                <ul>
                  {menuStructure.about.map((item) => (
                    <li key={item.path + item.name}>
                      <Link
                        to={item.path}
                        className="block px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Advisory Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenMenu('advisory')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2">
              Advisory Services
              <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'advisory' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'advisory' && (
              <div className="absolute top-full left-0 w-64 p-4 bg-background border border-border shadow-lg z-50">
                <ul>
                  {menuStructure.advisory.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* For LPs */}
          <Link 
            to="/for-limited-partners" 
            className="text-xs tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            FOR LP<span className="lowercase">s</span>
          </Link>

          {/* Partnerships */}
          <Link 
            to="/strategic-partnerships" 
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Partnerships
          </Link>

          {/* Insights Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenMenu('insights')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2">
              Insights
              <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'insights' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'insights' && (
              <div className="absolute top-full left-0 w-64 p-4 bg-background border border-border shadow-lg z-50">
                <ul>
                  {menuStructure.insights.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <Link 
            to="/contact" 
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Contact
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.nav
          className="lg:hidden mt-4 pb-4 space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {mobileLinks.map((link, index) => (
            <Link
              key={`${link.path}-${index}`}
              to={link.path === '#' ? '#' : link.path}
              className={`block text-xs uppercase tracking-widest transition-colors font-light ${
                link.section 
                  ? 'text-foreground font-normal pt-3' 
                  : link.indent 
                    ? 'text-foreground/60 hover:text-accent pl-4' 
                    : 'text-foreground/70 hover:text-accent'
              }`}
              onClick={(e) => {
                if (link.path === '#') {
                  e.preventDefault();
                } else {
                  setMobileMenuOpen(false);
                }
              }}
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
