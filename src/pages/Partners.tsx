import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Partners = () => {
  const capitalRaisingClients = [
    {
      name: "Faro Value S.p.A. (Faro Alternative Investments)",
      description: "Advisory support to selected sub-funds and single-deal transactions within the SICAV-RAIF platform."
    },
    {
      name: "ABC Company S.p.A.",
      description: "Capital raising advisory for the listed company and related SPVs."
    },
    {
      name: "Mazal AI & Innovation",
      description: "International fundraising support and capital strategy initiatives."
    },
    {
      name: "Alkemia SGR",
      description: "Advisory activity focused on strengthening the fundraising narrative and LP engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Partners & Strategic Collaborations
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Aries76 Ltd works alongside a select group of investment managers, corporations, 
              and strategic distributors to support cross-border capital formation, investor relations, 
              and long-term value creation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capital Raising Clients Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Aries76 acts as Capital Raising Advisor for the following organizations through dedicated agreements.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {capitalRaisingClients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-border transition-colors duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <CardTitle className="text-xl font-semibold leading-tight">
                          {client.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {client.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <h2 className="text-xl font-semibold text-foreground whitespace-nowrap">
                Strategic Distribution Partnerships
              </h2>
              <div className="flex-1 h-px bg-border"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Aries76 collaborates with selected partners to enhance institutional investor coverage 
              in Europe and globally.
            </p>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  Virgil Alternative UK
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Strategic distribution partner supporting institutional investor outreach 
                  and specialized capital introduction.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
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