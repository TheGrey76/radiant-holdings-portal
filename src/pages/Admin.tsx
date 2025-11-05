import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Mail, Calendar, Loader2, LogOut, Home, Users, PenSquare, Building2, Eye, CheckCircle, XCircle, Trash2, MessageSquare, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  subscribed: boolean;
}

interface LPRegistration {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  role: string | null;
  jurisdiction: string | null;
  investor_type: string | null;
  areas_of_interest: string[] | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GPRegistration {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  role: string;
  firm_name: string;
  firm_website: string | null;
  work_email: string;
  aum_bracket: string;
  primary_strategy: string[];
  main_fund_in_market: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [lpRegistrations, setLpRegistrations] = useState<LPRegistration[]>([]);
  const [gpRegistrations, setGpRegistrations] = useState<GPRegistration[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [selectedLP, setSelectedLP] = useState<LPRegistration | null>(null);
  const [selectedGP, setSelectedGP] = useState<GPRegistration | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase.rpc('get_current_user_role');
      
      if (roleData !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSubscribers();
      fetchLPRegistrations();
      fetchGPRegistrations();
      fetchContactInquiries();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLPRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('lp_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLpRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching LP registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load LP registrations",
        variant: "destructive",
      });
    }
  };

  const fetchGPRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('gp_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGpRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching GP registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load GP registrations",
        variant: "destructive",
      });
    }
  };

  const fetchContactInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContactInquiries(data || []);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load contact inquiries",
        variant: "destructive",
      });
    }
  };

  const updateLPStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lp_registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      await fetchLPRegistrations();
      toast({
        title: "Success",
        description: "LP status updated successfully",
      });
    } catch (error) {
      console.error("Error updating LP status:", error);
      toast({
        title: "Error",
        description: "Failed to update LP status",
        variant: "destructive",
      });
    }
  };

  const deleteLPRegistration = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa registrazione LP?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lp_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchLPRegistrations();
      toast({
        title: "Success",
        description: "LP registration deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting LP registration:", error);
      toast({
        title: "Error",
        description: "Failed to delete LP registration",
        variant: "destructive",
      });
    }
  };

  const deleteContactInquiry = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa richiesta di contatto?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContactInquiries();
      toast({
        title: "Success",
        description: "Contact inquiry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact inquiry",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Status'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString(),
        sub.subscribed ? 'Active' : 'Unsubscribed'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Subscribers exported to CSV",
    });
  };

  const exportLPToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Organization', 'Role', 'Jurisdiction', 'Investor Type', 'Status', 'Date'],
      ...lpRegistrations.map(lp => [
        lp.full_name,
        lp.email,
        lp.organization,
        lp.role || '',
        lp.jurisdiction || '',
        lp.investor_type || '',
        lp.status,
        new Date(lp.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lp-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "LP registrations exported to CSV",
    });
  };

  const exportGPToCSV = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Role', 'Firm', 'Website', 'AUM Bracket', 'Strategy', 'Fund in Market', 'Date'],
      ...gpRegistrations.map(gp => [
        gp.first_name,
        gp.last_name,
        gp.work_email,
        gp.role,
        gp.firm_name,
        gp.firm_website || '',
        gp.aum_bracket,
        gp.primary_strategy.join('; '),
        gp.main_fund_in_market || '',
        new Date(gp.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gp-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "GP registrations exported to CSV",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-light tracking-wider text-white uppercase">
                ARIES<span className="text-accent">76</span>
              </Link>
              <span className="text-white/40">|</span>
              <span className="text-white/70 text-sm">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Newsletter</p>
                  <p className="text-3xl font-light text-white">{subscribers.length}</p>
                </div>
                <Users className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">LP Registrations</p>
                  <p className="text-3xl font-light text-white">{lpRegistrations.length}</p>
                </div>
                <Building2 className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">GP Registrations</p>
                  <p className="text-3xl font-light text-white">{gpRegistrations.length}</p>
                </div>
                <Briefcase className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Contact Forms</p>
                  <p className="text-3xl font-light text-white">{contactInquiries.length}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">New Requests</p>
                  <p className="text-3xl font-light text-white">
                    {contactInquiries.filter(inq => inq.status === 'new').length}
                  </p>
                </div>
                <Mail className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">This Month</p>
                  <p className="text-3xl font-light text-white">
                    {(lpRegistrations.filter(lp => {
                      const lpDate = new Date(lp.created_at);
                      const now = new Date();
                      return lpDate.getMonth() === now.getMonth() && 
                             lpDate.getFullYear() === now.getFullYear();
                    }).length + gpRegistrations.filter(gp => {
                      const gpDate = new Date(gp.created_at);
                      const now = new Date();
                      return gpDate.getMonth() === now.getMonth() && 
                             gpDate.getFullYear() === now.getFullYear();
                    }).length)}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LP Registrations Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl font-light flex items-center gap-3">
                <Building2 className="w-6 h-6 text-accent" />
                LP Registrations
              </CardTitle>
              <Button
                onClick={exportLPToCSV}
                variant="outline"
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={lpRegistrations.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lpRegistrations.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">No LP registrations yet</p>
                <p className="text-white/30 text-sm mt-2">
                  LP registrations will appear here when investors submit the form
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 font-light">Name</TableHead>
                      <TableHead className="text-white/70 font-light">Email</TableHead>
                      <TableHead className="text-white/70 font-light">Organization</TableHead>
                      <TableHead className="text-white/70 font-light">Investor Type</TableHead>
                      <TableHead className="text-white/70 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead className="text-white/70 font-light">Status</TableHead>
                      <TableHead className="text-white/70 font-light">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lpRegistrations.map((lp) => (
                      <TableRow 
                        key={lp.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white font-light">
                          {lp.full_name}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {lp.email}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {lp.organization}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {lp.investor_type || '-'}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {new Date(lp.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={lp.status === 'new' ? 'default' : lp.status === 'contacted' ? 'secondary' : 'outline'}
                            className={
                              lp.status === 'new' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : lp.status === 'contacted'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }
                          >
                            {lp.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedLP(lp)}
                              className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {lp.status === 'new' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateLPStatus(lp.id, 'contacted')}
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteLPRegistration(lp.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GP Registrations Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl font-light flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-accent" />
                GP Registrations
              </CardTitle>
              <Button
                onClick={exportGPToCSV}
                variant="outline"
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={gpRegistrations.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {gpRegistrations.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">No GP registrations yet</p>
                <p className="text-white/30 text-sm mt-2">
                  GP registrations will appear here when GPs sign up
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 font-light">Name</TableHead>
                      <TableHead className="text-white/70 font-light">Email</TableHead>
                      <TableHead className="text-white/70 font-light">Firm</TableHead>
                      <TableHead className="text-white/70 font-light">AUM Bracket</TableHead>
                      <TableHead className="text-white/70 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead className="text-white/70 font-light">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gpRegistrations.map((gp) => (
                      <TableRow 
                        key={gp.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white font-light">
                          {gp.first_name} {gp.last_name}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {gp.work_email}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {gp.firm_name}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {gp.aum_bracket}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {new Date(gp.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedGP(gp)}
                            className="text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Inquiries Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl font-light flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-accent" />
                Contact Inquiries
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {contactInquiries.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">No contact inquiries yet</p>
                <p className="text-white/30 text-sm mt-2">
                  Contact form submissions will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 font-light">Name</TableHead>
                      <TableHead className="text-white/70 font-light">Email</TableHead>
                      <TableHead className="text-white/70 font-light">Company</TableHead>
                      <TableHead className="text-white/70 font-light">Inquiry Type</TableHead>
                      <TableHead className="text-white/70 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead className="text-white/70 font-light">Status</TableHead>
                      <TableHead className="text-white/70 font-light">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactInquiries.map((inquiry) => (
                      <TableRow 
                        key={inquiry.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white font-light">
                          {inquiry.name}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {inquiry.email}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {inquiry.company || '-'}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {inquiry.inquiry_type}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={inquiry.status === 'new' ? 'default' : 'secondary'}
                            className={
                              inquiry.status === 'new' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }
                          >
                            {inquiry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedInquiry(inquiry)}
                              className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteContactInquiry(inquiry.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl font-light flex items-center gap-3">
                <Mail className="w-6 h-6 text-accent" />
                Newsletter Subscribers
              </CardTitle>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/admin/newsletter')}
                  className="gap-2 bg-accent hover:bg-accent/90 text-white"
                >
                  <PenSquare className="w-4 h-4" />
                  Compose Newsletter
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  disabled={subscribers.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">No subscribers yet</p>
                <p className="text-white/30 text-sm mt-2">
                  Subscribers will appear here when they sign up via the Blog page
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 font-light">Email</TableHead>
                      <TableHead className="text-white/70 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Subscribed Date
                        </div>
                      </TableHead>
                      <TableHead className="text-white/70 font-light">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow 
                        key={subscriber.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white font-light">
                          {subscriber.email}
                        </TableCell>
                        <TableCell className="text-white/70 font-light">
                          {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-light ${
                            subscriber.subscribed 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* LP Details Dialog */}
      <Dialog open={!!selectedLP} onOpenChange={(open) => !open && setSelectedLP(null)}>
        <DialogContent className="bg-gradient-to-br from-[#1a2744] to-[#0d1424] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">LP Registration Details</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete information about this LP registration
            </DialogDescription>
          </DialogHeader>
          {selectedLP && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Full Name</p>
                  <p className="text-white font-light">{selectedLP.full_name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Email</p>
                  <p className="text-white font-light">{selectedLP.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Organization</p>
                  <p className="text-white font-light">{selectedLP.organization}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Role</p>
                  <p className="text-white font-light">{selectedLP.role || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Jurisdiction</p>
                  <p className="text-white font-light">{selectedLP.jurisdiction || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Investor Type</p>
                  <p className="text-white font-light">{selectedLP.investor_type || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <Badge 
                    variant={selectedLP.status === 'new' ? 'default' : 'secondary'}
                    className={
                      selectedLP.status === 'new' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }
                  >
                    {selectedLP.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Registration Date</p>
                  <p className="text-white font-light">
                    {new Date(selectedLP.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {selectedLP.areas_of_interest && selectedLP.areas_of_interest.length > 0 && (
                <div>
                  <p className="text-white/60 text-sm mb-2">Areas of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLP.areas_of_interest.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-white/5 border-white/20 text-white">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedLP.message && (
                <div>
                  <p className="text-white/60 text-sm mb-2">Message</p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white font-light whitespace-pre-wrap">{selectedLP.message}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/10">
                {selectedLP.status === 'new' && (
                  <Button
                    onClick={() => {
                      updateLPStatus(selectedLP.id, 'contacted');
                      setSelectedLP(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Contacted
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedLP(null)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* GP Details Dialog */}
      <Dialog open={!!selectedGP} onOpenChange={(open) => !open && setSelectedGP(null)}>
        <DialogContent className="bg-gradient-to-br from-[#1a2744] to-[#0d1424] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">GP Registration Details</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete information about this GP registration
            </DialogDescription>
          </DialogHeader>
          {selectedGP && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">First Name</p>
                  <p className="text-white font-light">{selectedGP.first_name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Last Name</p>
                  <p className="text-white font-light">{selectedGP.last_name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Email</p>
                  <p className="text-white font-light">{selectedGP.work_email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Role</p>
                  <p className="text-white font-light">{selectedGP.role}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Firm Name</p>
                  <p className="text-white font-light">{selectedGP.firm_name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Firm Website</p>
                  <p className="text-white font-light">
                    {selectedGP.firm_website ? (
                      <a href={selectedGP.firm_website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {selectedGP.firm_website}
                      </a>
                    ) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">AUM Bracket</p>
                  <p className="text-white font-light">{selectedGP.aum_bracket}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Main Fund in Market</p>
                  <p className="text-white font-light">{selectedGP.main_fund_in_market || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-white/60 text-sm mb-1">Registration Date</p>
                  <p className="text-white font-light">
                    {new Date(selectedGP.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {selectedGP.primary_strategy && selectedGP.primary_strategy.length > 0 && (
                <div>
                  <p className="text-white/60 text-sm mb-2">Primary Strategy</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGP.primary_strategy.map((strategy, index) => (
                      <Badge key={index} variant="outline" className="bg-white/5 border-white/20 text-white">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGP(null)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Inquiry Details Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="bg-gradient-to-br from-[#1a2744] to-[#0d1424] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">Contact Inquiry Details</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete information about this contact inquiry
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Name</p>
                  <p className="text-white font-light">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Email</p>
                  <p className="text-white font-light">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Phone</p>
                  <p className="text-white font-light">{selectedInquiry.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Company</p>
                  <p className="text-white font-light">{selectedInquiry.company || '-'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Inquiry Type</p>
                  <p className="text-white font-light">{selectedInquiry.inquiry_type}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <Badge 
                    variant={selectedInquiry.status === 'new' ? 'default' : 'secondary'}
                    className={
                      selectedInquiry.status === 'new' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {selectedInquiry.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Date</p>
                  <p className="text-white font-light">
                    {new Date(selectedInquiry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Message</p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-light whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
