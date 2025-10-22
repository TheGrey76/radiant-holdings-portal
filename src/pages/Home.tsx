import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Globe, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-aries-navy">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-aries-navy via-aries-navy to-aries-copper/20" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white uppercase tracking-wide mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Strategic & Fund Advisory<br />
            <span className="text-aries-copper">for Alternative Investments</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 font-light max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Independent advisory firm supporting GPs, family-backed businesses and institutional investors 
            in structuring, fundraising and cross-border growth.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/services"
              className="inline-block px-10 py-4 bg-aries-copper text-white uppercase tracking-wider font-light text-sm hover:bg-aries-copper/90 transition-all duration-300"
            >
              Discover Our Services
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Three Service Boxes */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/services" className="block">
                <div className="border border-aries-navy/10 p-10 hover:border-aries-copper transition-all duration-300 h-full">
                  <TrendingUp className="w-12 h-12 text-aries-copper mb-6" strokeWidth={1} />
                  <h3 className="text-2xl font-light uppercase tracking-wide text-aries-navy mb-4">
                    Strategic Advisory
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Comprehensive guidance on capital formation, market positioning, and cross-border expansion strategies.
                  </p>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/services" className="block">
                <div className="border border-aries-navy/10 p-10 hover:border-aries-copper transition-all duration-300 h-full">
                  <Building2 className="w-12 h-12 text-aries-copper mb-6" strokeWidth={1} />
                  <h3 className="text-2xl font-light uppercase tracking-wide text-aries-navy mb-4">
                    Fundraising & Capital Solutions
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Support for fund managers in raising institutional capital from qualified investors worldwide.
                  </p>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/about" className="block">
                <div className="border border-aries-navy/10 p-10 hover:border-aries-copper transition-all duration-300 h-full">
                  <Globe className="w-12 h-12 text-aries-copper mb-6" strokeWidth={1} />
                  <h3 className="text-2xl font-light uppercase tracking-wide text-aries-navy mb-4">
                    Cross-Border Structuring
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Expert guidance on international deal structures, regulatory compliance, and multi-jurisdictional operations.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
