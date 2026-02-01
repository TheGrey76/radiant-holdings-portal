import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { EmailGateModal } from './EmailGateModal';

interface InsightCard {
  icon: React.ReactNode;
  title: string;
  content: string;
  isLocked: boolean;
}

export const AIInsightsTeaser: React.FC = () => {
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const insights: InsightCard[] = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: 'Market Positioning',
      content: 'Bitcoin is currently trading 35% below ATH, presenting a potential accumulation opportunity for long-term investors.',
      isLocked: false,
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-blue-400" />,
      title: 'Technical Analysis',
      content: 'Technical indicators suggest strong support at $85-90k with resistance at $105-110k range.',
      isLocked: false,
    },
    {
      icon: <Target className="h-5 w-5 text-amber-400" />,
      title: 'Monte Carlo Projection',
      content: 'Simulations suggest 50% probability of reaching $175-225k by 2027 under current macro conditions.',
      isLocked: !unlocked,
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      title: 'Optimal Allocation',
      content: 'For moderate risk investors, optimal portfolio allocation is 5-10% Bitcoin based on risk-adjusted returns.',
      isLocked: !unlocked,
    },
  ];

  const handleUnlock = () => {
    setShowEmailGate(true);
  };

  const handleEmailSubmitted = () => {
    setUnlocked(true);
    setShowEmailGate(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all ${
                insight.isLocked 
                  ? 'cursor-pointer hover:border-primary/50' 
                  : ''
              }`}
              onClick={() => insight.isLocked && handleUnlock()}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{insight.title}</h4>
                    <p className={`text-sm ${insight.isLocked ? 'text-transparent select-none' : 'text-muted-foreground'}`}
                       style={insight.isLocked ? { filter: 'blur(5px)' } : {}}>
                      {insight.content}
                    </p>
                  </div>
                </div>

                {insight.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px]">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlock();
                      }}
                    >
                      <Lock className="h-4 w-4" />
                      Unlock with Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EmailGateModal 
        open={showEmailGate} 
        onOpenChange={setShowEmailGate}
        onSuccess={handleEmailSubmitted}
        source="unlock_gate"
      />
    </>
  );
};

export default AIInsightsTeaser;
