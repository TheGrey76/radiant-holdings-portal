import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Eye, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("ARIES76 Structured Products - Nuova Opportunità di Investimento");
  const [content, setContent] = useState(`<p>Siamo lieti di presentarvi le ultime opportunità nei <strong>Structured Products</strong> di ARIES76.</p>

<p>I nostri structured products offrono:</p>
<ul>
  <li>Protezione del capitale con potenziale di rendimento</li>
  <li>Diversificazione del portafoglio</li>
  <li>Soluzioni personalizzate per clienti istituzionali</li>
  <li>Trasparenza e conformità regolamentare</li>
</ul>

<p>Per maggiori informazioni sui nostri prodotti strutturati e per discutere opportunità specifiche per i vostri clienti, non esitate a contattarci.</p>

<a href="https://aries76.com/structured-products" class="cta-button">Scopri di più</a>

<p>Cordiali saluti,<br>Il Team ARIES76</p>`);
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

  const handleSendCampaign = async () => {
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
      setContent(`<p>Siamo lieti di presentarvi le ultime opportunità nei <strong>Structured Products</strong> di ARIES76.</p>

<p>I nostri structured products offrono:</p>
<ul>
  <li>Protezione del capitale con potenziale di rendimento</li>
  <li>Diversificazione del portafoglio</li>
  <li>Soluzioni personalizzate per clienti istituzionali</li>
  <li>Trasparenza e conformità regolamentare</li>
</ul>

<p>Per maggiori informazioni sui nostri prodotti strutturati e per discutere opportunità specifiche per i vostri clienti, non esitate a contattarci.</p>

<a href="https://aries76.com/structured-products" class="cta-button">Scopri di più</a>

<p>Cordiali saluti,<br>Il Team ARIES76</p>`);
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

            <div className="flex gap-2">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Nascondi" : "Anteprima"}
              </Button>
              <Button
                onClick={handleSendCampaign}
                disabled={loading}
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
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
            <CardContent>
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <div className="bg-gradient-to-r from-[#0f1729] to-[#1a2744] text-white p-8 text-center rounded-t-lg">
                  <h1 className="text-2xl font-bold">ARIES76 Structured Products</h1>
                </div>
                <div className="p-8 bg-gray-50">
                  <p className="mb-4"><strong>Oggetto:</strong> {subject}</p>
                  <hr className="my-4" />
                  <p className="mb-4">Gentile [Nome Adviser],</p>
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div className="p-6 text-center text-sm text-gray-600 bg-gray-100 rounded-b-lg">
                  <p>ARIES76 Capital Advisory<br />
                  London, United Kingdom<br />
                  <a href="https://aries76.com" className="text-blue-600">www.aries76.com</a></p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
