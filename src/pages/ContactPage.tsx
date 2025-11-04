import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Calendar, Send, Building2, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'general' as 'lp' | 'gp' | 'general',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-inquiry', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. We'll get back to you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: 'general',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in learning more about Aries76.");
    window.open(`https://wa.me/447700000000?text=${message}`, '_blank');
  };

  const handleScheduleCall = () => {
    window.open('https://calendly.com/aries76', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
              Let's Start a
              <br />
              <span className="text-accent font-normal">Conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Whether you're a Limited Partner exploring opportunities, a General Partner seeking advisory, 
              or simply want to learn more about our services, we're here to help.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
          >
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
              <Mail className="h-8 w-8 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-medium text-foreground mb-2">Email Us</h3>
              <a 
                href="mailto:quinley.martini@aries76.com" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                quinley.martini@aries76.com
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
              <MessageSquare className="h-8 w-8 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-medium text-foreground mb-2">WhatsApp</h3>
              <button 
                onClick={handleWhatsApp}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Chat with us instantly
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
              <Calendar className="h-8 w-8 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-medium text-foreground mb-2">Schedule a Call</h3>
              <button 
                onClick={handleScheduleCall}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Book a meeting
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-light text-foreground mb-6">
                  Get in <span className="text-accent">Touch</span>
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Fill out the form and our team will review your inquiry. 
                  We typically respond within 24-48 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Office Address</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      Aries76 Ltd<br />
                      27 Old Gloucester Street<br />
                      London, WC1N 3AX<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email</h3>
                    <a 
                      href="mailto:quinley.martini@aries76.com"
                      className="text-muted-foreground font-light hover:text-accent transition-colors"
                    >
                      quinley.martini@aries76.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Building2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Services</h3>
                    <ul className="text-muted-foreground font-light space-y-1">
                      <li>• Limited Partner Services</li>
                      <li>• GP Capital Advisory</li>
                      <li>• Private Equity Funds</li>
                      <li>• Business Intelligence</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                <div>
                  <div className="text-3xl font-light text-accent mb-1">24h</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-accent mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Confidential</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+44 20 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Company name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType" className="text-foreground">
                    I'm interested in <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value: 'lp' | 'gp' | 'general') => 
                      setFormData({ ...formData, inquiryType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lp">Limited Partner Services</SelectItem>
                      <SelectItem value="gp">General Partner Advisory</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent/5 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Prefer a Different <span className="text-accent">Approach?</span>
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              Choose the communication method that works best for you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={handleScheduleCall}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Call
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWhatsApp}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <a href="mailto:quinley.martini@aries76.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Directly
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
