import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const areasOfInterest = [
  "Private Equity",
  "Private Credit",
  "Infrastructure",
  "Real Assets",
  "Venture Capital",
  "Co-Investment",
  "Secondary Market",
  "Other",
];

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  organization: z.string().min(1, "Organization is required").max(200),
  role: z.string().max(100).optional(),
  jurisdiction: z.string().max(100).optional(),
  investorType: z.string().min(1, "Please select an investor type"),
  areasOfInterest: z.array(z.string()).min(1, "Select at least one area of interest"),
  message: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LPRegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organization: "",
      role: "",
      jurisdiction: "",
      investorType: "",
      areasOfInterest: [],
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Insert LP registration
      const { error: lpError } = await supabase.from("lp_registrations").insert({
        full_name: data.fullName,
        email: data.email,
        organization: data.organization,
        role: data.role || null,
        jurisdiction: data.jurisdiction || null,
        investor_type: data.investorType,
        areas_of_interest: data.areasOfInterest,
        message: data.message || null,
        status: "new",
      });

      if (lpError) throw lpError;

      // Send confirmation email via edge function
      try {
        await supabase.functions.invoke("send-lp-request", {
          body: {
            fullName: data.fullName,
            email: data.email,
            organization: data.organization,
            role: data.role,
            jurisdiction: data.jurisdiction,
            investorType: data.investorType,
            areasOfInterest: data.areasOfInterest,
            message: data.message,
          },
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the registration if email fails
      }

      toast.success("Registration successful! We will contact you shortly.");
      form.reset();
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting LP registration:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Limited Partner <span className="text-accent">Registration</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Register to access exclusive investment opportunities, private equity funds, and connect with qualified General Partners
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-light">
              LP Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization */}
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Organization *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your organization"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., CIO, Partner"
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jurisdiction */}
                  <FormField
                    control={form.control}
                    name="jurisdiction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Jurisdiction</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., UK, US, EU"
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Investor Type */}
                <FormField
                  control={form.control}
                  name="investorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Investor Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select investor type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="institutional">Institutional Investor</SelectItem>
                          <SelectItem value="pension">Pension Fund</SelectItem>
                          <SelectItem value="family">Family Office</SelectItem>
                          <SelectItem value="hnwi">HNWI</SelectItem>
                          <SelectItem value="fund">Fund of Funds</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Areas of Interest */}
                <FormField
                  control={form.control}
                  name="areasOfInterest"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-white">Areas of Interest *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {areasOfInterest.map((area) => (
                          <FormField
                            key={area}
                            control={form.control}
                            name="areasOfInterest"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, area])
                                        : field.onChange(field.value?.filter((value) => value !== area));
                                    }}
                                    className="border-white/30"
                                  />
                                </FormControl>
                                <FormLabel className="text-white/80 font-normal cursor-pointer">
                                  {area}
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

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Additional Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your investment interests..."
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default LPRegistrationPage;
