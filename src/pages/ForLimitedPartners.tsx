import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, Users, TrendingUp, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ForLimitedPartners = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-5 z-0" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight uppercase">
              For Limited Partners &<br />
              <span className="text-accent">Professional Investors</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto">
              Independent private markets advisory for a select group of GPs and institutional investors.
            </p>
            
            <p className="text-lg text-white/80 font-light max-w-4xl mx-auto mb-10 leading-relaxed">
              Aries76 is an independent advisory firm supporting a curated set of General Partners and sponsors in their capital formation. We work with professional investors – including family offices, private banks, wealth managers and institutional LPs – to provide access to selected private markets strategies and bespoke opportunities, always with a long-term partnership mindset.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a href="mailto:quinley.martini@aries76.com?subject=GP Information Request">
                  <Mail className="mr-2 h-5 w-5" />
                  Request GP information pack
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <a href="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a call
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Independent Advisory</h3>
              <p className="text-sm text-muted-foreground">
                Unbiased guidance focused on your investment objectives and risk profile.
              </p>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Curated Access</h3>
              <p className="text-sm text-muted-foreground">
                Exclusive opportunities with vetted GPs and sponsors in private markets.
              </p>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Long-term Partnership</h3>
              <p className="text-sm text-muted-foreground">
                Building lasting relationships beyond single transactions.
              </p>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <FileCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Institutional Standards</h3>
              <p className="text-sm text-muted-foreground">
                Professional-grade due diligence and documentation processes.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 tracking-tight">
              Who we work with
            </h2>
            
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-4xl mb-12">
              Aries76 exclusively engages with professional and institutional investors: family offices, multi-family offices, private banks, wealth managers, independent advisory firms, pension funds, insurance companies and other institutional LPs.
            </p>

            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 tracking-tight">
              Our approach
            </h2>
            
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-4xl">
              We introduce strategies and managers that fit the LP's mandate, risk appetite and governance framework. Aries76 does not operate as a retail distributor and focuses on building long-term relationships with sophisticated investors who appreciate our independent, transparent approach to private markets access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Get in touch
            </h2>
            
            <p className="text-lg text-muted-foreground font-light mb-12 max-w-3xl mx-auto">
              Contact us for a confidential discussion about how we can align selected private markets opportunities with your investment strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90"
                asChild
              >
                <a href="mailto:quinley.martini@aries76.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email us
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                asChild
              >
                <a href="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Contact form
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForLimitedPartners;
