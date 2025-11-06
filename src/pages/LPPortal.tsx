import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Users, Building2, FileText, Settings, TrendingUp, Briefcase, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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

const LPPortal = () => {
  const [lpData, setLpData] = useState<LPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Recupera dati LP usando l'email dell'utente
      const { data: lpRegistrations, error } = await supabase
        .from('lp_registrations')
        .select('*')
        .eq('email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !lpRegistrations || lpRegistrations.length === 0) {
        console.error("Error fetching LP data:", error);
        toast({
          title: "Accesso Negato",
          description: "Non sei registrato come Limited Partner",
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
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 max-w-md">
          <p className="text-white text-center">Non sei registrato come Limited Partner</p>
          <Button onClick={() => navigate('/')} className="w-full mt-4">
            Torna alla Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Hero Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 rounded-2xl blur-3xl -z-10" />
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/40 text-sm px-3 py-1">
                      Limited Partner
                    </Badge>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight">
                    Benvenuto, <span className="text-accent font-normal">{lpData.full_name.split(' ')[0]}</span>
                  </h1>
                  <div className="flex items-center gap-2 text-white/70">
                    <Building2 className="w-5 h-5" />
                    <p className="text-lg">
                      {lpData.role || 'Investor'} <span className="text-white/50">@</span> {lpData.organization}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogout}
                  className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="group bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-accent" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white/50 text-sm font-light uppercase tracking-wider">Organization</p>
                <p className="text-white text-2xl font-light truncate">{lpData.organization}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white/50 text-sm font-light uppercase tracking-wider">Investor Type</p>
                <p className="text-white text-xl font-light">{lpData.investor_type || 'Not Specified'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-green-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white/50 text-sm font-light uppercase tracking-wider">Areas of Interest</p>
                <p className="text-white text-3xl font-light">{lpData.areas_of_interest?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-white/10 border border-white/20 backdrop-blur-sm p-1.5 h-auto">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/70 px-6 py-3 text-base font-light"
            >
              <FileText className="w-4 h-4 mr-2" />
              Profilo
            </TabsTrigger>
            <TabsTrigger 
              value="opportunities" 
              className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/70 px-6 py-3 text-base font-light"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Opportunità
            </TabsTrigger>
            <TabsTrigger 
              value="gp-matches" 
              className="data-[state=active]:bg-accent data-[state=active]:text-white text-white/70 px-6 py-3 text-base font-light"
            >
              <Users className="w-4 h-4 mr-2" />
              GP Matches
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-3xl font-light flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    Il Tuo Profilo
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Modifica
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Informazioni Personali</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Nome Completo</p>
                      <p className="text-white text-lg font-light">{lpData.full_name}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Ruolo</p>
                      <p className="text-white text-lg font-light">{lpData.role || 'N/A'}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Email</p>
                      <p className="text-white text-lg font-light break-all">{lpData.email}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Giurisdizione</p>
                      <p className="text-white text-lg font-light">{lpData.jurisdiction || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Investment Interests */}
                <div>
                  <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Aree di Interesse</h3>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    {lpData.areas_of_interest && lpData.areas_of_interest.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {lpData.areas_of_interest.map((interest, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/30 px-4 py-2 text-sm font-light"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-center py-4">Nessuna area di interesse specificata</p>
                    )}
                  </div>
                </div>

                {lpData.message && (
                  <>
                    <Separator className="bg-white/10" />
                    <div>
                      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Messaggio</h3>
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <p className="text-white/70 leading-relaxed">{lpData.message}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-3xl font-light flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  Opportunità di Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Private Equity Funds */}
                <div className="group bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 hover:border-accent/50 transition-all duration-300 cursor-pointer"
                     onClick={() => navigate('/private-equity-funds')}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-8 h-8 text-accent" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponibile</Badge>
                  </div>
                  <h3 className="text-white text-2xl font-light mb-3 group-hover:text-accent transition-colors">
                    Private Equity Funds
                  </h3>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    Scopri i nostri fondi di private equity selezionati con focus su performance e gestione professionale
                  </p>
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    Esplora Fondi
                  </Button>
                </div>

                {/* LP Services */}
                <div className="group bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                     onClick={() => navigate('/for-limited-partners')}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Premium</Badge>
                  </div>
                  <h3 className="text-white text-2xl font-light mb-3 group-hover:text-blue-400 transition-colors">
                    Servizi per Limited Partners
                  </h3>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    Servizi dedicati e consulenza personalizzata per massimizzare il tuo portafoglio di investimenti
                  </p>
                  <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    Scopri i Servizi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GP Matches Tab */}
          <TabsContent value="gp-matches" className="space-y-6">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-3xl font-light flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  General Partners Compatibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-white/30" />
                  </div>
                  <p className="text-white/60 text-xl mb-2 font-light">Funzionalità in arrivo</p>
                  <p className="text-white/40 text-sm max-w-md mx-auto">
                    Presto potrai vedere i General Partners compatibili con il tuo profilo e le tue preferenze di investimento
                  </p>
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
