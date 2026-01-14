import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, Pause, Plus, Trash2, Edit2, Clock, Mail, Users, 
  CheckCircle, AlertCircle, RefreshCw, Zap, ArrowRight
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

interface Sequence {
  id: string;
  name: string;
  description: string;
  trigger: 'no_open' | 'no_response' | 'new_investor' | 'status_change';
  triggerDays: number;
  steps: SequenceStep[];
  isActive: boolean;
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
}

interface SequenceStep {
  id: string;
  dayDelay: number;
  subject: string;
  content: string;
  condition?: 'if_no_open' | 'if_no_response' | 'always';
}

interface EnrolledInvestor {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  sequenceId: string;
  currentStep: number;
  status: 'active' | 'completed' | 'paused' | 'exited';
  nextEmailDate: string;
  enrolledAt: string;
}

interface ABCFollowUpSequencesProps {
  investors: Array<{
    id: string;
    nome: string;
    azienda: string;
    email: string | null;
    status: string;
    last_contact_date?: string | null;
  }>;
  onSendCampaign?: (investorIds: string[], subject: string, content: string) => void;
}

export function ABCFollowUpSequences({ investors, onSendCampaign }: ABCFollowUpSequencesProps) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrolledInvestors, setEnrolledInvestors] = useState<EnrolledInvestor[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state for creating/editing sequences
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    trigger: Sequence['trigger'];
    triggerDays: number;
    steps: SequenceStep[];
    isActive: boolean;
  }>({
    name: '',
    description: '',
    trigger: 'no_open',
    triggerDays: 3,
    steps: [
      { id: '1', dayDelay: 0, subject: 'Follow-up: ABC Company', content: 'Gentile {nome},\n\nMi permetto di ricontattarLa...', condition: 'always' }
    ],
    isActive: true,
  });

  useEffect(() => {
    loadSequences();
    loadEnrolledInvestors();
  }, []);

  const loadSequences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('abc_followup_sequences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSequences: Sequence[] = (data || []).map((seq: any) => ({
        id: seq.id,
        name: seq.name,
        description: seq.description || '',
        trigger: seq.trigger_type,
        triggerDays: seq.trigger_days,
        steps: seq.steps || [],
        isActive: seq.is_active,
        enrolledCount: seq.enrolled_count || 0,
        completedCount: seq.completed_count || 0,
        createdAt: seq.created_at,
      }));

      setSequences(transformedSequences);
    } catch (error) {
      console.error('Error loading sequences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrolledInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('abc_sequence_enrollments')
        .select('*')
        .eq('status', 'active')
        .order('next_email_date', { ascending: true });

      if (error) throw error;

      setEnrolledInvestors((data || []).map((e: any) => ({
        id: e.id,
        investorId: e.investor_id,
        investorName: e.investor_name,
        investorEmail: e.investor_email,
        sequenceId: e.sequence_id,
        currentStep: e.current_step,
        status: e.status,
        nextEmailDate: e.next_email_date,
        enrolledAt: e.enrolled_at,
      })));
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const handleSaveSequence = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Inserisci un nome", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const sequenceData = {
        name: formData.name,
        description: formData.description,
        trigger_type: formData.trigger,
        trigger_days: formData.triggerDays,
        steps: JSON.parse(JSON.stringify(formData.steps)),
        is_active: formData.isActive,
      };

      if (editingSequence) {
        const { error } = await supabase
          .from('abc_followup_sequences')
          .update(sequenceData)
          .eq('id', editingSequence.id);
        if (error) throw error;
        toast({ title: "Sequenza aggiornata" });
      } else {
        const { error } = await supabase
          .from('abc_followup_sequences')
          .insert([sequenceData]);
        if (error) throw error;
        toast({ title: "Sequenza creata" });
      }

      setShowCreateDialog(false);
      setEditingSequence(null);
      resetForm();
      loadSequences();
    } catch (error: any) {
      console.error('Error saving sequence:', error);
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSequence = async (sequenceId: string) => {
    try {
      // First remove enrollments
      await supabase.from('abc_sequence_enrollments').delete().eq('sequence_id', sequenceId);
      
      const { error } = await supabase
        .from('abc_followup_sequences')
        .delete()
        .eq('id', sequenceId);
      
      if (error) throw error;
      
      toast({ title: "Sequenza eliminata" });
      loadSequences();
      loadEnrolledInvestors();
    } catch (error: any) {
      console.error('Error deleting sequence:', error);
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleSequence = async (sequenceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('abc_followup_sequences')
        .update({ is_active: !isActive })
        .eq('id', sequenceId);
      
      if (error) throw error;
      
      toast({ title: isActive ? "Sequenza messa in pausa" : "Sequenza attivata" });
      loadSequences();
    } catch (error) {
      console.error('Error toggling sequence:', error);
    }
  };

  const handleProcessSequences = async () => {
    // Check for investors that should be enrolled in sequences
    const noOpenSequences = sequences.filter(s => s.trigger === 'no_open' && s.isActive);
    const noResponseSequences = sequences.filter(s => s.trigger === 'no_response' && s.isActive);
    
    let enrolledCount = 0;

    for (const sequence of [...noOpenSequences, ...noResponseSequences]) {
      // Find investors that match the trigger criteria
      const eligibleInvestors = investors.filter(inv => {
        if (!inv.email) return false;
        
        // Check if already enrolled in this sequence
        const alreadyEnrolled = enrolledInvestors.some(
          e => e.investorId === inv.id && e.sequenceId === sequence.id
        );
        if (alreadyEnrolled) return false;

        // Check trigger condition
        if (sequence.trigger === 'no_open' || sequence.trigger === 'no_response') {
          if (!inv.last_contact_date) return true;
          const daysSinceContact = differenceInDays(new Date(), new Date(inv.last_contact_date));
          return daysSinceContact >= sequence.triggerDays;
        }
        
        return false;
      });

      // Enroll eligible investors
      for (const inv of eligibleInvestors) {
        try {
          const { error } = await supabase
            .from('abc_sequence_enrollments')
            .insert({
              investor_id: inv.id,
              investor_name: `${inv.nome} - ${inv.azienda}`,
              investor_email: inv.email,
              sequence_id: sequence.id,
              current_step: 0,
              status: 'active',
              next_email_date: new Date().toISOString(),
            });
          
          if (!error) enrolledCount++;
        } catch (e) {
          console.error('Error enrolling investor:', e);
        }
      }
    }

    if (enrolledCount > 0) {
      toast({ title: `${enrolledCount} investitori aggiunti alle sequenze` });
      loadEnrolledInvestors();
      
      // Update sequence counts
      for (const seq of sequences) {
        await supabase
          .from('abc_followup_sequences')
          .update({ enrolled_count: enrolledInvestors.filter(e => e.sequenceId === seq.id).length + enrolledCount })
          .eq('id', seq.id);
      }
      loadSequences();
    } else {
      toast({ title: "Nessun nuovo investitore da aggiungere" });
    }
  };

  const handleSendPendingEmails = async () => {
    const today = new Date();
    const pendingEnrollments = enrolledInvestors.filter(e => 
      e.status === 'active' && new Date(e.nextEmailDate) <= today
    );

    if (pendingEnrollments.length === 0) {
      toast({ title: "Nessuna email da inviare oggi" });
      return;
    }

    let sentCount = 0;
    for (const enrollment of pendingEnrollments) {
      const sequence = sequences.find(s => s.id === enrollment.sequenceId);
      if (!sequence) continue;

      const step = sequence.steps[enrollment.currentStep];
      if (!step) {
        // Mark as completed
        await supabase
          .from('abc_sequence_enrollments')
          .update({ status: 'completed' })
          .eq('id', enrollment.id);
        continue;
      }

      // Send email via campaign manager callback
      if (onSendCampaign) {
        onSendCampaign([enrollment.investorId], step.subject, step.content);
        sentCount++;

        // Update enrollment to next step
        const nextStep = enrollment.currentStep + 1;
        const nextStepData = sequence.steps[nextStep];
        
        if (nextStepData) {
          await supabase
            .from('abc_sequence_enrollments')
            .update({
              current_step: nextStep,
              next_email_date: addDays(new Date(), nextStepData.dayDelay).toISOString(),
            })
            .eq('id', enrollment.id);
        } else {
          await supabase
            .from('abc_sequence_enrollments')
            .update({ status: 'completed' })
            .eq('id', enrollment.id);
        }
      }
    }

    if (sentCount > 0) {
      toast({ title: `${sentCount} email inviate` });
      loadEnrolledInvestors();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger: 'no_open',
      triggerDays: 3,
      steps: [
        { id: '1', dayDelay: 0, subject: 'Follow-up: ABC Company', content: 'Gentile {nome},\n\nMi permetto di ricontattarLa...', condition: 'always' }
      ],
      isActive: true,
    });
  };

  const addStep = () => {
    const newStep: SequenceStep = {
      id: String(Date.now()),
      dayDelay: formData.steps.length > 0 ? formData.steps[formData.steps.length - 1].dayDelay + 3 : 0,
      subject: 'Follow-up',
      content: 'Gentile {nome},\n\n',
      condition: 'always',
    };
    setFormData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (stepId: string) => {
    setFormData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== stepId) }));
  };

  const updateStep = (stepId: string, field: keyof SequenceStep, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s),
    }));
  };

  const getTriggerLabel = (trigger: Sequence['trigger']) => {
    switch (trigger) {
      case 'no_open': return 'Nessuna apertura';
      case 'no_response': return 'Nessuna risposta';
      case 'new_investor': return 'Nuovo investitore';
      case 'status_change': return 'Cambio status';
      default: return trigger;
    }
  };

  const openEditDialog = (sequence: Sequence) => {
    setEditingSequence(sequence);
    setFormData({
      name: sequence.name,
      description: sequence.description,
      trigger: sequence.trigger,
      triggerDays: sequence.triggerDays,
      steps: sequence.steps,
      isActive: sequence.isActive,
    });
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sequenze Follow-up Automatiche</h3>
          <p className="text-sm text-muted-foreground">
            Crea sequenze di email automatiche basate su trigger specifici
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleProcessSequences}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Elabora Sequenze
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendPendingEmails}>
            <Zap className="h-4 w-4 mr-2" />
            Invia Email Pendenti
          </Button>
          <Button size="sm" onClick={() => { resetForm(); setEditingSequence(null); setShowCreateDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Sequenza
          </Button>
        </div>
      </div>

      {/* Active Sequences */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Caricamento...
            </CardContent>
          </Card>
        ) : sequences.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nessuna sequenza configurata</p>
              <p className="text-sm">Crea la tua prima sequenza di follow-up automatica</p>
            </CardContent>
          </Card>
        ) : (
          sequences.map(sequence => (
            <Card key={sequence.id} className={`${sequence.isActive ? 'border-green-500/30' : 'border-muted'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{sequence.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {sequence.description || getTriggerLabel(sequence.trigger)}
                    </CardDescription>
                  </div>
                  <Badge variant={sequence.isActive ? "default" : "secondary"} className="text-xs">
                    {sequence.isActive ? "Attiva" : "Pausa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{sequence.triggerDays}g trigger</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{sequence.steps.length} email</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>{sequence.enrolledCount} iscritti</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>{sequence.completedCount} completati</span>
                  </div>
                </div>

                {/* Steps preview */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {sequence.steps.slice(0, 4).map((step, idx) => (
                    <div key={step.id} className="flex items-center">
                      <span className="bg-primary/10 px-1.5 py-0.5 rounded">
                        +{step.dayDelay}g
                      </span>
                      {idx < Math.min(sequence.steps.length - 1, 3) && (
                        <ArrowRight className="h-3 w-3 mx-0.5" />
                      )}
                    </div>
                  ))}
                  {sequence.steps.length > 4 && <span>...</span>}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleToggleSequence(sequence.id, sequence.isActive)}
                  >
                    {sequence.isActive ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
                    {sequence.isActive ? "Pausa" : "Attiva"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(sequence)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDeleteSequence(sequence.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enrolled Investors Queue */}
      {enrolledInvestors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coda Email Programmati</CardTitle>
            <CardDescription>Investitori in attesa di ricevere email automatiche</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investitore</TableHead>
                  <TableHead>Sequenza</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Prossima Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledInvestors.slice(0, 10).map(enrollment => {
                  const sequence = sequences.find(s => s.id === enrollment.sequenceId);
                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.investorName}</TableCell>
                      <TableCell>{sequence?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {enrollment.currentStep + 1}/{sequence?.steps.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(enrollment.nextEmailDate), 'dd MMM yyyy', { locale: it })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Sequence Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSequence ? 'Modifica Sequenza' : 'Nuova Sequenza Follow-up'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome Sequenza</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Es. Follow-up non aperture"
                />
              </div>
              <div>
                <Label>Trigger</Label>
                <Select 
                  value={formData.trigger} 
                  onValueChange={(v: Sequence['trigger']) => setFormData(prev => ({ ...prev, trigger: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_open">Nessuna apertura email</SelectItem>
                    <SelectItem value="no_response">Nessuna risposta</SelectItem>
                    <SelectItem value="new_investor">Nuovo investitore aggiunto</SelectItem>
                    <SelectItem value="status_change">Cambio status pipeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giorni prima del trigger</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.triggerDays}
                  onChange={e => setFormData(prev => ({ ...prev, triggerDays: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Attiva immediatamente</Label>
              </div>
            </div>

            <div>
              <Label>Descrizione (opzionale)</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrizione della sequenza..."
                rows={2}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Step Email ({formData.steps.length})</Label>
                <Button variant="outline" size="sm" onClick={addStep}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Aggiungi Step
                </Button>
              </div>

              {formData.steps.map((step, index) => (
                <Card key={step.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Step {index + 1}</Badge>
                      {formData.steps.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Ritardo (giorni)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={step.dayDelay}
                          onChange={e => updateStep(step.id, 'dayDelay', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Condizione</Label>
                        <Select 
                          value={step.condition || 'always'}
                          onValueChange={v => updateStep(step.id, 'condition', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Sempre</SelectItem>
                            <SelectItem value="if_no_open">Se non ha aperto</SelectItem>
                            <SelectItem value="if_no_response">Se non ha risposto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Oggetto</Label>
                      <Input
                        value={step.subject}
                        onChange={e => updateStep(step.id, 'subject', e.target.value)}
                        placeholder="Oggetto email..."
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Contenuto (usa {'{nome}'}, {'{azienda}'} per personalizzare)</Label>
                      <Textarea
                        value={step.content}
                        onChange={e => updateStep(step.id, 'content', e.target.value)}
                        rows={4}
                        placeholder="Gentile {nome},..."
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annulla</Button>
            </DialogClose>
            <Button onClick={handleSaveSequence} disabled={isSaving}>
              {isSaving ? "Salvataggio..." : editingSequence ? "Salva Modifiche" : "Crea Sequenza"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
