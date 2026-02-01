import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PieChart,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  tier: string;
  status: string;
  amount_paid: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
  expires_at: string | null;
}

interface Scan {
  id: string;
  email: string;
  holdings: any;
  risk_score: number | null;
  created_at: string;
}

const PortfolioDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [inputEmail, setInputEmail] = useState('');

  // Check for stored email
  useEffect(() => {
    const storedEmail = localStorage.getItem('portfolio_user_email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchUserData(storedEmail);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (userEmail: string) => {
    setIsLoading(true);
    try {
      // Fetch purchases
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('portfolio_purchases')
        .select('*')
        .eq('email', userEmail.toLowerCase())
        .order('created_at', { ascending: false });

      if (purchaseError) throw purchaseError;
      setPurchases(purchaseData || []);

      // Fetch scans
      const { data: scanData, error: scanError } = await supabase
        .from('portfolio_scans')
        .select('*')
        .eq('email', userEmail.toLowerCase())
        .order('created_at', { ascending: false });

      if (scanError) throw scanError;
      setScans(scanData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading your data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerify = async () => {
    if (!inputEmail || !inputEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsVerifying(true);
    
    // Simple verification - check if they have any records
    try {
      const { data, error } = await supabase
        .from('portfolio_purchases')
        .select('id')
        .eq('email', inputEmail.toLowerCase())
        .limit(1);

      const { data: scanData } = await supabase
        .from('portfolio_scans')
        .select('id')
        .eq('email', inputEmail.toLowerCase())
        .limit(1);

      if ((data && data.length > 0) || (scanData && scanData.length > 0)) {
        localStorage.setItem('portfolio_user_email', inputEmail.toLowerCase());
        setEmail(inputEmail.toLowerCase());
        fetchUserData(inputEmail.toLowerCase());
        toast.success('Welcome back!');
      } else {
        toast.error('No records found for this email. Try running a free scan first!');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Error verifying email');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_user_email');
    setEmail('');
    setPurchases([]);
    setScans([]);
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'professional': return 'bg-primary/10 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-400"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Login/Email Verification Screen
  if (!email) {
    return (
      <>
        <Helmet>
          <title>Portfolio Dashboard | ARIES76</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Access Your Dashboard</CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the email you used for your scans or purchases
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleEmailVerify}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
                <Separator />
                <p className="text-center text-sm text-muted-foreground">
                  New here?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate('/portfolio-scan')}
                  >
                    Get a free scan first →
                  </Button>
                </p>
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
        <title>Your Reports | ARIES76</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="border-b border-border/40 bg-card/50">
          <div className="container max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
                <p className="text-muted-foreground text-sm">{email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-6xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="reports">
              <TabsList className="mb-6">
                <TabsTrigger value="reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports ({purchases.length})
                </TabsTrigger>
                <TabsTrigger value="scans">
                  <PieChart className="h-4 w-4 mr-2" />
                  Free Scans ({scans.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reports">
                {purchases.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Get your first professional portfolio analysis report.
                      </p>
                      <Button onClick={() => navigate('/portfolio-analysis')}>
                        View Report Options
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {purchases.map((purchase) => (
                      <motion.div
                        key={purchase.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold capitalize">{purchase.tier} Report</h3>
                                    <Badge className={getTierBadgeColor(purchase.tier)}>
                                      {purchase.tier}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Purchased {new Date(purchase.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {getStatusBadge(purchase.status)}
                                <span className="font-semibold">
                                  £{purchase.amount_paid}
                                </span>
                                {purchase.status === 'completed' && (
                                  <Button size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="scans">
                {scans.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Scans Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Run your first free portfolio scan to see results here.
                      </p>
                      <Button onClick={() => navigate('/portfolio-scan')}>
                        Start Free Scan
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {scans.map((scan) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-1">
                                    Portfolio Scan
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(scan.created_at).toLocaleDateString()} • {Array.isArray(scan.holdings) ? scan.holdings.length : 0} holdings
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-2xl font-bold">{scan.risk_score || '--'}</p>
                                  <p className="text-xs text-muted-foreground">Risk Score</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => navigate('/portfolio-scan')}>
                                  Run Again
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Upgrade CTA */}
          {purchases.filter(p => p.status === 'completed').length === 0 && (
            <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/5 to-orange-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Ready for Professional Analysis?</h3>
                    <p className="text-sm text-muted-foreground">
                      Get Monte Carlo simulations, tax optimization, and AI recommendations.
                    </p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-primary to-orange-500"
                    onClick={() => navigate('/portfolio-analysis#portfolio-pricing')}
                  >
                    View Reports
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioDashboard;
