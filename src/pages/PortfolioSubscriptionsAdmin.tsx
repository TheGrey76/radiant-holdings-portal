import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { 
  Loader2, 
  Users, 
  CreditCard, 
  TrendingUp,
  FileText,
  BarChart3,
  Building2,
  RefreshCw,
  Calendar,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface Subscription {
  id: string;
  user_id: string;
  tier: 'essentials' | 'professional' | 'enterprise';
  is_active: boolean;
  stripe_payment_id: string | null;
  created_at: string;
  expires_at: string | null;
  user_email?: string;
}

interface SubscriptionStats {
  total: number;
  essentials: number;
  professional: number;
  enterprise: number;
  revenue: number;
}

const tierConfig = {
  essentials: { 
    icon: FileText, 
    color: 'bg-primary/10 text-primary', 
    price: 149,
    label: 'Essentials'
  },
  professional: { 
    icon: BarChart3, 
    color: 'bg-blue-500/10 text-blue-500', 
    price: 349,
    label: 'Professional'
  },
  enterprise: { 
    icon: Building2, 
    color: 'bg-amber-500/10 text-amber-500', 
    price: 749,
    label: 'Enterprise'
  },
};

const PortfolioSubscriptionsAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    total: 0,
    essentials: 0,
    professional: 0,
    enterprise: 0,
    revenue: 0,
  });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails for each subscription
      const subsWithEmails: Subscription[] = [];
      for (const sub of data || []) {
        // Try to get user email from auth
        const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
        subsWithEmails.push({
          ...sub,
          user_email: userData?.user?.email || 'Unknown'
        });
      }

      setSubscriptions(data || []);

      // Calculate stats
      const activeOnly = (data || []).filter(s => s.is_active);
      const essentialsCount = activeOnly.filter(s => s.tier === 'essentials').length;
      const professionalCount = activeOnly.filter(s => s.tier === 'professional').length;
      const enterpriseCount = activeOnly.filter(s => s.tier === 'enterprise').length;

      setStats({
        total: activeOnly.length,
        essentials: essentialsCount,
        professional: professionalCount,
        enterprise: enterpriseCount,
        revenue: (essentialsCount * 149) + (professionalCount * 349) + (enterpriseCount * 749),
      });
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
      if (data) {
        fetchSubscriptions();
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Portfolio Subscriptions | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Portfolio Subscriptions</h1>
              <p className="text-muted-foreground">
                Monitor and manage portfolio report subscriptions
              </p>
            </div>
            <Button onClick={fetchSubscriptions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Active</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Essentials</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.essentials}</div>
                <p className="text-xs text-muted-foreground">£{stats.essentials * 149}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Professional</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.professional}</div>
                <p className="text-xs text-muted-foreground">£{stats.professional * 349}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Enterprise</CardTitle>
                <Building2 className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.enterprise}</div>
                <p className="text-xs text-muted-foreground">£{stats.enterprise * 749}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{stats.revenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                All Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No subscriptions yet</p>
                  <p className="text-sm">Subscriptions will appear here after purchases</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => {
                      const config = tierConfig[sub.tier];
                      const Icon = config.icon;
                      
                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="font-mono text-xs">
                            {sub.user_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={sub.is_active ? 'default' : 'secondary'}>
                              {sub.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {format(new Date(sub.created_at), 'dd MMM yyyy')}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {sub.expires_at 
                              ? format(new Date(sub.expires_at), 'dd MMM yyyy')
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {sub.stripe_payment_id 
                              ? `${sub.stripe_payment_id.slice(0, 12)}...`
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PortfolioSubscriptionsAdmin;
