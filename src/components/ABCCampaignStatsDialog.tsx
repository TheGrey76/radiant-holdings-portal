import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Eye, CheckCircle, Search, ExternalLink, User } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type StatType = 'campaigns' | 'sent' | 'opens' | 'success';

interface CampaignStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statType: StatType;
  onNavigateToInvestor?: (investorId: string) => void;
}

interface InvestorData {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  date?: string;
  campaignName?: string;
}

export function ABCCampaignStatsDialog({ 
  open, 
  onOpenChange, 
  statType,
  onNavigateToInvestor 
}: CampaignStatsDialogProps) {
  const [investors, setInvestors] = useState<InvestorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, statType]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (statType) {
        case 'campaigns':
          await fetchCampaignRecipients();
          break;
        case 'sent':
          await fetchEmailRecipients();
          break;
        case 'opens':
          await fetchEmailOpens();
          break;
        case 'success':
          await fetchSuccessfulContacts();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaignRecipients = async () => {
    // Get all campaigns with their recipients
    const { data: campaigns } = await supabase
      .from('abc_email_campaign_history')
      .select('id, campaign_name, recipients, sent_at')
      .order('sent_at', { ascending: false });

    if (!campaigns) return;

    // Get all investors for reference
    const { data: allInvestors } = await supabase
      .from('abc_investors')
      .select('id, nome, azienda, email, status');

    const investorMap = new Map(
      (allInvestors || []).map(inv => [inv.email?.toLowerCase(), inv])
    );

    // Flatten all campaign recipients
    const allRecipients: InvestorData[] = [];
    for (const campaign of campaigns) {
      const recipients = Array.isArray(campaign.recipients) ? campaign.recipients : [];
      for (const r of recipients as Array<{ email?: string; name?: string }>) {
        const inv = investorMap.get(r.email?.toLowerCase());
        allRecipients.push({
          id: inv?.id || '',
          name: r.name || inv?.nome || 'N/A',
          email: r.email || '',
          company: inv?.azienda || '',
          status: inv?.status || 'Unknown',
          date: campaign.sent_at,
          campaignName: campaign.campaign_name,
        });
      }
    }

    setInvestors(allRecipients);
  };

  const fetchEmailRecipients = async () => {
    // Get all recipients from all campaigns (deduplicated)
    const { data: campaigns } = await supabase
      .from('abc_email_campaign_history')
      .select('recipients, successful_sends, sent_at, campaign_name')
      .order('sent_at', { ascending: false });

    if (!campaigns) return;

    const { data: allInvestors } = await supabase
      .from('abc_investors')
      .select('id, nome, azienda, email, status');

    const investorMap = new Map(
      (allInvestors || []).map(inv => [inv.email?.toLowerCase(), inv])
    );

    // Collect all successfully sent emails
    const sentRecipients: InvestorData[] = [];
    for (const campaign of campaigns) {
      const recipients = Array.isArray(campaign.recipients) ? campaign.recipients : [];
      for (const r of recipients as Array<{ email?: string; name?: string }>) {
        const inv = investorMap.get(r.email?.toLowerCase());
        sentRecipients.push({
          id: inv?.id || '',
          name: r.name || inv?.nome || 'N/A',
          email: r.email || '',
          company: inv?.azienda || '',
          status: inv?.status || 'Unknown',
          date: campaign.sent_at,
          campaignName: campaign.campaign_name,
        });
      }
    }

    setInvestors(sentRecipients);
  };

  const fetchEmailOpens = async () => {
    // Get all email opens with investor details
    const { data: opens } = await supabase
      .from('abc_email_opens')
      .select('recipient_email, recipient_name, opened_at, campaign_id')
      .order('opened_at', { ascending: false });

    if (!opens) return;

    const { data: allInvestors } = await supabase
      .from('abc_investors')
      .select('id, nome, azienda, email, status');

    const { data: campaigns } = await supabase
      .from('abc_email_campaign_history')
      .select('id, campaign_name');

    const investorMap = new Map(
      (allInvestors || []).map(inv => [inv.email?.toLowerCase(), inv])
    );

    const campaignMap = new Map(
      (campaigns || []).map(c => [c.id, c.campaign_name])
    );

    const openRecipients: InvestorData[] = opens.map(o => {
      const inv = investorMap.get(o.recipient_email?.toLowerCase());
      return {
        id: inv?.id || '',
        name: o.recipient_name || inv?.nome || 'N/A',
        email: o.recipient_email,
        company: inv?.azienda || '',
        status: inv?.status || 'Unknown',
        date: o.opened_at,
        campaignName: campaignMap.get(o.campaign_id) || 'N/A',
      };
    });

    setInvestors(openRecipients);
  };

  const fetchSuccessfulContacts = async () => {
    // Get investors that have been successfully contacted (have last_contact_date)
    const { data } = await supabase
      .from('abc_investors')
      .select('id, nome, azienda, email, status, last_contact_date')
      .not('last_contact_date', 'is', null)
      .order('last_contact_date', { ascending: false });

    if (!data) return;

    const successInvestors: InvestorData[] = data.map(inv => ({
      id: inv.id,
      name: inv.nome,
      email: inv.email || '',
      company: inv.azienda,
      status: inv.status,
      date: inv.last_contact_date,
    }));

    setInvestors(successInvestors);
  };

  const getTitle = () => {
    switch (statType) {
      case 'campaigns': return 'Destinatari Campagne';
      case 'sent': return 'Email Inviate';
      case 'opens': return 'Aperture Email';
      case 'success': return 'Contatti Riusciti';
      default: return 'Investitori';
    }
  };

  const getIcon = () => {
    switch (statType) {
      case 'campaigns': return <Mail className="h-5 w-5 text-primary" />;
      case 'sent': return <Send className="h-5 w-5 text-blue-500" />;
      case 'opens': return <Eye className="h-5 w-5 text-green-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-orange-500" />;
    }
  };

  const filteredInvestors = investors.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNavigate = (investorId: string) => {
    if (investorId && onNavigateToInvestor) {
      onNavigateToInvestor(investorId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
            <Badge variant="outline" className="ml-2">{investors.length}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca investitore, email, azienda..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
            ) : filteredInvestors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nessun investitore trovato</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investitore</TableHead>
                    <TableHead>Azienda</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    {statType !== 'success' && <TableHead>Campagna</TableHead>}
                    <TableHead>Data</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestors.map((inv, idx) => (
                    <TableRow key={`${inv.id}-${idx}`}>
                      <TableCell className="font-medium">{inv.name}</TableCell>
                      <TableCell>{inv.company}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      {statType !== 'success' && (
                        <TableCell className="text-sm">{inv.campaignName || '-'}</TableCell>
                      )}
                      <TableCell className="text-sm text-muted-foreground">
                        {inv.date ? format(new Date(inv.date), 'dd/MM/yy HH:mm', { locale: it }) : '-'}
                      </TableCell>
                      <TableCell>
                        {inv.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNavigate(inv.id)}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
