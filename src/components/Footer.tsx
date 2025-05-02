
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-aries-navy text-white py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-300 mb-6 max-w-md">
              Aries76 identifies, invests in, and scales transformative AI technologies that solve complex challenges and create enduring value across industries.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors tracking-tighter">Portfolio</a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors tracking-tighter">About</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors tracking-tighter">Contact</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors tracking-tighter">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors tracking-tighter">News</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-300 tracking-tighter">
              <li>
                27, Old Gloucester Street
              </li>
              <li>
                London, WC1N 3AX
              </li>
              <li>
                United Kingdom
              </li>
              <li className="pt-2">
                <a href="mailto:quinley.martini@aries76.com" className="text-gray-300 hover:text-white transition-colors tracking-tighter">quinley.martini@aries76.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0 tracking-tighter">
            © {currentYear} Aries76. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors tracking-tighter">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors tracking-tighter">Terms of Service</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors tracking-tighter">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
