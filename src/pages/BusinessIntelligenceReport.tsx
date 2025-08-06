import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Download, TrendingUp, BarChart3, Brain, Users, Target, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const BusinessIntelligenceReport = () => {
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();

  const handleOrderReport = () => {
    setIsOrdering(true);
    // Simulate order processing
    setTimeout(() => {
      setIsOrdering(false);
      toast({
        title: "Order Confirmed",
        description: "Wire transfer instructions have been sent to your email. Report will be delivered upon payment confirmation.",
      });
    }, 2000);
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
          <div className="text-sm text-aries-blue font-medium mb-4">ARIES76 Edition</div>
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
                
                <div className="text-4xl font-bold text-aries-blue mb-2">£2,500</div>
                <div className="text-slate-500 mb-8">One-time investment</div>
                
                <Button 
                  onClick={handleOrderReport}
                  disabled={isOrdering}
                  className="w-full bg-aries-blue hover:bg-aries-navy text-white py-3 text-lg"
                >
                  {isOrdering ? "Processing..." : "Order Analysis"}
                </Button>
                
                <div className="mt-6 text-sm text-slate-500 space-y-1">
                  <div>Payment via wire transfer</div>
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
    </div>
  );
};

export default BusinessIntelligenceReport;