import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Download, TrendingUp, BarChart3, Brain, Users, Target, FileText, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BusinessIntelligenceReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: ''
  });
  const { toast } = useToast();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('🚀 FORM SUBMITTED - SIMPLE VERSION');
    console.log('Form data:', { companyName: formData.companyName, email: formData.email });
    
    try {
      // SOLUZIONE SEMPLICE: salviamo direttamente nel database Supabase
      const { data, error } = await supabase
        .from('brochure_downloads')
        .insert({
          full_name: formData.companyName,
          email: formData.email,
          company: formData.companyName,
          request_type: 'business_intelligence'
        });

      console.log('Database insert result:', { data, error });

      if (error) {
        throw error;
      }

      console.log('✅ SUCCESS - Data saved to database!');
      
      setIsModalOpen(false);
      setFormData({ companyName: '', email: '' });
      toast({
        title: "✅ Request Submitted Successfully",
        description: "Your request has been saved! We'll contact you within 24 hours.",
      });
      
    } catch (error) {
      console.error('❌ ERROR saving to database:', error);
      toast({
        title: "❌ Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms for predictive insights and automated decision-making"
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboards",
      description: "Interactive dashboards with real-time data visualization and KPI monitoring"
    },
    {
      icon: TrendingUp,
      title: "Predictive Modeling",
      description: "Forecast trends, identify patterns, and predict future business outcomes"
    },
    {
      icon: Users,
      title: "Customer Intelligence",
      description: "Deep customer behavior analysis, segmentation, and lifetime value prediction"
    },
    {
      icon: Target,
      title: "Market Analysis",
      description: "Competitive intelligence and market positioning strategies"
    },
    {
      icon: FileText,
      title: "Automated Reporting",
      description: "Scheduled reports with actionable insights delivered to stakeholders"
    }
  ];

  const reportIncludes = [
    "AI-driven data analysis and insights",
    "Custom dashboard development",
    "Predictive analytics implementation",
    "Customer behavior analysis",
    "Market intelligence reports",
    "Risk assessment and mitigation strategies",
    "Performance optimization recommendations",
    "ROI analysis and projections"
  ];

  const whyChooseAries = [
    "AI-powered analysis and insights",
    "Expert data science team",
    "Proven track record with Fortune 500 companies",
    "24/7 support and consultation",
    "Scalable solutions for any business size",
    "Regular updates and system maintenance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center text-aries-navy hover:text-aries-blue transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/ba0e4dd6-4e22-4db9-9da2-6b3359300d31.png" 
              alt="Aries76 Logo" 
              className="h-20 md:h-24" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-aries-navy mb-6">
            Business Intelligence Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive AI-powered business intelligence services designed to transform 
            your corporate data into actionable insights and competitive advantages.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* What You'll Get */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Download className="w-5 h-5 text-aries-blue mr-3" />
                  <h2 className="text-2xl font-bold text-aries-navy">What You'll Get</h2>
                </div>
                <div className="space-y-4">
                  {reportIncludes.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="mt-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-aries-navy mb-8">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="flex items-start"
                    >
                      <div className="p-3 bg-aries-blue/10 rounded-lg mr-4 flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-aries-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-aries-navy mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-aries-navy mb-4">Get Instant Access</h3>
                <p className="text-slate-600 mb-6">Consultation and analysis delivered within 5-7 business days</p>
                
                <div className="text-3xl font-bold text-aries-blue mb-2">Price on Request</div>
                <div className="text-slate-500 mb-8">Custom quote based on requirements</div>
                
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-aries-blue hover:bg-aries-navy text-white py-3 text-lg"
                >
                  Request Quote
                </Button>
                
                <div className="mt-6 text-sm text-slate-500 space-y-1">
                  <div>Custom pricing & wire transfer payment</div>
                  <div>30-day satisfaction guarantee</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-aries-navy mb-4">Why Choose ARIES76?</h3>
                <div className="space-y-3">
                  {whyChooseAries.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-aries-navy mb-6">Transform Your Business with AI</h2>
              <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our Business Intelligence Analysis combines cutting-edge AI technology with decades of 
                industry expertise to deliver insights that drive real business results. From predictive 
                analytics to automated reporting, we help enterprises unlock the full potential of their data.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-aries-blue/20">
          <DialogHeader>
            <DialogTitle className="text-aries-navy text-xl font-bold">Request Business Intelligence Analysis</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="company" className="text-aries-navy font-medium">Company Name</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  required
                  className="mt-1 border-slate-300 focus:border-aries-blue focus:ring-aries-blue"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-aries-navy font-medium">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your business email"
                  required
                  className="mt-1 border-slate-300 focus:border-aries-blue focus:ring-aries-blue"
                />
              </div>
            </div>

            <div className="bg-aries-blue/5 p-4 rounded-lg border border-aries-blue/20">
              <p className="text-sm text-aries-navy">
                <strong>What happens next:</strong><br />
                1. We'll review your requirements<br />
                2. Custom quote within 24 hours<br />
                3. Wire transfer instructions provided<br />
                4. Analysis delivered in 5-7 business days
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-aries-blue/30 text-aries-navy hover:bg-aries-blue/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-aries-blue hover:bg-aries-navy text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessIntelligenceReport;