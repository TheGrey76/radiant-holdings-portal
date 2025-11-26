import { motion } from "framer-motion";

const Partners = () => {
  const capitalRaisingClients = [
    {
      name: "Faro Value S.p.A.",
      subtitle: "Faro Alternative Investments",
      description: "Advisory support to selected sub-funds and single-deal transactions within the SICAV-RAIF platform."
    },
    {
      name: "ABC Company S.p.A.",
      subtitle: "",
      description: "Capital raising advisory for the listed company and related SPVs."
    },
    {
      name: "Mazal AI & Innovation",
      subtitle: "",
      description: "International fundraising support and capital strategy initiatives."
    },
    {
      name: "Alkemia SGR",
      subtitle: "",
      description: "Advisory activity focused on strengthening the fundraising narrative and LP engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-foreground tracking-tight">
              Partners & Strategic Collaborations
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-4xl mx-auto">
              Aries76 Ltd works alongside a select group of investment managers, corporations, 
              and strategic distributors to support cross-border capital formation, investor relations, 
              and long-term value creation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capital Raising Clients Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <p className="text-center text-muted-foreground/70 mb-20 text-lg font-light tracking-wide">
              Aries76 acts as Capital Raising Advisor for the following organizations through dedicated agreements.
            </p>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {capitalRaisingClients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-10 bg-card border border-border/30 hover:border-border/60 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                        {client.name}
                      </h3>
                      {client.subtitle && (
                        <p className="text-sm text-muted-foreground/60 font-light tracking-wide">
                          {client.subtitle}
                        </p>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground/80 leading-relaxed font-light">
                      {client.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider Section */}
      <section className="py-20 border-y border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-8">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-border"></div>
              <h2 className="text-2xl md:text-3xl font-light text-foreground whitespace-nowrap tracking-wide">
                Strategic Distribution Partnerships
              </h2>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-border/50 to-border"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-center text-muted-foreground/70 mb-20 text-lg font-light tracking-wide">
              Aries76 collaborates with selected partners to enhance institutional investor coverage 
              in Europe and globally.
            </p>

            <div className="p-12 md:p-16 bg-gradient-to-br from-card to-card/50 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 shadow-2xl hover:shadow-primary/10">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-6 tracking-tight">
                  Virgil Alternative UK
                </h3>
                <div className="w-16 h-[1px] bg-primary/40 mx-auto mb-6"></div>
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light max-w-2xl mx-auto">
                  Strategic distribution partner supporting institutional investor outreach 
                  and specialized capital introduction.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-24 md:py-32 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light tracking-wide">
              These partnerships reflect the breadth of our activity and the trust placed in Aries76 
              to support complex capital-raising initiatives with precision, discretion and a 
              forward-looking approach.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
