import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Building2, TrendingUp, FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const GPPortal = () => {
  const [gpData, setGpData] = useState<GPRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Recupera dati GP
      const { data: gpRegistration, error } = await supabase
        .from('gp_registrations')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching GP data:", error);
        toast({
          title: "Accesso Negato",
          description: "Non sei registrato come General Partner",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setGpData(gpRegistration);
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
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 max-w-md">
          <p className="text-white text-center">Non sei registrato come General Partner</p>
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

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-white mb-2">
              Benvenuto, <span className="text-accent">{gpData.first_name}</span>
            </h1>
            <p className="text-white/60 text-lg">{gpData.role} @ {gpData.firm_name}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-white/20 text-white hover:bg-white/10"
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
                  <p className="text-2xl font-light text-white">{gpData.firm_name}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">AUM Bracket</p>
                  <p className="text-2xl font-light text-white">{gpData.aum_bracket}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Strategies</p>
                  <p className="text-2xl font-light text-white">{gpData.primary_strategy.length}</p>
                </div>
                <FileText className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="profile" className="data-[state=active]:bg-accent">
              Profilo
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-accent">
              Risorse
            </TabsTrigger>
            <TabsTrigger value="lp-matches" className="data-[state=active]:bg-accent">
              LP Matches
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Il Tuo Profilo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Nome Completo</p>
                    <p className="text-white text-lg">{gpData.first_name} {gpData.last_name}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Ruolo</p>
                    <p className="text-white text-lg">{gpData.role}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Email</p>
                    <p className="text-white text-lg">{gpData.work_email}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Sito Web</p>
                    <p className="text-white text-lg">{gpData.firm_website || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-2">Strategie Principali</p>
                  <div className="flex flex-wrap gap-2">
                    {gpData.primary_strategy.map((strategy, idx) => (
                      <Badge key={idx} className="bg-accent/20 text-accent border-accent/30">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>

                {gpData.main_fund_in_market && (
                  <div>
                    <p className="text-white/50 text-sm mb-1">Fondo Attualmente in Fundraising</p>
                    <p className="text-white text-lg">{gpData.main_fund_in_market}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Modifica Profilo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Risorse per General Partners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-medium mb-2">
                    GP Capital Advisory
                  </h3>
                  <p className="text-white/60 mb-4">
                    Scopri le nostre soluzioni per la gestione del capitale GP
                  </p>
                  <Button onClick={() => navigate('/gp-capital-advisory')}>
                    Scopri di più
                  </Button>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-medium mb-2">
                    Fundraising Economics
                  </h3>
                  <p className="text-white/60 mb-4">
                    Analisi e insights sugli economics del fundraising
                  </p>
                  <Button onClick={() => navigate('/gp-fundraising-economics')}>
                    Scopri di più
                  </Button>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-medium mb-2">
                    Private Equity Funds
                  </h3>
                  <p className="text-white/60 mb-4">
                    Informazioni sui nostri fondi di private equity
                  </p>
                  <Button onClick={() => navigate('/private-equity-funds')}>
                    Scopri di più
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LP Matches Tab */}
          <TabsContent value="lp-matches" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Limited Partners Compatibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg mb-2">Funzionalità in arrivo</p>
                  <p className="text-white/40 text-sm">
                    Presto potrai vedere i Limited Partners compatibili con il tuo profilo
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

export default GPPortal;
