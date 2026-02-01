import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  
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

  const handleNavigation = (path: string) => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    
    // Handle hash navigation
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      const currentPath = window.location.pathname;
      
      if (currentPath === basePath || basePath === '') {
        // Same page - scroll directly to element
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Different page - navigate first, then scroll
        navigate(path);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    } else {
      navigate(path);
    }
  };

  const menuStructure = {
    about: [
      { name: 'Who We Are', path: '/about' },
      { name: 'Leadership Team', path: '/leadership-team' },
    ],
    forGPs: [
      { name: 'GP Services Overview', path: '/gp-capital-advisory' },
      { name: 'Deal Sourcing', path: '/gp-capital-advisory#deal-sourcing' },
      { name: 'Portfolio Value Creation', path: '/gp-capital-advisory#portfolio-support' },
      { name: 'Market Intelligence', path: '/gp-capital-advisory#market-intelligence' },
      { name: 'Fund Placement', path: '/private-equity-funds' },
    ],
    forLPs: [
      { name: 'LP Services Overview', path: '/for-limited-partners' },
      { name: 'Fund Selection & Due Diligence', path: '/for-limited-partners#fund-selection' },
      { name: 'Portfolio Management', path: '/for-limited-partners#portfolio-management' },
      { name: 'Strategic Advisory', path: '/for-limited-partners#strategic-advisory' },
    ],
    insights: [
      { name: 'Articles & Analysis', path: '/blog' },
      { name: 'Case Studies', path: '/press' },
      { name: 'Bitcoin Research', path: '/bitcoin-research' },
      { name: 'Portfolio Analysis', path: '/portfolio-analysis' },
    ],
  };

  const mobileLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '#', section: 'about' },
    { name: 'Who We Are', path: '/about', indent: true },
    { name: 'Leadership Team', path: '/leadership-team', indent: true },
    { name: 'For GPs', path: '#', section: 'forGPs' },
    { name: 'GP Services Overview', path: '/gp-capital-advisory', indent: true },
    { name: 'Deal Sourcing', path: '/gp-capital-advisory#deal-sourcing', indent: true },
    { name: 'Portfolio Value Creation', path: '/gp-capital-advisory#portfolio-support', indent: true },
    { name: 'Market Intelligence', path: '/gp-capital-advisory#market-intelligence', indent: true },
    { name: 'Fund Placement', path: '/private-equity-funds', indent: true },
    { name: 'For LPs', path: '#', section: 'forLPs' },
    { name: 'LP Services Overview', path: '/for-limited-partners', indent: true },
    { name: 'Fund Selection & Due Diligence', path: '/for-limited-partners#fund-selection', indent: true },
    { name: 'Portfolio Management', path: '/for-limited-partners#portfolio-management', indent: true },
    { name: 'Strategic Advisory', path: '/for-limited-partners#strategic-advisory', indent: true },
    { name: 'Partnerships', path: '/strategic-partnerships' },
    { name: 'Insights', path: '#', section: 'insights' },
    { name: 'Articles & Analysis', path: '/blog', indent: true },
    { name: 'Case Studies', path: '/press', indent: true },
    { name: 'Bitcoin Research', path: '/bitcoin-research', indent: true },
    { name: 'Portfolio Analysis', path: '/portfolio-analysis', indent: true },
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
        <button onClick={() => handleNavigation('/')} className="flex flex-col text-left">
          <span className="text-3xl font-light tracking-wider text-foreground uppercase">
            ARIES<span className="text-accent">76</span>
          </span>
          <span className="text-[0.65rem] font-extralight tracking-[0.3em] text-accent uppercase -mt-0.5">
            Capital Intelligence
          </span>
        </button>
        
        {/* Desktop Navigation - Custom Dropdowns */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Home */}
          <button 
            onClick={() => handleNavigation('/')}
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Home
          </button>

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
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* For GPs Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenMenu('forGPs')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2">
              For GPs
              <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'forGPs' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'forGPs' && (
              <div className="absolute top-full left-0 w-72 p-4 bg-background border border-border shadow-lg z-50">
                <div className="mb-3 pb-3 border-b border-border">
                  <p className="text-xs text-accent uppercase tracking-wider font-medium px-4">Services for Fund Managers</p>
                </div>
                <ul>
                  {menuStructure.forGPs.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* For LPs Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenMenu('forLPs')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2">
              For LPs
              <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'forLPs' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'forLPs' && (
              <div className="absolute top-full left-0 w-72 p-4 bg-background border border-border shadow-lg z-50">
                <div className="mb-3 pb-3 border-b border-border">
                  <p className="text-xs text-accent uppercase tracking-wider font-medium px-4">Services for Limited Partners</p>
                </div>
                <ul>
                  {menuStructure.forLPs.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Partnerships */}
          <button 
            onClick={() => handleNavigation('/strategic-partnerships')}
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Partnerships
          </button>

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
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left px-4 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted/50 transition-colors rounded font-light"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <button 
            onClick={() => handleNavigation('/contact')}
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors font-light px-4 py-2"
          >
            Contact
          </button>
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
            <button
              key={`${link.path}-${index}`}
              onClick={() => {
                if (link.path !== '#') {
                  handleNavigation(link.path);
                }
              }}
              className={`block w-full text-left text-xs uppercase tracking-widest transition-colors font-light ${
                link.section 
                  ? 'text-foreground font-normal pt-3 cursor-default' 
                  : link.indent 
                    ? 'text-foreground/60 hover:text-accent pl-4' 
                    : 'text-foreground/70 hover:text-accent'
              }`}
            >
              {link.name}
            </button>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Navbar;
