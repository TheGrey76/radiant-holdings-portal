import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TrendingUp, Users, FileText, Handshake } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: TrendingUp,
      title: "Strategic Advisory",
      description: "Design and implementation of capital formation strategies, cross-border expansion plans and investor positioning."
    },
    {
      icon: Users,
      title: "Fund Advisory",
      description: "Support for fund managers in structuring and raising capital from institutional investors, family offices, and UHNWIs."
    },
    {
      icon: FileText,
      title: "Investor Relations",
      description: "Tailored communication and reporting strategies to build long-term investor confidence."
    },
    {
      icon: Handshake,
      title: "Deal Structuring",
      description: "Support for SPVs, club deals, and co-investment structures, ensuring alignment of interests and transparent execution."
    }
  ];

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
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 font-light max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Comprehensive advisory solutions for alternative investment professionals
          </motion.p>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <service.icon className="w-16 h-16 text-aries-copper" strokeWidth={1} />
                <div>
                  <h3 className="text-2xl md:text-3xl font-light uppercase tracking-wide text-aries-navy mb-4">
                    {service.title}
                  </h3>
                  <div className="w-12 h-0.5 bg-aries-copper mb-6" />
                  <p className="text-lg text-gray-600 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-aries-navy">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wide text-white mb-8">
              Ready to discuss your needs?
            </h2>
            <a 
              href="/contact"
              className="inline-block px-10 py-4 bg-aries-copper text-white uppercase tracking-wider font-light text-sm hover:bg-aries-copper/90 transition-all duration-300"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
