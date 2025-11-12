import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, CheckCircle, AlertTriangle, TrendingUp, Users, Briefcase, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "quinley.martini@aries76.com",
  "luca.duranti@alkemiacapital.com",
  "domenico.massaro@alkemiacapital.com",
];

const AlkemiaPraesidiumProposal = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessEmail = sessionStorage.getItem("alkemiaAccessEmail");
    
    if (!accessEmail) {
      navigate("/alkemia-praesidium-access");
      return;
    }

    const authorized = AUTHORIZED_EMAILS.includes(accessEmail.toLowerCase());
    setIsAuthorized(authorized);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-28">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldAlert className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Accesso Negato</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Questa pagina è riservata esclusivamente a utenti autorizzati.
              </p>
              <p className="text-sm text-muted-foreground">
                Per informazioni, contattare info@aries76.com
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center pb-12 mb-16 border-b border-primary/20">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Proposta Confidenziale</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Alkemia Praesidium Capital<br />
              <span className="text-primary">Fundraising Readiness & Probability Assessment (FRPA™)</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Valutazione indipendente della prontezza al fundraising
            </p>
          </div>
          {/* Executive Summary */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Executive Summary
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 shadow-md">
                    <div className="text-4xl font-bold text-primary mb-2">67/100</div>
                    <div className="text-sm text-muted-foreground font-medium">Readiness Score</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 shadow-md">
                    <div className="text-4xl font-bold text-primary mb-2">35-50%</div>
                    <div className="text-sm text-muted-foreground font-medium">Probabilità Target €100m (12-18 mesi)</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 shadow-md">
                    <div className="text-4xl font-bold text-primary mb-2">€25-40m</div>
                    <div className="text-sm text-muted-foreground font-medium">First Close Atteso (9-12 mesi)</div>
                  </div>
                </div>
                <p className="text-foreground/90 text-base leading-relaxed">
                  Valutazione indipendente della prontezza al fundraising e stima della probabilità di raggiungimento del target, 
                  secondo la metodologia proprietaria FRPA™ di Aries76 Ltd. Documento confidenziale destinato a investitori qualificati.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Scorecard FRPA */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Scorecard FRPA (assi & pesi)
              </h2>
            </div>
            <p className="text-base mb-8 text-muted-foreground leading-relaxed">
              Soglia ≥75 = pronto per roadshow istituzionale
            </p>
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6">
                  {[
                    { name: "Tesi & posizionamento", weight: "15%", score: 72 },
                    { name: "Mercato & timing", weight: "10%", score: 75 },
                    { name: "Team & track record", weight: "15%", score: 65 },
                    { name: "Pipeline & origination", weight: "15%", score: 68 },
                    { name: "Struttura prodotto & terms", weight: "15%", score: 70 },
                    { name: "Governance & rischio", weight: "10%", score: 73 },
                    { name: "ESG & SFDR", weight: "5%", score: 70 },
                    { name: "Materiali & investor readiness", weight: "15%", score: 58 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <Badge variant="outline" className="text-xs">{item.weight}</Badge>
                        </div>
                        <span className={`font-bold text-lg ${item.score >= 75 ? 'text-green-600' : item.score >= 65 ? 'text-yellow-600' : 'text-orange-600'}`}>
                          {item.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${item.score >= 75 ? 'bg-green-600' : item.score >= 65 ? 'bg-yellow-600' : 'bg-orange-600'}`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Punti di Forza */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Punti di Forza
              </h2>
            </div>
            <Card className="border-green-600/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Proposta ibrida solida e distintiva</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Il modello preferred/quasi-equity offre un equilibrio credibile tra rendimento cedolare (5% annuo) e potenziale di upside (IRR netto target 12%), con un profilo rischio-rendimento facilmente comunicabile agli LP income-driven.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Posizionamento chiaro su asset reali ad alta visibilità</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Focus su settori tangibili — fotovoltaico, infrastrutture digitali e residenziale prime — sostenuti da driver pubblici, transizione energetica e domanda strutturale di lungo periodo.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Storyline coerente e appeal per LP tradizionali</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Combina stabilità cash-flow con esposizione equity controllata: un mix attraente per fondazioni, casse previdenziali e family office orientati a rendimento costante con protezione downside.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Competitive Positioning */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Competitive Positioning
              </h2>
            </div>
            <p className="text-base mb-8 text-muted-foreground leading-relaxed">
              Confronto con fondi hybrid/quasi-equity sul mercato italiano ed europeo
            </p>
            
            {/* Tabella Comparativa */}
            <Card className="border-primary/20 shadow-lg mb-8">
              <CardContent className="p-8 md:p-10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-semibold text-foreground">Parametro</th>
                        <th className="text-left py-4 px-4 font-semibold text-primary">Alkemia Praesidium</th>
                        <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Media Mercato IT</th>
                        <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Media Mercato EU</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">Yield cedolare</td>
                        <td className="py-4 px-4 font-semibold text-primary">5% annuo</td>
                        <td className="py-4 px-4 text-muted-foreground">3-4%</td>
                        <td className="py-4 px-4 text-muted-foreground">4-5%</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">IRR netto target</td>
                        <td className="py-4 px-4 font-semibold text-primary">12%</td>
                        <td className="py-4 px-4 text-muted-foreground">10-12%</td>
                        <td className="py-4 px-4 text-muted-foreground">11-13%</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">Focus settoriale</td>
                        <td className="py-4 px-4 font-semibold text-primary">FV/5G/RE prime</td>
                        <td className="py-4 px-4 text-muted-foreground">Diversificato</td>
                        <td className="py-4 px-4 text-muted-foreground">Infra/RE broad</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">Ticket medio</td>
                        <td className="py-4 px-4 font-semibold text-primary">€5-15m</td>
                        <td className="py-4 px-4 text-muted-foreground">€10-25m</td>
                        <td className="py-4 px-4 text-muted-foreground">€15-40m</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">Holding period</td>
                        <td className="py-4 px-4 font-semibold text-primary">3-5 anni</td>
                        <td className="py-4 px-4 text-muted-foreground">4-6 anni</td>
                        <td className="py-4 px-4 text-muted-foreground">5-7 anni</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 text-foreground">Protezione downside</td>
                        <td className="py-4 px-4 font-semibold text-primary">Collaterale + preferred</td>
                        <td className="py-4 px-4 text-muted-foreground">Variabile</td>
                        <td className="py-4 px-4 text-muted-foreground">Strutturata</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Differenziatori Chiave */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    Vantaggi Competitivi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Rendimento cedolare superiore:</strong> 5% vs 3-4% medio mercato IT, con visibilità cash flow per LP income-driven</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Focus tematico chiaro:</strong> specializzazione su transizione energetica e digital infra vs approccio multi-settore generico</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Ticket flessibile:</strong> accessibile a LP mid-size (€5-15m) vs soglie più elevate competitor europei</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Holding period ottimizzato:</strong> 3-5 anni vs 5-7 anni standard, permettendo rotazione capitale più rapida</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-destructive flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    Gap vs Competitor Strutturati
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Track record limitato:</strong> competitor EU hanno 3+ vintage funds con track record verificabile su strutture ibride</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Brand recognition:</strong> fondi Pan-EU (Infravia, Ardian, DWS) hanno network LP consolidato e placement power superiore</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Scala operativa:</strong> team più contenuto vs 15-30 professionisti dedicated di competitor strutturati</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-base text-muted-foreground"><strong className="text-foreground">Infrastruttura LP services:</strong> competitor offrono investor relations, reporting e portali dedicati già operativi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Posizionamento Strategico */}
            <Card className="border-primary/20 shadow-lg mt-8 bg-gradient-to-br from-primary/5 to-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Posizionamento Strategico Raccomandato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Nicchia premium:</strong> Alkemia dovrebbe posizionarsi come "boutique specializzata" su hybrid/preferred capital per PMI italiane in settori ad alto impatto ESG, puntando su LP domestici (fondazioni, casse, family office) che valorizzano:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-base text-muted-foreground">Rendimento cedolare superiore alla media (5% vs 3-4%)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-base text-muted-foreground">Accesso diretto a deal flow mid-market italiano non presidiato da fondi Pan-EU</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-base text-muted-foreground">Flessibilità strutturale e proximity geografica per due diligence hands-on</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-base text-muted-foreground">Impact measurability su transizione energetica e digital infrastructure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Rischi / Criticità
              </h2>
            </div>
            <Card className="border-destructive/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Track record "strategy-match" debole</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Mancano casi chiusi davvero comparabili alla tesi Praesidium, quindi gli LP faticano a validarne la replicabilità e a sbloccare ticket significativi.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Pipeline non ancora "ancorata" e assenza di anchor LP</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Troppe opportunità soft/early: senza 1–2 term sheet firmabili e un anchor da €10–15m il momentum di fundraising resta fragile.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-foreground">Struttura e terms poco "LP-friendly" per investitori esteri</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed ml-8">
                      Veicolo/domicilio e waterfall non pienamente cristallini riducono il mercato indirizzabile; servono feeder Lux e terms trasparenti (priorità di cassa, trigger, oneri fiscali).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Piano di Mitigazione */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Piano di Mitigazione
              </h2>
            </div>
            <div className="space-y-6">
              {/* Mitigazione 1 */}
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <Target className="h-5 w-5" />
                    Track record "strategy-match" debole
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Azioni concrete:</h4>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Documentare 3–5 case studies chiusi con strutture simili (preferred/quasi-equity) includendo: timeline, capex vs budget, MOIC/IRR realizzati, evidenze di cedola pagata</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Creare playbook standardizzato: credit box (LTV, DSCR minimi), criteri di selezione, processo di due diligence, template term sheet</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Evidenziare team expertise: CV dei key professionals con track record specifico su strumenti ibridi, advisory board con credibilità settoriale</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">Impatto atteso:</span>
                      <Badge className="bg-green-600/10 text-green-600 border-green-600/20">Readiness +8 punti</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mitigazione 2 */}
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <Briefcase className="h-5 w-5" />
                    Pipeline non ancora "ancorata" e assenza di anchor LP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Azioni concrete:</h4>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Convertire 2 deal in term sheet firmabili entro 60 giorni: permessi rilasciati, connessione TICA definita, land rights chiusi, EPC pricing fissato</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Identificare e chiudere 1 anchor LP da €10–15m (fondazione, cassa previdenza, family office) con soft commitment pre-first close</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Creare pipeline tracker con KPI: deal screened, in DD, term sheet issued, conversion rate, average time to close</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Attivare dealflow strutturato: partnership con advisor M&A, network corporate finance, origination dedicata su 5G/FV</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">Impatto atteso:</span>
                      <Badge className="bg-green-600/10 text-green-600 border-green-600/20">Probabilità first close +20-25%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mitigazione 3 */}
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Struttura e terms poco "LP-friendly" per investitori esteri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Azioni concrete:</h4>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Strutturare feeder Lux (SCSp/RAIF) per LP esteri con ottimizzazione fiscale: analisi ritenute, convenzioni contro doppie imposizioni, flussi net-of-tax</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Cristallizzare waterfall e governance: priorità di cassa (cedola 5% senior), trigger di protezione (DSCR, delay, cost overrun), diritti di veto LP</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Preparare tax & legal pack: opinion su struttura, trattamento fiscale cedole/capital gain per categorie LP, security package con enforcement rapido</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Compliance istituzionale: reporting SFDR/KID, procedure AML/KYC, amministratore indipendente, audit Big4</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">Impatto atteso:</span>
                      <Badge className="bg-green-600/10 text-green-600 border-green-600/20">Mercato indirizzabile +40%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                GAP Informativi (data room)
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-8 md:p-10">
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-foreground">Deal by deal: </span>
                      <span className="text-muted-foreground">term sheet, stato permessi/connessioni FV, appraisal collaterali, capex/timing, sensibilità</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-foreground">Modello economico: </span>
                      <span className="text-muted-foreground">cash flow semestrale, meccanica yield 5% ed equity kicker (base/bear/bull)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-foreground">Track record: </span>
                      <span className="text-muted-foreground">3–5 case studies chiusi con timeline, incassi e multipli</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-foreground">Governance: </span>
                      <span className="text-muted-foreground">esempi clausole diritti/veto, trigger, enforcement su collaterale</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-foreground">ESG package: </span>
                      <span className="text-muted-foreground">KPI misurabili per ciascun vertical e template di reporting SFDR</span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* LP Targeting */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                LP Targeting: profilo e priorità
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Core</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Fondazioni/casse previdenza italiane, private banks PIR, wealth income oriented, family office opportunistici
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Secondo livello</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    FoF europei real assets/value add; allocatori infra adjacent interessati a 5G/FV
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Azioni Prioritarie */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Azioni Prioritarie (90 giorni): readiness 67 → 78
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-card">
              <CardContent className="p-8 md:p-10">
                <ol className="space-y-5 list-none">
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-base">Convertire la pipeline in evidenze ancorabili: </span>
                      <span className="text-muted-foreground">2 term sheet firmabili con collateral/milestone autorizzative</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-base">Allestire data room istituzionale: </span>
                      <span className="text-muted-foreground">LPA/PPM, waterfall, modello cedola 5% e sensitività</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-base">Track record mapping: </span>
                      <span className="text-muted-foreground">3 case studies chiusi coerenti con la strategia</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-base">ESG package: </span>
                      <span className="text-muted-foreground">con KPI vertical specifici e collegamento carry (15%) a obiettivi</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">5</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-base">Chiarezza termini closing: </span>
                      <span className="text-muted-foreground">first close Q3 2025 €30m con elenco prospect anchor</span>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Scenari di Raccolta */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Scenari di Raccolta
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Base Scenario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-bold text-foreground">€30–50m</p>
                  <p className="text-sm text-muted-foreground">(9–12 mesi)</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Con 2 deal ancora + data room completa
                  </p>
                  <div className="pt-4 flex items-center gap-3">
                    <span className="font-semibold text-foreground">Probabilità:</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20">60%</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-green-600/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-600 to-green-600/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Upside Scenario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-bold text-foreground">€60–80m</p>
                  <p className="text-sm text-muted-foreground">(12–18 mesi)</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Con 1 exit/riciclo visibile entro 18 mesi + anchor domestico
                  </p>
                  <div className="pt-4 flex items-center gap-3">
                    <span className="font-semibold text-foreground">Probabilità:</span>
                    <Badge className="bg-green-600/10 text-green-600 border-green-600/20">40%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusione */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Conclusione
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-card">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6">
                  <p className="text-lg font-semibold text-foreground leading-relaxed">
                    Alkemia Praesidium presenta una tesi coerente e difendibile, ma la bancabilità istituzionale dipende da tre fattori critici:
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-3xl font-bold text-primary mb-2">1</div>
                      <p className="text-sm font-semibold text-foreground mb-1">Track record tangibile</p>
                      <p className="text-xs text-muted-foreground">3-5 case studies chiusi con evidenze di cedola 5% e multipli realizzati</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-3xl font-bold text-primary mb-2">2</div>
                      <p className="text-sm font-semibold text-foreground mb-1">Pipeline ancorata</p>
                      <p className="text-xs text-muted-foreground">2 deal con term sheet firmabili + anchor LP da €10-15m</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-3xl font-bold text-primary mb-2">3</div>
                      <p className="text-sm font-semibold text-foreground mb-1">Struttura LP-friendly</p>
                      <p className="text-xs text-muted-foreground">Feeder Lux, waterfall cristallino, governance trasparente</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-border">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Con le azioni prioritarie implementate nei prossimi 90 giorni, il readiness score può passare da <strong className="text-foreground">67 a 78</strong>, sbloccando un first close realistico di <strong className="text-foreground">€30-50m entro Q3 2026</strong> e aprendo la strada a un target finale di <strong className="text-foreground">€100m in 12-18 mesi</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-primary/20 text-center">
            <p className="text-sm text-muted-foreground font-semibold">© Aries76 Ltd — FRPA™ Framework</p>
            <p className="mt-2 text-xs text-muted-foreground">Documento confidenziale. Non distribuire senza consenso scritto.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlkemiaPraesidiumProposal;
