import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Lock, Building2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const PortfolioEnterprise = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // Check if user has enterprise tier
      const { data, error } = await supabase
        .from('portfolio_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tier', 'enterprise')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Access check error:', error);
        setHasAccess(false);
      } else {
        setHasAccess(!!data);
      }
      setIsLoading(false);
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/portfolio-enterprise" replace />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-2xl mx-auto px-6 text-center">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-muted-foreground mb-8">
            You need to purchase the Enterprise Report (£749) to access this page.
          </p>
          <Button onClick={() => navigate('/portfolio-analysis')} size="lg">
            View Pricing & Purchase
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enterprise Report | ARIES76 Portfolio</title>
        <meta name="description" content="Enterprise-grade portfolio analysis with institutional stress testing and bespoke recommendations." />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" />
              Enterprise Tier
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Portfolio Enterprise Report
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Institutional-grade stress testing, bespoke recommendations, and direct analyst support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-500" />
                    Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>✓ All Professional features included</li>
                    <li>✓ Institutional stress testing (2008, COVID, etc.)</li>
                    <li>✓ Custom scenario modelling</li>
                    <li>✓ Tax optimization strategies</li>
                    <li>✓ Regulatory compliance check</li>
                    <li>✓ Bespoke AI recommendations</li>
                    <li>✓ PDF export with white-label option</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-500" />
                    Direct Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    As an Enterprise client, you have direct access to our research team for custom analysis requests.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = 'mailto:research@aries76.com?subject=Enterprise Report Request'}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Research Team
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Enterprise reports are generated within 24-48 hours by our research team.
              </p>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                View Your Reports
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PortfolioEnterprise;
