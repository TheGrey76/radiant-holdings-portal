import { useState, useEffect, useMemo } from "react";
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
import { useABCEngagementTracking } from "@/hooks/useABCEngagementTracking";
import { 
  Play, Pause, Plus, Trash2, Edit2, Clock, Mail, Users, 
  CheckCircle, AlertCircle, RefreshCw, Zap, ArrowRight,
  MousePointerClick, MailOpen, UserX, Target, Flame
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

// Updated trigger types based on engagement intelligence
type SequenceTrigger = 'non_openers' | 'openers_no_click' | 'clickers' | 'never_contacted';

interface Sequence {
  id: string;
  name: string;
  description: string;
  trigger: SequenceTrigger;
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
  condition?: 'if_no_open' | 'if_no_click' | 'always';
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

  // Build email to investor ID mapping for engagement tracking
  const investorEmailMap = useMemo(() => {
    const map = new Map<string, string>();
    investors.forEach(inv => {
      if (inv.email) {
        map.set(inv.id, inv.email);
      }
    });
    return map;
  }, [investors]);

  // Use engagement tracking hook
  const { engagementData, loading: engagementLoading, refetch: refetchEngagement, getEngagementLabel } = useABCEngagementTracking(investorEmailMap);

  // Calculate segment counts
  const segmentCounts = useMemo(() => ({
    never_contacted: engagementData.neverContacted.size,
    non_openers: engagementData.nonOpeners.size,
    openers: engagementData.openers.size,
    clickers: engagementData.clickers.size,
  }), [engagementData]);

  // Form state for creating/editing sequences
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    trigger: SequenceTrigger;
    triggerDays: number;
    steps: SequenceStep[];
    isActive: boolean;
  }>({
    name: '',
    description: '',
    trigger: 'non_openers',
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
        trigger: seq.trigger_type as SequenceTrigger,
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

  // Process sequences based on ENGAGEMENT data (not just time-based)
  const handleProcessSequences = async () => {
    await refetchEngagement(); // Refresh engagement data first
    
    let enrolledCount = 0;

    for (const sequence of sequences.filter(s => s.isActive)) {
      // Get investors based on engagement segment
      let eligibleInvestorIds: string[] = [];
      
      switch (sequence.trigger) {
        case 'never_contacted':
          eligibleInvestorIds = Array.from(engagementData.neverContacted);
          break;
        case 'non_openers':
          eligibleInvestorIds = Array.from(engagementData.nonOpeners);
          break;
        case 'openers_no_click':
          // Openers who haven't clicked
          eligibleInvestorIds = Array.from(engagementData.openers)
            .filter(id => !engagementData.clickers.has(id));
          break;
        case 'clickers':
          eligibleInvestorIds = Array.from(engagementData.clickers);
          break;
      }

      // Filter by trigger days (days since last contact)
      const eligibleInvestors = investors.filter(inv => {
        if (!inv.email) return false;
        if (!eligibleInvestorIds.includes(inv.id)) return false;
        
        // Check if already enrolled in this sequence
        const alreadyEnrolled = enrolledInvestors.some(
          e => e.investorId === inv.id && e.sequenceId === sequence.id
        );
        if (alreadyEnrolled) return false;

        // Check time since last contact
        if (inv.last_contact_date) {
          const daysSinceContact = differenceInDays(new Date(), new Date(inv.last_contact_date));
          return daysSinceContact >= sequence.triggerDays;
        }
        
        return true; // Never contacted, eligible immediately if in segment
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
      loadSequences();
    } else {
      toast({ title: "Nessun nuovo investitore idoneo" });
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

      // Check step condition against current engagement
      const engagementLabel = getEngagementLabel(enrollment.investorId);
      
      // Skip if condition not met
      if (step.condition === 'if_no_open' && (engagementLabel === 'engaged' || engagementLabel === 'clicked')) {
        // They opened/clicked, mark as exited (success)
        await supabase
          .from('abc_sequence_enrollments')
          .update({ status: 'exited' })
          .eq('id', enrollment.id);
        continue;
      }
      
      if (step.condition === 'if_no_click' && engagementLabel === 'clicked') {
        // They clicked, mark as exited (success)
        await supabase
          .from('abc_sequence_enrollments')
          .update({ status: 'exited' })
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
      trigger: 'non_openers',
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

  const getTriggerLabel = (trigger: SequenceTrigger) => {
    switch (trigger) {
      case 'non_openers': return 'Non hanno aperto';
      case 'openers_no_click': return 'Hanno aperto (no click)';
      case 'clickers': return 'Hanno cliccato';
      case 'never_contacted': return 'Mai contattati';
      default: return trigger;
    }
  };

  const getTriggerIcon = (trigger: SequenceTrigger) => {
    switch (trigger) {
      case 'non_openers': return <UserX className="h-4 w-4" />;
      case 'openers_no_click': return <MailOpen className="h-4 w-4" />;
      case 'clickers': return <MousePointerClick className="h-4 w-4" />;
      case 'never_contacted': return <Target className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTriggerColor = (trigger: SequenceTrigger) => {
    switch (trigger) {
      case 'non_openers': return 'text-orange-500';
      case 'openers_no_click': return 'text-blue-500';
      case 'clickers': return 'text-green-500';
      case 'never_contacted': return 'text-gray-500';
      default: return 'text-muted-foreground';
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
      {/* Engagement Intelligence Overview */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Campaign Intelligence
          </CardTitle>
          <CardDescription>Segmenti basati su engagement reale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/80 rounded-lg">
              <div className="flex justify-center mb-1">
                <Target className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-2xl font-bold">{segmentCounts.never_contacted}</div>
              <div className="text-xs text-muted-foreground">Mai Contattati</div>
            </div>
            <div className="text-center p-3 bg-background/80 rounded-lg">
              <div className="flex justify-center mb-1">
                <UserX className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{segmentCounts.non_openers}</div>
              <div className="text-xs text-muted-foreground">Non Aperture</div>
            </div>
            <div className="text-center p-3 bg-background/80 rounded-lg">
              <div className="flex justify-center mb-1">
                <MailOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{segmentCounts.openers}</div>
              <div className="text-xs text-muted-foreground">Hanno Aperto</div>
            </div>
            <div className="text-center p-3 bg-background/80 rounded-lg">
              <div className="flex justify-center mb-1">
                <MousePointerClick className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{segmentCounts.clickers}</div>
              <div className="text-xs text-muted-foreground">Hanno Cliccato</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sequenze Follow-up Automatiche</h3>
          <p className="text-sm text-muted-foreground">
            Crea sequenze basate su engagement (aperture, click, inattività)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleProcessSequences} disabled={engagementLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${engagementLoading ? 'animate-spin' : ''}`} />
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
              <p className="text-sm">Crea sequenze per follow-up automatici basati su engagement</p>
            </CardContent>
          </Card>
        ) : (
          sequences.map(sequence => (
            <Card key={sequence.id} className={`${sequence.isActive ? 'border-green-500/30' : 'border-muted'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={getTriggerColor(sequence.trigger)}>
                      {getTriggerIcon(sequence.trigger)}
                    </span>
                    <div>
                      <CardTitle className="text-base">{sequence.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {sequence.description || getTriggerLabel(sequence.trigger)}
                      </CardDescription>
                    </div>
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
                    <span>{sequence.triggerDays}g delay</span>
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
            <CardDescription>Investitori in coda per ricevere email automatiche</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investitore</TableHead>
                  <TableHead>Sequenza</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Prossima Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledInvestors.slice(0, 10).map(enrollment => {
                  const sequence = sequences.find(s => s.id === enrollment.sequenceId);
                  const engLabel = getEngagementLabel(enrollment.investorId);
                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.investorName}</TableCell>
                      <TableCell>{sequence?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            engLabel === 'clicked' ? 'border-green-500 text-green-600' :
                            engLabel === 'engaged' ? 'border-blue-500 text-blue-600' :
                            engLabel === 'non_opener' ? 'border-orange-500 text-orange-600' :
                            'border-gray-400 text-gray-500'
                          }`}
                        >
                          {engLabel === 'clicked' && <MousePointerClick className="h-3 w-3 mr-1" />}
                          {engLabel === 'engaged' && <MailOpen className="h-3 w-3 mr-1" />}
                          {engLabel === 'non_opener' && <UserX className="h-3 w-3 mr-1" />}
                          {engLabel === 'clicked' ? 'Cliccato' :
                           engLabel === 'engaged' ? 'Aperto' :
                           engLabel === 'non_opener' ? 'Non aperto' :
                           'Mai contattato'}
                        </Badge>
                      </TableCell>
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
                  placeholder="Es. Re-engagement Non Aperture"
                />
              </div>
              <div>
                <Label>Segmento Target</Label>
                <Select 
                  value={formData.trigger} 
                  onValueChange={(v: SequenceTrigger) => setFormData(prev => ({ ...prev, trigger: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never_contacted">
                      <span className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        Mai Contattati ({segmentCounts.never_contacted})
                      </span>
                    </SelectItem>
                    <SelectItem value="non_openers">
                      <span className="flex items-center gap-2">
                        <UserX className="h-4 w-4 text-orange-500" />
                        Non Hanno Aperto ({segmentCounts.non_openers})
                      </span>
                    </SelectItem>
                    <SelectItem value="openers_no_click">
                      <span className="flex items-center gap-2">
                        <MailOpen className="h-4 w-4 text-blue-500" />
                        Hanno Aperto (no click)
                      </span>
                    </SelectItem>
                    <SelectItem value="clickers">
                      <span className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4 text-green-500" />
                        Hanno Cliccato ({segmentCounts.clickers})
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giorni di inattività prima di attivare</Label>
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
                        <Label className="text-xs">Condizione di Invio</Label>
                        <Select 
                          value={step.condition || 'always'}
                          onValueChange={v => updateStep(step.id, 'condition', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Sempre</SelectItem>
                            <SelectItem value="if_no_open">Solo se non ha ancora aperto</SelectItem>
                            <SelectItem value="if_no_click">Solo se non ha ancora cliccato</SelectItem>
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
