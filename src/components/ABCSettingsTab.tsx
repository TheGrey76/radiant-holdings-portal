import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Target, Users, Mail, Settings, Plus, X, Save, 
  Upload, Euro, Calendar, Briefcase, Globe, Phone, MapPin,
  UserCog, Shield, Bell
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  isDefault?: boolean;
}

interface CompanySettings {
  companyName: string;
  companyDescription: string;
  sector: string;
  website: string;
  phone: string;
  address: string;
  logoUrl: string;
}

interface FundraisingSettings {
  targetAmount: number;
  deadline: string;
  valuation: number;
  sharePrice: number;
  minInvestment: number;
  dealStructure: string;
  investmentType: string;
}

interface EmailSettings {
  senderName: string;
  senderEmail: string;
  replyTo: string;
  signature: string;
  defaultSubject: string;
}

interface NotificationPrefs {
  dailySummary: boolean;
  followUpReminders: boolean;
  milestoneAlerts: boolean;
  overdueTasks: boolean;
  biweeklyReport: boolean;
  newInteractions: boolean;
  statusChanges: boolean;
  documentUploads: boolean;
  meetingReminders: boolean;
}

const DEFAULT_TEAM: TeamMember[] = [
  { email: "edoardo.grigione@aries76.com", name: "Edoardo Grigione", role: "admin", isDefault: true },
  { email: "admin@aries76.com", name: "Admin ARIES76", role: "admin", isDefault: true },
  { email: "stefano.taioli@abccompany.it", name: "Stefano Taioli", role: "admin", isDefault: true },
  { email: "enrico.sobacchi@abccompany.it", name: "Enrico Sobacchi", role: "manager", isDefault: true },
  { email: "lorenzo.delforno@abccompany.it", name: "Lorenzo Del Forno", role: "manager", isDefault: true },
  { email: "alessandro.catullo@aries76.com", name: "Alessandro Catullo", role: "manager", isDefault: true },
];

const SECTORS = [
  "Private Equity", "Venture Capital", "Real Estate", "Infrastructure",
  "Credit", "Hedge Funds", "Fund of Funds", "Other"
];

const DEAL_STRUCTURES = [
  "Club Deal", "SPV", "Direct Investment", "Co-Investment", "Fund Commitment"
];

const INVESTMENT_TYPES = [
  "Equity", "Debt", "Convertible", "Preferred Equity", "Mezzanine"
];

