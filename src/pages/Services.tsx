import { motion } from 'framer-motion';
import { TrendingUp, Lightbulb, Database } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: TrendingUp,
      title: 'Capital Formation & Investor Relations',
      description: 'We partner with GPs, sponsors, and entrepreneurs to structure and execute fundraising mandates across Europe. Our approach combines deep investor networks with rigorous alignment processes, supporting capital raises from €10M to €100M+.'
    },
    {
      icon: Lightbulb,
      title: 'Family Office & LP Advisory',
      description: 'Tailored advisory for single and multi-family offices seeking curated access to private market opportunities. We provide portfolio strategy, manager evaluation, and direct deal screening with complete independence and transparency.'
    },
    {
      icon: Database,
      title: 'AI-Enabled Intelligence',
      description: 'Proprietary data infrastructure and AI-driven investor targeting to accelerate deal origination and due diligence. Our AIRES platform transforms how capital formation is executed in private markets.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8 tracking-tight uppercase">
            What We <span className="text-accent">Do</span>
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="mb-8 inline-block p-6 rounded-lg bg-secondary/50 group-hover:bg-accent/10 transition-all duration-300">
                <service.icon className="h-10 w-10 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-normal text-foreground mb-4 uppercase tracking-wide">
                {service.title}
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
