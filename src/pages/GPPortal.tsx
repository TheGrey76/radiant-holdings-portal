import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Building2, TrendingUp, FileText, Search, Filter, ExternalLink, Trash2 } from "lucide-react";
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

interface GPRegistration {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  role: string;
  firm_name: string;
  firm_website: string | null;
  work_email: string;
  aum_bracket: string;
  primary_strategy: string[];
  main_fund_in_market: string | null;
  created_at: string;
  updated_at: string;
}

interface TargetGP {
  name: string;
  hqCountry: string;
  hqCity: string;
  primaryStrategy: string;
  sizeBucket: string;
  ariesAngle: string;
  website: string;
  linkedinUrl: string;
  decisionMaker: string;
}

const targetGPs: TargetGP[] = [
  {
    name: "EQT",
    hqCountry: "Sweden",
    hqCity: "Stockholm",
    primaryStrategy: "Pan-European buyout + infra + growth",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Selective entry for new European LPs and mid-sized institutions with AI/digital angle; regional or LP segment mandate.",
    website: "https://eqtgroup.com",
    linkedinUrl: "https://www.linkedin.com/company/eqt-group/posts/?feedView=all",
    decisionMaker: "Christian Sinding (CEO)"
  },
  {
    name: "Ardian",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "Multi-strategy (buyout, infra, secondaries, private debt)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Support for mid-tier LPs and less covered geographies (Southern Europe / DACH mid-tier) with systematic coverage.",
    website: "https://ardian.com",
    linkedinUrl: "https://linkedin.com/company/ardian",
    decisionMaker: "Benoît Verbrugghe (Head of Fundraising)"
  },
  {
    name: "CVC Capital Partners",
    hqCountry: "Luxembourg",
    hqCity: "Luxembourg",
    primaryStrategy: "Global PE / credit / secondaries",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Focused mandate on specific vehicles or new geographic markets; positioning as outsourced partner for capital formation.",
    website: "https://cvc.com",
    linkedinUrl: "https://linkedin.com/company/cvc-capital-partners",
    decisionMaker: "Stephen Marquardt (Head of Capital Formation)"
  },
  {
    name: "Bridgepoint",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "European mid/large-cap PE + credit",
    sizeBucket: "Large pan-European",
    ariesAngle: "Mandate on specific funds (e.g. growth, sector funds) for selected LPs in continental Europe.",
    website: "https://bridgepoint.eu",
    linkedinUrl: "https://linkedin.com/company/bridgepoint",
    decisionMaker: "William Jackson (Managing Partner)"
  },
  {
    name: "Apax Partners",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout / growth (TMT, health, services)",
    sizeBucket: "Mega",
    ariesAngle: "Focus on non-core European LPs or institutional family offices; advisory + fundraising for thematic vehicles.",
    website: "https://apax.com",
    linkedinUrl: "https://linkedin.com/company/apax-partners",
    decisionMaker: "Martin Halusa (CEO)"
  },
  {
    name: "Permira",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout (consumer, tech, services)",
    sizeBucket: "Mega",
    ariesAngle: "Angle on sub-1bn LPs / wealth managers and institutional FOs not at the center of their direct coverage.",
    website: "https://permira.com",
    linkedinUrl: "https://linkedin.com/company/permira",
    decisionMaker: "Kurt Björklund (Co-Head)"
  },
  {
    name: "Cinven",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Pan-European buyout",
    sizeBucket: "Large pan-European",
    ariesAngle: "Focus on specific markets (e.g. Italy / Iberia / CEE) with continuous coverage model and dedicated LP pipeline.",
    website: "https://cinven.com",
    linkedinUrl: "https://linkedin.com/company/cinven",
    decisionMaker: "Jörg Zirener (Managing Partner)"
  },
  {
    name: "BC Partners",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "PE + credit + real estate",
    sizeBucket: "Large pan-European",
    ariesAngle: "External partner for LP base expansion in specific geographic clusters (Southern Europe / CEE / Mid-East).",
    website: "https://bcpartners.com",
    linkedinUrl: "https://linkedin.com/company/bc-partners",
    decisionMaker: "Raymond Svider (Chairman)"
  },
  {
    name: "PAI Partners",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "European buyout",
    sizeBucket: "Large European",
    ariesAngle: "Support for mid-tier institutions and European FOs with structured fundraising and IR processes.",
    website: "https://paipartners.com",
    linkedinUrl: "https://linkedin.com/company/pai-partners",
    decisionMaker: "Patrice Bergé (Managing Partner)"
  },
  {
    name: "Eurazeo",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "Multi-asset (PE, infra, private debt, VC)",
    sizeBucket: "Large / multi-strategy",
    ariesAngle: "Mandate on selected strategies (growth, infra, thematic) and non-core geographies.",
    website: "https://eurazeo.com",
    linkedinUrl: "https://linkedin.com/company/eurazeo",
    decisionMaker: "Christophe Bavière (CEO)"
  },
  {
    name: "Advent International (EU)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout (franchise europea)",
    sizeBucket: "Mega",
    ariesAngle: "Angle on selected European / MEA mid-tier LPs where they lack continuous direct coverage.",
    website: "https://adventinternational.com",
    linkedinUrl: "https://linkedin.com/company/advent-international",
    decisionMaker: "David Mussafer (Managing Partner)"
  },
  {
    name: "Hg",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Software & tech services-focused PE",
    sizeBucket: "Large growth/buyout",
    ariesAngle: "Strong positioning on software vertical where you can combine AI narrative + recurring fee model.",
    website: "https://hgcapital.com",
    linkedinUrl: "https://linkedin.com/company/hg",
    decisionMaker: "Nic Humphries (Senior Partner)"
  },
  {
    name: "Partners Group",
    hqCountry: "Switzerland",
    hqCity: "Zug",
    primaryStrategy: "Global multi-asset (PE, infra, private debt)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Targeted mandate for non-core investors (e.g. some private banks / European FOs) on selected vehicles.",
    website: "https://partnersgroup.com",
    linkedinUrl: "https://linkedin.com/company/partners-group",
    decisionMaker: "David Layton (CEO)"
  },
  {
    name: "Triton Partners",
    hqCountry: "Germany",
    hqCity: "Frankfurt/Sweden",
    primaryStrategy: "Industrial & services-focused PE",
    sizeBucket: "Mid/large pan-European",
    ariesAngle: "Target with industrial / real economy angle on European institutional LPs and entrepreneurial FOs.",
    website: "https://triton-partners.com",
    linkedinUrl: "https://linkedin.com/company/triton-partners",
    decisionMaker: "Peder Prahl (Partner)"
  },
  {
    name: "Nordic Capital",
    hqCountry: "Sweden/Jersey",
    hqCity: "Stockholm/Jersey",
    primaryStrategy: "Healthcare + tech-enabled services",
    sizeBucket: "Large / sector-focused",
    ariesAngle: "Propose to specific EMEA institutional LPs interested in healthcare & tech sectors with continuous support.",
    website: "https://nordiccapital.com",
    linkedinUrl: "https://linkedin.com/company/nordic-capital",
    decisionMaker: "Fredrik Näslund (Managing Partner)"
  },
  {
    name: "Investindustrial",
    hqCountry: "Italy/UK",
    hqCity: "Milan/London",
    primaryStrategy: "Southern European mid-cap buyout",
    sizeBucket: "Mid/large-cap",
    ariesAngle: "Strong focus on continental LPs and entrepreneurial family offices seeking Southern Europe exposure.",
    website: "https://investindustrial.com",
    linkedinUrl: "https://linkedin.com/company/investindustrial",
    decisionMaker: "Andrea C. Bonomi (Chairman)"
  },
  {
    name: "Carlyle (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-strategy (buyout, growth, credit)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Specific mandate for certain regional or sector funds (e.g. growth, infra); selective outsourcing.",
    website: "https://carlyle.com",
    linkedinUrl: "https://linkedin.com/company/the-carlyle-group",
    decisionMaker: "Marcel van Poecke (Head of Europe)"
  },
  {
    name: "KKR (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, infra, credit)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Focus on new non-core LPs (family offices, wealth managers) and geographies where direct coverage is less extensive.",
    website: "https://kkr.com",
    linkedinUrl: "https://linkedin.com/company/kkr",
    decisionMaker: "Johannes Huth (Head of Europe)"
  },
  {
    name: "Blackstone (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, RE, credit, hedge fund solutions)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Mandate for specific funds or non-core geographies; support for retail-oriented or mid-sized institutions LPs.",
    website: "https://blackstone.com",
    linkedinUrl: "https://linkedin.com/company/blackstone",
    decisionMaker: "Lionel Assant (Head of Europe)"
  },
  {
    name: "Apollo (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, credit, real assets)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Selective positioning for credit-focused vehicles; support for mid-tier LPs and European wealth managers.",
    website: "https://apollo.com",
    linkedinUrl: "https://linkedin.com/company/apollo-global-management",
    decisionMaker: "Scott Kleinman (Co-President)"
  }
];

