import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8 tracking-tight uppercase">
            Regulatory <span className="text-accent">Disclosure</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="p-8 bg-secondary/30 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="h-6 w-6 text-accent mt-1" strokeWidth={1.5} />
              <div>
                <h2 className="text-xl font-normal text-foreground mb-4 uppercase tracking-wide">
                  Company Information
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Aries76 Ltd is a UK-registered company (Companies House no. 15324504) acting as an independent advisory and capital introduction firm.
                </p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Registered office: 27 Old Gloucester Street, London, United Kingdom, WC1N 3AX
                </p>
                <p className="text-muted-foreground font-light leading-relaxed mt-4">
                  Aries76 Ltd does not conduct any regulated investment activity and does not provide investment advice to retail clients. All introductions and activities are carried out on a professional and institutional basis in accordance with UK and European regulations.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-secondary/30 border border-border">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-accent mt-1" strokeWidth={1.5} />
              <div>
                <h2 className="text-xl font-normal text-foreground mb-4 uppercase tracking-wide">
                  Contact
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  For compliance enquiries, please contact:
                  <br />
                  <a href="mailto:compliance@aries76.com" className="text-accent hover:text-accent/80 transition-colors">
                    compliance@aries76.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Registered Office: 27 Old Gloucester Street, London, United Kingdom, WC1N 3AX
              <br />
              Company Number: 15324504
              <br />
              Incorporated: 3 December 2023
              <br />
              Aries76 Ltd is not authorised or regulated by the Financial Conduct Authority (FCA).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;
