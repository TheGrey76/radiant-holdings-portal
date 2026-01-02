import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, CheckCircle, XCircle, ArrowRight, Lightbulb, Database, Video, Target, Building2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";

interface ReelImmobiliareAccessGateProps {
  children: React.ReactNode;
}

const ReelImmobiliareAccessGate = ({ children }: ReelImmobiliareAccessGateProps) => {
  const [email, setEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStored, setIsCheckingStored] = useState(true);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reel_immobiliare_email");
    if (storedEmail) {
      verifyAccess(storedEmail, true);
    } else {
      setIsCheckingStored(false);
    }
  }, []);

  const verifyAccess = async (emailToVerify: string, isFromStorage: boolean = false) => {
    if (!isFromStorage) {
      setIsLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from("reel_immobiliare_access")
        .select("email")
        .eq("email", emailToVerify.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking access:", error);
        toast.error("Errore nella verifica dell'accesso");
        setIsAuthorized(false);
        setIsCheckingStored(false);
        return;
      }

      if (data) {
        setIsAuthorized(true);
        sessionStorage.setItem("reel_immobiliare_email", emailToVerify.toLowerCase().trim());
        if (!isFromStorage) {
          toast.success("Accesso autorizzato");
        }
      } else {
        setIsAuthorized(false);
        sessionStorage.removeItem("reel_immobiliare_email");
        if (!isFromStorage) {
          toast.error("Email non autorizzata");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsAuthorized(false);
      toast.error("Errore nella verifica");
    } finally {
      setIsLoading(false);
      setIsCheckingStored(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Inserisci un indirizzo email");
      return;
    }
    verifyAccess(email);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("reel_immobiliare_email");
    setIsAuthorized(null);
    setEmail("");
  };

  if (isCheckingStored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifica accesso in corso...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized === true) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Esci
          </Button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-2 border-primary/20 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mx-auto shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Building2 className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl mb-2">ReelImmobiliare</CardTitle>
              <CardDescription className="text-base">
                Documento Strategico Riservato
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthorized === false && (
              <motion.div 
                className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive mb-1">Accesso Negato</p>
                  <p className="text-sm text-muted-foreground">
                    L'indirizzo email inserito non è autorizzato.
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Indirizzo Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@azienda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifica in corso...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Accedi al Documento
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground">
                Documento riservato. Accesso solo su invito.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Table of Contents Component
const TableOfContents = ({ activeSection, onSectionClick }: { activeSection: string; onSectionClick: (id: string) => void }) => {
  const sections = [
    { id: "premessa", label: "Premessa", icon: Lightbulb },
    { id: "limite", label: "Limite del Portale", icon: XCircle },
    { id: "paradigma", label: "Dal Contenuto al Dato", icon: Database },
    { id: "infrastruttura", label: "Infrastruttura Tech", icon: Zap },
    { id: "controllo", label: "Controllo Tecnologico", icon: Video },
    { id: "lovable", label: "Lovable come Abilitatore", icon: Zap },
    { id: "b2b", label: "Dal B2C al B2B", icon: Target },
    { id: "conclusione", label: "Conclusione", icon: CheckCircle },
  ];

  return (
    <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Indice</p>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              activeSection === section.id
                ? "bg-primary text-white font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <section.icon className="h-4 w-4" />
            <span className="truncate">{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Progress Bar Component
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-orange-500"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

// Key Point Component with animation
const KeyPoint = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    className="my-8 p-6 bg-gradient-to-r from-primary/10 to-orange-500/10 border-l-4 border-primary rounded-r-xl shadow-lg"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-start gap-3">
      <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
      <p className="font-semibold text-lg text-primary italic leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

// Section Component with collapsible functionality
const Section = ({ 
  id, 
  icon: Icon, 
  title, 
  children,
  defaultOpen = true 
}: { 
  id: string;
  icon: React.ElementType; 
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.section 
      id={id}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 group mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-left">{title}</h2>
        </div>
        <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

// Feature List Component
const FeatureList = ({ items, icon: DefaultIcon = CheckCircle }: { items: string[]; icon?: React.ElementType }) => (
  <ul className="space-y-3 my-4">
    {items.map((item, index) => (
      <motion.li 
        key={index}
        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <DefaultIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <span className="text-muted-foreground">{item}</span>
      </motion.li>
    ))}
  </ul>
);

const ReelImmobiliareContent = () => {
  const [activeSection, setActiveSection] = useState("premessa");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["premessa", "limite", "paradigma", "infrastruttura", "controllo", "lovable", "b2b", "conclusione"];
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>ReelImmobiliare – Evoluzione Strategica | Aries76</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <ReadingProgress />
      <TableOfContents activeSection={activeSection} onSectionClick={scrollToSection} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Building2 className="h-4 w-4 text-primary" />
              Documento Strategico
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Evoluzione Strategica del Progetto{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                ReelImmobiliare
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Da portale video replicabile a piattaforma tecnologica per il Real Estate
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => scrollToSection("premessa")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 mt-4"
              >
                Inizia a leggere
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-16 lg:py-20 lg:pl-72">
        <div className="space-y-16">
          
          <Section id="premessa" icon={Lightbulb} title="Premessa">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Il progetto ReelImmobiliare nasce da un'intuizione corretta e perfettamente allineata ai cambiamenti nei comportamenti digitali degli utenti: il video è diventato il linguaggio principale attraverso cui le persone esplorano, valutano e prendono decisioni.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Nel settore immobiliare, storicamente dominato da fotografie statiche e descrizioni standardizzate, il video rappresenta un'evoluzione naturale e necessaria. Tuttavia, affinché questa intuizione possa trasformarsi in un progetto imprenditoriale sostenibile e scalabile, è fondamentale distinguere tra <strong className="text-foreground">innovazione di formato</strong> e <strong className="text-foreground">innovazione strutturale</strong>.
            </p>
          </Section>

          <Section id="limite" icon={XCircle} title="Il limite strutturale del modello portale">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Nella sua impostazione originaria, ReelImmobiliare viene concepito come un portale immobiliare basato su annunci esclusivamente video. Sebbene questa proposta risulti innovativa dal punto di vista dell'esperienza, presenta un limite strutturale rilevante.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Un portale, per definizione, compete sul traffico, sulla visibilità e sulla capacità di attrarre inserzionisti. Operatori già affermati dispongono di vantaggi difficilmente colmabili: basi utenti consolidate, relazioni commerciali con migliaia di agenzie, brand recognition e capacità di investimento molto superiori.
            </p>
            <KeyPoint>
              Un portale vince se controlla il traffico. ReelImmobiliare non può competere su questo terreno senza bruciare risorse e tempo.
            </KeyPoint>
          </Section>

          <Section id="paradigma" icon={Database} title="Il cambio di paradigma: dal contenuto al dato">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Il vero valore potenziale di ReelImmobiliare emerge quando il video smette di essere considerato un semplice contenuto di presentazione e viene ripensato come <strong className="text-foreground">fonte primaria di dati</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Un video immobiliare contiene una quantità enorme di informazione latente: struttura degli ambienti, qualità percepita, luminosità, materiali, contesto, ma anche informazioni sul comportamento degli utenti che lo guardano.
            </p>
            <KeyPoint>
              Il video non è marketing. Il video è un sensore.
            </KeyPoint>
          </Section>

          <Section id="infrastruttura" icon={Zap} title="Perché un'infrastruttura tecnologica è diversa da un portale">
            <p className="text-muted-foreground leading-relaxed text-lg">
              In un portale tradizionale, il valore è generato dalla pubblicazione degli annunci. In una piattaforma tecnologica, il valore è generato dall'elaborazione dei dati.
            </p>
            <FeatureList items={[
              "Analizza automaticamente il contenuto visivo e narrativo",
              "Riconosce e classifica gli ambienti",
              "Costruisce metadati strutturati sugli immobili",
              "Raccoglie dati comportamentali granulari sugli utenti",
              "Correla tali dati con eventi reali (richieste di visita, offerte, vendite)"
            ]} />
            <KeyPoint>
              Un portale mostra annunci. Una piattaforma costruisce conoscenza.
            </KeyPoint>
          </Section>

          <Section id="controllo" icon={Video} title="Il ruolo centrale del controllo tecnologico">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Perché questo modello funzioni, è essenziale che la piattaforma mantenga il controllo sull'intera catena del valore del video: dallo storage allo streaming, dal player alle interazioni, fino alla pipeline di analisi e al data layer.
            </p>
            <KeyPoint>
              Se non controlli il player e i dati, non stai costruendo una piattaforma, ma una vetrina.
            </KeyPoint>
          </Section>

          <Section id="lovable" icon={Zap} title="Lovable come abilitatore, non come limite">
            <p className="text-muted-foreground leading-relaxed text-lg">
              L'utilizzo di strumenti no-code come Lovable può rappresentare una scelta estremamente efficace, se correttamente posizionata. Lovable è adatto a costruire rapidamente il portale, gestire utenti, annunci e flussi di navigazione.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Tuttavia, Lovable non deve essere confuso con il cuore tecnologico della piattaforma. Il suo ruolo ideale è quello di layer di presentazione e orchestrazione, mentre il valore strategico risiede nel backend proprietario.
            </p>
            <KeyPoint>
              Lovable accelera il prodotto. Il backend protegge il valore.
            </KeyPoint>
          </Section>

          <Section id="b2b" icon={Target} title="Dal B2C fragile al B2B scalabile">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Un portale consumer richiede volumi di traffico elevatissimi. Una piattaforma tecnologica B2B, invece, può creare valore servendo un numero limitato di clienti professionali ad alto valore.
            </p>
            <FeatureList 
              items={[
                "Migliorare la qualità degli annunci",
                "Ridurre visite inutili",
                "Qualificare meglio i lead",
                "Prendere decisioni basate su dati reali"
              ]} 
              icon={ArrowRight} 
            />
            <KeyPoint>
              Meglio pochi clienti che pagano per il valore, che molti utenti che consumano contenuti.
            </KeyPoint>
          </Section>

          {/* Conclusione */}
          <motion.section 
            id="conclusione"
            className="scroll-mt-24 mt-20 p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-white/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Conclusione: il senso dello shift strategico</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg mb-4">
              Il passaggio da portale a piattaforma non è un dettaglio tecnico, ma una scelta strategica fondamentale. Un portale video immobiliare è facilmente replicabile e strutturalmente fragile.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg mb-8">
              Una piattaforma tecnologica che trasforma i video in dati crea, invece, un asset che cresce nel tempo, migliora con l'uso e diventa sempre più difficile da sostituire.
            </p>
            <div className="p-6 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-2xl border border-white/10">
              <p className="font-bold text-xl text-center italic leading-relaxed">
                "Il valore di ReelImmobiliare non è nel mostrare immobili. È nel capire, meglio di chiunque altro, come vengono davvero scelti."
              </p>
            </div>
          </motion.section>

          {/* Footer */}
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Documento riservato – Aries76 Capital Advisory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReelImmobiliare = () => {
  return (
    <ReelImmobiliareAccessGate>
      <ReelImmobiliareContent />
    </ReelImmobiliareAccessGate>
  );
};

export default ReelImmobiliare;
