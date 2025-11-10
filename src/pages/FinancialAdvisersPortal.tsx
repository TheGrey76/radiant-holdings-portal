import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, FileText, Search, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialAdviser {
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  age: number;
  city: string;
  province: string;
  intermediary: string;
  phone: string;
  email: string;
  role: string;
  region: string;
  portfolio: string;
}

const financialAdvisers: FinancialAdviser[] = [
  { firstName: "GIUSEPPE SERGIO", lastName: "ABBOTTO", fullName: "ABBOTTO GIUSEPPE SERGIO", birthDate: "5/22/62", age: 60, city: "MILANO", province: "MILANO", intermediary: "COPERNICO SIM SPA", phone: "3357536329", email: "abbotto.g@copernicosim.com", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "SILVIA", lastName: "ACCORDI", fullName: "ACCORDI SILVIA", birthDate: "10/17/67", age: 54, city: "MANTOVA", province: "MANTOVA", intermediary: "CHEBANCA! SPA", phone: "3483043045", email: "silvia.accordi@chebanca.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "GIANLUCA", lastName: "ACCORRA'", fullName: "ACCORRA' GIANLUCA", birthDate: "2/29/60", age: 62, city: "MILANO", province: "MILANO", intermediary: "VALORI & FINANZA INVESTIMENTI SIM S.P.A.", phone: "3356708502", email: "gianluca.accorra@valoriefinanza.eu", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "PAOLO", lastName: "ACQUATI", fullName: "ACQUATI PAOLO", birthDate: "1/21/65", age: 57, city: "PADENGHE SUL GARDA", province: "BRESCIA", intermediary: "ALTO ADIGE BANCA SPA", phone: "3489011875", email: "pa.acquati@gmail.com", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LUCA ALBERTO", lastName: "ADAMI", fullName: "ADAMI LUCA ALBERTO", birthDate: "3/22/88", age: 34, city: "ALBANO SANT'ALESSANDRO", province: "BERGAMO", intermediary: "BANCA MEDIOLANUM SPA", phone: "3478717405", email: "lucaalberto.adami@bancamediolanum.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "MASSIMO", lastName: "ADDONE", fullName: "ADDONE MASSIMO", birthDate: "2/17/75", age: 47, city: "MONZA", province: "MONZA E BRIANZA", intermediary: "ALLIANZ BANK FINANCIAL ADVISORS SPA", phone: "3355840995", email: "massimo.addone@allianzbankfa.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LUCA", lastName: "AFFABA", fullName: "AFFABA LUCA", birthDate: "9/14/64", age: 57, city: "LODI VECCHIO", province: "LODI", intermediary: "FIDEURAM SPA", phone: "3355645591", email: "laffaba@fideuram.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "MARCO", lastName: "AGAZZI", fullName: "AGAZZI MARCO", birthDate: "9/25/92", age: 29, city: "PONTE SAN PIETRO", province: "BERGAMO", intermediary: "IW BANK SPA", phone: "3442804240", email: "marco.agazzi@iwbank.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "CLAUDIO", lastName: "AGAZZI", fullName: "AGAZZI CLAUDIO", birthDate: "11/3/60", age: 61, city: "PONTE SAN PIETRO", province: "BERGAMO", intermediary: "IW BANK SPA", phone: "3473848103", email: "claudio.agazzi@iwbank.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "ALESSANDRO", lastName: "AGOSTA", fullName: "AGOSTA ALESSANDRO", birthDate: "2/18/73", age: 49, city: "MANTOVA", province: "MANTOVA", intermediary: "N/A", phone: "338 9173278", email: "agosta.adp@gmail.com", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "FABRIZIO LUIGI", lastName: "AGOSTONI", fullName: "AGOSTONI FABRIZIO LUIGI", birthDate: "3/17/67", age: 55, city: "SANTA MARIA HOE'", province: "LECCO", intermediary: "FIDEURAM SPA", phone: "", email: "fagostoni@fideuram.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "MATTEO", lastName: "AIELLI", fullName: "AIELLI MATTEO", birthDate: "5/8/88", age: 34, city: "MILANO", province: "MILANO", intermediary: "BANCA GENERALI SPA", phone: "", email: "matteo.aielli@bancagenerali.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "CRESCENZO", lastName: "AIELLO", fullName: "AIELLO CRESCENZO", birthDate: "6/13/60", age: 61, city: "ROZZANO", province: "MILANO", intermediary: "BANCA GENERALI SPA", phone: "3356548233", email: "crescenzo.aiello@bancagenerali.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "CRISTINA", lastName: "ALAIA", fullName: "ALAIA CRISTINA", birthDate: "2/21/66", age: 56, city: "MANTOVA", province: "MANTOVA", intermediary: "CHEBANCA! SPA", phone: "", email: "CRISTINA.ALAIA@CHEBANCA.IT", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "FRANCESCO", lastName: "ALBANESE", fullName: "ALBANESE FRANCESCO", birthDate: "1/1/75", age: 47, city: "BERGAMO", province: "BERGAMO", intermediary: "ALTO ADIGE BANCA SPA", phone: "", email: "info@albanesefranz.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "RICCARDO", lastName: "ALBARELLO", fullName: "ALBARELLO RICCARDO", birthDate: "10/20/82", age: 39, city: "MILANO", province: "MILANO", intermediary: "MEDIOBANCA S.P.A.", phone: "3913487893", email: "RICCARDO.ALBARELLO@GMAIL.COM", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "> 80.000.000" },
  { firstName: "ELISABETTA", lastName: "ALBORGHETTI", fullName: "ALBORGHETTI ELISABETTA", birthDate: "11/29/68", age: 53, city: "BARZANA", province: "BERGAMO", intermediary: "FINECOBANK SPA", phone: "3358302954", email: "elisabetta.alborghetti@pfafineco.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "CRISTIAN", lastName: "ALBORGHETTI", fullName: "ALBORGHETTI CRISTIAN", birthDate: "9/8/71", age: 50, city: "PRADALUNGA", province: "BERGAMO", intermediary: "FIDEURAM SPA", phone: "3495044817", email: "calborghetti@fideuram.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LUIGI", lastName: "ALDIERI", fullName: "ALDIERI LUIGI", birthDate: "3/10/66", age: 56, city: "GALLARATE", province: "VARESE", intermediary: "FINECOBANK SPA", phone: "3356310693", email: "luigi.aldieri@pfafineco.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "ALESSIA", lastName: "ALESSI", fullName: "ALESSI ALESSIA", birthDate: "5/14/90", age: 32, city: "MONZA", province: "MONZA E BRIANZA", intermediary: "CHEBANCA! SPA", phone: "3892477522", email: "alessi_alessia@hotmail.it", role: "ADVISOR", region: "LOMBARDIA", portfolio: "TRA 25.000.000 E 40.000.000" },
  { firstName: "MICHELE", lastName: "ALETTI", fullName: "ALETTI MICHELE", birthDate: "10/23/68", age: 53, city: "CREMONA", province: "CREMONA", intermediary: "ALLIANZ BANK FINANCIAL ADVISORS SPA", phone: "", email: "michele.aletti@allianzbankfa.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "DANIELE", lastName: "ALGHISI", fullName: "ALGHISI DANIELE", birthDate: "1/18/62", age: 60, city: "ZELO BUON PERSICO", province: "LODI", intermediary: "IW BANK SPA", phone: "337569961", email: "daniele.alghisi@iwbank.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LUIGI GIOVANNI", lastName: "ALGISI", fullName: "ALGISI LUIGI GIOVANNI", birthDate: "12/28/72", age: 49, city: "ALBINO", province: "BERGAMO", intermediary: "N/A", phone: "", email: "luigigiovanni.algisi@bpb.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "PATRIZIA", lastName: "ALLAS", fullName: "ALLAS PATRIZIA", birthDate: "12/20/70", age: 51, city: "VARESE", province: "VARESE", intermediary: "FIDEURAM SPA", phone: "3487372629", email: "pallas@fideuram.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "MARCO GIUSEPPE", lastName: "ALLEVI", fullName: "ALLEVI MARCO GIUSEPPE", birthDate: "1/14/66", age: 56, city: "TREVIGLIO", province: "BERGAMO", intermediary: "INTESA SANPAOLO PRIVATE BANKING SPA", phone: "3481403249", email: "marco.allevi@intesasanpaoloprivate.com", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "ROBERTO", lastName: "ALTINA", fullName: "ALTINA ROBERTO", birthDate: "5/14/69", age: 53, city: "DESENZANO DEL GARDA", province: "BRESCIA", intermediary: "ALLIANZ BANK FINANCIAL ADVISORS SPA", phone: "", email: "roberto.altina@allianzbankfa.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "ENRICO", lastName: "ALZANI", fullName: "ALZANI ENRICO", birthDate: "3/29/70", age: 52, city: "ROVATO", province: "BRESCIA", intermediary: "IW BANK SPA", phone: "3337861670", email: "enrico.alzani@iwbank.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LUCA", lastName: "AMADEO", fullName: "AMADEO LUCA", birthDate: "1/6/78", age: 44, city: "CISLIANO", province: "MILANO", intermediary: "BANCA MEDIOLANUM SPA", phone: "3487635514", email: "luca_amadeo@libero.it", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "GIAN BATTISTA", lastName: "AMBROGI", fullName: "AMBROGI GIAN BATTISTA", birthDate: "4/25/56", age: 66, city: "DESENZANO DEL GARDA", province: "BRESCIA", intermediary: "FINECOBANK SPA", phone: "3485823641", email: "gianbattista.ambrogi@pfafineco.it", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "RICCARDO", lastName: "AMBROSETTI", fullName: "AMBROSETTI RICCARDO", birthDate: "12/10/63", age: 58, city: "FINO MORNASCO", province: "COMO", intermediary: "N/A", phone: "031/3383999", email: "rambrosetti@ambrosettiam.com", role: "", region: "LOMBARDIA", portfolio: "" },
  { firstName: "LORENZO", lastName: "AZZARA", fullName: "AZZARA LORENZO", birthDate: "9/9/61", age: 60, city: "SAN DONATO MILANESE", province: "MILANO", intermediary: "FINECOBANK SPA", phone: "3428949887", email: "lorenzo.azzara1961@gmail.com", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "TRA 40.000.000 E 80.000.000" },
  { firstName: "CORRADO", lastName: "BALLABIO", fullName: "BALLABIO CORRADO", birthDate: "8/17/66", age: 55, city: "COMO", province: "COMO", intermediary: "FINECOBANK SPA", phone: "3487415162", email: "crdbll@gmail.com", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "TRA 40.000.000 E 80.000.000" },
  { firstName: "THOMAS CHRISTIAN", lastName: "CORDARO", fullName: "CORDARO THOMAS CHRISTIAN", birthDate: "12/27/84", age: 37, city: "BAREGGIO", province: "MILANO", intermediary: "BANCA GENERALI SPA", phone: "3383549698", email: "info@thomascordaro.it", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "TRA 25.000.000 E 40.000.000" },
  { firstName: "NICOLA", lastName: "CURRO'", fullName: "CURRO' NICOLA", birthDate: "10/23/70", age: 51, city: "TRADATE", province: "VARESE", intermediary: "BANCA POPOLARE DI SONDRIO", phone: "3288724004", email: "mcwucc@libero.it", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "> 80.000.000" },
  { firstName: "MATTEO", lastName: "DAOLIO", fullName: "DAOLIO MATTEO", birthDate: "2/23/79", age: 43, city: "BASIGLIO", province: "MILANO", intermediary: "BANCA GENERALI SPA", phone: "3394120777", email: "oil1979@libero.it", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "TRA 40.000.000 E 80.000.000" },
  { firstName: "CLAUDIA", lastName: "DE MEO", fullName: "DE MEO CLAUDIA", birthDate: "4/11/81", age: 41, city: "ROBBIATE", province: "LECCO", intermediary: "CREDIT AGRICOLE ITALIA SPA", phone: "3488076483", email: "clatarci@gmail.com", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "GIOVANNI", lastName: "MANZI", fullName: "MANZI GIOVANNI", birthDate: "10/16/81", age: 40, city: "CORMANO", province: "MILANO", intermediary: "CASSA LOMBARDA SPA", phone: "3298710501", email: "giomanzi1981@gmail.com", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "TRA 25.000.000 E 40.000.000" },
  { firstName: "CARLO ALESSANDRO", lastName: "MANZONE", fullName: "MANZONE CARLO ALESSANDRO", birthDate: "8/18/75", age: 46, city: "GARGNANO", province: "BRESCIA", intermediary: "BANCA GENERALI SPA", phone: "3489688599", email: "carlo.alessandro.manzone@gmail.com", role: "DEPUTY AREA MANAGER", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "PAOLO", lastName: "MANZOTTI", fullName: "MANZOTTI PAOLO", birthDate: "4/5/64", age: 58, city: "MILANO", province: "MILANO", intermediary: "BANCA WIDIBA", phone: "3351347324", email: "paolo.manzotti@pfwidiba.it", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "TRA 25.000.000 E 40.000.000" },
  { firstName: "MICHELE", lastName: "MAPELLI", fullName: "MAPELLI MICHELE", birthDate: "9/20/88", age: 33, city: "MERATE", province: "LECCO", intermediary: "BANCA POPOLARE DI SONDRIO", phone: "340807114", email: "michele.mapelli@outlook.it", role: "VICE DIRETTORE DI AGENZIA", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "MARCO", lastName: "MARCHIORETTO", fullName: "MARCHIORETTO MARCO", birthDate: "1/3/71", age: 51, city: "SESTO SAN GIOVANNI", province: "MILANO", intermediary: "CREDITO EMILIANO SPA", phone: "345 9591079", email: "mmarchioretto@pfcredem.it", role: "PRIVATE BANKER", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "FRANCESCA", lastName: "MARTA", fullName: "MARTA FRANCESCA", birthDate: "11/11/80", age: 41, city: "FARA GERA D'ADDA", province: "BERGAMO", intermediary: "N/A", phone: "3478558145", email: "francesca.marta.gid3@alice.it", role: "CONSULENTE PRIVATE", region: "LOMBARDIA", portfolio: "TRA 25.000.000 E 40.000.000" },
  { firstName: "ELENA", lastName: "MATTEI", fullName: "MATTEI ELENA", birthDate: "9/20/87", age: 34, city: "OPERA", province: "MILANO", intermediary: "CREDIT AGRICOLE ITALIA SPA", phone: "3470052427", email: "elenamattei87@gmail.com", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "TRA 10.000.000 E 25.000.000" },
  { firstName: "GIUSEPPE", lastName: "MAZZONI", fullName: "MAZZONI GIUSEPPE", birthDate: "4/3/64", age: 58, city: "MILANO", province: "MILANO", intermediary: "DEUTSCHE BANK SPA", phone: "3474364343", email: "g_mazzoni@yahoo.com", role: "CONSULENTE FINANZIARIO", region: "LOMBARDIA", portfolio: "< 10.000.000" },
  { firstName: "GIORGIO", lastName: "MERCURI", fullName: "MERCURI GIORGIO", birthDate: "6/24/72", age: 49, city: "CESANO MADERNO", province: "MONZA E BRIANZA", intermediary: "UBS EUROPE SE", phone: "3381242773", email: "mercurigiorgio@gmail.com", role: "Consulente Finanziario desk clienti istituzionali", region: "LOMBARDIA", portfolio: "< 10.000.000" }
];

