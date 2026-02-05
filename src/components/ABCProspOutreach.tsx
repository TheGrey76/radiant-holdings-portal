import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Linkedin, Send, Settings, Users, CheckCircle, AlertCircle, Loader2, ExternalLink, ArrowDownUp, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  linkedin?: string;
  email?: string;
}

interface ABCProspOutreachProps {
  investors: Investor[];
  onRefresh?: () => void;
}

interface ProspSettings {
  campaignId: string;
  listId: string;
}

interface ProspCampaign {
  campaign_id: string;
  campaign_name: string;
}

interface SyncStats {
  total: number;
  new: number;
  updated: number;
  skipped: number;
}

interface ProspAnalytics {
  connection_requests: number;
  connections_accepted: number;
  messages_sent: number;
  replies: number;
}

export const ABCProspOutreach: React.FC<ABCProspOutreachProps> = ({ investors, onRefresh }) => {
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<ProspSettings>({
    campaignId: '',
    listId: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  
  // Sync state
  const [prospCampaigns, setProspCampaigns] = useState<ProspCampaign[]>([]);
  const [selectedSyncCampaign, setSelectedSyncCampaign] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [prospAnalytics, setProspAnalytics] = useState<ProspAnalytics | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Filter investors with LinkedIn URLs
  const investorsWithLinkedIn = investors.filter(inv => inv.linkedin && inv.linkedin.trim() !== '');

  // Fetch Prosp campaigns
  const fetchProspCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const { data, error } = await supabase.functions.invoke('prosp-sync', {
        body: { action: 'list-campaigns' },
      });

      if (error) throw error;
      
      if (data.campaigns) {
        setProspCampaigns(data.campaigns);
        if (data.campaigns.length > 0 && !selectedSyncCampaign) {
          setSelectedSyncCampaign(data.campaigns[0].campaign_id);
        }
        toast({
          title: "Campagne caricate",
          description: `Trovate ${data.campaigns.length} campagne su Prosp.ai`,
        });
      }
    } catch (error) {
      console.error('Error fetching Prosp campaigns:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le campagne da Prosp.ai",
        variant: "destructive",
      });
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Sync leads from Prosp
  const syncFromProsp = async () => {
    if (!selectedSyncCampaign) {
      toast({
        title: "Seleziona campagna",
        description: "Scegli una campagna da cui importare",
        variant: "destructive",
      });
      return;
    }

    try {
      setSyncing(true);
      setSyncStats(null);
      
      const { data, error } = await supabase.functions.invoke('prosp-sync', {
        body: { action: 'sync-from-prosp', campaignId: selectedSyncCampaign },
      });

      if (error) throw error;
      
      setSyncStats(data.stats);
      toast({
        title: "Sincronizzazione completata",
        description: `${data.stats.new} nuovi, ${data.stats.updated} aggiornati`,
      });
      
      // Refresh investors list
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error syncing from Prosp:', error);
      toast({
        title: "Errore sincronizzazione",
        description: "Impossibile sincronizzare i lead da Prosp.ai",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  // Fetch analytics when campaign changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedSyncCampaign) return;

      try {
        const { data, error } = await supabase.functions.invoke('prosp-sync', {
          body: { action: 'get-analytics', campaignId: selectedSyncCampaign },
        });

        if (!error && data.analytics) {
          setProspAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [selectedSyncCampaign]);

  const toggleInvestor = (id: string) => {
    const newSelected = new Set(selectedInvestors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInvestors(newSelected);
  };

  const selectAll = () => {
    if (selectedInvestors.size === investorsWithLinkedIn.length) {
      setSelectedInvestors(new Set());
    } else {
      setSelectedInvestors(new Set(investorsWithLinkedIn.map(inv => inv.id)));
    }
  };

  const sendToProsp = async () => {
    if (!settings.campaignId || !settings.listId) {
      toast({
        title: "Configurazione mancante",
        description: "Configura Campaign ID e List ID nelle impostazioni",
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }

    if (selectedInvestors.size === 0) {
      toast({
        title: "Nessun investitore selezionato",
        description: "Seleziona almeno un investitore da inviare a Prosp.ai",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    let success = 0;
    let failed = 0;

    const selectedList = investorsWithLinkedIn.filter(inv => selectedInvestors.has(inv.id));

    for (const investor of selectedList) {
      try {
        const { data, error } = await supabase.functions.invoke('prosp-add-lead', {
          body: {
            investorId: investor.id,
            linkedinUrl: investor.linkedin,
            campaignId: settings.campaignId,
            listId: settings.listId,
            investorName: investor.nome,
            investorEmail: investor.email,
            investorCompany: investor.azienda,
          },
        });

        if (error) {
          console.error(`Error sending ${investor.nome}:`, error);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error(`Error sending ${investor.nome}:`, err);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setSendResults({ success, failed });
    setIsSending(false);
    setSelectedInvestors(new Set());

    toast({
      title: "Invio completato",
      description: `${success} investitori aggiunti a Prosp.ai${failed > 0 ? `, ${failed} falliti` : ''}`,
      variant: failed > 0 ? "destructive" : "default",
    });
  };

  const isConfigured = settings.campaignId && settings.listId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Linkedin className="h-6 w-6 text-[#0077B5]" />
            Prosp.ai Integration
          </h2>
          <p className="text-muted-foreground">
            Sincronizza e gestisci lead tra ABC Console e Prosp.ai
          </p>
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Impostazioni
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Impostazioni Prosp.ai</DialogTitle>
              <DialogDescription>
                Configura i parametri della campagna Prosp.ai
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaignId">Campaign ID</Label>
                <Input
                  id="campaignId"
                  placeholder="es. abc123..."
                  value={settings.campaignId}
                  onChange={(e) => setSettings({ ...settings, campaignId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Trova l'ID della campagna su Prosp.ai → Campaigns
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="listId">List ID</Label>
                <Input
                  id="listId"
                  placeholder="es. xyz789..."
                  value={settings.listId}
                  onChange={(e) => setSettings({ ...settings, listId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Trova l'ID della lista su Prosp.ai → Lists
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSettingsOpen(false)}>Salva</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4" />
            Sincronizza da Prosp
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Invia a Prosp
          </TabsTrigger>
        </TabsList>

        {/* SYNC TAB */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Importa Lead da Prosp.ai
              </CardTitle>
              <CardDescription>
                Sincronizza i lead dalle tue campagne Prosp.ai nella Console ABC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Campagna Prosp.ai</Label>
                  <Select value={selectedSyncCampaign} onValueChange={setSelectedSyncCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder={prospCampaigns.length === 0 ? "Clicca 'Carica Campagne' per iniziare" : "Seleziona campagna"} />
                    </SelectTrigger>
                    <SelectContent>
                      {prospCampaigns.map(c => (
                        <SelectItem key={c.campaign_id} value={c.campaign_id}>
                          {c.campaign_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchProspCampaigns}
                  disabled={loadingCampaigns}
                >
                  {loadingCampaigns ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Carica Campagne</span>
                </Button>
                <Button 
                  onClick={syncFromProsp}
                  disabled={!selectedSyncCampaign || syncing}
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {syncing ? 'Sincronizzazione...' : 'Importa Lead'}
                </Button>
              </div>

              {/* Sync Results */}
              {syncStats && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700">Sincronizzazione Completata</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Totale Lead</p>
                      <p className="text-xl font-bold">{syncStats.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nuovi</p>
                      <p className="text-xl font-bold text-green-600">{syncStats.new}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Aggiornati</p>
                      <p className="text-xl font-bold text-blue-600">{syncStats.updated}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Già Presenti</p>
                      <p className="text-xl font-bold text-muted-foreground">{syncStats.skipped}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics */}
              {prospAnalytics && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Analytics Campagna (ultimi 30 giorni)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Richieste Connessione</p>
                      <p className="text-xl font-bold">{prospAnalytics.connection_requests}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accettate</p>
                      <p className="text-xl font-bold text-green-600">{prospAnalytics.connections_accepted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Messaggi Inviati</p>
                      <p className="text-xl font-bold text-blue-600">{prospAnalytics.messages_sent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risposte</p>
                      <p className="text-xl font-bold text-emerald-600">{prospAnalytics.replies}</p>
                    </div>
                  </div>
                  {prospAnalytics.connection_requests > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Tasso accettazione: {((prospAnalytics.connections_accepted / prospAnalytics.connection_requests) * 100).toFixed(1)}%
                      {prospAnalytics.messages_sent > 0 && (
                        <> • Tasso risposta: {((prospAnalytics.replies / prospAnalytics.messages_sent) * 100).toFixed(1)}%</>
                      )}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEND TAB */}
        <TabsContent value="send" className="space-y-4">
          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Con LinkedIn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investorsWithLinkedIn.length}</div>
                <p className="text-xs text-muted-foreground">
                  su {investors.length} totali
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Selezionati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedInvestors.size}</div>
                <p className="text-xs text-muted-foreground">
                  pronti per l'invio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inviati OK</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{sendResults.success}</div>
                <p className="text-xs text-muted-foreground">
                  ultima sessione
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Configurazione</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {isConfigured ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600">Attiva</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm text-amber-500">Da configurare</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investor Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Seleziona Investitori
                  </CardTitle>
                  <CardDescription>
                    Scegli gli investitori da aggiungere alla campagna Prosp.ai
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedInvestors.size === investorsWithLinkedIn.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                  </Button>
                  <Button 
                    onClick={sendToProsp} 
                    disabled={isSending || selectedInvestors.size === 0 || !isConfigured}
                    className="gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Invia a Prosp.ai ({selectedInvestors.size})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {investorsWithLinkedIn.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Linkedin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nessun investitore con profilo LinkedIn</p>
                  <p className="text-sm">Aggiungi i profili LinkedIn agli investitori per usare l'outreach automatico</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {investorsWithLinkedIn.map((investor) => (
                      <div
                        key={investor.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedInvestors.has(investor.id)
                            ? 'bg-primary/5 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => toggleInvestor(investor.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedInvestors.has(investor.id)}
                            onCheckedChange={() => toggleInvestor(investor.id)}
                          />
                          <div>
                            <p className="font-medium">{investor.nome}</p>
                            <p className="text-sm text-muted-foreground">{investor.azienda}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {investor.email && (
                            <Badge variant="outline" className="text-xs">
                              Email ✓
                            </Badge>
                          )}
                          <a
                            href={investor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#0077B5] hover:underline flex items-center gap-1"
                          >
                            <Linkedin className="h-4 w-4" />
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Linkedin className="h-5 w-5 text-[#0077B5] mt-0.5" />
                <div>
                  <h4 className="font-medium">Come funziona</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>1. Configura Campaign ID e List ID dalle impostazioni Prosp.ai</li>
                    <li>2. Seleziona gli investitori da contattare</li>
                    <li>3. Clicca "Invia a Prosp.ai" per aggiungerli alla campagna</li>
                    <li>4. Prosp.ai invierà automaticamente i messaggi personalizzati su LinkedIn</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
