import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Legal = () => {
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
            Regulatory Information
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
              Aries76 Ltd is a company incorporated in England and Wales, registered under Company Number 12732961.
            </p>
            
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
              The firm operates as a non-regulated advisor under UK law, focusing exclusively on business-to-business 
              activities addressed to professional and institutional investors.
            </p>
            
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
              Aries76 does not provide investment advice to retail clients and does not carry out regulated activities 
              within the meaning of the Financial Services and Markets Act 2000 (FSMA).
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Information Box */}
      <section className="py-20 bg-aries-gray">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="border-l-4 border-aries-copper pl-8 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-light uppercase tracking-wide text-aries-navy mb-6">
              Company Details
            </h2>
            <p className="text-lg text-gray-700 font-light">
              <strong>Company Name:</strong> Aries76 Ltd
            </p>
            <p className="text-lg text-gray-700 font-light">
              <strong>Company Number:</strong> 12732961
            </p>
            <p className="text-lg text-gray-700 font-light">
              <strong>Registered Office:</strong> London, United Kingdom
            </p>
            <p className="text-lg text-gray-700 font-light">
              <strong>Email:</strong> <a href="mailto:segreteria@aries76.com" className="text-aries-copper hover:underline">segreteria@aries76.com</a>
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Disclaimer */}
      <section className="py-16 bg-aries-navy">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.p 
            className="text-sm text-white/70 font-light text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Aries76 Ltd is not authorised or regulated by the Financial Conduct Authority (FCA). 
            This website does not constitute an offer or solicitation to retail investors.
          </motion.p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Legal;
