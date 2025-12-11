import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, 
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2, X, Plus,
  ExternalLink, Paperclip, Edit, Trash2, LogOut, Send, Eye
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
import { ABCCommitmentTracker } from "@/components/ABCCommitmentTracker";
import { ABCEmailCampaignManager } from "@/components/ABCEmailCampaignManager";
import { ABCEngagementScore } from "@/components/ABCEngagementScore";
import { NotificationBell } from "@/components/NotificationBell";
import { OnlineUsersIndicator } from "@/components/OnlineUsersIndicator";
import { ABCSettingsTab } from "@/components/ABCSettingsTab";
import ABCEmailEnrichment from "@/components/ABCEmailEnrichment";
import { useKPIHistory } from "@/hooks/useKPIHistory";
import { supabase } from "@/integrations/supabase/client";

// All investor data is now fetched dynamically from Supabase

const ABCCompanyConsole = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { recordSnapshot } = useKPIHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount via sessionStorage
  useEffect(() => {
    const isAuthorized = sessionStorage.getItem('abc_console_authorized') === 'true';
    if (!isAuthorized) {
      navigate('/abc-company-console-access');
      return;
    }
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('abc_console_authorized');
    sessionStorage.removeItem('abc_console_email');
    navigate('/abc-company-console-access');
  };
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [investors, setInvestors] = useState<any[]>([]);
  const [loadingInvestors, setLoadingInvestors] = useState(true);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<any[]>([]);
  const [customFunnelData, setCustomFunnelData] = useState<any[] | null>(null);
  const [editInvestorId, setEditInvestorId] = useState<string | null>(null);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);
  
  // Quick Actions state
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [selectedInvestorForAction, setSelectedInvestorForAction] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [followUpData, setFollowUpData] = useState({
    date: "",
    type: "call",
    description: ""
  });
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

  // Campaign stats state
  const [campaignStats, setCampaignStats] = useState({
    totalCampaigns: 0,
    totalEmailsSent: 0,
    totalOpens: 0,
    successRate: 0,
  });

  // Settings state
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailySummary: true,
    followUpReminders: true,
    milestoneAlerts: true,
    overdueTasks: true,
    biweeklyReport: true,
    newInteractions: true,
    statusChanges: true,
    documentUploads: true,
    meetingReminders: true,
  });
  const [customAuthorizedEmails, setCustomAuthorizedEmails] = useState<string[]>([]);
  const [newAuthorizedEmail, setNewAuthorizedEmail] = useState("");
  const [settingsTargetAmount, setSettingsTargetAmount] = useState("10000000");
  const [settingsDeadline, setSettingsDeadline] = useState("2026-06-30");
  const currentUserEmail = sessionStorage.getItem('abc_console_email') || '';

  // Fetch investors from Supabase and load saved data
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInvestors();
    fetchUpcomingFollowUps();
    fetchCampaignStats();

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
  }, [isAuthenticated]);

  // Record daily KPI snapshot automatically
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated, investors, progressData, closedKPI, meetingsKPI, recordSnapshot]);

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

  // Load settings from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Load notification preferences
    const savedNotifPrefs = localStorage.getItem('abc_notification_prefs');
    if (savedNotifPrefs) {
      setNotificationPrefs(JSON.parse(savedNotifPrefs));
    }
    
    // Load custom authorized emails
    const savedEmails = localStorage.getItem('abc_console_custom_emails');
    if (savedEmails) {
      setCustomAuthorizedEmails(JSON.parse(savedEmails));
    }
    
    // Load settings target/deadline from progressData
    setSettingsTargetAmount(progressData.targetAmount.toString());
    setSettingsDeadline(progressData.deadline);
  }, [isAuthenticated, progressData.targetAmount, progressData.deadline]);

  // Save notification preferences
  const saveNotificationPrefs = () => {
    localStorage.setItem('abc_notification_prefs', JSON.stringify(notificationPrefs));
    toast.success("Notification preferences saved");
  };

  // Save configuration
  const saveConfiguration = () => {
    const newTarget = parseInt(settingsTargetAmount) || 10000000;
    const newProgressData = {
      ...progressData,
      targetAmount: newTarget,
      deadline: settingsDeadline,
    };
    setProgressData(newProgressData);
    localStorage.setItem('abc-progress-data', JSON.stringify(newProgressData));
    toast.success("Configuration updated");
  };

  // Add authorized email
  const addAuthorizedEmail = () => {
    const email = newAuthorizedEmail.toLowerCase().trim();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    if (customAuthorizedEmails.includes(email)) {
      toast.error("Email already in list");
      return;
    }
    const newList = [...customAuthorizedEmails, email];
    setCustomAuthorizedEmails(newList);
    localStorage.setItem('abc_console_custom_emails', JSON.stringify(newList));
    setNewAuthorizedEmail("");
    toast.success("User added successfully");
  };

  // Remove authorized email
  const removeAuthorizedEmail = (email: string) => {
    const newList = customAuthorizedEmails.filter(e => e !== email);
    setCustomAuthorizedEmails(newList);
    localStorage.setItem('abc_console_custom_emails', JSON.stringify(newList));
    toast.success("User removed");
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
        approvalStatus: inv.approval_status || 'pending',
      }));

      setInvestors(transformedInvestors);
      setLastDataUpdate(new Date());
      setLoadingInvestors(false);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Failed to load investors');
      setLoadingInvestors(false);
    }
  };

  const fetchCampaignStats = async () => {
    try {
      // Fetch campaign history
      const { data: campaigns, error: campaignsError } = await supabase
        .from('abc_email_campaign_history' as any)
        .select('*');

      if (campaignsError) throw campaignsError;

      // Fetch email opens
      const { data: opens, error: opensError } = await supabase
        .from('abc_email_opens' as any)
        .select('*');

      if (opensError) throw opensError;

      const totalCampaigns = campaigns?.length || 0;
      const totalEmailsSent = campaigns?.reduce((sum: number, c: any) => sum + (c.successful_sends || 0), 0) || 0;
      const totalOpens = opens?.length || 0;
      const successRate = totalCampaigns > 0 
        ? Math.round((campaigns?.reduce((sum: number, c: any) => sum + (c.successful_sends || 0), 0) / 
                     campaigns?.reduce((sum: number, c: any) => sum + (c.recipient_count || 0), 0)) * 100) || 0
        : 0;

      setCampaignStats({
        totalCampaigns,
        totalEmailsSent,
        totalOpens,
        successRate: isNaN(successRate) ? 0 : successRate,
      });
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
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

  // Quick Actions handlers
  const handleAddNote = async () => {
    if (!selectedInvestorForAction || !noteText.trim()) {
      toast.error("Seleziona un investitore e inserisci una nota");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('abc_investor_notes')
        .insert({
          investor_name: selectedInvestorForAction.nome,
          note_text: noteText,
          created_by: sessionStorage.getItem('abc_console_email') || 'Admin'
        });
      
      if (error) throw error;
      
      toast.success(`Nota aggiunta per ${selectedInvestorForAction.nome}`);
      setShowAddNoteDialog(false);
      setNoteText("");
      setSelectedInvestorForAction(null);
    } catch (err) {
      toast.error("Errore nell'aggiungere la nota");
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!selectedInvestorForAction || !followUpData.date) {
      toast.error("Seleziona un investitore e una data");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('abc_investor_followups')
        .insert({
          investor_name: selectedInvestorForAction.nome,
          follow_up_date: followUpData.date,
          follow_up_type: followUpData.type,
          description: followUpData.description,
          created_by: sessionStorage.getItem('abc_console_email') || 'Admin'
        });
      
      if (error) throw error;
      
      toast.success(`Follow-up pianificato per ${selectedInvestorForAction.nome}`);
      setShowFollowUpDialog(false);
      setFollowUpData({ date: "", type: "call", description: "" });
      setSelectedInvestorForAction(null);
      fetchUpcomingFollowUps();
    } catch (err) {
      toast.error("Errore nel pianificare il follow-up");
    }
  };

  const handleExportPipeline = () => {
    const csvContent = [
      ["Nome", "Azienda", "Ruolo", "Categoria", "Status", "Pipeline Value", "Email", "Telefono", "Città", "Fonte"].join(","),
      ...investors.map(inv => [
        inv.nome,
        inv.azienda,
        inv.ruolo || "",
        inv.categoria,
        inv.status,
        inv.pipeline_value,
        inv.email || "",
        inv.phone || "",
        inv.citta || "",
        inv.fonte || ""
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `abc_pipeline_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Pipeline esportata con successo");
  };

  const formatCurrency = (value: number) => {
    return `€${(value / 1000000).toFixed(1)}M`;
  };

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
              <OnlineUsersIndicator />
              <NotificationBell />
              <span className="text-sm text-muted-foreground">User: {currentUserEmail}</span>
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
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="commitments">Commitments</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

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
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

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
                  <Button className="w-full justify-start" variant="outline" onClick={() => setShowAddNoteDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setShowFollowUpDialog(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast.info("Email campaign coming soon")}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleExportPipeline}>
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
                initialEditInvestorId={editInvestorId}
                onEditDialogClosed={() => setEditInvestorId(null)}
              />
            )}
          </TabsContent>

          {/* COMMITMENTS TAB */}
          <TabsContent value="commitments" className="space-y-6">
            <ABCCommitmentTracker investors={investors.map(i => ({ id: i.id, nome: i.nome, azienda: i.azienda }))} />
          </TabsContent>

          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Campaign Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Campagne Inviate</p>
                      <p className="text-xl font-bold">{campaignStats.totalCampaigns}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Send className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Inviate</p>
                      <p className="text-xl font-bold">{campaignStats.totalEmailsSent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Eye className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aperture Totali</p>
                      <p className="text-xl font-bold">{campaignStats.totalOpens}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasso Successo</p>
                      <p className="text-xl font-bold">{campaignStats.successRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ABCEmailCampaignManager 
                  investors={investors.map(i => ({ 
                    id: i.id, 
                    nome: i.nome, 
                    azienda: i.azienda, 
                    email: i.email, 
                    categoria: i.categoria, 
                    status: i.status,
                    approval_status: i.approvalStatus,
                    ruolo: i.ruolo,
                    citta: i.citta,
                    pipeline_value: i.pipelineValue,
                    last_contact_date: i.lastContactDate,
                    engagement_score: i.engagementScore,
                    linkedin: i.linkedin,
                    fonte: i.fonte
                  }))} 
                  onInvestorsUpdated={fetchInvestors}
                />
              </div>
              <div>
                <ABCEmailEnrichment onEmailUpdated={fetchInvestors} />
              </div>
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ABCAnalyticsTab />
              </div>
              <div>
                <ABCEngagementScore 
                  investors={investors.map(i => ({
                    id: i.id,
                    nome: i.nome,
                    azienda: i.azienda,
                    email: i.email,
                    engagement_score: i.engagementScore,
                    email_opens_count: i.emailOpensCount,
                    email_responses_count: i.emailResponsesCount,
                    meetings_count: i.meetingsCount,
                    notes_count: i.notesCount,
                  }))}
                  onSelectInvestor={(id) => {
                    setEditInvestorId(id);
                    setActiveTab("investors");
                  }}
                />
              </div>
            </div>
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
                    {(() => {
                      const now = new Date();
                      const getDaysRemaining = (deadline: Date) => {
                        const diff = deadline.getTime() - now.getTime();
                        return Math.ceil(diff / (1000 * 60 * 60 * 24));
                      };
                      const phase1Deadline = new Date('2026-01-31');
                      const phase2Deadline = new Date('2026-03-31');
                      const phase3Deadline = new Date('2026-04-30');
                      const phase4Deadline = new Date('2026-05-31');
                      const phase5Deadline = new Date('2026-06-30');
                      const phase6Deadline = new Date('2026-06-30');

                      const CountdownBadge = ({ days }: { days: number }) => {
                        if (days < 0) return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Completata</Badge>;
                        if (days <= 7) return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">{days}g rimanenti</Badge>;
                        if (days <= 30) return <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{days}g rimanenti</Badge>;
                        return <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">{days}g rimanenti</Badge>;
                      };

                      // Calcolo automatico Attention Required basato su performance vs target (soglia 80%)
                      const phase1Progress = 100; // Completata
                      const phase2Current = investors.filter(i => i.status === 'Meeting Scheduled' || i.status === 'In Negotiation' || i.status === 'Closed').length;
                      const phase2Target = 20;
                      const phase2Progress = (phase2Current / phase2Target) * 100;
                      
                      const phase3Current = investors.filter(i => i.status === 'Interested').length;
                      const phase3Target = 10;
                      const phase3Progress = (phase3Current / phase3Target) * 100;
                      
                      const phase4Current = investors.filter(i => i.status === 'In Negotiation').length;
                      const phase4Target = 5;
                      const phase4Progress = (phase4Current / phase4Target) * 100;
                      
                      const phase5Current = investors.filter(i => i.status === 'Closed').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
                      const phase5Target = 5000000;
                      const phase5Progress = (phase5Current / phase5Target) * 100;
                      
                      const phase6Current = investors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
                      const phase6Target = 10000000;
                      const phase6Progress = (phase6Current / phase6Target) * 100;

                      const getExpectedProgress = (deadline: Date) => {
                        const start = new Date('2025-12-01');
                        const totalDuration = deadline.getTime() - start.getTime();
                        const elapsed = now.getTime() - start.getTime();
                        return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                      };

                      const needsAttention = (progress: number, deadline: Date) => {
                        const expected = getExpectedProgress(deadline);
                        const daysRemaining = getDaysRemaining(deadline);
                        // Alert se: sotto 80% del progresso atteso E non completata E deadline non passata
                        return daysRemaining > 0 && progress < (expected * 0.8);
                      };

                      const AttentionBadge = ({ show }: { show: boolean }) => {
                        if (!show) return null;
                        return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">⚠️ Attenzione</Badge>;
                      };

                      return (
                        <>
                          <Card className="border-2 border-green-500/20 bg-green-500/5">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 1: Outreach</CardTitle>
                                <div className="flex items-center gap-2">
                                  <CountdownBadge days={getDaysRemaining(phase1Deadline)} />
                                  <Badge className="bg-green-500 text-white">✅ DONE</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Dec 2025 - Jan 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: Contact {investors.length} high-priority investors</p>
                              <Progress value={100} className="h-2" />
                              <p className="text-sm font-semibold text-green-600">{investors.length}/{investors.length} contacts reached (100%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: January 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase2Progress, phase2Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-primary/20 bg-primary/5'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 2: Initial Meetings</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase2Progress, phase2Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase2Deadline)} />
                                  <Badge className="bg-primary">⏳ IN PROGRESS</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Feb 2026 - Mar 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: Schedule 20 meetings with interested investors</p>
                              <Progress value={Math.min(100, Math.round(phase2Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-primary">{phase2Current}/20 meetings scheduled ({Math.round(phase2Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: March 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase3Progress, phase3Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 3: Due Diligence</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase3Progress, phase3Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase3Deadline)} />
                                  <Badge variant="outline">{phase3Current > 0 ? '⏳ IN PROGRESS' : 'UPCOMING'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Mar 2026 - Apr 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: 10 interested investors in DD process</p>
                              <Progress value={Math.min(100, Math.round(phase3Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">{phase3Current}/10 in progress ({Math.round(phase3Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: April 30, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase4Progress, phase4Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 4: Negotiation</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase4Progress, phase4Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase4Deadline)} />
                                  <Badge variant="outline">{phase4Current > 0 ? '⏳ IN PROGRESS' : 'UPCOMING'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Apr 2026 - May 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: 5 active negotiations</p>
                              <Progress value={Math.min(100, Math.round(phase4Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">{phase4Current}/5 in negotiation ({Math.round(phase4Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: May 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase5Progress, phase5Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 5: First Closing</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase5Progress, phase5Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase5Deadline)} />
                                  <Badge variant="outline">{phase5Current > 0 ? '⏳ IN PROGRESS' : 'TARGET'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">May 2026 - Jun 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: €3-5M first closing</p>
                              <Progress value={Math.min(100, Math.round(phase5Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">€{(phase5Current / 1000000).toFixed(1)}M / €5M ({Math.round(phase5Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: June 30, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase6Progress, phase6Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-accent/20 bg-accent/5'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 6: Final Closing</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase6Progress, phase6Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase6Deadline)} />
                                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/40">🎯 TARGET</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Apr 2026 - Jun 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: €10M total fundraise</p>
                              <Progress value={Math.min(100, Math.round(phase6Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-accent">€{(phase6Current / 1000000).toFixed(2)}M / €10M ({Math.round(phase6Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Final Deadline: June 30, 2026</p>
                              <div className="pt-2 border-t border-border/50 mt-2">
                                <p className="text-xs text-muted-foreground">Pipeline Summary:</p>
                                <p className="text-xs">• Closed: €{(investors.filter(i => i.status === 'Closed').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                                <p className="text-xs">• In Negotiation: €{(investors.filter(i => i.status === 'In Negotiation').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                                <p className="text-xs">• Interested: €{(investors.filter(i => i.status === 'Interested').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
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
                      <p className="text-sm text-foreground">• {Math.max(0, 20 - investors.filter(i => i.status === 'Meeting Scheduled' || i.status === 'In Negotiation' || i.status === 'Closed').length)} meetings still needed to reach Phase 2 target</p>
                      <p className="text-sm text-foreground">• {investors.filter(i => i.status === 'To Contact' && i.approvalStatus === 'approved').length} approved investors to contact</p>
                      <p className="text-sm text-foreground">• {investors.filter(i => i.approvalStatus === 'pending').length} investors pending approval</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6">
            {(() => {
              // Fundraising period: Jan 1, 2026 - Jun 30, 2026
              const campaignStart = new Date(2026, 0, 1); // Jan 1, 2026
              const campaignEnd = new Date(2026, 5, 30); // Jun 30, 2026
              const today = new Date();
              
              // Calculate current biweekly period (2-week intervals starting from campaign start)
              const msPerDay = 24 * 60 * 60 * 1000;
              const daysSinceStart = Math.floor((today.getTime() - campaignStart.getTime()) / msPerDay);
              const currentPeriodIndex = Math.max(0, Math.floor(daysSinceStart / 14));
              
              const periodStart = new Date(campaignStart.getTime() + currentPeriodIndex * 14 * msPerDay);
              const periodEnd = new Date(periodStart.getTime() + 13 * msPerDay);
              
              // Calculate next report date (Monday after current period ends)
              const nextReportBase = new Date(periodEnd.getTime() + msPerDay);
              const daysUntilMonday = (8 - nextReportBase.getDay()) % 7 || 7;
              const nextReport = new Date(nextReportBase.getTime() + (daysUntilMonday - 1) * msPerDay);
              
              // Format dates
              const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const currentPeriodLabel = `${formatDate(periodStart)} - ${formatDate(periodEnd)}`;
              const nextReportLabel = formatDate(nextReport);
              
              // Calculate weeks remaining
              const weeksRemaining = Math.ceil((campaignEnd.getTime() - today.getTime()) / (7 * msPerDay));
              
              return (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>BIWEEKLY REPORT</CardTitle>
                    <p className="text-sm text-muted-foreground">Campaign: January 1, 2026 → June 30, 2026 ({weeksRemaining > 0 ? `${weeksRemaining} weeks remaining` : 'Campaign ended'})</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Dati live</span>
                    <span className="text-foreground font-medium">
                      {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Report Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Period:</span>
                        <span className="text-foreground">{currentPeriodLabel}</span>
                      </div>
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
                        <span className="text-primary font-semibold">{nextReportLabel}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="gap-2" onClick={() => {
                        const reportData = {
                          period: currentPeriodLabel,
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
                    <h4 className="font-semibold text-foreground">Current Status (Live)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.meetings > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.meetings} meeting{statusCounts.meetings !== 1 ? 's' : ''} scheduled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.negotiation > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.negotiation} investor{statusCounts.negotiation !== 1 ? 's' : ''} in negotiation phase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${closedValue > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>€{(closedValue / 1000).toFixed(0)}K total closed commitments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.interested > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.interested} interested investor{statusCounts.interested !== 1 ? 's' : ''} in DD</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.contacted > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.contacted} investor{statusCounts.contacted !== 1 ? 's' : ''} contacted</span>
                      </li>
                    </ul>
                    
                    <div className="pt-4 border-t border-border/50">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2">CONVERSION FUNNEL</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>To Contact → Contacted:</span>
                          <span className="font-semibold">{statusCounts.total > 0 ? Math.round((statusCounts.contacted / statusCounts.total) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contacted → Interested:</span>
                          <span className="font-semibold">{statusCounts.contacted > 0 ? Math.round((statusCounts.interested / statusCounts.contacted) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interested → Negotiation:</span>
                          <span className="font-semibold">{statusCounts.interested > 0 ? Math.round((statusCounts.negotiation / statusCounts.interested) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Negotiation → Closed:</span>
                          <span className="font-semibold">{statusCounts.negotiation > 0 ? Math.round((statusCounts.closed / statusCounts.negotiation) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="border-t border-border pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Top 5 Investors by Weighted Pipeline</h4>
                  <p className="text-xs text-muted-foreground mb-4">Pipeline Value × Probability = Expected Value</p>
                  <div className="space-y-3">
                    {[...investors]
                      .map(inv => ({
                        ...inv,
                        weightedValue: (inv.pipelineValue || 0) * ((inv.probability || 50) / 100)
                      }))
                      .sort((a, b) => b.weightedValue - a.weightedValue)
                      .slice(0, 5)
                      .map((investor, idx) => (
                        <div 
                          key={investor.id || idx} 
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors group"
                          onClick={() => {
                            setEditInvestorId(investor.id);
                            setActiveTab('investors');
                          }}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{idx + 1}. {investor.nome}</p>
                            <p className="text-xs text-muted-foreground">{investor.azienda}</p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="text-sm font-bold text-primary">{formatCurrency(investor.weightedValue)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(investor.pipelineValue || 0)} × {investor.probability || 50}%
                              </p>
                            </div>
                            <Edit className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Total Weighted Pipeline</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(
                          investors.reduce((sum, inv) => 
                            sum + ((inv.pipelineValue || 0) * ((inv.probability || 50) / 100)), 0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => {
                    const doc = new jsPDF();
                    const pageWidth = doc.internal.pageSize.getWidth();
                    
                    // Header
                    doc.setFontSize(20);
                    doc.setTextColor(26, 35, 50);
                    doc.text("ABC Company Capital Raise Report", pageWidth / 2, 20, { align: "center" });
                    
                    // Period
                    doc.setFontSize(12);
                    doc.setTextColor(100);
                    doc.text(`Period: ${currentPeriodLabel}`, pageWidth / 2, 30, { align: "center" });
                    doc.text(`Generated: ${new Date().toLocaleDateString('it-IT')}`, pageWidth / 2, 36, { align: "center" });
                    
                    // Orange line
                    doc.setDrawColor(255, 107, 53);
                    doc.setLineWidth(1);
                    doc.line(20, 42, pageWidth - 20, 42);
                    
                    // Pipeline Summary
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Pipeline Summary", 20, 55);
                    
                    doc.setFontSize(11);
                    doc.setTextColor(60);
                    let yPos = 65;
                    const metrics = [
                      ["Total Investors", `${investors.length}`],
                      ["Total Pipeline Value", `€${(totalPipelineValue / 1000000).toFixed(2)}M`],
                      ["Closed Value", `€${(closedValue / 1000000).toFixed(2)}M`],
                    ];
                    metrics.forEach(([label, value]) => {
                      doc.text(label, 25, yPos);
                      doc.setTextColor(255, 107, 53);
                      doc.text(value, pageWidth - 25, yPos, { align: "right" });
                      doc.setTextColor(60);
                      yPos += 8;
                    });
                    
                    // Status Breakdown
                    yPos += 5;
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Status Breakdown", 20, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(11);
                    doc.setTextColor(60);
                    const statuses = [
                      ["Total Contacts", `${statusCounts.total}`],
                      ["Contacted", `${statusCounts.contacted}`],
                      ["Interested", `${statusCounts.interested}`],
                      ["Meeting Scheduled", `${statusCounts.meetings}`],
                      ["In Negotiation", `${statusCounts.negotiation}`],
                      ["Closed", `${statusCounts.closed}`],
                    ];
                    statuses.forEach(([label, value]) => {
                      doc.text(label, 25, yPos);
                      doc.setTextColor(255, 107, 53);
                      doc.text(value, pageWidth - 25, yPos, { align: "right" });
                      doc.setTextColor(60);
                      yPos += 8;
                    });
                    
                    // Top Investors
                    yPos += 5;
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Top 5 Investors by Pipeline Value", 20, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(10);
                    const topInvestors = [...investors]
                      .sort((a, b) => (b.pipelineValue || 0) - (a.pipelineValue || 0))
                      .slice(0, 5);
                    topInvestors.forEach((inv, i) => {
                      doc.setTextColor(26, 35, 50);
                      doc.text(`${i + 1}. ${inv.nome}`, 25, yPos);
                      doc.setTextColor(100);
                      doc.text(`${inv.azienda}`, 25, yPos + 5);
                      doc.setTextColor(255, 107, 53);
                      doc.text(`€${((inv.pipelineValue || 0) / 1000).toFixed(0)}K`, pageWidth - 25, yPos, { align: "right" });
                      yPos += 14;
                    });
                    
                    // Footer
                    doc.setFontSize(9);
                    doc.setTextColor(150);
                    doc.text("ARIES76 Capital Intelligence | ABC Company Fundraising Console", pageWidth / 2, 285, { align: "center" });
                    
                    doc.save(`ABC_Company_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                    toast.success("PDF downloaded successfully");
                  }}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Dashboard link copied to clipboard");
                  }}>
                    <Share2 className="h-4 w-4" />
                    Share Dashboard Link
                  </Button>
                </div>
              </CardContent>
            </Card>
              );
            })()}
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <ABCSettingsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleziona Investitore</Label>
              <Select 
                value={selectedInvestorForAction?.id || ""} 
                onValueChange={(val) => setSelectedInvestorForAction(investors.find(i => i.id === val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona investitore..." />
                </SelectTrigger>
                <SelectContent>
                  {investors.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.nome} - {inv.azienda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nota</Label>
              <Textarea 
                placeholder="Inserisci la nota..." 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleAddNote} className="w-full">
              Salva Nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pianifica Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleziona Investitore</Label>
              <Select 
                value={selectedInvestorForAction?.id || ""} 
                onValueChange={(val) => setSelectedInvestorForAction(investors.find(i => i.id === val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona investitore..." />
                </SelectTrigger>
                <SelectContent>
                  {investors.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.nome} - {inv.azienda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input 
                type="date" 
                value={followUpData.date}
                onChange={(e) => setFollowUpData({...followUpData, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select 
                value={followUpData.type} 
                onValueChange={(val) => setFollowUpData({...followUpData, type: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Chiamata</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="presentation">Presentazione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrizione (opzionale)</Label>
              <Textarea 
                placeholder="Note aggiuntive..." 
                value={followUpData.description}
                onChange={(e) => setFollowUpData({...followUpData, description: e.target.value})}
                rows={2}
              />
            </div>
            <Button onClick={handleScheduleFollowUp} className="w-full">
              Pianifica Follow-up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ABCCompanyConsole;
