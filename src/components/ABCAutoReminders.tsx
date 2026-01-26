import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, AlertTriangle, Clock, Send, Calendar, ChevronRight, RefreshCw, CheckSquare, Filter } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  status: string;
  email: string | null;
  lastContactDate: string | null;
  engagementScore: number;
  emailResponsesCount?: number;
}

interface ABCAutoRemindersProps {
  investors: Investor[];
  onSelectInvestor?: (investorId: string) => void;
  onSendReminders?: (reminders: Reminder[]) => void;
}

export interface Reminder {
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

export const ABCAutoReminders = ({ investors, onSelectInvestor, onSendReminders }: ABCAutoRemindersProps) => {
  const [overdueFollowUps, setOverdueFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [excludeResponded, setExcludeResponded] = useState(false);

  // Threshold days for reminders
  const NO_CONTACT_THRESHOLD = 7; // Days without contact for active investors
  const HOT_INACTIVE_THRESHOLD = 5; // Days for hot prospects (engagement > 50)

  const fetchOverdueFollowUps = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('abc_investor_followups')
        .select('*')
        .lt('follow_up_date', today)
        .eq('status', 'scheduled');

      if (error) throw error;
      setOverdueFollowUps(data || []);
    } catch (error) {
      console.error('Error fetching overdue follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueFollowUps();
  }, []);

  const reminders = useMemo(() => {
    const allReminders: Reminder[] = [];
    const now = new Date();

    // Filter active investors (exclude Not Interested and Closed)
    let activeInvestors = investors.filter(inv => 
      !['Not Interested', 'Closed'].includes(inv.status)
    );

    // Exclude investors who have responded if toggle is on
    if (excludeResponded) {
      activeInvestors = activeInvestors.filter(inv => 
        !inv.emailResponsesCount || inv.emailResponsesCount === 0
      );
    }

    activeInvestors.forEach(investor => {
      // Check for no contact reminders
      if (investor.lastContactDate) {
        const daysSince = differenceInDays(now, parseISO(investor.lastContactDate));
        
        // Hot prospect inactive
        if (investor.engagementScore >= 50 && daysSince >= HOT_INACTIVE_THRESHOLD) {
          allReminders.push({
            id: `hot-${investor.id}`,
            investorId: investor.id,
            investorName: investor.nome,
            company: investor.azienda,
            type: 'hot_inactive',
            priority: 'high',
            message: `Prospect HOT senza interazioni da ${daysSince} giorni`,
            daysSince,
            email: investor.email,
          });
        }
        // Regular no contact
        else if (daysSince >= NO_CONTACT_THRESHOLD) {
          allReminders.push({
            id: `contact-${investor.id}`,
            investorId: investor.id,
            investorName: investor.nome,
            company: investor.azienda,
            type: 'no_contact',
            priority: daysSince >= 14 ? 'high' : 'medium',
            message: `Nessun contatto da ${daysSince} giorni`,
            daysSince,
            email: investor.email,
          });
        }
      } else {
        // Never contacted
        if (investor.status === 'To Contact') {
          allReminders.push({
            id: `new-${investor.id}`,
            investorId: investor.id,
            investorName: investor.nome,
            company: investor.azienda,
            type: 'no_contact',
            priority: 'low',
            message: 'Mai contattato',
            daysSince: 0,
            email: investor.email,
          });
        }
      }
    });

    // Add overdue follow-ups
    overdueFollowUps.forEach(followUp => {
      const investor = investors.find(inv => inv.nome === followUp.investor_name);
      if (investor && !['Not Interested', 'Closed'].includes(investor.status)) {
        const daysSince = differenceInDays(now, parseISO(followUp.follow_up_date));
        allReminders.push({
          id: `followup-${followUp.id}`,
          investorId: investor.id,
          investorName: investor.nome,
          company: investor.azienda,
          type: 'follow_up_missed',
          priority: daysSince >= 3 ? 'high' : 'medium',
          message: `Follow-up programmato per ${format(parseISO(followUp.follow_up_date), 'd MMM', { locale: it })} non completato`,
          daysSince,
          email: investor.email,
        });
      }
    });

    // Sort by priority (high first) then by days since
    return allReminders.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysSince - a.daysSince;
    });
  }, [investors, overdueFollowUps, excludeResponded]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOverdueFollowUps();
    setIsRefreshing(false);
    toast.success("Reminder aggiornati");
  };

  const handleToggleReminder = (reminderId: string) => {
    setSelectedReminders(prev => 
      prev.includes(reminderId) 
        ? prev.filter(id => id !== reminderId)
        : [...prev, reminderId]
    );
  };

  const handleSelectAll = () => {
    const remindersWithEmail = reminders.filter(r => r.email);
    if (selectedReminders.length === remindersWithEmail.length) {
      setSelectedReminders([]);
    } else {
      setSelectedReminders(remindersWithEmail.map(r => r.id));
    }
  };

  const handleSendToCampaign = () => {
    const selected = reminders.filter(r => selectedReminders.includes(r.id) && r.email);
    if (selected.length === 0) {
      toast.error("Seleziona almeno un reminder con email");
      return;
    }
    onSendReminders?.(selected);
    setSelectedReminders([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'hot_inactive': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'follow_up_missed': return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'no_contact': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const highPriorityCount = reminders.filter(r => r.priority === 'high').length;
  const mediumPriorityCount = reminders.filter(r => r.priority === 'medium').length;
  const remindersWithEmail = reminders.filter(r => r.email);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Reminder Automatici
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Reminder Automatici
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {highPriorityCount} urgenti
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedReminders.length > 0 && (
              <Button 
                size="sm" 
                onClick={handleSendToCampaign}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-1" />
                Invia Campagna ({selectedReminders.length})
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
          </div>
        </CardTitle>
        
        {/* Filter: Exclude Responded */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setExcludeResponded(!excludeResponded)}
          >
            <Checkbox 
              checked={excludeResponded}
              onCheckedChange={(checked) => setExcludeResponded(checked === true)}
            />
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Escludi chi ha già risposto
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nessun reminder attivo</p>
            <p className="text-sm">Tutti gli investitori sono stati contattati di recente</p>
          </div>
        ) : (
          <>
            {/* Select All */}
            {remindersWithEmail.length > 0 && (
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedReminders.length === remindersWithEmail.length && remindersWithEmail.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Seleziona tutti ({remindersWithEmail.length} con email)
                  </span>
                </div>
                {selectedReminders.length > 0 && (
                  <Badge variant="secondary">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    {selectedReminders.length} selezionati
                  </Badge>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {reminders.slice(0, 15).map((reminder) => (
                <div
                  key={reminder.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border
                    ${getPriorityColor(reminder.priority)}
                    ${selectedReminders.includes(reminder.id) ? 'ring-2 ring-primary ring-offset-1' : ''}
                    hover:shadow-sm transition-all cursor-pointer
                  `}
                  onClick={() => reminder.email && handleToggleReminder(reminder.id)}
                >
                  <div className="flex items-center gap-3">
                    {reminder.email && (
                      <Checkbox 
                        checked={selectedReminders.includes(reminder.id)}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {getTypeIcon(reminder.type)}
                    <div>
                      <p className="font-medium text-foreground">
                        {reminder.investorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.company} · {reminder.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!reminder.email && (
                      <Badge variant="outline" className="text-xs">
                        No email
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInvestor?.(reminder.investorId);
                      }}
                      title="Vai al profilo"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {reminders.length > 15 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  + {reminders.length - 15} altri reminder
                </p>
              )}
            </div>
          </>
        )}

        {/* Summary */}
        {reminders.length > 0 && (
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <p className="text-lg font-bold text-red-600">{highPriorityCount}</p>
              <p className="text-xs text-muted-foreground">Alta priorità</p>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <p className="text-lg font-bold text-yellow-600">{mediumPriorityCount}</p>
              <p className="text-xs text-muted-foreground">Media priorità</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-lg font-bold text-foreground">{reminders.length}</p>
              <p className="text-xs text-muted-foreground">Totale</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
