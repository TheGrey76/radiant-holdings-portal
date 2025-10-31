import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define schemas for the different profile types
const investorSchema = z.object({
  company: z.string().min(2, { message: "Company name is required" }),
  sector: z.string().min(2, { message: "Sector is required" }),
  investmentRange: z.string().optional(),
  investmentStage: z.string().optional(),
  portfolioSize: z.string().optional(),
  geographicFocus: z.string().optional(),
  linkedin: z.string().optional(),
  description: z.string().optional(),
});

const startupSchema = z.object({
  company: z.string().min(2, { message: "Company name is required" }),
  sector: z.string().min(2, { message: "Sector is required" }),
  fundingStage: z.string().optional(),
  fundingAmount: z.string().optional(),
  revenue: z.string().optional(),
  teamSize: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  description: z.string().optional(),
  pitchDeck: z.string().optional(),
});

type InvestorFormValues = z.infer<typeof investorSchema>;
type StartupFormValues = z.infer<typeof startupSchema>;

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accountType, setAccountType] = useState<'investor' | 'startup'>('investor');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const investorForm = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      company: "",
      sector: "",
      investmentRange: "",
      investmentStage: "",
      portfolioSize: "",
      geographicFocus: "",
      linkedin: "",
      description: "",
    }
  });

  const startupForm = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      company: "",
      sector: "",
      fundingStage: "",
      fundingAmount: "",
      revenue: "",
      teamSize: "",
      website: "",
      linkedin: "",
      description: "",
      pitchDeck: "",
    }
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          navigate('/network');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        navigate('/network');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('network_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data);
      const type = data.account_type === 'startup' ? 'startup' : 'investor';
      setAccountType(type);
      setAvatarSrc(data.avatar_url || "");
      
      // Populate form with existing data
      if (data.account_type === 'investor') {
        investorForm.reset({
          company: data.company || "",
          sector: data.sector || "",
          investmentRange: data.investment_range || "",
          investmentStage: data.investment_stage || "",
          portfolioSize: data.portfolio_size || "",
          geographicFocus: data.geographic_focus || "",
          linkedin: data.linkedin || "",
          description: data.description || "",
        });
      } else {
        startupForm.reset({
          company: data.company || "",
          sector: data.sector || "",
          fundingStage: data.funding_stage || "",
          fundingAmount: data.funding_amount || "",
          revenue: data.revenue || "",
          teamSize: data.team_size || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          description: data.description || "",
          pitchDeck: data.pitch_deck || "",
        });
      }
    }
    setLoading(false);
  };

  const handleAccountTypeChange = async (value: string) => {
    if (!user || (value !== 'investor' && value !== 'startup')) return;
    
    const newType = value as 'investor' | 'startup';
    setAccountType(newType);
    
    // Update account type in database
    try {
      const { error } = await supabase
        .from('network_profiles')
        .update({ account_type: newType })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (profile) {
        setProfile({ ...profile, account_type: newType });
      }
    } catch (error) {
      console.error("Error updating account type:", error);
      toast.error("Failed to update account type");
    }
  };

  const handleInvestorSubmit = async (data: InvestorFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('network_profiles')
        .update({
          account_type: 'investor',
          company: data.company,
          sector: data.sector,
          investment_range: data.investmentRange,
          investment_stage: data.investmentStage,
          portfolio_size: data.portfolioSize,
          geographic_focus: data.geographicFocus,
          linkedin: data.linkedin,
          description: data.description,
          avatar_url: avatarSrc,
          profile_complete: true,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile saved successfully!");
      navigate('/network');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartupSubmit = async (data: StartupFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('network_profiles')
        .update({
          account_type: 'startup',
          company: data.company,
          sector: data.sector,
          funding_stage: data.fundingStage,
          funding_amount: data.fundingAmount,
          revenue: data.revenue,
          team_size: data.teamSize,
          website: data.website,
          linkedin: data.linkedin,
          description: data.description,
          pitch_deck: data.pitchDeck,
          avatar_url: avatarSrc,
          profile_complete: true,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile saved successfully!");
      navigate('/network');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/network')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Network
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                <Upload className="h-4 w-4" />
                Upload Avatar
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Fill in your details to connect with the network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={accountType} onValueChange={handleAccountTypeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="investor">Investor</TabsTrigger>
              <TabsTrigger value="startup">Startup</TabsTrigger>
            </TabsList>

            <TabsContent value="investor">
              <Form {...investorForm}>
                <form onSubmit={investorForm.handleSubmit(handleInvestorSubmit)} className="space-y-4">
                  <FormField
                    control={investorForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={investorForm.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={investorForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="startup">
              <Form {...startupForm}>
                <form onSubmit={startupForm.handleSubmit(handleStartupSubmit)} className="space-y-4">
                  <FormField
                    control={startupForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={startupForm.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={startupForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
