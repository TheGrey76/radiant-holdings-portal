import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Eye, History, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmailCampaignTabProps {
  regions: string[];
  intermediaries: string[];
  adviserCount: number;
  filteredCount: number;
}

interface Campaign {
  id: string;
  created_at: string;
  sent_at: string | null;
  campaign_name: string;
  subject: string;
  content: string;
  recipient_count: number;
  successful_sends: number;
  failed_sends: number;
  status: string;
  filter_region: string | null;
  filter_intermediary: string | null;
}

export default function EmailCampaignTab({ 
  regions, 
  intermediaries, 
  adviserCount, 
  filteredCount 
}: EmailCampaignTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("ARIES76 Structured Products - Nuova Opportunità di Investimento");
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [content, setContent] = useState(`<div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 48px 32px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; font-size: 28px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.2;">Structured Products ARIES76</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; line-height: 1.5;">Soluzioni di investimento innovative per i vostri clienti</p>
  </div>
  
  <div style="background: white; padding: 40px 32px;">
    
    <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      In un contesto di mercato in continua evoluzione, i nostri Structured Products rappresentano la soluzione ideale per offrire strumenti di investimento sofisticati, trasparenti e personalizzabili.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 32px 0;">
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">🛡️</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Protezione Garantita</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Capitale protetto con rendimenti potenziali superiori</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">📊</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Diversificazione</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Accesso a strategie multi-asset e geografiche</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">⚙️</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Su Misura</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Soluzioni personalizzate per ogni profilo di rischio</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">✓</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Trasparenza</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Conformità regolamentare e reporting dettagliato</p>
      </div>
    </div>
    
    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 32px 0 16px 0;">Le nostre soluzioni</h2>
    
    <ul style="margin: 0 0 32px 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
      <li style="margin-bottom: 8px;"><strong>Capital Protected Notes</strong> — Protezione del capitale al 100% con partecipazione ai mercati azionari</li>
      <li style="margin-bottom: 8px;"><strong>Yield Enhancement</strong> — Ottimizzazione del rendimento attraverso strategie opzionali avanzate</li>
      <li style="margin-bottom: 8px;"><strong>Participation Products</strong> — Esposizione diretta a indici e basket personalizzati</li>
      <li style="margin-bottom: 8px;"><strong>Multi-Asset Solutions</strong> — Combinazioni sofisticate di asset class diverse</li>
    </ul>
    
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 32px; border-radius: 8px; margin: 32px 0; text-align: center;">
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">€2.5B+</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">AUM Gestito</div>
        </div>
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">150+</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Prodotti Attivi</div>
        </div>
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">98%</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Client Satisfaction</div>
        </div>
      </div>
    </div>
    
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 24px 0;">
      I nostri Structured Products sono progettati in collaborazione con i principali emittenti internazionali e offrono strutture certificate quotate su mercati regolamentati, due diligence istituzionale, supporto continuo e materiale marketing professionale.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://aries76.com/contact" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">Richiedi Informazioni</a>
    </div>
    
    <div style="background: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 32px;">
      <p style="color: #1f2937; font-weight: 600; margin: 0 0 12px 0;">Il nostro team è a vostra disposizione per:</p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.7;">
        <li>Presentazioni personalizzate per i vostri team</li>
        <li>Analisi di soluzioni su misura per portafogli specifici</li>
        <li>Supporto nella strutturazione di prodotti dedicati</li>
        <li>Formazione continua sulle ultime innovazioni del mercato</li>
      </ul>
    </div>
    
  </div>
  
  <div style="background: #1f2937; padding: 24px 32px; text-align: center; border-radius: 0 0 8px 8px;">
    <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2025 ARIES76. Tutti i diritti riservati.</p>
  </div>
  
</div>`);
  const [regionFilter, setRegionFilter] = useState("all");
  const [intermediaryFilter, setIntermediaryFilter] = useState("all");

  useEffect(() => {
    if (showHistory) {
      fetchCampaigns();
    }
  }, [showHistory]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare lo storico campagne",
        variant: "destructive",
      });
    }
  };

  const getRecipientCount = () => {
    if (regionFilter === "all" && intermediaryFilter === "all") {
      return adviserCount;
    }
    return filteredCount;
  };

  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Email Mancante",
        description: "Inserisci un indirizzo email per il test",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      toast({
        title: "Email Non Valida",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Campi Mancanti",
        description: "Compila oggetto e contenuto prima di inviare il test",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingTest(true);
      console.log("Sending test email to:", testEmail);

      const { data, error } = await supabase.functions.invoke("send-test-email", {
        body: {
          testEmail: testEmail,
          subject: subject,
          content: content,
        },
      });

      if (error) throw error;

      toast({
        title: "Email di Test Inviata!",
        description: `Email di test inviata con successo a ${testEmail}`,
      });
    } catch (error: any) {
      console.error("Error sending test email:", error);
      toast({
        title: "Errore Invio Test",
        description: error.message || "Impossibile inviare l'email di test",
        variant: "destructive",
      });
    } finally {
      setSendingTest(false);
    }
  };


  const confirmAndSendCampaign = () => {
    if (!campaignName.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Campi Mancanti",
        description: "Compila tutti i campi richiesti",
        variant: "destructive",
      });
      return;
    }

    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      toast({
        title: "Nessun Destinatario",
        description: "I filtri selezionati non corrispondono a nessun adviser",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleSendCampaign = async () => {
    setShowConfirmDialog(false);

    try {
      setLoading(true);

      // Create campaign record
      const { data: campaignData, error: campaignError } = await supabase
        .from("email_campaigns")
        .insert({
          campaign_name: campaignName,
          subject: subject,
          content: content,
          filter_region: regionFilter !== "all" ? regionFilter : null,
          filter_intermediary: intermediaryFilter !== "all" ? intermediaryFilter : null,
          status: "draft",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Call edge function to send emails
      const { data, error } = await supabase.functions.invoke("send-adviser-campaign", {
        body: {
          campaignId: campaignData.id,
          subject: subject,
          content: content,
          regionFilter: regionFilter,
          intermediaryFilter: intermediaryFilter,
        },
      });

      if (error) throw error;

      toast({
        title: "Campagna Inviata!",
        description: `Email inviate con successo a ${data.successful} advisers (${data.failed} fallite)`,
      });

      // Reset form
      setCampaignName("");
      setContent(`<div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 48px 32px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; font-size: 28px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.2;">Structured Products ARIES76</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; line-height: 1.5;">Soluzioni di investimento innovative per i vostri clienti</p>
  </div>
  
  <div style="background: white; padding: 40px 32px;">
    
    <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      In un contesto di mercato in continua evoluzione, i nostri Structured Products rappresentano la soluzione ideale per offrire strumenti di investimento sofisticati, trasparenti e personalizzabili.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 32px 0;">
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">🛡️</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Protezione Garantita</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Capitale protetto con rendimenti potenziali superiori</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">📊</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Diversificazione</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Accesso a strategie multi-asset e geografiche</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">⚙️</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Su Misura</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Soluzioni personalizzate per ogni profilo di rischio</p>
      </div>
      
      <div style="padding: 24px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
        <div style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">✓</div>
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Trasparenza</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Conformità regolamentare e reporting dettagliato</p>
      </div>
    </div>
    
    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 32px 0 16px 0;">Le nostre soluzioni</h2>
    
    <ul style="margin: 0 0 32px 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
      <li style="margin-bottom: 8px;"><strong>Capital Protected Notes</strong> — Protezione del capitale al 100% con partecipazione ai mercati azionari</li>
      <li style="margin-bottom: 8px;"><strong>Yield Enhancement</strong> — Ottimizzazione del rendimento attraverso strategie opzionali avanzate</li>
      <li style="margin-bottom: 8px;"><strong>Participation Products</strong> — Esposizione diretta a indici e basket personalizzati</li>
      <li style="margin-bottom: 8px;"><strong>Multi-Asset Solutions</strong> — Combinazioni sofisticate di asset class diverse</li>
    </ul>
    
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 32px; border-radius: 8px; margin: 32px 0; text-align: center;">
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">€2.5B+</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">AUM Gestito</div>
        </div>
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">150+</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Prodotti Attivi</div>
        </div>
        <div>
          <div style="color: #1e40af; font-size: 32px; font-weight: 700; margin-bottom: 4px;">98%</div>
          <div style="color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Client Satisfaction</div>
        </div>
      </div>
    </div>
    
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 24px 0;">
      I nostri Structured Products sono progettati in collaborazione con i principali emittenti internazionali e offrono strutture certificate quotate su mercati regolamentati, due diligence istituzionale, supporto continuo e materiale marketing professionale.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://aries76.com/contact" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">Richiedi Informazioni</a>
    </div>
    
    <div style="background: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 32px;">
      <p style="color: #1f2937; font-weight: 600; margin: 0 0 12px 0;">Il nostro team è a vostra disposizione per:</p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.7;">
        <li>Presentazioni personalizzate per i vostri team</li>
        <li>Analisi di soluzioni su misura per portafogli specifici</li>
        <li>Supporto nella strutturazione di prodotti dedicati</li>
        <li>Formazione continua sulle ultime innovazioni del mercato</li>
      </ul>
    </div>
    
  </div>
  
  <div style="background: #1f2937; padding: 24px 32px; text-align: center; border-radius: 0 0 8px 8px;">
    <p style="color: #9ca3af; font-size: 13px; margin: 0;">© 2025 ARIES76. Tutti i diritti riservati.</p>
  </div>
  
</div>`);
      setRegionFilter("all");
      setIntermediaryFilter("all");
      setPreviewMode(false);
    } catch (error: any) {
      console.error("Error sending campaign:", error);
      toast({
        title: "Errore Invio",
        description: error.message || "Impossibile inviare la campagna",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showHistory) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-light text-white">Storico Campagne Email</h2>
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <Mail className="h-4 w-4 mr-2" />
            Nuova Campagna
          </Button>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Nome Campagna</TableHead>
                    <TableHead className="text-white/70">Oggetto</TableHead>
                    <TableHead className="text-white/70">Data Invio</TableHead>
                    <TableHead className="text-white/70">Destinatari</TableHead>
                    <TableHead className="text-white/70">Inviate</TableHead>
                    <TableHead className="text-white/70">Fallite</TableHead>
                    <TableHead className="text-white/70">Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{campaign.campaign_name}</TableCell>
                      <TableCell className="text-white">{campaign.subject}</TableCell>
                      <TableCell className="text-white">
                        {campaign.sent_at 
                          ? new Date(campaign.sent_at).toLocaleDateString('it-IT')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-white">{campaign.recipient_count}</TableCell>
                      <TableCell className="text-white">{campaign.successful_sends}</TableCell>
                      <TableCell className="text-white">{campaign.failed_sends}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            campaign.status === "sent" 
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : campaign.status === "sending"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-white">Crea Nuova Campagna Email</h2>
        <Button
          onClick={() => setShowHistory(true)}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <History className="h-4 w-4 mr-2" />
          Storico
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Dettagli Campagna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Nome Campagna *</label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Es: Structured Products Q1 2025"
                className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Oggetto Email *</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Oggetto dell'email"
                className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Contenuto Email (HTML) *</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenuto HTML dell'email"
                rows={10}
                className="bg-white/10 text-white border-white/20 placeholder:text-white/50 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Filtra per Regione</label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Tutte" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1729] border-white/20">
                    <SelectItem value="all" className="text-white">Tutte le Regioni</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region} className="text-white">{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Filtra per Intermediario</label>
                <Select value={intermediaryFilter} onValueChange={setIntermediaryFilter}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Tutti" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1729] border-white/20">
                    <SelectItem value="all" className="text-white">Tutti gli Intermediari</SelectItem>
                    {intermediaries.map(intermediary => (
                      <SelectItem key={intermediary} value={intermediary} className="text-white">{intermediary}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Destinatari: {getRecipientCount()}</strong> advisers riceveranno questa email
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Email di Test</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@esempio.com"
                    className="flex-1 bg-white/10 text-white border-white/20 placeholder:text-white/50"
                  />
                  <Button
                    onClick={handleSendTest}
                    disabled={sendingTest}
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {sendingTest ? "Invio..." : "Invia Test"}
                  </Button>
                </div>
                <p className="text-xs text-white/50 mt-2">Invia un'email di prova prima dell'invio massivo</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Nascondi" : "Anteprima"}
              </Button>
              <Button
                onClick={confirmAndSendCampaign}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Invio in corso..." : "Invia Campagna"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {previewMode && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Anteprima Email</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] rounded-lg overflow-hidden shadow-2xl border border-blue-500/20">
                <div className="bg-gradient-to-r from-[#0f1729] via-[#1a2744] to-[#2d3f5f] text-white p-12 text-center border-b-2 border-blue-500/30">
                  <h1 className="text-5xl font-light tracking-[0.5em] mb-2" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>ARIES76</h1>
                  <p className="text-sm text-gray-300 tracking-[0.2em] uppercase font-light">Capital Advisory</p>
                </div>
                <div className="p-10" style={{ background: 'rgba(26, 39, 68, 0.4)' }}>
                  <p className="text-lg font-normal text-white mb-6">Gentile [Nome Adviser],</p>
                  <div 
                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none email-preview-content"
                    dangerouslySetInnerHTML={{ __html: content }} 
                  />
                  <div className="mt-10 pt-8 border-t border-blue-500/20">
                    <p className="font-semibold text-white mb-1">Il Team ARIES76</p>
                    <p className="text-sm text-gray-400">Capital Advisory - Structured Products Division</p>
                  </div>
                </div>
                <div className="bg-[#0f1729]/95 p-10 text-center border-t border-blue-500/20">
                  <p className="text-white font-semibold mb-1 text-base">ARIES76 Capital Advisory</p>
                  <p className="text-gray-400 mb-4">London, United Kingdom</p>
                  <div className="space-x-3 mb-6">
                    <a href="https://aries76.com" className="text-blue-400 hover:text-blue-300 font-medium">Website</a>
                    <span className="text-gray-600">•</span>
                    <a href="https://aries76.com/structured-products" className="text-blue-400 hover:text-blue-300 font-medium">Structured Products</a>
                    <span className="text-gray-600">•</span>
                    <a href="https://aries76.com/contact" className="text-blue-400 hover:text-blue-300 font-medium">Contattaci</a>
                  </div>
                  <div className="border-t border-blue-500/15 pt-5 mt-5">
                    <a href="mailto:info@aries76.com" className="text-blue-400 hover:text-blue-300 text-sm">info@aries76.com</a>
                    <p className="text-xs text-gray-500 mt-3">&copy; 2025 ARIES76. Tutti i diritti riservati.</p>
                  </div>
                </div>
              </div>
              <style>{`
                .email-preview-content .feature-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 15px;
                  margin: 25px 0;
                }
                .email-preview-content .feature-card {
                  background: rgba(59, 130, 246, 0.08);
                  border: 1px solid rgba(59, 130, 246, 0.2);
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                }
                .email-preview-content .feature-icon {
                  font-size: 40px;
                  margin-bottom: 12px;
                  color: #60a5fa;
                  font-weight: 300;
                  line-height: 1;
                }
                .email-preview-content .feature-title {
                  color: #60a5fa;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 8px;
                }
                .email-preview-content .feature-desc {
                  color: #94a3b8;
                  font-size: 12px;
                }
                .email-preview-content .stats-container {
                  display: flex;
                  justify-content: space-around;
                  margin: 30px 0;
                  padding: 25px;
                  background: rgba(15, 23, 41, 0.6);
                  border-radius: 8px;
                  border: 1px solid rgba(59, 130, 246, 0.15);
                }
                .email-preview-content .stat-number {
                  font-size: 28px;
                  font-weight: 700;
                  color: #60a5fa;
                }
                .email-preview-content .stat-label {
                  font-size: 11px;
                  color: #94a3b8;
                  text-transform: uppercase;
                }
                .email-preview-content .highlight-box {
                  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
                  border-left: 4px solid #3b82f6;
                  padding: 25px;
                  margin: 25px 0;
                  border-radius: 6px;
                }
                .email-preview-content .cta-primary {
                  display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  color: #ffffff !important;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  margin: 0 auto;
                  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-size: 14px;
                }
                .email-preview-content ul {
                  list-style: none;
                  padding-left: 0;
                }
                .email-preview-content li {
                  padding-left: 30px;
                  position: relative;
                  margin-bottom: 12px;
                }
                .email-preview-content li:before {
                  content: "◆";
                  position: absolute;
                  left: 0;
                  color: #3b82f6;
                  font-size: 12px;
                }
              `}</style>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-[#0f1729] to-[#1a2744] border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white text-xl">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Conferma Invio Campagna
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 space-y-3 pt-2">
              <p className="text-base">Stai per inviare questa campagna email a:</p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
                <p className="text-white font-semibold text-lg">{getRecipientCount()} advisers finanziari</p>
                {regionFilter !== "all" && (
                  <p className="text-sm text-gray-400">Regione: <span className="text-white">{regionFilter}</span></p>
                )}
                {intermediaryFilter !== "all" && (
                  <p className="text-sm text-gray-400">Intermediario: <span className="text-white">{intermediaryFilter}</span></p>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p><strong className="text-white">Oggetto:</strong> <span className="text-gray-400">{subject}</span></p>
                <p><strong className="text-white">Campagna:</strong> <span className="text-gray-400">{campaignName}</span></p>
              </div>
              <p className="text-yellow-300 font-medium pt-2">
                ⚠️ Questa azione non può essere annullata. Sei sicuro di voler procedere?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSendCampaign}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Conferma e Invia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
