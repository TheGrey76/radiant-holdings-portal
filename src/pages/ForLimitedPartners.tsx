import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Calendar, Shield, Users, TrendingUp, Target, CheckCircle, FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForLimitedPartners = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Document access form state
  const [documentAccess, setDocumentAccess] = useState({
    isProfessional: false,
    organization: '',
    jurisdiction: '',
  });

  // Interest expression form state
  const [interestForm, setInterestForm] = useState({
    fullName: '',
    organization: '',
    role: '',
    jurisdiction: '',
    selectedDeal: '',
    commitmentRange: '',
    timeline: '',
  });

  // LP Contact form state
  const [lpContactForm, setLpContactForm] = useState({
    fullName: '',
    organization: '',
    role: '',
    jurisdiction: '',
    investorType: '',
    areasOfInterest: [] as string[],
    message: '',
  });

  const handleDocumentAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentAccess.isProfessional) {
      toast({
        title: "Professional status required",
        description: "You must confirm professional investor status to access documents.",
        variant: "destructive",
      });
      return;
    }
    if (!documentAccess.organization || !documentAccess.jurisdiction) {
      toast({
        title: "Information required",
        description: "Please provide your organization and jurisdiction.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Access granted",
      description: "You now have access to the document library.",
    });
  };

  const handleExpressInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send to an edge function
      toast({
        title: "Interest submitted",
        description: "Thank you for your non-binding expression of interest. We will contact you shortly.",
      });
      
      setInterestForm({
        fullName: '',
        organization: '',
        role: '',
        jurisdiction: '',
        selectedDeal: '',
        commitmentRange: '',
        timeline: '',
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLPContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send to an edge function
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We will contact you shortly for a confidential discussion.",
      });
      
      setLpContactForm({
        fullName: '',
        organization: '',
        role: '',
        jurisdiction: '',
        investorType: '',
        areasOfInterest: [],
        message: '',
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-5 z-0" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight uppercase">
              For Limited Partners &<br />
              <span className="text-accent">Professional Investors</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto">
              Independent private markets advisory for a select group of GPs and institutional investors.
            </p>
            
            <p className="text-lg text-white/80 font-light max-w-4xl mx-auto mb-10 leading-relaxed">
              Aries76 is an independent advisory firm supporting a curated set of General Partners and sponsors in their capital formation. We work with professional investors – including family offices, private banks, wealth managers and institutional LPs – to provide access to selected private markets strategies and bespoke opportunities, always with a long-term partnership mindset.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white"
                asChild
              >
                <a href="mailto:quinley.martini@aries76.com?subject=GP Information Request">
                  <Mail className="mr-2 h-5 w-5" />
                  Request GP information pack
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <a href="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a call
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 tracking-tight">
              Who we work with
            </h2>
            
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-4xl">
              Aries76 exclusively engages with professional and institutional investors: family offices, multi-family offices, private banks, wealth managers, independent advisory firms, pension funds, insurance companies and other institutional LPs. We introduce strategies and managers that fit the LP's mandate, risk appetite and governance framework. Aries76 does not operate as a retail distributor and focuses on building long-term relationships with sophisticated investors who appreciate our independent, transparent approach to private markets access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How We Work With LPs Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-12 tracking-tight">
              How we work with Limited Partners
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Users className="h-10 w-10 text-accent mb-4" strokeWidth={1.5} />
                  <CardTitle className="text-xl font-light">Curated access to selected GPs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    We work with a limited number of mandates to ensure quality and deep knowledge. Our focus is on team excellence, strategy clarity, and alignment of interests. We prioritise GPs who share our values of transparency and long-term value creation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Shield className="h-10 w-10 text-accent mb-4" strokeWidth={1.5} />
                  <CardTitle className="text-xl font-light">Transparent information and due diligence support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    We provide structured information packs, facilitate management access, and support your internal due diligence process. Investment decisions always remain with the LP. We believe in complete transparency and full disclosure of all relevant information.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Target className="h-10 w-10 text-accent mb-4" strokeWidth={1.5} />
                  <CardTitle className="text-xl font-light">Flexible formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    We offer access through primary fund commitments, co-investments and club deals, as well as bespoke or structured solutions tailored to specific LP requirements. All opportunities are restricted to professional investors and subject to regulatory compliance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected GP Relationships Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Selected GP relationships and mandates
            </h2>
            
            <p className="text-lg text-muted-foreground font-light mb-8 max-w-4xl">
              This is a high-level snapshot of the types of strategies we work with. Detailed information is available on request, subject to eligibility verification and confidentiality requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-light">European Private Equity – Sector Specialists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    Established European PE teams with deep sector expertise in healthcare, technology, and industrial sectors. Track records of 10+ years, typically targeting €50-250m fund sizes with a focus on value creation and operational excellence.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-light">Thematic & Niche Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    Specialised mandates in impact investing, digital infrastructure, and life sciences. These strategies offer differentiated exposure and align with specific LP thematic requirements, combining commercial returns with measurable impact or technological innovation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-light">Bespoke / Single-Asset Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-light">
                    Tailored investment vehicles for specific assets or platforms, designed for LPs seeking concentrated exposure with customised governance and liquidity terms. These opportunities are typically structured on a case-by-case basis to meet precise investor requirements.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-900 dark:text-amber-200 font-light">
                <strong className="font-medium">Compliance Note:</strong> Details of individual funds, vehicles and sponsors are provided only to verified professional investors and may require the execution of a non-disclosure agreement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation & Digital Interest Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Documentation and digital interest
            </h2>
            
            <p className="text-lg text-muted-foreground font-light mb-8 max-w-4xl">
              Professional investors can access marketing materials and high-level documentation for selected mandates, and can digitally signal a first, non-binding interest.
            </p>
          </motion.div>

          {/* Document Access Gate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-light">Access Document Library</CardTitle>
                <CardDescription>
                  Please confirm your professional investor status to access fund documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDocumentAccess} className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="professional"
                      checked={documentAccess.isProfessional}
                      onCheckedChange={(checked) => 
                        setDocumentAccess({ ...documentAccess, isProfessional: checked as boolean })
                      }
                    />
                    <Label htmlFor="professional" className="font-light text-sm leading-relaxed cursor-pointer">
                      I confirm that I am a professional / qualified investor in my jurisdiction and understand that the materials available are not suitable for retail investors.
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="org">Organisation</Label>
                      <Input
                        id="org"
                        placeholder="Your organisation name"
                        value={documentAccess.organization}
                        onChange={(e) => setDocumentAccess({ ...documentAccess, organization: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Input
                        id="jurisdiction"
                        placeholder="Your jurisdiction"
                        value={documentAccess.jurisdiction}
                        onChange={(e) => setDocumentAccess({ ...documentAccess, jurisdiction: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    <FileText className="mr-2 h-4 w-4" />
                    Access Documents
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sample Document Library (shown after access granted) */}
          {documentAccess.isProfessional && documentAccess.organization && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-light">Available Documentation</CardTitle>
                  <CardDescription>
                    Select documents are available for download. Additional materials may require NDA execution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">European Healthcare Fund III - Teaser</h4>
                        <p className="text-sm text-muted-foreground">General overview and strategy presentation</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Digital Infrastructure Platform - Factsheet</h4>
                        <p className="text-sm text-muted-foreground">Key metrics and investment thesis</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Generic Commitment Letter Template</h4>
                        <p className="text-sm text-muted-foreground">Non-binding indication of interest template</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Express Interest Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-light">Express Non-Binding Interest</CardTitle>
                <CardDescription>
                  Submit a digital indication of interest for selected opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpressInterest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="interest-name">Full Name</Label>
                      <Input
                        id="interest-name"
                        value={interestForm.fullName}
                        onChange={(e) => setInterestForm({ ...interestForm, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest-org">Organisation</Label>
                      <Input
                        id="interest-org"
                        value={interestForm.organization}
                        onChange={(e) => setInterestForm({ ...interestForm, organization: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest-role">Role</Label>
                      <Input
                        id="interest-role"
                        value={interestForm.role}
                        onChange={(e) => setInterestForm({ ...interestForm, role: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest-jurisdiction">Jurisdiction</Label>
                      <Input
                        id="interest-jurisdiction"
                        value={interestForm.jurisdiction}
                        onChange={(e) => setInterestForm({ ...interestForm, jurisdiction: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selected-deal">Selected GP / Fund / Deal</Label>
                      <Select
                        value={interestForm.selectedDeal}
                        onValueChange={(value) => setInterestForm({ ...interestForm, selectedDeal: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select opportunity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare-fund-iii">European Healthcare Fund III</SelectItem>
                          <SelectItem value="digital-infra">Digital Infrastructure Platform</SelectItem>
                          <SelectItem value="impact-fund">Impact Fund II</SelectItem>
                          <SelectItem value="other">Other / General Interest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commitment-range">Indicative Commitment Range</Label>
                      <Select
                        value={interestForm.commitmentRange}
                        onValueChange={(value) => setInterestForm({ ...interestForm, commitmentRange: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3m">€1–3m</SelectItem>
                          <SelectItem value="3-5m">€3–5m</SelectItem>
                          <SelectItem value="5-10m">€5–10m</SelectItem>
                          <SelectItem value="10m+">€10m+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="timeline">Indicative Timeline</Label>
                      <Select
                        value={interestForm.timeline}
                        onValueChange={(value) => setInterestForm({ ...interestForm, timeline: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="next-3-months">Next 3 months</SelectItem>
                          <SelectItem value="next-6-months">Next 6 months</SelectItem>
                          <SelectItem value="next-12-months">Next 12 months</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-light">
                      <strong className="font-medium">Important:</strong> This is a non-binding expression of interest and does not constitute a subscription or legally binding commitment. Aries76 will review your indication and contact you with next steps.
                    </p>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why LPs Work With Aries76 Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-12 tracking-tight">
              Why Limited Partners work with Aries76
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-foreground mb-2">Independent advisory mindset</h3>
                  <p className="text-muted-foreground font-light">
                    We act as an independent advisor, not as a captive distributor. Our recommendations are based solely on fit with your investment criteria, not on tied relationships or proprietary products. We maintain complete transparency about our mandates and fee structures.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-foreground mb-2">Deep private markets experience</h3>
                  <p className="text-muted-foreground font-light">
                    Our team brings decades of combined experience in private equity, fundraising, and institutional asset management. We understand LP workflows, governance requirements, and the complexities of private markets investing across different jurisdictions.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-foreground mb-2">Data- and AI-enhanced insight</h3>
                  <p className="text-muted-foreground font-light">
                    We leverage our proprietary AIRES platform and data analytics to provide enhanced market intelligence, LP targeting insights, and performance benchmarking. This technology-enabled approach complements our human expertise and relationship management.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-foreground mb-2">Long-term partnership approach</h3>
                  <p className="text-muted-foreground font-light">
                    We build lasting relationships with our LP partners, understanding their evolving strategies and supporting them across multiple fund cycles. Our success is measured by the quality and longevity of these partnerships, not by transaction volume.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LP Access and Next Steps Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-tight text-center">
              LP access and next steps
            </h2>
            
            <p className="text-lg text-muted-foreground font-light text-center mb-12 max-w-3xl mx-auto">
              We invite professional investors to contact us for a confidential discussion about how we can align selected private markets opportunities with your investment strategy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-light">Contact Us</CardTitle>
                <CardDescription>
                  Submit your details for a confidential discussion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLPContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lp-name">Full Name</Label>
                      <Input
                        id="lp-name"
                        value={lpContactForm.fullName}
                        onChange={(e) => setLpContactForm({ ...lpContactForm, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lp-org">Organisation</Label>
                      <Input
                        id="lp-org"
                        value={lpContactForm.organization}
                        onChange={(e) => setLpContactForm({ ...lpContactForm, organization: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lp-role">Role</Label>
                      <Input
                        id="lp-role"
                        value={lpContactForm.role}
                        onChange={(e) => setLpContactForm({ ...lpContactForm, role: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lp-jurisdiction">Jurisdiction</Label>
                      <Input
                        id="lp-jurisdiction"
                        value={lpContactForm.jurisdiction}
                        onChange={(e) => setLpContactForm({ ...lpContactForm, jurisdiction: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investor-type">Type of Investor</Label>
                      <Select
                        value={lpContactForm.investorType}
                        onValueChange={(value) => setLpContactForm({ ...lpContactForm, investorType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family-office">Family Office</SelectItem>
                          <SelectItem value="private-bank">Private Bank</SelectItem>
                          <SelectItem value="wealth-manager">Wealth Manager</SelectItem>
                          <SelectItem value="institutional">Institutional</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Main Areas of Interest</Label>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="pe-funds"
                            checked={lpContactForm.areasOfInterest.includes('pe-funds')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: [...lpContactForm.areasOfInterest, 'pe-funds'] 
                                });
                              } else {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: lpContactForm.areasOfInterest.filter(i => i !== 'pe-funds') 
                                });
                              }
                            }}
                          />
                          <Label htmlFor="pe-funds" className="font-light cursor-pointer">Private equity funds</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="co-invest"
                            checked={lpContactForm.areasOfInterest.includes('co-invest')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: [...lpContactForm.areasOfInterest, 'co-invest'] 
                                });
                              } else {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: lpContactForm.areasOfInterest.filter(i => i !== 'co-invest') 
                                });
                              }
                            }}
                          />
                          <Label htmlFor="co-invest" className="font-light cursor-pointer">Co-investments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="structured"
                            checked={lpContactForm.areasOfInterest.includes('structured')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: [...lpContactForm.areasOfInterest, 'structured'] 
                                });
                              } else {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: lpContactForm.areasOfInterest.filter(i => i !== 'structured') 
                                });
                              }
                            }}
                          />
                          <Label htmlFor="structured" className="font-light cursor-pointer">Structured solutions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="other-interest"
                            checked={lpContactForm.areasOfInterest.includes('other')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: [...lpContactForm.areasOfInterest, 'other'] 
                                });
                              } else {
                                setLpContactForm({ 
                                  ...lpContactForm, 
                                  areasOfInterest: lpContactForm.areasOfInterest.filter(i => i !== 'other') 
                                });
                              }
                            }}
                          />
                          <Label htmlFor="other-interest" className="font-light cursor-pointer">Other</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lp-message">Message (Optional)</Label>
                      <Textarea
                        id="lp-message"
                        placeholder="Please share any specific requirements or questions..."
                        value={lpContactForm.message}
                        onChange={(e) => setLpContactForm({ ...lpContactForm, message: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground font-light">
                      <strong className="font-medium">Disclaimer:</strong> The information on this page is for professional investors only and does not constitute investment advice, an offer or solicitation to invest in any security or financial instrument. Any opportunity introduced by Aries76 will be subject to its own documentation, risk factors and regulatory restrictions.
                    </p>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                    <Mail className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ForLimitedPartners;
