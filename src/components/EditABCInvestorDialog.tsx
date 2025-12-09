import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { format } from "date-fns";
import { User, FileText, Calendar, Activity, File, Plus, Trash2, Check, ExternalLink } from "lucide-react";

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
  lastContactDate?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}

interface Note {
  id: string;
  note_text: string;
  created_by: string;
  created_at: string;
}

interface FollowUp {
  id: string;
  follow_up_date: string;
  follow_up_type: string;
  description: string | null;
  status: string;
  created_by: string;
}

interface ActivityItem {
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
  uploaded_by: string;
  uploaded_at: string;
}

interface EditABCInvestorDialogProps {
  investor: Investor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const statusOptions = ['To Contact', 'Contacted', 'Interested', 'Meeting Scheduled', 'In Negotiation', 'Closed', 'Not Interested'];
const categoryOptions = ['Family Office', 'HNWI', 'Institutional', 'Corporate', 'Private Equity', 'Venture Capital', 'Other'];
const followUpTypes = ['Call', 'Email', 'Meeting', 'Document Request', 'Other'];
const activityTypes = ['Call', 'Email', 'Meeting', 'Presentation', 'Document Sent', 'Other'];
const documentTypes = ['NDA', 'Term Sheet', 'Due Diligence', 'Presentation', 'Contract', 'Other'];

export const EditABCInvestorDialog = ({ investor, open, onOpenChange, onSave }: EditABCInvestorDialogProps) => {
  const [formData, setFormData] = useState<Partial<Investor>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [newFollowUp, setNewFollowUp] = useState({ date: '', type: 'Call', description: '' });
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [newActivity, setNewActivity] = useState({ type: 'Call', description: '' });
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState({ name: '', type: 'NDA', url: '' });
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    if (investor && open) {
      setFormData({
        nome: investor.nome, azienda: investor.azienda, ruolo: investor.ruolo || '',
        categoria: investor.categoria, citta: investor.citta || '', fonte: investor.fonte || '',
        status: investor.status, pipelineValue: investor.pipelineValue,
        linkedin: investor.linkedin || '', email: investor.email || '', phone: investor.phone || '',
      });
      setActiveTab('details');
      fetchNotes(); fetchFollowUps(); fetchActivities(); fetchDocuments();
    }
  }, [investor, open]);

  const fetchNotes = async () => {
    if (!investor) return;
    setLoadingNotes(true);
    const { data } = await supabase.from('abc_investor_notes').select('*').eq('investor_name', investor.nome).order('created_at', { ascending: false });
    setNotes(data || []);
    setLoadingNotes(false);
  };

  const fetchFollowUps = async () => {
    if (!investor) return;
    setLoadingFollowUps(true);
    const { data } = await supabase.from('abc_investor_followups').select('*').eq('investor_name', investor.nome).order('follow_up_date', { ascending: true });
    setFollowUps(data || []);
    setLoadingFollowUps(false);
  };

  const fetchActivities = async () => {
    if (!investor) return;
    setLoadingActivities(true);
    const { data } = await supabase.from('abc_investor_activities').select('*').eq('investor_name', investor.nome).order('activity_date', { ascending: false });
    setActivities(data || []);
    setLoadingActivities(false);
  };

  const fetchDocuments = async () => {
    if (!investor) return;
    setLoadingDocuments(true);
    const { data } = await supabase.from('abc_investor_documents').select('*').eq('investor_name', investor.nome).order('uploaded_at', { ascending: false });
    setDocuments(data || []);
    setLoadingDocuments(false);
  };

  const handleSave = async () => {
    if (!investor) return;
    setSaving(true);
    const { error } = await supabase.from('abc_investors' as any).update({
      nome: formData.nome, azienda: formData.azienda, ruolo: formData.ruolo || null,
      categoria: formData.categoria, citta: formData.citta || null, fonte: formData.fonte || null,
      status: formData.status, pipeline_value: formData.pipelineValue,
      linkedin: formData.linkedin || null, email: formData.email || null, phone: formData.phone || null,
    }).eq('id', investor.id);
    setSaving(false);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Investor updated');
    onSave();
    onOpenChange(false);
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
    toast.success('Note deleted');
    fetchNotes();
  };

  const addFollowUp = async () => {
    if (!investor || !newFollowUp.date) return;
    await supabase.from('abc_investor_followups').insert({
      investor_name: investor.nome, follow_up_date: newFollowUp.date, follow_up_type: newFollowUp.type,
      description: newFollowUp.description || null, created_by: 'Team',
    });
    toast.success('Follow-up scheduled');
    setNewFollowUp({ date: '', type: 'Call', description: '' });
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
      investor_name: investor.nome, activity_type: newActivity.type,
      activity_description: newActivity.description.trim(), created_by: 'Team',
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
      investor_name: investor.nome, document_name: newDocument.name.trim(),
      document_type: newDocument.type, document_url: newDocument.url || null, uploaded_by: 'Team',
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

  if (!investor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" />{investor.nome}</DialogTitle>
          <DialogDescription>{investor.azienda}</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="details" className="text-xs"><User className="h-3 w-3 mr-1" />Details</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs"><FileText className="h-3 w-3 mr-1" />Notes</TabsTrigger>
            <TabsTrigger value="followups" className="text-xs"><Calendar className="h-3 w-3 mr-1" />Follow-ups</TabsTrigger>
            <TabsTrigger value="activities" className="text-xs"><Activity className="h-3 w-3 mr-1" />Activities</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs"><File className="h-3 w-3 mr-1" />Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={formData.ruolo || ''} onChange={(e) => setFormData({ ...formData, ruolo: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Company</Label><Input value={formData.azienda || ''} onChange={(e) => setFormData({ ...formData, azienda: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Category</Label><Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categoryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Status</Label><Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input value={formData.citta || ''} onChange={(e) => setFormData({ ...formData, citta: e.target.value })} /></div>
              <div className="space-y-2"><Label>Source</Label><Input value={formData.fonte || ''} onChange={(e) => setFormData({ ...formData, fonte: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Pipeline Value (€)</Label><Input type="number" value={formData.pipelineValue || 0} onChange={(e) => setFormData({ ...formData, pipelineValue: Number(e.target.value) })} /></div>
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Contact Information</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <div className="flex gap-2">
                    <Input placeholder="https://linkedin.com/in/..." value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="flex-1" />
                    {formData.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            {/* Chat-style thread display */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto border rounded-lg p-3 bg-muted/20">
              {loadingNotes ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Start the conversation!</p>
              ) : (
                [...notes].reverse().map((note, index, arr) => {
                  const isReply = note.note_text.startsWith('↩️ Re:');
                  const currentUser = sessionStorage.getItem('abc_user_email') || '';
                  const isOwnMessage = note.created_by === currentUser || 
                    note.created_by.toLowerCase().includes(currentUser.split('@')[0]?.toLowerCase() || '---');
                  
                  // Extract quoted text and reply content for replies
                  let quotedText = '';
                  let replyContent = note.note_text;
                  if (isReply) {
                    const match = note.note_text.match(/↩️ Re: "([^"]+)"\n\n(.+)/s);
                    if (match) {
                      quotedText = match[1];
                      replyContent = match[2];
                    }
                  }
                  
                  return (
                    <div 
                      key={note.id} 
                      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} group`}
                    >
                      {/* Author name */}
                      <span className={`text-[10px] font-medium mb-0.5 px-2 ${
                        isOwnMessage ? 'text-primary' : 'text-orange-600'
                      }`}>
                        {note.created_by}
                      </span>
                      
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 relative ${
                        isOwnMessage 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm'
                      }`}>
                        {/* Quoted text for replies */}
                        {isReply && quotedText && (
                          <div className={`text-xs mb-1.5 pb-1.5 border-b ${
                            isOwnMessage ? 'border-primary-foreground/30 opacity-80' : 'border-border'
                          }`}>
                            <span className="opacity-70">↩️ </span>
                            <span className="italic">"{quotedText.substring(0, 50)}{quotedText.length > 50 ? '...' : ''}"</span>
                          </div>
                        )}
                        
                        {/* Message content */}
                        <p className="text-sm whitespace-pre-wrap">
                          {isReply ? replyContent : note.note_text}
                        </p>
                        
                        {/* Timestamp */}
                        <p className={`text-[10px] mt-1 ${
                          isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {format(new Date(note.created_at), 'dd MMM HH:mm')}
                        </p>
                        
                        {/* Delete button on hover */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`absolute -top-1 ${isOwnMessage ? '-left-8' : '-right-8'} h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity`}
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Reply to last message button */}
            {notes.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => {
                  const lastNote = notes[0];
                  const preview = lastNote.note_text.substring(0, 40);
                  setNewNote(`↩️ Re: "${preview}${lastNote.note_text.length > 40 ? '...' : ''}"\n\n`);
                }}
              >
                ↩️ Reply to last message
              </Button>
            )}
            
            {/* Input area */}
            <div className="flex gap-2 items-end">
              <Textarea 
                placeholder="Write a message..." 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)} 
                rows={2}
                className="flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && newNote.trim()) {
                    e.preventDefault();
                    addNote();
                  }
                }}
              />
              <Button onClick={addNote} disabled={!newNote.trim()} size="icon" className="h-10 w-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="followups" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={newFollowUp.date} onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Type</Label><Select value={newFollowUp.type} onValueChange={(v) => setNewFollowUp({ ...newFollowUp, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{followUpTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <Input placeholder="Description (optional)" value={newFollowUp.description} onChange={(e) => setNewFollowUp({ ...newFollowUp, description: e.target.value })} />
              <Button onClick={addFollowUp} disabled={!newFollowUp.date} size="sm"><Plus className="h-4 w-4 mr-1" /> Schedule Follow-up</Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {loadingFollowUps ? <p className="text-sm text-muted-foreground">Loading...</p> : followUps.length === 0 ? <p className="text-sm text-muted-foreground">No follow-ups</p> : followUps.map((fu) => (
                <Card key={fu.id}><CardContent className="p-3"><div className="flex justify-between items-start gap-2"><div className="flex-1"><div className="flex items-center gap-2"><Badge variant={fu.status === 'completed' ? 'default' : 'outline'}>{fu.follow_up_type}</Badge><span className="text-sm font-medium">{format(new Date(fu.follow_up_date), 'dd MMM yyyy')}</span>{fu.status === 'completed' && <Badge variant="secondary" className="text-xs">Completed</Badge>}</div>{fu.description && <p className="text-sm text-muted-foreground mt-1">{fu.description}</p>}</div><div className="flex gap-1">{fu.status !== 'completed' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => completeFollowUp(fu.id)}><Check className="h-4 w-4 text-green-600" /></Button>}<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteFollowUp(fu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></div></CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>Type</Label><Select value={newActivity.type} onValueChange={(v) => setNewActivity({ ...newActivity, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{activityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div className="col-span-2 space-y-2"><Label>Description</Label><Input placeholder="What happened?" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} /></div>
              </div>
              <Button onClick={addActivity} disabled={!newActivity.description.trim()} size="sm"><Plus className="h-4 w-4 mr-1" /> Log Activity</Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {loadingActivities ? <p className="text-sm text-muted-foreground">Loading...</p> : activities.length === 0 ? <p className="text-sm text-muted-foreground">No activities</p> : activities.map((act) => (
                <Card key={act.id}><CardContent className="p-3"><div className="flex justify-between items-start gap-2"><div className="flex-1"><div className="flex items-center gap-2"><Badge variant="outline">{act.activity_type}</Badge><span className="text-xs text-muted-foreground">{format(new Date(act.activity_date), 'dd MMM yyyy HH:mm')}</span></div><p className="text-sm mt-1">{act.activity_description}</p></div><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteActivity(act.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Document Name</Label><Input placeholder="e.g., NDA Agreement" value={newDocument.name} onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Type</Label><Select value={newDocument.type} onValueChange={(v) => setNewDocument({ ...newDocument, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{documentTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <Input placeholder="Document URL (optional)" value={newDocument.url} onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })} />
              <Button onClick={addDocument} disabled={!newDocument.name.trim()} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Document</Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {loadingDocuments ? <p className="text-sm text-muted-foreground">Loading...</p> : documents.length === 0 ? <p className="text-sm text-muted-foreground">No documents</p> : documents.map((doc) => (
                <Card key={doc.id}><CardContent className="p-3"><div className="flex justify-between items-start gap-2"><div className="flex-1"><div className="flex items-center gap-2"><Badge variant="outline">{doc.document_type}</Badge><span className="text-sm font-medium">{doc.document_name}</span></div>{doc.document_url && <a href={doc.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">View Document</a>}<p className="text-xs text-muted-foreground mt-1">{doc.uploaded_by} • {format(new Date(doc.uploaded_at), 'dd MMM yyyy')}</p></div><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteDocument(doc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardContent></Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
