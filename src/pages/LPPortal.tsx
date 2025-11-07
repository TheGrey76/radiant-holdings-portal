import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Building2, TrendingUp, FileText, Search, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface LPRegistration {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  role: string | null;
  jurisdiction: string | null;
  investor_type: string | null;
  areas_of_interest: string[] | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TargetLP {
  name: string;
  hqCountry: string;
  hqCity: string;
  type: string;
  aum: string;
  ariesAngle: string;
  website: string;
  linkedinUrl: string;
  decisionMaker: string;
}

const targetLPs: TargetLP[] = [
  {
    name: "ATP (Danish Pension Fund)",
    hqCountry: "Denmark",
    hqCity: "Hillerød",
    type: "Public Pension Fund",
    aum: "€110B",
    ariesAngle: "Long-term institutional investor seeking diversified PE exposure across European and global strategies.",
    website: "https://www.atp.dk/en",
    linkedinUrl: "https://linkedin.com/company/atp-denmark",
    decisionMaker: "Bo Foged (CIO)"
  },
  {
    name: "APG (Dutch Pension Fund)",
    hqCountry: "Netherlands",
    hqCity: "Amsterdam",
    type: "Public Pension Fund",
    aum: "€600B",
    ariesAngle: "One of Europe's largest pension investors with significant private markets allocation and ESG focus.",
    website: "https://www.apg.nl/en",
    linkedinUrl: "https://linkedin.com/company/apg",
    decisionMaker: "Thimo Huisman (Head of Private Equity)"
  },
  {
    name: "PGGM",
    hqCountry: "Netherlands",
    hqCity: "Zeist",
    type: "Public Pension Fund",
    aum: "€280B",
    ariesAngle: "Healthcare and education sector pension fund with strong sustainable investment mandate.",
    website: "https://www.pggm.nl/en",
    linkedinUrl: "https://linkedin.com/company/pggm",
    decisionMaker: "Eloy Lindeijer (CIO)"
  },
  {
    name: "Allianz Global Investors",
    hqCountry: "Germany",
    hqCity: "Munich",
    type: "Insurance/Asset Manager",
    aum: "€650B",
    ariesAngle: "Major European institutional investor with growing alternatives allocation including PE and infrastructure.",
    website: "https://www.allianzgi.com",
    linkedinUrl: "https://linkedin.com/company/allianzgi",
    decisionMaker: "Deborah Zurkow (Global Head of Alts)"
  },
  {
    name: "Generali Investments",
    hqCountry: "Italy",
    hqCity: "Milan",
    type: "Insurance/Asset Manager",
    aum: "€580B",
    ariesAngle: "Leading Italian institutional investor expanding private markets exposure, particularly in Southern Europe.",
    website: "https://www.generali-investments.com",
    linkedinUrl: "https://linkedin.com/company/generali-investments",
    decisionMaker: "Michele Leoncelli (Head of Private Assets)"
  },
  {
    name: "Caisse de Dépôt et Placement du Québec (CDPQ)",
    hqCountry: "Canada",
    hqCity: "Montreal",
    type: "Public Pension Fund",
    aum: "CAD 420B",
    ariesAngle: "Sophisticated global institutional investor with strong private equity program and European office.",
    website: "https://www.cdpq.com/en",
    linkedinUrl: "https://linkedin.com/company/cdpq",
    decisionMaker: "Kim Thomassin (EVP, Private Equity)"
  },
  {
    name: "OMERS",
    hqCountry: "Canada",
    hqCity: "Toronto",
    type: "Public Pension Fund",
    aum: "CAD 130B",
    ariesAngle: "Active direct investor and fund LP with European presence and infrastructure/PE focus.",
    website: "https://www.omers.com",
    linkedinUrl: "https://linkedin.com/company/omers",
    decisionMaker: "Mark Redman (Head of Private Equity)"
  },
  {
    name: "Agnelli Family (Exor)",
    hqCountry: "Italy",
    hqCity: "Turin",
    type: "Family Office",
    aum: "€30B+",
    ariesAngle: "Prominent Italian entrepreneurial family with substantial PE co-investments and fund commitments.",
    website: "https://www.exor.com",
    linkedinUrl: "https://linkedin.com/company/exor",
    decisionMaker: "John Elkann (Chairman & CEO)"
  },
  {
    name: "Wendel",
    hqCountry: "France",
    hqCity: "Paris",
    type: "Listed Investment Firm",
    aum: "€8B",
    ariesAngle: "European listed investment group active in PE direct investments and third-party fund commitments.",
    website: "https://www.wendelgroup.com",
    linkedinUrl: "https://linkedin.com/company/wendel",
    decisionMaker: "André François-Poncet (CEO)"
  },
  {
    name: "Investor AB (Wallenberg)",
    hqCountry: "Sweden",
    hqCity: "Stockholm",
    type: "Family Office/Investment Company",
    aum: "€50B+",
    ariesAngle: "Swedish industrial family office with long-term investment horizon and PE fund allocation.",
    website: "https://www.investorab.com",
    linkedinUrl: "https://linkedin.com/company/investor",
    decisionMaker: "Johan Forssell (CEO)"
  },
  {
    name: "Norges Bank Investment Management (NBIM)",
    hqCountry: "Norway",
    hqCity: "Oslo",
    type: "Sovereign Wealth Fund",
    aum: "€1.4T",
    ariesAngle: "World's largest sovereign wealth fund expanding unlisted equity investments globally.",
    website: "https://www.nbim.no",
    linkedinUrl: "https://linkedin.com/company/norges-bank-investment-management",
    decisionMaker: "Nicolai Tangen (CEO)"
  },
  {
    name: "Fondazione Cariplo",
    hqCountry: "Italy",
    hqCity: "Milan",
    type: "Foundation",
    aum: "€8B",
    ariesAngle: "Leading Italian philanthropic foundation with diversified investment portfolio including PE.",
    website: "https://www.fondazionecariplo.it",
    linkedinUrl: "https://linkedin.com/company/fondazione-cariplo",
    decisionMaker: "Giovanni Fosti (President)"
  },
  {
    name: "Church Commissioners for England",
    hqCountry: "UK",
    hqCity: "London",
    type: "Endowment/Foundation",
    aum: "£10B",
    ariesAngle: "Historic UK endowment with sophisticated PE allocation and ESG-focused investment approach.",
    website: "https://www.churchofengland.org/about/leadership-and-governance/church-commissioners-england",
    linkedinUrl: "https://linkedin.com/company/church-commissioners",
    decisionMaker: "Gareth Mostyn (Chief Investment Officer)"
  },
  {
    name: "Wellcome Trust",
    hqCountry: "UK",
    hqCity: "London",
    type: "Foundation/Endowment",
    aum: "£38B",
    ariesAngle: "Major UK charitable foundation with substantial private markets program focused on healthcare and life sciences.",
    website: "https://wellcome.org",
    linkedinUrl: "https://linkedin.com/company/wellcome-trust",
    decisionMaker: "Nick Moakes (CIO)"
  },
  {
    name: "Haniel Family Office",
    hqCountry: "Germany",
    hqCity: "Duisburg",
    type: "Family Office",
    aum: "€6B",
    ariesAngle: "German industrial family with PE fund commitments and direct investment capability.",
    website: "https://www.haniel.com",
    linkedinUrl: "https://linkedin.com/company/haniel",
    decisionMaker: "Stephan Gemkow (CEO)"
  }
];

const LPPortal = () => {
  const [lpData, setLpData] = useState<LPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [displayedLPs, setDisplayedLPs] = useState<TargetLP[]>(targetLPs);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRemoveLP = (lpName: string) => {
    setDisplayedLPs(prev => prev.filter(lp => lp.name !== lpName));
    toast({
      title: "LP Removed",
      description: `${lpName} has been removed from your target list`,
    });
  };

  const filteredLPs = displayedLPs.filter(lp => {
    const matchesSearch = lp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lp.hqCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === "all" || lp.hqCountry === countryFilter;
    const matchesType = typeFilter === "all" || lp.type === typeFilter;
    
    return matchesSearch && matchesCountry && matchesType;
  });

  const uniqueCountries = Array.from(new Set(displayedLPs.map(lp => lp.hqCountry))).sort();
  const uniqueTypes = Array.from(new Set(displayedLPs.map(lp => lp.type))).sort();

  useEffect(() => {
    checkLPAccess();
  }, []);

  const checkLPAccess = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        navigate("/auth");
        return;
      }

      setUser(currentUser);

      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

      // If admin, allow access without LP registration
      if (userRole?.role === 'admin') {
        // Create a dummy LP data for admin display
        setLpData({
          id: 'admin',
          full_name: 'Admin User',
          email: currentUser.email || '',
          organization: 'Aries76',
          role: 'Administrator',
          jurisdiction: 'N/A',
          investor_type: 'Admin Access',
          areas_of_interest: ['Admin Access'],
          message: null,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      // Fetch LP data using email
      const { data: lpRegistrations, error } = await supabase
        .from('lp_registrations')
        .select('*')
        .eq('email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !lpRegistrations || lpRegistrations.length === 0) {
        console.error("Error fetching LP data:", error);
        toast({
          title: "Access Denied",
          description: "You are not registered as a Limited Partner",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLpData(lpRegistrations[0]);
    } catch (error) {
      console.error("Error checking LP access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!lpData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <Card className="p-8 max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
          <p className="text-white text-center">You are not registered as a Limited Partner</p>
          <Button onClick={() => navigate('/')} className="w-full mt-4">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />

      <div className="container mx-auto px-6 py-24 pt-32 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-white mb-2">
              Welcome, <span className="text-accent">{lpData.full_name.split(' ')[0]}</span>
            </h1>
            <p className="text-white/60 text-lg">{lpData.role || 'Investor'} @ {lpData.organization}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Organization</p>
                  <p className="text-2xl font-semibold text-white">{lpData.organization}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Investor Type</p>
                  <p className="text-2xl font-semibold text-white">{lpData.investor_type || 'N/A'}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Interests</p>
                  <p className="text-2xl font-semibold text-white">{lpData.areas_of_interest?.length || 0}</p>
                </div>
                <FileText className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="target-lps" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="target-lps" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Target LPs
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Resources
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Target LPs Tab */}
          <TabsContent value="target-lps" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Aries76 Target Limited Partners
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Strategic LP targets for Aries76's capital raising services
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      placeholder="Search by name, type, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Filter by country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {uniqueCountries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    {filteredLPs.length} LPs
                  </Badge>
                  <span className="text-white/40">
                    {uniqueCountries.length} Countries
                  </span>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70">LP Name</TableHead>
                        <TableHead className="text-white/70">HQ</TableHead>
                        <TableHead className="text-white/70">Decision Maker</TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">AUM</TableHead>
                        <TableHead className="text-white/70">Aries Angle</TableHead>
                        <TableHead className="text-white/70">Links</TableHead>
                        <TableHead className="text-white/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLPs.map((lp, idx) => (
                        <TableRow 
                          key={idx} 
                          className="border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-medium text-white">
                            {lp.name}
                          </TableCell>
                          <TableCell className="text-white/70">
                            <div className="text-sm">
                              <div>{lp.hqCity}</div>
                              <div className="text-white/50">{lp.hqCountry}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70 text-sm">
                            {lp.decisionMaker}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white/5 text-white/80 border-white/20">
                              {lp.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/70">
                            <div className="text-sm font-medium">
                              {lp.aum}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/60 text-sm max-w-md">
                            <div className="line-clamp-2" title={lp.ariesAngle}>
                              {lp.ariesAngle}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/60 hover:text-accent hover:bg-white/5"
                                onClick={() => window.open(lp.website, '_blank')}
                                title="Visit website"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/60 hover:text-accent hover:bg-white/5"
                                onClick={() => window.open(lp.linkedinUrl, '_blank')}
                                title="LinkedIn profile"
                              >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => handleRemoveLP(lp.name)}
                              title="Remove LP"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredLPs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">No LPs found matching your filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Resources & Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <Building2 className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      For Limited Partners
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Dedicated services and resources for Limited Partners
                    </p>
                    <Button onClick={() => navigate('/for-limited-partners')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <FileText className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Private Equity Funds
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Explore our private equity fund structures and opportunities
                    </p>
                    <Button onClick={() => navigate('/private-equity-funds')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <TrendingUp className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Market Intelligence
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Access proprietary market data and investment insights
                    </p>
                    <Button onClick={() => navigate('/aires-data')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <FileText className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      GP/LP Matching
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Connect with compatible General Partners
                    </p>
                    <Button onClick={() => navigate('/gp-lp-matching')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Portfolio Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Total Target LPs</p>
                    <p className="text-3xl font-semibold text-white">{displayedLPs.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Countries Covered</p>
                    <p className="text-3xl font-semibold text-white">{uniqueCountries.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Investor Types</p>
                    <p className="text-3xl font-semibold text-white">{uniqueTypes.length}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-medium mb-4">Geographic Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {uniqueCountries.map(country => {
                        const count = displayedLPs.filter(lp => lp.hqCountry === country).length;
                        if (count === 0) return null;
                        return (
                          <div key={country} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-white/60 text-xs mb-1">{country}</p>
                            <p className="text-2xl font-semibold text-white">{count}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-medium mb-4">Investor Type Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {uniqueTypes.map(type => {
                        const count = displayedLPs.filter(lp => lp.type === type).length;
                        if (count === 0) return null;
                        return (
                          <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-white/60 text-xs mb-1">{type}</p>
                            <p className="text-2xl font-semibold text-white">{count}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LPPortal;