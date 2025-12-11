import { useState, useEffect } from "react";
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
import { 
  Mail, Send, Users, Filter, CheckCircle, Clock, AlertCircle, 
  Save, FileText, History, Trash2, Plus, Eye, AlertTriangle, Edit2,
  Paperclip, X, MailOpen, RefreshCw, Sparkles, MessageSquare, Reply
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

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

interface ABCEmailCampaignManagerProps {
  investors: Investor[];
  onInvestorsUpdated?: () => void;
}

interface Attachment {
  name: string;
  content: string; // base64
  type: string;
}

type EmailType = 'first_contact' | 'follow_up' | 'meeting_request' | 'proposal' | 'custom';

export function ABCEmailCampaignManager({ investors, onInvestorsUpdated }: ABCEmailCampaignManagerProps) {
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaignHistory, setCampaignHistory] = useState<CampaignHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
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
  
  const TEST_EMAIL = "egrigione@gmail.com";
  const { toast } = useToast();

  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
    campaignName: "",
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

  // Fetch templates and history on mount
  useEffect(() => {
    fetchTemplates();
    fetchCampaignHistory();
  }, []);

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

  // Get unique categories from approved investors
  const categories = [...new Set(approvedInvestors.map(i => i.categoria))];
  const statuses = ['To Contact', 'Contacted', 'Interested', 'Meeting Scheduled', 'In Negotiation', 'Closed'];

  // Filter approved investors with email based on criteria
  const filteredInvestors = approvedWithEmail.filter(inv => {
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (filterCategory !== "all" && inv.categoria !== filterCategory) return false;
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
      const investor = investors.find(i => i.email === responseInvestorEmail);

      const { error } = await supabase.from('abc_email_responses').insert({
        campaign_id: selectedCampaignForResponse,
        investor_id: investor?.id,
        investor_email: responseInvestorEmail,
        investor_name: investor?.nome,
        response_type: 'reply',
        notes: responseNote,
      });

      if (error) throw error;

      toast({
        title: "Risposta registrata",
        description: "La risposta è stata tracciata con successo",
      });

      setResponseDialogOpen(false);
      setSelectedCampaignForResponse(null);
      setResponseInvestorEmail("");
      setResponseNote("");
      
      // Refresh campaign history
      fetchCampaignHistory();
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
    const personalizedContent = replacePlaceholders(emailForm.content, investor);
    const personalizedSubject = replacePlaceholders(emailForm.subject, investor);
    
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

  // Preview email for first selected investor
  const handlePreview = () => {
    if (!emailForm.content) {
      toast({
        title: "Contenuto mancante",
        description: "Scrivi il contenuto dell'email prima di vedere l'anteprima",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedInvestors.length === 0) {
      toast({
        title: "Seleziona un investitore",
        description: "Seleziona almeno un investitore per vedere l'anteprima",
        variant: "destructive",
      });
      return;
    }
    
    // Find investor from all investors (not just filtered)
    const firstInvestor = investors.find(i => selectedInvestors.includes(i.id));
    
    if (firstInvestor) {
      const htmlContent = generateEmailHtml(firstInvestor);
      setPreviewContent(htmlContent);
    } else {
      toast({
        title: "Investitore non trovato",
        description: "Seleziona un investitore dalla lista",
        variant: "destructive",
      });
    }
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
          content: emailForm.content,
          senderEmail: currentUserEmail,
          attachments: attachments,
          campaignId: campaignId,
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
          // Pre-process content with placeholders replaced
          personalizedContent: replacePlaceholders(emailForm.content, i),
          personalizedSubject: replacePlaceholders(emailForm.subject, i),
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
          content: emailForm.content,
          senderEmail: currentUserEmail,
          attachments: attachments,
          campaignId: campaignId,
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
      setEmailForm({ subject: "", content: "", campaignName: "" });
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

  return (
    <Tabs defaultValue="compose" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="compose" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Componi
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Template ({templates.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Storico ({campaignHistory.length})
        </TabsTrigger>
      </TabsList>

      {/* COMPOSE TAB */}
      <TabsContent value="compose">
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-muted-foreground mr-2">Merge tags:</span>
                    <Badge variant="outline" className="text-xs">{'{nome}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{azienda}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{ruolo}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{citta}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{categoria}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{email}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{pipeline_value}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{last_contact}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{engagement_score}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{linkedin}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{fonte}'}</Badge>
                    <Badge variant="outline" className="text-xs bg-primary/5">{'{status}'}</Badge>
                  </div>
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
                    onClick={handlePreview}
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
            {previewContent && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Anteprima Email Reale
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewContent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
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
            )}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Destinatari Approved
                  </span>
                  <Badge variant="secondary">{filteredInvestors.length}</Badge>
                </CardTitle>
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
                      filteredInvestors.map(investor => (
                        <label 
                          key={investor.id} 
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                        >
                          <Checkbox 
                            checked={selectedInvestors.includes(investor.id)}
                            onCheckedChange={() => handleSelectInvestor(investor.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{investor.nome}</p>
                            <p className="text-xs text-muted-foreground truncate">{investor.azienda}</p>
                          </div>
                          {selectedInvestors.includes(investor.id) && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </label>
                      ))
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
              Registra quando un investitore risponde a una campagna email per tracciare l'engagement.
            </p>
            <div>
              <Label>Email Investitore</Label>
              <Input
                type="email"
                value={responseInvestorEmail}
                onChange={(e) => setResponseInvestorEmail(e.target.value)}
                placeholder="investitore@azienda.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Note (opzionale)</Label>
              <Textarea
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="Es: Interessato, chiede meeting settimana prossima..."
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
    </Tabs>
  );
}
