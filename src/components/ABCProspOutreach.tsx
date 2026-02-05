import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Linkedin, Send, Settings, Users, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
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
}

interface ProspSettings {
  campaignId: string;
  listId: string;
}

export const ABCProspOutreach: React.FC<ABCProspOutreachProps> = ({ investors }) => {
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<ProspSettings>({
    campaignId: '',
    listId: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  // Filter investors with LinkedIn URLs
  const investorsWithLinkedIn = investors.filter(inv => inv.linkedin && inv.linkedin.trim() !== '');

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
            Prosp.ai Outreach
          </h2>
          <p className="text-muted-foreground">
            Invia investitori selezionati a Prosp.ai per outreach automatizzato su LinkedIn
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
    </div>
  );
};
