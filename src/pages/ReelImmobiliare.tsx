import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, CheckCircle, XCircle, ArrowRight, Lightbulb, Database, Video, Target, Building2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/10">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">Accesso Riservato</CardTitle>
            <CardDescription className="text-base">
              ReelImmobiliare – Documento Strategico
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthorized === false && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive mb-1">Accesso Negato</p>
                <p className="text-sm text-muted-foreground">
                  L'indirizzo email inserito non è autorizzato ad accedere a questa documentazione.
                </p>
              </div>
            </div>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifica in corso...
                </>
              ) : (
                "Accedi al Documento"
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
    </div>
  );
};

const KeyPoint = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
    <p className="font-semibold text-primary italic">{children}</p>
  </div>
);

const SectionTitle = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-3">
    <Icon className="h-6 w-6 text-primary" />
    {children}
  </h2>
);

const ReelImmobiliareContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ReelImmobiliare – Evoluzione Strategica | Aries76</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Documento Strategico
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Evoluzione Strategica del Progetto ReelImmobiliare
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Da portale video replicabile a piattaforma tecnologica per il Real Estate
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Premessa */}
          <section>
            <SectionTitle icon={Lightbulb}>Premessa</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              Il progetto ReelImmobiliare nasce da un'intuizione corretta e perfettamente allineata ai cambiamenti nei comportamenti digitali degli utenti: il video è diventato il linguaggio principale attraverso cui le persone esplorano, valutano e prendono decisioni. Nel settore immobiliare, storicamente dominato da fotografie statiche e descrizioni standardizzate, il video rappresenta un'evoluzione naturale e necessaria.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Tuttavia, affinché questa intuizione possa trasformarsi in un progetto imprenditoriale sostenibile e scalabile, è fondamentale distinguere tra <strong>innovazione di formato</strong> e <strong>innovazione strutturale</strong>. Il presente documento ha l'obiettivo di chiarire perché un semplice portale video immobiliare non può costituire un vantaggio competitivo duraturo e come, invece, lo stesso concetto possa evolvere in una piattaforma tecnologica ad alto valore strategico.
            </p>
          </section>

          {/* Limite strutturale */}
          <section>
            <SectionTitle icon={XCircle}>Il limite strutturale del modello "portale"</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              Nella sua impostazione originaria, ReelImmobiliare viene concepito come un portale immobiliare basato su annunci esclusivamente video, con un'esperienza utente ispirata ai reel e l'uso di strumenti di intelligenza artificiale a supporto della ricerca. Sebbene questa proposta risulti innovativa dal punto di vista dell'esperienza, presenta un limite strutturale rilevante.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Un portale, per definizione, compete sul traffico, sulla visibilità e sulla capacità di attrarre inserzionisti. In questo ambito, operatori già affermati dispongono di vantaggi difficilmente colmabili: basi utenti consolidate, relazioni commerciali con migliaia di agenzie, brand recognition e capacità di investimento molto superiori. Qualsiasi innovazione legata al formato video, all'interfaccia o all'uso dell'AI risulta quindi facilmente replicabile da parte degli incumbent.
            </p>
            <KeyPoint>
              Un portale vince se controlla il traffico. ReelImmobiliare non può competere su questo terreno senza bruciare risorse e tempo.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              In questo scenario, il rischio concreto è che il progetto venga percepito come una "feature interessante" piuttosto che come una piattaforma indispensabile. Il risultato sarebbe un'iniziativa fragile, priva di difendibilità e con limitate prospettive di crescita autonoma.
            </p>
          </section>

          {/* Cambio di paradigma */}
          <section>
            <SectionTitle icon={Database}>Il cambio di paradigma: dal contenuto al dato</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              Il vero valore potenziale di ReelImmobiliare emerge quando il video smette di essere considerato un semplice contenuto di presentazione e viene ripensato come <strong>fonte primaria di dati</strong>. Questo passaggio rappresenta il cuore dello shift strategico.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Un video immobiliare contiene una quantità enorme di informazione latente: struttura degli ambienti, qualità percepita, luminosità, materiali, contesto, ma anche – e soprattutto – informazioni sul comportamento degli utenti che lo guardano. Se opportunamente analizzato, il video può diventare un vero e proprio sensore digitale.
            </p>
            <KeyPoint>
              Il video non è marketing. Il video è un sensore.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              Attraverso tecnologie di computer vision, analisi semantica e tracciamento delle interazioni, ogni video può essere trasformato in un oggetto dati strutturato, interrogabile e confrontabile. Questo consente di passare da un'esperienza descrittiva a un sistema informativo che apprende e migliora nel tempo.
            </p>
          </section>

          {/* Infrastruttura tecnologica */}
          <section>
            <SectionTitle icon={Zap}>Perché un'infrastruttura tecnologica è diversa da un portale</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              In un portale tradizionale, il valore è generato dalla pubblicazione degli annunci. In una piattaforma tecnologica, il valore è generato dall'elaborazione dei dati.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nel modello evoluto di ReelImmobiliare, la piattaforma non si limita a ospitare video, ma:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                analizza automaticamente il contenuto visivo e narrativo
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                riconosce e classifica gli ambienti
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                costruisce metadati strutturati sugli immobili
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                raccoglie dati comportamentali granulari sugli utenti
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                correla tali dati con eventi reali (richieste di visita, offerte, vendite)
              </li>
            </ul>
            <KeyPoint>
              Un portale mostra annunci. Una piattaforma costruisce conoscenza.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              Questo approccio consente di generare insight che oggi né le agenzie né i portali possiedono: cosa interessa davvero agli acquirenti, quali caratteristiche anticipano una conversione, quali elementi influiscono sul tempo di vendita e sul pricing.
            </p>
          </section>

          {/* Controllo tecnologico */}
          <section>
            <SectionTitle icon={Video}>Il ruolo centrale del controllo tecnologico</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              Perché questo modello funzioni, è essenziale che la piattaforma mantenga il controllo sull'intera catena del valore del video: dallo storage allo streaming, dal player alle interazioni, fino alla pipeline di analisi e al data layer.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Soluzioni di semplice hosting video, pur valide per la distribuzione dei contenuti, non consentono un'estrazione dati sufficientemente granulare né la costruzione di un patrimonio informativo proprietario. In tali casi, il video rimane un file e non diventa mai un asset strategico.
            </p>
            <KeyPoint>
              Se non controlli il player e i dati, non stai costruendo una piattaforma, ma una vetrina.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              Per questo motivo, l'architettura corretta prevede un backend proprietario per video, AI e dati, affiancato da un frontend agile e veloce per l'esperienza utente.
            </p>
          </section>

          {/* Lovable */}
          <section>
            <SectionTitle icon={Zap}>Lovable come abilitatore, non come limite</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              In questo contesto, l'utilizzo di strumenti no-code come Lovable può rappresentare una scelta estremamente efficace, se correttamente posizionata. Lovable è adatto a costruire rapidamente il portale, gestire utenti, annunci e flussi di navigazione, riducendo drasticamente tempi e costi di sviluppo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Tuttavia, Lovable non deve essere confuso con il cuore tecnologico della piattaforma. Il suo ruolo ideale è quello di layer di presentazione e orchestrazione, mentre il valore strategico risiede nel backend proprietario che gestisce video intelligence e data analytics.
            </p>
            <KeyPoint>
              Lovable accelera il prodotto. Il backend protegge il valore.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              Questa separazione consente di partire velocemente senza compromettere la possibilità di evolvere verso una piattaforma tecnologica solida e difendibile.
            </p>
          </section>

          {/* B2B */}
          <section>
            <SectionTitle icon={Target}>Dal B2C fragile al B2B scalabile</SectionTitle>
            <p className="text-muted-foreground leading-relaxed">
              Un ulteriore elemento chiave dello shift strategico riguarda il target di riferimento. Un portale consumer richiede volumi di traffico elevatissimi e investimenti continui in marketing. Una piattaforma tecnologica B2B, invece, può creare valore servendo un numero limitato di clienti professionali ad alto valore.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nel modello evoluto, ReelImmobiliare si posiziona come infrastruttura per agenzie immobiliari e network, offrendo strumenti per:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                migliorare la qualità degli annunci
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                ridurre visite inutili
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                qualificare meglio i lead
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                prendere decisioni basate su dati reali
              </li>
            </ul>
            <KeyPoint>
              Meglio pochi clienti che pagano per il valore, che molti utenti che consumano contenuti.
            </KeyPoint>
            <p className="text-muted-foreground leading-relaxed">
              Questo modello abilita ricavi ricorrenti, una maggiore prevedibilità e una narrativa molto più credibile, anche in ottica di partnership o di investimenti futuri.
            </p>
          </section>

          {/* Conclusione */}
          <section className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              Conclusione: il senso dello shift strategico
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Il passaggio da portale a piattaforma non è un dettaglio tecnico, ma una scelta strategica fondamentale. Un portale video immobiliare è facilmente replicabile e strutturalmente fragile. Una piattaforma tecnologica che trasforma i video in dati crea, invece, un asset che cresce nel tempo, migliora con l'uso e diventa sempre più difficile da sostituire.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Lo shift proposto non snatura l'idea originale, ma la porta a maturità, trasformando un'intuizione corretta in un progetto con basi industriali solide.
            </p>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-bold text-primary text-lg text-center italic">
                "Il valore di ReelImmobiliare non è nel mostrare immobili. È nel capire, meglio di chiunque altro, come vengono davvero scelti."
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
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
