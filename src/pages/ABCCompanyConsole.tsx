import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle,
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2, X, Plus,
  ExternalLink, Paperclip, Edit, Trash2
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Real investor data from Investitori_Alta_Priorita_ABC.xlsx
const investorsData = [
  { id: 1, name: "Enrico Cibati", company: "Cassa Nazionale di Previdenza e Assistenza Forense", role: "Responsabile Ufficio Investimenti (CIO)", category: "Investitori istituzionali", city: "Roma", source: "Ricerca Esterna", priority: "high", status: "contacted", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 12, 2024", pipelineValue: 1200000, probability: 55, email: "e.cibati@cassaforense.it", phone: "+39 06 3630 1234", linkedin: null },
  { id: 2, name: "Giampiero Schiavo", company: "Castello SGR S.p.A.", role: "CEO", category: "SGR italiane", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 850000, probability: 65, email: "g.schiavo@castellosgr.com", phone: "+39 02 7780 4567", linkedin: null },
  { id: 3, name: "Carlotta de Courten", company: "Fondo Italiano d'Investimento SGR", role: "Direzione Commerciale, Investor Relations & ESG", category: "SGR per PMI", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 950000, probability: 70, email: "c.decourten@fondoitaliano.it", phone: "+39 02 6367 8901", linkedin: null },
  { id: 4, name: "Gianpaolo Di Dio", company: "Fondo Italiano d'Investimento SGR - Growth Capital", role: "Chief Investment Officer & Senior Partner", category: "Venture Capital", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 15, 2024", pipelineValue: 1100000, probability: 68, email: "g.didio@fondoitaliano.it", phone: "+39 02 6367 8902", linkedin: null },
  { id: 5, name: "Domenico Lombardi", company: "Fondo Italiano d'Investimento SGR S.p.A.", role: "Amministratore Delegato e Direttore Generale", category: "SGR italiane", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 18, 2024", pipelineValue: 1500000, probability: 75, email: "d.lombardi@fondoitaliano.it", phone: "+39 02 6367 8900", linkedin: null },
  { id: 6, name: "Andrea Mariani", company: "Fondo Pensione Complementare Pegaso", role: "Direttore Generale", category: "Fondi pensione", city: "Roma", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 720000, probability: 60, email: "a.mariani@fondopegaso.it", phone: "+39 06 5280 3456", linkedin: null },
  { id: 7, name: "Investor Relations", company: "Holding Italiana Quattordicesima S.p.A. (H14)", role: "Investor Relations", category: "Family Office", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "to-contact", lastContact: "Nov 25, 2024", nextFollowUp: "Dec 6, 2024", pipelineValue: 600000, probability: 50, email: "ir@h14spa.it", phone: "+39 02 7639 5000", linkedin: null },
  { id: 8, name: "Lucio Rovati", company: "HNWI / Angel Investor", role: "CEO Rottapharm Biotech / Business Angel", category: "HNWI", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "contacted", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 11, 2024", pipelineValue: 450000, probability: 55, email: "l.rovati@rottapharm.com", phone: "+39 02 5666 7890", linkedin: null },
  { id: 9, name: "Dario Giudici", company: "Mamacrowd S.r.l. (Gruppo Azimut)", role: "Co-Founder & CEO", category: "Equity crowdfunding", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 1, 2024", nextFollowUp: "Dec 13, 2024", pipelineValue: 550000, probability: 62, email: "d.giudici@mamacrowd.com", phone: "+39 02 8088 1234", linkedin: null },
  { id: 10, name: "Francesco Niutta", company: "QCapital S.r.l.", role: "CEO", category: "Club Deal", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "negotiation", lastContact: "Dec 3, 2024", nextFollowUp: "Dec 20, 2024", pipelineValue: 800000, probability: 72, email: "f.niutta@qcapital.it", phone: "+39 02 7602 3456", linkedin: null },
  { id: 11, name: "Stefano Miccinelli", company: "QCapital S.r.l.", role: "Presidente e Co-Fondatore", category: "Club Deal", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "meeting", lastContact: "Dec 2, 2024", nextFollowUp: "Dec 14, 2024", pipelineValue: 750000, probability: 68, email: "s.miccinelli@qcapital.it", phone: "+39 02 7602 3457", linkedin: null },
  { id: 12, name: "Giacomo Sella", company: "Sella Corporate & Investment Banking", role: "Head of Corporate & Investment Banking", category: "Banche", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "interested", lastContact: "Nov 29, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 900000, probability: 65, email: "g.sella@sellagroup.eu", phone: "+39 011 6657 890", linkedin: null },
  { id: 13, name: "Michael Brunner", company: "UBS", role: "Private Equity Portfolio Manager", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 26, 2024", nextFollowUp: "Dec 7, 2024", pipelineValue: 680000, probability: 58, email: "michael.brunner@ubs.com", phone: "+39 02 7741 2345", linkedin: "https://www.linkedin.com/in/michael-brunner-caia-cesga-fmva-817ab813a" },
  { id: 14, name: "Edoardo Bertini", company: "UBS", role: "Director | Infrastructure, Power & Telecom - Private Equity", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 24, 2024", nextFollowUp: "Dec 5, 2024", pipelineValue: 520000, probability: 52, email: "edoardo.bertini@ubs.com", phone: "+39 02 7741 2346", linkedin: "https://www.linkedin.com/in/edoardo-bertini-42877170" },
  { id: 15, name: "Simone Ruzzante", company: "Generali", role: "Private Equity Specialist", category: "Private Equity", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 8, 2024", pipelineValue: 640000, probability: 60, email: "simone.ruzzante@generali.com", phone: "+39 02 4815 6789", linkedin: "https://www.linkedin.com/in/simone-ruzzante-3a474616" },
  { id: 16, name: "Marco Boschetti", company: "Family Office Italia", role: "Managing Partner", category: "Family Office", city: "Milano", source: "Network LinkedIn", priority: "high", status: "meeting", lastContact: "Nov 30, 2024", nextFollowUp: "Dec 10, 2024", pipelineValue: 700000, probability: 67, email: "m.boschetti@familyoffice.it", phone: "+39 02 1234 5678", linkedin: "https://www.linkedin.com/in/marcoboschetti" },
  { id: 17, name: "Patrizia Polonia", company: "Fideuram Private Banking", role: "Senior Relationship Manager", category: "Private Banking", city: "Milano", source: "Network LinkedIn", priority: "high", status: "contacted", lastContact: "Nov 28, 2024", nextFollowUp: "Dec 12, 2024", pipelineValue: 580000, probability: 59, email: "p.polonia@fideuram.it", phone: "+39 02 8765 4321", linkedin: "https://www.linkedin.com/in/patriziapolonia" },
  { id: 18, name: "Andrea Reale", company: "Fondo Italiano d'Investimento SGR", role: "Investment Manager", category: "SGR per PMI", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "contacted", lastContact: "Nov 27, 2024", nextFollowUp: "Dec 9, 2024", pipelineValue: 670000, probability: 63, email: "a.reale@fondoitaliano.it", phone: "+39 02 6367 8903", linkedin: null },
  { id: 19, name: "Emanuele Marangoni", company: "Banca IMI", role: "Investment Banking", category: "Banche", city: "Milano", source: "Ricerca Esterna", priority: "high", status: "to-contact", lastContact: "Nov 23, 2024", nextFollowUp: "Dec 4, 2024", pipelineValue: 480000, probability: 50, email: "e.marangoni@bancaimi.it", phone: "+39 02 1234 9876", linkedin: null },
  { id: 20, name: "Stefano Mortarotti", company: "Independent Investor", role: "Private Investor", category: "HNWI", city: "Milano", source: "Network LinkedIn", priority: "high", status: "to-contact", lastContact: "Nov 21, 2024", nextFollowUp: "Dec 2, 2024", pipelineValue: 350000, probability: 44, email: "s.mortarotti@gmail.com", phone: "+39 335 1234 567", linkedin: null }
];

const ABCCompanyConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<typeof investorsData[0] | null>(null);
  const [modalTab, setModalTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [newFollowUp, setNewFollowUp] = useState({ date: "", time: "", type: "call", description: "" });
  const [currentUser] = useState("edoardo.grigione@aries76.com");
  const queryClient = useQueryClient();

  // Fetch notes for selected investor
  const { data: notes = [] } = useQuery({
    queryKey: ['abc-investor-notes', selectedInvestor?.name],
    queryFn: async () => {
      if (!selectedInvestor) return [];
      const { data, error } = await supabase
        .from('abc_investor_notes')
        .select('*')
        .eq('investor_name', selectedInvestor.name)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedInvestor,
  });

  // Fetch follow-ups for selected investor
  const { data: followUps = [] } = useQuery({
    queryKey: ['abc-investor-followups', selectedInvestor?.name],
    queryFn: async () => {
      if (!selectedInvestor) return [];
      const { data, error } = await supabase
        .from('abc_investor_followups')
        .select('*')
        .eq('investor_name', selectedInvestor.name)
        .order('follow_up_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedInvestor,
  });

  // Fetch activities for selected investor
  const { data: activities = [] } = useQuery({
    queryKey: ['abc-investor-activities', selectedInvestor?.name],
    queryFn: async () => {
      if (!selectedInvestor) return [];
      const { data, error } = await supabase
        .from('abc_investor_activities')
        .select('*')
        .eq('investor_name', selectedInvestor.name)
        .order('activity_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedInvestor,
  });

  // Fetch documents for selected investor
  const { data: documents = [] } = useQuery({
    queryKey: ['abc-investor-documents', selectedInvestor?.name],
    queryFn: async () => {
      if (!selectedInvestor) return [];
      const { data, error } = await supabase
        .from('abc_investor_documents')
        .select('*')
        .eq('investor_name', selectedInvestor.name)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedInvestor,
  });

  // Fetch all recent activities for timeline
  const { data: allActivities = [] } = useQuery({
    queryKey: ['abc-all-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('abc_investor_activities')
        .select('*')
        .order('activity_date', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all upcoming follow-ups
  const { data: allFollowUps = [] } = useQuery({
    queryKey: ['abc-all-followups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('abc_investor_followups')
        .select('*')
        .order('follow_up_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      if (!selectedInvestor) throw new Error("No investor selected");
      const { error } = await supabase
        .from('abc_investor_notes')
        .insert({
          investor_name: selectedInvestor.name,
          note_text: noteText,
          created_by: currentUser,
        });
      if (error) throw error;
      
      // Also log as activity
      await supabase.from('abc_investor_activities').insert({
        investor_name: selectedInvestor.name,
        activity_type: "nota",
        activity_description: `Nota aggiunta: ${noteText.substring(0, 50)}${noteText.length > 50 ? '...' : ''}`,
        created_by: currentUser,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abc-investor-notes'] });
      queryClient.invalidateQueries({ queryKey: ['abc-investor-activities'] });
      toast.success("Nota aggiunta con successo");
      setNewNote("");
    },
    onError: () => {
      toast.error("Errore nell'aggiungere la nota");
    },
  });

  // Add follow-up mutation
  const addFollowUpMutation = useMutation({
    mutationFn: async (followUpData: typeof newFollowUp) => {
      if (!selectedInvestor) throw new Error("No investor selected");
      const { error } = await supabase
        .from('abc_investor_followups')
        .insert({
          investor_name: selectedInvestor.name,
          follow_up_date: followUpData.date,
          follow_up_type: followUpData.type,
          description: followUpData.description,
          created_by: currentUser,
        });
      if (error) throw error;
      
      // Also log as activity
      await supabase.from('abc_investor_activities').insert({
        investor_name: selectedInvestor.name,
        activity_type: "follow-up",
        activity_description: `Schedulato ${followUpData.type} per ${followUpData.date}`,
        created_by: currentUser,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abc-investor-followups'] });
      queryClient.invalidateQueries({ queryKey: ['abc-investor-activities'] });
      toast.success("Follow-up schedulato con successo");
      setNewFollowUp({ date: "", time: "", type: "call", description: "" });
    },
    onError: () => {
      toast.error("Errore nello schedulare il follow-up");
    },
  });

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Inserisci una nota");
      return;
    }
    addNoteMutation.mutate(newNote);
  };

  const handleScheduleFollowUp = () => {
    if (!newFollowUp.date || !newFollowUp.description.trim()) {
      toast.error("Compila tutti i campi del follow-up");
      return;
    }
    addFollowUpMutation.mutate(newFollowUp);
  };

  // KPI Data - calculated from real investor data
  const totalPipelineValue = investorsData.reduce((sum, inv) => sum + inv.pipelineValue, 0);
  const closedInvestors = investorsData.filter(inv => inv.status === "closed");
  const closedValue = closedInvestors.reduce((sum, inv) => sum + inv.pipelineValue, 0);
  const meetingInvestors = investorsData.filter(inv => inv.status === "meeting" || inv.status === "negotiation");
  
  const kpis = {
    contacts: { current: 57, target: 57, percentage: 100 },
    meetings: { current: meetingInvestors.length, target: 20, percentage: Math.round((meetingInvestors.length / 20) * 100) },
    pipeline: { current: totalPipelineValue, target: 10000000, percentage: Math.round((totalPipelineValue / 10000000) * 100) },
    closed: { current: closedValue, target: 10000000, percentage: Math.round((closedValue / 10000000) * 100) }
  };

  // Helper function to format time ago
  const timeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minuti fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;
    if (diffDays === 1) return "1 giorno fa";
    return `${diffDays} giorni fa`;
  };

  // Check if follow-up is overdue
  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  // Helper functions
  const formatCurrency = (value: number) => {
    return value.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0 });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "contacted":
        return { label: "Contacted", color: "bg-blue-100 text-blue-800" };
      case "interested":
        return { label: "Interested", color: "bg-green-100 text-green-800" };
      case "meeting":
        return { label: "Meeting", color: "bg-yellow-100 text-yellow-800" };
      case "negotiation":
        return { label: "Negotiation", color: "bg-purple-100 text-purple-800" };
      case "closed":
        return { label: "Closed", color: "bg-gray-100 text-gray-800" };
      case "to-contact":
        return { label: "To Contact", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header and Tabs */}
      <header className="p-6 border-b border-muted/20 flex items-center justify-between">
        <h1 className="text-3xl font-bold">ABC Company Investor Console</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setActiveTab("dashboard")} variant={activeTab === "dashboard" ? "default" : "outline"}>
            Dashboard
          </Button>
          <Button onClick={() => setActiveTab("investors")} variant={activeTab === "investors" ? "default" : "outline"}>
            Investors
          </Button>
          <Button onClick={() => setActiveTab("timeline")} variant={activeTab === "timeline" ? "default" : "outline"}>
            Timeline
          </Button>
          <Button onClick={() => setActiveTab("reports")} variant={activeTab === "reports" ? "default" : "outline"}>
            Reports
          </Button>
          <Button onClick={() => setActiveTab("settings")} variant={activeTab === "settings" ? "default" : "outline"}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {activeTab === "dashboard" && (
        <main className="p-6 space-y-6">
          <section className="grid grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpis.contacts.current}</div>
                <Progress value={kpis.contacts.percentage} />
                <div className="text-sm text-muted-foreground">Target: {kpis.contacts.target}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpis.meetings.current}</div>
                <Progress value={kpis.meetings.percentage} />
                <div className="text-sm text-muted-foreground">Target: {kpis.meetings.target}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(kpis.pipeline.current)}</div>
                <Progress value={kpis.pipeline.percentage} />
                <div className="text-sm text-muted-foreground">Target: {formatCurrency(kpis.pipeline.target)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Closed Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(kpis.closed.current)}</div>
                <Progress value={kpis.closed.percentage} />
                <div className="text-sm text-muted-foreground">Target: {formatCurrency(kpis.closed.target)}</div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {allActivities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nessuna attività registrata. Le attività verranno visualizzate quando inizierai a interagire con gli investitori.
                </p>
              ) : (
                allActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">{activity.investor_name}</p>
                    <p className="text-sm text-muted-foreground">{activity.activity_description}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(activity.activity_date)}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Follow-ups</h2>
            <div className="space-y-3">
              {allFollowUps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nessun follow-up programmato. Inizia a schedulare i tuoi follow-up con gli investitori.
                </p>
              ) : (
                allFollowUps.slice(0, 5).map((fu) => {
                  const overdue = isOverdue(fu.follow_up_date);
                  return (
                    <div
                      key={fu.id}
                      className={`p-4 rounded-lg ${overdue ? "bg-red-100 text-red-800" : "bg-muted/50"}`}
                    >
                      <p className="font-medium">{fu.investor_name}</p>
                      <p className="text-sm">{fu.description}</p>
                      <p className="text-xs">
                        {overdue ? "Scaduto - " : ""}{new Date(fu.follow_up_date).toLocaleDateString('it-IT')} - {fu.follow_up_type}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      )}

      {activeTab === "investors" && (
        <main className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-muted/20">
              <thead>
                <tr>
                  <th className="border border-muted/20 p-2 text-left">Name</th>
                  <th className="border border-muted/20 p-2 text-left">Company</th>
                  <th className="border border-muted/20 p-2 text-left">Role</th>
                  <th className="border border-muted/20 p-2 text-left">Category</th>
                  <th className="border border-muted/20 p-2 text-left">City</th>
                  <th className="border border-muted/20 p-2 text-left">Priority</th>
                  <th className="border border-muted/20 p-2 text-left">Status</th>
                  <th className="border border-muted/20 p-2 text-left">Pipeline Value</th>
                  <th className="border border-muted/20 p-2 text-left">Probability %</th>
                  <th className="border border-muted/20 p-2 text-left">Last Contact</th>
                  <th className="border border-muted/20 p-2 text-left">Next Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {investorsData
                  .filter(inv =>
                    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inv.city.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((investor) => (
                  <tr
                    key={investor.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => {
                      setSelectedInvestor(investor);
                      setModalTab("overview");
                    }}
                  >
                    <td className="border border-muted/20 p-2">{investor.name}</td>
                    <td className="border border-muted/20 p-2">{investor.company}</td>
                    <td className="border border-muted/20 p-2">{investor.role}</td>
                    <td className="border border-muted/20 p-2">{investor.category}</td>
                    <td className="border border-muted/20 p-2">{investor.city}</td>
                    <td className={`border border-muted/20 p-2 font-semibold ${getPriorityColor(investor.priority)}`}>
                      {investor.priority.charAt(0).toUpperCase() + investor.priority.slice(1)}
                    </td>
                    <td className="border border-muted/20 p-2">
                      <Badge className={getStatusBadge(investor.status).color}>
                        {getStatusBadge(investor.status).label}
                      </Badge>
                    </td>
                    <td className="border border-muted/20 p-2">{formatCurrency(investor.pipelineValue)}</td>
                    <td className="border border-muted/20 p-2">{investor.probability}%</td>
                    <td className="border border-muted/20 p-2">{investor.lastContact}</td>
                    <td className="border border-muted/20 p-2">{investor.nextFollowUp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {activeTab === "timeline" && (
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Activity Timeline</h2>
          {allActivities.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Nessuna attività registrata. Le attività verranno visualizzate quando inizierai a interagire con gli investitori.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative border-l-2 border-[#ff6b35] pl-8 space-y-6">
              {allActivities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#ff6b35] border-4 border-background" />
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold text-lg">{activity.investor_name}</p>
                          <Badge variant="outline" className="capitalize mb-2">{activity.activity_type}</Badge>
                          <p className="text-sm text-muted-foreground">{activity.activity_description}</p>
                          <p className="text-xs text-muted-foreground mt-2">by {activity.created_by}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {timeAgo(activity.activity_date)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === "reports" && (
        <main className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
          
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Contacts</span>
                    <span className="text-sm font-bold">{investorsData.length}</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Contacted</span>
                    <span className="text-sm font-bold">
                      {investorsData.filter(i => i.status !== "to-contact").length}
                    </span>
                  </div>
                  <Progress 
                    value={(investorsData.filter(i => i.status !== "to-contact").length / investorsData.length) * 100} 
                    className="h-3" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Meetings</span>
                    <span className="text-sm font-bold">
                      {investorsData.filter(i => i.status === "meeting" || i.status === "negotiation").length}
                    </span>
                  </div>
                  <Progress 
                    value={(investorsData.filter(i => i.status === "meeting" || i.status === "negotiation").length / investorsData.length) * 100} 
                    className="h-3" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Closed</span>
                    <span className="text-sm font-bold">
                      {investorsData.filter(i => i.status === "closed").length}
                    </span>
                  </div>
                  <Progress 
                    value={(investorsData.filter(i => i.status === "closed").length / investorsData.length) * 100} 
                    className="h-3" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Investors by Value */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Investors by Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investorsData
                  .sort((a, b) => b.pipelineValue - a.pipelineValue)
                  .slice(0, 10)
                  .map((investor, idx) => (
                    <div key={investor.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff6b35] text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium">{investor.name}</p>
                          <p className="text-xs text-muted-foreground">{investor.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(investor.pipelineValue)}</p>
                        <p className="text-xs text-muted-foreground">{investor.probability}% probability</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Investors by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(new Set(investorsData.map(i => i.category))).map(category => {
                  const count = investorsData.filter(i => i.category === category).length;
                  const percentage = (count / investorsData.length) * 100;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      )}

      {activeTab === "settings" && (
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current User</Label>
                  <Input value={currentUser} disabled />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value="Admin" disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Follow-up Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminders for upcoming follow-ups</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export investor data and reports for external analysis
                </p>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      )}

      {/* Investor Detail Modal */}
      {selectedInvestor && (
        <Dialog open={!!selectedInvestor} onOpenChange={() => setSelectedInvestor(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedInvestor.name}</DialogTitle>
              <p className="text-muted-foreground">{selectedInvestor.company}</p>
            </DialogHeader>

            <Tabs value={modalTab} onValueChange={setModalTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="followups">Follow-ups</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{selectedInvestor.company}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedInvestor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className={getStatusBadge(selectedInvestor.status).color}>
                        {getStatusBadge(selectedInvestor.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessuna attività registrata. Le attività verranno aggiunte automaticamente quando interagisci con questo investitore.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="border-l-2 border-[#ff6b35] pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{activity.activity_type}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.activity_date).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.activity_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {activity.created_by}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessuna nota ancora. Aggiungi la prima nota qui sotto.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((item) => (
                      <div key={item.id} className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm mb-2">{item.note_text}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.created_by}</span>
                          <span>{new Date(item.created_at).toLocaleDateString('it-IT')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Note Form */}
                <div className="border-t pt-4 space-y-3">
                  <Label htmlFor="new-note">Aggiungi Nota</Label>
                  <Textarea
                    id="new-note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Inserisci una nota privata su questo investitore..."
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleAddNote} 
                    className="w-full"
                    disabled={addNoteMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {addNoteMutation.isPending ? "Salvataggio..." : "Aggiungi Nota"}
                  </Button>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                {documents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessun documento condiviso. I documenti condivisi appariranno qui.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-[#ff6b35]/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-[#ff6b35]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.document_name}</p>
                            <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(doc.uploaded_at).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Follow-ups Tab */}
              <TabsContent value="followups" className="space-y-4">
                {followUps.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessun follow-up programmato. Schedula il primo follow-up qui sotto.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {followUps.map((followup) => (
                      <div key={followup.id} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#ff6b35]" />
                            <span className="text-sm font-medium capitalize">{followup.follow_up_type}</span>
                          </div>
                          <Badge variant="outline" className="capitalize">{followup.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{followup.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(followup.follow_up_date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Schedule Follow-up Form */}
                <div className="border-t pt-4 space-y-3">
                  <Label>Schedula Follow-up</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="followup-date" className="text-xs">Data</Label>
                      <Input
                        id="followup-date"
                        type="date"
                        value={newFollowUp.date}
                        onChange={(e) => setNewFollowUp({...newFollowUp, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="followup-type" className="text-xs">Tipo</Label>
                      <Select
                        value={newFollowUp.type}
                        onValueChange={(value) => setNewFollowUp({...newFollowUp, type: value})}
                      >
                        <SelectTrigger id="followup-type">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="followup-desc" className="text-xs">Descrizione</Label>
                    <Textarea
                      id="followup-desc"
                      value={newFollowUp.description}
                      onChange={(e) => setNewFollowUp({...newFollowUp, description: e.target.value})}
                      placeholder="Descrivi il follow-up..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button 
                    onClick={handleScheduleFollowUp} 
                    className="w-full"
                    disabled={addFollowUpMutation.isPending}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {addFollowUpMutation.isPending ? "Salvataggio..." : "Schedula Follow-up"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ABCCompanyConsole;
