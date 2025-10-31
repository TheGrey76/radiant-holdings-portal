import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkRegistration from "@/components/NetworkRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, TrendingUp, Users, MapPin, DollarSign, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

const investors = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    company: "Venture Capital Partners", 
    sector: "AI & Machine Learning", 
    location: "London, UK", 
    investmentRange: "$1M - $5M", 
    avatar: "/placeholder.svg", 
    email: "alex@vcpartners.com",
    linkedin: "#"
  },
  { 
    id: 2, 
    name: "Sarah Williams", 
    company: "Future Funds", 
    sector: "Fintech", 
    location: "New York, USA", 
    investmentRange: "$500K - $2M", 
    avatar: "/placeholder.svg", 
    email: "sarah@futurefunds.com",
    linkedin: "#"
  },
  { 
    id: 3, 
    name: "Michael Chen", 
    company: "Tech Ventures", 
    sector: "SaaS", 
    location: "San Francisco, USA", 
    investmentRange: "$2M - $10M", 
    avatar: "/placeholder.svg", 
    email: "michael@techventures.com",
    linkedin: "#"
  },
];

const startups = [
  { 
    id: 1, 
    name: "DataMinds", 
    sector: "AI & Data Analytics", 
    stage: "Seed", 
    location: "Berlin, Germany", 
    seeking: "$750K", 
    logo: "/placeholder.svg", 
    description: "AI platform for data-driven decision making across industries",
    contact: "contact@dataminds.ai",
    website: "#"
  },
  { 
    id: 2, 
    name: "SecurePay", 
    sector: "Fintech", 
    stage: "Series A", 
    location: "London, UK", 
    seeking: "$3M", 
    logo: "/placeholder.svg", 
    description: "Next-generation payment processing solution with enhanced security features",
    contact: "info@securepay.tech",
    website: "#"
  },
  { 
    id: 3, 
    name: "GreenEnergy", 
    sector: "CleanTech", 
    stage: "Series B", 
    location: "Stockholm, Sweden", 
    seeking: "$8M", 
    logo: "/placeholder.svg", 
    description: "Renewable energy solutions for residential and commercial applications",
    contact: "partnerships@greenenergy.co",
    website: "#"
  },
];

const NetworkDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('network_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      
      // If profile is not complete, redirect to profile page
      if (!data.profile_complete) {
        navigate('/profile');
      }
    }
    setLoading(false);
  };

  const handleRegistration = () => {
    // After registration, auth state will update automatically
  };

  const handleUserProfileClick = () => {
    navigate('/profile');
  };

  const sectors = ["all", "AI & Machine Learning", "Fintech", "SaaS", "CleanTech", "Health Tech"];
  
  const filteredInvestors = investors.filter(investor => 
    (investor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     investor.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === "all" || investor.sector === selectedSector)
  );
  
  const filteredStartups = startups.filter(startup => 
    (startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     startup.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === "all" || startup.sector === selectedSector)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <main className="flex-grow pt-28 md:pt-32 pb-20">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-20">
        <div className="container mx-auto px-4">
          {!user || !profile ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Join Our Network
                </h1>
                <p className="text-muted-foreground">
                  Connect with investors and innovative startups
                </p>
              </div>
              <NetworkRegistration onRegister={handleRegistration} />
            </div>
          ) : (
            <>
              <div className="mb-8 flex gap-4">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleUserProfileClick}>Profile</Button>
              </div>

              <Tabs defaultValue="investors">
                <TabsList>
                  <TabsTrigger value="investors">Investors</TabsTrigger>
                  <TabsTrigger value="startups">Startups</TabsTrigger>
                </TabsList>

                <TabsContent value="investors">
                  <div className="grid gap-4">
                    {filteredInvestors.map((investor) => (
                      <Card key={investor.id}>
                        <CardHeader>
                          <CardTitle>{investor.name}</CardTitle>
                          <CardDescription>{investor.company}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{investor.sector}</p>
                          <p>{investor.location}</p>
                          <p>{investor.investmentRange}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="startups">
                  <div className="grid gap-4">
                    {filteredStartups.map((startup) => (
                      <Card key={startup.id}>
                        <CardHeader>
                          <CardTitle>{startup.name}</CardTitle>
                          <CardDescription>{startup.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{startup.sector}</p>
                          <p>{startup.stage}</p>
                          <p>{startup.seeking}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkDirectory;
