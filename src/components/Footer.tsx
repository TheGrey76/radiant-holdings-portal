import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6 animate-fade-in">
              <div className="text-2xl sm:text-2xl md:text-3xl font-light tracking-wider text-white uppercase">
                ARIES<span className="text-accent">76</span>
              </div>
              <div className="text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] font-extralight tracking-[0.25em] sm:tracking-[0.28em] md:tracking-[0.3em] text-accent uppercase -mt-0.5">
                Capital Intelligence
              </div>
            </div>
            <a 
              href="https://www.linkedin.com/company/109761476/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors mb-6"
            >
              <Linkedin size={20} />
            </a>
            <p className="text-white/70 font-light leading-relaxed text-sm">
              Building Bridges Between Capital and Opportunity
              <br />
              Strategic & Fund Advisory for Alternative Investments
            </p>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light">About</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Who We Are</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Leadership</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Our Clients</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light">Advisory Services</h3>
            <ul className="space-y-3">
              <li><Link to="/private-equity-funds" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Fund Placement</Link></li>
              <li><Link to="/gp-capital-advisory" className="text-white/70 hover:text-accent transition-colors font-light text-sm">GP Capital Advisory</Link></li>
              <li><Link to="/structured-products" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Structured Products</Link></li>
              <li><Link to="/for-limited-partners" className="text-white/70 hover:text-accent transition-colors font-light text-sm">For Limited Partners</Link></li>
            </ul>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light mt-8">Insights</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Articles & Analysis</Link></li>
              <li><Link to="/press" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Case Studies</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light">Contact</h3>
            <p className="text-white/70 font-light mb-2 text-sm">27 Old Gloucester Street, London, United Kingdom, WC1N 3AX</p>
            <a href="mailto:quinley.martini@aries76.com" className="text-white/70 hover:text-accent transition-colors font-light text-sm">
              quinley.martini@aries76.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-white/50 text-xs font-light leading-relaxed">
            © {new Date().getFullYear()} Aries76 Ltd — All rights reserved.
            <br className="md:hidden" />
            <span className="hidden md:inline"> | </span>
            Aries76 Ltd is registered in England and Wales.
            <br className="md:hidden" />
            <span className="hidden md:inline"> | </span>
            The company does not conduct any regulated investment activity as defined by the UK Financial Services and Markets Act 2000.
            <br />
            <Link to="/legal" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <button 
              onClick={() => window.dispatchEvent(new Event('reopenCookieSettings'))}
              className="hover:text-accent transition-colors"
            >
              Cookie Settings
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
