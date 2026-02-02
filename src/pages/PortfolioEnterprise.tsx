import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  EnterpriseReportView, 
  EnhancedPortfolioInput,
  PortfolioHolding 
} from '@/components/portfolio-report';

const PortfolioEnterprise = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);

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

  const handlePortfolioChange = useCallback((newHoldings: PortfolioHolding[]) => {
    setHoldings(newHoldings);
  }, []);

  const generateReport = async () => {
    const validHoldings = holdings.filter(h => h.ticker.trim() && h.weight > 0);
    
    if (validHoldings.length === 0) {
      toast.error('Please enter at least one holding');
      return;
    }

    setIsGenerating(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-enterprise-report', {
        body: {
          email: user?.email,
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
        toast.success('Enterprise Report generated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Report generation error:', err);
      toast.error(err.message || 'Error generating report');
    } finally {
      setIsGenerating(false);
    }
  };

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
              Institutional stress testing, tax optimization, regulatory compliance, and AI-powered recommendations.
            </p>
          </motion.div>

          {!report ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="max-w-2xl mx-auto">
                <EnhancedPortfolioInput onPortfolioChange={handlePortfolioChange} />
              </div>

              <div className="max-w-md mx-auto">
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                  size="lg"
                  onClick={generateReport}
                  disabled={isGenerating || holdings.length === 0}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running Institutional Analysis...
                    </>
                  ) : (
                    'Generate Enterprise Report'
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <Button variant="outline" onClick={() => setReport(null)}>
                  ← Run Another Analysis
                </Button>
              </div>
              
              <EnterpriseReportView report={report} email={user.email} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioEnterprise;
