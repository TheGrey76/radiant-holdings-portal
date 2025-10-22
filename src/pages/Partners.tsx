import { motion } from 'framer-motion';

const Partners = () => {
  const partners = [
    'Faro Alternative Investments',
    'Gold Grain Capital',
    'Abalone Private Wealth',
    'SignalRank.ai'
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
            Selected <span className="text-accent">Collaborations</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl">
            We collaborate with selected partners and fund managers who share our values of transparency, innovation, and long-term alignment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group p-12 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 border border-border"
            >
              <p className="text-xl md:text-2xl font-light text-foreground uppercase tracking-wider">
                {partner}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Partners;
