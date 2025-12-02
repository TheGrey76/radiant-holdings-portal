import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash2, Check, ExternalLink, Paperclip, Download } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { format } from "date-fns";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria: string;
  citta?: string;
  fonte?: string;
  status: string;
  pipelineValue: number;
  probability?: number;
  expectedClose?: string;
  relationshipOwner?: string;
  lastContactDate?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}

interface Note { id: string; note_text: string; created_by: string; created_at: string; }
interface FollowUp { id: string; follow_up_date: string; follow_up_type: string; description: string | null; status: string; created_by: string; }
interface Activity { id: string; activity_type: string; activity_description: string; activity_date: string; created_by: string; }
interface Document { id: string; document_name: string; document_type: string; document_url: string | null; uploaded_by: string; uploaded_at: string; }

interface Props {
  investor: Investor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const statusOptions = ['To Contact', 'Contacted', 'Interested', 'Meeting Scheduled', 'In Negotiation', 'Closed', 'Not Interested'];
const followUpTypes = ['Call', 'Email', 'Meeting', 'Video Call', 'Document Request'];
const activityTypes = ['Call', 'Email', 'Meeting', 'Presentation', 'Document Sent', 'Other'];
const documentTypes = ['NDA', 'Term Sheet', 'Due Diligence', 'Presentation', 'Contract', 'Other'];

export const ABCInvestorDetailDialog = ({ investor, open, onOpenChange, onUpdate }: Props) => {
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Investor>>({});
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [newFollowUp, setNewFollowUp] = useState({ date: '', time: '', type: 'Call', description: '' });
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({ type: 'Call', description: '' });
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState({ name: '', type: 'NDA', url: '' });

  useEffect(() => {
    if (investor && open) {
      setFormData({ ...investor });
      setTab('overview');
      setEditing(false);
      fetchNotes();
      fetchFollowUps();
      fetchActivities();
      fetchDocuments();
    }
  }, [investor, open]);

  const fetchNotes = async () => {
    if (!investor) return;
    const { data } = await supabase.from('abc_investor_notes').select('*').eq('investor_name', investor.nome).order('created_at', { ascending: false });
    setNotes(data || []);
  };

  const fetchFollowUps = async () => {
    if (!investor) return;
    const { data } = await supabase.from('abc_investor_followups').select('*').eq('investor_name', investor.nome).order('follow_up_date', { ascending: true });
    setFollowUps(data || []);
  };

  const fetchActivities = async () => {
    if (!investor) return;
    const { data } = await supabase.from('abc_investor_activities').select('*').eq('investor_name', investor.nome).order('activity_date', { ascending: false });
    setActivities(data || []);
  };

  const fetchDocuments = async () => {
    if (!investor) return;
    const { data } = await supabase.from('abc_investor_documents').select('*').eq('investor_name', investor.nome).order('uploaded_at', { ascending: false });
    setDocuments(data || []);
  };

  const handleSave = async () => {
    if (!investor) return;
    const { error } = await supabase.from('abc_investors' as any).update({
      nome: formData.nome, azienda: formData.azienda, ruolo: formData.ruolo || null,
      categoria: formData.categoria, citta: formData.citta || null, fonte: formData.fonte || null,
      status: formData.status, pipeline_value: formData.pipelineValue,
      probability: formData.probability, expected_close: formData.expectedClose || null,
      relationship_owner: formData.relationshipOwner || null,
      linkedin: formData.linkedin || null, email: formData.email || null, phone: formData.phone || null,
    }).eq('id', investor.id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Investor updated');
    setEditing(false);
    onUpdate();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!investor) return;
    await supabase.from('abc_investors' as any).update({ status: newStatus }).eq('id', investor.id);
    setFormData({ ...formData, status: newStatus });
    toast.success('Status updated');
    onUpdate();
  };

  const addNote = async () => {
    if (!investor || !newNote.trim()) return;
    await supabase.from('abc_investor_notes').insert({ investor_name: investor.nome, note_text: newNote.trim(), created_by: 'Team' });
    toast.success('Note added');
    setNewNote('');
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await supabase.from('abc_investor_notes').delete().eq('id', id);
    toast.success('Deleted');
    fetchNotes();
  };

  const addFollowUp = async () => {
    if (!investor || !newFollowUp.date) return;
    await supabase.from('abc_investor_followups').insert({
      investor_name: investor.nome, follow_up_date: newFollowUp.date, follow_up_type: newFollowUp.type,
      description: `${newFollowUp.time ? newFollowUp.time + ' - ' : ''}${newFollowUp.description}` || null, created_by: 'Team',
    });
    toast.success('Follow-up scheduled');
    setNewFollowUp({ date: '', time: '', type: 'Call', description: '' });
    fetchFollowUps();
  };

  const completeFollowUp = async (id: string) => {
    await supabase.from('abc_investor_followups').update({ status: 'completed' }).eq('id', id);
    toast.success('Completed');
    fetchFollowUps();
  };

  const deleteFollowUp = async (id: string) => {
    await supabase.from('abc_investor_followups').delete().eq('id', id);
    toast.success('Deleted');
    fetchFollowUps();
  };

  const addActivity = async () => {
    if (!investor || !newActivity.description.trim()) return;
    await supabase.from('abc_investor_activities').insert({
      investor_name: investor.nome, activity_type: newActivity.type, activity_description: newActivity.description.trim(), created_by: 'Team',
    });
    toast.success('Activity logged');
    setNewActivity({ type: 'Call', description: '' });
    fetchActivities();
  };

  const deleteActivity = async (id: string) => {
    await supabase.from('abc_investor_activities').delete().eq('id', id);
    toast.success('Deleted');
    fetchActivities();
  };

  const addDocument = async () => {
    if (!investor || !newDocument.name.trim()) return;
    await supabase.from('abc_investor_documents').insert({
      investor_name: investor.nome, document_name: newDocument.name.trim(), document_type: newDocument.type,
      document_url: newDocument.url || null, uploaded_by: 'Team',
    });
    toast.success('Document added');
    setNewDocument({ name: '', type: 'NDA', url: '' });
    fetchDocuments();
  };

  const deleteDocument = async (id: string) => {
    await supabase.from('abc_investor_documents').delete().eq('id', id);
    toast.success('Deleted');
    fetchDocuments();
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'To Contact': 'bg-muted', 'Contacted': 'bg-blue-500/20 text-blue-600',
      'Interested': 'bg-yellow-500/20 text-yellow-600', 'Meeting Scheduled': 'bg-purple-500/20 text-purple-600',
      'In Negotiation': 'bg-orange-500/20 text-orange-600', 'Closed': 'bg-green-500/20 text-green-600',
      'Not Interested': 'bg-red-500/20 text-red-600',
    };
    return map[status] || 'bg-muted';
  };

