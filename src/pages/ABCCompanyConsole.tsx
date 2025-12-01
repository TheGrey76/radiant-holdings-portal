import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, 
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";

// Sample investor data
const investorsData = [
  {
    id: 1,
    name: "Marco Boschetti",
    company: "Family Office Italia",
    role: "Amministratore Unico",
    category: "Family Office",
    city: "Milano",
    source: "LinkedIn Network",
    priority: "high",
    status: "meeting",
    lastContact: "Dec 1, 2024",
    nextFollowUp: "Dec 10, 2024",
    pipelineValue: 500000,
    probability: 60,
    email: "marco.boschetti@familyofficeitalia.com",
    phone: "+39 02 1234 5678"
  },
  {
    id: 2,
    name: "Patrizia Polonia",
    company: "Fondo Italiano d'Investimento SGR",
    role: "Investment Manager",
    category: "Private Equity",
    city: "Roma",
    source: "Industry Database",
    priority: "high",
    status: "interested",
    lastContact: "Nov 30, 2024",
    nextFollowUp: "Dec 5, 2024",
    pipelineValue: 800000,
    probability: 70,
    email: "p.polonia@fondoitaliano.it",
    phone: "+39 06 9876 5432"
  },
  {
    id: 3,
    name: "Andrea Reale",
    company: "H14 S.p.A. (Fininvest)",
    role: "Managing Director",
    category: "Corporate Investor",
    city: "Milano",
    source: "Direct Network",
    priority: "high",
    status: "negotiation",
    lastContact: "Dec 2, 2024",
    nextFollowUp: "Dec 8, 2024",
    pipelineValue: 600000,
    probability: 50,
    email: "a.reale@h14.it",
    phone: "+39 02 5555 1234"
  }
];

const ABCCompanyConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // KPI Data
  const kpis = {
    contacts: { current: 57, target: 57, percentage: 100 },
    meetings: { current: 12, target: 20, percentage: 60 },
    pipeline: { current: 4200000, target: 10000000, percentage: 42 },
    closed: { current: 1500000, target: 10000000, percentage: 15 }
  };

  // Recent Activity
  const recentActivity = [
    { investor: "Marco Boschetti", action: "Meeting scheduled for Dec 10, 2024", time: "2 hours ago" },
    { investor: "Fondo Italiano d'Investimento SGR", action: 'Email sent: "ABC Company Opportunity"', time: "5 hours ago" },
    { investor: "Patrizia Polonia", action: 'Note added: "Very interested, wants financials"', time: "1 day ago" },
    { investor: "Andrea Reale", action: "Status changed: Contacted → Interested", time: "2 days ago" }
  ];

  // Upcoming Follow-ups
  const upcomingFollowUps = [
    { date: "Tomorrow", investor: "Andrea Reale", action: "Follow-up call", time: "10:00 AM", overdue: false },
    { date: "Dec 5, 2024", investor: "Patrizia Polonia", action: "Send financial model", time: "All day", overdue: false },
    { date: "Dec 8, 2024", investor: "Fondo Italiano SGR", action: "Meeting", time: "2:00 PM", overdue: false },
    { date: "Overdue", investor: "Stefano Mortarotti", action: "Follow-up email", time: "", overdue: true },
    { date: "Overdue", investor: "Emanuele Marangoni", action: "Schedule meeting", time: "", overdue: true }
  ];

  // Conversion Funnel Data
  const funnelData = [
    { stage: "Contacts", count: 57, percentage: 100 },
    { stage: "Contacted", count: 45, percentage: 79 },
    { stage: "Interested", count: 20, percentage: 35 },
    { stage: "Meetings", count: 12, percentage: 21 },
    { stage: "Negotiation", count: 5, percentage: 9 },
    { stage: "Closed", count: 2, percentage: 4 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ABC COMPANY FUNDRAISING CONSOLE</h1>
              <p className="text-sm text-muted-foreground">Target: €10,000,000 | Deadline: March 31, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">User: Edoardo Grigione</span>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
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
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">MEETINGS</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{kpis.meetings.current}/{kpis.meetings.target}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.meetings.percentage}%</p>
                  </CardContent>
                </Card>
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
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">CLOSED</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.closed.current)}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.closed.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Timeline Progress */}
            <Card>
              <CardHeader>
                <CardTitle>OVERALL PROGRESS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dec 2024</span>
                    <span className="text-primary font-bold">35%</span>
                    <span className="text-muted-foreground">Mar 2026</span>
                  </div>
                  <Progress value={35} className="h-3" />
                </div>
                <p className="text-sm text-foreground">Current Phase: <span className="font-semibold text-primary">Initial Meetings (Phase 2)</span></p>
              </CardContent>
            </Card>

            {/* Two Column Layout: Recent Activity & Upcoming Follow-ups */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    RECENT ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="border-b border-border pb-3 last:border-0">
                        <p className="font-semibold text-foreground text-sm">{activity.investor}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    UPCOMING FOLLOW-UPS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingFollowUps.map((followUp, idx) => (
                      <div key={idx} className={`border-b border-border pb-3 last:border-0 ${followUp.overdue ? 'bg-red-500/5 -mx-6 px-6 py-3' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-xs font-semibold ${followUp.overdue ? 'text-red-600' : 'text-primary'}`}>
                              {followUp.overdue ? '⚠️ OVERDUE' : followUp.date.toUpperCase()}
                            </p>
                            <p className="text-sm text-foreground font-semibold">{followUp.investor}</p>
                            <p className="text-sm text-muted-foreground">{followUp.action}</p>
                          </div>
                          {followUp.time && <span className="text-xs text-muted-foreground">{followUp.time}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>CONVERSION FUNNEL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((stage, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.count} {stage.stage}</span>
                        <span className="text-primary font-semibold">{stage.percentage}%</span>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INVESTORS TAB */}
          <TabsContent value="investors" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search investors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investor Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investorsData.filter(inv => 
                inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.company.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((investor) => {
                const status = getStatusBadge(investor.status);
                return (
                  <motion.div
                    key={investor.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`cursor-pointer hover:shadow-lg transition-all ${getPriorityColor(investor.priority)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge className={status.color}>{status.label}</Badge>
                          {investor.priority === "high" && (
                            <Badge variant="destructive" className="bg-primary">🔥 HIGH PRIORITY</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{investor.name}</h3>
                          <p className="text-sm text-muted-foreground">{investor.company}</p>
                          <p className="text-xs text-muted-foreground">{investor.role}</p>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{investor.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="h-3 w-3" />
                            <span>{investor.category}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border space-y-1">
                          <p className="text-xs text-muted-foreground">Last Contact: {investor.lastContact}</p>
                          <p className="text-xs text-muted-foreground">Next Follow-up: {investor.nextFollowUp}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-semibold text-foreground">{formatCurrency(investor.pipelineValue)}</span>
                            <span className="text-sm text-primary font-semibold">{investor.probability}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 gap-2">
                            <Mail className="h-3 w-3" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 gap-2">
                            <Phone className="h-3 w-3" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC COMPANY FUNDRAISING TIMELINE</CardTitle>
                <p className="text-sm text-muted-foreground">December 2024 → March 2026</p>
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
                        <p className="text-sm text-muted-foreground">Oct 2025 - Mar 2026</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground">Target: €3-5M first closing</p>
                        <Progress value={30} className="h-2" />
                        <p className="text-sm font-semibold text-foreground">€1.5M / €5M (30%)</p>
                        <p className="text-xs text-muted-foreground">Deadline: March 31, 2026</p>
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
                      <Button className="gap-2">
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
                    {[
                      { name: "Fondo Italiano d'Investimento SGR", value: 800000, prob: 70 },
                      { name: "Family Office Italia", value: 500000, prob: 60 },
                      { name: "H14 S.p.A. (Fininvest)", value: 600000, prob: 50 },
                      { name: "Fondo Pensione Pegaso", value: 400000, prob: 55 },
                      { name: "Mamacrowd (Azimut)", value: 350000, prob: 45 }
                    ].map((investor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{idx + 1}. {investor.name}</p>
                          <p className="text-xs text-muted-foreground">Probability: {investor.prob}%</p>
                        </div>
                        <p className="text-sm font-bold text-primary">{formatCurrency(investor.value)}</p>
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
                    <Input value="March 31, 2026" />
                  </div>
                </div>
                <Button>Update Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ABCCompanyConsole;
