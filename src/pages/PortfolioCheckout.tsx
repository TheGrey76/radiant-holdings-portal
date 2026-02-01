import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Lock,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PricingTier {
  id: 'essentials' | 'professional' | 'enterprise';
  name: string;
  price: number;
  description: string;
  features: string[];
}

const tiers: Record<string, PricingTier> = {
  essentials: {
    id: 'essentials',
    name: 'Essentials Report',
    price: 149,
    description: 'Quick portfolio health check',
    features: [
      'Risk Analysis & Scoring',
      'Allocation Breakdown',
      'Benchmark Comparison',
      'PDF Report',
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional Report',
    price: 349,
    description: 'Comprehensive optimization',
    features: [
      'Everything in Essentials',
      'Monte Carlo Simulations',
      'Tax Optimization',
      'Scenario Analysis',
      'Rebalancing Recommendations',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Report',
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
};

const PortfolioCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan') || 'professional';
  const status = searchParams.get('status');
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tier = tiers[planId] || tiers.professional;

  useEffect(() => {
    // Check for success/cancel status from Stripe redirect
    if (status === 'success') {
      toast.success('Payment successful! Check your email for your report.');
    } else if (status === 'cancelled') {
      toast.info('Payment was cancelled.');
    }
  }, [status]);

  const handleCheckout = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-checkout', {
        body: {
          email,
          tier: tier.id,
          successUrl: `${window.location.origin}/checkout?plan=${tier.id}&status=success`,
          cancelUrl: `${window.location.origin}/checkout?plan=${tier.id}&status=cancelled`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // In Lovable preview (iframe) full-page navigation to Stripe can be blocked.
        // Prefer opening Checkout in a new tab.
        const opened = window.open(data.url, '_blank', 'noopener,noreferrer');

        if (!opened) {
          // Popup blocked: fall back to same-tab navigation.
          window.location.href = data.url;
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Error creating checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (status === 'success') {
    return (
      <>
        <Helmet>
          <title>Payment Successful | ARIES76</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="text-center">
              <CardContent className="pt-10 pb-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your {tier.name} is being generated.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium mb-2">What's Next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Check your email for confirmation</li>
                    <li>✓ Your report will be ready within 24 hours</li>
                    <li>✓ Access your dashboard anytime</li>
                  </ul>
                </div>
                <Button onClick={() => navigate('/portfolio-analysis')}>
                  Return to Portfolio Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  // Cancelled State
  if (status === 'cancelled') {
    return (
      <>
        <Helmet>
          <title>Payment Cancelled | ARIES76</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="text-center">
              <CardContent className="pt-10 pb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
                <p className="text-muted-foreground mb-6">
                  Your payment was cancelled. No charges were made.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => navigate(`/checkout?plan=${tier.id}`)}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/portfolio-analysis')}>
                    Return to Portfolio Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - {tier.name} | ARIES76</title>
        <meta name="description" content={`Complete your purchase for the ${tier.name}.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container max-w-5xl mx-auto px-6 py-12">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/portfolio-analysis')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio Analysis
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30">
                      Best Value
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-3xl font-bold">£{tier.price}</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Secure Checkout</p>
                      <p className="text-muted-foreground">
                        Protected by Stripe. Your payment details are encrypted.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Your report will be sent to this email
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You'll be redirected to Stripe's secure checkout to complete your payment.
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-orange-500"
                    onClick={handleCheckout}
                    disabled={isLoading || !email.includes('@')}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay £{tier.price} Now
                        <CreditCard className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By completing this purchase, you agree to our{' '}
                      <a href="/legal" className="text-primary hover:underline">Terms of Service</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Stripe Payments</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioCheckout;
