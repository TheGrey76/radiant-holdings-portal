import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Target, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  PortfolioSimulator, 
  AIInsightsTeaser, 
  PricingCard, 
  StickyBanner 
} from "@/components/portfolio-report";

const PortfolioAnalysis = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio Optimization Report | ARIES76</title>
        <meta name="description" content="AI-powered portfolio optimization analysis. Get personalized Bitcoin allocation recommendations based on Monte Carlo simulations, risk analysis, and institutional-grade insights." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"></div>
          
          <div className="container max-w-6xl mx-auto px-6 py-28 md:py-36 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/30 border border-primary/50 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300 uppercase tracking-wider">AI-Powered Analysis</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Portfolio</span>
                <br />
                <span className="text-orange-400">Optimization</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover the optimal Bitcoin allocation for your portfolio with institutional-grade analysis and AI-powered recommendations
              </motion.p>

              {/* Value Props */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {[
                  { icon: TrendingUp, label: 'Monte Carlo Simulations' },
                  { icon: Shield, label: 'Risk Analysis' },
                  { icon: BarChart3, label: 'Tax Optimization' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          {/* Interactive Simulator */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PortfolioSimulator />
          </motion.section>

          <Separator className="my-16 opacity-50" />

          {/* AI Insights */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AIInsightsTeaser />
          </motion.section>

          <Separator className="my-16 opacity-50" />

          {/* Pricing */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PricingCard />
          </motion.section>
        </div>
      </div>

      {/* Sticky Banner */}
      <StickyBanner />
    </>
  );
};

export default PortfolioAnalysis;
