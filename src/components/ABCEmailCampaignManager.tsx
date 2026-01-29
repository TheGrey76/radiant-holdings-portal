import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useABCEngagementTracking } from "@/hooks/useABCEngagementTracking";
import { 
  Mail, Send, Users, Filter, CheckCircle, Clock, AlertCircle, 
  Save, FileText, History, Trash2, Plus, Eye, AlertTriangle, Edit2,
  Paperclip, X, MailOpen, RefreshCw, Sparkles, MessageSquare, Reply,
  ChevronLeft, ChevronRight, Bell, Shield, MousePointerClick, Target,
  UserCheck, UserX
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ABCEmailDeliverability, analyzeSpamScore } from "./ABCEmailDeliverability";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email: string | null;
  categoria: string;
  status: string;
  ruolo?: string | null;
  citta?: string | null;
  approval_status?: string;
  pipeline_value?: number;
  last_contact_date?: string | null;
  engagement_score?: number;
  linkedin?: string | null;
  fonte?: string | null;
  created_at?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_by: string;
  created_at: string;
}

interface CampaignHistory {
  id: string;
  campaign_name: string;
  subject: string;
  content: string;
  recipient_count: number;
  successful_sends: number;
  failed_sends: number;
  filter_status: string | null;
  filter_category: string | null;
  sent_by: string;
  sent_at: string;
  recipients: any;
  opens_count?: number;
  responses_count?: number;
}

interface ReminderData {
  id: string;
  investorId: string;
  investorName: string;
  company: string;
  type: 'no_contact' | 'hot_inactive' | 'follow_up_missed';
  priority: 'high' | 'medium' | 'low';
  message: string;
  daysSince: number;
  email: string | null;
}

interface ABCEmailCampaignManagerProps {
  investors: Investor[];
  onInvestorsUpdated?: () => void;
  pendingReminders?: ReminderData[];
  onRemindersClear?: () => void;
}

interface Attachment {
  name: string;
  content: string; // base64
  type: string;
}

type EmailType = 'first_contact' | 'follow_up' | 'meeting_request' | 'proposal' | 'reminder' | 'custom';

