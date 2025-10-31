import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('subscribe-mailchimp', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 backdrop-blur-sm bg-white/5 p-6 rounded-lg border border-white/10">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-white/60 text-sm mt-3 text-center">
              Stay informed about private equity insights and market updates
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
