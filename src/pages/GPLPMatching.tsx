import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, TrendingUp, Users, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";

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

const GPLPMatching = () => {
  const [lpRegistrations, setLpRegistrations] = useState<LPRegistration[]>([]);
  const [gpRegistrations, setGpRegistrations] = useState<GPRegistration[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
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
      
      // Calcola matching
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

    // Ordina per score decrescente
    allMatches.sort((a, b) => b.score - a.score);
    setMatches(allMatches);
  };

  const calculateMatchScore = (gp: GPRegistration, lp: LPRegistration): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // Match su strategia
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

    // Match su investor type vs AUM
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

    // Bonus per fund in market
    if (gp.main_fund_in_market && gp.main_fund_in_market.toLowerCase() !== 'no') {
      score += 15;
      reasons.push('GP ha un fondo attivamente in fundraising');
    }

    // Match geografico (se disponibile)
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
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
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
            Sistema di <span className="text-accent">Matching</span> GP/LP
          </h1>
          <p className="text-white/60 text-lg">
            Trova le migliori corrispondenze tra General Partners e Limited Partners
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Matches List */}
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
                <p className="text-white/40 text-sm mt-2">
                  Aggiungi più GP e LP per generare matches
                </p>
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
                        {/* GP Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-accent" />
                            <h3 className="text-white font-medium text-lg">General Partner</h3>
                          </div>
                          <p className="text-white text-lg">{match.gp.first_name} {match.gp.last_name}</p>
                          <p className="text-white/60 text-sm">{match.gp.role} @ {match.gp.firm_name}</p>
                          <p className="text-white/40 text-sm">{match.gp.work_email}</p>
                          <div className="pt-2">
                            <p className="text-white/50 text-xs mb-1">AUM Bracket:</p>
                            <Badge variant="outline" className="text-white/70 border-white/20">
                              {match.gp.aum_bracket}
                            </Badge>
                          </div>
                          <div className="pt-1">
                            <p className="text-white/50 text-xs mb-1">Strategies:</p>
                            <div className="flex flex-wrap gap-1">
                              {match.gp.primary_strategy.map((strategy, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-white/70 border-white/20">
                                  {strategy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* LP Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-accent" />
                            <h3 className="text-white font-medium text-lg">Limited Partner</h3>
                          </div>
                          <p className="text-white text-lg">{match.lp.full_name}</p>
                          <p className="text-white/60 text-sm">{match.lp.role || 'N/A'} @ {match.lp.organization}</p>
                          <p className="text-white/40 text-sm">{match.lp.email}</p>
                          {match.lp.investor_type && (
                            <div className="pt-2">
                              <p className="text-white/50 text-xs mb-1">Investor Type:</p>
                              <Badge variant="outline" className="text-white/70 border-white/20">
                                {match.lp.investor_type}
                              </Badge>
                            </div>
                          )}
                          {match.lp.areas_of_interest && match.lp.areas_of_interest.length > 0 && (
                            <div className="pt-1">
                              <p className="text-white/50 text-xs mb-1">Interests:</p>
                              <div className="flex flex-wrap gap-1">
                                {match.lp.areas_of_interest.map((interest, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs text-white/70 border-white/20">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Match Reasons */}
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
      </div>
    </div>
  );
};

export default GPLPMatching;