export function ABCEmailCampaignManager({ investors, onInvestorsUpdated, pendingReminders, onRemindersClear }: ABCEmailCampaignManagerProps) {
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterApprovalDate, setFilterApprovalDate] = useState<string>("all");
  const [filterNeverContacted, setFilterNeverContacted] = useState<boolean>(false);
  const [filterEngagement, setFilterEngagement] = useState<string>("all"); // New: engagement filter
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaignHistory, setCampaignHistory] = useState<CampaignHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewInvestorIndex, setPreviewInvestorIndex] = useState(0);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editingEmailValue, setEditingEmailValue] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiEmailType, setAiEmailType] = useState<EmailType>('first_contact');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedCampaignForResponse, setSelectedCampaignForResponse] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [responseInvestorEmail, setResponseInvestorEmail] = useState("");
  const [responseType, setResponseType] = useState<string>("declined");
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [trackingCampaignId, setTrackingCampaignId] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<{
    opens: Array<{ recipient_email: string; recipient_name: string; opened_at: string }>;
    notOpened: Array<{ email: string; name: string }>;
  }>({ opens: [], notOpened: [] });
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [selectedTrackingOpens, setSelectedTrackingOpens] = useState<string[]>([]);
  const [selectedTrackingNotOpened, setSelectedTrackingNotOpened] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("compose");
  const [isSendingSummary, setIsSendingSummary] = useState(false);
  
  // Test email uses company domain for security
  const TEST_EMAIL = "quinley.martini@aries76.com";
  const { toast } = useToast();

  const [emailForm, setEmailForm] = useState({
    subject: "",
    preheader: "", // Preview text shown in inbox
    content: "",
    campaignName: "",
    ctaLink: "https://abccompany.it/",
    ctaText: "Scopri di più",
  });

  // Handle file attachment
  const handleFileAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        toast({
          title: "File troppo grande",
          description: `${file.name} supera il limite di 10MB`,
          variant: "destructive",
        });
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAttachments(prev => [...prev, {
          name: file.name,
          content: base64,
          type: file.type,
        }]);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const currentUserEmail = sessionStorage.getItem('abc_authorized_email') || 'admin@aries76.com';

  // Filter only approved investors
  const approvedInvestors = investors.filter(inv => inv.approval_status === 'approved');
  
  // Approved investors with email
  const approvedWithEmail = approvedInvestors.filter(inv => inv.email);
  
  // Approved investors missing email
  const approvedMissingEmail = approvedInvestors.filter(inv => !inv.email);

  // Build email to investor ID mapping for engagement tracking
  const investorEmailMap = useMemo(() => {
    const map = new Map<string, string>();
    approvedWithEmail.forEach(inv => {
      if (inv.email) {
        map.set(inv.id, inv.email);
      }
    });
    return map;
  }, [approvedWithEmail]);

  // Use engagement tracking hook
  const { engagementData, loading: engagementLoading, refetch: refetchEngagement, getEngagementLabel, getInvestorStats } = useABCEngagementTracking(investorEmailMap);

  // Fetch templates and history on mount
  useEffect(() => {
    fetchTemplates();
    fetchCampaignHistory();
  }, []);

  // Handle pending reminders from auto-reminders
  useEffect(() => {
    if (pendingReminders && pendingReminders.length > 0) {
      // Pre-select investors from reminders
      const reminderInvestorIds = pendingReminders
        .map(r => {
          const inv = investors.find(i => i.id === r.investorId);
          return inv?.id;
        })
        .filter(Boolean) as string[];
      
      setSelectedInvestors(reminderInvestorIds);
      
      // Generate reminder email content
      const investorNames = pendingReminders.map(r => r.investorName).join(', ');
      const highPriorityCount = pendingReminders.filter(r => r.priority === 'high').length;
      
      setEmailForm({
        subject: 'Aggiornamento: ABC Company - Opportunità di Investimento',
        preheader: 'Aggiornamento sulla raccolta fondi e prossimi passi',
        content: `Gentile {nome},

Ci permettiamo di ricontattarLa riguardo all'opportunità di investimento in ABC Company.

Desideriamo aggiornarLa sugli sviluppi recenti della nostra raccolta fondi e confermare il nostro interesse a proseguire il dialogo.

${highPriorityCount > 0 ? 'I nostri primi closing si avvicinano e saremmo lieti di organizzare un incontro per approfondire.' : 'Restiamo a disposizione per qualsiasi domanda o per organizzare un incontro conoscitivo.'}

Cordiali saluti,
Il Team ABC Company`,
        campaignName: `Reminder - ${pendingReminders.length} investitori`,
        ctaLink: '',
        ctaText: '',
      });
      
      setAiEmailType('reminder');
    }
  }, [pendingReminders, investors]);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('abc_email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
    }
  };

  const fetchCampaignHistory = async () => {
    const { data, error } = await supabase
      .from('abc_email_campaign_history')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      // Fetch open and response counts for each campaign
      const campaignsWithMetrics = await Promise.all(
        data.map(async (campaign) => {
          const { count: opensCount } = await supabase
            .from('abc_email_opens')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id);
          
          const { count: responsesCount } = await supabase
            .from('abc_email_responses')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id);
          
          return { 
            ...campaign, 
            opens_count: opensCount || 0,
            responses_count: responsesCount || 0 
          };
        })
      );
      setCampaignHistory(campaignsWithMetrics);
    }
  };

  // Delete campaign and related data
  const handleDeleteCampaign = async () => {
    if (!deletingCampaignId) return;
    
    setIsDeleting(true);
    try {
      // Delete related opens first
      await supabase
        .from('abc_email_opens')
        .delete()
        .eq('campaign_id', deletingCampaignId);
      
      // Delete related responses
      await supabase
        .from('abc_email_responses')
        .delete()
        .eq('campaign_id', deletingCampaignId);
      
      // Delete the campaign
      const { error } = await supabase
        .from('abc_email_campaign_history')
        .delete()
        .eq('id', deletingCampaignId);
      
      if (error) throw error;
      
      toast({
        title: "Campagna eliminata",
        description: "La campagna e tutti i dati associati sono stati eliminati",
      });
      
      setDeletingCampaignId(null);
      fetchCampaignHistory();
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione della campagna",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch tracking data for a specific campaign
  const fetchTrackingData = async (campaignId: string) => {
    setIsLoadingTracking(true);
    setTrackingCampaignId(campaignId);
    
    try {
      // Get campaign to find recipients
      const campaign = campaignHistory.find(c => c.id === campaignId);
      if (!campaign) return;
      
      // Get all opens for this campaign
      const { data: opensData } = await supabase
        .from('abc_email_opens')
        .select('recipient_email, recipient_name, opened_at')
        .eq('campaign_id', campaignId)
        .order('opened_at', { ascending: false });
      
      const opens = opensData || [];
      const openedEmails = new Set(opens.map(o => o.recipient_email.toLowerCase()));
      
      // Get recipients who didn't open
      const recipients = campaign.recipients as Array<{ email: string; name: string }> || [];
      const notOpened = recipients.filter(r => !openedEmails.has(r.email.toLowerCase()));
      
      setTrackingData({ opens, notOpened });
      // Reset selections when campaign changes
      setSelectedTrackingOpens([]);
      setSelectedTrackingNotOpened([]);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setIsLoadingTracking(false);
    }
  };

  // Handle tracking selection toggle
  const handleTrackingOpenSelect = (email: string) => {
    setSelectedTrackingOpens(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleTrackingNotOpenedSelect = (email: string) => {
    setSelectedTrackingNotOpened(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSelectAllOpens = () => {
    if (selectedTrackingOpens.length === trackingData.opens.length) {
      setSelectedTrackingOpens([]);
    } else {
      setSelectedTrackingOpens(trackingData.opens.map(o => o.recipient_email));
    }
  };

  const handleSelectAllNotOpened = () => {
    if (selectedTrackingNotOpened.length === trackingData.notOpened.length) {
      setSelectedTrackingNotOpened([]);
    } else {
      setSelectedTrackingNotOpened(trackingData.notOpened.map(r => r.email));
    }
  };

  // Get campaign name for tracking context
  const getTrackingCampaignName = () => {
    const campaign = campaignHistory.find(c => c.id === trackingCampaignId);
    return campaign?.campaign_name || '';
  };

  // Send follow-up to selected tracking recipients
  const handleSendFollowUpFromTracking = (type: 'opened' | 'not_opened') => {
    const selectedEmails = type === 'opened' ? selectedTrackingOpens : selectedTrackingNotOpened;
    const trackingList = type === 'opened' ? trackingData.opens : trackingData.notOpened;
    
    // Find investor IDs for selected emails
    const selectedInvestorIds = investors
      .filter(inv => inv.email && selectedEmails.includes(inv.email))
      .map(inv => inv.id);
    
    if (selectedInvestorIds.length === 0) {
      toast({
        title: "Nessun investitore trovato",
        description: "I contatti selezionati non sono presenti nel database investitori",
        variant: "destructive",
      });
      return;
    }

    // Pre-fill compose tab with selected investors
    setSelectedInvestors(selectedInvestorIds);
    
    // Generate suggested email content based on type
    const campaignName = getTrackingCampaignName();
    if (type === 'opened') {
      setEmailForm({
        subject: `Follow-up: ${campaignName}`,
        preheader: 'Grazie per il Suo interesse - organizziamo un incontro?',
        content: `Gentile {nome},

La ringraziamo per l'interesse dimostrato leggendo la nostra precedente comunicazione.

Desideriamo proseguire il dialogo e fornirLe ulteriori dettagli sull'opportunità di investimento in ABC Company.

Sarebbe disponibile per una breve call conoscitiva questa settimana?

Cordiali saluti,
Il Team ABC Company`,
        campaignName: `Follow-up Aperture - ${campaignName}`,
        ctaLink: '',
        ctaText: '',
      });
    } else {
      setEmailForm({
        subject: `Promemoria: ${campaignName}`,
        preheader: 'Promemoria sulla nostra opportunità di investimento',
        content: `Gentile {nome},

Ci permettiamo di ricontattarLa riguardo alla nostra precedente comunicazione su ABC Company.

Comprendiamo che il Suo tempo sia prezioso, ma volevamo assicurarci che avesse avuto modo di considerare l'opportunità presentata.

Restiamo a disposizione per qualsiasi domanda o chiarimento.

Cordiali saluti,
Il Team ABC Company`,
        campaignName: `Reminder Non Aperture - ${campaignName}`,
        ctaLink: '',
        ctaText: '',
      });
    }

    // Switch to compose tab
    setActiveTab("compose");
    
    toast({
      title: "Destinatari selezionati",
      description: `${selectedInvestorIds.length} investitori pronti per la campagna follow-up`,
    });
  };

  // Send summary email for a campaign
  const handleSendSummary = async (campaign: CampaignHistory) => {
    setIsSendingSummary(true);
    try {
      const recipients = Array.isArray(campaign.recipients) ? campaign.recipients : [];
      const sentTo = recipients.map((r: any) => `${r.name || 'N/A'} <${r.email}>`);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Non autenticato');
      }

      const response = await supabase.functions.invoke('send-abc-campaign', {
        body: {
          sendSummaryOnly: true,
          subject: campaign.subject,
          recipients: [],
          content: '',
          senderEmail: '',
          summaryData: {
            successful: campaign.successful_sends,
            failed: campaign.failed_sends,
            sentTo,
            errors: [],
          },
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Riepilogo inviato",
        description: `Email di riepilogo inviata a edoardo.grigione@aries76.com`,
      });
    } catch (error: any) {
      console.error('Error sending summary:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore nell'invio del riepilogo",
        variant: "destructive",
      });
    } finally {
      setIsSendingSummary(false);
    }
  };

  // Get unique categories from approved investors
  const categories = [...new Set(approvedInvestors.map(i => i.categoria))];
  const statuses = ['To Contact', 'Contacted', 'Interested', 'Meeting Scheduled', 'In Negotiation', 'Closed'];
  
  // Get unique approval dates for filter options (filter out invalid dates)
  const approvalDates = [...new Set(approvedInvestors
    .filter(i => i.created_at && !isNaN(new Date(i.created_at).getTime()))
    .map(i => format(new Date(i.created_at!), 'yyyy-MM-dd'))
  )].sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)

  // Filter approved investors with email based on criteria
  const filteredInvestors = approvedWithEmail.filter(inv => {
    if (filterStatus === "not_contacted" && inv.status !== "To Contact") return false;
    if (filterStatus !== "all" && filterStatus !== "not_contacted" && inv.status !== filterStatus) return false;
    if (filterCategory !== "all" && inv.categoria !== filterCategory) return false;
    
    // Filter by approval date
    if (filterApprovalDate !== "all") {
      if (!inv.created_at || isNaN(new Date(inv.created_at).getTime())) return false;
      const invDate = format(new Date(inv.created_at), 'yyyy-MM-dd');
      if (invDate !== filterApprovalDate) return false;
    }
    
    // Filter by never contacted (legacy)
    if (filterNeverContacted && inv.last_contact_date !== null) return false;
    
    // NEW: Filter by engagement status
    if (filterEngagement !== "all") {
      const engagementLabel = getEngagementLabel(inv.id);
      switch (filterEngagement) {
        case "never_contacted":
          if (engagementLabel !== 'never_contacted') return false;
          break;
        case "non_openers":
          if (engagementLabel !== 'non_opener') return false;
          break;
        case "openers":
          if (engagementLabel !== 'engaged' && engagementLabel !== 'clicked') return false;
          break;
        case "clickers":
          if (engagementLabel !== 'clicked') return false;
          break;
        case "targetable":
          // Mai contattati + Non-openers (as per user choice)
          if (engagementLabel !== 'never_contacted' && engagementLabel !== 'non_opener') return false;
          break;
      }
    }
    
    return true;
  });

  // Save email for investor missing email
  const handleSaveEmail = async (investorId: string) => {
    if (!editingEmailValue || !editingEmailValue.includes('@')) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    setIsSavingEmail(true);
    try {
      const { error } = await supabase
        .from('abc_investors')
        .update({ email: editingEmailValue })
        .eq('id', investorId);

      if (error) throw error;

      toast({
        title: "Email salvata",
        description: "L'indirizzo email è stato aggiunto con successo",
      });

      setEditingEmailId(null);
      setEditingEmailValue("");
      
      // Trigger a refresh of the investors list
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving email:', error);
      toast({
        title: "Errore",
        description: "Errore nel salvataggio dell'email",
        variant: "destructive",
      });
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvestors.length === filteredInvestors.length) {
      setSelectedInvestors([]);
    } else {
      setSelectedInvestors(filteredInvestors.map(i => i.id));
    }
  };

  const handleSelectInvestor = (investorId: string) => {
    setSelectedInvestors(prev => 
      prev.includes(investorId) 
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
    );
  };

  // Replace placeholders with actual values - Extended merge tags
  const replacePlaceholders = (text: string, investor: Investor): string => {
    return text
      .replace(/\{nome\}/g, investor.nome || '')
      .replace(/\{azienda\}/g, investor.azienda || '')
      .replace(/\{ruolo\}/g, investor.ruolo || '')
      .replace(/\{citta\}/g, investor.citta || '')
      .replace(/\{categoria\}/g, investor.categoria || '')
      .replace(/\{email\}/g, investor.email || '')
      .replace(/\{pipeline_value\}/g, investor.pipeline_value ? `€${investor.pipeline_value.toLocaleString()}` : '')
      .replace(/\{last_contact\}/g, investor.last_contact_date ? format(new Date(investor.last_contact_date), 'dd/MM/yyyy') : 'mai')
      .replace(/\{engagement_score\}/g, String(investor.engagement_score || 0))
      .replace(/\{linkedin\}/g, investor.linkedin || '')
      .replace(/\{fonte\}/g, investor.fonte || '')
      .replace(/\{status\}/g, investor.status || '');
  };

  // Ensure the template includes the investor name even when placeholders are missing
  const ensureInvestorNameInGreeting = (text: string, investor: Investor): string => {
    const trimmed = text.trimStart();

    // If template already uses the placeholder, do nothing
    if (trimmed.includes('{nome}')) return text;

    // If the template already contains the investor's name, don't modify it
    if (investor.nome && text.includes(investor.nome)) return text;

    // If the very first line is just a greeting without a name, inject {nome}
    // Examples it fixes: "Gentile", "Gentile,", "Buongiorno", "Egregio"
    const lines = text.split(/\r?\n/);
    const firstLine = (lines[0] || '').trim();

    const match = firstLine.match(/^(Gentile|Buongiorno|Egregio)\s*,?\s*$/i);
    if (match) {
      lines[0] = `${match[1]} {nome},`;
      return lines.join('\n');
    }

    // Otherwise, prepend a standard greeting with {nome}
    return `Gentile {nome},\n\n${text}`;
  };

  const getPersonalizedContent = (investor: Investor) =>
    replacePlaceholders(ensureInvestorNameInGreeting(emailForm.content || '', investor), investor);

  const getPersonalizedSubject = (investor: Investor) =>
    replacePlaceholders(emailForm.subject || '', investor);

  // AI Email Draft Generation
  const handleGenerateAIDraft = async () => {
    if (selectedInvestors.length === 0) {
      toast({
        title: "Seleziona un investitore",
        description: "Seleziona almeno un investitore per generare l'email",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    const firstInvestor = investors.find(i => selectedInvestors.includes(i.id));
    
    if (!firstInvestor) {
      setIsGeneratingAI(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-email-draft', {
        body: {
          investor: {
            nome: firstInvestor.nome,
            azienda: firstInvestor.azienda,
            ruolo: firstInvestor.ruolo,
            citta: firstInvestor.citta,
            categoria: firstInvestor.categoria,
            email: firstInvestor.email,
            status: firstInvestor.status,
            pipeline_value: firstInvestor.pipeline_value,
            last_contact_date: firstInvestor.last_contact_date,
            engagement_score: firstInvestor.engagement_score,
          },
          emailType: aiEmailType,
          language: 'it',
        },
      });

      if (error) throw error;

      if (data?.draft) {
        setEmailForm(prev => ({
          ...prev,
          subject: data.draft.subject || prev.subject,
          content: data.draft.content || prev.content,
        }));
        
        toast({
          title: "Bozza generata con AI",
          description: "L'email è stata generata. Puoi modificarla prima di inviarla.",
        });
        setShowAIDialog(false);
      }
    } catch (error: any) {
      console.error('Error generating AI draft:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore nella generazione della bozza AI",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Response type to investor status mapping
  const responseStatusMap: Record<string, string> = {
    'declined': 'Not Interested',
    'interested': 'Interested',
    'meeting_request': 'Meeting Scheduled',
    'more_info': 'Contacted',
    'other': 'Contacted',
  };

  // Track email response
  const handleTrackResponse = async () => {
    if (!selectedCampaignForResponse || !responseInvestorEmail) {
      toast({
        title: "Dati mancanti",
        description: "Seleziona una campagna e inserisci l'email dell'investitore",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find investor by email
      const investor = investors.find(i => i.email?.toLowerCase() === responseInvestorEmail.toLowerCase());

      // Insert response record
      const { error } = await supabase.from('abc_email_responses').insert({
        campaign_id: selectedCampaignForResponse,
        investor_id: investor?.id,
        investor_email: responseInvestorEmail,
        investor_name: investor?.nome,
        response_type: responseType,
        notes: responseNote,
      });

      if (error) throw error;

      // Automatically update investor status based on response type
      if (investor) {
        const newStatus = responseStatusMap[responseType] || 'Contacted';
        
        const { error: updateError } = await supabase
          .from('abc_investors')
          .update({ 
            status: newStatus,
            last_contact_date: new Date().toISOString()
          })
          .eq('id', investor.id);

        if (updateError) {
          console.error('Error updating investor status:', updateError);
        }

        // Log activity
        const responseLabels: Record<string, string> = {
          'declined': 'Ha declinato',
          'interested': 'È interessato',
          'meeting_request': 'Ha richiesto un meeting',
          'more_info': 'Ha chiesto più informazioni',
          'other': 'Altra risposta',
        };

        await supabase.from('abc_investor_activities').insert({
          investor_name: `${investor.nome} - ${investor.azienda}`,
          activity_type: 'Email Response',
          activity_description: `${responseLabels[responseType] || 'Risposta'}: ${responseNote || 'Nessuna nota'}`,
          created_by: currentUserEmail,
        });

        // Also sync note to abc_investor_notes for visibility in investor profile
        if (responseNote && responseNote.trim()) {
          const campaignInfo = campaignHistory.find(c => c.id === selectedCampaignForResponse);
          const noteText = `[Risposta Campagna${campaignInfo ? ` "${campaignInfo.campaign_name}"` : ''}] ${responseLabels[responseType] || 'Risposta'}: ${responseNote}`;
          
          await supabase.from('abc_investor_notes').insert({
            investor_name: investor.nome,
            note_text: noteText,
            created_by: currentUserEmail,
          });
        }
      }

      toast({
        title: "Risposta registrata",
        description: investor 
          ? `Risposta tracciata e status aggiornato a "${responseStatusMap[responseType]}"` 
          : "Risposta tracciata (investitore non trovato nel database)",
      });

      setResponseDialogOpen(false);
      setSelectedCampaignForResponse(null);
      setResponseInvestorEmail("");
      setResponseNote("");
      setResponseType("declined");
      
      // Refresh campaign history and trigger investors refresh
      fetchCampaignHistory();
      onInvestorsUpdated?.();
    } catch (error: any) {
      console.error('Error tracking response:', error);
      toast({
        title: "Errore",
        description: "Errore nel tracciamento della risposta",
        variant: "destructive",
      });
    }
  };

  // Generate HTML email preview matching the actual email template
  const generateEmailHtml = (investor: Investor) => {
    const personalizedContent = getPersonalizedContent(investor);
    const personalizedSubject = getPersonalizedSubject(investor);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        
        <!-- Main Container -->
        <div style="max-width: 640px; margin: 0 auto; padding: 30px 15px;">
          
          <!-- Email Card -->
          <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
            
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%); padding: 35px 40px; text-align: center;">
              <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 50px;" />
              <p style="color: #c77c4d; font-size: 11px; letter-spacing: 3px; margin: 12px 0 0 0; text-transform: uppercase;">Capital Intelligence</p>
            </div>
            
            <!-- Email Body -->
            <div style="padding: 40px;">
              <div style="font-size: 15px; line-height: 1.8; color: #333333; white-space: pre-wrap;">${personalizedContent}</div>
              ${emailForm.ctaLink ? `
              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="${emailForm.ctaLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px; letter-spacing: 0.5px;">
                  ${emailForm.ctaText || 'Scopri di più'}
                </a>
              </div>
              ` : ''}
            </div>
            
            <!-- Signature Block -->
            <div style="padding: 0 40px 40px 40px;">
              <div style="border-top: 2px solid #c77c4d; padding-top: 25px;">
                <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                  <tr>
                    <td style="vertical-align: top; padding-right: 25px; border-right: 1px solid #e5e5e5;">
                      <img src="https://aries76.lovable.app/aries76-og-logo.png" alt="ARIES76" style="height: 40px;" />
                    </td>
                    <td style="vertical-align: top; padding-left: 25px;">
                      <div style="font-size: 16px; font-weight: 700; color: #1a2332; letter-spacing: 0.5px;">Edoardo GRIGIONE</div>
                      <div style="font-size: 13px; color: #c77c4d; margin-top: 4px; font-weight: 500;">CEO | Founder</div>
                      <div style="font-size: 13px; margin-top: 8px;">
                        <a href="https://www.aries76.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">www.aries76.com</a>
                      </div>
                      <div style="font-size: 12px; color: #666666; margin-top: 6px;">27, Old Gloucester Street, London WC1N 3AX, UK</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            
          </div>
          
          <!-- Confidentiality Disclaimer -->
          <div style="padding: 25px 20px; text-align: center;">
            <p style="font-size: 10px; color: #888888; line-height: 1.6; margin: 0;">
              The information transmitted is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination, or other use of, or taking of any action in reliance upon, this information by persons or entities other than the intended recipient is prohibited. If you received this in error, please contact the sender and delete the material from any computer.
            </p>
            <p style="font-size: 11px; color: #999999; margin: 15px 0 0 0;">
              Aries76 Capital Advisory · London, United Kingdom
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;
  };

  // Get selected investors with email for preview
  const getSelectedInvestorsForPreview = () => {
    return investors.filter(i => selectedInvestors.includes(i.id) && i.email);
  };

  // Preview email for selected investor at index
  const handlePreview = (index: number = 0) => {
    if (!emailForm.content) {
      toast({
        title: "Contenuto mancante",
        description: "Scrivi il contenuto dell'email prima di vedere l'anteprima",
        variant: "destructive",
      });
      return;
    }
    
    const selectedForPreview = getSelectedInvestorsForPreview();
    
    if (selectedForPreview.length === 0) {
      toast({
        title: "Seleziona un investitore",
        description: "Seleziona almeno un investitore con email per vedere l'anteprima",
        variant: "destructive",
      });
      return;
    }
    
    const safeIndex = Math.max(0, Math.min(index, selectedForPreview.length - 1));
    setPreviewInvestorIndex(safeIndex);
    
    const investor = selectedForPreview[safeIndex];
    const htmlContent = generateEmailHtml(investor);
    setPreviewContent(htmlContent);
  };

  // Navigate to next/previous investor in preview
  const navigatePreview = (direction: 'prev' | 'next') => {
    const selectedForPreview = getSelectedInvestorsForPreview();
    const newIndex = direction === 'next' 
      ? Math.min(previewInvestorIndex + 1, selectedForPreview.length - 1)
      : Math.max(previewInvestorIndex - 1, 0);
    handlePreview(newIndex);
  };

  // Send test email to personal address
  const handleSendTest = async () => {
    if (!emailForm.subject || !emailForm.content) {
      toast({
        title: "Compila tutti i campi",
        description: "Oggetto e contenuto sono obbligatori per il test",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);

    try {
      // Use sample data for placeholders in test
      const testRecipient = {
        email: TEST_EMAIL,
        name: "Test Investitore",
        company: "Test Company",
        role: "CEO",
        city: "Milano",
        category: "Family Office",
      };

      // Create a test campaign record for tracking
      const { data: campaignData, error: campaignError } = await supabase
        .from('abc_email_campaign_history')
        .insert({
          campaign_name: `[TEST] ${emailForm.campaignName || format(new Date(), 'dd/MM/yyyy HH:mm')}`,
          subject: emailForm.subject,
          content: emailForm.content,
          recipient_count: 1,
          successful_sends: 0,
          failed_sends: 0,
          filter_status: null,
          filter_category: null,
          sent_by: currentUserEmail,
          recipients: [{ email: TEST_EMAIL, name: "Test Investitore", company: "Test Company" }],
        })
        .select('id')
        .single();

      if (campaignError) throw campaignError;

      const campaignId = campaignData.id;
      console.log('Test campaign created with ID:', campaignId);

      const { data, error } = await supabase.functions.invoke('send-abc-campaign', {
        body: {
          recipients: [testRecipient],
          subject: emailForm.subject,
          preheader: emailForm.preheader || undefined,
          content: emailForm.content,
          senderEmail: currentUserEmail,
          attachments: attachments,
          campaignId: campaignId,
          ctaLink: emailForm.ctaLink || undefined,
          ctaText: emailForm.ctaText || undefined,
        },
      });

      if (error) throw error;

      // Update campaign with send result
      await supabase
        .from('abc_email_campaign_history')
        .update({
          successful_sends: 1,
          failed_sends: 0,
        })
        .eq('id', campaignId);

      toast({
        title: "Email test inviata",
        description: `Email di test inviata a ${TEST_EMAIL}${attachments.length > 0 ? ` con ${attachments.length} allegato/i` : ''}`,
      });

      // Refresh campaign history
      fetchCampaignHistory();

    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore nell'invio dell'email di test",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !emailForm.subject || !emailForm.content) {
      toast({
        title: "Compila tutti i campi",
        description: "Nome template, oggetto e contenuto sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from('abc_email_templates').insert({
      name: templateName,
      subject: emailForm.subject,
      content: emailForm.content,
      created_by: currentUserEmail,
    });

    if (error) {
      toast({
        title: "Errore",
        description: "Errore nel salvataggio del template",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template salvato",
        description: `Template "${templateName}" salvato con successo`,
      });
      setTemplateName("");
      setShowSaveDialog(false);
      fetchTemplates();
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailForm({
        ...emailForm,
        subject: template.subject,
        content: template.content,
      });
      setSelectedTemplate(templateId);
      toast({
        title: "Template caricato",
        description: `Template "${template.name}" caricato`,
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('abc_email_templates')
      .delete()
      .eq('id', templateId);

    if (!error) {
      toast({
        title: "Template eliminato",
      });
      fetchTemplates();
      if (selectedTemplate === templateId) {
        setSelectedTemplate("");
      }
    }
  };

  const handleSendCampaign = async () => {
    if (selectedInvestors.length === 0) {
      toast({
        title: "Seleziona investitori",
        description: "Devi selezionare almeno un investitore",
        variant: "destructive",
      });
      return;
    }

    if (!emailForm.subject || !emailForm.content) {
      toast({
        title: "Compila tutti i campi",
        description: "Oggetto e contenuto sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const selectedRecipients = filteredInvestors
        .filter(i => selectedInvestors.includes(i.id) && i.email)
        .map(i => ({
          email: i.email!,
          name: i.nome,
          company: i.azienda,
          role: i.ruolo || '',
          city: i.citta || '',
          category: i.categoria,
          // Pre-process content with placeholders replaced (+ auto greeting with name)
          personalizedContent: getPersonalizedContent(i),
          personalizedSubject: getPersonalizedSubject(i),
        }));

      // First, create campaign record to get the ID for tracking
      const { data: campaignData, error: campaignError } = await supabase
        .from('abc_email_campaign_history')
        .insert({
          campaign_name: emailForm.campaignName || `Campagna ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
          subject: emailForm.subject,
          content: emailForm.content,
          recipient_count: selectedRecipients.length,
          successful_sends: 0,
          failed_sends: 0,
          filter_status: filterStatus !== 'all' ? filterStatus : null,
          filter_category: filterCategory !== 'all' ? filterCategory : null,
          sent_by: currentUserEmail,
          recipients: selectedRecipients.map(r => ({ email: r.email, name: r.name, company: r.company })),
        })
        .select('id')
        .single();

      if (campaignError) throw campaignError;

      const campaignId = campaignData.id;
      console.log('Campaign created with ID:', campaignId);

      // Call edge function to send emails with campaign ID for tracking
      const { data, error } = await supabase.functions.invoke('send-abc-campaign', {
        body: {
          recipients: selectedRecipients,
          subject: emailForm.subject,
          preheader: emailForm.preheader || undefined,
          content: emailForm.content,
          senderEmail: currentUserEmail,
          attachments: attachments,
          campaignId: campaignId,
          ctaLink: emailForm.ctaLink || undefined,
          ctaText: emailForm.ctaText || undefined,
        },
      });

      if (error) throw error;

      const successCount = data?.successful || selectedRecipients.length;
      const failCount = data?.failed || 0;

      // Update campaign with actual send results
      await supabase
        .from('abc_email_campaign_history')
        .update({
          successful_sends: successCount,
          failed_sends: failCount,
        })
        .eq('id', campaignId);

      toast({
        title: "Campagna inviata",
        description: `Email inviata a ${successCount} investitori${failCount > 0 ? `, ${failCount} fallite` : ''}. Tracking aperture attivo.`,
      });

      // Log activity and update status for each investor
      const investorIdsToUpdate = filteredInvestors
        .filter(i => selectedInvestors.includes(i.id) && i.email)
        .map(i => i.id);

      for (const investor of selectedRecipients) {
        await supabase.from('abc_investor_activities').insert({
          investor_name: `${investor.name} - ${investor.company}`,
          activity_type: 'Email Campaign',
          activity_description: `Campagna email: ${emailForm.subject}`,
          created_by: currentUserEmail,
        });
      }

      // Update investor status from "To Contact" to "Contacted" and set last_contact_date
      const { error: updateError } = await supabase
        .from('abc_investors')
        .update({ 
          status: 'Contacted',
          last_contact_date: new Date().toISOString()
        })
        .in('id', investorIdsToUpdate)
        .eq('status', 'To Contact'); // Only update if currently "To Contact"

      if (updateError) {
        console.error('Error updating investor status:', updateError);
      }

      // Reset form
      setEmailForm({ subject: "", preheader: "", content: "", campaignName: "", ctaLink: "", ctaText: "" });
      setSelectedInvestors([]);
      setAttachments([]);
      fetchCampaignHistory();

      // Notify parent to refresh investors
      if (onInvestorsUpdated) {
        onInvestorsUpdated();
      }

    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore nell'invio della campagna",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Calculate content score for current email
  const contentScore = emailForm.subject || emailForm.content 
    ? analyzeSpamScore(emailForm.subject, emailForm.content)
    : null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 flex flex-wrap">
        <TabsTrigger value="compose" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Componi
        </TabsTrigger>
        <TabsTrigger value="engaged" className="flex items-center gap-2 text-emerald-600">
          <UserCheck className="h-4 w-4" />
          Follow-up Engaged ({engagementData.openers.size + engagementData.clickers.size})
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Template ({templates.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Storico ({campaignHistory.length})
        </TabsTrigger>
        <TabsTrigger value="tracking" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Tracking
        </TabsTrigger>
        <TabsTrigger value="deliverability" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Deliverability
        </TabsTrigger>
      </TabsList>

      {/* COMPOSE TAB */}
      <TabsContent value="compose">
        {/* Pending Reminders Banner */}
        {pendingReminders && pendingReminders.length > 0 && (
          <Card className="mb-4 border-primary/50 bg-primary/5">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      Campagna Reminder: {pendingReminders.length} investitori selezionati
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pendingReminders.filter(r => r.priority === 'high').length} alta priorità · 
                      {pendingReminders.filter(r => r.priority === 'medium').length} media priorità
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedInvestors([]);
                    setEmailForm({ subject: '', preheader: '', content: '', campaignName: '', ctaLink: '', ctaText: '' });
                    onRemindersClear?.();
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Annulla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Composer */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Componi Email
                  </span>
                  {templates.length > 0 && (
                    <Select value={selectedTemplate} onValueChange={handleLoadTemplate}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Carica template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardTitle>
                <CardDescription>
                  Scrivi il messaggio da inviare agli investitori selezionati
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Nome Campagna (opzionale)</Label>
                  <Input
                    id="campaignName"
                    value={emailForm.campaignName}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, campaignName: e.target.value }))}
                    placeholder="Es: Outreach Gennaio 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="ABC Company - Opportunità di Investimento"
                  />
                </div>
                <div>
                  <Label htmlFor="preheader" className="flex items-center gap-2">
                    Preheader 
                    <span className="text-xs text-muted-foreground font-normal">(testo anteprima inbox)</span>
                  </Label>
                  <Input
                    id="preheader"
                    value={emailForm.preheader}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, preheader: e.target.value }))}
                    placeholder="Es: Scopri l'opportunità esclusiva per il tuo portafoglio"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Visibile nell'anteprima email (max 150 caratteri). Migliora open rate del 10-20%.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="content">Contenuto</Label>
                    {emailForm.content && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setEmailForm(prev => ({ ...prev, content: "" }))}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancella
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="content"
                    value={emailForm.content}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Gentile {nome},

Siamo lieti di presentarle un'opportunità esclusiva di investimento in ABC Company...

Cordiali saluti,
Team Aries76"
                    rows={12}
                    className="font-mono text-sm"
                  />
                  {/* Merge Tags with usage indicator */}
                  {(() => {
                    const allTags = [
                      { tag: '{nome}', label: 'nome' },
                      { tag: '{azienda}', label: 'azienda' },
                      { tag: '{ruolo}', label: 'ruolo' },
                      { tag: '{citta}', label: 'città' },
                      { tag: '{categoria}', label: 'categoria' },
                      { tag: '{email}', label: 'email' },
                      { tag: '{pipeline_value}', label: 'pipeline_value', advanced: true },
                      { tag: '{last_contact}', label: 'last_contact', advanced: true },
                      { tag: '{engagement_score}', label: 'engagement_score', advanced: true },
                      { tag: '{linkedin}', label: 'linkedin', advanced: true },
                      { tag: '{fonte}', label: 'fonte', advanced: true },
                      { tag: '{status}', label: 'status', advanced: true },
                    ];
                    const usedTags = allTags.filter(t => emailForm.content.includes(t.tag) || emailForm.subject.includes(t.tag));
                    const unusedTags = allTags.filter(t => !emailForm.content.includes(t.tag) && !emailForm.subject.includes(t.tag));
                    
                    return (
                      <div className="space-y-2 mt-2">
                        {usedTags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-green-600 font-medium flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              In uso:
                            </span>
                            {usedTags.map(t => (
                              <Badge 
                                key={t.tag} 
                                className="text-xs bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                              >
                                {t.tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {usedTags.length > 0 ? 'Disponibili:' : 'Merge tags:'}
                          </span>
                          {unusedTags.map(t => (
                            <Badge 
                              key={t.tag} 
                              variant="outline" 
                              className={`text-xs cursor-pointer hover:bg-primary/10 ${t.advanced ? 'bg-primary/5' : ''}`}
                              onClick={() => {
                                const textarea = document.getElementById('content') as HTMLTextAreaElement;
                                if (textarea) {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const newContent = emailForm.content.substring(0, start) + t.tag + emailForm.content.substring(end);
                                  setEmailForm(prev => ({ ...prev, content: newContent }));
                                }
                              }}
                            >
                              {t.tag}
                            </Badge>
                          ))}
                        </div>
                        {usedTags.length > 0 && (
                          <p className="text-xs text-muted-foreground italic">
                            Ogni email sarà personalizzata con i dati specifici di ciascun investitore
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Attachments Section */}
                <div>
                  <Label>Allegati</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileAttachment}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                      />
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Paperclip className="h-4 w-4 mr-2" />
                          Aggiungi allegato
                        </span>
                      </Button>
                    </label>
                    <span className="text-xs text-muted-foreground">Max 10MB per file</span>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((att, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{att.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Link Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctaLink">Link CTA (opzionale)</Label>
                    <Input
                      id="ctaLink"
                      value={emailForm.ctaLink}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, ctaLink: e.target.value }))}
                      placeholder="https://www.example.com"
                      type="url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaText">Testo Pulsante</Label>
                    <Input
                      id="ctaText"
                      value={emailForm.ctaText}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, ctaText: e.target.value }))}
                      placeholder="Es: Visita il sito, Scopri di più"
                      disabled={!emailForm.ctaLink}
                    />
                  </div>
                </div>
                {emailForm.ctaLink && (
                  <p className="text-xs text-muted-foreground">
                    Un pulsante con il link verrà aggiunto alla fine dell'email
                  </p>
                )}

                {/* Content Score Indicator */}
                {contentScore && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    contentScore.score >= 80 ? 'bg-green-500/5 border-green-500/20' :
                    contentScore.score >= 60 ? 'bg-yellow-500/5 border-yellow-500/20' :
                    contentScore.score >= 40 ? 'bg-orange-500/5 border-orange-500/20' :
                    'bg-red-500/5 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-5 w-5 ${
                        contentScore.score >= 80 ? 'text-green-500' :
                        contentScore.score >= 60 ? 'text-yellow-500' :
                        contentScore.score >= 40 ? 'text-orange-500' :
                        'text-red-500'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            contentScore.score >= 80 ? 'text-green-600' :
                            contentScore.score >= 60 ? 'text-yellow-600' :
                            contentScore.score >= 40 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {contentScore.score}/100
                          </span>
                          <span className="text-sm text-muted-foreground">Content Score</span>
                        </div>
                        {contentScore.issues.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {contentScore.issues.length} {contentScore.issues.length === 1 ? 'problema' : 'problemi'} rilevato
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveTab('deliverability')}
                      className="ml-auto"
                    >
                      Analizza
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {/* AI Draft Generation Button */}
                  <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                        Genera con AI
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          Genera Email con AI
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          Seleziona il tipo di email da generare. L'AI creerà una bozza personalizzata 
                          basata sul profilo dell'investitore selezionato.
                        </p>
                        <div>
                          <Label>Tipo di Email</Label>
                          <Select value={aiEmailType} onValueChange={(v) => setAiEmailType(v as EmailType)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="first_contact">Primo Contatto</SelectItem>
                              <SelectItem value="follow_up">Follow-up</SelectItem>
                              <SelectItem value="meeting_request">Richiesta Meeting</SelectItem>
                              <SelectItem value="proposal">Invio Proposta</SelectItem>
                              <SelectItem value="custom">Personalizzato</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedInvestors.length === 0 && (
                          <p className="text-sm text-amber-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Seleziona almeno un investitore dalla lista
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Annulla</Button>
                        </DialogClose>
                        <Button 
                          onClick={handleGenerateAIDraft}
                          disabled={isGeneratingAI || selectedInvestors.length === 0}
                          className="bg-gradient-to-r from-purple-500 to-blue-500"
                        >
                          {isGeneratingAI ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Generazione...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Genera Bozza
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline"
                    onClick={() => handlePreview(0)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Anteprima
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                  >
                    {isSendingTest ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Invio test...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Test ({TEST_EMAIL})
                      </>
                    )}
                  </Button>
                  
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Salva Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Salva come Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Nome Template</Label>
                          <Input
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Es: Primo Contatto Investitori"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Annulla</Button>
                        </DialogClose>
                        <Button onClick={handleSaveTemplate}>Salva</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={handleSendCampaign} 
                    className="flex-1" 
                    disabled={isSending || selectedInvestors.length === 0}
                  >
                    {isSending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Invia a {selectedInvestors.length} investitori
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Dialog */}
            {previewContent && (() => {
              const selectedForPreview = getSelectedInvestorsForPreview();
              const currentInvestor = selectedForPreview[previewInvestorIndex];
              return (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Anteprima Email Personalizzata
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setPreviewContent(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    {selectedForPreview.length > 1 && (
                      <div className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigatePreview('prev')}
                          disabled={previewInvestorIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                          <div className="text-sm font-medium">{currentInvestor?.nome}</div>
                          <div className="text-xs text-muted-foreground">{currentInvestor?.azienda}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {previewInvestorIndex + 1} di {selectedForPreview.length} destinatari
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigatePreview('next')}
                          disabled={previewInvestorIndex === selectedForPreview.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {selectedForPreview.length === 1 && currentInvestor && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Email per: <span className="font-medium">{currentInvestor.nome}</span> ({currentInvestor.azienda})
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden bg-gray-100">
                      <iframe 
                        srcDoc={previewContent}
                        className="w-full h-[600px] border-0"
                        title="Email Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Recipients Selector */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtri
                </CardTitle>
                <CardDescription className="text-xs">
                  Solo investitori <Badge variant="default" className="bg-green-500 text-xs ml-1">Approved</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Stato</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Tutti gli stati" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti gli stati</SelectItem>
                      <SelectItem value="not_contacted" className="text-orange-600 font-medium">
                        ⚡ Non ancora contattati
                      </SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Tutte le categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le categorie</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Data Approvazione</Label>
                  <Select value={filterApprovalDate} onValueChange={setFilterApprovalDate}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Tutte le date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le date</SelectItem>
                      {approvalDates.map(date => (
                        <SelectItem key={date} value={date}>
                          {format(new Date(date), 'dd MMM yyyy', { locale: it })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* NEW: Engagement Filter - Campaign Intelligence */}
                <div className="pt-2 border-t">
                  <Label className="text-xs flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Segmentazione Campagna
                  </Label>
                  <Select value={filterEngagement} onValueChange={setFilterEngagement}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue placeholder="Tutti" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti gli investitori</SelectItem>
                      <SelectItem value="targetable" className="text-primary font-medium">
                        🎯 Nuova Campagna (mai contattati + non-openers)
                      </SelectItem>
                      <SelectItem value="never_contacted">
                        📭 Mai contattati
                      </SelectItem>
                      <SelectItem value="non_openers">
                        👁️‍🗨️ Non hanno aperto email
                      </SelectItem>
                      <SelectItem value="openers" className="text-emerald-600">
                        ✅ Hanno aperto (Engaged)
                      </SelectItem>
                      <SelectItem value="clickers" className="text-emerald-700 font-medium">
                        🔗 Hanno cliccato link (Hot)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {!engagementLoading && (
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px]">
                      <Badge variant="outline" className="text-[10px]">
                        📭 {engagementData.neverContacted.size}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        👁️ {engagementData.nonOpeners.size}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600">
                        ✅ {engagementData.openers.size}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-emerald-700 text-emerald-700">
                        🔗 {engagementData.clickers.size}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Investitori Approved
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{approvedInvestors.length}</Badge>
                  </div>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {approvedWithEmail.length} con email · {approvedMissingEmail.length} senza email
                </p>
                {(filterStatus !== 'all' || filterCategory !== 'all' || filterApprovalDate !== 'all' || filterNeverContacted) && (
                  <p className="text-xs text-primary mt-1">
                    Filtrati: {filteredInvestors.length} contattabili
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox 
                        checked={selectedInvestors.length === filteredInvestors.length && filteredInvestors.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <span>Seleziona tutti</span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {selectedInvestors.length} selezionati
                    </span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {filteredInvestors.length === 0 ? (
                      <div className="text-center py-4">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Nessun investitore approved con email</p>
                      </div>
                    ) : (
                      filteredInvestors.map(investor => {
                        const engLabel = getEngagementLabel(investor.id);
                        const stats = getInvestorStats(investor.id);
                        return (
                          <label 
                            key={investor.id} 
                            className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                          >
                            <Checkbox 
                              checked={selectedInvestors.includes(investor.id)}
                              onCheckedChange={() => handleSelectInvestor(investor.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <p className="text-sm font-medium truncate">{investor.nome}</p>
                                {engLabel === 'clicked' && (
                                  <span title="Ha cliccato link">
                                    <MousePointerClick className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                                  </span>
                                )}
                                {engLabel === 'engaged' && (
                                  <span title="Ha aperto email">
                                    <MailOpen className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                  </span>
                                )}
                                {engLabel === 'non_opener' && (
                                  <span title="Non ha aperto">
                                    <UserX className="h-3 w-3 text-amber-500 flex-shrink-0" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{investor.azienda}</p>
                              {stats && stats.opensCount > 0 && (
                                <p className="text-[10px] text-emerald-600">
                                  {stats.opensCount} aperture{stats.clicksCount > 0 ? ` · ${stats.clicksCount} click` : ''}
                                </p>
                              )}
                            </div>
                            {selectedInvestors.includes(investor.id) && (
                              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Missing Email Section */}
            {approvedMissingEmail.length > 0 && (
              <Card className="border-amber-500/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm text-amber-600">
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Email Mancanti
                    </span>
                    <Badge variant="outline" className="border-amber-500 text-amber-600">
                      {approvedMissingEmail.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Investitori approved senza email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {approvedMissingEmail.map(investor => (
                      <div 
                        key={investor.id} 
                        className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{investor.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">{investor.azienda}</p>
                          </div>
                          {editingEmailId !== investor.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                setEditingEmailId(investor.id);
                                setEditingEmailValue("");
                              }}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Aggiungi
                            </Button>
                          )}
                        </div>
                        
                        {editingEmailId === investor.id && (
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="email@esempio.com"
                              value={editingEmailValue}
                              onChange={(e) => setEditingEmailValue(e.target.value)}
                              className="h-8 text-xs flex-1"
                            />
                            <Button
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleSaveEmail(investor.id)}
                              disabled={isSavingEmail}
                            >
                              {isSavingEmail ? <Clock className="h-3 w-3 animate-spin" /> : "Salva"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => {
                                setEditingEmailId(null);
                                setEditingEmailValue("");
                              }}
                            >
                              Annulla
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      {/* ENGAGED FOLLOW-UP TAB */}
      <TabsContent value="engaged">
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <UserCheck className="h-5 w-5 mr-2" />
              Investitori Engaged - Follow-up Dedicato
            </CardTitle>
            <CardDescription>
              Contatti che hanno aperto le email o cliccato sui link - pronti per il follow-up
            </CardDescription>
          </CardHeader>
          <CardContent>
            {engagementLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Caricamento dati engagement...</p>
              </div>
            ) : (engagementData.openers.size + engagementData.clickers.size) === 0 ? (
              <div className="text-center py-8">
                <MailOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nessun investitore engaged ancora</p>
                <p className="text-sm text-muted-foreground">Invia campagne email per iniziare a tracciare engagement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600">{engagementData.openers.size}</div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MailOpen className="h-3 w-3" /> Hanno aperto
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-emerald-700">{engagementData.clickers.size}</div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MousePointerClick className="h-3 w-3" /> Hanno cliccato
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-amber-600">{engagementData.nonOpeners.size}</div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <UserX className="h-3 w-3" /> Non aperto
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold">{engagementData.neverContacted.size}</div>
                      <p className="text-xs text-muted-foreground">Mai contattati</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Engaged Investors List */}
                <div className="border rounded-lg">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 border-b flex items-center justify-between">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Pronti per Follow-up ({engagementData.openers.size + engagementData.clickers.size})
                    </h4>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Pre-select all engaged investors
                        const engagedIds = approvedWithEmail
                          .filter(inv => engagementData.openers.has(inv.id) || engagementData.clickers.has(inv.id))
                          .map(inv => inv.id);
                        setSelectedInvestors(engagedIds);
                        setFilterEngagement("openers");
                        setActiveTab("compose");
                        toast({
                          title: "Investitori selezionati",
                          description: `${engagedIds.length} investitori engaged pronti per il follow-up`,
                        });
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Campagna Follow-up
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Investitore</TableHead>
                          <TableHead>Azienda</TableHead>
                          <TableHead className="text-center">Aperture</TableHead>
                          <TableHead className="text-center">Click</TableHead>
                          <TableHead>Ultima Attività</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedWithEmail
                          .filter(inv => engagementData.openers.has(inv.id) || engagementData.clickers.has(inv.id))
                          .map(investor => {
                            const stats = getInvestorStats(investor.id);
                            return (
                              <TableRow key={investor.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {engagementData.clickers.has(investor.id) ? (
                                      <MousePointerClick className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <MailOpen className="h-4 w-4 text-emerald-500" />
                                    )}
                                    {investor.nome}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{investor.azienda}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary">{stats?.opensCount || 0}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={stats?.clicksCount ? "default" : "outline"}>
                                    {stats?.clicksCount || 0}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {stats?.lastOpenAt
                                    ? format(new Date(stats.lastOpenAt), 'dd MMM HH:mm', { locale: it })
                                    : '-'}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedInvestors([investor.id]);
                                      setActiveTab("compose");
                                      setEmailForm(prev => ({
                                        ...prev,
                                        campaignName: `Follow-up ${investor.nome}`,
                                        subject: `Seguito alla nostra conversazione`,
                                      }));
                                    }}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* TEMPLATES TAB */}
      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Template Salvati
            </CardTitle>
            <CardDescription>
              Gestisci i tuoi template email per riutilizzarli nelle campagne
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nessun template salvato</p>
                <p className="text-sm text-muted-foreground">Crea il tuo primo template dalla tab "Componi"</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Oggetto</TableHead>
                    <TableHead>Creato da</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{template.subject}</TableCell>
                      <TableCell className="text-sm">{template.created_by}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(template.created_at), 'dd/MM/yyyy', { locale: it })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadTemplate(template.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Usa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* HISTORY TAB */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Storico Campagne
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCampaignHistory()}
                className="h-8"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Aggiorna
              </Button>
            </div>
            <CardDescription>
              Visualizza le campagne email inviate in precedenza
            </CardDescription>
          </CardHeader>
          <CardContent>
            {campaignHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nessuna campagna inviata</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campagna</TableHead>
                    <TableHead>Oggetto</TableHead>
                    <TableHead>Destinatari</TableHead>
                    <TableHead>Aperture</TableHead>
                    <TableHead>Risposte</TableHead>
                    <TableHead>Risultato</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignHistory.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{campaign.recipient_count}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={campaign.opens_count && campaign.opens_count > 0 ? "text-blue-600 border-blue-200 bg-blue-50" : ""}
                        >
                          <MailOpen className="h-3 w-3 mr-1" />
                          {campaign.opens_count || 0}
                          {campaign.recipient_count > 0 && (
                            <span className="ml-1 text-muted-foreground">
                              ({Math.round((campaign.opens_count || 0) / campaign.recipient_count * 100)}%)
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={campaign.responses_count && campaign.responses_count > 0 ? "text-green-600 border-green-200 bg-green-50" : ""}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          {campaign.responses_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-green-600 text-xs">
                            {campaign.successful_sends}
                          </Badge>
                          {campaign.failed_sends > 0 && (
                            <Badge variant="outline" className="text-red-600 text-xs">
                              {campaign.failed_sends}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {format(new Date(campaign.sent_at), 'dd/MM HH:mm', { locale: it })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendSummary(campaign)}
                            disabled={isSendingSummary}
                            title="Invia riepilogo via email"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaignForResponse(campaign.id);
                              setResponseDialogOpen(true);
                            }}
                            title="Registra risposta"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingCampaignId(campaign.id)}
                            title="Elimina campagna"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* TRACKING TAB */}
      <TabsContent value="tracking">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Email Tracking Dettagliato
              </CardTitle>
              {trackingCampaignId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTrackingData(trackingCampaignId)}
                  disabled={isLoadingTracking}
                  className="h-8"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoadingTracking ? 'animate-spin' : ''}`} />
                  Aggiorna
                </Button>
              )}
            </div>
            <CardDescription>
              Seleziona una campagna per vedere chi ha aperto e chi non ha ancora aperto le email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Campaign Selector */}
              <div>
                <Label>Seleziona Campagna</Label>
                <Select 
                  value={trackingCampaignId || ""} 
                  onValueChange={(value) => fetchTrackingData(value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Scegli una campagna..." />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignHistory.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.campaign_name} - {format(new Date(campaign.sent_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoadingTracking && (
                <div className="flex items-center justify-center py-8">
                  <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {trackingCampaignId && !isLoadingTracking && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Opened */}
                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-green-700">
                          <MailOpen className="h-5 w-5" />
                          Hanno Aperto ({trackingData.opens.length})
                        </CardTitle>
                        {trackingData.opens.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedTrackingOpens.length === trackingData.opens.length && trackingData.opens.length > 0}
                              onCheckedChange={handleSelectAllOpens}
                            />
                            <span className="text-xs text-muted-foreground">Tutti</span>
                          </div>
                        )}
                      </div>
                      {selectedTrackingOpens.length > 0 && (
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => handleSendFollowUpFromTracking('opened')}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Invia Follow-up ({selectedTrackingOpens.length})
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {trackingData.opens.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nessuna apertura registrata
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[400px] overflow-auto">
                          {trackingData.opens.map((open, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center gap-3 p-2 bg-white rounded-md border cursor-pointer transition-colors ${
                                selectedTrackingOpens.includes(open.recipient_email) 
                                  ? 'border-green-500 bg-green-100' 
                                  : 'border-green-100 hover:bg-green-50'
                              }`}
                              onClick={() => handleTrackingOpenSelect(open.recipient_email)}
                            >
                              <Checkbox
                                checked={selectedTrackingOpens.includes(open.recipient_email)}
                                onCheckedChange={() => handleTrackingOpenSelect(open.recipient_email)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{open.recipient_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{open.recipient_email}</p>
                              </div>
                              <Badge variant="outline" className="text-green-600 border-green-200 text-xs shrink-0">
                                {format(new Date(open.opened_at), 'dd/MM HH:mm', { locale: it })}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Not Opened */}
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                          <AlertCircle className="h-5 w-5" />
                          Non Hanno Aperto ({trackingData.notOpened.length})
                        </CardTitle>
                        {trackingData.notOpened.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedTrackingNotOpened.length === trackingData.notOpened.length && trackingData.notOpened.length > 0}
                              onCheckedChange={handleSelectAllNotOpened}
                            />
                            <span className="text-xs text-muted-foreground">Tutti</span>
                          </div>
                        )}
                      </div>
                      {selectedTrackingNotOpened.length > 0 && (
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          variant="secondary"
                          onClick={() => handleSendFollowUpFromTracking('not_opened')}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Invia Reminder ({selectedTrackingNotOpened.length})
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {trackingData.notOpened.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Tutti hanno aperto l'email! 🎉
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[400px] overflow-auto">
                          {trackingData.notOpened.map((recipient, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center gap-3 p-2 bg-white rounded-md border cursor-pointer transition-colors ${
                                selectedTrackingNotOpened.includes(recipient.email) 
                                  ? 'border-orange-500 bg-orange-100' 
                                  : 'border-orange-100 hover:bg-orange-50'
                              }`}
                              onClick={() => handleTrackingNotOpenedSelect(recipient.email)}
                            >
                              <Checkbox
                                checked={selectedTrackingNotOpened.includes(recipient.email)}
                                onCheckedChange={() => handleTrackingNotOpenedSelect(recipient.email)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{recipient.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{recipient.email}</p>
                              </div>
                              <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs shrink-0">
                                Non aperta
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {!trackingCampaignId && !isLoadingTracking && (
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Seleziona una campagna per visualizzare i dati di tracking</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Response Tracking Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Registra Risposta Email
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Registra la risposta e il sistema aggiornerà automaticamente lo status dell'investitore.
            </p>
            <div>
              <Label>Email Investitore</Label>
              <div className="relative mt-2">
                <Input
                  type="email"
                  value={responseInvestorEmail}
                  onChange={(e) => setResponseInvestorEmail(e.target.value)}
                  placeholder="Inizia a digitare per cercare..."
                />
                {responseInvestorEmail.length > 0 && (() => {
                  // Get recipients from selected campaign
                  const campaign = campaignHistory.find(c => c.id === selectedCampaignForResponse);
                  const campaignRecipients = (campaign?.recipients as Array<{ email: string; name: string; company?: string }>) || [];
                  
                  // Also search in all investors (for emails added after campaign was sent)
                  const allInvestorMatches = investors
                    .filter(inv => inv.email && (
                      inv.email.toLowerCase().includes(responseInvestorEmail.toLowerCase()) ||
                      inv.nome.toLowerCase().includes(responseInvestorEmail.toLowerCase())
                    ))
                    .map(inv => ({ email: inv.email!, name: inv.nome, company: inv.azienda }));
                  
                  // Merge campaign recipients with all investors, removing duplicates
                  const seenEmails = new Set<string>();
                  const merged: Array<{ email: string; name: string; company?: string }> = [];
                  
                  // First add campaign recipients (priority)
                  campaignRecipients.forEach(r => {
                    if (r.email.toLowerCase().includes(responseInvestorEmail.toLowerCase()) ||
                        r.name.toLowerCase().includes(responseInvestorEmail.toLowerCase())) {
                      if (!seenEmails.has(r.email.toLowerCase())) {
                        seenEmails.add(r.email.toLowerCase());
                        merged.push(r);
                      }
                    }
                  });
                  
                  // Then add investors with matching email/name not already in list
                  allInvestorMatches.forEach(inv => {
                    if (!seenEmails.has(inv.email.toLowerCase())) {
                      seenEmails.add(inv.email.toLowerCase());
                      merged.push(inv);
                    }
                  });
                  
                  const filtered = merged.slice(0, 8);
                  
                  if (filtered.length > 0 && !filtered.some(r => r.email.toLowerCase() === responseInvestorEmail.toLowerCase())) {
                    return (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-auto">
                        {filtered.map((recipient, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                            onClick={() => setResponseInvestorEmail(recipient.email)}
                          >
                            <div>
                              <div className="text-sm font-medium">{recipient.name}</div>
                              <div className="text-xs text-muted-foreground">{recipient.email}</div>
                            </div>
                            {recipient.company && (
                              <span className="text-xs text-muted-foreground">{recipient.company}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            <div>
              <Label>Tipo di Risposta</Label>
              <Select value={responseType} onValueChange={setResponseType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Seleziona tipo di risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="declined">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Ha declinato → Not Interested
                    </span>
                  </SelectItem>
                  <SelectItem value="interested">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      È interessato → Interested
                    </span>
                  </SelectItem>
                  <SelectItem value="meeting_request">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Richiesta meeting → Meeting Scheduled
                    </span>
                  </SelectItem>
                  <SelectItem value="more_info">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      Chiede più info → Contacted
                    </span>
                  </SelectItem>
                  <SelectItem value="other">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-500" />
                      Altra risposta → Contacted
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note (opzionale)</Label>
              <Textarea
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="Es: Non interessato al momento, ricontattare in futuro..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annulla</Button>
            </DialogClose>
            <Button onClick={handleTrackResponse}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Registra Risposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Confirmation Dialog */}
      <Dialog open={!!deletingCampaignId} onOpenChange={(open) => !open && setDeletingCampaignId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Elimina Campagna
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Sei sicuro di voler eliminare questa campagna? Verranno eliminati anche tutti i dati relativi ad aperture e risposte. Questa azione non può essere annullata.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCampaignId(null)} disabled={isDeleting}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDeleteCampaign} disabled={isDeleting}>
              {isDeleting ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELIVERABILITY TAB */}
      <TabsContent value="deliverability">
        <ABCEmailDeliverability />
      </TabsContent>
    </Tabs>
  );
}
