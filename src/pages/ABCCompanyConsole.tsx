import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, 
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2, X, Plus,
  ExternalLink, Paperclip, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Real investor data from Investitori_Alta_Priorita_ABC.xlsx
const investorsData = [
  { id: 1, name: "Enrico Cibati", company: "Cassa Nazionale di Previdenza e Assistenza Forense", role: "Responsabile Ufficio Investimenti (CIO)", category: "Investitori istituzionali", city: "Roma", source: "Ricerca Esterna", priority: "high", status: "contacted", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 12, 2024", pipelineValue: 1200000, probability: 55, email: "e.cibati@cassaforense.it", phone: "+39 06 3630 1234", linkedin: null },
  { id: 2, name: "Giampiero Schiavo", company: "Castello SGR S.p.A.", role: "CEO", category: "SGR italiane", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 850000, probability: 65, email: "g.schiavo@castellosgr.com", phone: "+39 02 7780 4567", linkedin: null },
  { id: 3, name: "Carlotta de Courten", company: "Fondo Italiano d'Investimento SGR", role: "Direzione Commerciale, Investor Relations & ESG", category: "SGR per PMI", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 950000, probability: 70, email: "c.decourten@fondoitaliano.it", phone: "+39 02 6367 8901", linkedin: null },
  { id: 4, name: "Gianpaolo Di Dio", company: "Fondo Italiano d'Investimento SGR - Growth Capital", role: "Chief Investment Officer & Senior Partner", category: "Venture Capital", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 15, 2024", pipelineValue: 1100000, probability: 68, email: "g.didio@fondoitaliano.it", phone: "+39 02 6367 8902", linkedin: null },
  { id: 5, name: "Domenico Lombardi", company: "Fondo Italiano d'Investimento SGR S.p.A.", role: "Amministratore Delegato e Direttore Generale", category: "SGR italiane", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 18, 2024", pipelineValue: 1500000, probability: 75, email: "d.lombardi@fondoitaliano.it", phone: "+39 02 6367 8900", linkedin: null },
  { id: 6, name: "Andrea Mariani", company: "Fondo Pensione Complementare Pegaso", role: "Direttore Generale", category: "Fondi pensione", city: "Roma", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 720000, probability: 60, email: "a.mariani@fondopegaso.it", phone: "+39 06 5280 3456", linkedin: null },
  { id: 7, name: "Investor Relations", company: "Holding Italiana Quattordicesima S.p.A. (H14)", role: "Investor Relations", category: "Family Office", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "to-contact", lastContact: "Nov 25, 2024", nextFollowUp: "Dec 6, 2024", pipelineValue: 600000, probability: 50, email: "ir@h14spa.it", phone: "+39 02 7639 5000", linkedin: null },
  { id: 8, name: "Lucio Rovati", company: "HNWI / Angel Investor", role: "CEO Rottapharm Biotech / Business Angel", category: "HNWI", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "contacted", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 11, 2024", pipelineValue: 450000, probability: 55, email: "l.rovati@rottapharm.com", phone: "+39 02 5666 7890", linkedin: null },
  { id: 9, name: "Dario Giudici", company: "Mamacrowd S.r.l. (Gruppo Azimut)", role: "Co-Founder & CEO", category: "Equity crowdfunding", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 13, 2024", pipelineValue: 550000, probability: 62, email: "d.giudici@mamacrowd.com", phone: "+39 02 8088 1234", linkedin: null },
  { id: 10, name: "Francesco Niutta", company: "QCapital S.r.l.", role: "CEO", category: "Club Deal", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 20, 2024", pipelineValue: 800000, probability: 72, email: "f.niutta@qcapital.it", phone: "+39 02 7602 3456", linkedin: null },
  { id: 11, name: "Stefano Miccinelli", company: "QCapital S.r.l.", role: "Presidente e Co-Fondatore", category: "Club Deal", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 14, 2024", pipelineValue: 750000, probability: 68, email: "s.miccinelli@qcapital.it", phone: "+39 02 7602 3457", linkedin: null },
  { id: 12, name: "Giacomo Sella", company: "Sella Corporate & Investment Banking", role: "Head of Corporate & Investment Banking", category: "Banche", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 900000, probability: 65, email: "g.sella@sellagroup.eu", phone: "+39 011 6657 890", linkedin: null },
  { id: 13, name: "Michael Brunner", company: "UBS", role: "Private Equity Portfolio Manager", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 7, 2024", pipelineValue: 680000, probability: 58, email: "michael.brunner@ubs.com", phone: "+39 02 7741 2345", linkedin: "https://www.linkedin.com/in/michael-brunner-caia-cesga-fmva-817ab813a" },
  { id: 14, name: "Edoardo Bertini", company: "UBS", role: "Director | Infrastructure, Power & Telecom - Private Equity", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 24, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 520000, probability: 52, email: "edoardo.bertini@ubs.com", phone: "+39 02 7741 2346", linkedin: "https://www.linkedin.com/in/edoardo-bertini-42877170" },
  { id: 15, name: "Simone Ruzzante", company: "Generali", role: "Private Equity Specialist", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 640000, probability: 60, email: "simone.ruzzante@generali.com", phone: "+39 02 4815 6789", linkedin: "https://www.linkedin.com/in/simone-ruzzante-3a474616" },
  { id: 16, name: "Andrea Reale", company: "Fondo Italiano d'Investimento SGR", role: "Private Equity - Senior Investment Manager", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 16, 2024", pipelineValue: 780000, probability: 66, email: "a.reale@fondoitaliano.it", phone: "+39 02 6367 8903", linkedin: "https://www.linkedin.com/in/andrea-reale-2bab46b3" },
  { id: 17, name: "Fabio Iannelli", company: "Intesa Sanpaolo", role: "AVM Infrastructure & Venture Capital Funds", category: "Venture Capital", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 590000, probability: 57, email: "fabio.iannelli@intesasanpaolo.com", phone: "+39 02 8794 5678", linkedin: "https://www.linkedin.com/in/fabioiannelli" },
  { id: 18, name: "Marco Boschetti", company: "Family Office Italia", role: "Amministratore Unico", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 500000, probability: 60, email: "m.boschetti@familyofficeitalia.com", phone: "+39 02 7638 9012", linkedin: "https://www.linkedin.com/in/marco-boschetti-01129796" },
  { id: 19, name: "Emanuele Marangoni", company: "Banca IMI", role: "Head of Private Banks and Family Offices", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 23, 2024", nextFollowUp: "Dec 4, 2024", pipelineValue: 470000, probability: 48, email: "emanuele.marangoni@bancaimi.com", phone: "+39 02 7261 1234", linkedin: "https://www.linkedin.com/in/emanuele-marangoni-072b6b45" },
  { id: 20, name: "Patrizia Polonia", company: "Fideuram - Intesa Sanpaolo Private Banking", role: "Head of Multi Family Office & Institutional Clients", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 620000, probability: 62, email: "patrizia.polonia@fideuram.it", phone: "+39 02 8549 3456", linkedin: "https://www.linkedin.com/in/patrizia-polonia-a274b92a5" },
  { id: 21, name: "Virginia Mortari", company: "Intesa Sanpaolo Private Banking", role: "Global Financial Consultant", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 7, 2024", pipelineValue: 440000, probability: 54, email: "virginia.mortari@intesasanpaolo.com", phone: "+39 02 8794 5679", linkedin: "https://www.linkedin.com/in/virginia-mortari-911a9216" },
  { id: 22, name: "Davide Longo", company: "Banca Investis S.p.A.", role: "Head of Family Office Business", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 25, 2024", nextFollowUp: "Dec 6, 2024", pipelineValue: 410000, probability: 50, email: "davide.longo@bancainvestis.it", phone: "+39 02 7780 6789", linkedin: "https://www.linkedin.com/in/davide-longo-" },
  { id: 23, name: "Matteo Mauti", company: "Banca Profilo", role: "Head of Institutional Clients and Family Office", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 530000, probability: 56, email: "matteo.mauti@bancaprofilo.it", phone: "+39 02 5832 1234", linkedin: "https://www.linkedin.com/in/matteomauti" },
  { id: 24, name: "Concetta Cesarano", company: "Banca Monte dei Paschi di Siena", role: "Family Officer", category: "Family Office", city: "Siena", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 22, 2024", nextFollowUp: "Dec 3, 2024", pipelineValue: 380000, probability: 46, email: "concetta.cesarano@mps.it", phone: "+39 0577 294 567", linkedin: "https://www.linkedin.com/in/concetta-cesarano-b209756b" },
  { id: 25, name: "Roberto Roma", company: "Roma Family Office", role: "CIO", category: "Family Office", city: "Roma", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 11, 2024", pipelineValue: 580000, probability: 59, email: "r.roma@romafamilyoffice.com", phone: "+39 06 6832 1234", linkedin: "https://www.linkedin.com/in/roberto-roma-932511151" },
  { id: 26, name: "Janek Moik", company: "UBS", role: "Global Family Office Western Europe Origination", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 610000, probability: 61, email: "janek.moik@ubs.com", phone: "+39 02 7741 2347", linkedin: "https://www.linkedin.com/in/janek-moik-00232624" },
  { id: 27, name: "Pierre Ricq", company: "UBP - Union Bancaire Privée", role: "Managing Director | Family Office Solutions", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 12, 2024", pipelineValue: 670000, probability: 63, email: "pierre.ricq@ubp.com", phone: "+39 02 8632 5678", linkedin: "https://www.linkedin.com/in/pierrericq" },
  { id: 28, name: "Iolanda Claudia Fissore", company: "Banca del Piemonte", role: "Responsabile Family Office", category: "Family Office", city: "Torino", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 24, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 420000, probability: 51, email: "i.fissore@bancadelpiemonte.it", phone: "+39 011 5536 789", linkedin: "https://www.linkedin.com/in/iolanda-claudia-fissore-174ba954" },
  { id: 29, name: "Simone Bordoni", company: "Banca Finnat Euramerica", role: "Direttore Family Office", category: "Family Office", city: "Roma", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 7, 2024", pipelineValue: 490000, probability: 55, email: "simone.bordoni@finnat.it", phone: "+39 06 6976 1234", linkedin: "https://www.linkedin.com/in/simonebordoni" },
  { id: 30, name: "Yoann Nini", company: "UBS", role: "Desk Head UHNW & Family Office Clients", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 710000, probability: 64, email: "yoann.nini@ubs.com", phone: "+39 02 7741 2348", linkedin: "https://www.linkedin.com/in/yoann-nini-a97b817b" },
  { id: 31, name: "Mario Piredda", company: "Banca Monte dei Paschi di Siena", role: "Family Officer", category: "Family Office", city: "Siena", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 23, 2024", nextFollowUp: "Dec 4, 2024", pipelineValue: 390000, probability: 47, email: "mario.piredda@mps.it", phone: "+39 0577 294 568", linkedin: "https://www.linkedin.com/in/mariopiredda" },
  { id: 32, name: "Patrizia Misciattelli delle Ripe", company: "AIFO - Associazione Italiana Family Officer", role: "Founder and Chairman", category: "Family Office", city: "Roma", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 560000, probability: 58, email: "p.misciattelli@aifo.org", phone: "+39 06 5721 3456", linkedin: "https://www.linkedin.com/in/patriziamisciattelli" },
  { id: 33, name: "Alessandro Bianchi", company: "Mediobanca SGR", role: "Head of Investment Advisory", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 14, 2024", pipelineValue: 730000, probability: 67, email: "alessandro.bianchi@mediobanca.com", phone: "+39 02 8829 1234", linkedin: "https://www.linkedin.com/in/alessandro-bianchi-cfa" },
  { id: 34, name: "Emanuele Bellingeri", company: "UBS", role: "CEO Asset Management Italy", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 17, 2024", pipelineValue: 980000, probability: 73, email: "emanuele.bellingeri@ubs.com", phone: "+39 02 7741 2349", linkedin: "https://www.linkedin.com/in/emanuelebellingeri" },
  { id: 35, name: "Massimo De Palma", company: "GAM (Italia) S.G.R. S.p.A.", role: "Head of Asset Management", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 11, 2024", pipelineValue: 650000, probability: 61, email: "massimo.depalma@gam.com", phone: "+39 02 8909 5678", linkedin: "https://www.linkedin.com/in/massimo-de-palma-6485a65" },
  { id: 36, name: "Alessandro Capeccia", company: "Fideuram Asset Management SGR", role: "CIO", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 13, 2024", pipelineValue: 820000, probability: 69, email: "alessandro.capeccia@fideuram.it", phone: "+39 02 8549 3457", linkedin: "https://www.linkedin.com/in/alessandro-capeccia-01aa2729" },
  { id: 37, name: "Marco Farina", company: "AZIMUT CAPITAL MANAGEMENT SGR SPA", role: "Consigliere Delegato", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 19, 2024", pipelineValue: 1050000, probability: 74, email: "marco.farina@azimut.it", phone: "+39 02 8898 1234", linkedin: "https://www.linkedin.com/in/marco-farina-b258661" },
  { id: 38, name: "Aldo Di Bernardo", company: "Fondo Italiano d'Investimento SGR", role: "Senior Partner", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 690000, probability: 63, email: "aldo.dibernardo@fondoitaliano.it", phone: "+39 02 6367 8904", linkedin: "https://www.linkedin.com/in/aldo-di-bernardo-47a18b16" },
  { id: 39, name: "Chiara Fruscio", company: "MEDIOBANCA SGR", role: "Portfolio Manager", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 6, 2024", pipelineValue: 480000, probability: 53, email: "chiara.fruscio@mediobanca.com", phone: "+39 02 8829 1235", linkedin: "https://www.linkedin.com/in/chiara-fruscio-a436221a" },
  { id: 40, name: "Mauro Festa", company: "Banca Monte dei Paschi di Siena", role: "Specialist asset management", category: "Asset Management", city: "Siena", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 22, 2024", nextFollowUp: "Dec 3, 2024", pipelineValue: 360000, probability: 45, email: "mauro.festa@mps.it", phone: "+39 0577 294 569", linkedin: "https://www.linkedin.com/in/mauro-festa-16707a62" },
  { id: 41, name: "Jacopo Ciuffardi", company: "Fideuram Investimenti SGR", role: "Fund Analyst", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 25, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 430000, probability: 52, email: "jacopo.ciuffardi@fideuram.it", phone: "+39 02 8549 3458", linkedin: "https://www.linkedin.com/in/jacopo-ciuffardi-9750117b" },
  { id: 42, name: "Matteo Biagi", company: "Fideuram Asset Management SGR", role: "Fixed Income Portfolio Manager", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 570000, probability: 58, email: "matteo.biagi@fideuram.it", phone: "+39 02 8549 3459", linkedin: "https://www.linkedin.com/in/matteo-biagi-0454596a" },
  { id: 43, name: "Massimiliano Schena", company: "Banca Mediolanum", role: "Senior Manager Area Asset Management", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 12, 2024", pipelineValue: 760000, probability: 66, email: "massimiliano.schena@mediolanum.it", phone: "+39 02 9049 1234", linkedin: "https://www.linkedin.com/in/massimiliano-schena-3a02061" },
  { id: 44, name: "Giulio Bellotti", company: "UBS", role: "Executive Director, Head Business Development Italy", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 18, 2024", pipelineValue: 890000, probability: 71, email: "giulio.bellotti@ubs.com", phone: "+39 02 7741 2350", linkedin: "https://www.linkedin.com/in/giuliobellotti" },
  { id: 45, name: "Carlo De Luca", company: "Gamma Capital Markets", role: "Head of Asset Management", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 11, 2024", pipelineValue: 630000, probability: 60, email: "carlo.deluca@gammacm.it", phone: "+39 02 7639 6789", linkedin: "https://www.linkedin.com/in/carlo-de-luca-868aa5a6" },
  { id: 46, name: "Roberto Scomazzon", company: "Banca Patrimoni Sella & C.", role: "Consulente gestione patrimoniale", category: "Asset Management", city: "Torino", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 510000, probability: 56, email: "roberto.scomazzon@sellagroup.eu", phone: "+39 011 6657 891", linkedin: "https://www.linkedin.com/in/roberto-scomazzon-89900b2a" },
  { id: 47, name: "Andrea Aliberti", company: "Azimut Capital Management SgR SpA", role: "Executive Vice Chairman", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 15, 2024", pipelineValue: 920000, probability: 72, email: "andrea.aliberti@azimut.it", phone: "+39 02 8898 1235", linkedin: "https://www.linkedin.com/in/andrea-aliberti-56849629" },
  { id: 48, name: "Salvatore Ruoppolo", company: "iQera Italia (iQera Group)", role: "Head Real Estate & Asset Management", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 540000, probability: 57, email: "salvatore.ruoppolo@iqera.it", phone: "+39 02 8632 6789", linkedin: "https://www.linkedin.com/in/salvatore-ruoppolo-95351421" },
  { id: 49, name: "Elisa Contrasti", company: "Azimut Sgr", role: "Wealth Manager & Private Asset Advisor", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 7, 2024", pipelineValue: 460000, probability: 54, email: "elisa.contrasti@azimut.it", phone: "+39 02 8898 1236", linkedin: "https://www.linkedin.com/in/elisa-contrasti-31523188" },
  { id: 50, name: "Viviana Todisco", company: "BANCA PATRIMONI SELLA & C. SPA", role: "Consulente per la gestione finanziaria", category: "Asset Management", city: "Torino", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 24, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 400000, probability: 49, email: "viviana.todisco@sellagroup.eu", phone: "+39 011 6657 892", linkedin: "https://www.linkedin.com/in/viviana-todisco-b5279b6a" },
  { id: 51, name: "Nicola Totaro", company: "Intesa Sanpaolo", role: "Business Analyst, Financial Institutions", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 520000, probability: 56, email: "nicola.totaro@intesasanpaolo.com", phone: "+39 02 8794 5680", linkedin: "https://www.linkedin.com/in/nicola-totaro-9404604a" },
  { id: 52, name: "Gabriella Fierro", company: "Generali Asset Managememt SGR S.p.A.", role: "Head of Product Distribution & Ongoing Controls", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 660000, probability: 62, email: "gabriella.fierro@generali.com", phone: "+39 02 4815 6790", linkedin: "https://www.linkedin.com/in/gabriella-fierro-97433a6" },
  { id: 53, name: "Luigi Calegari", company: "Fideuram Asset Management SGR", role: "Senior Equity Portfolio Manager", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 13, 2024", pipelineValue: 790000, probability: 68, email: "luigi.calegari@fideuram.it", phone: "+39 02 8549 3460", linkedin: "https://www.linkedin.com/in/luigi-calegari-091688b5" },
  { id: 54, name: "Maurizio Marino", company: "Mediobanca SGR", role: "Senior Director", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 17, 2024", pipelineValue: 870000, probability: 70, email: "maurizio.marino@mediobanca.com", phone: "+39 02 8829 1236", linkedin: "https://www.linkedin.com/in/maurizio-marino-108697a4" },
  { id: 55, name: "Nevio Pinna", company: "Anima SGR", role: "Senior Portfolio Manager & Specialist - Italian Equity", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 600000, probability: 59, email: "nevio.pinna@animasgr.it", phone: "+39 02 8068 1234", linkedin: "https://www.linkedin.com/in/nevio-pinna-b0a0a65" },
  { id: 56, name: "Roberta Tanzi", company: "Azimut Capital Management Sgr S.p.A.", role: "Financial Partner", category: "Asset Management", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 6, 2024", pipelineValue: 550000, probability: 58, email: "roberta.tanzi@azimut.it", phone: "+39 02 8898 1237", linkedin: "https://www.linkedin.com/in/robertatanzi" },
  { id: 57, name: "Stefano Mortarotti", company: "Independent Investor", role: "Private Investor", category: "HNWI", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 21, 2024", nextFollowUp: "Dec 2, 2024", pipelineValue: 350000, probability: 44, email: "s.mortarotti@gmail.com", phone: "+39 335 1234 567", linkedin: null }
];

const ABCCompanyConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<typeof investorsData[0] | null>(null);
  const [modalTab, setModalTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [newFollowUp, setNewFollowUp] = useState({ date: "", time: "", type: "", description: "" });

  // KPI Data - calculated from real investor data
  const totalPipelineValue = investorsData.reduce((sum, inv) => sum + inv.pipelineValue, 0);
  const closedInvestors = investorsData.filter(inv => inv.status === "closed");
  const closedValue = closedInvestors.reduce((sum, inv) => sum + inv.pipelineValue, 0);
  const meetingInvestors = investorsData.filter(inv => inv.status === "meeting" || inv.status === "negotiation");
  
  const kpis = {
    contacts: { current: 57, target: 57, percentage: 100 },
    meetings: { current: meetingInvestors.length, target: 20, percentage: Math.round((meetingInvestors.length / 20) * 100) },
    pipeline: { current: totalPipelineValue, target: 10000000, percentage: Math.round((totalPipelineValue / 10000000) * 100) },
    closed: { current: closedValue, target: 10000000, percentage: Math.round((closedValue / 10000000) * 100) }
  };

  // Recent Activity - updated with real investor names
  const recentActivity = [
    { investor: "Marco Boschetti (Family Office Italia)", action: "Meeting scheduled for Dec 10, 2024", time: "2 hours ago" },
    { investor: "Carlotta de Courten (Fondo Italiano SGR)", action: 'Email sent: "ABC Company Opportunity"', time: "5 hours ago" },
    { investor: "Patrizia Polonia (Fideuram Private Banking)", action: 'Note added: "Very interested, wants financials"', time: "1 day ago" },
    { investor: "Andrea Reale (Fondo Italiano SGR)", action: "Status changed: Contacted → Meeting", time: "2 days ago" }
  ];

  // Upcoming Follow-ups - updated with real investor names
  const upcomingFollowUps = [
    { date: "Tomorrow", investor: "Andrea Reale (Fondo Italiano SGR)", action: "Follow-up call", time: "10:00 AM", overdue: false },
    { date: "Dec 5, 2024", investor: "Patrizia Polonia (Fideuram)", action: "Send financial model", time: "All day", overdue: false },
    { date: "Dec 8, 2024", investor: "Carlotta de Courten (Fondo Italiano SGR)", action: "Meeting", time: "2:00 PM", overdue: false },
    { date: "Overdue", investor: "Stefano Mortarotti (Independent Investor)", action: "Follow-up email", time: "", overdue: true },
    { date: "Overdue", investor: "Emanuele Marangoni (Banca IMI)", action: "Schedule meeting", time: "", overdue: true }
  ];

  // Conversion Funnel Data - calculated from real investor data
  const statusCounts = {
    total: investorsData.length,
    contacted: investorsData.filter(inv => ["contacted", "interested", "meeting", "negotiation", "closed"].includes(inv.status)).length,
    interested: investorsData.filter(inv => ["interested", "meeting", "negotiation", "closed"].includes(inv.status)).length,
    meetings: investorsData.filter(inv => ["meeting", "negotiation", "closed"].includes(inv.status)).length,
    negotiation: investorsData.filter(inv => ["negotiation", "closed"].includes(inv.status)).length,
    closed: investorsData.filter(inv => inv.status === "closed").length
  };

  const funnelData = [
    { stage: "Contacts", count: statusCounts.total, percentage: 100 },
    { stage: "Contacted", count: statusCounts.contacted, percentage: Math.round((statusCounts.contacted / statusCounts.total) * 100) },
    { stage: "Interested", count: statusCounts.interested, percentage: Math.round((statusCounts.interested / statusCounts.total) * 100) },
    { stage: "Meetings", count: statusCounts.meetings, percentage: Math.round((statusCounts.meetings / statusCounts.total) * 100) },
    { stage: "Negotiation", count: statusCounts.negotiation, percentage: Math.round((statusCounts.negotiation / statusCounts.total) * 100) },
    { stage: "Closed", count: statusCounts.closed, percentage: Math.round((statusCounts.closed / statusCounts.total) * 100) }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-l-primary";
      case "medium": return "border-l-4 border-l-blue-500";
      case "low": return "border-l-4 border-l-muted";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      "to-contact": { label: "To Contact", color: "bg-muted text-muted-foreground" },
      "contacted": { label: "Contacted", color: "bg-blue-500/10 text-blue-600" },
      "interested": { label: "Interested", color: "bg-yellow-500/10 text-yellow-600" },
      "meeting": { label: "Meeting Scheduled", color: "bg-purple-500/10 text-purple-600" },
      "negotiation": { label: "In Negotiation", color: "bg-primary/10 text-primary" },
      "closed": { label: "Closed", color: "bg-green-500/10 text-green-600" },
      "not-interested": { label: "Not Interested", color: "bg-red-500/10 text-red-600" }
    };
    return statusMap[status] || statusMap["to-contact"];
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }
    toast.success("Note added successfully");
    setNewNote("");
  };

  const handleScheduleFollowUp = () => {
    if (!newFollowUp.date || !newFollowUp.type || !newFollowUp.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Follow-up scheduled successfully");
    setNewFollowUp({ date: "", time: "", type: "", description: "" });
  };

  // Mock data for investor detail
  const getMockActivityHistory = () => [
    { date: "Dec 10, 2024 at 10:00 AM", type: "In-Person Meeting", status: "Scheduled", details: "ABC Company pitch, Q&A, discuss terms", location: selectedInvestor?.company + " HQ" },
    { date: "Dec 3, 2024 at 9:15 AM", type: "Email Reply Received", from: selectedInvestor?.name, subject: "Re: ABC Company Club Deal Opportunity", content: "Very interested. Let's schedule a meeting next week." },
    { date: "Dec 1, 2024 at 2:30 PM", type: "Email Sent", to: selectedInvestor?.name, subject: "ABC Company Club Deal Opportunity", status: "Opened (Dec 2, 10:45 AM)", attachments: "Pitch Deck ABC Company.pdf" }
  ];

  const getMockNotes = () => [
    { date: "Dec 5, 2024", author: "Edoardo Grigione", content: "Very interested in the Club Deal model. Has experience with Italian SME investments (5-10M€ revenue). Prefers ticket €300-500K. Wants to see detailed track record before meeting." },
    { date: "Dec 1, 2024", author: "Edoardo Grigione", content: "First contact via LinkedIn. Warm connection, 15 mutual contacts. Quick response." }
  ];

  const getMockDocuments = () => [
    { name: "Pitch Deck ABC Company.pdf", sent: "Dec 1, 2024", size: "2.3 MB", type: "sent" },
    { name: "NDA - Signed.pdf", received: "Dec 5, 2024", size: "450 KB", type: "received" },
    { name: "Financial Model ABC Company.xlsx", sent: "Dec 8, 2024", size: "1.8 MB", type: "sent" }
  ];

  const getMockFollowUps = () => [
    { date: "Dec 10, 2024", time: "10:00 AM", type: "In-Person Meeting", status: "Confirmed", reminder: "1 day before" },
    { date: "Dec 3, 2024", type: "Follow-up email", status: "Completed", outcome: "Positive response, meeting scheduled" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ABC COMPANY FUNDRAISING CONSOLE</h1>
              <p className="text-sm text-muted-foreground">Target: €10,000,000 | Deadline: March 31, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">User: Edoardo Grigione</span>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">CONTACTS</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{kpis.contacts.current}/{kpis.contacts.target}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.contacts.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">MEETINGS</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{kpis.meetings.current}/{kpis.meetings.target}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.meetings.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">PIPELINE</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.pipeline.current)}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.pipeline.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">CLOSED</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.closed.current)}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.closed.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Timeline Progress */}
            <Card>
              <CardHeader>
                <CardTitle>OVERALL PROGRESS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dec 2024</span>
                    <span className="text-primary font-bold">35%</span>
                    <span className="text-muted-foreground">Mar 2026</span>
                  </div>
                  <Progress value={35} className="h-3" />
                </div>
                <p className="text-sm text-foreground">Current Phase: <span className="font-semibold text-primary">Initial Meetings (Phase 2)</span></p>
              </CardContent>
            </Card>

            {/* Two Column Layout: Recent Activity & Upcoming Follow-ups */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    RECENT ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="border-b border-border pb-3 last:border-0">
                        <p className="font-semibold text-foreground text-sm">{activity.investor}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    UPCOMING FOLLOW-UPS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingFollowUps.map((followUp, idx) => (
                      <div key={idx} className={`border-b border-border pb-3 last:border-0 ${followUp.overdue ? 'bg-red-500/5 -mx-6 px-6 py-3' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-xs font-semibold ${followUp.overdue ? 'text-red-600' : 'text-primary'}`}>
                              {followUp.overdue ? '⚠️ OVERDUE' : followUp.date.toUpperCase()}
                            </p>
                            <p className="text-sm text-foreground font-semibold">{followUp.investor}</p>
                            <p className="text-sm text-muted-foreground">{followUp.action}</p>
                          </div>
                          {followUp.time && <span className="text-xs text-muted-foreground">{followUp.time}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>CONVERSION FUNNEL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((stage, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.count} {stage.stage}</span>
                        <span className="text-primary font-semibold">{stage.percentage}%</span>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INVESTORS TAB */}
          <TabsContent value="investors" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search investors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investor Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investorsData.filter(inv => 
                inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.company.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((investor) => {
                const status = getStatusBadge(investor.status);
                return (
                  <motion.div
                    key={investor.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedInvestor(investor)}
                  >
                    <Card className={`cursor-pointer hover:shadow-lg transition-all ${getPriorityColor(investor.priority)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge className={status.color}>{status.label}</Badge>
                          {investor.priority === "high" && (
                            <Badge variant="destructive" className="bg-primary">🔥 HIGH PRIORITY</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{investor.name}</h3>
                          <p className="text-sm text-muted-foreground">{investor.company}</p>
                          <p className="text-xs text-muted-foreground">{investor.role}</p>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{investor.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="h-3 w-3" />
                            <span>{investor.category}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border space-y-1">
                          <p className="text-xs text-muted-foreground">Last Contact: {investor.lastContact}</p>
                          <p className="text-xs text-muted-foreground">Next Follow-up: {investor.nextFollowUp}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-semibold text-foreground">{formatCurrency(investor.pipelineValue)}</span>
                            <span className="text-sm text-primary font-semibold">{investor.probability}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${investor.email}`;
                            }}
                          >
                            <Mail className="h-3 w-3" />
                            Email
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${investor.phone}`;
                            }}
                          >
                            <Phone className="h-3 w-3" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC COMPANY FUNDRAISING TIMELINE</CardTitle>
                <p className="text-sm text-muted-foreground">December 2024 → March 2026</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Phase Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-2 border-green-500/20 bg-green-500/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 1: Outreach</CardTitle>
                          <Badge className="bg-green-500 text-white">✅ DONE</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Dec 2024 - Jan 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: Contact 57 high-priority investors</p>
                        <Progress value={100} className="h-2" />
                        <p className="text-sm font-semibold text-green-600">57/57 contacts reached (100%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: January 31, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 2: Initial Meetings</CardTitle>
                          <Badge className="bg-primary">⏳ IN PROGRESS</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Jan 2025 - Mar 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: Schedule 20 meetings with interested investors</p>
                        <Progress value={60} className="h-2" />
                        <p className="text-sm font-semibold text-primary">12/20 meetings scheduled (60%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: March 31, 2025 (120 days remaining)</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 3: Due Diligence</CardTitle>
                          <Badge variant="outline">UPCOMING</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Apr 2025 - Jun 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: 10 interested investors in DD process</p>
                        <Progress value={50} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">5/10 in progress (50%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: June 30, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 4: Negotiation</CardTitle>
                          <Badge variant="outline">UPCOMING</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Jul 2025 - Sep 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: 5 active negotiations</p>
                        <Progress value={40} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">2/5 in negotiation (40%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: September 30, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 5: First Closing</CardTitle>
                          <Badge variant="outline">TARGET</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Oct 2025 - Mar 2026</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: €3-5M first closing</p>
                        <Progress value={30} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">€1.5M / €5M (30%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: March 31, 2026</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 6: Second Closing</CardTitle>
                          <Badge variant="outline">TARGET</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Apr 2026 - Jun 2026</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: €5-7M (total €10M)</p>
                        <Progress value={0} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">€0 / €7M (0%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: June 30, 2026</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Alerts */}
                  <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-5 w-5" />
                        ATTENTION REQUIRED
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-foreground">• 8 meetings still needed to reach Phase 2 target</p>
                      <p className="text-sm text-foreground">• 5 investors not responding (follow-up needed)</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>BIWEEKLY REPORT</CardTitle>
                <p className="text-sm text-muted-foreground">Period: November 15 - November 30, 2024</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Report Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="text-foreground">Every 2 weeks (Monday)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipients:</span>
                        <span className="text-foreground">edoardo.grigione@aries76.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="text-foreground">PDF + Dashboard Link</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Report:</span>
                        <span className="text-primary font-semibold">December 16, 2024</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Report Now
                      </Button>
                      <Button variant="outline">Edit Settings</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Key Achievements</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>12 new meetings scheduled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>3 investors moved to negotiation phase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>€500,000 commitment from Family Office Italia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>8 pitch presentations completed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                  <div className="border-t border-border pt-6">
                  <h4 className="font-semibold text-foreground mb-4">Top 5 Investors by Pipeline Value</h4>
                  <div className="space-y-3">
                    {investorsData
                      .sort((a, b) => b.pipelineValue - a.pipelineValue)
                      .slice(0, 5)
                      .map((investor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{idx + 1}. {investor.name}</p>
                            <p className="text-xs text-muted-foreground">{investor.company} - Probability: {investor.probability}%</p>
                          </div>
                          <p className="text-sm font-bold text-primary">{formatCurrency(investor.pipelineValue)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Dashboard Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    USER PROFILE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <Input value="Edoardo Grigione" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input value="edoardo.grigione@aries76.com" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <Input value="Aries76 Ltd" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <Input value="Managing Director" disabled />
                  </div>
                  <Button className="w-full">Change Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>NOTIFICATION PREFERENCES</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
                    <div className="space-y-2">
                      {[
                        "Daily summary (8:00 AM)",
                        "Follow-up reminders (1 day before)",
                        "Milestone alerts",
                        "Overdue tasks",
                        "Biweekly report"
                      ].map((notif, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{notif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground">In-App Notifications</h4>
                    <div className="space-y-2">
                      {[
                        "New investor interactions",
                        "Status changes",
                        "Document uploads",
                        "Meeting reminders"
                      ].map((notif, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{notif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>SYSTEM CONFIGURATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Fundraising Target</label>
                    <Input value="€10,000,000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                    <Input value="March 31, 2026" />
                  </div>
                </div>
                <Button>Update Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Investor Detail Modal */}
      <Dialog open={!!selectedInvestor} onOpenChange={() => setSelectedInvestor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-foreground">{selectedInvestor?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedInvestor?.company}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={modalTab} onValueChange={setModalTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">BASIC INFORMATION</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant="destructive" className="bg-primary">HIGH</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Email:</span>
                      <a href={`mailto:${selectedInvestor?.email}`} className="text-primary hover:underline">{selectedInvestor?.email}</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <a href={`tel:${selectedInvestor?.phone}`} className="text-primary hover:underline">{selectedInvestor?.phone}</a>
                    </div>
                    {selectedInvestor?.linkedin && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">LinkedIn:</span>
                        <a href={selectedInvestor.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          View Profile <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">RELATIONSHIP STATUS</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Status:</span>
                      <Badge className={getStatusBadge(selectedInvestor?.status || "").color}>
                        {getStatusBadge(selectedInvestor?.status || "").label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pipeline Value:</span>
                      <span className="text-foreground font-bold">{formatCurrency(selectedInvestor?.pipelineValue || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Probability:</span>
                      <span className="text-primary font-bold">{selectedInvestor?.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Close:</span>
                      <span className="text-foreground font-medium">February 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Relationship Owner:</span>
                      <span className="text-foreground font-medium">Edoardo Grigione</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Contact:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.lastContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Contact:</span>
                      <span className="text-foreground font-medium">{selectedInvestor?.lastContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interactions:</span>
                      <span className="text-foreground font-medium">3</span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="to-contact">To Contact</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="meeting">Meeting Scheduled</SelectItem>
                        <SelectItem value="negotiation">In Negotiation</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">Edit Pipeline</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ACTIVITY HISTORY TAB */}
            <TabsContent value="activity" className="space-y-4 mt-6">
              <h3 className="font-semibold text-foreground">CONTACT HISTORY</h3>
              {getMockActivityHistory().map((activity, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{activity.type}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        {activity.status && (
                          <Badge variant="outline">{activity.status}</Badge>
                        )}
                      </div>
                      {activity.location && (
                        <p className="text-sm text-muted-foreground">📍 Location: {activity.location}</p>
                      )}
                      {activity.details && (
                        <p className="text-sm text-foreground">{activity.details}</p>
                      )}
                      {activity.content && (
                        <p className="text-sm text-foreground italic">"{activity.content}"</p>
                      )}
                      {activity.attachments && (
                        <p className="text-sm text-muted-foreground">📎 {activity.attachments}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add New Interaction
              </Button>
            </TabsContent>

            {/* NOTES TAB */}
            <TabsContent value="notes" className="space-y-4 mt-6">
              <h3 className="font-semibold text-foreground">PRIVATE NOTES</h3>
              {getMockNotes().map((note, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{note.date} | {note.author}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <Label htmlFor="new-note">Add New Note</Label>
                  <Textarea
                    id="new-note"
                    placeholder="Enter your private note here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                    className="bg-background"
                  />
                  <Button onClick={handleAddNote} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Note
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DOCUMENTS TAB */}
            <TabsContent value="documents" className="space-y-4 mt-6">
              <h3 className="font-semibold text-foreground">DOCUMENTS</h3>
              {getMockDocuments().map((doc, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Paperclip className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type === "sent" ? `Sent: ${doc.sent}` : `Received: ${doc.received}`} • Size: {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.type === "sent" && (
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </TabsContent>

            {/* FOLLOW-UPS TAB */}
            <TabsContent value="followups" className="space-y-4 mt-6">
              <h3 className="font-semibold text-foreground">SCHEDULED FOLLOW-UPS</h3>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">🔔 UPCOMING</h4>
                {getMockFollowUps().filter(f => f.status !== "Completed").map((followUp, idx) => (
                  <Card key={idx} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{followUp.type}</p>
                          <p className="text-sm text-muted-foreground">{followUp.date} {followUp.time && `at ${followUp.time}`}</p>
                          {followUp.reminder && (
                            <p className="text-xs text-muted-foreground mt-1">Reminder: {followUp.reminder}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">{followUp.status}</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button size="sm">Mark as Done</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">✅ COMPLETED</h4>
                {getMockFollowUps().filter(f => f.status === "Completed").map((followUp, idx) => (
                  <Card key={idx} className="opacity-60">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{followUp.type}</p>
                            <p className="text-sm text-muted-foreground">{followUp.date}</p>
                          </div>
                          <Badge variant="outline">{followUp.status}</Badge>
                        </div>
                        {followUp.outcome && (
                          <p className="text-sm text-foreground">Outcome: {followUp.outcome}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Schedule New Follow-up</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="followup-date">Date *</Label>
                      <Input
                        id="followup-date"
                        type="date"
                        value={newFollowUp.date}
                        onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followup-time">Time</Label>
                      <Input
                        id="followup-time"
                        type="time"
                        value={newFollowUp.time}
                        onChange={(e) => setNewFollowUp({ ...newFollowUp, time: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followup-type">Type *</Label>
                    <Select value={newFollowUp.type} onValueChange={(value) => setNewFollowUp({ ...newFollowUp, type: value })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">In-Person Meeting</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followup-description">Description *</Label>
                    <Textarea
                      id="followup-description"
                      placeholder="What needs to be discussed or done?"
                      value={newFollowUp.description}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, description: e.target.value })}
                      rows={3}
                      className="bg-background"
                    />
                  </div>
                  <Button onClick={handleScheduleFollowUp} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ABCCompanyConsole;