export const ABCSettingsTab = () => {
  const currentUserEmail = sessionStorage.getItem('abc_console_email') || '';
  
  // Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('abc_company_settings');
    return saved ? JSON.parse(saved) : {
      companyName: "ABC Company",
      companyDescription: "Club Deal per investimenti in PMI italiane con track record consolidato di 207 operazioni e €32M di capitale investito.",
      sector: "Private Equity",
      website: "www.abccompany.it",
      phone: "+39 02 1234567",
      address: "Milano, Italia",
      logoUrl: ""
    };
  });

  // Fundraising Settings
  const [fundraisingSettings, setFundraisingSettings] = useState<FundraisingSettings>(() => {
    const saved = localStorage.getItem('abc_fundraising_settings');
    return saved ? JSON.parse(saved) : {
      targetAmount: 12000000,
      deadline: "2026-06-30",
      valuation: 48000000,
      sharePrice: 4.00,
      minInvestment: 50000,
      dealStructure: "Club Deal",
      investmentType: "Equity"
    };
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => {
    const saved = localStorage.getItem('abc_email_settings');
    return saved ? JSON.parse(saved) : {
      senderName: "ABC Company - Capital Raise",
      senderEmail: "edoardo.grigione@aries76.com",
      replyTo: "stefano.taioli@abccompany.it",
      signature: `Best regards,\n\nEdoardo Grigione\nCEO, ARIES76\n\n---\nABC Company Capital Raise\nPowered by ARIES76`,
      defaultSubject: "ABC Company - Opportunità di Investimento"
    };
  });

  // Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('abc_team_members');
    const custom = saved ? JSON.parse(saved) : [];
    return [...DEFAULT_TEAM, ...custom];
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(() => {
    const saved = localStorage.getItem('abc_notification_prefs');
    return saved ? JSON.parse(saved) : {
      dailySummary: true,
      followUpReminders: true,
      milestoneAlerts: true,
      overdueTasks: true,
      biweeklyReport: true,
      newInteractions: true,
      statusChanges: true,
      documentUploads: false,
      meetingReminders: true
    };
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'manager' | 'viewer'>('viewer');

  // Save handlers
  const saveCompanySettings = () => {
    localStorage.setItem('abc_company_settings', JSON.stringify(companySettings));
    toast.success("Impostazioni azienda salvate");
  };

  const saveFundraisingSettings = () => {
    localStorage.setItem('abc_fundraising_settings', JSON.stringify(fundraisingSettings));
    toast.success("Impostazioni fundraising salvate");
  };

  const saveEmailSettings = () => {
    localStorage.setItem('abc_email_settings', JSON.stringify(emailSettings));
    toast.success("Impostazioni email salvate");
  };

  const saveNotificationPrefs = () => {
    localStorage.setItem('abc_notification_prefs', JSON.stringify(notificationPrefs));
    toast.success("Preferenze notifiche salvate");
  };

  const addTeamMember = () => {
    if (!newMemberEmail.trim() || !newMemberEmail.includes('@')) {
      toast.error("Inserisci un email valido");
      return;
    }
    if (teamMembers.some(m => m.email === newMemberEmail)) {
      toast.error("Email già presente nel team");
      return;
    }

    const newMember: TeamMember = {
      email: newMemberEmail.trim(),
      name: newMemberName.trim() || newMemberEmail.split('@')[0],
      role: newMemberRole
    };

    const updatedTeam = [...teamMembers, newMember];
    setTeamMembers(updatedTeam);
    
    // Save only custom members
    const customMembers = updatedTeam.filter(m => !m.isDefault);
    localStorage.setItem('abc_team_members', JSON.stringify(customMembers));
    
    setNewMemberEmail("");
    setNewMemberName("");
    setNewMemberRole('viewer');
    toast.success("Membro aggiunto al team");
  };

  const removeTeamMember = (email: string) => {
    const member = teamMembers.find(m => m.email === email);
    if (member?.isDefault) {
      toast.error("Non puoi rimuovere i membri default");
      return;
    }

    const updatedTeam = teamMembers.filter(m => m.email !== email);
    setTeamMembers(updatedTeam);
    
    const customMembers = updatedTeam.filter(m => !m.isDefault);
    localStorage.setItem('abc_team_members', JSON.stringify(customMembers));
    toast.success("Membro rimosso dal team");
  };

  const updateMemberRole = (email: string, role: 'admin' | 'manager' | 'viewer') => {
    const member = teamMembers.find(m => m.email === email);
    if (member?.isDefault) {
      toast.error("Non puoi modificare i ruoli dei membri default");
      return;
    }

    const updatedTeam = teamMembers.map(m => 
      m.email === email ? { ...m, role } : m
    );
    setTeamMembers(updatedTeam);
    
    const customMembers = updatedTeam.filter(m => !m.isDefault);
    localStorage.setItem('abc_team_members', JSON.stringify(customMembers));
    toast.success("Ruolo aggiornato");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Tabs defaultValue="company" className="space-y-6">
      <TabsList className="grid grid-cols-5 w-full max-w-3xl">
        <TabsTrigger value="company" className="text-xs gap-1">
          <Building2 className="h-3.5 w-3.5" /> Azienda
        </TabsTrigger>
        <TabsTrigger value="fundraising" className="text-xs gap-1">
          <Target className="h-3.5 w-3.5" /> Fundraising
        </TabsTrigger>
        <TabsTrigger value="team" className="text-xs gap-1">
          <Users className="h-3.5 w-3.5" /> Team
        </TabsTrigger>
        <TabsTrigger value="email" className="text-xs gap-1">
          <Mail className="h-3.5 w-3.5" /> Email
        </TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs gap-1">
          <Bell className="h-3.5 w-3.5" /> Notifiche
        </TabsTrigger>
      </TabsList>

      {/* COMPANY TAB */}
      <TabsContent value="company" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informazioni Azienda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Azienda</label>
                <Input 
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Settore</label>
                <Select 
                  value={companySettings.sector}
                  onValueChange={(v) => setCompanySettings({...companySettings, sector: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrizione</label>
              <Textarea 
                value={companySettings.companyDescription}
                onChange={(e) => setCompanySettings({...companySettings, companyDescription: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Website
                </label>
                <Input 
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Telefono
                </label>
                <Input 
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Sede
                </label>
                <Input 
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={saveCompanySettings} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" /> Salva Impostazioni
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* FUNDRAISING TAB */}
      <TabsContent value="fundraising" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Dettagli Fundraising
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5" /> Target Raccolta (€)
                </label>
                <Input 
                  type="number"
                  value={fundraisingSettings.targetAmount}
                  onChange={(e) => setFundraisingSettings({...fundraisingSettings, targetAmount: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Deadline
                </label>
                <Input 
                  type="date"
                  value={fundraisingSettings.deadline}
                  onChange={(e) => setFundraisingSettings({...fundraisingSettings, deadline: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Valuation (€)</label>
                <Input 
                  type="number"
                  value={fundraisingSettings.valuation}
                  onChange={(e) => setFundraisingSettings({...fundraisingSettings, valuation: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prezzo per Azione (€)</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={fundraisingSettings.sharePrice}
                  onChange={(e) => setFundraisingSettings({...fundraisingSettings, sharePrice: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Investimento Minimo (€)</label>
                <Input 
                  type="number"
                  value={fundraisingSettings.minInvestment}
                  onChange={(e) => setFundraisingSettings({...fundraisingSettings, minInvestment: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> Struttura Deal
                </label>
                <Select 
                  value={fundraisingSettings.dealStructure}
                  onValueChange={(v) => setFundraisingSettings({...fundraisingSettings, dealStructure: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STRUCTURES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo Investimento</label>
                <Select 
                  value={fundraisingSettings.investmentType}
                  onValueChange={(v) => setFundraisingSettings({...fundraisingSettings, investmentType: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-3">Riepilogo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-bold text-lg">€{fundraisingSettings.targetAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valuation</p>
                  <p className="font-bold text-lg">€{fundraisingSettings.valuation.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price/Share</p>
                  <p className="font-bold text-lg">€{fundraisingSettings.sharePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">% del Capitale</p>
                  <p className="font-bold text-lg">{((fundraisingSettings.targetAmount / fundraisingSettings.valuation) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <Button onClick={saveFundraisingSettings} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" /> Salva Impostazioni
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TEAM TAB */}
      <TabsContent value="team" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Team List */}
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div 
                  key={member.email} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.isDefault ? (
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role} <Shield className="h-3 w-3 ml-1" />
                      </Badge>
                    ) : (
                      <Select 
                        value={member.role}
                        onValueChange={(v) => updateMemberRole(member.email, v as any)}
                      >
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {!member.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeTeamMember(member.email)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-3">Aggiungi Nuovo Membro</h4>
              <div className="grid md:grid-cols-4 gap-3">
                <Input 
                  placeholder="Nome"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <Input 
                  type="email"
                  placeholder="Email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                <Select value={newMemberRole} onValueChange={(v) => setNewMemberRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTeamMember}>
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi
                </Button>
              </div>
            </div>

            {/* Roles Legend */}
            <div className="bg-muted/30 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2 text-sm">Legenda Ruoli</h4>
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Badge className={getRoleBadgeColor('admin')}>Admin</Badge>
                  <span className="text-muted-foreground">Accesso completo, gestione team</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className={getRoleBadgeColor('manager')}>Manager</Badge>
                  <span className="text-muted-foreground">Modifica investitori, invio email</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className={getRoleBadgeColor('viewer')}>Viewer</Badge>
                  <span className="text-muted-foreground">Solo visualizzazione</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* EMAIL TAB */}
      <TabsContent value="email" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurazione Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Mittente</label>
                <Input 
                  value={emailSettings.senderName}
                  onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Mittente</label>
                <Input 
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reply-To</label>
                <Input 
                  type="email"
                  value={emailSettings.replyTo}
                  onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Oggetto Default</label>
                <Input 
                  value={emailSettings.defaultSubject}
                  onChange={(e) => setEmailSettings({...emailSettings, defaultSubject: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Firma Email</label>
              <Textarea 
                value={emailSettings.signature}
                onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                rows={5}
                className="font-mono text-sm"
              />
            </div>

            <Button onClick={saveEmailSettings} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" /> Salva Configurazione
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* NOTIFICATIONS TAB */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preferenze Notifiche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Email Notifications</h4>
              <div className="space-y-2">
                {[
                  { key: 'dailySummary', label: 'Daily summary (8:00 AM)' },
                  { key: 'followUpReminders', label: 'Follow-up reminders (1 day before)' },
                  { key: 'milestoneAlerts', label: 'Milestone alerts' },
                  { key: 'overdueTasks', label: 'Overdue tasks' },
                  { key: 'biweeklyReport', label: 'Biweekly report' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationPrefs[item.key as keyof NotificationPrefs]}
                      onChange={(e) => setNotificationPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                      className="rounded" 
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-semibold">In-App Notifications</h4>
              <div className="space-y-2">
                {[
                  { key: 'newInteractions', label: 'New investor interactions' },
                  { key: 'statusChanges', label: 'Status changes' },
                  { key: 'documentUploads', label: 'Document uploads' },
                  { key: 'meetingReminders', label: 'Meeting reminders' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationPrefs[item.key as keyof NotificationPrefs]}
                      onChange={(e) => setNotificationPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                      className="rounded" 
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={saveNotificationPrefs} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" /> Salva Preferenze
            </Button>
          </CardContent>
        </Card>

        {/* Current User Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Profilo Utente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <Input value={currentUserEmail} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Role</label>
                <Input value="Console Admin" disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
