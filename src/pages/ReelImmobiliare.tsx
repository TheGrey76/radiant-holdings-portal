import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, CheckCircle, XCircle, ArrowRight, Lightbulb, Database, Video, Target, Building2, Zap, ChevronDown, ChevronUp, Layers, Eye, Settings, Shield, BarChart3, Calendar, Users, FileText, AlertTriangle, Briefcase } from "lucide-react";
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
                Analisi Strategica e Tecnologica
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
const TableOfContents = ({ activeSection, onSectionClick, isVisible }: { activeSection: string; onSectionClick: (id: string) => void; isVisible: boolean }) => {
  const sections = [
    { id: "scopo", label: "Scopo", icon: FileText },
    { id: "sintesi", label: "Sintesi Esecutiva", icon: Briefcase },
    { id: "fragilita", label: "Fragilità Portale", icon: AlertTriangle },
    { id: "shift", label: "Video come Sensore", icon: Eye },
    { id: "vimeo", label: "Perché non Vimeo", icon: XCircle },
    { id: "alternative", label: "Mux vs api.video", icon: Layers },
    { id: "lovable", label: "Lovable", icon: Zap },
    { id: "architettura", label: "Architettura", icon: Settings },
    { id: "roadmap", label: "Roadmap 6 Mesi", icon: Calendar },
    { id: "kpi", label: "KPI e Metriche", icon: BarChart3 },
    { id: "business", label: "Modello di Business", icon: Target },
    { id: "rischi", label: "Rischi", icon: Shield },
    { id: "governance", label: "Governance", icon: Users },
    { id: "conclusione", label: "Conclusione", icon: CheckCircle },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 max-h-[80vh] overflow-y-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Indice</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <section.icon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
const KeyPoint = ({ children, label = "Key concept" }: { children: React.ReactNode; label?: string }) => (
  <motion.div 
    className="my-8 p-6 bg-gradient-to-r from-primary/10 to-orange-500/10 border-l-4 border-primary rounded-r-xl shadow-lg"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-start gap-3">
      <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
      <p className="font-semibold text-lg text-primary italic leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

// Decision Rule Component
const DecisionRule = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    className="my-8 p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-500 rounded-r-xl shadow-lg"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Decision Rule</p>
    <div className="flex items-start gap-3">
      <Settings className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="font-semibold text-lg text-blue-600 italic leading-relaxed">{children}</p>
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

// Subsection Component
const Subsection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6 mb-4">
    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
      <ArrowRight className="h-4 w-4 text-primary" />
      {title}
    </h3>
    {children}
  </div>
);

// Roadmap Phase Component
const RoadmapPhase = ({ phase, title, items }: { phase: string; title: string; items: string[] }) => (
  <motion.div 
    className="p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border mb-4"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
        {phase}
      </div>
      <h4 className="font-semibold text-foreground">{title}</h4>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

const ReelImmobiliareContent = () => {
  const [activeSection, setActiveSection] = useState("scopo");
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowToc(window.scrollY > 400);
      
      const sections = ["scopo", "sintesi", "fragilita", "shift", "vimeo", "alternative", "lovable", "architettura", "roadmap", "kpi", "business", "rischi", "governance", "conclusione"];
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
        <title>ReelImmobiliare – Analisi Strategica e Tecnologica | Aries76</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <ReadingProgress />
      <TableOfContents activeSection={activeSection} onSectionClick={scrollToSection} isVisible={showToc} />
      
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
              <Building2 className="h-4 w-4 text-orange-400" />
              Aries76 Capital Intelligence
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-white">Reel </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Immobiliare
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl text-slate-200">Analisi Strategica e Tecnologica</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Da portale video replicabile a piattaforma tecnologica data-driven per il Real Estate
            </p>

            <p className="text-sm text-slate-400">
              02 January 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-16 lg:py-20 lg:pl-56">
        <div className="space-y-16">
          
          {/* 1. Scopo del documento */}
          <Section id="scopo" icon={FileText} title="1. Scopo del documento">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Questo documento consolida e approfondisce la business review sviluppata in sede di confronto strategico, con l'obiettivo di rendere esplicito lo shift necessario per trasformare ReelImmobiliare da iniziativa "portale video" – intrinsecamente replicabile e fragile – a <strong className="text-foreground">piattaforma tecnologica data-driven per il Real Estate</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Il focus è duplice: (i) chiarire le implicazioni competitive e di modello economico; (ii) descrivere in modo operativo come i video possano generare dati proprietari, quali componenti architetturali siano indispensabili e quali scelte tecnologiche risultino più coerenti (Vimeo vs Mux vs api.video; Lovable come frontend).
            </p>
          </Section>

          {/* 2. Sintesi esecutiva */}
          <Section id="sintesi" icon={Briefcase} title="2. Sintesi esecutiva">
            <p className="text-muted-foreground leading-relaxed text-lg">
              L'intuizione originaria – spostare l'esperienza immobiliare verso un formato video "reel-like" – è corretta dal punto di vista dell'evoluzione dei comportamenti digitali. Tuttavia, un portale video-only compete inevitabilmente sul traffico e sulla distribuzione, terreno nel quale gli incumbent (portali immobiliari e marketplace consolidati) possiedono vantaggi strutturali (brand, basi utenti, supply delle agenzie, budget marketing).
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              In questa configurazione, l'innovazione di formato è una feature facilmente replicabile e non genera difendibilità né pricing power.
            </p>
            <KeyPoint>
              Un portale compete sulla visibilità. Una piattaforma compete sull'intelligenza (dati, correlazioni, learning nel tempo).
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              La traiettoria investibile e industrialmente credibile consiste nel riposizionare ReelImmobiliare come <strong className="text-foreground">infrastruttura B2B</strong>: un layer tecnologico che trasforma i video immobiliari in dati strutturati (semantic enrichment) e raccoglie dati comportamentali granulari (event-level analytics) attraverso un player controllato.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Il valore si accumula con l'uso: dataset proprietario, modelli predittivi, insight su conversione e pricing. Questo abilita un modello SaaS per agenzie e network (ricavi ricorrenti) e una narrativa di partnership/licensing verso player più grandi.
            </p>
          </Section>

          {/* 3. Perché il modello "portale video" è fragile */}
          <Section id="fragilita" icon={AlertTriangle} title="3. Perché il modello 'portale video' è fragile">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Un portale consumer, per generare valore, richiede una massa critica di traffico e una supply ampia e costante di annunci. L'ingresso in un mercato dominato da incumbent comporta un "cold start problem" severo: senza traffico le agenzie non caricano contenuti; senza contenuti gli utenti non arrivano.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              In aggiunta, il formato video e l'interfaccia "reel-like" sono facilmente replicabili e possono essere inglobati dagli incumbent senza costi strategici rilevanti.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Ne deriva un rischio di posizionamento: ReelImmobiliare sarebbe percepito come un canale aggiuntivo, non come uno strumento indispensabile. In assenza di dati proprietari e di un valore operativo misurabile per le agenzie (riduzione visite inutili, miglioramento conversione, qualità lead), la disponibilità a pagare resta limitata e l'economia del progetto tende a dipendere da advertising o fee di lead generation, modelli in cui la competizione è principalmente di scala.
            </p>
            <KeyPoint>
              Se l'asset principale è il traffico, il vantaggio competitivo è di scala. Se l'asset principale sono i dati, il vantaggio è cumulativo.
            </KeyPoint>
          </Section>

          {/* 4. Lo shift: il video come sensore */}
          <Section id="shift" icon={Eye} title="4. Lo shift: il video come sensore e generatore di dati">
            <p className="text-muted-foreground leading-relaxed text-lg">
              La trasformazione strategica consiste nel considerare ogni video non come semplice contenuto promozionale, ma come <strong className="text-foreground">sensore digitale</strong> che osserva simultaneamente l'immobile e il comportamento dell'utente. Da qui discendono due famiglie di dati:
            </p>

            <Subsection title="4.1 Dati estratti dal contenuto (computer vision + NLP)">
              <p className="text-muted-foreground leading-relaxed">
                Attraverso scene detection e modelli di visione è possibile riconoscere ambienti (cucina, soggiorno, camere, bagni, esterni), identificare macro-caratteristiche (open space vs separato, presenza balconi/terrazzi, vista, luminosità), e costruire una rappresentazione semantica dell'immobile.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Se è presente voice-over, la trascrizione consente di estrarre attributi dichiarati dall'agente e di normalizzarli in metadati strutturati.
              </p>
            </Subsection>

            <Subsection title="4.2 Dati comportamentali (event-level analytics)">
              <p className="text-muted-foreground leading-relaxed">
                Il valore più difendibile deriva dal comportamento: pause, seek, replay, skip, drop-off, tempo di permanenza per segmento, sequenze di visione e azioni successive (contatto, richiesta visita).
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Questi segnali permettono di costruire heatmap di attenzione e, soprattutto, correlazioni robuste fra contenuto e conversione. È qui che il video diventa "intelligence layer" e non semplice media.
              </p>
            </Subsection>

            <KeyPoint>
              I dati aggregati (views, completion rate) sono marketing. I dati evento-per-evento sono decision intelligence.
            </KeyPoint>
          </Section>

          {/* 5. Perché Vimeo non è sufficiente */}
          <Section id="vimeo" icon={XCircle} title="5. Perché Vimeo non è sufficiente">
            <p className="text-muted-foreground leading-relaxed text-lg">
              L'idea originaria di ospitare i video su Vimeo e incorporarli nel portale è coerente con un MVP orientato alla fruizione, ma non con una piattaforma dati. Vimeo fornisce metriche prevalentemente aggregate e non consente un controllo profondo del player né la strumentazione granulare degli eventi necessari per costruire un dataset proprietario e correlabile a user, immobile e outcome.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              In aggiunta, Vimeo non esegue analisi semantica del contenuto per finalità di intelligence proprietaria. Il video resta un file: si ottiene una vetrina più moderna, ma non si crea un asset che migliori nel tempo. Questo rende il progetto più replicabile e meno investibile.
            </p>
          </Section>

          {/* 6. Alternative consigliate */}
          <Section id="alternative" icon={Layers} title="6. Alternative consigliate: Mux e api.video">
            <Subsection title="6.1 Mux: infrastruttura 'platform-first'">
              <p className="text-muted-foreground leading-relaxed">
                Mux è un layer infrastrutturale video pensato per prodotti digitali che necessitano di controllo, affidabilità e osservabilità. È particolarmente coerente con l'obiettivo di raccogliere dati comportamentali granulari, perché si integra bene con player custom e fornisce telemetria utile alla costruzione di analytics avanzati.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Mux non sostituisce il layer di computer vision (che resta esterno e proprietario), ma copre in modo solido streaming e interaction analytics, riducendo rischi operativi e time-to-market.
              </p>
            </Subsection>

            <Subsection title="6.2 api.video: soluzione 'speed-first'">
              <p className="text-muted-foreground leading-relaxed">
                api.video è una scelta valida per prototipi e MVP rapidi, con API semplici e integrazione veloce. È indicata se l'obiettivo è testare la fruizione e la supply di contenuti in 30–60 giorni.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Tuttavia, per una traiettoria data-driven, la profondità dell'osservabilità e la capacità di strumentazione tendono a essere inferiori rispetto a soluzioni più orientate a platform analytics. Il rischio è che il video rimanga una feature e non diventi un asset dati.
              </p>
            </Subsection>

            <DecisionRule>
              Se l'obiettivo è costruire un "data moat" nel tempo, Mux è più coerente. Se l'obiettivo è validare la UX rapidamente, api.video può essere transitorio.
            </DecisionRule>
          </Section>

          {/* 7. Lovable */}
          <Section id="lovable" icon={Zap} title="7. Lovable: fattibile, ma nel ruolo corretto">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Costruire il portale con Lovable è fattibile e, se correttamente impostato, consigliabile per accelerare time-to-market: gestione pagine, autenticazione, workflow utente, UI "reel-like", dashboard base e integrazione con API esterne.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Il punto critico è evitare che Lovable diventi il layer core del video e dei dati. La piattaforma deve adottare una <strong className="text-foreground">separazione netta</strong>: Lovable come frontend/orchestrazione, backend proprietario per video intelligence, player strumentato e data layer.
            </p>
            <KeyPoint>
              Lovable accelera il prodotto. Il backend (player + dati + AI) protegge il valore e la difendibilità.
            </KeyPoint>
          </Section>

          {/* 8. Architettura di riferimento */}
          <Section id="architettura" icon={Settings} title="8. Architettura di riferimento (modulare)">
            <p className="text-muted-foreground leading-relaxed text-lg">
              L'architettura consigliata è modulare e progressiva. Il video viene caricato su un layer infrastrutturale (storage/streaming), distribuito tramite CDN e riprodotto da un player controllato (embedded nel portale).
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Il player invia eventi granulari a un event collector, che alimenta il data layer. In parallelo, una pipeline di processing analizza i video (scene detection, tagging semantico, trascrizione) e genera metadati e embedding per la ricerca.
            </p>

            <Subsection title="8.1 Componenti minimi (MVP data-driven)">
              <FeatureList items={[
                "Upload + streaming affidabile (Mux o stack cloud equivalente)",
                "Player strumentato con tracking eventi",
                "Event pipeline e database per correlare eventi a immobili e utenti",
                "Pipeline AI minima per tagging ambienti e trascrizione del voice-over"
              ]} />
              <p className="text-muted-foreground leading-relaxed mt-3">
                Questi elementi consentono già di produrre heatmap di attenzione e insight basici sulla conversione, evitando di costruire una vetrina priva di apprendimento.
              </p>
            </Subsection>
          </Section>

          {/* 9. Roadmap operativa 6 mesi */}
          <Section id="roadmap" icon={Calendar} title="9. Roadmap operativa 6 mesi">
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              La roadmap deve bilanciare velocità e costruzione dell'asset dati. In 6 mesi è realistico passare da MVP a pilot B2B misurabile, con metriche di riduzione visite inutili e miglioramento conversione.
            </p>

            <RoadmapPhase 
              phase="Mese 1–2"
              title="MVP controllato"
              items={[
                "Implementazione portale (Lovable), flussi upload, player strumentato",
                "Tracking eventi base, data schema, reportistica iniziale",
                "Selezione di 3–5 agenzie pilota",
                "Definizione del protocollo video (linee guida minime per standardizzare i contenuti)"
              ]}
            />

            <RoadmapPhase 
              phase="Mese 3–4"
              title="Enrichment e metriche"
              items={[
                "Introduzione pipeline AI per tagging ambienti e trascrizione",
                "Prime heatmap e report per agenzie",
                "Raccolta feedback",
                "Definizione metriche chiave: conversione a richiesta visita, drop-off, tempi di decisione, qualità lead (proxy)"
              ]}
            />

            <RoadmapPhase 
              phase="Mese 5–6"
              title="Correlazione con outcome e packaging B2B"
              items={[
                "Collegamento degli eventi a outcome (visita, offerta, vendita) laddove disponibile",
                "Costruzione di dashboard B2B",
                "Definizione del pricing SaaS e del pacchetto commerciale",
                "Preparazione di case study misurabili e materiali per partnership"
              ]}
            />
          </Section>

          {/* 10. KPI e misurazione */}
          <Section id="kpi" icon={BarChart3} title="10. KPI e misurazione del valore">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Per governare correttamente il progetto occorre evitare metriche vanity (views, like) e misurare impatti operativi.
            </p>
            <FeatureList 
              items={[
                "Riduzione delle visite non qualificate",
                "Tempo medio dalla prima visualizzazione alla richiesta visita",
                "Tasso di conversione per segmento video",
                "Qualità dei lead (richieste con informazioni complete)",
                "Correlazione con offerte e vendite (in fase avanzata)"
              ]} 
              icon={BarChart3}
            />
          </Section>

          {/* 11. Modello di business */}
          <Section id="business" icon={Target} title="11. Modello di business e pricing">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Il modello portale tende verso advertising e fee su lead, con elevata dipendenza da scala. Il modello piattaforma abilita un <strong className="text-foreground">SaaS B2B</strong>: abbonamenti ricorrenti per agenzie/network, con livelli basati su numero annunci/video e profondità analytics.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              L'upsell naturale è su: dashboard avanzate, integrazioni CRM, white-label, e – in fase successiva – licensing dei modelli/insight verso player più grandi.
            </p>
            <KeyPoint>
              Meglio pochi clienti che pagano per efficienza e dati, che molti utenti che consumano contenuti senza monetizzazione certa.
            </KeyPoint>
          </Section>

          {/* 12. Rischi principali */}
          <Section id="rischi" icon={Shield} title="12. Rischi principali e mitigazioni">
            <FeatureList 
              items={[
                "Supply insufficiente di contenuti video → mitigazione: pilot con agenzie selezionate e standard di produzione",
                "Deriva verso un portale consumer non monetizzabile → mitigazione: KPI B2B e dashboard",
                "Lock-in tecnologico su soluzioni che limitano i dati → mitigazione: player controllato e data layer proprietario",
                "Compliance e privacy → mitigazione: GDPR by design, minimizzazione dati, consenso e retention policy"
              ]} 
              icon={AlertTriangle}
            />
          </Section>

          {/* 13. Governance dell'innovazione */}
          <Section id="governance" icon={Users} title="13. Governance dell'innovazione">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Lo shift proposto non è una decisione "una tantum", ma un percorso che richiede governance: priorità di sviluppo, trade-off fra velocità e difendibilità, definizione e controllo delle metriche, packaging commerciale B2B, e mantenimento della coerenza strategica.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Il valore dell'advisory sta nel prevenire mesi di sviluppo nella direzione sbagliata (debito strategico), mantenendo la piattaforma focalizzata su ciò che genera asset dati e monetizzazione.
            </p>
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
            <p className="text-slate-300 leading-relaxed text-lg mb-4">
              Una piattaforma tecnologica che trasforma i video in dati crea, invece, un asset che cresce nel tempo, migliora con l'uso e diventa sempre più difficile da sostituire.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg mb-8">
              Lo shift proposto non snatura l'idea originale, ma la porta a maturità, trasformando un'intuizione corretta in un progetto con basi industriali solide.
            </p>
            <div className="p-6 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-2xl border border-white/10">
              <p className="font-bold text-xl text-center italic leading-relaxed">
                "Il valore di ReelImmobiliare non è nel mostrare immobili. È nel capire, meglio di chiunque altro, come vengono davvero scelti."
              </p>
            </div>
          </motion.section>

          {/* Footer */}
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Documento riservato – Aries76 Capital Intelligence</p>
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
