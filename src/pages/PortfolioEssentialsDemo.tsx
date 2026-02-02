import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, FileText, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  EssentialsReportView, 
  ProfessionalReportView,
  EnhancedPortfolioInput,
  PortfolioHolding 
} from '@/components/portfolio-report';

const PortfolioEssentialsDemo = () => {
  const [email, setEmail] = useState('demo@aries76.com');
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<'essentials' | 'professional' | 'enterprise'>('essentials');
  const [report, setReport] = useState<any>(null);

  const handlePortfolioChange = useCallback((newHoldings: PortfolioHolding[]) => {
    setHoldings(newHoldings);
  }, []);

  const generateReport = async () => {
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
              Test our institutional-grade portfolio analysis with Monte Carlo simulations, 
              sector breakdown, and stress test scenarios.
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
              {/* Report Type Selector */}
              <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)} className="max-w-lg mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="essentials">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Essentials (£149)
                  </TabsTrigger>
                  <TabsTrigger value="professional">
                    <FileText className="h-4 w-4 mr-2" />
                    Professional (£349)
                  </TabsTrigger>
                  <TabsTrigger value="enterprise">
                    <FileText className="h-4 w-4 mr-2" />
                    Enterprise (£749)
                  </TabsTrigger>
                </TabsList>
              </Tabs>

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
                  className="w-full bg-gradient-to-r from-primary to-orange-500"
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
                      Generate {reportType === 'professional' ? 'Professional' : 'Essentials'} Report
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {reportType === 'enterprise' 
                    ? 'Includes institutional stress testing, tax optimization & bespoke recommendations'
                    : reportType === 'professional' 
                    ? 'Includes sector breakdown, scenario analysis & stress testing'
                    : 'Includes Monte Carlo simulations & 5-year projections'}
                </p>
              </div>
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

export default PortfolioEssentialsDemo;
