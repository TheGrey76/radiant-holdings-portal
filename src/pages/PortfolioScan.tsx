import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Zap, 
  AlertTriangle,
  Loader2,
  Sparkles,
  BarChart3,
  PieChart,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Holding {
  ticker: string;
  weight: string;
}

interface ScanResults {
  riskScore: number;
  riskLevel: string;
  expectedReturn: string;
  volatilityImpact: string;
  insights: string[];
}

type Step = 'intro' | 'holdings' | 'email' | 'loading' | 'results';

const PortfolioScan: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');
  const [email, setEmail] = useState('');
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
    { ticker: '', weight: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);

  const updateHolding = (index: number, field: 'ticker' | 'weight', value: string) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const validHoldingsCount = holdings.filter(h => h.ticker.trim() && h.weight.trim()).length;

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setStep('loading');

    try {
      const validHoldings = holdings.filter(h => h.ticker.trim() && h.weight.trim());
      
      const { data, error } = await supabase.functions.invoke('portfolio-mini-scan', {
        body: {
          email,
          holdings: validHoldings.map(h => ({
            ticker: h.ticker.toUpperCase(),
            weight: parseFloat(h.weight) || 0,
          })),
          source: 'portfolio_scan_page',
        },
      });

      if (error) throw error;

      setResults(data.results);
      setStep('results');
    } catch (err: any) {
      console.error('Scan error:', err);
      toast.error('Error running analysis. Please try again.');
      setStep('email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Conservative': return 'text-emerald-400 bg-emerald-500/10';
      case 'Moderate': return 'text-amber-400 bg-amber-500/10';
      case 'Aggressive': return 'text-red-400 bg-red-500/10';
      default: return 'text-muted-foreground';
    }
  };

  const stepProgress = {
    intro: 0,
    holdings: 33,
    email: 66,
    loading: 80,
    results: 100,
  };

  return (
    <>
      <Helmet>
        <title>Free Portfolio Scan | ARIES76</title>
        <meta name="description" content="Get a free AI-powered analysis of your portfolio. Discover your risk score, expected returns, and optimization opportunities." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"></div>

          <div className="container max-w-4xl mx-auto px-6 py-16 md:py-20 relative z-10">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Target className="h-3 w-3 mr-1" />
                Free Analysis Tool
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Portfolio <span className="text-orange-400">Mini-Scan</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Enter your top holdings and get an instant AI-powered risk assessment
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <Progress value={stepProgress[step]} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Start</span>
                <span>Holdings</span>
                <span>Email</span>
                <span>Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-2xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Intro */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <PieChart className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">What You'll Get</h2>
                    <p className="text-muted-foreground mb-8">
                      Our AI analyzes your portfolio composition and provides instant insights.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Shield, label: 'Risk Score', desc: 'Portfolio risk assessment' },
                        { icon: TrendingUp, label: 'Expected Return', desc: 'Projected annual returns' },
                        { icon: Sparkles, label: 'AI Insights', desc: '3 key recommendations' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted/50 text-center">
                          <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-orange-500"
                      onClick={() => setStep('holdings')}
                    >
                      Start Free Scan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <p className="text-xs text-muted-foreground mt-4">
                      Takes less than 2 minutes • No credit card required
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Holdings */}
            {step === 'holdings' && (
              <motion.div
                key="holdings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold mb-2">Enter Your Top Holdings</h2>
                    <p className="text-muted-foreground mb-6">
                      Add at least 3 holdings for accurate analysis
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-[1fr,100px] gap-3 text-sm font-medium text-muted-foreground">
                        <span>Ticker / Asset Name</span>
                        <span>Weight %</span>
                      </div>

                      {holdings.map((holding, index) => (
                        <div key={index} className="grid grid-cols-[1fr,100px] gap-3">
                          <Input
                            placeholder={index === 0 ? "e.g., AAPL, SPY, BTC" : ""}
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
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-6">
                      <span className="text-muted-foreground">
                        Holdings entered: <span className="text-foreground font-medium">{validHoldingsCount}/5</span>
                      </span>
                      {validHoldingsCount >= 3 && (
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep('intro')}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-orange-500"
                        onClick={() => setStep('email')}
                        disabled={validHoldingsCount < 1}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Email */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Almost There!</h2>
                      <p className="text-muted-foreground">
                        Enter your email to receive your personalized analysis
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground">
                        🔒 We'll send you a copy of your analysis. No spam, ever.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep('holdings')}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-orange-500"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !email.includes('@')}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Generate My Analysis
                            <Sparkles className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Loading */}
            {step === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="py-16 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
                    <h2 className="text-xl font-bold mb-2">Analyzing Your Portfolio</h2>
                    <p className="text-muted-foreground mb-6">
                      Running AI analysis on {validHoldingsCount} holdings...
                    </p>
                    <Progress value={66} className="max-w-xs mx-auto" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Results */}
            {step === 'results' && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <h2 className="text-xl font-bold">Your Portfolio Analysis</h2>
                    </div>

                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
                        <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-3xl font-bold">{results.riskScore}</p>
                        <Badge className={`mt-2 ${getRiskColor(results.riskLevel)}`}>
                          {results.riskLevel}
                        </Badge>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                        <p className="text-3xl font-bold text-emerald-400">{results.expectedReturn}</p>
                        <p className="text-xs text-muted-foreground mt-2">Expected Return</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center border border-border/50">
                        <Zap className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                        <p className="text-3xl font-bold text-amber-400">{results.volatilityImpact}</p>
                        <p className="text-xs text-muted-foreground mt-2">Volatility</p>
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="bg-muted/30 rounded-lg p-5 mb-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Key Insights
                      </h3>
                      <ul className="space-y-3">
                        {results.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-primary font-bold">•</span>
                            <span className="text-muted-foreground">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-sm text-center text-muted-foreground">
                      ✉️ A copy has been sent to <span className="text-foreground">{email}</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Upgrade CTA */}
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-orange-500/5">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Want Deeper Analysis?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Get Monte Carlo simulations, tax optimization strategies, and AI-powered recommendations in our full report.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-primary to-orange-500"
                        onClick={() => navigate('/portfolio-analysis#portfolio-pricing')}
                      >
                        Get Full Report — From £149
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => {
                          setStep('intro');
                          setResults(null);
                          setHoldings([
                            { ticker: '', weight: '' },
                            { ticker: '', weight: '' },
                            { ticker: '', weight: '' },
                            { ticker: '', weight: '' },
                            { ticker: '', weight: '' },
                          ]);
                          setEmail('');
                        }}
                      >
                        Run Another Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PortfolioScan;
