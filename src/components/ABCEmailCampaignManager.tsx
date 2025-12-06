import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Users, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email: string | null;
  categoria: string;
  status: string;
}

interface ABCEmailCampaignManagerProps {
  investors: Investor[];
}

export function ABCEmailCampaignManager({ investors }: ABCEmailCampaignManagerProps) {
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
  });

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
      const selectedEmails = filteredInvestors
        .filter(i => selectedInvestors.includes(i.id) && i.email)
        .map(i => ({
          email: i.email!,
          name: i.nome,
          company: i.azienda,
        }));

      // Call edge function to send emails
      const { data, error } = await supabase.functions.invoke('send-abc-campaign', {
        body: {
          recipients: selectedEmails,
          subject: emailForm.subject,
          content: emailForm.content,
          senderEmail: sessionStorage.getItem('abc_authorized_email') || 'admin@aries76.com',
        },
      });

      if (error) throw error;

      toast({
        title: "Campagna inviata",
        description: `Email inviata a ${selectedEmails.length} investitori`,
      });

      // Log activity for each investor
      for (const investor of selectedEmails) {
        await supabase.from('abc_investor_activities').insert({
          investor_name: `${investor.name} - ${investor.company}`,
          activity_type: 'Email Campaign',
          activity_description: `Campagna email: ${emailForm.subject}`,
          created_by: sessionStorage.getItem('abc_authorized_email') || 'Unknown',
        });
      }

      // Reset form
      setEmailForm({ subject: "", content: "" });
      setSelectedInvestors([]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Email Composer */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Componi Email
            </CardTitle>
            <CardDescription>
              Scrivi il messaggio da inviare agli investitori selezionati
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <p className="text-xs text-muted-foreground mt-1">
                Usa {'{nome}'} e {'{azienda}'} per personalizzare il messaggio
              </p>
            </div>

            <Button 
              onClick={handleSendCampaign} 
              className="w-full" 
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
          </CardContent>
        </Card>
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
  );
}
