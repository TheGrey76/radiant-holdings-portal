
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
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().min(2, { message: "Company name is required" }),
  sector: z.string().min(2, { message: "Sector is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  investmentRange: z.string().min(2, { message: "Investment range is required" }),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
});

const startupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  companyName: z.string().min(2, { message: "Startup name is required" }),
  sector: z.string().min(2, { message: "Sector is required" }),
  stage: z.string().min(2, { message: "Development stage is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  seeking: z.string().min(2, { message: "Investment sought is required" }),
  description: z.string().min(10, { message: "Description is required (min. 10 characters)" }),
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
        title: "Profile Updated",
        description: "Your investor profile has been successfully saved.",
      });
      
      // Navigate back to network page after successful profile update
      navigate('/network');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your profile.",
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
        title: "Profile Updated",
        description: "Your startup profile has been successfully saved.",
      });
      
      // Navigate back to network page after successful profile update
      navigate('/network');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your profile.",
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
        title: "File too large",
        description: "Image must be less than 5MB.",
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-indigo-100">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-indigo-800">Your Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Complete your profile to connect with other network members
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                  <AvatarImage src={avatarSrc} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-indigo-200 text-indigo-700">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload size={18} className="text-indigo-700" />
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
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <Alert className="mt-3 bg-indigo-50 border border-indigo-200">
                  <AlertTitle className="text-sm font-medium text-indigo-700">Select account type</AlertTitle>
                  <AlertDescription className="text-xs text-indigo-600">
                    Choose whether you're an investor or a startup to customize your profile
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <Tabs 
              defaultValue={accountType} 
              className="w-full" 
              onValueChange={handleAccountTypeChange}
            >
              <TabsList className="grid grid-cols-2 mb-8 bg-indigo-50">
                <TabsTrigger value="investor" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Investor</span>
                </TabsTrigger>
                <TabsTrigger value="startup" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Startup</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="investor">
                <Form {...investorForm}>
                  <form onSubmit={investorForm.handleSubmit(handleInvestorSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={investorForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly className="bg-gray-50" />
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
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" readOnly className="bg-gray-50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={investorForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Company/Fund</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your company name" />
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
                            <FormLabel className="text-gray-700">Sectors of Interest</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., AI & Machine Learning, Fintech" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={investorForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., London, UK" />
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
                            <FormLabel className="text-gray-700">Investment Range</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., $500K - $2M" />
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
                          <FormLabel className="text-gray-700">Bio / Information</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Brief description of your experience as an investor"
                              className="min-h-[150px] resize-none"
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
                          <FormLabel className="text-gray-700">LinkedIn (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="LinkedIn profile URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700" 
                        size="lg" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="startup">
                <Form {...startupForm}>
                  <form onSubmit={startupForm.handleSubmit(handleStartupSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={startupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly className="bg-gray-50" />
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
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" readOnly className="bg-gray-50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={startupForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Startup Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Name of your startup" />
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
                            <FormLabel className="text-gray-700">Sector</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., AI & Data Analytics" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={startupForm.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Stage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Seed, Series A" />
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
                            <FormLabel className="text-gray-700">Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Berlin, Germany" />
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
                          <FormLabel className="text-gray-700">Investment Sought</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., $750K" />
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
                          <FormLabel className="text-gray-700">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Description of your startup's product or service"
                              className="min-h-[150px] resize-none"
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
                          <FormLabel className="text-gray-700">Website (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Website URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700" 
                        size="lg" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-b-lg">
            <Button variant="outline" onClick={() => navigate('/network')} className="border-indigo-200 text-indigo-700 hover:bg-indigo-100">
              Back to Network
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
