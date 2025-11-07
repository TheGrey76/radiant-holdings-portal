import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Building2, TrendingUp, FileText, Search, Filter } from "lucide-react";
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
}

const targetGPs: TargetGP[] = [
  {
    name: "EQT",
    hqCountry: "Sweden",
    hqCity: "Stockholm",
    primaryStrategy: "Pan-European buyout + infra + growth",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Selective entry for new European LPs and mid-sized institutions with AI/digital angle; regional or LP segment mandate."
  },
  {
    name: "Ardian",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "Multi-strategy (buyout, infra, secondaries, private debt)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Support for mid-tier LPs and less covered geographies (Southern Europe / DACH mid-tier) with systematic coverage."
  },
  {
    name: "CVC Capital Partners",
    hqCountry: "Luxembourg",
    hqCity: "Luxembourg",
    primaryStrategy: "Global PE / credit / secondaries",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Focused mandate on specific vehicles or new geographic markets; positioning as outsourced partner for capital formation."
  },
  {
    name: "Bridgepoint",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "European mid/large-cap PE + credit",
    sizeBucket: "Large pan-European",
    ariesAngle: "Mandate on specific funds (e.g. growth, sector funds) for selected LPs in continental Europe."
  },
  {
    name: "Apax Partners",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout / growth (TMT, health, services)",
    sizeBucket: "Mega",
    ariesAngle: "Focus on non-core European LPs or institutional family offices; advisory + fundraising for thematic vehicles."
  },
  {
    name: "Permira",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout (consumer, tech, services)",
    sizeBucket: "Mega",
    ariesAngle: "Angle on sub-1bn LPs / wealth managers and institutional FOs not at the center of their direct coverage."
  },
  {
    name: "Cinven",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Pan-European buyout",
    sizeBucket: "Large pan-European",
    ariesAngle: "Focus on specific markets (e.g. Italy / Iberia / CEE) with continuous coverage model and dedicated LP pipeline."
  },
  {
    name: "BC Partners",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "PE + credit + real estate",
    sizeBucket: "Large pan-European",
    ariesAngle: "External partner for LP base expansion in specific geographic clusters (Southern Europe / CEE / Mid-East)."
  },
  {
    name: "PAI Partners",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "European buyout",
    sizeBucket: "Large European",
    ariesAngle: "Support for mid-tier institutions and European FOs with structured fundraising and IR processes."
  },
  {
    name: "Eurazeo",
    hqCountry: "France",
    hqCity: "Paris",
    primaryStrategy: "Multi-asset (PE, infra, private debt, VC)",
    sizeBucket: "Large / multi-strategy",
    ariesAngle: "Mandate on selected strategies (growth, infra, thematic) and non-core geographies."
  },
  {
    name: "Advent International (EU)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Global buyout (franchise europea)",
    sizeBucket: "Mega",
    ariesAngle: "Angle on selected European / MEA mid-tier LPs where they lack continuous direct coverage."
  },
  {
    name: "Hg",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Software & tech services-focused PE",
    sizeBucket: "Large growth/buyout",
    ariesAngle: "Strong positioning on software vertical where you can combine AI narrative + recurring fee model."
  },
  {
    name: "Partners Group",
    hqCountry: "Switzerland",
    hqCity: "Zug",
    primaryStrategy: "Global multi-asset (PE, infra, private debt)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Targeted mandate for non-core investors (e.g. some private banks / European FOs) on selected vehicles."
  },
  {
    name: "Triton Partners",
    hqCountry: "Germany",
    hqCity: "Frankfurt/Sweden",
    primaryStrategy: "Industrial & services-focused PE",
    sizeBucket: "Mid/large pan-European",
    ariesAngle: "Target with industrial / real economy angle on European institutional LPs and entrepreneurial FOs."
  },
  {
    name: "Nordic Capital",
    hqCountry: "Sweden/Jersey",
    hqCity: "Stockholm/Jersey",
    primaryStrategy: "Healthcare + tech-enabled services",
    sizeBucket: "Large / sector-focused",
    ariesAngle: "Propose to specific EMEA institutional LPs interested in healthcare & tech sectors with continuous support."
  },
  {
    name: "Investindustrial",
    hqCountry: "Italy/UK",
    hqCity: "Milan/London",
    primaryStrategy: "Southern European mid-cap buyout",
    sizeBucket: "Mid/large-cap",
    ariesAngle: "Strong focus on continental LPs and entrepreneurial family offices seeking Southern Europe exposure."
  },
  {
    name: "Carlyle (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-strategy (buyout, growth, credit)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Specific mandate for certain regional or sector funds (e.g. growth, infra); selective outsourcing."
  },
  {
    name: "KKR (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, infra, credit)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Focus on new non-core LPs (family offices, wealth managers) and geographies where direct coverage is less extensive."
  },
  {
    name: "Blackstone (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, RE, credit, hedge fund solutions)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Mandate for specific funds or non-core geographies; support for retail-oriented or mid-sized institutions LPs."
  },
  {
    name: "Apollo (Europe)",
    hqCountry: "UK",
    hqCity: "London",
    primaryStrategy: "Multi-asset (PE, credit, real assets)",
    sizeBucket: "Mega / multi-strategy",
    ariesAngle: "Selective positioning for credit-focused vehicles; support for mid-tier LPs and European wealth managers."
  }
];

