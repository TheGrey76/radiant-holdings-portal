import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { 
  Brain, 
  TrendingUp, 
  Globe, 
  Shield, 
  Users, 
  CheckCircle2, 
  Target,
  Lightbulb,
  BarChart3
} from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const investorBriefSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().optional(),
});

const MazalInnovation = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gateForm = useForm({
    resolver: zodResolver(emailSchema),
  });

  const briefForm = useForm({
    resolver: zodResolver(investorBriefSchema),
  });

  const handleGateSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("mazal_innovation_access")
        .insert([{ email: data.email }]);

      if (error) throw error;

      toast.success("Access granted! Welcome to Mazal Innovation");
      setHasAccess(true);
    } catch (error) {
      console.error("Error granting access:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBriefRequest = async (data: z.infer<typeof investorBriefSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("mazal_investor_brief_requests")
        .insert([{
          email: data.email,
          name: data.name,
          organization: data.organization || null,
        }]);

      if (error) throw error;

      toast.success("Request submitted! We'll send you the investor brief shortly.");
      briefForm.reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Mazal Innovation - Unlocking European AI Growth Deals | Mazal Capital</title>
        <meta name="description" content="Mazal Innovation accelerates AI-driven growth opportunities across Europe. Connecting institutional capital with exceptional founders, scalable technologies and resilient business models." />
        <meta property="og:title" content="Mazal Innovation - Unlocking European AI Growth Deals" />
        <meta property="og:description" content="Strategic AI investment platform by Mazal Capital focused on European growth opportunities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <AnimatePresence>
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-4 p-8 bg-card border border-border rounded-lg shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Mazal Innovation
                </h1>
                <p className="text-xl text-primary font-semibold mb-1">
                  Unlocking European AI Growth Deals
                </p>
                <p className="text-sm text-muted-foreground">
                  By Mazal Capital
                </p>
              </div>

              <form onSubmit={gateForm.handleSubmit(handleGateSubmit)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email to request access"
                    {...gateForm.register("email")}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                  {gateForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {String(gateForm.formState.errors.email.message)}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Access"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Exclusive access for institutional investors, family offices, and qualified partners
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <Brain className="w-12 h-12 text-primary" />
                <h1 className="text-5xl font-bold text-foreground">Mazal Innovation</h1>
              </div>
              <h2 className="text-3xl font-semibold text-primary mb-6">
                Accelerating AI-Driven Growth Opportunities Across Europe
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Mazal Innovation is the dedicated platform of Mazal Capital focused on identifying, structuring and scaling high-conviction investment opportunities in Artificial Intelligence and data-enabled businesses. We connect institutional capital with exceptional founders, scalable technologies and resilient business models.
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">About Mazal Innovation</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Mazal Innovation nasce come estensione strategica di Mazal Capital, con l'obiettivo di costruire una piattaforma di investimento specializzata nelle tecnologie AI-driven che stanno ridefinendo i modelli operativi in Europa. La nostra esperienza combinata in capital markets, private equity ed entrepreneurship-through-acquisition ci consente di integrare origination, execution e capital formation con un approccio unico nel panorama europeo.
                </p>
                <p>
                  Lavoriamo con aziende tecnologiche ad alto potenziale, team fondatori di qualità e modelli scalabili basati su AI applicata a settori come financial services, cybersecurity, healthcare, industrial automation, enterprise software e data analytics.
                </p>
                <p>
                  Mazal Innovation opera come partner a lungo termine, selezionando opportunità con forte trazione commerciale e architetture tecnologiche solide, in grado di generare crescita sostenibile e creazione di valore progressiva.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Our Value Proposition</h2>
              <p className="text-xl text-center text-muted-foreground mb-12">
                Rigore nell'origination, qualità nell'execution e accesso selettivo al capitale
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    icon: <Globe className="w-8 h-8" />,
                    title: "Sourcing proprietario",
                    description: "Una rete europea e internazionale che include fondatori, acceleratori, fondi VC, ricercatori e operatori industriali."
                  },
                  {
                    icon: <BarChart3 className="w-8 h-8" />,
                    title: "Analisi tecnologica e commerciale",
                    description: "Valutiamo tecnologia, scalabilità, rischi, unit economics e potenziale di mercato con un processo strutturato e replicabile."
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Strutturazione deal e fundraising integrato",
                    description: "Supportiamo la definizione dell'architettura dell'investimento, la costruzione del materiale investor-ready e il processo di raccolta con investitori qualificati."
                  },
                  {
                    icon: <CheckCircle2 className="w-8 h-8" />,
                    title: "Execution trasparente e allineata",
                    description: "Accompagniamo ogni operazione fino alla chiusura, inclusi coordination, term-sheet, due-diligence e stakeholder management."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="text-primary mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Investment Criteria */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Investment Criteria</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Geografia</h4>
                      <p className="text-muted-foreground">Europa Occidentale e Centrale, con preferenza per Regno Unito, DACH, Nordics e Italia.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Settori</h4>
                      <p className="text-muted-foreground">AI applicata a enterprise software, fintech, cybersecurity, healthcare, data-infrastructure, automation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Stage</h4>
                      <p className="text-muted-foreground">Late-Seed, Series A, Series B, early growth.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Ticket Size</h4>
                      <p className="text-muted-foreground">€5M – €30M (equity e co-investimenti).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Business Model</h4>
                      <p className="text-muted-foreground">Ricavi ricorrenti, forte scalabilità, retention elevata, economie di prodotto chiare.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Tecnologia</h4>
                      <p className="text-muted-foreground">Proprietà intellettuale difendibile, architetture ML/AI proprietarie o integrate, roadmap credibile.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Highlights */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Portfolio Highlights</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "AI-Driven Enterprise Automation",
                    location: "UK",
                    description: "Scale-up con tecnologia di automazione documentale basata su modelli proprietari LLM, ARR > €10M, crescita annuale >40%."
                  },
                  {
                    title: "Data-Enhanced Cyber Intelligence",
                    location: "DACH",
                    description: "Piattaforma ML per threat detection in ambienti industriali e finanziari, clienti blue-chip europei, margini in espansione."
                  },
                  {
                    title: "Predictive Healthcare Analytics",
                    location: "Nordics",
                    description: "Soluzione AI per diagnosi predittiva e ottimizzazione clinica, partnership con tre gruppi ospedalieri e rapido percorso di scale-up."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <div className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {item.location}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How We Work with Investors</h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                Mazal Innovation opera secondo un modello collaborativo, costruito per essere pienamente allineato agli investitori
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Selezione rigorosa delle opportunità e presentazione dei soli deal che superano la nostra due-diligence interna",
                  "Materiale di investimento chiaro, sintetico e orientato all'esecuzione",
                  "Accesso diretto ai team fondatori, ai dati e agli advisor tecnici",
                  "Gestione completa del processo di fundraising e closing",
                  "Reporting continuo durante il processo e dopo l'investimento"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto">
                Il nostro approccio consente agli investitori di accedere a operazioni già validate sotto il profilo tecnologico, commerciale e finanziario, riducendo il tempo necessario per valutare e finalizzare un investimento.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Investor Brief Request */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-lg"
            >
              <div className="text-center mb-8">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Request the Investor Brief</h2>
                <p className="text-muted-foreground mb-6">
                  Gli investitori che desiderano accedere ai materiali completi possono richiedere il nostro Investor Brief, che include:
                </p>
                <ul className="text-left text-muted-foreground space-y-2 max-w-2xl mx-auto mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Executive summary del deal-flow attivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Criteri di valutazione</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Pipeline aggiornata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Materiali selezionati per operazioni in fase avanzata</span>
                  </li>
                </ul>
              </div>

              <form onSubmit={briefForm.handleSubmit(handleBriefRequest)} className="space-y-4 max-w-md mx-auto">
                <div>
                  <Input
                    type="text"
                    placeholder="Your name *"
                    {...briefForm.register("name")}
                    disabled={isSubmitting}
                  />
                  {briefForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {String(briefForm.formState.errors.name.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your email *"
                    {...briefForm.register("email")}
                    disabled={isSubmitting}
                  />
                  {briefForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {String(briefForm.formState.errors.email.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Organization (optional)"
                    {...briefForm.register("organization")}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Investor Brief"}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MazalInnovation;
