import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Users, Building2, FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-white mb-2">
              Benvenuto, <span className="text-accent">{lpData.full_name.split(' ')[0]}</span>
            </h1>
            <p className="text-white/60 text-lg">{lpData.role || 'Investor'} @ {lpData.organization}</p>
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
                  <p className="text-white/60 text-sm mb-1">Organization</p>
                  <p className="text-2xl font-light text-white truncate">{lpData.organization}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Investor Type</p>
                  <p className="text-xl font-light text-white">{lpData.investor_type || 'N/A'}</p>
                </div>
                <Users className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Interests</p>
                  <p className="text-2xl font-light text-white">{lpData.areas_of_interest?.length || 0}</p>
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
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-accent">
              Opportunità
            </TabsTrigger>
            <TabsTrigger value="gp-matches" className="data-[state=active]:bg-accent">
              GP Matches
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
              <CardContent className="space-y-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Nome Completo</p>
                    <p className="text-white text-lg">{lpData.full_name}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Ruolo</p>
                    <p className="text-white text-lg">{lpData.role || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Email</p>
                    <p className="text-white text-lg break-words">{lpData.email}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Giurisdizione</p>
                    <p className="text-white text-lg">{lpData.jurisdiction || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-3">Aree di Interesse</p>
                  <div className="flex flex-wrap gap-2">
                    {lpData.areas_of_interest && lpData.areas_of_interest.length > 0 ? (
                      lpData.areas_of_interest.map((interest, idx) => (
                        <Badge key={idx} className="bg-accent/20 text-accent border-accent/30">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-white/40">Nessuna area di interesse specificata</p>
                    )}
                  </div>
                </div>

                {lpData.message && (
                  <div>
                    <p className="text-white/50 text-sm mb-2">Messaggio</p>
                    <p className="text-white/70 text-sm bg-white/5 p-4 rounded-lg border border-white/10">
                      {lpData.message}
                    </p>
                  </div>
                )}

                <div className="pt-6">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Modifica Profilo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  Opportunità di Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-medium mb-2">
                    Private Equity Funds
                  </h3>
                  <p className="text-white/60 mb-4">
                    Scopri i nostri fondi di private equity
                  </p>
                  <Button onClick={() => navigate('/private-equity-funds')}>
                    Esplora Fondi
                  </Button>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-medium mb-2">
                    For Limited Partners
                  </h3>
                  <p className="text-white/60 mb-4">
                    Servizi dedicati ai Limited Partners
                  </p>
                  <Button onClick={() => navigate('/for-limited-partners')}>
                    Scopri i Servizi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GP Matches Tab */}
          <TabsContent value="gp-matches" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  General Partners Compatibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg mb-2">Funzionalità in arrivo</p>
                  <p className="text-white/40 text-sm">
                    Presto potrai vedere i General Partners compatibili con il tuo profilo
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GP Matches Tab */}
          <TabsContent value="gp-matches" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-light">
                  General Partners Compatibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg mb-2">Funzionalità in arrivo</p>
                  <p className="text-white/40 text-sm">
                    Presto potrai vedere i General Partners compatibili con il tuo profilo
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