  if (!investor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">{editing ? 'Edit Investor' : investor.nome}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{investor.azienda}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4" />{editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Role</Label><Input value={formData.ruolo || ''} onChange={(e) => setFormData({ ...formData, ruolo: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Company</Label><Input value={formData.azienda || ''} onChange={(e) => setFormData({ ...formData, azienda: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Category</Label><Input value={formData.categoria || ''} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} /></div>
                  <div className="space-y-2"><Label>City</Label><Input value={formData.citta || ''} onChange={(e) => setFormData({ ...formData, citta: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Source</Label><Input value={formData.fonte || ''} onChange={(e) => setFormData({ ...formData, fonte: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Relationship Owner</Label><Input value={formData.relationshipOwner || ''} onChange={(e) => setFormData({ ...formData, relationshipOwner: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Pipeline Value (€)</Label><Input type="number" value={formData.pipelineValue || 0} onChange={(e) => setFormData({ ...formData, pipelineValue: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Probability (%)</Label><Input type="number" value={formData.probability || 0} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Expected Close</Label><Input type="date" value={formData.expectedClose || ''} onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })} /></div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="space-y-2"><Label>LinkedIn</Label><Input value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} /></div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">BASIC INFORMATION</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Full Name:</span><span className="font-medium">{investor.nome}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Company:</span><span className="font-medium">{investor.azienda}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Role:</span><span className="font-medium">{investor.ruolo || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span className="font-medium">{investor.categoria}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{investor.citta || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Source:</span><span className="font-medium">{investor.fonte || '-'}</span></div>
                    {investor.email && <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><a href={`mailto:${investor.email}`} className="text-primary hover:underline">{investor.email}</a></div>}
                    {investor.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><a href={`tel:${investor.phone}`} className="text-primary hover:underline">{investor.phone}</a></div>}
                    {investor.linkedin && <div className="flex justify-between items-center"><span className="text-muted-foreground">LinkedIn:</span><a href={investor.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">View Profile <ExternalLink className="h-3 w-3" /></a></div>}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">RELATIONSHIP STATUS</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Current Status:</span><Badge className={getStatusBadge(investor.status)}>{investor.status}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Pipeline Value:</span><span className="font-bold">€{investor.pipelineValue?.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Probability:</span><span className="font-bold text-primary">{investor.probability || 50}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Expected Close:</span><span className="font-medium">{investor.expectedClose || 'TBD'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Relationship Owner:</span><span className="font-medium">{investor.relationshipOwner || 'Edoardo Grigione'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Interactions:</span><span className="font-medium">{activities.length}</span></div>
                  </div>
                  <div className="pt-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">Update Status</Label>
                    <Select value={formData.status || investor.status} onValueChange={handleStatusChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Select value={newActivity.type} onValueChange={(v) => setNewActivity({ ...newActivity, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{activityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
                <div className="col-span-2"><Input placeholder="Description" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} /></div>
              </div>
              <Button onClick={addActivity} disabled={!newActivity.description.trim()} size="sm"><Plus className="h-4 w-4 mr-1" /> Log Activity</Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activities.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">No activities logged yet. Add your first interaction above.</p> : activities.map((act) => (
                <Card key={act.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2"><Badge variant="outline">{act.activity_type}</Badge><span className="text-xs text-muted-foreground">{format(new Date(act.activity_date), 'dd MMM yyyy HH:mm')}</span></div>
                        <p className="text-sm mt-2">{act.activity_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {act.created_by}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteActivity(act.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* NOTES TAB */}
          <TabsContent value="notes" className="space-y-4 mt-6">
            <div className="space-y-3">
              <Textarea placeholder="Add a private note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
              <Button onClick={addNote} disabled={!newNote.trim()} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Note</Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {notes.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">No notes yet. Add your first note above.</p> : notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm">{note.note_text}</p>
                        <p className="text-xs text-muted-foreground mt-2">{note.created_by} • {format(new Date(note.created_at), 'dd MMM yyyy HH:mm')}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteNote(note.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Document name" value={newDocument.name} onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })} />
                <Select value={newDocument.type} onValueChange={(v) => setNewDocument({ ...newDocument, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{documentTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Document URL (optional)" value={newDocument.url} onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })} />
              <Button onClick={addDocument} disabled={!newDocument.name.trim()} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Document</Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {documents.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">No documents yet. Add your first document above.</p> : documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Paperclip className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">{doc.document_name}</p>
                          <p className="text-xs text-muted-foreground">{doc.document_type} • {doc.uploaded_by} • {format(new Date(doc.uploaded_at), 'dd MMM yyyy')}</p>
                          {doc.document_url && <a href={doc.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">View Document</a>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteDocument(doc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FOLLOW-UPS TAB */}
          <TabsContent value="followups" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Input type="date" value={newFollowUp.date} onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })} />
                <Input type="time" placeholder="Time" value={newFollowUp.time} onChange={(e) => setNewFollowUp({ ...newFollowUp, time: e.target.value })} />
                <Select value={newFollowUp.type} onValueChange={(v) => setNewFollowUp({ ...newFollowUp, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{followUpTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Description" value={newFollowUp.description} onChange={(e) => setNewFollowUp({ ...newFollowUp, description: e.target.value })} />
              <Button onClick={addFollowUp} disabled={!newFollowUp.date} size="sm"><Plus className="h-4 w-4 mr-1" /> Schedule Follow-up</Button>
            </div>
            
            {followUps.filter(f => f.status !== 'completed').length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">🔔 UPCOMING</h4>
                {followUps.filter(f => f.status !== 'completed').map((fu) => (
                  <Card key={fu.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2"><Badge variant="outline">{fu.follow_up_type}</Badge><span className="text-sm font-medium">{format(new Date(fu.follow_up_date), 'dd MMM yyyy')}</span></div>
                          {fu.description && <p className="text-sm text-muted-foreground mt-1">{fu.description}</p>}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => completeFollowUp(fu.id)}><Check className="h-4 w-4 text-green-600" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteFollowUp(fu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {followUps.filter(f => f.status === 'completed').length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">✅ COMPLETED</h4>
                {followUps.filter(f => f.status === 'completed').map((fu) => (
                  <Card key={fu.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2"><Badge variant="secondary">{fu.follow_up_type}</Badge><span className="text-sm">{format(new Date(fu.follow_up_date), 'dd MMM yyyy')}</span></div>
                          {fu.description && <p className="text-sm text-muted-foreground mt-1">{fu.description}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteFollowUp(fu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {followUps.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No follow-ups scheduled yet. Add your first follow-up above.</p>}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
