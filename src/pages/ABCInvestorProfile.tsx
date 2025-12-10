import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Calendar,
  Euro,
  Percent,
  User,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  TrendingUp,
  Target,
  Activity
} from "lucide-react";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  ruolo: string | null;
  categoria: string;
  citta: string | null;
  fonte: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  priorita: string | null;
  status: string;
  pipeline_value: number;
  probability: number | null;
  expected_close: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  approval_status: string;
  relationship_owner: string | null;
  rilevanza: string | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  note_text: string;
  created_by: string;
  created_at: string;
}

interface Followup {
  id: string;
  follow_up_type: string;
  follow_up_date: string;
  description: string | null;
  status: string;
  created_by: string;
}

interface ActivityRecord {
  id: string;
  activity_type: string;
  activity_description: string;
  activity_date: string;
  created_by: string;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  document_url: string | null;
  uploaded_at: string;
  uploaded_by: string;
}

interface Commitment {
  id: string;
  amount: number;
  currency: string;
  commitment_type: string;
  status: string;
  commitment_date: string;
  notes: string | null;
}

interface EmailCampaign {
  id: string;
  campaign_name: string;
  subject: string;
  sent_at: string;
}

const STATUS_OPTIONS = [
  "To Contact", "Contacted", "Interested", "Meeting Scheduled", 
  "In Negotiation", "Closed", "Not Interested"
];

const CATEGORY_OPTIONS = [
  "Family Office", "Private Equity", "Venture Capital", "Corporate", 
  "HNWI", "Institutional", "Club Deal Investor", "Other"
];

const ABCInvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvestor, setEditedInvestor] = useState<Partial<Investor>>({});
  const [newNote, setNewNote] = useState("");

  const currentUserEmail = sessionStorage.getItem('abc_console_email') || '';

  useEffect(() => {
    if (id) {
      fetchInvestorData();
    }
  }, [id]);

  const fetchInvestorData = async () => {
    if (!id) return;
    setLoading(true);
    
    try {
      // Fetch investor
      const { data: investorData, error: investorError } = await supabase
        .from('abc_investors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (investorError) throw investorError;
      if (!investorData) {
        toast.error("Investitore non trovato");
        navigate('/abc-company-console');
        return;
      }

      setInvestor(investorData);
      setEditedInvestor(investorData);

      // Fetch related data in parallel
      const [notesRes, followupsRes, activitiesRes, docsRes, commitmentsRes, emailRes] = await Promise.all([
        supabase.from('abc_investor_notes').select('*').eq('investor_name', investorData.nome).order('created_at', { ascending: false }),
        supabase.from('abc_investor_followups').select('*').eq('investor_name', investorData.nome).order('follow_up_date', { ascending: false }),
        supabase.from('abc_investor_activities').select('*').eq('investor_name', investorData.nome).order('activity_date', { ascending: false }),
        supabase.from('abc_investor_documents').select('*').eq('investor_name', investorData.nome).order('uploaded_at', { ascending: false }),
        supabase.from('abc_investor_commitments').select('*').eq('investor_name', investorData.nome).order('commitment_date', { ascending: false }),
        supabase.from('abc_email_campaign_history').select('*').order('sent_at', { ascending: false })
      ]);

      setNotes(notesRes.data || []);
      setFollowups(followupsRes.data || []);
      setActivities(activitiesRes.data || []);
      setDocuments(docsRes.data || []);
      setCommitments(commitmentsRes.data || []);
      
      // Filter email campaigns that included this investor
      const campaigns = (emailRes.data || []).filter(campaign => {
        const recipients = campaign.recipients as any[];
        return recipients?.some(r => r.email === investorData.email || r.nome === investorData.nome);
      });
      setEmailHistory(campaigns);

    } catch (error) {
      console.error('Error fetching investor:', error);
      toast.error("Errore nel caricamento dati");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!investor || !id) return;

    try {
      const { error } = await supabase
        .from('abc_investors')
        .update({
          nome: editedInvestor.nome,
          azienda: editedInvestor.azienda,
          ruolo: editedInvestor.ruolo,
          categoria: editedInvestor.categoria,
          citta: editedInvestor.citta,
          fonte: editedInvestor.fonte,
          linkedin: editedInvestor.linkedin,
          email: editedInvestor.email,
          phone: editedInvestor.phone,
          status: editedInvestor.status,
          pipeline_value: editedInvestor.pipeline_value,
          probability: editedInvestor.probability,
          expected_close: editedInvestor.expected_close,
          approval_status: editedInvestor.approval_status,
          relationship_owner: editedInvestor.relationship_owner,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setInvestor({ ...investor, ...editedInvestor } as Investor);
      setIsEditing(false);
      toast.success("Profilo aggiornato");
    } catch (error) {
      console.error('Error updating investor:', error);
      toast.error("Errore nell'aggiornamento");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !investor) return;

    try {
      const { error } = await supabase
        .from('abc_investor_notes')
        .insert({
          investor_name: investor.nome,
          note_text: newNote,
          created_by: currentUserEmail
        });

      if (error) throw error;

      setNewNote("");
      fetchInvestorData();
      toast.success("Nota aggiunta");
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error("Errore nell'aggiunta nota");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'To Contact': 'bg-slate-500',
      'Contacted': 'bg-blue-500',
      'Interested': 'bg-cyan-500',
      'Meeting Scheduled': 'bg-purple-500',
      'In Negotiation': 'bg-amber-500',
      'Closed': 'bg-green-500',
      'Not Interested': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approvato</Badge>;
      case 'not_approved':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Non Approvato</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">In Attesa</Badge>;
    }
  };

  const extractName = (email: string) => {
    const parts = email.split('@')[0].split('.');
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!investor) {
    return null;
  }

  const weightedValue = investor.pipeline_value * (investor.probability || 50) / 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/abc-company-console')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{investor.nome}</h1>
                <p className="text-muted-foreground">{investor.azienda}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getApprovalBadge(investor.approval_status)}
              <Badge className={`${getStatusColor(investor.status)} text-white`}>
                {investor.status}
              </Badge>
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" /> Annulla
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Salva
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Modifica
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Informazioni Contatto
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Nome</label>
                      <Input 
                        value={editedInvestor.nome || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, nome: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Azienda</label>
                      <Input 
                        value={editedInvestor.azienda || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, azienda: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Ruolo</label>
                      <Input 
                        value={editedInvestor.ruolo || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, ruolo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Categoria</label>
                      <Select 
                        value={editedInvestor.categoria || ''} 
                        onValueChange={(v) => setEditedInvestor({...editedInvestor, categoria: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Email</label>
                      <Input 
                        value={editedInvestor.email || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Telefono</label>
                      <Input 
                        value={editedInvestor.phone || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Città</label>
                      <Input 
                        value={editedInvestor.citta || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, citta: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">LinkedIn</label>
                      <Input 
                        value={editedInvestor.linkedin || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, linkedin: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Azienda</p>
                        <p className="font-medium">{investor.azienda}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ruolo</p>
                        <p className="font-medium">{investor.ruolo || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{investor.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefono</p>
                        <p className="font-medium">{investor.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Città</p>
                        <p className="font-medium">{investor.citta || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">LinkedIn</p>
                        {investor.linkedin ? (
                          <a href={investor.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:underline">
                            Profilo
                          </a>
                        ) : (
                          <p className="font-medium">-</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Notes, Activities, etc */}
            <Card>
              <Tabs defaultValue="notes" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="notes" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" /> Note ({notes.length})
                    </TabsTrigger>
                    <TabsTrigger value="followups" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> Follow-up ({followups.length})
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" /> Attività ({activities.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" /> Doc ({documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="emails" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" /> Email ({emailHistory.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="notes" className="mt-0 space-y-4">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Aggiungi una nota..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                        Aggiungi
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {notes.map(note => (
                        <div key={note.id} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">{note.note_text}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{extractName(note.created_by)}</span>
                            <span>•</span>
                            <span>{format(new Date(note.created_at), 'dd MMM yyyy HH:mm', { locale: it })}</span>
                          </div>
                        </div>
                      ))}
                      {notes.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nessuna nota</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="followups" className="mt-0">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {followups.map(fu => (
                        <div key={fu.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{fu.follow_up_type}</Badge>
                              <Badge className={fu.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                {fu.status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{fu.description || '-'}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{format(new Date(fu.follow_up_date), 'dd MMM yyyy', { locale: it })}</p>
                            <p className="text-xs">{extractName(fu.created_by)}</p>
                          </div>
                        </div>
                      ))}
                      {followups.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nessun follow-up</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activities" className="mt-0">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {activities.map(act => (
                        <div key={act.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{act.activity_type}</Badge>
                          </div>
                          <p className="text-sm mt-1">{act.activity_description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{extractName(act.created_by)}</span>
                            <span>•</span>
                            <span>{format(new Date(act.activity_date), 'dd MMM yyyy', { locale: it })}</span>
                          </div>
                        </div>
                      ))}
                      {activities.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nessuna attività</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.document_name}</p>
                              <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{format(new Date(doc.uploaded_at), 'dd MMM yyyy', { locale: it })}</p>
                          </div>
                        </div>
                      ))}
                      {documents.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nessun documento</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="emails" className="mt-0">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {emailHistory.map(email => (
                        <div key={email.id} className="bg-muted/50 rounded-lg p-3">
                          <p className="font-medium">{email.campaign_name}</p>
                          <p className="text-sm text-muted-foreground">{email.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(email.sent_at), 'dd MMM yyyy HH:mm', { locale: it })}
                          </p>
                        </div>
                      ))}
                      {emailHistory.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nessuna email inviata</p>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Pipeline & Commitments */}
          <div className="space-y-6">
            {/* Pipeline Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Status</label>
                      <Select 
                        value={editedInvestor.status || ''} 
                        onValueChange={(v) => setEditedInvestor({...editedInvestor, status: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Pipeline Value (€)</label>
                      <Input 
                        type="number"
                        value={editedInvestor.pipeline_value || 0} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, pipeline_value: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Probabilità (%)</label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={editedInvestor.probability || 50} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, probability: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Expected Close</label>
                      <Input 
                        type="date"
                        value={editedInvestor.expected_close || ''} 
                        onChange={(e) => setEditedInvestor({...editedInvestor, expected_close: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pipeline Value</span>
                      <span className="font-bold text-lg">€{investor.pipeline_value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Probabilità</span>
                      <span className="font-medium">{investor.probability || 50}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Weighted Value</span>
                      <span className="font-bold text-green-400">€{weightedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expected Close</span>
                      <span className="font-medium">
                        {investor.expected_close 
                          ? format(new Date(investor.expected_close), 'dd MMM yyyy', { locale: it })
                          : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Categoria</span>
                      <Badge variant="outline">{investor.categoria}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fonte</span>
                      <span className="font-medium">{investor.fonte || '-'}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Commitments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" /> Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commitments.length > 0 ? (
                  <div className="space-y-3">
                    {commitments.map(c => (
                      <div key={c.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">
                            {c.currency} {c.amount.toLocaleString()}
                          </span>
                          <Badge className={c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {c.commitment_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(c.commitment_date), 'dd MMM yyyy', { locale: it })}
                        </p>
                        {c.notes && <p className="text-sm mt-2">{c.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nessun commitment</p>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" /> Metadati
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creato</span>
                  <span>{format(new Date(investor.created_at), 'dd MMM yyyy', { locale: it })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aggiornato</span>
                  <span>{format(new Date(investor.updated_at), 'dd MMM yyyy', { locale: it })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span>{investor.relationship_owner || '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABCInvestorProfile;
