import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EssentialsReportView } from '@/components/portfolio-report/EssentialsReportView';

interface Holding {
  ticker: string;
  weight: string;
}

const PortfolioEssentialsDemo = () => {
  const [email, setEmail] = useState('demo@aries76.com');
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: 'AAPL', weight: '25' },
    { ticker: 'MSFT', weight: '20' },
    { ticker: 'GOOGL', weight: '15' },
    { ticker: 'BTC', weight: '10' },
    { ticker: 'VOO', weight: '30' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const updateHolding = (index: number, field: 'ticker' | 'weight', value: string) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const addHolding = () => {
    setHoldings([...holdings, { ticker: '', weight: '' }]);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const generateReport = async () => {
    const validHoldings = holdings.filter(h => h.ticker.trim() && h.weight.trim());
    
    if (validHoldings.length === 0) {
      toast.error('Please enter at least one holding');
      return;
    }

    const totalWeight = validHoldings.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);
    if (Math.abs(totalWeight - 100) > 1) {
      toast.warning(`Total weight is ${totalWeight.toFixed(1)}%. Ideally should be 100%.`);
    }

    setIsLoading(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-essentials-report', {
        body: {
          email,
          holdings: validHoldings.map(h => ({
            ticker: h.ticker.toUpperCase().trim(),
            weight: parseFloat(h.weight) || 0,
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
        <title>Essentials Report Demo | ARIES76</title>
        <meta name="description" content="Test the Portfolio Essentials Report with Monte Carlo simulations and advanced risk metrics." />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <FileText className="inline-block h-8 w-8 mr-3 text-primary" />
              Essentials Report Demo
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test the £149 Essentials Report with real Monte Carlo simulations, 
              5-year projections, and institutional-grade risk metrics.
            </p>
          </motion.div>

          {/* Input Form */}
          {!report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Enter Your Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>

                  {/* Holdings */}
                  <div>
                    <Label>Holdings</Label>
                    <div className="grid grid-cols-[1fr,80px,40px] gap-2 mt-2 text-xs text-muted-foreground mb-2">
                      <span>Ticker</span>
                      <span>Weight %</span>
                      <span></span>
                    </div>
                    {holdings.map((holding, index) => (
                      <div key={index} className="grid grid-cols-[1fr,80px,40px] gap-2 mb-2">
                        <Input
                          placeholder="AAPL"
                          value={holding.ticker}
                          onChange={(e) => updateHolding(index, 'ticker', e.target.value)}
                          className="uppercase"
                        />
                        <Input
                          type="number"
                          placeholder="%"
                          value={holding.weight}
                          onChange={(e) => updateHolding(index, 'weight', e.target.value)}
                          min="0"
                          max="100"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHolding(index)}
                          disabled={holdings.length <= 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addHolding}
                      className="mt-2"
                    >
                      + Add Holding
                    </Button>
                  </div>

                  {/* Generate Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-orange-500"
                    size="lg"
                    onClick={generateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running Monte Carlo Simulations...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Essentials Report
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    This demo runs 1,000 Monte Carlo simulations with 5 years of historical data.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Report View */}
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setReport(null)}
                >
                  ← Run Another Analysis
                </Button>
              </div>
              
              <EssentialsReportView report={report} email={email} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioEssentialsDemo;
