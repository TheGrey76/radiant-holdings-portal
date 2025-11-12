import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Target, Users, Award, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "quinley.martini@aries76.com",
];

const ABCCompanyProposal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("abcCompanyAccessEmail");
    if (!storedEmail || !AUTHORIZED_EMAILS.includes(storedEmail)) {
      toast.error("Unauthorized access");
      navigate("/abc-company-access");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">ABC Company S.p.A.</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            Aumento di Capitale 2025
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Crescita e Consolidamento
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Raccolta di €12–15 milioni a 4,00 €/azione (warrant 1:5) per finanziare nuovi Club Deal e partecipazioni strategiche
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-card border border-border rounded-lg p-6 min-w-[200px]">
              <div className="text-3xl font-bold text-primary">€12-15M</div>
              <div className="text-sm text-muted-foreground mt-1">Target Raccolta</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 min-w-[200px]">
              <div className="text-3xl font-bold text-primary">€4.00</div>
              <div className="text-sm text-muted-foreground mt-1">Prezzo/Azione</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 min-w-[200px]">
              <div className="text-3xl font-bold text-primary">31 Dic 2025</div>
              <div className="text-sm text-muted-foreground mt-1">Deadline</div>
            </div>
          </div>
        </section>

        {/* Equity Story */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold text-foreground">Equity Story</h3>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Modello Ibrido
                </h4>
                <p className="text-muted-foreground">
                  Combina i vantaggi di un veicolo di permanent capital (visibilità e liquidità del titolo) con la logica di private equity deal-by-deal tipica dei Club Deal.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Performance Borsistica</h4>
                <p className="text-muted-foreground">
                  <span className="text-green-600 font-semibold">+10%</span> dal debutto (dicembre 2021) contro <span className="text-red-600">-25%</span> del FTSE Growth
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Market cap attuale: circa €32 milioni
                </p>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <h4 className="font-semibold text-foreground mb-3">Track Record</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">€24M</div>
                  <div className="text-sm text-muted-foreground">Raccolti in Club Deal</div>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">2.7x</div>
                  <div className="text-sm text-muted-foreground">Cash-on-Cash (best)</div>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">&gt;60%</div>
                  <div className="text-sm text-muted-foreground">IRR (Fornaio del Casale)</div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-semibold text-foreground mb-3">Management Team</h4>
              <p className="text-muted-foreground">
                Team con esperienza trasversale in M&A, ECM e private equity: Ruini, Taioli, Ravizza, Vitali
              </p>
            </div>
          </div>
        </section>

        {/* Rationale Strategico */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold text-foreground">Rationale Strategico</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Co-investimento Potenziato</h4>
              <p className="text-muted-foreground">
                Rafforzare la capacità di co-investimento nei Club Deal come anchor investor, aumentando la quota di partecipazione e il potenziale ritorno.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Liquidità e Capitalizzazione</h4>
              <p className="text-muted-foreground">
                Aumentare la liquidità del titolo e la capitalizzazione per migliorare l'attrattività verso investitori istituzionali.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Preparazione Migrazione</h4>
              <p className="text-muted-foreground">
                Preparare la base patrimoniale a una successiva migrazione da EGM a segmento regolamentato o a partnership strategiche.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Consolidamento Rete</h4>
              <p className="text-muted-foreground">
                Consolidare la rete di family office e HNWI attivi nel mercato dei deal privati.
              </p>
            </div>
          </div>
        </section>

        {/* Investment Case */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold text-foreground">Investment Case</h3>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fattore</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Valutazione</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Commento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Performance storica</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                        Forte
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">IRR &gt;20%, realizzazioni multiple, track record verificabile</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Pipeline deal 2025–26</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                        Alta visibilità
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Settori Food, Events, Medtech già in fase di strutturazione</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Governance & Management</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                        Solida
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Board indipendente, Advisory Board con figure di standing</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Attrattività equity story</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                        Buona
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Società benefit quotata, diversificazione per investitore</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Liquidità titolo</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-medium">
                        Limitata
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Mercato EGM con flottante ridotto</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Comunicazione finanziaria</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-medium">
                        Migliorabile
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Occorre rafforzare IR e contenuti per investitori istituzionali</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Use of Proceeds */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Use of Proceeds</h3>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Nuovi Club Deal</span>
                  <span className="text-primary font-bold">90%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ €9–11 mln per sottoscrizione in nuovi Club Deal (Project Bake, Project Events, Medtech follow-on)
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Partecipazioni Strategiche</span>
                  <span className="text-primary font-bold">10%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "10%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ €1–1.5 mln per partecipazioni strategiche e operazioni di pipeline ECM/M&A con Giotto SIM
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valutazione */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Valutazione e Posizionamento</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-4">Valutazione</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pre-money</span>
                  <span className="font-semibold text-foreground">~€32 mln</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Post-money (target)</span>
                  <span className="font-semibold text-foreground">€44–47 mln</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <span className="text-muted-foreground">Ownership dilution</span>
                  <span className="font-semibold text-primary">25–30%</span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-4">Target Investor Base</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>Family Office italiani ed europei</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>Investitori professionali</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>SIM e club di investitori privati</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rischi */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <h3 className="text-3xl font-bold text-foreground">Rischi Principali</h3>
          </div>
          <div className="bg-card border border-yellow-600/20 rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Execution Risk</h4>
                  <p className="text-muted-foreground">
                    Capacità di chiudere nuovi deal entro la finestra temporale prevista e deploy efficace della nuova raccolta.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Mercato di riferimento</h4>
                  <p className="text-muted-foreground">
                    Contrazione potenziale dei multipli nel segmento mid-market PE.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Liquidità del titolo</h4>
                  <p className="text-muted-foreground">
                    Scambi limitati su Euronext Growth Milan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fundraising Readiness Score */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Fundraising Readiness Score</h3>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Equity Story & Governance</span>
                  <span className="text-primary font-bold">4.5/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Struttura chiara e team credibile</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Track Record & Performance</span>
                  <span className="text-primary font-bold">5.0/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Ottimo rendimento e track record verificabile</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Pipeline & Use of Funds</span>
                  <span className="text-primary font-bold">4.0/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "80%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Deal concreti già individuati</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Investor Proposition</span>
                  <span className="text-blue-600 font-bold">3.5/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Migliorabile IR e visibilità</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Execution & Timing</span>
                  <span className="text-blue-600 font-bold">3.5/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Necessità di chiudere entro Q4 2025</p>
              </div>
              <div className="border-t border-border pt-6 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Totale medio ponderato</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">4.1/5</div>
                    <div className="text-sm text-green-600 font-medium">High Readiness</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusione */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Conclusione</h3>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <p className="text-foreground text-lg mb-6">
              L'aumento di capitale di ABC Company S.p.A. presenta <span className="font-semibold text-primary">alta probabilità di successo (70–80%)</span> in caso di:
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-muted-foreground">
                  Posizionamento dell'offerta verso network di family office industriali e investitori con track record in Club Deal
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-muted-foreground">
                  Comunicazione IR focalizzata su risultati ottenuti (Lipogems, Fornaio del Casale) e pipeline immediata
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-muted-foreground">
                  Eventuale garanzia parziale o anchor commitment da soci esistenti per catalizzare adesioni early-stage
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ABC Company S.p.A. | Strettamente Privato e Confidenziale</p>
          <p className="mt-2">
            Prepared by <span className="text-foreground font-medium">ARIES76 Capital Advisory</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ABCCompanyProposal;
