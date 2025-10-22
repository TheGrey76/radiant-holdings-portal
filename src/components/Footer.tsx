import { Link } from 'react-router-dom';
import aries76Logo from '@/assets/aries76-wordmark.png';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img 
              src={aries76Logo} 
              alt="Aries76 Logo" 
              className="h-12 mb-6" 
            />
            <p className="text-white/70 font-light leading-relaxed text-sm">
              Building Bridges Between Capital and Opportunity
              <br />
              Strategic & Fund Advisory for Alternative Investments
            </p>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-accent transition-colors font-light text-sm">About</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Services</Link></li>
              <li><Link to="/partners" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Partners</Link></li>
              <li><Link to="/legal" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Licences</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-accent transition-colors font-light text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-widest mb-6 font-light">Contact</h3>
            <p className="text-white/70 font-light mb-2 text-sm">London | Budapest</p>
            <a href="mailto:info@aries76.com" className="text-white/70 hover:text-accent transition-colors font-light text-sm">
              info@aries76.com
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
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
