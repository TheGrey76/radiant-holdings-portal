import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const strategies = [
  "Private Equity",
  "Private Credit",
  "Infrastructure",
  "Real Assets",
  "Venture Capital",
  "Other",
];

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  firmName: z.string().min(1, "Firm name is required").max(200),
  firmWebsite: z.string()
    .transform((val) => val.trim())
    .refine(
      (val) => {
        if (!val) return true; // Empty is valid
        // Add https:// if no protocol specified
        const urlToTest = val.match(/^https?:\/\//) ? val : `https://${val}`;
        try {
          new URL(urlToTest);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL (e.g., example.com or https://example.com)" }
    )
    .optional()
    .or(z.literal("")),
  workEmail: z.string().email("Invalid email address").max(255),
  aumBracket: z.string().min(1, "Please select an AUM bracket"),
  primaryStrategy: z.array(z.string()).min(1, "Select at least one strategy"),
  mainFundInMarket: z.string().max(200).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface GPRegistrationFormProps {
  onSuccess: () => void;
}

const GPRegistrationForm = ({ onSuccess }: GPRegistrationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      firmName: "",
      firmWebsite: "",
      workEmail: "",
      aumBracket: "",
      primaryStrategy: [],
      mainFundInMarket: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (isLogin) {
        // Login existing user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.workEmail,
          password: data.password,
        });

        if (authError) {
          if (authError.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. If you just registered, please check your email to confirm your account first.");
          } else if (authError.message.includes("Email not confirmed")) {
            toast.error("Please confirm your email address before logging in. Check your inbox for the confirmation link.");
          } else {
            toast.error(authError.message);
          }
          return;
        }

        // Check if user has GP registration
        const { data: gpData, error: gpError } = await supabase
          .from("gp_registrations")
          .select("*")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (!gpData) {
          toast.error("No GP registration found for this account");
          return;
        }

        toast.success("Successfully logged in!");
        onSuccess();
      } else {
        // Register new user - first create auth account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.workEmail,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/gp-fundraising-economics`,
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
            }
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("User creation failed");

        // Create GP registration immediately (don't wait for email confirmation)
        const { error: insertError } = await supabase.from("gp_registrations").insert({
          user_id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          firm_name: data.firmName,
          firm_website: data.firmWebsite || null,
          work_email: data.workEmail,
          aum_bracket: data.aumBracket,
          primary_strategy: data.primaryStrategy,
          main_fund_in_market: data.mainFundInMarket || null,
        });

        if (insertError) throw insertError;

        // Send welcome email (non-blocking)
        supabase.functions.invoke('send-gp-confirmation', {
          body: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.workEmail,
            firmName: data.firmName,
          }
        }).catch(err => console.error("Email send error:", err));

        toast.success("Registration successful! Welcome to GP Capital Advisory.");
        onSuccess();
      }
    } catch (error: any) {
      console.error("Registration/Login error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show email verification pending screen
  if (pendingVerification) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-muted-foreground mb-4">
            We've sent a verification email to:
          </p>
          <p className="font-semibold text-lg mb-6">{registeredEmail}</p>
          <p className="text-muted-foreground mb-4">
            Please click the verification link in the email to complete your registration and access the GP Fundraising Economics content.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => {
                setPendingVerification(false);
                setRegisteredEmail("");
              }}
              className="text-primary hover:underline"
            >
              try registering again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isLogin ? "Login" : "GP Registration"}
        </h2>
        <p className="text-muted-foreground">
          {isLogin
            ? "Sign in to access the GP Fundraising Economics"
            : "Register to access exclusive GP content"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Managing Partner, CFO" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firmWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm Website (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="example.com or https://example.com" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="workEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isLogin && (
            <>
              <FormField
                control={form.control}
                name="aumBracket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AUM Bracket *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AUM bracket" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="< €250m">{"< €250m"}</SelectItem>
                        <SelectItem value="€250m–€1bn">€250m–€1bn</SelectItem>
                        <SelectItem value="> €1bn">{"> €1bn"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryStrategy"
                render={() => (
                  <FormItem>
                    <FormLabel>Primary Strategy *</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {strategies.map((strategy) => (
                        <FormField
                          key={strategy}
                          control={form.control}
                          name="primaryStrategy"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(strategy)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    return checked
                                      ? field.onChange([...value, strategy])
                                      : field.onChange(
                                          value.filter((val) => val !== strategy)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {strategy}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mainFundInMarket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Fund in Market</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Fund IV" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Login" : "Register"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GPRegistrationForm;