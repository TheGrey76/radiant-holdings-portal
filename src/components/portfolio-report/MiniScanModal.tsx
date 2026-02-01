import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, Shield, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface MiniScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MiniScanModal: React.FC<MiniScanModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
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

  const handleSubmit = async () => {
    // Validate
    const validHoldings = holdings.filter(h => h.ticker.trim() && h.weight.trim());
    if (validHoldings.length === 0) {
      toast.error('Please enter at least one holding');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setStep('loading');

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-mini-scan', {
        body: {
          email,
          holdings: validHoldings.map(h => ({
            ticker: h.ticker.toUpperCase(),
            weight: parseFloat(h.weight) || 0,
          })),
          source: 'mini_scan',
        },
      });

      if (error) throw error;

      setResults(data.results);
      setStep('results');
    } catch (err: any) {
      console.error('Mini scan error:', err);
      toast.error('Error running analysis. Please try again.');
      setStep('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep('input');
      setResults(null);
    }, 300);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Conservative': return 'text-emerald-400 bg-emerald-500/10';
      case 'Moderate': return 'text-amber-400 bg-amber-500/10';
      case 'Aggressive': return 'text-red-400 bg-red-500/10';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === 'input' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                🔍 Free Portfolio Mini-Scan
              </DialogTitle>
              <DialogDescription>
                Enter your top holdings to get an instant risk assessment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-[1fr,80px] gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span>Ticker / Asset</span>
                <span>Weight %</span>
              </div>

              {holdings.map((holding, index) => (
                <div key={index} className="grid grid-cols-[1fr,80px] gap-2">
                  <Input
                    placeholder={index === 0 ? "e.g., AAPL" : ""}
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

              <div className="pt-4">
                <Label htmlFor="email">Email for results</Label>
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

            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-orange-500" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Generate Free Analysis →
              </Button>

              <div className="text-xs text-muted-foreground border-t pt-4">
                <p className="font-medium mb-2">Mini-Scan includes:</p>
                <ul className="space-y-1">
                  <li>• Risk Score</li>
                  <li>• Allocation Analysis</li>
                  <li>• 3 Key Insights</li>
                </ul>
                <p className="mt-2 text-primary/80">
                  Full Report (from £149) adds: Monte Carlo, 15+ metrics, Tax optimization, AI recommendations
                </p>
              </div>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Portfolio</h3>
            <p className="text-muted-foreground text-sm mb-4">This will take a few seconds...</p>
            <Progress value={66} className="max-w-xs mx-auto" />
          </div>
        )}

        {step === 'results' && results && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Your Portfolio Analysis
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-lg p-3 text-center border">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-2xl font-bold">{results.riskScore}</p>
                  <Badge className={`mt-1 ${getRiskColor(results.riskLevel)}`}>
                    {results.riskLevel}
                  </Badge>
                </div>
                <div className="bg-card rounded-lg p-3 text-center border">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                  <p className="text-2xl font-bold text-emerald-400">{results.expectedReturn}</p>
                  <p className="text-xs text-muted-foreground">Expected Return</p>
                </div>
                <div className="bg-card rounded-lg p-3 text-center border">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                  <p className="text-2xl font-bold text-amber-400">{results.volatilityImpact}</p>
                  <p className="text-xs text-muted-foreground">Volatility</p>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Key Insights
                </h4>
                <ul className="space-y-2 text-sm">
                  {results.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-muted-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm font-medium mb-2">Want deeper analysis?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Get Monte Carlo simulations, tax optimization, and AI recommendations.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-orange-500"
                  onClick={() => {
                    handleClose();
                    const pricingSection = document.getElementById('portfolio-pricing');
                    pricingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Full Report — From £149
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MiniScanModal;
