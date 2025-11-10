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
  {
    firstName: "GIUSEPPE SERGIO",
    lastName: "ABBOTTO",
    fullName: "ABBOTTO GIUSEPPE SERGIO",
    birthDate: "5/22/62",
    age: 60,
    city: "MILANO",
    province: "MILANO",
    intermediary: "COPERNICO SIM SPA",
    phone: "3357536329",
    email: "abbotto.g@copernicosim.com",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "SILVIA",
    lastName: "ACCORDI",
    fullName: "ACCORDI SILVIA",
    birthDate: "10/17/67",
    age: 54,
    city: "MANTOVA",
    province: "MANTOVA",
    intermediary: "CHEBANCA! SPA",
    phone: "3483043045",
    email: "silvia.accordi@chebanca.it",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "GIANLUCA",
    lastName: "ACCORRA'",
    fullName: "ACCORRA' GIANLUCA",
    birthDate: "2/29/60",
    age: 62,
    city: "MILANO",
    province: "MILANO",
    intermediary: "VALORI & FINANZA INVESTIMENTI SIM S.P.A.",
    phone: "3356708502",
    email: "gianluca.accorra@valoriefinanza.eu",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "PAOLO",
    lastName: "ACQUATI",
    fullName: "ACQUATI PAOLO",
    birthDate: "1/21/65",
    age: 57,
    city: "PADENGHE SUL GARDA",
    province: "BRESCIA",
    intermediary: "ALTO ADIGE BANCA SPA",
    phone: "3489011875",
    email: "pa.acquati@gmail.com",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "LUCA ALBERTO",
    lastName: "ADAMI",
    fullName: "ADAMI LUCA ALBERTO",
    birthDate: "3/22/88",
    age: 34,
    city: "ALBANO SANT'ALESSANDRO",
    province: "BERGAMO",
    intermediary: "BANCA MEDIOLANUM SPA",
    phone: "3478717405",
    email: "lucaalberto.adami@bancamediolanum.it",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "MASSIMO",
    lastName: "ADDONE",
    fullName: "ADDONE MASSIMO",
    birthDate: "2/17/75",
    age: 47,
    city: "MONZA",
    province: "MONZA E BRIANZA",
    intermediary: "ALLIANZ BANK FINANCIAL ADVISORS SPA",
    phone: "3355840995",
    email: "massimo.addone@allianzbankfa.it",
    role: "",
    region: "LOMBARDIA",
    portfolio: ""
  },
  {
    firstName: "RICCARDO",
    lastName: "ALBARELLO",
    fullName: "ALBARELLO RICCARDO",
    birthDate: "10/20/82",
    age: 39,
    city: "MILANO",
    province: "MILANO",
    intermediary: "MEDIOBANCA-BANCA DI CREDITO FINANZIARIO S.P.A.",
    phone: "3913487893",
    email: "RICCARDO.ALBARELLO@GMAIL.COM",
    role: "PRIVATE BANKER",
    region: "LOMBARDIA",
    portfolio: "> 80.000.000"
  },
  {
    firstName: "ALESSIA",
    lastName: "ALESSI",
    fullName: "ALESSI ALESSIA",
    birthDate: "5/14/90",
    age: 32,
    city: "MONZA",
    province: "MONZA E BRIANZA",
    intermediary: "CHEBANCA! SPA",
    phone: "3892477522",
    email: "alessi_alessia@hotmail.it",
    role: "ADVISOR",
    region: "LOMBARDIA",
    portfolio: "TRA 25.000.000 E 40.000.000"
  }
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
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Financial Advisers Portal</h1>
          <p className="text-muted-foreground">Access our network of financial advisers and investment professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="advisers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="advisers" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Financial Advisers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisers" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search advisers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background text-foreground border-input"
                      />
                    </div>
                  </div>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[200px] bg-background text-foreground border-input">
                      <SelectValue placeholder="Filter by Region" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">All Regions</SelectItem>
                      {uniqueRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={intermediaryFilter} onValueChange={setIntermediaryFilter}>
                    <SelectTrigger className="w-[250px] bg-background text-foreground border-input">
                      <SelectValue placeholder="Filter by Intermediary" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">All Intermediaries</SelectItem>
                      {uniqueIntermediaries.map(intermediary => (
                        <SelectItem key={intermediary} value={intermediary}>{intermediary}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAdvisers.length} of {financialAdvisers.length} advisers
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Intermediary</TableHead>
                        <TableHead className="text-muted-foreground">Location</TableHead>
                        <TableHead className="text-muted-foreground">Role</TableHead>
                        <TableHead className="text-muted-foreground">Portfolio</TableHead>
                        <TableHead className="text-muted-foreground">Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdvisers.map((adviser, index) => (
                        <TableRow key={index} className="border-border hover:bg-muted/50">
                          <TableCell className="text-foreground">
                            <div>
                              <div className="font-medium">{adviser.fullName}</div>
                              <div className="text-sm text-muted-foreground">Age: {adviser.age}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            <div className="text-sm">{adviser.intermediary}</div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            <div>
                              <div className="font-medium">{adviser.city}</div>
                              <div className="text-sm text-muted-foreground">{adviser.province}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {adviser.role && (
                              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                {adviser.role}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-foreground">
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
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Distribution by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueRegions.map(region => {
                      const count = financialAdvisers.filter(a => a.region === region).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={region} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">{region}</span>
                            <span className="text-muted-foreground">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Top Intermediaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueIntermediaries.slice(0, 5).map(intermediary => {
                      const count = financialAdvisers.filter(a => a.intermediary === intermediary).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={intermediary} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground truncate flex-1">{intermediary}</span>
                            <span className="text-muted-foreground ml-2">{count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
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
