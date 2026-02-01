import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MiniScanModal } from './MiniScanModal';

interface PricingTier {
  id: 'essentials' | 'professional' | 'enterprise';
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    price: 149,
    description: 'Quick portfolio health check',
    features: [
      'Risk Analysis & Scoring',
      'Allocation Breakdown',
      'Benchmark Comparison',
      'PDF Report',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 349,
    description: 'Comprehensive optimization',
    features: [
      'Everything in Essentials',
      'Monte Carlo Simulations',
      'Tax Optimization',
      'Scenario Analysis',
      'Rebalancing Recommendations',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 749,
    description: 'Full institutional analysis',
    features: [
      'Everything in Professional',
      'AI-Powered Recommendations',
      'Custom Constraints',
      'Factor Analysis',
      'Priority Support',
      'White-Label Option',
    ],
  },
];

interface PricingCardProps {
  email?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ email: initialEmail }) => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showMiniScan, setShowMiniScan] = useState(false);

  const handleCheckout = async (tier: PricingTier) => {
    const email = initialEmail || prompt('Enter your email to continue:');
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoadingTier(tier.id);

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-checkout', {
        body: {
          email,
          tier: tier.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Error creating checkout. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <>
      <div id="portfolio-pricing" className="scroll-mt-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Portfolio Optimization Reports</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Institutional-grade analysis at a fraction of traditional advisory costs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                tier.highlighted 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£{tier.price}</span>
                  <span className="text-muted-foreground ml-1">/ report</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    tier.highlighted 
                      ? 'bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90' 
                      : ''
                  }`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                  onClick={() => handleCheckout(tier)}
                  disabled={loadingTier !== null}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Get Your Report
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Mini-Scan CTA */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-3">Not ready to commit?</p>
          <Button 
            variant="ghost" 
            className="text-primary"
            onClick={() => setShowMiniScan(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Try Free Mini-Scan First
          </Button>
        </div>
      </div>

      <MiniScanModal open={showMiniScan} onOpenChange={setShowMiniScan} />
    </>
  );
};

export default PricingCard;
