import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, TrendingUp, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FundraisingReadiness = () => {
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showReportRequest, setShowReportRequest] = useState(false);
  const { toast } = useToast();

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Richiesta inviata",
      description: "Ti contatteremo a breve per discutere il tuo assessment.",
    });
    setShowAssessmentForm(false);
  };

  const handleReportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Richiesta inviata",
      description: "Riceverai un esempio di report via email.",
    });
    setShowReportRequest(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fundraising Readiness & Probability Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un modello proprietario per stimare la probabilità di raccolta e identificare le aree di miglioramento prima di andare in fundraising
          </p>
        </motion.div>

        {/* Three Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Startup Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Startup</CardTitle>
                <CardDescription>Valutazione per round seed e Serie A</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Cosa analizziamo</h4>
                  <p className="text-sm text-muted-foreground">
                    Team, prodotto/MVP, traction, mercato TAM/SAM, competizione, business model, materiali pitch
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa ricevi</h4>
                  <p className="text-sm text-muted-foreground">
                    Report con scoring 0-100, benchmark settoriale, gap analysis, raccomandazioni prioritizzate
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempistiche</h4>
                  <p className="text-sm text-muted-foreground">5-7 giorni lavorativi</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Prezzo</h4>
                  <p className="text-2xl font-bold text-primary">€2.500 - €5.000</p>
                  <p className="text-xs text-muted-foreground mt-1">In base alla complessità</p>
                </div>
              </CardContent>
            </Card>

            {/* VC Funds Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors md:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">VC Funds</CardTitle>
                <CardDescription>Valutazione per fondi venture capital</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Cosa analizziamo</h4>
                  <p className="text-sm text-muted-foreground">
                    Track record GP, strategia, pipeline/portfolio, governance, materiali marketing, compliance, posizionamento LP
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa ricevi</h4>
                  <p className="text-sm text-muted-foreground">
                    Report dettagliato con scoring, analisi competitiva, gap critici, roadmap operativa, preview LP feedback
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempistiche</h4>
                  <p className="text-sm text-muted-foreground">10-14 giorni lavorativi</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Prezzo</h4>
                  <p className="text-2xl font-bold text-primary">€7.500 - €15.000</p>
                  <p className="text-xs text-muted-foreground mt-1">Target size e complessità</p>
                </div>
              </CardContent>
            </Card>

            {/* PE/Alternatives Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">PE / Alternatives</CardTitle>
                <CardDescription>Valutazione per fondi PE e alternativi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Cosa analizziamo</h4>
                  <p className="text-sm text-muted-foreground">
                    Track record GP, strategia tesi investimento, pipeline/portfolio, governance, ESG, materiali DDQ, conformità regolamentare
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa ricevi</h4>
                  <p className="text-sm text-muted-foreground">
                    Report esecutivo con scoring, analisi posizionamento, gap analysis, roadmap, simulazione feedback istituzionali
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tempistiche</h4>
                  <p className="text-sm text-muted-foreground">14-21 giorni lavorativi</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Prezzo</h4>
                  <p className="text-2xl font-bold text-primary">€10.000 - €20.000</p>
                  <p className="text-xs text-muted-foreground mt-1">AUM target e settore</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Metodologia Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Metodologia di Valutazione</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Il nostro modello proprietario analizza cinque dimensioni chiave, ciascuna ponderata in base al segmento di riferimento
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Startup Weights */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Startup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team & Execution</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Prodotto & Traction</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mercato & Timing</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Business Model</span>
                  <span className="font-bold text-primary">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Materiali & Pitch</span>
                  <span className="font-bold text-primary">10%</span>
                </div>
              </CardContent>
            </Card>

            {/* VC Funds Weights */}
            <Card className="bg-card/50 border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg">VC Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Track Record & Team</span>
                  <span className="font-bold text-primary">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strategia & Tesi</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pipeline & Portfolio</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Governance & Compliance</span>
                  <span className="font-bold text-primary">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Marketing Materials</span>
                  <span className="font-bold text-primary">8%</span>
                </div>
              </CardContent>
            </Card>

            {/* PE/Alternatives Weights */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">PE / Alternatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Track Record & Team</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strategia & Dealflow</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Performance & Exits</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Governance & ESG</span>
                  <span className="font-bold text-primary">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compliance & DDQ</span>
                  <span className="font-bold text-primary">10%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <CheckCircle className="inline w-4 h-4 mr-2 text-primary" />
                Ogni dimensione viene valutata con criteri oggettivi e quantitativi, producendo uno score complessivo 0-100 e un profilo di probabilità di successo
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Prenota un Assessment</h3>
                <p className="text-muted-foreground mb-6">
                  Compila il modulo di intake per ricevere una proposta personalizzata e iniziare la tua valutazione
                </p>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setShowAssessmentForm(true)}
                >
                  Prenota Assessment
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Richiedi un Esempio di Report</h3>
                <p className="text-muted-foreground mb-6">
                  Vuoi vedere come appare un report completo? Richiedi un esempio anonimizzato
                </p>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReportRequest(true)}
                >
                  Richiedi Esempio
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Domande Frequenti</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Quanto è accurata la stima di probabilità?
              </AccordionTrigger>
              <AccordionContent>
                Il modello è calibrato su oltre 200 casi reali di fundraising tra startup, VC e PE dal 2018 ad oggi. 
                La correlazione tra lo score finale e l'esito effettivo della raccolta è superiore all'82%. 
                Tuttavia, la probabilità stimata va intesa come indicatore di positioning relativo, non come certezza assoluta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                L'assessment sostituisce la due diligence degli investitori?
              </AccordionTrigger>
              <AccordionContent>
                No. L'assessment valuta la "readiness" del soggetto che raccoglie e identifica gap da colmare prima 
                di andare sul mercato. La due diligence formale degli investitori resta un processo separato e 
                approfondito che avviene dopo il primo contatto.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Posso richiedere l'assessment se sono già in fundraising?
              </AccordionTrigger>
              <AccordionContent>
                Sì, ma il valore maggiore si ottiene prima di iniziare il processo. Se sei già in raccolta, 
                l'assessment può comunque aiutarti a diagnosticare eventuali problemi e correggere la strategia in corsa, 
                ma alcune modifiche (es. governance, team) potrebbero richiedere tempi incompatibili con una campagna già avviata.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Le informazioni condivise rimangono confidenziali?
              </AccordionTrigger>
              <AccordionContent>
                Assolutamente sì. Tutti i materiali e i dati forniti sono trattati con la massima riservatezza 
                e coperti da NDA. Il report finale viene condiviso solo con i soggetti da te autorizzati. 
                Eventuali esempi o benchmark utilizzati in comunicazioni esterne sono sempre completamente anonimizzati.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>

        {/* Footer Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-muted/30 border-muted">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> Il Fundraising Readiness Assessment è uno strumento diagnostico proprietario 
                di Aries76 Capital Advisory e non costituisce consulenza di investimento, sollecitazione al pubblico risparmio 
                o attività di placement regolamentata. Le stime di probabilità sono indicative e basate su modelli statistici 
                che non garantiscono il successo di una raccolta. Ogni decisione di investimento o fundraising resta di esclusiva 
                responsabilità del cliente. Aries76 opera in conformità alle normative vigenti in materia di consulenza finanziaria 
                e trattamento dei dati personali (GDPR).
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Assessment Form Dialog */}
        <Dialog open={showAssessmentForm} onOpenChange={setShowAssessmentForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prenota il tuo Assessment</DialogTitle>
              <DialogDescription>
                Compila il modulo per ricevere una proposta personalizzata
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssessmentSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientType">Tipo di Cliente</Label>
                  <Select required>
                    <SelectTrigger id="clientType">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="vc">VC Fund</SelectItem>
                      <SelectItem value="pe">PE / Alternatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fundraisingTarget">Obiettivo di Raccolta</Label>
                  <Input 
                    id="fundraisingTarget" 
                    placeholder="es. €5M seed round / €50M Fund I"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Tempistica Prevista</Label>
                  <Input 
                    id="timeline" 
                    placeholder="es. Q2 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="materials">Materiali Disponibili</Label>
                  <Textarea 
                    id="materials" 
                    placeholder="Pitch deck, business plan, financial model, track record..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keyMetrics">Metriche Chiave</Label>
                  <Textarea 
                    id="keyMetrics" 
                    placeholder="MRR, ARR, IRR, TVPI, portfolio size..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="lpPreferences">Preferenze LP / Investitori Target</Label>
                  <Textarea 
                    id="lpPreferences" 
                    placeholder="Family office, istituzionali, corporate VC, geo focus..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Nome e Cognome</Label>
                    <Input id="contactName" required />
                  </div>
                  <div>
                    <Label htmlFor="contactRole">Ruolo</Label>
                    <Input id="contactRole" placeholder="es. CEO, Managing Partner" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Telefono</Label>
                    <Input id="contactPhone" type="tel" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setShowAssessmentForm(false)} className="flex-1">
                  Annulla
                </Button>
                <Button type="submit" className="flex-1">
                  Invia Richiesta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Report Request Dialog */}
        <Dialog open={showReportRequest} onOpenChange={setShowReportRequest}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Richiedi Esempio di Report</DialogTitle>
              <DialogDescription>
                Inserisci i tuoi dati per ricevere un esempio di report via email
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReportRequest} className="space-y-4">
              <div>
                <Label htmlFor="reportName">Nome e Cognome</Label>
                <Input id="reportName" required />
              </div>
              <div>
                <Label htmlFor="reportEmail">Email</Label>
                <Input id="reportEmail" type="email" required />
              </div>
              <div>
                <Label htmlFor="reportType">Tipo di Report</Label>
                <Select required>
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="vc">VC Fund</SelectItem>
                    <SelectItem value="pe">PE / Alternatives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setShowReportRequest(false)} className="flex-1">
                  Annulla
                </Button>
                <Button type="submit" className="flex-1">
                  Invia Richiesta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FundraisingReadiness;
