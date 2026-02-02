import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, FileText, Sparkles, Building2, Check, Lock, TrendingUp, PieChart, Shield, Target, BarChart3, LineChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  EssentialsReportView, 
  ProfessionalReportView,
  EnhancedPortfolioInput,
  PortfolioHolding 
} from '@/components/portfolio-report';

type ReportTier = 'essentials' | 'professional' | 'enterprise';

const tierFeatures = {
  essentials: {
    title: 'Essentials Report',
    price: '£149',
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    features: [
      { icon: LineChart, text: 'Monte Carlo simulations (1,000 iterations)' },
      { icon: TrendingUp, text: '5-year return projections' },
      { icon: BarChart3, text: 'Risk metrics (Sharpe, Sortino, VaR)' },
      { icon: Target, text: 'Benchmark comparison (S&P 500, 60/40)' },
    ],
    canDemo: true,
  },
  professional: {
    title: 'Professional Report',
    price: '£349',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    features: [
      { icon: Check, text: 'All Essentials features included' },
      { icon: PieChart, text: 'Sector concentration analysis' },
      { icon: BarChart3, text: '5 market scenario stress tests' },
      { icon: TrendingUp, text: 'Recession, inflation, rate shock simulations' },
    ],
    canDemo: true,
  },
  enterprise: {
    title: 'Enterprise Report',
    price: '£749',
    icon: Building2,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    features: [
      { icon: Check, text: 'All Professional features included' },
      { icon: Shield, text: 'Institutional stress testing (2008, COVID)' },
      { icon: Target, text: 'Custom scenario modelling' },
      { icon: FileText, text: 'Tax optimization strategies' },
      { icon: Lock, text: 'Regulatory compliance check' },
      { icon: Sparkles, text: 'Bespoke AI recommendations' },
    ],
    canDemo: false,
  },
};

const PortfolioEssentialsDemo = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@aries76.com');
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportTier>('essentials');
  const [report, setReport] = useState<any>(null);

  const handlePortfolioChange = useCallback((newHoldings: PortfolioHolding[]) => {
    setHoldings(newHoldings);
  }, []);

  const currentTier = tierFeatures[reportType];

  const generateReport = async () => {
    if (!currentTier.canDemo) {
      toast.info('Enterprise reports require a subscription. Redirecting to pricing...');
      navigate('/portfolio-analysis');
      return;
    }

    const validHoldings = holdings.filter(h => h.ticker.trim() && h.weight > 0);
    
    if (validHoldings.length === 0) {
      toast.error('Please enter at least one holding');
      return;
    }

    const totalWeight = validHoldings.reduce((sum, h) => sum + h.weight, 0);
    if (Math.abs(totalWeight - 100) > 5) {
      toast.warning(`Total weight is ${totalWeight.toFixed(1)}%. Should be close to 100%.`);
    }

    setIsLoading(true);
    setReport(null);

    const functionName = reportType === 'professional' 
      ? 'portfolio-professional-report' 
      : 'portfolio-essentials-report';

    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          email,
          holdings: validHoldings.map(h => ({
            ticker: h.ticker.toUpperCase().trim(),
            weight: h.weight,
            sector: h.sector,
          })),
        },
      });

      if (error) throw error;

      if (data?.success && data?.report) {
        setReport(data.report);
        toast.success('Report generated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Report generation error:', err);
      toast.error(err.message || 'Error generating report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const TierIcon = currentTier.icon;

  return (
    <>
      <Helmet>
        <title>Portfolio Report Demo | ARIES76</title>
        <meta name="description" content="Test Portfolio Reports with Monte Carlo simulations, sector breakdown, and scenario analysis." />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <FileText className="inline-block h-8 w-8 mr-3 text-primary" />
              Portfolio Report Demo
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our three report tiers. Try Essentials and Professional live, 
              or preview Enterprise features.
            </p>
          </motion.div>

          {/* Input Form */}
          {!report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Report Type Selector with TabsContent */}
              <Tabs value={reportType} onValueChange={(v) => setReportType(v as ReportTier)} className="w-full">
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                  <TabsTrigger value="essentials" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Essentials</span> £149
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Professional</span> £349
                  </TabsTrigger>
                  <TabsTrigger value="enterprise" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Enterprise</span> £749
                  </TabsTrigger>
                </TabsList>

                {/* Feature Cards for each tier */}
                <div className="mt-6">
                  <TabsContent value="essentials" className="mt-0">
                    <TierFeatureCard tier="essentials" />
                  </TabsContent>
                  <TabsContent value="professional" className="mt-0">
                    <TierFeatureCard tier="professional" />
                  </TabsContent>
                  <TabsContent value="enterprise" className="mt-0">
                    <TierFeatureCard tier="enterprise" />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Portfolio Input - Only show for demo-able tiers */}
              {currentTier.canDemo && (
                <>
                  {/* Email Input */}
                  <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6">
                      <Label htmlFor="email">Email for Report</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </CardContent>
                  </Card>

                  {/* Enhanced Portfolio Input */}
                  <div className="max-w-2xl mx-auto">
                    <EnhancedPortfolioInput onPortfolioChange={handlePortfolioChange} />
                  </div>

                  {/* Generate Button */}
                  <div className="max-w-md mx-auto">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={generateReport}
                      disabled={isLoading || holdings.length === 0}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Portfolio...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Generate {currentTier.title}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Enterprise CTA */}
              {!currentTier.canDemo && (
                <div className="max-w-md mx-auto text-center space-y-4">
                  <p className="text-muted-foreground">
                    Enterprise reports are custom-built by our research team within 24-48 hours.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/portfolio-analysis')}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Purchase Enterprise Report
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Report View */}
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <Button variant="outline" onClick={() => setReport(null)}>
                  ← Run Another Analysis
                </Button>
              </div>
              
              {report.reportType === 'professional' ? (
                <ProfessionalReportView report={report} email={email} />
              ) : (
                <EssentialsReportView report={report} email={email} />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

// Feature card component for each tier
const TierFeatureCard = ({ tier }: { tier: ReportTier }) => {
  const config = tierFeatures[tier];
  const TierIcon = config.icon;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <TierIcon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <span className={config.color}>{config.title}</span>
            <span className="ml-2 text-muted-foreground font-normal">({config.price})</span>
          </div>
          {config.canDemo && (
            <span className="ml-auto text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
              Live Demo Available
            </span>
          )}
          {!config.canDemo && (
            <span className="ml-auto text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Premium Only
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid sm:grid-cols-2 gap-3">
          {config.features.map((feature, idx) => {
            const FeatureIcon = feature.icon;
            return (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <FeatureIcon className={`h-4 w-4 mt-0.5 ${config.color} shrink-0`} />
                <span>{feature.text}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PortfolioEssentialsDemo;
