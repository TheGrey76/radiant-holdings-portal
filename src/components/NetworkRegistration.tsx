
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback for missing env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
let supabase = null;

// Only create the Supabase client if both URL and key are available
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase credentials not found. Running in local storage mode only.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface NetworkRegistrationProps {
  onRegister: (data: FormValues) => void;
}

const NetworkRegistration = ({ onRegister }: NetworkRegistrationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Always store user data in localStorage (will work even if Supabase is unavailable)
      localStorage.setItem('networkUser', JSON.stringify(data));
      
      // If Supabase is available, use it
      let emailSent = false;
      let dbSaved = false;
      
      if (supabase) {
        try {
          console.log("Attempting to save to Supabase database...");
          
          // Check if 'network_registrations' table exists
          const { data: tableExists, error: tableCheckError } = await supabase
            .from('network_registrations')
            .select('count')
            .limit(1)
            .single();
            
          if (tableCheckError && tableCheckError.code === '42P01') {
            console.error("Table 'network_registrations' does not exist. Please create it in your Supabase dashboard.");
            toast({
              title: "Database setup required",
              description: "The 'network_registrations' table doesn't exist in your Supabase project. Check the console for details.",
              variant: "destructive",
            });
          } else {
            // Store data in Supabase
            const { error } = await supabase
              .from('network_registrations')
              .insert([
                { 
                  name: data.name, 
                  email: data.email,
                  recipient_email: 'quinley.martini@aries76.com' 
                }
              ]);
            
            if (error) {
              console.error("Supabase insert error:", error);
              toast({
                title: "Database error",
                description: "Failed to save your registration to our database. Please try again.",
                variant: "destructive",
              });
            } else {
              console.log("Successfully saved to Supabase database");
              dbSaved = true;
              
              // If insert was successful, try to invoke the function
              console.log("Attempting to send email via Edge Function...");
              try {
                // Check if the function exists
                const { data: functions } = await supabase.functions.list();
                const emailFunctionExists = functions.some(f => f.name === 'send-registration-email');
                
                if (!emailFunctionExists) {
                  console.error("The 'send-registration-email' Edge Function does not exist in your Supabase project.");
                  toast({
                    title: "Email function not found",
                    description: "The email sending function is not set up in your Supabase project.",
                    variant: "warning",
                  });
                } else {
                  // Trigger Edge Function to send email
                  const { data: emailData, error: emailError } = await supabase.functions.invoke('send-registration-email', {
                    body: {
                      name: data.name,
                      email: data.email,
                      to: 'quinley.martini@aries76.com',
                      subject: 'New Network Registration'
                    }
                  });
                  
                  if (emailError) {
                    console.error("Email sending error:", emailError);
                    toast({
                      title: "Email not sent",
                      description: "There was an issue sending the notification email.",
                      variant: "warning",
                    });
                  } else {
                    console.log("Email function response:", emailData);
                    emailSent = true;
                  }
                }
              } catch (functionError) {
                console.error("Error calling edge function:", functionError);
              }
            }
          }
        } catch (supabaseError) {
          console.error("Supabase error:", supabaseError);
          // Continue with local functionality
        }
      } else {
        console.log("Running in localStorage mode. Registration data:", data);
        console.log("Would send email to quinley.martini@aries76.com");
        
        toast({
          title: "Running in local mode",
          description: "Supabase connection not configured. Your data is saved locally only.",
          variant: "warning",
        });
      }
      
      // Show appropriate success message based on what succeeded
      if (emailSent && dbSaved) {
        toast({
          title: "Registration successful!",
          description: "Your information has been saved and an email sent to quinley.martini@aries76.com",
        });
      } else if (dbSaved) {
        toast({
          title: "Registration saved",
          description: "Your information has been saved, but there was an issue sending the email notification.",
        });
      } else {
        toast({
          title: "Registration received",
          description: "Your information has been saved locally.",
        });
      }
      
      onRegister(data);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-smooth p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-aries-gray rounded-full mb-4">
            <Mail className="w-7 h-7 text-aries-navy" />
          </div>
          <h2 className="text-2xl font-bold text-aries-navy mb-2">Network Registration</h2>
          <p className="text-gray-600">
            Join the Aries76 network to connect with investors and startups
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input placeholder="Enter your name" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input placeholder="Enter your email" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Join Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default NetworkRegistration;
