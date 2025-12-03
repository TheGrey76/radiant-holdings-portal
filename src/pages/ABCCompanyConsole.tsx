import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, 
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2, X, Plus,
  ExternalLink, Paperclip, Edit, Trash2, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ABCActivityFeed } from "@/components/ABCActivityFeed";
import { ABCInvestorKanban } from "@/components/ABCInvestorKanban";
import { ImportABCInvestorsDialog } from "@/components/ImportABCInvestorsDialog";
import { EditableFunnelStage } from "@/components/EditableFunnelStage";
import { EditableOverallProgress } from "@/components/EditableOverallProgress";
import { EditableKPI } from "@/components/EditableKPI";
import { ABCAnalyticsTab } from "@/components/ABCAnalyticsTab";
import { useKPIHistory } from "@/hooks/useKPIHistory";
import { supabase } from "@/integrations/supabase/client";

// All investor data is now fetched dynamically from Supabase

const ABCCompanyConsole = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { recordSnapshot } = useKPIHistory();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [investors, setInvestors] = useState<any[]>([]);
  const [loadingInvestors, setLoadingInvestors] = useState(true);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<any[]>([]);
  const [customFunnelData, setCustomFunnelData] = useState<any[] | null>(null);
  const [progressData, setProgressData] = useState({
    targetAmount: 10000000,
    raisedAmount: 0,
    deadline: "2026-06-30",
  });
  const [meetingsKPI, setMeetingsKPI] = useState({
    current: 0,
    target: 20,
    percentage: 0,
  });
  const [closedKPI, setClosedKPI] = useState({
    current: 0,
    target: 10000000,
    percentage: 0,
  });

  // Fetch investors from Supabase and load saved data
  useEffect(() => {
    fetchInvestors();
    fetchUpcomingFollowUps();

    const savedProgress = localStorage.getItem("abc-progress-data");
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }

    const savedMeetings = localStorage.getItem("abc-meetings-kpi");
    if (savedMeetings) {
      setMeetingsKPI(JSON.parse(savedMeetings));
    }

    const savedClosed = localStorage.getItem("abc-closed-kpi");
    if (savedClosed) {
      setClosedKPI(JSON.parse(savedClosed));
    }
  }, []);

  // Record daily KPI snapshot automatically
  useEffect(() => {
    const recordDailySnapshot = () => {
      const totalPipeline = investors.reduce((sum, inv) => sum + inv.pipelineValue, 0);
      const closedInvestors = investors.filter(inv => inv.status === "Closed");
      const closedValue = closedInvestors.reduce((sum, inv) => sum + inv.pipelineValue, 0);

      recordSnapshot({
        raisedAmount: progressData.raisedAmount,
        targetAmount: progressData.targetAmount,
        pipelineValue: totalPipeline,
        closedDealsCount: closedKPI.current,
        closedDealsValue: closedValue,
        meetingsCount: meetingsKPI.current,
        meetingsTarget: meetingsKPI.target,
      });
    };

    // Record snapshot when data is available
    if (investors.length > 0) {
      recordDailySnapshot();
    }
  }, [investors, progressData, closedKPI, meetingsKPI, recordSnapshot]);

  const fetchUpcomingFollowUps = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data, error } = await supabase
        .from('abc_investor_followups' as any)
        .select('*')
        .gte('follow_up_date', today.toISOString().split('T')[0])
        .lte('follow_up_date', nextWeek.toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('follow_up_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setUpcomingFollowUps(data || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const fetchInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('abc_investors' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to match component interface
      const transformedInvestors = (data || []).map((inv: any) => ({
        id: inv.id,
        nome: inv.nome,
        azienda: inv.azienda,
        ruolo: inv.ruolo,
        categoria: inv.categoria,
        citta: inv.citta,
        fonte: inv.fonte,
        linkedin: inv.linkedin,
        email: inv.email,
        phone: inv.phone,
        priorita: inv.priorita,
        status: inv.status,
        pipelineValue: Number(inv.pipeline_value),
        probability: inv.probability,
        expectedClose: inv.expected_close,
        relationshipOwner: inv.relationship_owner,
        rilevanza: inv.rilevanza,
        lastContactDate: inv.last_contact_date,
        nextFollowUpDate: inv.next_follow_up_date,
      }));

      setInvestors(transformedInvestors);
      setLoadingInvestors(false);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Failed to load investors');
      setLoadingInvestors(false);
    }
  };

  // KPI Data - calculated from real Supabase investor data
  const totalPipelineValue = investors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
  const closedInvestors = investors.filter(inv => inv.status === "Closed");
  const closedValue = closedInvestors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
  const meetingInvestors = investors.filter(inv => inv.status === "Meeting Scheduled" || inv.status === "In Negotiation");
  
  const kpis = {
    contacts: { current: investors.length, target: 352, percentage: Math.round((investors.length / 352) * 100) },
    meetings: { current: meetingInvestors.length, target: 20, percentage: Math.round((meetingInvestors.length / 20) * 100) },
    pipeline: { current: totalPipelineValue, target: 10000000, percentage: Math.round((totalPipelineValue / 10000000) * 100) },
    closed: { current: closedValue, target: 10000000, percentage: Math.round((closedValue / 10000000) * 100) }
  };

  // Recent Activity - updated with real investor names
  const recentActivity = [
    { investor: "Marco Boschetti (Family Office Italia)", action: "Meeting scheduled for Dec 10, 2024", time: "2 hours ago" },
    { investor: "Carlotta de Courten (Fondo Italiano SGR)", action: 'Email sent: "ABC Company Opportunity"', time: "5 hours ago" },
    { investor: "Patrizia Polonia (Fideuram Private Banking)", action: 'Note added: "Very interested, wants financials"', time: "1 day ago" },
    { investor: "Andrea Reale (Fondo Italiano SGR)", action: "Status changed: Contacted → Meeting", time: "2 days ago" }
  ];

  // Conversion Funnel Data - calculated from Supabase investor data
  const statusCounts = {
    total: investors.length,
    contacted: investors.filter(inv => ["Contacted", "Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    interested: investors.filter(inv => ["Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    meetings: investors.filter(inv => ["Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    negotiation: investors.filter(inv => ["In Negotiation", "Closed"].includes(inv.status)).length,
    closed: investors.filter(inv => inv.status === "Closed").length
  };

  const defaultFunnelData = [
    { stage: "Contacts", count: statusCounts.total, percentage: 100 },
    { stage: "Contacted", count: statusCounts.contacted, percentage: statusCounts.total ? Math.round((statusCounts.contacted / statusCounts.total) * 100) : 0 },
    { stage: "Interested", count: statusCounts.interested, percentage: statusCounts.total ? Math.round((statusCounts.interested / statusCounts.total) * 100) : 0 },
    { stage: "Meetings", count: statusCounts.meetings, percentage: statusCounts.total ? Math.round((statusCounts.meetings / statusCounts.total) * 100) : 0 },
    { stage: "Negotiation", count: statusCounts.negotiation, percentage: statusCounts.total ? Math.round((statusCounts.negotiation / statusCounts.total) * 100) : 0 },
    { stage: "Closed", count: statusCounts.closed, percentage: statusCounts.total ? Math.round((statusCounts.closed / statusCounts.total) * 100) : 0 }
  ];

  const funnelData = customFunnelData || defaultFunnelData;

  const handleFunnelUpdate = (newStages: any[]) => {
    setCustomFunnelData(newStages);
    // Optionally save to localStorage or database
    localStorage.setItem('abc_funnel_data', JSON.stringify(newStages));
  };

  const handleProgressUpdate = (newProgress: typeof progressData) => {
    setProgressData(newProgress);
    localStorage.setItem("abc-progress-data", JSON.stringify(newProgress));
  };

  const handleMeetingsUpdate = (newData: typeof meetingsKPI) => {
    setMeetingsKPI(newData);
    localStorage.setItem("abc-meetings-kpi", JSON.stringify(newData));
  };

  const handleClosedUpdate = (newData: typeof closedKPI) => {
    setClosedKPI(newData);
    localStorage.setItem("abc-closed-kpi", JSON.stringify(newData));
  };

  const formatCurrency = (value: number) => {
    return `€${(value / 1000000).toFixed(1)}M`;
  };

  // Load custom funnel data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('abc_funnel_data');
    if (saved) {
      try {
        setCustomFunnelData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved funnel data');
      }
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-l-primary";
      case "medium": return "border-l-4 border-l-blue-500";
      case "low": return "border-l-4 border-l-muted";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      "to-contact": { label: "To Contact", color: "bg-muted text-muted-foreground" },
      "contacted": { label: "Contacted", color: "bg-blue-500/10 text-blue-600" },
      "interested": { label: "Interested", color: "bg-yellow-500/10 text-yellow-600" },
      "meeting": { label: "Meeting Scheduled", color: "bg-purple-500/10 text-purple-600" },
      "negotiation": { label: "In Negotiation", color: "bg-primary/10 text-primary" },
      "closed": { label: "Closed", color: "bg-green-500/10 text-green-600" },
      "not-interested": { label: "Not Interested", color: "bg-red-500/10 text-red-600" }
    };
    return statusMap[status] || statusMap["to-contact"];
  };

  const getFilteredInvestors = () => {
    return investors.filter(inv => {
      const matchesSearch = 
        inv.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.azienda?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || inv.categoria === filterCategory;
      const matchesSource = filterSource === "all" || inv.fonte === filterSource;
      
      return matchesSearch && matchesCategory && matchesSource;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ABC COMPANY FUNDRAISING CONSOLE</h1>
              <p className="text-sm text-muted-foreground">Target: €10,000,000 | Deadline: June 30, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <ImportABCInvestorsDialog onSuccess={fetchInvestors} />
              <span className="text-sm text-muted-foreground">User: Edoardo Grigione</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">CONTACTS</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{kpis.contacts.current}/{kpis.contacts.target}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.contacts.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <EditableKPI
                  title="Meetings"
                  data={meetingsKPI}
                  icon={Calendar}
                  onUpdate={handleMeetingsUpdate}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">PIPELINE</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.pipeline.current)}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.pipeline.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <EditableKPI
                  title="Closed"
                  data={closedKPI}
                  icon={CheckCircle}
                  onUpdate={handleClosedUpdate}
                  formatter={formatCurrency}
                />
              </motion.div>
            </div>

            {/* Timeline Progress */}
            <Card>
              <CardHeader>
                <CardTitle>OVERALL PROGRESS</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableOverallProgress 
                  data={progressData}
                  onUpdate={handleProgressUpdate}
                />
              </CardContent>
            </Card>

            {/* Real-time Activity Feed */}
            <ABCActivityFeed />

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  CONVERSION FUNNEL
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCustomFunnelData(null);
                      localStorage.removeItem('abc_funnel_data');
                      toast.success("Funnel reset to default");
                    }}
                  >
                    Reset to Default
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableFunnelStage
                  stages={funnelData}
                  onUpdate={handleFunnelUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* INVESTORS TAB */}
          <TabsContent value="investors" className="space-y-6">
            {/* Investor Management KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">To Contact</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'To Contact').length}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => ['Contacted', 'Interested', 'Meeting Scheduled'].includes(i.status)).length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Negotiation</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'In Negotiation').length}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Closed</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'Closed').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions & Upcoming Follow-ups */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast.info("Select an investor to add notes")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast.info("Select an investor to schedule follow-up")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Pipeline
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Follow-ups */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Follow-ups (Next 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {upcomingFollowUps.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No follow-ups scheduled for the next 7 days
                      </p>
                    ) : (
                      upcomingFollowUps.map((followUp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{followUp.investor_name}</p>
                            <p className="text-xs text-muted-foreground">{followUp.follow_up_type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">
                              {new Date(followUp.follow_up_date).toLocaleDateString('it-IT', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {followUp.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Family Office">Family Office</SelectItem>
                    <SelectItem value="Istituzionale">Istituzionale</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Ricerca Esterna">Direct</SelectItem>
                    <SelectItem value="Network LinkedIn">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Kanban Board */}
            {loadingInvestors ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-pulse">
                    <p className="text-muted-foreground">Loading investors...</p>
                  </div>
                </CardContent>
              </Card>
            ) : investors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No investors found</p>
                  <p className="text-sm text-muted-foreground">Import investor data to get started</p>
                </CardContent>
              </Card>
            ) : (
              <ABCInvestorKanban
                investors={getFilteredInvestors()}
                onStatusChange={fetchInvestors}
              />
            )}
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <ABCAnalyticsTab />
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC COMPANY FUNDRAISING TIMELINE</CardTitle>
                <p className="text-sm text-muted-foreground">December 2024 → June 2026</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Phase Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-2 border-green-500/20 bg-green-500/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 1: Outreach</CardTitle>
                          <Badge className="bg-green-500 text-white">✅ DONE</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Dec 2024 - Jan 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: Contact 57 high-priority investors</p>
                        <Progress value={100} className="h-2" />
                        <p className="text-sm font-semibold text-green-600">57/57 contacts reached (100%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: January 31, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 2: Initial Meetings</CardTitle>
                          <Badge className="bg-primary">⏳ IN PROGRESS</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Jan 2025 - Mar 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: Schedule 20 meetings with interested investors</p>
                        <Progress value={60} className="h-2" />
                        <p className="text-sm font-semibold text-primary">12/20 meetings scheduled (60%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: March 31, 2025 (120 days remaining)</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 3: Due Diligence</CardTitle>
                          <Badge variant="outline">UPCOMING</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Apr 2025 - Jun 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: 10 interested investors in DD process</p>
                        <Progress value={50} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">5/10 in progress (50%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: June 30, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 4: Negotiation</CardTitle>
                          <Badge variant="outline">UPCOMING</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Jul 2025 - Sep 2025</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: 5 active negotiations</p>
                        <Progress value={40} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">2/5 in negotiation (40%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: September 30, 2025</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 5: First Closing</CardTitle>
                          <Badge variant="outline">TARGET</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Oct 2025 - Jun 2026</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: €3-5M first closing</p>
                        <Progress value={30} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">€1.5M / €5M (30%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: June 30, 2026</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Phase 6: Second Closing</CardTitle>
                          <Badge variant="outline">TARGET</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Apr 2026 - Jun 2026</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: €5-7M (total €10M)</p>
                        <Progress value={0} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">€0 / €7M (0%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: June 30, 2026</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Alerts */}
                  <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-5 w-5" />
                        ATTENTION REQUIRED
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-foreground">• 8 meetings still needed to reach Phase 2 target</p>
                      <p className="text-sm text-foreground">• 5 investors not responding (follow-up needed)</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>BIWEEKLY REPORT</CardTitle>
                <p className="text-sm text-muted-foreground">Period: November 15 - November 30, 2024</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Report Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="text-foreground">Every 2 weeks (Monday)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipients:</span>
                        <span className="text-foreground">edoardo.grigione@aries76.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="text-foreground">PDF + Dashboard Link</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Report:</span>
                        <span className="text-primary font-semibold">December 16, 2024</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="gap-2" onClick={() => {
                        const reportData = {
                          period: "November 15 - November 30, 2024",
                          totalInvestors: investors.length,
                          byStatus: statusCounts,
                          totalPipeline: totalPipelineValue,
                          closedValue: closedValue,
                          topInvestors: [...investors]
                            .sort((a, b) => (b.pipelineValue || 0) - (a.pipelineValue || 0))
                            .slice(0, 5)
                        };
                        
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>ABC Company Fundraising Report</title>
                                <style>
                                  body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                                  h1 { color: #1a2332; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
                                  h2 { color: #1a2332; margin-top: 30px; }
                                  .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                                  .metric-value { font-weight: bold; color: #ff6b35; }
                                  .investor { padding: 10px; margin: 10px 0; background: #f5f5f5; border-radius: 8px; }
                                  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
                                </style>
                              </head>
                              <body>
                                <h1>ABC Company Capital Raise Report</h1>
                                <p>Period: ${reportData.period}</p>
                                <p>Generated: ${new Date().toLocaleDateString('it-IT')}</p>
                                
                                <h2>Pipeline Summary</h2>
                                <div class="metric"><span>Total Investors</span><span class="metric-value">${reportData.totalInvestors}</span></div>
                                <div class="metric"><span>Total Pipeline Value</span><span class="metric-value">€${(reportData.totalPipeline / 1000000).toFixed(2)}M</span></div>
                                <div class="metric"><span>Closed Value</span><span class="metric-value">€${(reportData.closedValue / 1000000).toFixed(2)}M</span></div>
                                
                                <h2>Status Breakdown</h2>
                                <div class="metric"><span>Total Contacts</span><span class="metric-value">${reportData.byStatus.total}</span></div>
                                <div class="metric"><span>Contacted</span><span class="metric-value">${reportData.byStatus.contacted}</span></div>
                                <div class="metric"><span>Interested</span><span class="metric-value">${reportData.byStatus.interested}</span></div>
                                <div class="metric"><span>Meeting Scheduled</span><span class="metric-value">${reportData.byStatus.meetings}</span></div>
                                <div class="metric"><span>In Negotiation</span><span class="metric-value">${reportData.byStatus.negotiation}</span></div>
                                <div class="metric"><span>Closed</span><span class="metric-value">${reportData.byStatus.closed}</span></div>
                                
                                <h2>Top 5 Investors by Pipeline Value</h2>
                                ${reportData.topInvestors.map((inv, i) => `
                                  <div class="investor">
                                    <strong>${i + 1}. ${inv.nome}</strong><br/>
                                    <span>${inv.azienda} - €${((inv.pipelineValue || 0) / 1000).toFixed(0)}K</span>
                                  </div>
                                `).join('')}
                                
                                <div class="footer">
                                  <p>ARIES76 Capital Intelligence | ABC Company Fundraising Console</p>
                                </div>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }
                        toast.success("Report generated successfully");
                      }}>
                        <FileText className="h-4 w-4" />
                        Generate Report Now
                      </Button>
                      <Button variant="outline">Edit Settings</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Key Achievements</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>12 new meetings scheduled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>3 investors moved to negotiation phase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>€500,000 commitment from Family Office Italia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>8 pitch presentations completed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                  <div className="border-t border-border pt-6">
                  <h4 className="font-semibold text-foreground mb-4">Top 5 Investors by Pipeline Value</h4>
                  <div className="space-y-3">
                    {[...investors]
                      .sort((a, b) => (b.pipelineValue || 0) - (a.pipelineValue || 0))
                      .slice(0, 5)
                      .map((investor, idx) => (
                        <div key={investor.id || idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{idx + 1}. {investor.nome}</p>
                            <p className="text-xs text-muted-foreground">{investor.azienda} - Probability: {investor.probability || 50}%</p>
                          </div>
                          <p className="text-sm font-bold text-primary">{formatCurrency(investor.pipelineValue || 0)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Dashboard Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    USER PROFILE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <Input value="Edoardo Grigione" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input value="edoardo.grigione@aries76.com" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <Input value="Aries76 Ltd" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <Input value="Managing Director" disabled />
                  </div>
                  <Button className="w-full">Change Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>NOTIFICATION PREFERENCES</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
                    <div className="space-y-2">
                      {[
                        "Daily summary (8:00 AM)",
                        "Follow-up reminders (1 day before)",
                        "Milestone alerts",
                        "Overdue tasks",
                        "Biweekly report"
                      ].map((notif, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{notif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground">In-App Notifications</h4>
                    <div className="space-y-2">
                      {[
                        "New investor interactions",
                        "Status changes",
                        "Document uploads",
                        "Meeting reminders"
                      ].map((notif, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{notif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>SYSTEM CONFIGURATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Fundraising Target</label>
                    <Input value="€10,000,000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                    <Input value="June 30, 2026" />
                  </div>
                </div>
                <Button>Update Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ABCCompanyConsole;
