import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, TrendingUp, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FundraisingReadiness = () => {
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showReportRequest, setShowReportRequest] = useState(false);
  const { toast } = useToast();

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request sent",
      description: "We'll contact you shortly to discuss your assessment.",
    });
    setShowAssessmentForm(false);
  };

  const handleReportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request sent",
      description: "You'll receive a sample report via email.",
    });
    setShowReportRequest(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fundraising Readiness & Probability Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A proprietary model to estimate fundraising probability and identify areas for improvement before going to market
          </p>
        </motion.div>

        {/* Three Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Startup Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Startup</CardTitle>
                <CardDescription>Assessment for seed and Series A rounds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What we analyze</h4>
                  <p className="text-sm text-muted-foreground">
                    Team, product/MVP, traction, TAM/SAM market, competition, business model, pitch materials
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What you receive</h4>
                  <p className="text-sm text-muted-foreground">
                    Report with 0-100 scoring, industry benchmark, gap analysis, prioritized recommendations
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-muted-foreground">5-7 business days</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Price</h4>
                  <p className="text-2xl font-bold text-primary">€2,500 - €5,000</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on complexity</p>
                </div>
              </CardContent>
            </Card>

            {/* VC Funds Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors md:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">VC Funds</CardTitle>
                <CardDescription>Assessment for venture capital funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What we analyze</h4>
                  <p className="text-sm text-muted-foreground">
                    GP track record, strategy, pipeline/portfolio, governance, marketing materials, compliance, LP positioning
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What you receive</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed report with scoring, competitive analysis, critical gaps, operational roadmap, LP feedback preview
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-muted-foreground">10-14 business days</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Price</h4>
                  <p className="text-2xl font-bold text-primary">€7,500 - €15,000</p>
                  <p className="text-xs text-muted-foreground mt-1">Target size and complexity</p>
                </div>
              </CardContent>
            </Card>

            {/* PE/Alternatives Card */}
            <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">PE / Alternatives</CardTitle>
                <CardDescription>Assessment for PE and alternative funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What we analyze</h4>
                  <p className="text-sm text-muted-foreground">
                    GP track record, investment thesis strategy, pipeline/portfolio, governance, ESG, DDQ materials, regulatory compliance
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What you receive</h4>
                  <p className="text-sm text-muted-foreground">
                    Executive report with scoring, positioning analysis, gap analysis, roadmap, institutional feedback simulation
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-muted-foreground">14-21 business days</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Price</h4>
                  <p className="text-2xl font-bold text-primary">€10,000 - €20,000</p>
                  <p className="text-xs text-muted-foreground mt-1">Target AUM and sector</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Metodologia Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Assessment Methodology</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our proprietary model analyzes five key dimensions, each weighted according to the specific segment
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Startup Weights */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Startup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team & Execution</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Prodotto & Traction</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mercato & Timing</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Business Model</span>
                  <span className="font-bold text-primary">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Materiali & Pitch</span>
                  <span className="font-bold text-primary">10%</span>
                </div>
              </CardContent>
            </Card>

            {/* VC Funds Weights */}
            <Card className="bg-card/50 border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg">VC Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Track Record & Team</span>
                  <span className="font-bold text-primary">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strategia & Tesi</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pipeline & Portfolio</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Governance & Compliance</span>
                  <span className="font-bold text-primary">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Marketing Materials</span>
                  <span className="font-bold text-primary">8%</span>
                </div>
              </CardContent>
            </Card>

            {/* PE/Alternatives Weights */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">PE / Alternatives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Track Record & Team</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strategia & Dealflow</span>
                  <span className="font-bold text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Performance & Exits</span>
                  <span className="font-bold text-primary">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Governance & ESG</span>
                  <span className="font-bold text-primary">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compliance & DDQ</span>
                  <span className="font-bold text-primary">10%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <CheckCircle className="inline w-4 h-4 mr-2 text-primary" />
                Each dimension is assessed with objective and quantitative criteria, producing an overall 0-100 score and a success probability profile
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Book an Assessment</h3>
                <p className="text-muted-foreground mb-6">
                  Complete the intake form to receive a customized proposal and start your assessment
                </p>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setShowAssessmentForm(true)}
                >
                  Book Assessment
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Request a Sample Report</h3>
                <p className="text-muted-foreground mb-6">
                  Want to see what a complete report looks like? Request an anonymized sample
                </p>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReportRequest(true)}
                >
                  Request Sample
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How accurate is the probability estimate?
              </AccordionTrigger>
              <AccordionContent>
                The model is calibrated on over 200 real fundraising cases across startups, VC, and PE from 2018 to present. 
                The correlation between the final score and the actual fundraising outcome exceeds 82%. 
                However, the estimated probability should be understood as an indicator of relative positioning, not as absolute certainty.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Does the assessment replace investor due diligence?
              </AccordionTrigger>
              <AccordionContent>
                No. The assessment evaluates the "readiness" of the fundraising entity and identifies gaps to address before 
                going to market. Formal investor due diligence remains a separate and thorough process that occurs after 
                initial contact.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Can I request the assessment if I'm already fundraising?
              </AccordionTrigger>
              <AccordionContent>
                Yes, but the greatest value is obtained before starting the process. If you're already fundraising, 
                the assessment can still help diagnose problems and adjust strategy mid-course, but some changes 
                (e.g., governance, team) might require timelines incompatible with an already-launched campaign.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Does shared information remain confidential?
              </AccordionTrigger>
              <AccordionContent>
                Absolutely. All materials and data provided are treated with the utmost confidentiality 
                and covered by NDA. The final report is shared only with parties you authorize. 
                Any examples or benchmarks used in external communications are always completely anonymized.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>

        {/* Footer Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-muted/30 border-muted">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> The Fundraising Readiness Assessment is a proprietary diagnostic tool 
                of Aries76 Capital Advisory and does not constitute investment advice, public solicitation, 
                or regulated placement activity. Probability estimates are indicative and based on statistical models 
                that do not guarantee fundraising success. All investment or fundraising decisions remain the sole 
                responsibility of the client. Aries76 operates in compliance with current regulations regarding financial 
                advisory and personal data processing (GDPR).
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Assessment Form Dialog */}
        <Dialog open={showAssessmentForm} onOpenChange={setShowAssessmentForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Your Assessment</DialogTitle>
              <DialogDescription>
                Complete the form to receive a customized proposal
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssessmentSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientType">Client Type</Label>
                  <Select required>
                    <SelectTrigger id="clientType">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="vc">VC Fund</SelectItem>
                      <SelectItem value="pe">PE / Alternatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fundraisingTarget">Fundraising Target</Label>
                  <Input 
                    id="fundraisingTarget" 
                    placeholder="e.g., €5M seed round / €50M Fund I"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Expected Timeline</Label>
                  <Input 
                    id="timeline" 
                    placeholder="e.g., Q2 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="materials">Available Materials</Label>
                  <Textarea 
                    id="materials" 
                    placeholder="Pitch deck, business plan, financial model, track record..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keyMetrics">Key Metrics</Label>
                  <Textarea 
                    id="keyMetrics" 
                    placeholder="MRR, ARR, IRR, TVPI, portfolio size..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="lpPreferences">LP / Target Investor Preferences</Label>
                  <Textarea 
                    id="lpPreferences" 
                    placeholder="Family office, institutional, corporate VC, geo focus..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Full Name</Label>
                    <Input id="contactName" required />
                  </div>
                  <div>
                    <Label htmlFor="contactRole">Role</Label>
                    <Input id="contactRole" placeholder="e.g., CEO, Managing Partner" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input id="contactPhone" type="tel" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setShowAssessmentForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Report Request Dialog */}
        <Dialog open={showReportRequest} onOpenChange={setShowReportRequest}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Sample Report</DialogTitle>
              <DialogDescription>
                Enter your details to receive a sample report via email
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReportRequest} className="space-y-4">
              <div>
                <Label htmlFor="reportName">Full Name</Label>
                <Input id="reportName" required />
              </div>
              <div>
                <Label htmlFor="reportEmail">Email</Label>
                <Input id="reportEmail" type="email" required />
              </div>
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select required>
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="vc">VC Fund</SelectItem>
                    <SelectItem value="pe">PE / Alternatives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setShowReportRequest(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FundraisingReadiness;
