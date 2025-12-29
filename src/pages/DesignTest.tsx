import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Globe, Layers, TrendingUp, Users, Database } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

const DesignTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const services = [
    {
      icon: TrendingUp,
      title: 'Capital Formation',
      description: 'End-to-end fundraising support from €10M to €100M+',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'LP Advisory',
      description: 'Curated access to private market opportunities',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Database,
      title: 'AI Intelligence',
      description: 'Proprietary AIRES platform for investor targeting',
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  const stats = [
    { value: '€500M+', label: 'Capital Raised' },
    { value: '120+', label: 'LP Network' },
    { value: '15+', label: 'Years Experience' },
    { value: '98%', label: 'Success Rate' }
  ];

  return (
    <div ref={containerRef} className="bg-zinc-950 min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 blur-[120px]"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/10 blur-[100px]"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        <motion.div 
          className="container mx-auto px-6 relative z-10"
          style={{ opacity, scale }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-zinc-300">Next-Gen Capital Intelligence</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="block text-white">Intelligent</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Capital Solutions
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We partner with GPs, sponsors, and institutional investors to structure 
              and execute capital raises across private markets.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full px-8 text-base font-medium group"
              >
                Start a Conversation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 text-base font-medium backdrop-blur-sm"
              >
                Explore Services
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div 
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          {/* Section header */}
          <motion.div 
            className="max-w-3xl mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-400 text-sm uppercase tracking-wider mb-4 block">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Building Bridges Between
              <span className="block text-zinc-500">Capital & Opportunity</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              From fundraising strategy to LP relationship management, we provide 
              comprehensive support across the capital formation lifecycle.
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
                  <service.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">{service.description}</p>

                {/* Link */}
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm text-zinc-500 group-hover:text-white transition-colors"
                >
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            className="relative rounded-[2.5rem] overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.15),transparent_70%)]" />
            
            {/* Content */}
            <div className="relative p-12 md:p-20">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-amber-400 font-medium">AIRES Platform</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  AI-Powered Investor Intelligence
                </h2>

                <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                  Our proprietary AIRES platform transforms capital formation through 
                  intelligent investor targeting, automated outreach, and real-time 
                  analytics designed for the modern GP.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 hover:from-amber-500 hover:to-orange-600 rounded-full px-8 font-medium"
                  >
                    Request Demo
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 font-medium"
                  >
                    View Case Studies
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                <div className="absolute right-20 top-20 w-32 h-32 border border-amber-500/20 rounded-2xl transform rotate-12" />
                <div className="absolute right-40 bottom-20 w-24 h-24 border border-white/10 rounded-full" />
                <motion.div 
                  className="absolute right-32 top-1/2 -translate-y-1/2"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Globe className="w-20 h-20 text-amber-500/30" strokeWidth={0.5} />
                </motion.div>
                <motion.div 
                  className="absolute right-60 top-1/3"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Layers className="w-16 h-16 text-white/20" strokeWidth={0.5} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Capital Strategy?
              </span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Let's discuss how we can support your next capital raise.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full px-12 py-6 text-lg font-medium"
            >
              Schedule a Call
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DesignTest;
