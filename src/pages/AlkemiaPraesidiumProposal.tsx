import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, CheckCircle, AlertTriangle, TrendingUp, FileText, Users, Briefcase, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "quinley.martini@aries76.com",
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-6 w-6" />
              <CardTitle>Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are not authorized to view this confidential proposal.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alkemia Praesidium Capital</h1>
              <p className="text-muted-foreground mt-1">Fundraising Readiness & Probability Assessment (FRPA™)</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Confidential
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Executive Summary */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-4xl font-bold text-primary mb-2">67/100</div>
                <div className="text-sm text-muted-foreground">Readiness Score</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-4xl font-bold text-primary mb-2">35-50%</div>
                <div className="text-sm text-muted-foreground">Probabilità Target €100m (12-18 mesi)</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-4xl font-bold text-primary mb-2">€25-40m</div>
                <div className="text-sm text-muted-foreground">First Close Atteso (9-12 mesi)</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Valutazione indipendente della prontezza al fundraising e stima della probabilità di raggiungimento del target, 
              secondo la metodologia proprietaria FRPA™ di Aries76 Ltd. Documento confidenziale destinato a investitori qualificati.
            </p>
          </CardContent>
        </Card>

        {/* Scorecard FRPA */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Scorecard FRPA (assi & pesi)
            </CardTitle>
            <CardDescription>
              Soglia ≥75 = pronto per roadshow istituzionale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">{item.weight}</Badge>
                    </div>
                    <span className={`font-bold ${item.score >= 75 ? 'text-green-600' : item.score >= 65 ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.score >= 75 ? 'bg-green-600' : item.score >= 65 ? 'bg-yellow-600' : 'bg-orange-600'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Punti di Forza */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Punti di Forza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Proposta ibrida (preferred/quasi equity): distribuzione 5% e IRR netto target 12%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Contesto settoriale favorevole (FV/5G/prime residenziale) con driver pubblici e domanda strutturale</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Rischi / Criticità */}
        <Card className="mb-8 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Rischi / Criticità
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <span>Execution risk autorizzativo/realizzativo (FV, 5G, RE)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <span>Prova di replicabilità su strumenti ibridi identici alla tesi Praesidium</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <span>Domicilio Italia: per alcuni LP esteri serve comfort fiscale/regolatorio addizionale</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* GAP Informativi */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              GAP Informativi (data room)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-fit">Deal by deal:</span>
                <span>term sheet, stato permessi/connessioni FV, appraisal collaterali, capex/timing, sensibilità</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-fit">Modello economico:</span>
                <span>cash flow semestrale, meccanica yield 5% ed equity kicker (base/bear/bull)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-fit">Track record:</span>
                <span>3–5 case studies chiusi con timeline, incassi e multipli</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-fit">Governance:</span>
                <span>esempi clausole diritti/veto, trigger, enforcement su collaterale</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-fit">ESG package:</span>
                <span>KPI misurabili per ciascun vertical e template di reporting SFDR</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* LP Targeting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              LP Targeting: profilo e priorità
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Core</h4>
                <p className="text-muted-foreground">
                  Fondazioni/casse previdenza italiane, private banks PIR, wealth income oriented, family office opportunistici
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Secondo livello</h4>
                <p className="text-muted-foreground">
                  FoF europei real assets/value add; allocatori infra adjacent interessati a 5G/FV
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Azioni Prioritarie */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Azioni Prioritarie (90 giorni): readiness 67 → 78
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-foreground">
                <span className="font-medium">Convertire la pipeline in evidenze ancorabili:</span>
                <span className="text-muted-foreground"> 2 term sheet firmabili con collateral/milestone autorizzative</span>
              </li>
              <li className="text-foreground">
                <span className="font-medium">Allestire data room istituzionale:</span>
                <span className="text-muted-foreground"> LPA/PPM, waterfall, modello cedola 5% e sensitività</span>
              </li>
              <li className="text-foreground">
                <span className="font-medium">Track record mapping:</span>
                <span className="text-muted-foreground"> 3 case studies chiusi coerenti con la strategia</span>
              </li>
              <li className="text-foreground">
                <span className="font-medium">ESG package:</span>
                <span className="text-muted-foreground"> con KPI vertical specifici e collegamento carry (15%) a obiettivi</span>
              </li>
              <li className="text-foreground">
                <span className="font-medium">Chiarezza termini closing:</span>
                <span className="text-muted-foreground"> first close Q3 2025 €30m con elenco prospect anchor</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Scenari di Raccolta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Scenari di Raccolta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                <h4 className="font-bold text-lg mb-2 text-primary">Base Scenario</h4>
                <p className="text-muted-foreground mb-2">€30–50m (9–12 mesi)</p>
                <p className="text-sm text-muted-foreground">
                  Con 2 deal ancora + data room completa
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold">Probabilità:</span>
                  <Badge variant="secondary">60%</Badge>
                </div>
              </div>
              <div className="p-4 border border-green-600/20 rounded-lg bg-green-600/5">
                <h4 className="font-bold text-lg mb-2 text-green-600">Upside Scenario</h4>
                <p className="text-muted-foreground mb-2">€60–80m</p>
                <p className="text-sm text-muted-foreground">
                  Con 1 exit/riciclo visibile entro 18 mesi + anchor domestico
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold">Probabilità:</span>
                  <Badge variant="secondary">40%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusione */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Conclusione</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              La proposta è coerente con bisogni reali delle PMI e può attrarre LP orientati a income + protezione. 
              La bancabilità dipende dalla trasformazione della pipeline in prove dure (term sheet, permessi, appraisal, 
              collateral enforceable) e dalla dimostrazione di replicabilità con 1–2 casi signature chiusi.
            </p>
          </CardContent>
        </Card>


        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© Aries76 Ltd — FRPA™ Framework</p>
          <p className="mt-2">Documento confidenziale. Non distribuire senza consenso scritto.</p>
        </div>
      </div>
    </div>
  );
};

export default AlkemiaPraesidiumProposal;