const GPPortal = () => {
  const [gpData, setGpData] = useState<GPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredGPs = targetGPs.filter(gp => {
    const matchesSearch = gp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gp.primaryStrategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gp.hqCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === "all" || gp.hqCountry === countryFilter;
    const matchesSize = sizeFilter === "all" || gp.sizeBucket.toLowerCase().includes(sizeFilter.toLowerCase());
    
    return matchesSearch && matchesCountry && matchesSize;
  });

  const uniqueCountries = Array.from(new Set(targetGPs.map(gp => gp.hqCountry))).sort();

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!gpData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md">
          <p className="text-foreground text-center">You are not registered as a General Partner</p>
          <Button onClick={() => navigate('/')} className="w-full mt-4">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 py-24 pt-32 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-foreground mb-2">
              Welcome, <span className="text-accent">{gpData.first_name}</span>
            </h1>
            <p className="text-muted-foreground text-lg">{gpData.role} @ {gpData.firm_name}</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Firm</p>
                  <p className="text-2xl font-semibold text-foreground">{gpData.firm_name}</p>
                </div>
                <Building2 className="w-10 h-10 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">AUM Bracket</p>
                  <p className="text-2xl font-semibold text-foreground">{gpData.aum_bracket}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Strategies</p>
                  <p className="text-2xl font-semibold text-foreground">{gpData.primary_strategy.length}</p>
                </div>
                <FileText className="w-10 h-10 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="target-gps" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="target-gps" className="data-[state=active]:bg-accent">
              Target GPs
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-accent">
              Resources
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent">
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
                        <TableHead className="text-white/70">Primary Strategy</TableHead>
                        <TableHead className="text-white/70">Size</TableHead>
                        <TableHead className="text-white/70">Aries Angle</TableHead>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Resources & Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-6 border hover:border-primary transition-colors">
                    <Building2 className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-foreground text-lg font-medium mb-2">
                      GP Capital Advisory
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Strategic solutions for GP capital management and optimization
                    </p>
                    <Button onClick={() => navigate('/gp-capital-advisory')} variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-muted rounded-lg p-6 border hover:border-primary transition-colors">
                    <TrendingUp className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-foreground text-lg font-medium mb-2">
                      Fundraising Economics
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Analysis and insights on fundraising economics and market trends
                    </p>
                    <Button onClick={() => navigate('/gp-fundraising-economics')} variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-muted rounded-lg p-6 border hover:border-primary transition-colors">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-foreground text-lg font-medium mb-2">
                      Private Equity Funds
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Information about our private equity fund structures and strategies
                    </p>
                    <Button onClick={() => navigate('/private-equity-funds')} variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>

                  <div className="bg-muted rounded-lg p-6 border hover:border-primary transition-colors">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-foreground text-lg font-medium mb-2">
                      Market Intelligence
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Access to proprietary market data and competitive intelligence
                    </p>
                    <Button onClick={() => navigate('/aires-data')} variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Portfolio Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-muted rounded-lg p-6 border">
                    <p className="text-muted-foreground text-sm mb-2">Total Target GPs</p>
                    <p className="text-3xl font-semibold text-foreground">{targetGPs.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-6 border">
                    <p className="text-muted-foreground text-sm mb-2">Countries Covered</p>
                    <p className="text-3xl font-semibold text-foreground">{uniqueCountries.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-6 border">
                    <p className="text-muted-foreground text-sm mb-2">Mega/Large Funds</p>
                    <p className="text-3xl font-semibold text-foreground">
                      {targetGPs.filter(gp => gp.sizeBucket.toLowerCase().includes('mega') || gp.sizeBucket.toLowerCase().includes('large')).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-foreground text-lg font-medium">Geographic Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uniqueCountries.map(country => {
                      const count = targetGPs.filter(gp => gp.hqCountry === country).length;
                      return (
                        <div key={country} className="bg-muted rounded-lg p-4 border">
                          <p className="text-muted-foreground text-xs mb-1">{country}</p>
                          <p className="text-2xl font-semibold text-foreground">{count}</p>
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
