import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { LogOut, CreditCard, Download, TrendingUp, BarChart3, Users, Target } from 'lucide-react';

const SneakerReport = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        } else {
          checkUserAccess(session.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        checkUserAccess(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserAccess = async (userId: string) => {
    try {
      const { data: userOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('product_type', 'sneaker_report')
        .eq('status', 'paid');

      if (error) throw error;

      setOrders(userOrders || []);
      setHasAccess((userOrders || []).length > 0);
    } catch (error) {
      console.error('Error checking access:', error);
      toast.error('Error checking access status');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) return;
    
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_type: 'sneaker_report',
          amount: 10000.00,
          currency: 'GBP',
          status: 'pending',
          payment_method: 'bank_transfer'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Order created! Please proceed with bank transfer payment.');
      
      // Refresh orders
      checkUserAccess(user.id);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-aries-navy">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-aries-navy/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/ba0e4dd6-4e22-4db9-9da2-6b3359300d31.png" 
              alt="Aries76 Logo" 
              className="h-12" 
            />
            <h1 className="text-2xl font-bold text-aries-navy">Sneaker Intelligence Report</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-aries-navy">Welcome, {user?.email}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 border-aries-navy text-aries-navy hover:bg-aries-navy hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {!hasAccess ? (
          <div className="max-w-4xl mx-auto">
            {/* Purchase Section */}
            <Card className="mb-8 border-aries-navy/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-aries-navy mb-4">
                  Premium Sneaker Market Intelligence Report
                </CardTitle>
                <CardDescription className="text-lg text-aries-navy/70">
                  Comprehensive analysis of 65+ consumer sneaker models with market insights, resale metrics, and brand performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-aries-orange mx-auto mb-4" />
                    <h3 className="font-semibold text-aries-navy">Market Analysis</h3>
                    <p className="text-sm text-aries-navy/70">Deep dive into pricing trends and market positioning</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-aries-orange mx-auto mb-4" />
                    <h3 className="font-semibold text-aries-navy">Resale Metrics</h3>
                    <p className="text-sm text-aries-navy/70">Growth percentages and investment potential</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-12 w-12 text-aries-orange mx-auto mb-4" />
                    <h3 className="font-semibold text-aries-navy">Target Segments</h3>
                    <p className="text-sm text-aries-navy/70">Consumer profiles and market demographics</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-aries-navy mb-2">£10,000</div>
                  <p className="text-aries-navy/70 mb-6">One-time payment via bank transfer</p>
                  
                  <Button 
                    onClick={handlePurchase}
                    disabled={paymentLoading}
                    className="bg-aries-orange hover:bg-aries-orange/90 text-white px-8 py-3 text-lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {paymentLoading ? 'Processing...' : 'Purchase Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            {orders.some(order => order.status === 'pending') && (
              <Card className="border-aries-orange/20 bg-aries-orange/5">
                <CardHeader>
                  <CardTitle className="text-aries-navy flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="border-aries-orange/20 bg-aries-orange/10">
                    <AlertDescription className="text-aries-navy">
                      <strong>Bank Transfer Details:</strong><br />
                      Account Name: Aries76 Ltd<br />
                      Sort Code: 12-34-56<br />
                      Account Number: 87654321<br />
                      Reference: Your Order ID<br />
                      Amount: £10,000.00 GBP<br /><br />
                      
                      Please contact quinley.martini@aries76.com with proof of payment to activate your access.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Report Access Section */
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-aries-navy mb-4">Your Sneaker Intelligence Report</h2>
              <Badge className="bg-green-100 text-green-800 border-green-200">Access Granted</Badge>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Report Preview */}
              <Card className="border-aries-navy/20">
                <CardHeader>
                  <CardTitle className="text-aries-navy">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-aries-navy/5 rounded-lg">
                        <div className="text-2xl font-bold text-aries-navy">65+</div>
                        <div className="text-sm text-aries-navy/70">Sneaker Models</div>
                      </div>
                      <div className="text-center p-4 bg-aries-orange/5 rounded-lg">
                        <div className="text-2xl font-bold text-aries-navy">12</div>
                        <div className="text-sm text-aries-navy/70">Major Brands</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium text-aries-navy">Nike Air Jordan 1</span>
                        <Badge className="bg-green-100 text-green-800">High Resale</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium text-aries-navy">Adidas Yeezy 350</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium Resale</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium text-aries-navy">New Balance 990</span>
                        <Badge className="bg-blue-100 text-blue-800">Stable Growth</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Section */}
              <Card className="border-aries-orange/20">
                <CardHeader>
                  <CardTitle className="text-aries-navy">Download Report</CardTitle>
                  <CardDescription>Access your comprehensive sneaker market analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full bg-aries-orange hover:bg-aries-orange/90 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report (PDF)
                    </Button>
                    
                    <Button variant="outline" className="w-full border-aries-navy text-aries-navy hover:bg-aries-navy hover:text-white">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Interactive Dashboard
                    </Button>
                    
                    <Button variant="outline" className="w-full border-aries-navy text-aries-navy hover:bg-aries-navy hover:text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Market Comparison Tool
                    </Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-aries-navy/5 rounded-lg">
                    <p className="text-sm text-aries-navy/70">
                      This report includes exclusive market data, brand analysis, and resale predictions. 
                      Updates are provided quarterly to subscribers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SneakerReport;