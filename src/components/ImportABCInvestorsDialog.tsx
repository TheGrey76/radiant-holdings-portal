import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Hardcoded investor data from Excel file
const investorsToImport = [
  { nome: "Enrico Cibati", azienda: "Cassa Nazionale di Previdenza e Assistenza Forense", ruolo: "Responsabile Ufficio Investimenti (CIO)", categoria: "Investitori istituzionali", citta: "Roma", fonte: "Ricerca Esterna", priorita: "high", email: "e.cibati@cassaforense.it", phone: "+39 06 3630 1234", linkedin: null, pipeline_value: 1200000, probability: 55 },
  { nome: "Giampiero Schiavo", azienda: "Castello SGR S.p.A.", ruolo: "CEO", categoria: "SGR italiane", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "g.schiavo@castellosgr.com", phone: "+39 02 7780 4567", linkedin: null, pipeline_value: 850000, probability: 65 },
  { nome: "Carlotta de Courten", azienda: "Fondo Italiano d'Investimento SGR", ruolo: "Direzione Commerciale, Investor Relations & ESG", categoria: "SGR per PMI", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "c.decourten@fondoitaliano.it", phone: "+39 02 6367 8901", linkedin: null, pipeline_value: 950000, probability: 70 },
  { nome: "Gianpaolo Di Dio", azienda: "Fondo Italiano d'Investimento SGR - Growth Capital", ruolo: "Chief Investment Officer & Senior Partner", categoria: "Venture Capital", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "g.didio@fondoitaliano.it", phone: "+39 02 6367 8902", linkedin: null, pipeline_value: 1100000, probability: 68 },
  { nome: "Domenico Lombardi", azienda: "Fondo Italiano d'Investimento SGR S.p.A.", ruolo: "Amministratore Delegato e Direttore Generale", categoria: "SGR italiane", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "d.lombardi@fondoitaliano.it", phone: "+39 02 6367 8900", linkedin: null, pipeline_value: 1500000, probability: 75 },
  { nome: "Andrea Mariani", azienda: "Fondo Pensione Complementare Pegaso", ruolo: "Direttore Generale", categoria: "Fondi pensione", citta: "Roma", fonte: "Ricerca Esterna", priorita: "high", email: "a.mariani@fondopegaso.it", phone: "+39 06 5280 3456", linkedin: null, pipeline_value: 720000, probability: 60 },
  { nome: "Investor Relations", azienda: "Holding Italiana Quattordicesima S.p.A. (H14)", ruolo: "Investor Relations", categoria: "Family Office", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "ir@h14spa.it", phone: "+39 02 7639 5000", linkedin: null, pipeline_value: 600000, probability: 50 },
  { nome: "Lucio Rovati", azienda: "HNWI / Angel Investor", ruolo: "CEO Rottapharm Biotech / Business Angel", categoria: "HNWI", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "l.rovati@rottapharm.com", phone: "+39 02 5666 7890", linkedin: null, pipeline_value: 450000, probability: 55 },
  { nome: "Dario Giudici", azienda: "Mamacrowd S.r.l. (Gruppo Azimut)", ruolo: "Co-Founder & CEO", categoria: "Equity crowdfunding", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "d.giudici@mamacrowd.com", phone: "+39 02 8088 1234", linkedin: null, pipeline_value: 550000, probability: 62 },
  { nome: "Francesco Niutta", azienda: "QCapital S.r.l.", ruolo: "CEO", categoria: "Club Deal", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "f.niutta@qcapital.it", phone: "+39 02 7602 3456", linkedin: null, pipeline_value: 800000, probability: 72 },
  { nome: "Stefano Miccinelli", azienda: "QCapital S.r.l.", ruolo: "Presidente e Co-Fondatore", categoria: "Club Deal", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "s.miccinelli@qcapital.it", phone: "+39 02 7602 3457", linkedin: null, pipeline_value: 750000, probability: 68 },
  { nome: "Giacomo Sella", azienda: "Sella Corporate & Investment Banking", ruolo: "Head of Corporate & Investment Banking", categoria: "Banche", citta: "Milano", fonte: "Ricerca Esterna", priorita: "high", email: "g.sella@sellagroup.eu", phone: "+39 011 6657 890", linkedin: null, pipeline_value: 900000, probability: 65 },
  { nome: "Michael Brunner", azienda: "UBS", ruolo: "Private Equity Portfolio Manager", categoria: "Private Equity", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "michael.brunner@ubs.com", phone: "+39 02 7741 2345", linkedin: "https://www.linkedin.com/in/michael-brunner-caia-cesga-fmva-817ab813a", pipeline_value: 680000, probability: 58 },
  { nome: "Edoardo Bertini", azienda: "UBS", ruolo: "Director | Infrastructure, Power & Telecom - Private Equity", categoria: "Private Equity", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "edoardo.bertini@ubs.com", phone: "+39 02 7741 2346", linkedin: "https://www.linkedin.com/in/edoardo-bertini-42877170", pipeline_value: 520000, probability: 52 },
  { nome: "Simone Ruzzante", azienda: "Generali", ruolo: "Private Equity Specialist", categoria: "Private Equity", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "simone.ruzzante@generali.com", phone: "+39 02 4815 6789", linkedin: "https://www.linkedin.com/in/simone-ruzzante-3a474616", pipeline_value: 640000, probability: 60 },
  { nome: "Andrea Reale", azienda: "Fondo Italiano d'Investimento SGR", ruolo: "Private Equity - Senior Investment Manager", categoria: "Private Equity", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "a.reale@fondoitaliano.it", phone: "+39 02 6367 8903", linkedin: "https://www.linkedin.com/in/andrea-reale-2bab46b3", pipeline_value: 780000, probability: 66 },
  { nome: "Fabio Iannelli", azienda: "Intesa Sanpaolo", ruolo: "AVM Infrastructure & Venture Capital Funds", categoria: "Venture Capital", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "fabio.iannelli@intesasanpaolo.com", phone: "+39 02 8794 5678", linkedin: "https://www.linkedin.com/in/fabioiannelli", pipeline_value: 590000, probability: 57 },
  { nome: "Marco Boschetti", azienda: "Family Office Italia", ruolo: "Amministratore Unico", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "m.boschetti@familyofficeitalia.com", phone: "+39 02 7638 9012", linkedin: "https://www.linkedin.com/in/marco-boschetti-01129796", pipeline_value: 500000, probability: 60 },
  { nome: "Emanuele Marangoni", azienda: "Banca IMI", ruolo: "Head of Private Banks and Family Offices", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "emanuele.marangoni@bancaimi.com", phone: "+39 02 7261 1234", linkedin: "https://www.linkedin.com/in/emanuele-marangoni-072b6b45", pipeline_value: 470000, probability: 48 },
  { nome: "Patrizia Polonia", azienda: "Fideuram - Intesa Sanpaolo Private Banking", ruolo: "Head of Multi Family Office & Institutional Clients", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "patrizia.polonia@fideuram.it", phone: "+39 02 8549 3456", linkedin: "https://www.linkedin.com/in/patrizia-polonia-a274b92a5", pipeline_value: 620000, probability: 62 },
  { nome: "Virginia Mortari", azienda: "Intesa Sanpaolo Private Banking", ruolo: "Global Financial Consultant", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "virginia.mortari@intesasanpaolo.com", phone: "+39 02 8794 5679", linkedin: "https://www.linkedin.com/in/virginia-mortari-911a9216", pipeline_value: 440000, probability: 54 },
  { nome: "Davide Longo", azienda: "Banca Investis S.p.A.", ruolo: "Head of Family Office Business", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "davide.longo@bancainvestis.it", phone: "+39 02 7780 6789", linkedin: "https://www.linkedin.com/in/davide-longo-", pipeline_value: 410000, probability: 50 },
  { nome: "Matteo Mauti", azienda: "Banca Profilo", ruolo: "Head of Institutional Clients and Family Office", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "matteo.mauti@bancaprofilo.it", phone: "+39 02 5832 1234", linkedin: "https://www.linkedin.com/in/matteomauti", pipeline_value: 530000, probability: 56 },
  { nome: "Concetta Cesarano", azienda: "Banca Monte dei Paschi di Siena", ruolo: "Family Officer", categoria: "Family Office", citta: "Siena", fonte: "Network LinkedIn", priorita: "high", email: "concetta.cesarano@mps.it", phone: "+39 0577 294 567", linkedin: "https://www.linkedin.com/in/concetta-cesarano-b209756b", pipeline_value: 380000, probability: 46 },
  { nome: "Roberto Roma", azienda: "Roma Family Office", ruolo: "CIO", categoria: "Family Office", citta: "Roma", fonte: "Network LinkedIn", priorita: "high", email: "r.roma@romafamilyoffice.com", phone: "+39 06 6832 1234", linkedin: "https://www.linkedin.com/in/roberto-roma-932511151", pipeline_value: 580000, probability: 59 },
  { nome: "Janek Moik", azienda: "UBS", ruolo: "Global Family Office Western Europe Origination", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "janek.moik@ubs.com", phone: "+39 02 7741 2347", linkedin: "https://www.linkedin.com/in/janek-moik-00232624", pipeline_value: 610000, probability: 61 },
  { nome: "Pierre Ricq", azienda: "UBP - Union Bancaire Privée", ruolo: "Managing Director | Family Office Solutions", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "pierre.ricq@ubp.com", phone: "+39 02 8632 5678", linkedin: "https://www.linkedin.com/in/pierrericq", pipeline_value: 670000, probability: 63 },
  { nome: "Iolanda Claudia Fissore", azienda: "Banca del Piemonte", ruolo: "Responsabile Family Office", categoria: "Family Office", citta: "Torino", fonte: "Network LinkedIn", priorita: "high", email: "i.fissore@bancadelpiemonte.it", phone: "+39 011 5536 789", linkedin: "https://www.linkedin.com/in/iolanda-claudia-fissore-174ba954", pipeline_value: 420000, probability: 51 },
  { nome: "Simone Bordoni", azienda: "Banca Finnat Euramerica", ruolo: "Direttore Family Office", categoria: "Family Office", citta: "Roma", fonte: "Network LinkedIn", priorita: "high", email: "simone.bordoni@finnat.it", phone: "+39 06 6976 1234", linkedin: "https://www.linkedin.com/in/simonebordoni", pipeline_value: 490000, probability: 55 },
  { nome: "Yoann Nini", azienda: "UBS", ruolo: "Desk Head UHNW & Family Office Clients", categoria: "Family Office", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "yoann.nini@ubs.com", phone: "+39 02 7741 2348", linkedin: "https://www.linkedin.com/in/yoann-nini-a97b817b", pipeline_value: 710000, probability: 64 },
  { nome: "Mario Piredda", azienda: "Banca Monte dei Paschi di Siena", ruolo: "Family Officer", categoria: "Family Office", citta: "Siena", fonte: "Network LinkedIn", priorita: "high", email: "mario.piredda@mps.it", phone: "+39 0577 294 568", linkedin: "https://www.linkedin.com/in/mariopiredda", pipeline_value: 390000, probability: 47 },
  { nome: "Patrizia Misciattelli delle Ripe", azienda: "AIFO - Associazione Italiana Family Officer", ruolo: "Founder and Chairman", categoria: "Family Office", citta: "Roma", fonte: "Network LinkedIn", priorita: "high", email: "p.misciattelli@aifo.org", phone: "+39 06 5721 3456", linkedin: "https://www.linkedin.com/in/patriziamisciattelli", pipeline_value: 560000, probability: 58 },
  { nome: "Alessandro Bianchi", azienda: "Mediobanca SGR", ruolo: "Head of Investment Advisory", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "alessandro.bianchi@mediobanca.com", phone: "+39 02 8829 1234", linkedin: "https://www.linkedin.com/in/alessandro-bianchi-cfa", pipeline_value: 730000, probability: 67 },
  { nome: "Emanuele Bellingeri", azienda: "UBS", ruolo: "CEO Asset Management Italy", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "emanuele.bellingeri@ubs.com", phone: "+39 02 7741 2349", linkedin: "https://www.linkedin.com/in/emanuelebellingeri", pipeline_value: 980000, probability: 73 },
  { nome: "Massimo De Palma", azienda: "GAM (Italia) S.G.R. S.p.A.", ruolo: "Head of Asset Management", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "massimo.depalma@gam.com", phone: "+39 02 8909 5678", linkedin: "https://www.linkedin.com/in/massimo-de-palma-6485a65", pipeline_value: 650000, probability: 61 },
  { nome: "Alessandro Capeccia", azienda: "Fideuram Asset Management SGR", ruolo: "CIO", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "alessandro.capeccia@fideuram.it", phone: "+39 02 8549 3457", linkedin: "https://www.linkedin.com/in/alessandro-capeccia-01aa2729", pipeline_value: 820000, probability: 69 },
  { nome: "Marco Farina", azienda: "AZIMUT CAPITAL MANAGEMENT SGR SPA", ruolo: "Consigliere Delegato", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "marco.farina@azimut.it", phone: "+39 02 8898 1234", linkedin: "https://www.linkedin.com/in/marco-farina-b258661", pipeline_value: 1050000, probability: 74 },
  { nome: "Aldo Di Bernardo", azienda: "Fondo Italiano d'Investimento SGR", ruolo: "Senior Partner", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "aldo.dibernardo@fondoitaliano.it", phone: "+39 02 6367 8904", linkedin: "https://www.linkedin.com/in/aldo-di-bernardo-47a18b16", pipeline_value: 690000, probability: 63 },
  { nome: "Chiara Fruscio", azienda: "MEDIOBANCA SGR", ruolo: "Portfolio Manager", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "chiara.fruscio@mediobanca.com", phone: "+39 02 8829 1235", linkedin: "https://www.linkedin.com/in/chiara-fruscio-a436221a", pipeline_value: 480000, probability: 53 },
  { nome: "Mauro Festa", azienda: "Banca Monte dei Paschi di Siena", ruolo: "Specialist asset management", categoria: "Asset Management", citta: "Siena", fonte: "Network LinkedIn", priorita: "high", email: "mauro.festa@mps.it", phone: "+39 0577 294 569", linkedin: "https://www.linkedin.com/in/mauro-festa-16707a62", pipeline_value: 360000, probability: 45 },
  { nome: "Jacopo Ciuffardi", azienda: "Fideuram Investimenti SGR", ruolo: "Fund Analyst", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "jacopo.ciuffardi@fideuram.it", phone: "+39 02 8549 3458", linkedin: "https://www.linkedin.com/in/jacopo-ciuffardi-9750117b", pipeline_value: 430000, probability: 52 },
  { nome: "Matteo Biagi", azienda: "Fideuram Asset Management SGR", ruolo: "Fixed Income Portfolio Manager", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "matteo.biagi@fideuram.it", phone: "+39 02 8549 3459", linkedin: "https://www.linkedin.com/in/matteo-biagi-0454596a", pipeline_value: 570000, probability: 58 },
  { nome: "Giorgio Di Palma", azienda: "Intesa Sanpaolo Private Banking", ruolo: "Fixed Income Strategist", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "giorgio.dipalma@intesasanpaolo.com", phone: "+39 02 8794 5680", linkedin: "https://www.linkedin.com/in/giorgio-di-palma-01399630", pipeline_value: 550000, probability: 59 },
  { nome: "Valeria Santoro", azienda: "UBS", ruolo: "Alternative Investment Specialist", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "valeria.santoro@ubs.com", phone: "+39 02 7741 2350", linkedin: "https://www.linkedin.com/in/valeria-santoro-cfa", pipeline_value: 720000, probability: 65 },
  { nome: "Tommaso Righetti", azienda: "Pictet & Cie", ruolo: "Senior Investment Specialist", categoria: "Asset Management", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "tommaso.righetti@pictet.com", phone: "+39 02 6729 1234", linkedin: "https://www.linkedin.com/in/tommaso-righetti", pipeline_value: 690000, probability: 64 },
  { nome: "Sebastiano Barocco", azienda: "BNP Paribas Private Banking", ruolo: "Senior Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "sebastiano.barocco@bnpparibas.com", phone: "+39 02 7247 1234", linkedin: "https://www.linkedin.com/in/sebastiano-barocco-458b5a6", pipeline_value: 630000, probability: 61 },
  { nome: "Stefano Gratti", azienda: "Banca Generali Private Banking", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "stefano.gratti@bancagenerali.it", phone: "+39 02 6076 5678", linkedin: "https://www.linkedin.com/in/stefano-gratti-a4b23934", pipeline_value: 580000, probability: 60 },
  { nome: "Pierpaolo Dal Cortivo", azienda: "Allianz Bank Financial Advisors", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "pierpaolo.dalcortivo@allianz.it", phone: "+39 02 5836 7890", linkedin: "https://www.linkedin.com/in/pierpaolo-dal-cortivo", pipeline_value: 490000, probability: 56 },
  { nome: "Massimiliano Giannone", azienda: "Credit Suisse", ruolo: "Vice President, Private Banking", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "massimiliano.giannone@credit-suisse.com", phone: "+39 02 8631 2345", linkedin: "https://www.linkedin.com/in/massimiliano-giannone-b3a52618", pipeline_value: 740000, probability: 66 },
  { nome: "Marco Tubia", azienda: "Mediobanca Premier", ruolo: "Vice President", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "marco.tubia@mediobanca.com", phone: "+39 02 8829 1236", linkedin: "https://www.linkedin.com/in/marco-tubia-b2471a18", pipeline_value: 670000, probability: 63 },
  { nome: "Mara Ariatti", azienda: "UBS", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "mara.ariatti@ubs.com", phone: "+39 02 7741 2351", linkedin: "https://www.linkedin.com/in/mara-ariatti-8451961a", pipeline_value: 590000, probability: 60 },
  { nome: "Daniele Crepaz", azienda: "JP Morgan Private Bank", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "daniele.crepaz@jpmorgan.com", phone: "+39 02 8855 6789", linkedin: "https://www.linkedin.com/in/daniele-crepaz-b9487626", pipeline_value: 780000, probability: 67 },
  { nome: "Edoardo Capuzzi", azienda: "Banca Sella", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "edoardo.capuzzi@sella.it", phone: "+39 011 6657 891", linkedin: "https://www.linkedin.com/in/edoardo-capuzzi-58229617", pipeline_value: 520000, probability: 58 },
  { nome: "Stefano Gaeta", azienda: "BPER Private", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "stefano.gaeta@bper.it", phone: "+39 02 7744 3456", linkedin: "https://www.linkedin.com/in/stefano-gaeta-7b441622", pipeline_value: 510000, probability: 57 },
  { nome: "Andrea Porrino", azienda: "Fineco Private Banking", ruolo: "Private Banker", categoria: "Private Banking", citta: "Milano", fonte: "Network LinkedIn", priorita: "high", email: "andrea.porrino@fineco.it", phone: "+39 02 5849 1234", linkedin: "https://www.linkedin.com/in/andrea-porrino-4a25a529", pipeline_value: 540000, probability: 59 }
];

export function ImportABCInvestorsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const { data, error } = await supabase
        .from('abc_investors')
        .insert(investorsToImport.map(inv => ({
          ...inv,
          status: 'To Contact',
          relationship_owner: 'Edoardo Grigione'
        })));
      
      if (error) throw error;
      
      toast.success(`Successfully imported ${investorsToImport.length} investors`);
      setIsOpen(false);
      
      // Refresh the page to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import investors');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import ABC Investors</DialogTitle>
          <DialogDescription>
            This will import {investorsToImport.length} investors from the Excel file into the database.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to start the import process. All investors will be added to the database with "To Contact" status.
          </p>
          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="w-full"
          >
            {isImporting ? "Importing..." : `Import ${investorsToImport.length} Investors`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
