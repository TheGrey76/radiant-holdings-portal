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
  Save, FileText, History, Trash2, Plus, Eye 
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
}

interface ABCEmailCampaignManagerProps {
  investors: Investor[];
}

export function ABCEmailCampaignManager({ investors }: ABCEmailCampaignManagerProps) {
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isSending, setIsSending] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaignHistory, setCampaignHistory] = useState<CampaignHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const { toast } = useToast();

  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
    campaignName: "",
  });

  const currentUserEmail = sessionStorage.getItem('abc_authorized_email') || 'admin@aries76.com';

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
      setCampaignHistory(data);
    }
  };

  // Get unique categories
  const categories = [...new Set(investors.map(i => i.categoria))];
  const statuses = ['To Contact', 'Contacted', 'Interested', 'Meeting Scheduled', 'In Negotiation', 'Closed'];

  // Filter investors based on criteria
  const filteredInvestors = investors.filter(inv => {
    if (!inv.email) return false;
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (filterCategory !== "all" && inv.categoria !== filterCategory) return false;
    return true;
  });

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

  // Replace placeholders with actual values
  const replacePlaceholders = (text: string, investor: Investor): string => {
    return text
      .replace(/\{nome\}/g, investor.nome || '')
      .replace(/\{azienda\}/g, investor.azienda || '')
      .replace(/\{ruolo\}/g, investor.ruolo || '')
      .replace(/\{citta\}/g, investor.citta || '')
      .replace(/\{categoria\}/g, investor.categoria || '')
      .replace(/\{email\}/g, investor.email || '');
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
      const previewSubject = replacePlaceholders(emailForm.subject, firstInvestor);
      const previewBody = replacePlaceholders(emailForm.content, firstInvestor);
      setPreviewContent(`**Oggetto:** ${previewSubject}\n\n---\n\n${previewBody}`);
    } else {
      toast({
        title: "Investitore non trovato",
        description: "Seleziona un investitore dalla lista",
        variant: "destructive",
      });
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

      // Call edge function to send emails
      const { data, error } = await supabase.functions.invoke('send-abc-campaign', {
        body: {
          recipients: selectedRecipients,
          subject: emailForm.subject,
          content: emailForm.content,
          senderEmail: currentUserEmail,
        },
      });

      if (error) throw error;

      const successCount = data?.successful || selectedRecipients.length;
      const failCount = data?.failed || 0;

      // Log campaign to history
      await supabase.from('abc_email_campaign_history').insert({
        campaign_name: emailForm.campaignName || `Campagna ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        subject: emailForm.subject,
        content: emailForm.content,
        recipient_count: selectedRecipients.length,
        successful_sends: successCount,
        failed_sends: failCount,
        filter_status: filterStatus !== 'all' ? filterStatus : null,
        filter_category: filterCategory !== 'all' ? filterCategory : null,
        sent_by: currentUserEmail,
        recipients: selectedRecipients.map(r => ({ email: r.email, name: r.name, company: r.company })),
      });

      toast({
        title: "Campagna inviata",
        description: `Email inviata a ${successCount} investitori${failCount > 0 ? `, ${failCount} fallite` : ''}`,
      });

      // Log activity for each investor
      for (const investor of selectedRecipients) {
        await supabase.from('abc_investor_activities').insert({
          investor_name: `${investor.name} - ${investor.company}`,
          activity_type: 'Email Campaign',
          activity_description: `Campagna email: ${emailForm.subject}`,
          created_by: currentUserEmail,
        });
      }

      // Reset form
      setEmailForm({ subject: "", content: "", campaignName: "" });
      setSelectedInvestors([]);
      fetchCampaignHistory();

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
                  <Label htmlFor="content">Contenuto</Label>
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
                    <Badge variant="outline" className="text-xs">{'{nome}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{azienda}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{ruolo}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{citta}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{categoria}'}</Badge>
                    <Badge variant="outline" className="text-xs">{'{email}'}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Anteprima
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
                    <span>Anteprima Email</span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewContent(null)}>
                      Chiudi
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
                    {previewContent}
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
                    Destinatari
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

                  <div className="max-h-[400px] overflow-y-auto space-y-1">
                    {filteredInvestors.length === 0 ? (
                      <div className="text-center py-4">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Nessun investitore con email</p>
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
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Storico Campagne
            </CardTitle>
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
                    <TableHead>Risultato</TableHead>
                    <TableHead>Inviata da</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignHistory.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{campaign.recipient_count}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">
                            {campaign.successful_sends} OK
                          </Badge>
                          {campaign.failed_sends > 0 && (
                            <Badge variant="outline" className="text-red-600">
                              {campaign.failed_sends} fallite
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{campaign.sent_by}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(campaign.sent_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
