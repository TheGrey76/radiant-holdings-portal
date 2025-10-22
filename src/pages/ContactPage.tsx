import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8 tracking-tight uppercase">
            Let's Discuss Your
            <br />
            <span className="text-accent">Next Fundraising</span>
          </h1>
          
          <div className="space-y-6 mb-12 max-w-md mx-auto">
            <div className="flex items-start gap-4 justify-center">
              <MapPin className="h-6 w-6 text-accent mt-1" strokeWidth={1.5} />
              <div>
                <p className="text-muted-foreground font-light">
                  Aries76 Ltd
                  <br />
                  27 Old Gloucester Street
                  <br />
                  London, United Kingdom, WC1N 3AX
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 justify-center">
              <Mail className="h-6 w-6 text-accent mt-1" strokeWidth={1.5} />
              <div>
                <a 
                  href="mailto:quinley.martini@aries76.com" 
                  className="text-muted-foreground font-light hover:text-accent transition-colors"
                >
                  quinley.martini@aries76.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
