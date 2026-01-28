import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Lock, Mail, XCircle, ArrowLeft, Target, AlertTriangle, TrendingUp, 
  Users, DollarSign, BarChart3, Calendar, MessageSquare, Video, 
  Megaphone, Lightbulb, CheckCircle, Clock, Zap, ChevronDown, ChevronUp,
  Instagram, Facebook
} from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Access Gate Component (shared logic with main page)
const ReelSocialAccessGate = ({ children }: { children: React.ReactNode }) => {
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
        <div className="fixed top-20 right-6 z-40">
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
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mx-auto shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Megaphone className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl mb-2">ReelImmobiliare</CardTitle>
              <CardDescription className="text-base">
                Strategia Social Media
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

              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600" disabled={isLoading}>
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
        className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

// Collapsible Section
const Section = ({ 
  id, 
  icon: Icon, 
  title, 
  children,
  defaultOpen = true,
  iconColor = "text-pink-500"
}: { 
  id: string;
  icon: React.ElementType; 
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  iconColor?: string;
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
      <Card className="mb-8 overflow-hidden border-l-4 border-l-pink-500 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-orange-500/20`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="prose prose-slate max-w-none">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.section>
  );
};

// Key Insight Component
const KeyInsight = ({ children, type = "strength" }: { children: React.ReactNode; type?: "strength" | "problem" | "action" }) => {
  const styles = {
    strength: "from-green-500/10 to-emerald-500/10 border-green-500 text-green-700",
    problem: "from-red-500/10 to-orange-500/10 border-red-500 text-red-700",
    action: "from-blue-500/10 to-indigo-500/10 border-blue-500 text-blue-700"
  };
  
  const icons = {
    strength: CheckCircle,
    problem: AlertTriangle,
    action: Lightbulb
  };
  
  const Icon = icons[type];

  return (
    <motion.div 
      className={`my-6 p-5 bg-gradient-to-r ${styles[type]} border-l-4 rounded-r-xl`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="font-medium leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
};

// Metric Card
const MetricCard = ({ label, value, description }: { label: string; value: string; description?: string }) => (
  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="text-2xl font-bold text-primary">{value}</p>
    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
  </div>
);

// Main Content Component
const SocialStrategyContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Reel Immobiliare - Strategia Social Media | Aries76</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <ReadingProgress />

      {/* Header */}
      <header className="pt-24 pb-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/reelimmobiliare" 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al Business Plan
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700">
                <Facebook className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-black">
                <Video className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Strategia Social Media
            </h1>
            <p className="text-xl text-slate-300 mb-2">ReelImmobiliare</p>
            <p className="text-slate-400">Analisi e Piano Operativo</p>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Executive Summary */}
        <Section id="summary" icon={Target} title="Valutazione del Piano Social Media">
          <p className="text-lg text-muted-foreground mb-6">
            Analisi approfondita della strategia social proposta per ReelImmobiliare, con identificazione 
            di punti di forza, criticità e raccomandazioni operative.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <MetricCard label="Punti di Forza" value="3" description="Aspetti positivi" />
            <MetricCard label="Criticità Identificate" value="6" description="Aree da migliorare" />
            <MetricCard label="Quick Wins" value="12" description="Azioni immediate" />
          </div>
        </Section>

        {/* Punti di Forza */}
        <Section id="strengths" icon={CheckCircle} title="Punti di Forza della Strategia">
          <h4 className="font-semibold text-lg mb-3">1. Visione Strategica Chiara</h4>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Il posizionamento "da portale a media" è forte e differenziante</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>L'approccio a fasi (Awareness → Partnership → Autorità) è corretto</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Comprensione del valore dei dati oltre le vanity metrics</span>
            </li>
          </ul>

          <h4 className="font-semibold text-lg mb-3">2. Multi-Platform Pensato</h4>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>TikTok, Instagram, Facebook con logiche diverse per ciascuno</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Riconoscimento delle diverse audience per piattaforma</span>
            </li>
          </ul>

          <h4 className="font-semibold text-lg mb-3">3. Focus sui Reel</h4>
          <KeyInsight type="strength">
            Formato giusto per il 2025. Coerente con il trend video-first.
          </KeyInsight>
        </Section>

        {/* Criticità */}
        <Section id="problems" icon={AlertTriangle} title="Criticità e Aree da Migliorare">
          
          {/* Problema 1 */}
          <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-100">
            <h4 className="font-semibold text-lg text-red-700 mb-3">PROBLEMA 1: Strategia troppo teorica, poco operativa</h4>
            <p className="text-muted-foreground mb-4"><strong>Cosa manca:</strong></p>
            <ul className="grid md:grid-cols-2 gap-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Piano editoriale concreto
              </li>
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Esempi di copy reali
              </li>
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Tone of voice definito
              </li>
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Visual identity/moodboard
              </li>
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Hashtag strategy
              </li>
              <li className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Call-to-action specifiche
              </li>
            </ul>
            
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-semibold text-sm text-green-700 mb-2">📅 Esempio: Settimana Tipo - Fase 1 (Awareness)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">LUNEDÌ</p>
                  <p className="text-muted-foreground">TikTok (17:00): Reel provocatorio "Quanto tempo hai perso in visite inutili?"</p>
                </div>
                <div>
                  <p className="font-medium">MERCOLEDÌ</p>
                  <p className="text-muted-foreground">TikTok (19:00): Before/After ricerca casa (vecchio modo vs nuovo)</p>
                </div>
                <div>
                  <p className="font-medium">VENERDÌ</p>
                  <p className="text-muted-foreground">TikTok (18:30): Testimonial "Ho risparmiato 3 settimane grazie ai reel"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Problema 2 */}
          <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-lg text-amber-700 mb-3">PROBLEMA 2: Target Confuso</h4>
            <p className="text-muted-foreground mb-4">
              Il piano parla a <strong>3 audience diverse</strong> ma non distingue i contenuti:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-primary mb-2">Utenti finali (70%)</p>
                <p className="text-xs text-muted-foreground">Storytelling emozionale, problemi quotidiani della ricerca casa</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-primary mb-2">Agenzie (20%)</p>
                <p className="text-xs text-muted-foreground">Dati, case study, ROI - contenuti B2B</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-primary mb-2">Press/Authority (10%)</p>
                <p className="text-xs text-muted-foreground">Innovazione, numeri, crescita</p>
              </div>
            </div>
          </div>

          {/* Problema 3 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-lg text-blue-700 mb-3">PROBLEMA 3: Content Pillars Non Definiti</h4>
            <p className="text-muted-foreground mb-4">Serve struttura ripetibile con 4 pilastri tematici:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-blue-600">📚 EDUCATION (30%)</p>
                <p className="text-xs text-muted-foreground mt-1">Come funziona la ricerca casa, cosa guardare, differenze quartieri</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-pink-600">🎬 ENTERTAINMENT (40%)</p>
                <p className="text-xs text-muted-foreground mt-1">Tour case particolari, fail visite, case assurde</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-green-600">⭐ SOCIAL PROOF (20%)</p>
                <p className="text-xs text-muted-foreground mt-1">Testimonial, agenzie partner, numeri progetto</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-orange-600">🎥 BEHIND THE SCENES (10%)</p>
                <p className="text-xs text-muted-foreground mt-1">Come nasce un Reel, team al lavoro, tecnologia AI</p>
              </div>
            </div>
          </div>

          {/* Altri problemi in lista */}
          <div className="space-y-4">
            <KeyInsight type="problem">
              <strong>PROBLEMA 4:</strong> Zero strategia di engagement - manca playbook per commenti, DM automation, community activation
            </KeyInsight>
            <KeyInsight type="problem">
              <strong>PROBLEMA 5:</strong> Nessuna strategia Paid - reach organica su Meta è &lt;5%. Budget minimo consigliato: €2000/mese
            </KeyInsight>
            <KeyInsight type="problem">
              <strong>PROBLEMA 6:</strong> KPI vaghi - il documento parla di "dati" e "performance" ma non definisce cosa misurare
            </KeyInsight>
          </div>
        </Section>

        {/* Piano Operativo */}
        <Section id="operational" icon={Calendar} title="Piano Operativo Migliorato">
          
          <h4 className="font-semibold text-lg mb-4">Fase Pre-Lancio (6-8 settimane prima)</h4>
          
          <div className="space-y-6 mb-8">
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h5 className="font-semibold text-purple-700 mb-3">SETTIMANE 1-2: TEASING</h5>
              <p className="text-sm text-muted-foreground mb-3">Obiettivo: Curiosità senza rivelare tutto</p>
              <ul className="space-y-2 text-sm">
                <li>• "Sto per lanciare qualcosa che cambierà la ricerca casa"</li>
                <li>• "Hai mai pensato che le foto degli annunci mentono?"</li>
                <li>• POV di visite immobiliari andate male</li>
              </ul>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h5 className="font-semibold text-blue-700 mb-3">SETTIMANE 3-4: REVEAL</h5>
              <p className="text-sm text-muted-foreground mb-3">Obiettivo: Spiegare cos'è Reel Immobiliare</p>
              <ul className="space-y-2 text-sm">
                <li>• "Vi presento Reel Immobiliare"</li>
                <li>• Come funziona (spiegato in 30 sec)</li>
                <li>• Prime case in anteprima</li>
              </ul>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
              <h5 className="font-semibold text-orange-700 mb-3">SETTIMANE 5-6: HYPE</h5>
              <p className="text-sm text-muted-foreground mb-3">Obiettivo: Costruire lista d'attesa</p>
              <ul className="space-y-2 text-sm">
                <li>• Contest: "Tagga chi sta cercando casa"</li>
                <li>• Early bird access per primi 1000 iscritti</li>
                <li>• Collaborazioni con micro-influencer</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-lg mb-4">Fase Post-Lancio (primi 3 mesi)</h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="font-semibold text-sm mb-2">📆 DAILY</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• 2 Reel TikTok</li>
                <li>• 1 Reel Instagram + Stories</li>
                <li>• Risposta a commenti</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="font-semibold text-sm mb-2">📅 WEEKLY</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• 2-3 post Facebook</li>
                <li>• 1 video lungo</li>
                <li>• Newsletter</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="font-semibold text-sm mb-2">📊 MONTHLY</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Report trasparenza</li>
                <li>• Evento community</li>
                <li>• Aggiornamento feature</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* KPI */}
        <Section id="kpi" icon={BarChart3} title="KPI per Fase">
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h5 className="font-semibold text-emerald-700 mb-4">FASE 1 - AWARENESS (primi 2 mesi)</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Impression" value="500K+" />
                <MetricCard label="Follower" value="5K+" />
                <MetricCard label="Engagement" value=">3%" />
                <MetricCard label="CPF" value="<€0.50" />
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h5 className="font-semibold text-blue-700 mb-4">FASE 2 - CONSIDERATION (mesi 3-6)</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Click" value="2K+/mese" />
                <MetricCard label="Lead" value="500+" />
                <MetricCard label="Salvataggi" value="1K+/mese" />
                <MetricCard label="Agenzie WL" value="20+" />
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h5 className="font-semibold text-purple-700 mb-4">FASE 3 - CONVERSION (mesi 6+)</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Iscrizioni" value="100+/sett" />
                <MetricCard label="Retention" value=">60%" />
                <MetricCard label="Viral Coef." value="1.2" />
                <MetricCard label="Contenuti Virali" value="1-2" />
              </div>
            </div>
          </div>
        </Section>

        {/* Budget */}
        <Section id="budget" icon={DollarSign} title="Budget Allocation">
          <p className="text-muted-foreground mb-6">
            Ipotesi budget €2000/mese fase iniziale
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-5 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border border-pink-200 text-center">
              <p className="text-3xl font-bold text-pink-600">€800</p>
              <p className="font-semibold mt-2">TikTok Ads (40%)</p>
              <p className="text-xs text-muted-foreground mt-1">Spark Ads sui Reel organici più performanti</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border border-blue-200 text-center">
              <p className="text-3xl font-bold text-blue-600">€800</p>
              <p className="font-semibold mt-2">Meta Ads (40%)</p>
              <p className="text-xs text-muted-foreground mt-1">Retargeting + Lead gen + Lookalike</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-200 text-center">
              <p className="text-3xl font-bold text-amber-600">€400</p>
              <p className="font-semibold mt-2">Testing (20%)</p>
              <p className="text-xs text-muted-foreground mt-1">A/B test su copy, visual, CTA</p>
            </div>
          </div>

          <KeyInsight type="action">
            <strong>Budget minimo consigliato:</strong> €2000-3000/mese (€1500 paid ads + €500-1000 tools + €500 contingency)
          </KeyInsight>
        </Section>

        {/* Quick Wins */}
        <Section id="quickwins" icon={Zap} title="Quick Wins Immediate">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-green-50 rounded-xl border border-green-200">
              <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                SETTIMANA 1
              </h5>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Creare profili TikTok, Instagram, Facebook</li>
                <li>✓ Visual identity base</li>
                <li>✓ Bio ottimizzate con link waitlist</li>
                <li>✓ Primi 10 video girati</li>
              </ul>
            </div>
            
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                SETTIMANA 2
              </h5>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ TikTok Business Account</li>
                <li>✓ Meta Business Manager</li>
                <li>✓ Pixel installato</li>
                <li>✓ Calendario editoriale mese 1</li>
              </ul>
            </div>
            
            <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
              <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                SETTIMANA 3
              </h5>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Lanciare prima campagna teasing</li>
                <li>✓ Engagement su profili competitor</li>
                <li>✓ Identificare 10 micro-influencer</li>
                <li>✓ Creare gruppo Facebook community</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Tone of Voice */}
        <Section id="tov" icon={MessageSquare} title="Tone of Voice Definito">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-green-50 rounded-xl border border-green-200">
              <h5 className="font-semibold text-green-700 mb-3">✅ COSA SIAMO</h5>
              <ul className="text-sm space-y-2">
                <li>• Innovativi ma accessibili</li>
                <li>• Tecnici ma comprensibili</li>
                <li>• Professionali ma friendly</li>
                <li>• Diretti senza essere aggressivi</li>
              </ul>
            </div>
            
            <div className="p-5 bg-red-50 rounded-xl border border-red-200">
              <h5 className="font-semibold text-red-700 mb-3">❌ COSA NON SIAMO</h5>
              <ul className="text-sm space-y-2">
                <li>• Corporate e distanti</li>
                <li>• Troppo casual/immaturi</li>
                <li>• Venditore insistente</li>
                <li>• Snob o elitari</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-5 bg-slate-50 rounded-xl border">
            <h5 className="font-semibold mb-3">Esempi Linguaggio</h5>
            <div className="space-y-2 text-sm">
              <p><span className="text-green-600 font-medium">✅</span> "Cercare casa non deve essere un incubo"</p>
              <p><span className="text-red-600 font-medium">❌</span> "Rivoluzioneremo il mercato immobiliare"</p>
              <p><span className="text-green-600 font-medium">✅</span> "Risparmia tempo, vedi solo quello che ti interessa"</p>
              <p><span className="text-red-600 font-medium">❌</span> "Ottimizza il tuo processo di property acquisition"</p>
            </div>
          </div>
        </Section>

        {/* Metriche di Successo */}
        <Section id="metrics" icon={TrendingUp} title="Metriche di Successo Realistiche">
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl border flex items-center justify-between">
              <div>
                <p className="font-semibold">MESE 1</p>
                <p className="text-sm text-muted-foreground">2K follower • 200K impression • 50 lead • €0.80 CPL</p>
              </div>
              <div className="text-3xl">🌱</div>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-emerald-100 to-teal-50 rounded-xl border flex items-center justify-between">
              <div>
                <p className="font-semibold">MESE 3</p>
                <p className="text-sm text-muted-foreground">8K follower • 1M impression • 300 lead • 10 agenzie WL</p>
              </div>
              <div className="text-3xl">🌿</div>
            </div>
            
            <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-50 rounded-xl border flex items-center justify-between">
              <div>
                <p className="font-semibold">MESE 6</p>
                <p className="text-sm text-muted-foreground">20K follower • 3M impression • 1000 lead • 50 agenzie • 1-2 viral</p>
              </div>
              <div className="text-3xl">🌳</div>
            </div>
          </div>
        </Section>

        {/* Raccomandazione Finale */}
        <Section id="conclusion" icon={Lightbulb} title="Raccomandazione Finale">
          <KeyInsight type="problem">
            <strong>IL PROBLEMA PRINCIPALE:</strong> Il documento attuale è un buon "pitch" strategico ma manca di esecuzione tattica.
          </KeyInsight>
          
          <h4 className="font-semibold text-lg mb-4">COSA FARE SUBITO:</h4>
          <ol className="space-y-3 mb-8">
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>Creare un <strong>content calendar operativo</strong> (non teorico) per 4 settimane</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Scrivere <strong>30 copy reali</strong> di Reel con hook, body, CTA</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>Definire <strong>visual identity</strong> concreta (moodboard, esempi)</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>Impostare <strong>infrastruttura</strong> (profili, analytics, automation)</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <span>Iniziare a <strong>produrre</strong> (anche con iPhone, l'importante è partire)</span>
            </li>
          </ol>

          <div className="p-6 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border-2 border-primary/20 text-center">
            <p className="text-lg font-semibold text-primary italic">
              "La differenza tra una strategia social che funziona e una che non funziona 
              non è nella visione, è nella CONSISTENZA dell'esecuzione quotidiana."
            </p>
            <p className="text-muted-foreground mt-3">
              Non servono contenuti perfetti. Servono contenuti costanti, testati, ottimizzati.
            </p>
          </div>

          <div className="mt-8 p-5 bg-slate-100 rounded-xl">
            <h5 className="font-semibold mb-3">Team Minimo Richiesto</h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>1 Social Media Manager (FT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <span>1 Content Creator (PT)</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>1 Community Manager (PT)</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Documento preparato da Aries76 per ReelImmobiliare
          </p>
          <Link 
            to="/reelimmobiliare" 
            className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al Business Plan
          </Link>
        </footer>
      </main>
    </div>
  );
};

// Main Page Component
const ReelImmobiliareSocialStrategy = () => {
  return (
    <ReelSocialAccessGate>
      <SocialStrategyContent />
    </ReelSocialAccessGate>
  );
};

export default ReelImmobiliareSocialStrategy;