export default function FinancialAdvisersPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [intermediaryFilter, setIntermediaryFilter] = useState("all");

  const filteredAdvisers = financialAdvisers.filter(adviser => {
    const matchesSearch = 
      adviser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.intermediary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === "all" || adviser.region === regionFilter;
    const matchesIntermediary = intermediaryFilter === "all" || adviser.intermediary === intermediaryFilter;
    
    return matchesSearch && matchesRegion && matchesIntermediary;
  });

  const uniqueRegions = Array.from(new Set(financialAdvisers.map(a => a.region))).filter(Boolean);
  const uniqueIntermediaries = Array.from(new Set(financialAdvisers.map(a => a.intermediary))).filter(Boolean);

  const statsCards = [
    {
      title: "Total Advisers",
      value: financialAdvisers.length.toString(),
      icon: Building2,
      description: "Financial advisers in database"
    },
    {
      title: "Regions",
      value: uniqueRegions.length.toString(),
      icon: MapPin,
      description: "Geographic coverage"
    },
    {
      title: "Intermediaries",
      value: uniqueIntermediaries.length.toString(),
      icon: TrendingUp,
      description: "Partner institutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24 pt-32 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-2">Financial Advisers Portal</h1>
          <p className="text-white/60 text-lg">Access our network of financial advisers and investment professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <p className="text-xs text-white/60 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="advisers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="advisers" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
              Financial Advisers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisers" className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        placeholder="Search advisers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 text-white border-white/10 placeholder:text-white/40"
                      />
                    </div>
                  </div>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[200px] bg-white/5 text-white border-white/10">
                      <SelectValue placeholder="Filter by Region" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/10">
                      <SelectItem value="all">All Regions</SelectItem>
                      {uniqueRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={intermediaryFilter} onValueChange={setIntermediaryFilter}>
                    <SelectTrigger className="w-[250px] bg-white/5 text-white border-white/10">
                      <SelectValue placeholder="Filter by Intermediary" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2744] border-white/10">
                      <SelectItem value="all">All Intermediaries</SelectItem>
                      {uniqueIntermediaries.map(intermediary => (
                        <SelectItem key={intermediary} value={intermediary}>{intermediary}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-white/60">
                  Showing {filteredAdvisers.length} of {financialAdvisers.length} advisers
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70">Name</TableHead>
                        <TableHead className="text-white/70">Intermediary</TableHead>
                        <TableHead className="text-white/70">Location</TableHead>
                        <TableHead className="text-white/70">Role</TableHead>
                        <TableHead className="text-white/70">Portfolio</TableHead>
                        <TableHead className="text-white/70">Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdvisers.map((adviser, index) => (
                        <TableRow key={index} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{adviser.fullName}</div>
                              <div className="text-sm text-white/60">Age: {adviser.age}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="text-sm">{adviser.intermediary}</div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{adviser.city}</div>
                              <div className="text-sm text-white/60">{adviser.province}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{adviser.role && (
                              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                                {adviser.role}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-white">
                            {adviser.portfolio && (
                              <div className="text-sm font-medium">{adviser.portfolio}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {adviser.email && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.location.href = `mailto:${adviser.email}`}
                                  className="hover:bg-accent hover:text-accent-foreground"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                              {adviser.phone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.location.href = `tel:${adviser.phone}`}
                                  className="hover:bg-accent hover:text-accent-foreground"
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Distribution by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueRegions.map(region => {
                      const count = financialAdvisers.filter(a => a.region === region).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={region} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{region}</span>
                            <span className="text-white/60">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Top Intermediaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueIntermediaries.slice(0, 5).map(intermediary => {
                      const count = financialAdvisers.filter(a => a.intermediary === intermediary).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={intermediary} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white truncate flex-1">{intermediary}</span>
                            <span className="text-white/60 ml-2">{count}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
