
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { User, Building, Upload, Briefcase } from 'lucide-react';

// Define schemas for the different profile types
const investorSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  email: z.string().email({ message: "Email non valida" }),
  company: z.string().min(2, { message: "Nome azienda richiesto" }),
  sector: z.string().min(2, { message: "Settore richiesto" }),
  location: z.string().min(2, { message: "Località richiesta" }),
  investmentRange: z.string().min(2, { message: "Range d'investimento richiesto" }),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
});

const startupSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  email: z.string().email({ message: "Email non valida" }),
  companyName: z.string().min(2, { message: "Nome startup richiesto" }),
  sector: z.string().min(2, { message: "Settore richiesto" }),
  stage: z.string().min(2, { message: "Fase di sviluppo richiesta" }),
  location: z.string().min(2, { message: "Località richiesta" }),
  seeking: z.string().min(2, { message: "Investimento cercato richiesto" }),
  description: z.string().min(10, { message: "Descrizione richiesta (min. 10 caratteri)" }),
  website: z.string().optional(),
});

type InvestorFormValues = z.infer<typeof investorSchema>;
type StartupFormValues = z.infer<typeof startupSchema>;

interface NetworkUser {
  name: string;
  email: string;
  type?: 'investor' | 'startup';
  profileComplete?: boolean;
  profileData?: any;
}

const UserProfile = () => {
  const [user, setUser] = useState<NetworkUser | null>(null);
  const [accountType, setAccountType] = useState<'investor' | 'startup'>('investor');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize investor form
  const investorForm = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      sector: '',
      location: '',
      investmentRange: '',
      bio: '',
      linkedin: '',
    }
  });

  // Initialize startup form
  const startupForm = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: '',
      email: '',
      companyName: '',
      sector: '',
      stage: '',
      location: '',
      seeking: '',
      description: '',
      website: '',
    }
  });

  // Load user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('networkUser');
    if (!storedUser) {
      // Redirect to network page if user is not registered
      navigate('/network');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as NetworkUser;
      setUser(parsedUser);
      
      // Set form defaults
      if (parsedUser.name && parsedUser.email) {
        investorForm.setValue('name', parsedUser.name);
        investorForm.setValue('email', parsedUser.email);
        startupForm.setValue('name', parsedUser.name);
        startupForm.setValue('email', parsedUser.email);
      }
      
      // If user already has profile data and type, load it
      if (parsedUser.type) {
        setAccountType(parsedUser.type);
      }
      
      if (parsedUser.profileData) {
        if (parsedUser.type === 'investor') {
          Object.keys(parsedUser.profileData).forEach(key => {
            if (key in investorForm.getValues()) {
              investorForm.setValue(key as any, parsedUser.profileData[key]);
            }
          });
          if (parsedUser.profileData.avatar) {
            setAvatarSrc(parsedUser.profileData.avatar);
          }
        } else {
          Object.keys(parsedUser.profileData).forEach(key => {
            if (key in startupForm.getValues()) {
              startupForm.setValue(key as any, parsedUser.profileData[key]);
            }
          });
          if (parsedUser.profileData.avatar) {
            setAvatarSrc(parsedUser.profileData.avatar);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/network');
    }
  }, [navigate]);

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value as 'investor' | 'startup');
  };

  const handleInvestorSubmit = (data: InvestorFormValues) => {
    setIsLoading(true);
    
    // Save data to localStorage
    try {
      const updatedUser: NetworkUser = {
        ...user!,
        type: 'investor',
        profileComplete: true,
        profileData: {
          ...data,
          avatar: avatarSrc
        }
      };
      
      localStorage.setItem('networkUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo investitore è stato salvato con successo.",
      });
      
      // Navigate back to network page after successful profile update
      navigate('/network');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Errore",
        description: "C'è stato un problema nel salvare il tuo profilo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartupSubmit = (data: StartupFormValues) => {
    setIsLoading(true);
    
    // Save data to localStorage
    try {
      const updatedUser: NetworkUser = {
        ...user!,
        type: 'startup',
        profileComplete: true,
        profileData: {
          ...data,
          avatar: avatarSrc
        }
      };
      
      localStorage.setItem('networkUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo startup è stato salvato con successo.",
      });
      
      // Navigate back to network page after successful profile update
      navigate('/network');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Errore",
        description: "C'è stato un problema nel salvare il tuo profilo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File troppo grande",
        description: "L'immagine deve essere inferiore a 5MB.",
        variant: "destructive",
      });
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-aries-navy">Il Tuo Profilo</CardTitle>
            <CardDescription>
              Completa il tuo profilo per connetterti con altri membri del network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                  <AvatarImage src={avatarSrc} alt={user.name} />
                  <AvatarFallback className="text-3xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload size={18} className="text-aries-navy" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <Alert className="mt-3 bg-aries-gray/20">
                  <AlertTitle className="text-sm">Seleziona il tipo di account</AlertTitle>
                  <AlertDescription className="text-xs">
                    Seleziona se sei un investitore o una startup per personalizzare il tuo profilo
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <Tabs 
              defaultValue={accountType} 
              className="w-full" 
              onValueChange={handleAccountTypeChange}
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="investor" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Investitore</span>
                </TabsTrigger>
                <TabsTrigger value="startup" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Startup</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="investor">
                <Form {...investorForm}>
                  <form onSubmit={investorForm.handleSubmit(handleInvestorSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={investorForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={investorForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={investorForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Società/Fondo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome della tua società" />
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
                            <FormLabel>Settore d'interesse</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. AI & Machine Learning, Fintech" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={investorForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Località</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. Milano, Italia" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={investorForm.control}
                        name="investmentRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Range d'investimento</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. €500K - €2M" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={investorForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio / Informazioni</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Breve descrizione della tua esperienza come investitore"
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={investorForm.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn (opzionale)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="URL del profilo LinkedIn" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvataggio..." : "Salva Profilo"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="startup">
                <Form {...startupForm}>
                  <form onSubmit={startupForm.handleSubmit(handleStartupSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={startupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={startupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={startupForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Startup</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome della startup" />
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
                            <FormLabel>Settore</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. AI & Data Analytics" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={startupForm.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fase</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. Seed, Series A" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={startupForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Località</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="es. Roma, Italia" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={startupForm.control}
                      name="seeking"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investimento Cercato</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. €750K" />
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
                          <FormLabel>Descrizione</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Descrizione del prodotto o servizio della startup"
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={startupForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sito web (opzionale)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="URL del sito web" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvataggio..." : "Salva Profilo"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/network')}>
              Torna al Network
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
