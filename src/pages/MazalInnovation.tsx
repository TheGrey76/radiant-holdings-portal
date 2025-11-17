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
  BarChart3,
  Languages
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
  const [language, setLanguage] = useState<"it" | "en">("en");

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

      toast.success(
        language === "en" 
          ? "Access granted! Welcome to Mazal Innovation" 
          : "Accesso consentito! Benvenuto su Mazal Innovation"
      );
      setHasAccess(true);
    } catch (error) {
      console.error("Error granting access:", error);
      toast.error(
        language === "en" 
          ? "An error occurred. Please try again." 
          : "Si è verificato un errore. Riprova."
      );
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

      toast.success(
        language === "en"
          ? "Request submitted! We'll send you the investor brief shortly."
          : "Richiesta inviata! Ti invieremo l'investor brief a breve."
      );
      briefForm.reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(
        language === "en"
          ? "An error occurred. Please try again."
          : "Si è verificato un errore. Riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    en: {
      gate: {
        title: "Mazal Innovation",
        subtitle: "Unlocking European AI Growth Deals",
        byline: "By Mazal Capital",
        placeholder: "Enter your email to request access",
        button: "Request Access",
        footer: "Exclusive access for institutional investors, family offices, and qualified partners"
      },
      hero: {
        title: "Mazal Innovation",
        subtitle: "Accelerating AI-Driven Growth Opportunities Across Europe",
        description: "Mazal Innovation is the dedicated platform of Mazal Capital focused on identifying, structuring and scaling high-conviction investment opportunities in Artificial Intelligence and data-enabled businesses. We connect institutional capital with exceptional founders, scalable technologies and resilient business models."
      },
      about: {
        title: "About Mazal Innovation",
        paragraphs: [
          "Mazal Innovation was born as a strategic extension of Mazal Capital, with the objective of building a specialized investment platform in AI-driven technologies that are redefining operational models in Europe. Our combined experience in capital markets, private equity and entrepreneurship-through-acquisition allows us to integrate origination, execution and capital formation with a unique approach in the European landscape.",
          "We work with high-potential technology companies, quality founding teams and scalable models based on AI applied to sectors such as financial services, cybersecurity, healthcare, industrial automation, enterprise software and data analytics.",
          "Mazal Innovation operates as a long-term partner, selecting opportunities with strong commercial traction and solid technological architectures, capable of generating sustainable growth and progressive value creation."
        ]
      },
      value: {
        title: "Our Value Proposition",
        subtitle: "Rigor in origination, quality in execution and selective access to capital",
        items: [
          {
            title: "Proprietary Sourcing",
            description: "A European and international network that includes founders, accelerators, VC funds, researchers and industrial operators."
          },
          {
            title: "Technical and Commercial Analysis",
            description: "We evaluate technology, scalability, risks, unit economics and market potential with a structured and replicable process."
          },
          {
            title: "Deal Structuring and Integrated Fundraising",
            description: "We support the definition of investment architecture, the construction of investor-ready material and the fundraising process with qualified investors."
          },
          {
            title: "Transparent and Aligned Execution",
            description: "We accompany each operation until closing, including coordination, term-sheet, due-diligence and stakeholder management."
          }
        ]
      },
      criteria: {
        title: "Investment Criteria",
        items: [
          {
            title: "Geography",
            description: "Western and Central Europe, with preference for United Kingdom, DACH, Nordics and Italy."
          },
          {
            title: "Sectors",
            description: "AI applied to enterprise software, fintech, cybersecurity, healthcare, data-infrastructure, automation."
          },
          {
            title: "Stage",
            description: "Late-Seed, Series A, Series B, early growth."
          },
          {
            title: "Ticket Size",
            description: "€5M – €30M (equity and co-investments)."
          },
          {
            title: "Business Model",
            description: "Recurring revenues, strong scalability, high retention, clear product economics."
          },
          {
            title: "Technology",
            description: "Defensible intellectual property, proprietary or integrated ML/AI architectures, credible roadmap."
          }
        ]
      },
      portfolio: {
        title: "Portfolio Highlights",
        items: [
          {
            title: "AI-Driven Enterprise Automation",
            location: "UK",
            description: "Scale-up with document automation technology based on proprietary LLM models, ARR > €10M, annual growth >40%."
          },
          {
            title: "Data-Enhanced Cyber Intelligence",
            location: "DACH",
            description: "ML platform for threat detection in industrial and financial environments, European blue-chip clients, expanding margins."
          },
          {
            title: "Predictive Healthcare Analytics",
            location: "Nordics",
            description: "AI solution for predictive diagnosis and clinical optimization, partnerships with three hospital groups and rapid scale-up path."
          }
        ]
      },
      work: {
        title: "How We Work with Investors",
        subtitle: "Mazal Innovation operates according to a collaborative model, built to be fully aligned with investors",
        items: [
          "Rigorous selection of opportunities and presentation of only deals that pass our internal due-diligence",
          "Clear, concise and execution-oriented investment material",
          "Direct access to founding teams, data and technical advisors",
          "Complete management of the fundraising and closing process",
          "Continuous reporting during the process and after the investment"
        ],
        footer: "Our approach allows investors to access operations already validated from a technological, commercial and financial perspective, reducing the time needed to evaluate and finalize an investment."
      },
      brief: {
        title: "Request the Investor Brief",
        subtitle: "Investors who wish to access the complete materials can request our Investor Brief, which includes:",
        items: [
          "Executive summary of active deal-flow",
          "Evaluation criteria",
          "Updated pipeline",
          "Selected materials for advanced-stage operations"
        ],
        namePlaceholder: "Your name *",
        emailPlaceholder: "Your email *",
        orgPlaceholder: "Organization (optional)",
        button: "Request Investor Brief"
      }
    },
    it: {
      gate: {
        title: "Mazal Innovation",
        subtitle: "Sbloccare Opportunità di Crescita AI in Europa",
        byline: "Di Mazal Capital",
        placeholder: "Inserisci la tua email per richiedere l'accesso",
        button: "Richiedi Accesso",
        footer: "Accesso esclusivo per investitori istituzionali, family office e partner qualificati"
      },
      hero: {
        title: "Mazal Innovation",
        subtitle: "Accelerare Opportunità di Crescita AI in Europa",
        description: "Mazal Innovation è la piattaforma dedicata di Mazal Capital focalizzata sull'identificazione, strutturazione e scaling di opportunità di investimento ad alta convinzione nell'Intelligenza Artificiale e nelle imprese data-enabled. Connettiamo capitale istituzionale con fondatori eccezionali, tecnologie scalabili e modelli di business resilienti."
      },
      about: {
        title: "Chi è Mazal Innovation",
        paragraphs: [
          "Mazal Innovation nasce come estensione strategica di Mazal Capital, con l'obiettivo di costruire una piattaforma di investimento specializzata nelle tecnologie AI-driven che stanno ridefinendo i modelli operativi in Europa. La nostra esperienza combinata in capital markets, private equity ed entrepreneurship-through-acquisition ci consente di integrare origination, execution e capital formation con un approccio unico nel panorama europeo.",
          "Lavoriamo con aziende tecnologiche ad alto potenziale, team fondatori di qualità e modelli scalabili basati su AI applicata a settori come financial services, cybersecurity, healthcare, industrial automation, enterprise software e data analytics.",
          "Mazal Innovation opera come partner a lungo termine, selezionando opportunità con forte trazione commerciale e architetture tecnologiche solide, in grado di generare crescita sostenibile e creazione di valore progressiva."
        ]
      },
      value: {
        title: "La Nostra Proposta di Valore",
        subtitle: "Rigore nell'origination, qualità nell'execution e accesso selettivo al capitale",
        items: [
          {
            title: "Sourcing proprietario",
            description: "Una rete europea e internazionale che include fondatori, acceleratori, fondi VC, ricercatori e operatori industriali."
          },
          {
            title: "Analisi tecnologica e commerciale",
            description: "Valutiamo tecnologia, scalabilità, rischi, unit economics e potenziale di mercato con un processo strutturato e replicabile."
          },
          {
            title: "Strutturazione deal e fundraising integrato",
            description: "Supportiamo la definizione dell'architettura dell'investimento, la costruzione del materiale investor-ready e il processo di raccolta con investitori qualificati."
          },
          {
            title: "Execution trasparente e allineata",
            description: "Accompagniamo ogni operazione fino alla chiusura, inclusi coordination, term-sheet, due-diligence e stakeholder management."
          }
        ]
      },
      criteria: {
        title: "Criteri di Investimento",
        items: [
          {
            title: "Geografia",
            description: "Europa Occidentale e Centrale, con preferenza per Regno Unito, DACH, Nordics e Italia."
          },
          {
            title: "Settori",
            description: "AI applicata a enterprise software, fintech, cybersecurity, healthcare, data-infrastructure, automation."
          },
          {
            title: "Stage",
            description: "Late-Seed, Series A, Series B, early growth."
          },
          {
            title: "Ticket Size",
            description: "€5M – €30M (equity e co-investimenti)."
          },
          {
            title: "Business Model",
            description: "Ricavi ricorrenti, forte scalabilità, retention elevata, economie di prodotto chiare."
          },
          {
            title: "Tecnologia",
            description: "Proprietà intellettuale difendibile, architetture ML/AI proprietarie o integrate, roadmap credibile."
          }
        ]
      },
      portfolio: {
        title: "Portfolio Highlights",
        items: [
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
        ]
      },
      work: {
        title: "Come Lavoriamo con gli Investitori",
        subtitle: "Mazal Innovation opera secondo un modello collaborativo, costruito per essere pienamente allineato agli investitori",
        items: [
          "Selezione rigorosa delle opportunità e presentazione dei soli deal che superano la nostra due-diligence interna",
          "Materiale di investimento chiaro, sintetico e orientato all'esecuzione",
          "Accesso diretto ai team fondatori, ai dati e agli advisor tecnici",
          "Gestione completa del processo di fundraising e closing",
          "Reporting continuo durante il processo e dopo l'investimento"
        ],
        footer: "Il nostro approccio consente agli investitori di accedere a operazioni già validate sotto il profilo tecnologico, commerciale e finanziario, riducendo il tempo necessario per valutare e finalizzare un investimento."
      },
      brief: {
        title: "Richiedi l'Investor Brief",
        subtitle: "Gli investitori che desiderano accedere ai materiali completi possono richiedere il nostro Investor Brief, che include:",
        items: [
          "Executive summary del deal-flow attivo",
          "Criteri di valutazione",
          "Pipeline aggiornata",
          "Materiali selezionati per operazioni in fase avanzata"
        ],
        namePlaceholder: "Il tuo nome *",
        emailPlaceholder: "La tua email *",
        orgPlaceholder: "Organizzazione (opzionale)",
        button: "Richiedi Investor Brief"
      }
    }
  };

  const t = content[language];

  return (
    <>
      <Helmet>
        <title>Mazal Innovation - {language === "en" ? "Unlocking European AI Growth Deals" : "Sbloccare Opportunità di Crescita AI in Europa"} | Mazal Capital</title>
        <meta name="description" content={language === "en" ? "Mazal Innovation accelerates AI-driven growth opportunities across Europe. Connecting institutional capital with exceptional founders, scalable technologies and resilient business models." : "Mazal Innovation accelera opportunità di crescita AI in Europa. Connettendo capitale istituzionale con fondatori eccezionali, tecnologie scalabili e modelli di business resilienti."} />
        <meta property="og:title" content={`Mazal Innovation - ${language === "en" ? "Unlocking European AI Growth Deals" : "Sbloccare Opportunità di Crescita AI in Europa"}`} />
        <meta property="og:description" content={language === "en" ? "Strategic AI investment platform by Mazal Capital focused on European growth opportunities" : "Piattaforma di investimento AI strategica di Mazal Capital focalizzata su opportunità di crescita europee"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <AnimatePresence>
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg mx-4 p-10 bg-white rounded-sm shadow-2xl border border-slate-200"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-sm bg-slate-900">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">
                  {t.gate.title}
                </h1>
                <p className="text-xl text-slate-700 font-light mb-2 tracking-wide">
                  {t.gate.subtitle}
                </p>
                <p className="text-sm text-slate-500 font-light uppercase tracking-widest">
                  {t.gate.byline}
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-8">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="min-w-[90px] font-light tracking-wide"
                >
                  English
                </Button>
                <Button
                  variant={language === "it" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("it")}
                  className="min-w-[90px] font-light tracking-wide"
                >
                  Italiano
                </Button>
              </div>

              <form onSubmit={gateForm.handleSubmit(handleGateSubmit)} className="space-y-5">
                <div>
                  <Input
                    type="email"
                    placeholder={t.gate.placeholder}
                    {...gateForm.register("email")}
                    className="w-full h-12 bg-slate-50 border-slate-300 rounded-sm font-light"
                    disabled={isSubmitting}
                  />
                  {gateForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-2 font-light">
                      {String(gateForm.formState.errors.email.message)}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-light tracking-wide uppercase text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (language === "en" ? "Submitting..." : "Invio...") : t.gate.button}
                </Button>
              </form>

              <p className="text-xs text-slate-500 text-center mt-6 font-light leading-relaxed">
                {t.gate.footer}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-white">
        {/* Language Toggle - Hidden on mobile */}
        <div className="fixed top-6 right-6 z-40 hidden md:flex gap-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-sm p-1 shadow-sm">
          <Button
            variant={language === "en" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="min-w-[70px] rounded-sm font-light"
          >
            EN
          </Button>
          <Button
            variant={language === "it" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("it")}
            className="min-w-[70px] rounded-sm font-light"
          >
            IT
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-16 h-16 bg-slate-900 rounded-sm">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-6xl font-light text-slate-900 tracking-tight">{t.hero.title}</h1>
              </div>
              <div className="w-24 h-px bg-slate-900 mb-8"></div>
              <h2 className="text-3xl font-light text-slate-700 mb-8 tracking-wide">
                {t.hero.subtitle}
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                {t.hero.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 px-4 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-slate-900 mb-12 text-center tracking-tight">{t.about.title}</h2>
              <div className="w-16 h-px bg-slate-900 mx-auto mb-12"></div>
              <div className="prose prose-lg max-w-4xl mx-auto text-slate-600 space-y-6">
                {t.about.paragraphs.map((paragraph, index) => (
                  <p key={index} className="font-light leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-slate-900 mb-4 text-center tracking-tight">{t.value.title}</h2>
              <div className="w-16 h-px bg-slate-900 mx-auto mb-6"></div>
              <p className="text-lg text-center text-slate-600 mb-16 font-light max-w-3xl mx-auto">
                {t.value.subtitle}
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {t.value.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-8 bg-white border border-slate-200 rounded-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-slate-900 mb-6">
                      {index === 0 && <Globe className="w-6 h-6" />}
                      {index === 1 && <BarChart3 className="w-6 h-6" />}
                      {index === 2 && <Target className="w-6 h-6" />}
                      {index === 3 && <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-light text-slate-900 mb-3 tracking-wide">{item.title}</h3>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Investment Criteria */}
        <section className="py-24 px-4 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-slate-900 mb-12 text-center tracking-tight">{t.criteria.title}</h2>
              <div className="w-16 h-px bg-slate-900 mx-auto mb-16"></div>
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="space-y-6">
                  {t.criteria.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0">
                      {index === 0 && <Globe className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      {index === 1 && <Lightbulb className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      {index === 2 && <TrendingUp className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      <div>
                        <h4 className="font-light text-slate-900 mb-2 text-lg tracking-wide">{item.title}</h4>
                        <p className="text-slate-600 font-light leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {t.criteria.items.slice(3, 6).map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0">
                      {index === 0 && <Target className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      {index === 1 && <BarChart3 className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      {index === 2 && <Shield className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />}
                      <div>
                        <h4 className="font-light text-slate-900 mb-2 text-lg tracking-wide">{item.title}</h4>
                        <p className="text-slate-600 font-light leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Highlights */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-slate-900 mb-12 text-center tracking-tight">{t.portfolio.title}</h2>
              <div className="w-16 h-px bg-slate-900 mx-auto mb-16"></div>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {t.portfolio.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-8 bg-white border border-slate-200 rounded-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-14 h-14 mb-6 bg-slate-900 rounded-sm">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-slate-900 mb-3 tracking-wide">{item.title}</h3>
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-light bg-slate-100 text-slate-700 rounded-sm uppercase tracking-wider">
                      {item.location}
                    </div>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-24 px-4 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-slate-900 mb-12 text-center tracking-tight">{t.work.title}</h2>
              <div className="w-16 h-px bg-slate-900 mx-auto mb-6"></div>
              <p className="text-lg text-slate-600 text-center mb-16 max-w-3xl mx-auto font-light">
                {t.work.subtitle}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {t.work.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-200 rounded-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-slate-900 mt-1 flex-shrink-0" />
                    <p className="text-slate-600 font-light leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
                {t.work.footer}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Investor Brief Request */}
        <section className="py-24 px-4 bg-slate-900">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-12 bg-white rounded-sm border border-slate-200"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-sm mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-light text-slate-900 mb-6 tracking-tight">{t.brief.title}</h2>
                <div className="w-16 h-px bg-slate-900 mx-auto mb-8"></div>
                <p className="text-slate-600 mb-8 font-light max-w-2xl mx-auto">
                  {t.brief.subtitle}
                </p>
                <ul className="text-left text-slate-600 space-y-3 max-w-2xl mx-auto mb-10">
                  {t.brief.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={briefForm.handleSubmit(handleBriefRequest)} className="space-y-5 max-w-lg mx-auto">
                <div>
                  <Input
                    type="text"
                    placeholder={t.brief.namePlaceholder}
                    {...briefForm.register("name")}
                    className="h-12 bg-slate-50 border-slate-300 rounded-sm font-light"
                    disabled={isSubmitting}
                  />
                  {briefForm.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-2 font-light">
                      {String(briefForm.formState.errors.name.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder={t.brief.emailPlaceholder}
                    {...briefForm.register("email")}
                    className="h-12 bg-slate-50 border-slate-300 rounded-sm font-light"
                    disabled={isSubmitting}
                  />
                  {briefForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-2 font-light">
                      {String(briefForm.formState.errors.email.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder={t.brief.orgPlaceholder}
                    {...briefForm.register("organization")}
                    className="h-12 bg-slate-50 border-slate-300 rounded-sm font-light"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-light tracking-wide uppercase text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (language === "en" ? "Submitting..." : "Invio...") : t.brief.button}
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
