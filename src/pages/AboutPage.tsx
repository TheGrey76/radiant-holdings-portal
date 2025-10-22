import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-aries-gray">
        <div className="container mx-auto px-6">
          <motion.h1 
            className="text-5xl md:text-6xl font-light uppercase tracking-wide text-aries-navy mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Aries76 Ltd
          </motion.h1>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
              Founded in London, Aries76 Ltd provides strategic and capital advisory across private markets. 
              We support General Partners, sponsors, and family-backed businesses in developing investor 
              relations and raising institutional capital across Europe and beyond.
            </p>
            
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
              With over two decades of international experience in private equity, venture capital and 
              structured finance, we combine market expertise with innovation, helping clients achieve 
              clarity and execution in complex transactions.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Regulatory Notice */}
      <section className="py-20 bg-aries-navy">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-1 bg-aries-copper mb-6" />
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              Our advisory activity is unregulated under UK law, allowing flexible and cross-border 
              engagement with regulated partners as required.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wide text-aries-navy mb-8">
              Leadership & Expertise
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              Our team brings together decades of experience in alternative investments, institutional fundraising, 
              and cross-border transactions. We maintain a selective client base, ensuring dedicated attention 
              to each engagement.
            </p>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
