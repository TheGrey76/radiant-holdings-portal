
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-aries-navy text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img 
              src="/lovable-uploads/ba0e4dd6-4e22-4db9-9da2-6b3359300d31.png" 
              alt="Aries76 Logo" 
              className="h-16 mb-6 brightness-0 invert" 
            />
            <p className="text-white/70 font-light leading-relaxed">
              Strategic & Fund Advisory for Alternative Investments
            </p>
          </div>
          
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-6 font-light">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-aries-copper transition-colors font-light">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-aries-copper transition-colors font-light">About</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-aries-copper transition-colors font-light">Services</Link></li>
              <li><Link to="/legal" className="text-white/70 hover:text-aries-copper transition-colors font-light">Legal</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-aries-copper transition-colors font-light">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-6 font-light">Contact</h3>
            <p className="text-white/70 font-light mb-2">London, United Kingdom</p>
            <a href="mailto:segreteria@aries76.com" className="text-white/70 hover:text-aries-copper transition-colors font-light">
              segreteria@aries76.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-white/50 text-sm font-light">
            © {new Date().getFullYear()} Aries76 Ltd — All rights reserved. Aries76 Ltd is not authorised or regulated by the Financial Conduct Authority (FCA).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
