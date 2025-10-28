import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-10 z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BUILDING BRIDGES BETWEEN
            <br />
            <span className="font-normal text-accent">CAPITAL AND OPPORTUNITY</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Aries76 Ltd is a London-based advisory firm supporting GPs, sponsors, and institutional investors in structuring and raising capital across private markets.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/about">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
                Discover Our Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
              Our Clients & Partners
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Working with distinguished investment firms globally
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-border/50 bg-card hover:shadow-smooth-lg transition-shadow duration-300">
              <CardContent className="p-12">
                <div className="flex items-center justify-center">
                  <img 
                    src="https://www.faroalternativeinvestments.com/wp-content/uploads/2024/03/faro-logo.png" 
                    alt="Faro Alternative Investments" 
                    className="max-h-24 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x150?text=Faro+Alternative+Investments';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center mt-8">
              <Link to="/clients">
                <Button variant="ghost" className="font-light uppercase tracking-wider text-accent hover:text-accent/80">
                  View All Clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
