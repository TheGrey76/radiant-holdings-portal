import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, TrendingUp, Users, Building2, Eye, Download, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
}

interface GPRegistration {
  id: string;
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
}

interface Match {
  gp: GPRegistration;
  lp: LPRegistration;
  score: number;
  reasons: string[];
}

const GPLPDashboard = () => {
  const [lpRegistrations, setLpRegistrations] = useState<LPRegistration[]>([]);
  const [gpRegistrations, setGpRegistrations] = useState<GPRegistration[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLP, setSelectedLP] = useState<LPRegistration | null>(null);
  const [selectedGP, setSelectedGP] = useState<GPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase.rpc('get_current_user_role');
      
      if (roleData !== 'admin') {
        toast({
          title: "Accesso Negato",
          description: "Non hai i permessi per accedere a questa pagina",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lpResult, gpResult] = await Promise.all([
        supabase.from('lp_registrations').select('*').order('created_at', { ascending: false }),
        supabase.from('gp_registrations').select('*').order('created_at', { ascending: false })
      ]);

      if (lpResult.error) throw lpResult.error;
      if (gpResult.error) throw gpResult.error;

      setLpRegistrations(lpResult.data || []);
      setGpRegistrations(gpResult.data || []);
      
      calculateMatches(gpResult.data || [], lpResult.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMatches = (gps: GPRegistration[], lps: LPRegistration[]) => {
    const allMatches: Match[] = [];

    gps.forEach(gp => {
      lps.forEach(lp => {
        const { score, reasons } = calculateMatchScore(gp, lp);
        if (score > 0) {
          allMatches.push({ gp, lp, score, reasons });
        }
      });
    });

    allMatches.sort((a, b) => b.score - a.score);
    setMatches(allMatches);
  };

  const calculateMatchScore = (gp: GPRegistration, lp: LPRegistration): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    if (lp.areas_of_interest && gp.primary_strategy) {
      const commonStrategies = lp.areas_of_interest.filter(area => 
        gp.primary_strategy.some(strategy => 
          strategy.toLowerCase().includes(area.toLowerCase()) ||
          area.toLowerCase().includes(strategy.toLowerCase())
        )
      );
      
      if (commonStrategies.length > 0) {
        const strategyScore = commonStrategies.length * 30;
        score += strategyScore;
        reasons.push(`${commonStrategies.length} strategia/e compatibile/i: ${commonStrategies.join(', ')}`);
      }
    }

    if (lp.investor_type) {
      const investorType = lp.investor_type.toLowerCase();
      if (investorType.includes('institutional') || investorType.includes('pension')) {
        if (gp.aum_bracket.includes('500M+') || gp.aum_bracket.includes('1B+')) {
          score += 25;
          reasons.push('Investitore istituzionale + GP di grandi dimensioni');
        }
      } else if (investorType.includes('family') || investorType.includes('hnwi')) {
        if (!gp.aum_bracket.includes('1B+')) {
          score += 20;
          reasons.push('Family office/HNWI + GP di dimensioni appropriate');
        }
      }
    }

    if (gp.main_fund_in_market && gp.main_fund_in_market.toLowerCase() !== 'no') {
      score += 15;
      reasons.push('GP ha un fondo attivamente in fundraising');
    }

    if (lp.jurisdiction) {
      score += 10;
      reasons.push(`Giurisdizione LP: ${lp.jurisdiction}`);
    }

    return { score, reasons };
  };

  const getMatchQuality = (score: number): { label: string; color: string } => {
    if (score >= 70) return { label: 'Eccellente', color: 'bg-green-500' };
    if (score >= 50) return { label: 'Molto Buono', color: 'bg-blue-500' };
    if (score >= 30) return { label: 'Buono', color: 'bg-yellow-500' };
    return { label: 'Discreto', color: 'bg-orange-500' };
  };

  const exportGPToCSV = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Role', 'Firm', 'Website', 'AUM Bracket', 'Strategy', 'Fund in Market', 'Date'],
      ...gpRegistrations.map(gp => [
        gp.first_name,
        gp.last_name,
        gp.work_email,
        gp.role,
        gp.firm_name,
        gp.firm_website || '',
        gp.aum_bracket,
        gp.primary_strategy.join('; '),
        gp.main_fund_in_market || '',
        new Date(gp.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gp-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "GP registrations exported to CSV",
    });
  };

  const exportLPToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Organization', 'Role', 'Jurisdiction', 'Investor Type', 'Status', 'Date'],
      ...lpRegistrations.map(lp => [
        lp.full_name,
        lp.email,
        lp.organization,
        lp.role || '',
        lp.jurisdiction || '',
        lp.investor_type || '',
        lp.status,
        new Date(lp.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lp-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "LP registrations exported to CSV",
    });
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-4">
            Dashboard <span className="text-accent">GP/LP</span>
          </h1>
          <p className="text-white/60 text-lg">
            Gestione completa di General Partners, Limited Partners e Matching
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">General Partners</p>
                  <p className="text-3xl font-light text-white">{gpRegistrations.length}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Limited Partners</p>
                  <p className="text-3xl font-light text-white">{lpRegistrations.length}</p>
                </div>
                <Users className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Matches</p>
                  <p className="text-3xl font-light text-white">{matches.length}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="gp" className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20 backdrop-blur-sm">
            <TabsTrigger value="gp" className="data-[state=active]:bg-accent">
              <Briefcase className="w-4 h-4 mr-2" />
              General Partners
            </TabsTrigger>
            <TabsTrigger value="lp" className="data-[state=active]:bg-accent">
              <Users className="w-4 h-4 mr-2" />
              Limited Partners
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-accent">
              <TrendingUp className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
          </TabsList>

          {/* GP Tab */}
          <TabsContent value="gp" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl font-light">
                    GP Registrations ({gpRegistrations.length})
                  </CardTitle>
                  <Button
                    onClick={exportGPToCSV}
                    variant="outline"
                    className="border-accent/40 bg-accent/10 text-white hover:bg-accent/20"
                    disabled={gpRegistrations.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Name</TableHead>
                        <TableHead className="text-white/70">Email</TableHead>
                        <TableHead className="text-white/70">Firm</TableHead>
                        <TableHead className="text-white/70">AUM</TableHead>
                        <TableHead className="text-white/70">Strategy</TableHead>
                        <TableHead className="text-white/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gpRegistrations.map((gp) => (
                        <TableRow key={gp.id} className="border-white/10">
                          <TableCell className="text-white">{gp.first_name} {gp.last_name}</TableCell>
                          <TableCell className="text-white/70">{gp.work_email}</TableCell>
                          <TableCell className="text-white/70">{gp.firm_name}</TableCell>
                          <TableCell className="text-white/70">{gp.aum_bracket}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {gp.primary_strategy.slice(0, 2).map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-white/70 border-white/20">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedGP(gp)}
                              className="text-accent hover:text-accent/80"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LP Tab */}
          <TabsContent value="lp" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl font-light">
                    LP Registrations ({lpRegistrations.length})
                  </CardTitle>
                  <Button
                    onClick={exportLPToCSV}
                    variant="outline"
                    className="border-accent/40 bg-accent/10 text-white hover:bg-accent/20"
                    disabled={lpRegistrations.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Name</TableHead>
                        <TableHead className="text-white/70">Email</TableHead>
                        <TableHead className="text-white/70">Organization</TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">Interests</TableHead>
                        <TableHead className="text-white/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lpRegistrations.map((lp) => (
                        <TableRow key={lp.id} className="border-white/10">
                          <TableCell className="text-white">{lp.full_name}</TableCell>
                          <TableCell className="text-white/70">{lp.email}</TableCell>
                          <TableCell className="text-white/70">{lp.organization}</TableCell>
                          <TableCell className="text-white/70">{lp.investor_type || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {lp.areas_of_interest?.slice(0, 2).map((interest, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-white/70 border-white/20">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLP(lp)}
                              className="text-accent hover:text-accent/80"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Matches Suggeriti ({matches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/60 text-lg">Nessun match trovato</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {matches.map((match, index) => {
                      const quality = getMatchQuality(match.score);
                      return (
                        <div
                          key={`${match.gp.id}-${match.lp.id}-${index}`}
                          className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${quality.color}`} />
                              <Badge className="bg-accent/20 text-accent border-accent/30">
                                Score: {match.score}
                              </Badge>
                              <Badge variant="outline" className="text-white/70 border-white/20">
                                {quality.label}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5 text-accent" />
                                <h3 className="text-white font-medium text-lg">General Partner</h3>
                              </div>
                              <p className="text-white text-lg">{match.gp.first_name} {match.gp.last_name}</p>
                              <p className="text-white/60 text-sm">{match.gp.role} @ {match.gp.firm_name}</p>
                              <p className="text-white/40 text-sm">{match.gp.work_email}</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-accent" />
                                <h3 className="text-white font-medium text-lg">Limited Partner</h3>
                              </div>
                              <p className="text-white text-lg">{match.lp.full_name}</p>
                              <p className="text-white/60 text-sm">{match.lp.role || 'N/A'} @ {match.lp.organization}</p>
                              <p className="text-white/40 text-sm">{match.lp.email}</p>
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-white/70 text-sm font-medium mb-2">Ragioni del Match:</p>
                            <ul className="space-y-1">
                              {match.reasons.map((reason, idx) => (
                                <li key={idx} className="text-white/50 text-sm flex items-start gap-2">
                                  <span className="text-accent mt-1">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* GP Detail Dialog */}
      <Dialog open={!!selectedGP} onOpenChange={() => setSelectedGP(null)}>
        <DialogContent className="bg-[#0f1729] border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">
              {selectedGP?.first_name} {selectedGP?.last_name}
            </DialogTitle>
          </DialogHeader>
          {selectedGP && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-sm">Email</p>
                  <p className="text-white">{selectedGP.work_email}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Role</p>
                  <p className="text-white">{selectedGP.role}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Firm</p>
                  <p className="text-white">{selectedGP.firm_name}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">AUM Bracket</p>
                  <p className="text-white">{selectedGP.aum_bracket}</p>
                </div>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-2">Primary Strategy</p>
                <div className="flex flex-wrap gap-2">
                  {selectedGP.primary_strategy.map((s, i) => (
                    <Badge key={i} className="bg-accent/20 text-accent border-accent/30">{s}</Badge>
                  ))}
                </div>
              </div>
              {selectedGP.main_fund_in_market && (
                <div>
                  <p className="text-white/50 text-sm">Fund in Market</p>
                  <p className="text-white">{selectedGP.main_fund_in_market}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* LP Detail Dialog */}
      <Dialog open={!!selectedLP} onOpenChange={() => setSelectedLP(null)}>
        <DialogContent className="bg-[#0f1729] border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">{selectedLP?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedLP && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-sm">Email</p>
                  <p className="text-white">{selectedLP.email}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Role</p>
                  <p className="text-white">{selectedLP.role || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Organization</p>
                  <p className="text-white">{selectedLP.organization}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Investor Type</p>
                  <p className="text-white">{selectedLP.investor_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Jurisdiction</p>
                  <p className="text-white">{selectedLP.jurisdiction || 'N/A'}</p>
                </div>
              </div>
              {selectedLP.areas_of_interest && selectedLP.areas_of_interest.length > 0 && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Areas of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLP.areas_of_interest.map((interest, i) => (
                      <Badge key={i} className="bg-accent/20 text-accent border-accent/30">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedLP.message && (
                <div>
                  <p className="text-white/50 text-sm">Message</p>
                  <p className="text-white/70 bg-white/5 p-4 rounded-lg border border-white/10">{selectedLP.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GPLPDashboard;
