import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Sparkles, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

const AlphaFlow = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Selection',
      description: 'Advanced algorithms analyze thousands of structured certificates to identify optimal opportunities matching your risk-return profile.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk Management',
      description: 'Automated portfolio optimization with real-time barrier monitoring, diversification analytics, and stress testing.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Performance Analytics',
      description: 'Track portfolio performance, coupon income, and scenario analysis with institutional-grade analytics.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Custom Portfolios',
      description: 'Tailored certificate selection based on income goals, capital preservation needs, and market views.'
    }
  ];

  const benefits = [
    {
      metric: '500+',
      label: 'Certificates Analyzed Daily',
      description: 'Real-time screening across European markets'
    },
    {
      metric: '15+',
      label: 'Issuer Banks',
      description: 'Access to top-tier European institutions'
    },
    {
      metric: '24/7',
      label: 'Market Monitoring',
      description: 'Continuous pricing and risk updates'
    },
    {
      metric: '99.9%',
      label: 'Uptime',
      description: 'Enterprise-grade reliability'
    }
  ];

  const useCases = [
    {
      title: 'Income Generation',
      description: 'Build high-yield portfolios with autocallable and reverse convertible certificates, optimized for consistent coupon payments.',
      cta: 'Explore Income Strategies'
    },
    {
      title: 'Capital Preservation',
      description: 'Construct defensive portfolios with capital-protected notes and barrier certificates for wealth preservation with upside potential.',
      cta: 'View Protection Strategies'
    },
    {
      title: 'Growth & Participation',
      description: 'Design participation portfolios that capture equity upside with defined risk parameters and leveraged exposure.',
      cta: 'Discover Growth Options'
    }
  ];

  return (
    <>
      <Helmet>
        <title>AlphaFlow - AI-Powered Structured Certificate Platform | Aries76</title>
        <meta name="description" content="AlphaFlow by Aries76: AI-driven platform for structured certificate portfolio construction. Automated selection, risk management, and performance analytics." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950">
        {/* Hero Section */}
        <section className="relative py-32 px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">AI-Powered Investment Platform</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                Alpha<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Flow</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
                Advanced AI platform for structured certificate portfolio construction. Automated selection, real-time analytics, and institutional-grade risk management.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-6 text-lg h-auto"
                >
                  <Link to="/contact">
                    Request Demo <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 px-8 py-6 text-lg h-auto bg-transparent"
                >
                  <Link to="/structured-products">
                    View Structured Products
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Stats */}
        <section className="py-20 px-6 md:px-10 border-y border-blue-500/10 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                    {item.metric}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-blue-300 mb-1 font-semibold">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Platform Features
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Institutional-grade technology designed for wealth managers, family offices, and sophisticated investors.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-slate-900/50 border border-blue-500/10 rounded-lg backdrop-blur-sm hover:border-blue-500/30 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 px-6 md:px-10 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Portfolio Strategies
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Build custom certificate portfolios tailored to your investment objectives and risk tolerance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/20 rounded-lg"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{useCase.description}</p>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                  >
                    {useCase.cta} 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How AlphaFlow Works
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Four-step process from portfolio design to ongoing management.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Define Objectives', icon: <Target className="w-8 h-8" />, description: 'Set your risk appetite, income goals, and investment horizon.' },
                { step: '02', title: 'AI Selection', icon: <Sparkles className="w-8 h-8" />, description: 'Algorithm screens and ranks certificates based on your criteria.' },
                { step: '03', title: 'Portfolio Build', icon: <BarChart3 className="w-8 h-8" />, description: 'Automated diversification and position sizing optimization.' },
                { step: '04', title: 'Active Management', icon: <Zap className="w-8 h-8" />, description: 'Continuous monitoring, rebalancing, and performance tracking.' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-blue-400 mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-10 bg-gradient-to-r from-blue-600 to-violet-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience AlphaFlow?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Request a personalized demo and discover how AI can transform your structured certificate investing.
              </p>
              <Button 
                asChild
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg h-auto font-semibold"
              >
                <Link to="/contact">
                  Schedule Demo <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="py-12 px-6 md:px-10 border-t border-blue-500/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-slate-400">
              AlphaFlow is a proprietary technology platform developed by{' '}
              <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
                Aries76 Ltd
              </Link>
              . For institutional inquiries, contact{' '}
              <a href="mailto:edoardo.grigione@aries76.com" className="text-blue-400 hover:text-blue-300 underline">
                edoardo.grigione@aries76.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AlphaFlow;
