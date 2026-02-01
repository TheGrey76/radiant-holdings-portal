import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap, Target, ArrowRight, Sparkles } from 'lucide-react';
import { MiniScanModal } from './MiniScanModal';

interface SimulationResult {
  riskScore: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  expectedReturn: string;
  volatilityImpact: string;
}

export const PortfolioSimulator: React.FC = () => {
  const [btcAllocation, setBtcAllocation] = useState<number[]>([5]);
  const [showMiniScan, setShowMiniScan] = useState(false);

  const results = useMemo((): SimulationResult => {
    const allocation = btcAllocation[0];
    
    // Simplified model: higher BTC = higher risk & return
    const baseRisk = 45; // Base portfolio risk score
    const btcRiskContribution = allocation * 1.5; // BTC adds significant volatility
    const riskScore = Math.min(100, Math.round(baseRisk + btcRiskContribution));
    
    const riskLevel = riskScore >= 70 ? 'Aggressive' : riskScore >= 50 ? 'Moderate' : 'Conservative';
    
    // Expected return increases with BTC allocation
    const baseReturn = 6.5;
    const btcReturnContribution = allocation * 0.35;
    const expectedReturn = `+${(baseReturn + btcReturnContribution).toFixed(1)}%`;
    
    // Volatility impact
    const volatilityImpact = `+${(allocation * 0.25).toFixed(1)}%`;
    
    return { riskScore, riskLevel, expectedReturn, volatilityImpact };
  }, [btcAllocation]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Conservative': return 'text-emerald-400';
      case 'Moderate': return 'text-amber-400';
      case 'Aggressive': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Slider Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">How Does Bitcoin Fit in YOUR Portfolio?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Adjust allocation and see real-time impact on risk & return
              </p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">BTC Allocation</span>
                    <Badge variant="outline" className="text-primary border-primary/50 font-mono">
                      {btcAllocation[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={btcAllocation}
                    onValueChange={setBtcAllocation}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Results Card */}
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Portfolio Impact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{results.riskScore}</p>
                      <p className={`text-xs font-medium ${getRiskColor(results.riskLevel)}`}>
                        {results.riskLevel}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">{results.expectedReturn}</p>
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="text-2xl font-bold text-amber-400">{results.volatilityImpact}</p>
                      <p className="text-xs text-muted-foreground">Volatility</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Teaser & CTAs */}
            <div className="flex flex-col justify-between">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-2">This is a simplified preview. Full analysis includes:</p>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• Monte Carlo simulations (10,000+ scenarios)</li>
                      <li>• Tax-optimized rebalancing strategies</li>
                      <li>• Correlation with your actual holdings</li>
                      <li>• AI-powered recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
                  onClick={() => setShowMiniScan(true)}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Analyze Your Full Portfolio — Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const pricingSection = document.getElementById('portfolio-pricing');
                    pricingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Complete Report — From £149
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MiniScanModal open={showMiniScan} onOpenChange={setShowMiniScan} />
    </>
  );
};

export default PortfolioSimulator;
