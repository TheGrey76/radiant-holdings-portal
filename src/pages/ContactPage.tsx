import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 font-light max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            For collaboration or institutional enquiries, please contact our office.
          </motion.p>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-3xl font-light uppercase tracking-wide text-aries-navy mb-8">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-aries-copper mt-1" strokeWidth={1} />
                    <div>
                      <h3 className="text-lg font-light uppercase tracking-wide text-aries-navy mb-2">
                        Office
                      </h3>
                      <p className="text-gray-600 font-light">
                        London, United Kingdom
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-aries-copper mt-1" strokeWidth={1} />
                    <div>
                      <h3 className="text-lg font-light uppercase tracking-wide text-aries-navy mb-2">
                        Email
                      </h3>
                      <a 
                        href="mailto:segreteria@aries76.com" 
                        className="text-gray-600 font-light hover:text-aries-copper transition-colors"
                      >
                        segreteria@aries76.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <p className="text-gray-600 font-light leading-relaxed">
                  We maintain strict confidentiality in all our engagements and typically respond 
                  to institutional enquiries within 48 hours.
                </p>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm uppercase tracking-wide text-aries-navy mb-2 font-light">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-aries-copper focus:ring-1 focus:ring-aries-copper outline-none transition-all font-light"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm uppercase tracking-wide text-aries-navy mb-2 font-light">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-aries-copper focus:ring-1 focus:ring-aries-copper outline-none transition-all font-light"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm uppercase tracking-wide text-aries-navy mb-2 font-light">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-aries-copper focus:ring-1 focus:ring-aries-copper outline-none transition-all resize-none font-light"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-aries-navy text-white uppercase tracking-wider font-light text-sm hover:bg-aries-copper transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