const GPPortal = () => {
  const [gpData, setGpData] = useState<GPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [displayedGPs, setDisplayedGPs] = useState<TargetGP[]>(targetGPs);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRemoveGP = (gpName: string) => {
    setDisplayedGPs(prev => prev.filter(gp => gp.name !== gpName));
    toast({
      title: "GP Removed",
      description: `${gpName} has been removed from your target list`,
    });
  };

  const filteredGPs = displayedGPs.filter(gp => {
    const matchesSearch = gp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gp.primaryStrategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gp.hqCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === "all" || gp.hqCountry === countryFilter;
    const matchesSize = sizeFilter === "all" || gp.sizeBucket.toLowerCase().includes(sizeFilter.toLowerCase());
    
    return matchesSearch && matchesCountry && matchesSize;
  });

  const uniqueCountries = Array.from(new Set(displayedGPs.map(gp => gp.hqCountry))).sort();

  useEffect(() => {
    checkGPAccess();
  }, []);

  const checkGPAccess = async () => {
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

      // If admin, allow access without GP registration
      if (userRole?.role === 'admin') {
        // Create a dummy GP data for admin display
        setGpData({
          id: 'admin',
          user_id: currentUser.id,
          first_name: 'Admin',
          last_name: 'User',
          role: 'Administrator',
          firm_name: 'Aries76',
          firm_website: 'https://aries76.com',
          work_email: currentUser.email || '',
          aum_bracket: 'N/A',
          primary_strategy: ['Admin Access'],
          main_fund_in_market: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      // Fetch GP data using email (more reliable than user_id)
      const { data: gpRegistrations, error } = await supabase
        .from('gp_registrations')
        .select('*')
        .eq('work_email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !gpRegistrations || gpRegistrations.length === 0) {
        console.error("Error fetching GP data:", error);
        toast({
          title: "Access Denied",
          description: "You are not registered as a General Partner",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setGpData(gpRegistrations[0]);
    } catch (error) {
      console.error("Error checking GP access:", error);
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

  if (!gpData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <Card className="p-8 max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
          <p className="text-white text-center">You are not registered as a General Partner</p>
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
              Welcome, <span className="text-accent">{gpData.first_name}</span>
            </h1>
            <p className="text-white/60 text-lg">{gpData.role} @ {gpData.firm_name}</p>
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
                  <p className="text-white/60 text-sm mb-1">Firm</p>
                  <p className="text-2xl font-semibold text-white">{gpData.firm_name}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">AUM Bracket</p>
                  <p className="text-2xl font-semibold text-white">{gpData.aum_bracket}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Strategies</p>
                  <p className="text-2xl font-semibold text-white">{gpData.primary_strategy.length}</p>
                </div>
                <FileText className="w-10 h-10 text-accent/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="target-gps" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="target-gps" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Target GPs
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Resources
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/60">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Target GPs Tab */}
          <TabsContent value="target-gps" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Aries76 Retainer Target GPs
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Strategic GP targets for Aries76's retainer-based capital raising services
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      placeholder="Search by name, strategy, or city..."
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

                  <Select value={sizeFilter} onValueChange={setSizeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Filter by size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="mega">Mega</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    {filteredGPs.length} GPs
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
                        <TableHead className="text-white/70">GP Name</TableHead>
                        <TableHead className="text-white/70">HQ</TableHead>
                        <TableHead className="text-white/70">Decision Maker</TableHead>
                        <TableHead className="text-white/70">Primary Strategy</TableHead>
                        <TableHead className="text-white/70">Size</TableHead>
                        <TableHead className="text-white/70">Aries Angle</TableHead>
                        <TableHead className="text-white/70">Links</TableHead>
                        <TableHead className="text-white/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGPs.map((gp, idx) => (
                        <TableRow 
                          key={idx} 
                          className="border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-medium text-white">
                            {gp.name}
                          </TableCell>
                          <TableCell className="text-white/70">
                            <div className="text-sm">
                              <div>{gp.hqCity}</div>
                              <div className="text-white/50">{gp.hqCountry}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70 text-sm">
                            {gp.decisionMaker}
                          </TableCell>
                          <TableCell className="text-white/70 max-w-xs">
                            <div className="text-sm truncate" title={gp.primaryStrategy}>
                              {gp.primaryStrategy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white/5 text-white/80 border-white/20">
                              {gp.sizeBucket}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/60 text-sm max-w-md">
                            <div className="line-clamp-2" title={gp.ariesAngle}>
                              {gp.ariesAngle}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/60 hover:text-accent hover:bg-white/5"
                                onClick={() => window.open(gp.website, '_blank')}
                                title="Visit website"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/60 hover:text-accent hover:bg-white/5"
                                onClick={() => window.open(gp.linkedinUrl, '_blank')}
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
                              onClick={() => handleRemoveGP(gp.name)}
                              title="Remove GP"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredGPs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">No GPs found matching your filters</p>
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
                      GP Capital Advisory
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Strategic solutions for GP capital management and optimization
                    </p>
                    <Button onClick={() => navigate('/gp-capital-advisory')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <TrendingUp className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Fundraising Economics
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Analysis and insights on fundraising economics and market trends
                    </p>
                    <Button onClick={() => navigate('/gp-fundraising-economics')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <FileText className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Private Equity Funds
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Information about our private equity fund structures and strategies
                    </p>
                    <Button onClick={() => navigate('/private-equity-funds')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                    <FileText className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Market Intelligence
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Access to proprietary market data and competitive intelligence
                    </p>
                    <Button onClick={() => navigate('/aires-data')} variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
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
                    <p className="text-white/60 text-sm mb-2">Total Target GPs</p>
                    <p className="text-3xl font-semibold text-white">{displayedGPs.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Countries Covered</p>
                    <p className="text-3xl font-semibold text-white">{uniqueCountries.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Mega/Large Funds</p>
                    <p className="text-3xl font-semibold text-white">
                      {displayedGPs.filter(gp => gp.sizeBucket.toLowerCase().includes('mega') || gp.sizeBucket.toLowerCase().includes('large')).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium">Geographic Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uniqueCountries.map(country => {
                      const count = displayedGPs.filter(gp => gp.hqCountry === country).length;
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GPPortal;
