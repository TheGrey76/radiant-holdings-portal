import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, AlertTriangle, Clock, Send, Calendar, ChevronRight, RefreshCw, CheckSquare, Settings, CalendarPlus } from "lucide-react";
import { differenceInDays, parseISO, format, addDays, isBefore } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ReminderSnoozeDialog, 
  ReminderThresholdsDialog, 
  BulkFollowUpDialog, 
  ReminderTemplates,
  getStoredThresholds,
  type ReminderThresholds 
} from "@/components/reminders";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  status: string;
  email: string | null;
  lastContactDate: string | null;
  engagementScore: number;
}

interface ABCAutoRemindersProps {
  investors: Investor[];
  onSelectInvestor?: (investorId: string) => void;
  onSendReminders?: (reminders: Reminder[]) => void;
  onSelectTemplate?: (subject: string, content: string, investorEmail: string) => void;
  userEmail?: string;
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

interface SnoozedReminder {
  investorId: string;
  until: string; // ISO date
}

const getSnoozedReminders = (): SnoozedReminder[] => {
  const saved = localStorage.getItem('abc_snoozed_reminders');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing snoozed reminders:', e);
    }
  }
  return [];
};

const saveSnoozedReminders = (snoozed: SnoozedReminder[]) => {
  localStorage.setItem('abc_snoozed_reminders', JSON.stringify(snoozed));
};

export const ABCAutoReminders = ({ 
  investors, 
  onSelectInvestor, 
  onSendReminders,
  onSelectTemplate,
  userEmail = "user@example.com"
}: ABCAutoRemindersProps) => {
  const [overdueFollowUps, setOverdueFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [thresholds, setThresholds] = useState<ReminderThresholds>(getStoredThresholds);
  const [snoozedReminders, setSnoozedReminders] = useState<SnoozedReminder[]>(getSnoozedReminders);
  
  // Dialogs
  const [snoozeDialogOpen, setSnoozeDialogOpen] = useState(false);
  const [snoozeTarget, setSnoozeTarget] = useState<Reminder | null>(null);
  const [thresholdsDialogOpen, setThresholdsDialogOpen] = useState(false);
  const [bulkFollowUpOpen, setBulkFollowUpOpen] = useState(false);

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

  // Clean expired snoozes
  useEffect(() => {
    const now = new Date();
    const activeSnoozed = snoozedReminders.filter(s => isBefore(now, parseISO(s.until)));
    if (activeSnoozed.length !== snoozedReminders.length) {
      setSnoozedReminders(activeSnoozed);
      saveSnoozedReminders(activeSnoozed);
    }
  }, [snoozedReminders]);

  const reminders = useMemo(() => {
    const allReminders: Reminder[] = [];
    const now = new Date();
    const snoozedIds = new Set(snoozedReminders.map(s => s.investorId));

    // Filter active investors (exclude Not Interested, Closed, and snoozed)
    const activeInvestors = investors.filter(inv => 
      !['Not Interested', 'Closed'].includes(inv.status) &&
      !snoozedIds.has(inv.id)
    );

    activeInvestors.forEach(investor => {
      const isHotProspect = investor.engagementScore >= 50;
      const isMeetingScheduled = investor.status === 'Meeting Scheduled';
      const isToContact = investor.status === 'To Contact';

      // Determine threshold based on investor type
      let threshold = thresholds.standard;
      if (isHotProspect) threshold = thresholds.hotProspect;
      else if (isMeetingScheduled) threshold = thresholds.postMeeting;
      else if (isToContact && !investor.lastContactDate) threshold = thresholds.toContact;

      if (investor.lastContactDate) {
        const daysSince = differenceInDays(now, parseISO(investor.lastContactDate));
        
        if (isHotProspect && daysSince >= threshold) {
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
        } else if (daysSince >= threshold) {
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
      } else if (isToContact) {
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
    });

    // Add overdue follow-ups
    overdueFollowUps.forEach(followUp => {
      const investor = investors.find(inv => inv.nome === followUp.investor_name?.split(' - ')[0]);
      if (investor && !['Not Interested', 'Closed'].includes(investor.status) && !snoozedIds.has(investor.id)) {
        const daysSince = differenceInDays(now, parseISO(followUp.follow_up_date));
        allReminders.push({
          id: `followup-${followUp.id}`,
          investorId: investor.id,
          investorName: investor.nome,
          company: investor.azienda,
          type: 'follow_up_missed',
          priority: daysSince >= 3 ? 'high' : 'medium',
          message: `Follow-up per ${format(parseISO(followUp.follow_up_date), 'd MMM', { locale: it })} non completato`,
          daysSince,
          email: investor.email,
        });
      }
    });

    // Sort by priority then by days since
    return allReminders.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysSince - a.daysSince;
    });
  }, [investors, overdueFollowUps, snoozedReminders, thresholds]);

  const handleSnooze = (reminder: Reminder) => {
    setSnoozeTarget(reminder);
    setSnoozeDialogOpen(true);
  };

  const handleConfirmSnooze = (days: number) => {
    if (!snoozeTarget) return;
    
    const until = addDays(new Date(), days).toISOString();
    const updated = [...snoozedReminders, { investorId: snoozeTarget.investorId, until }];
    setSnoozedReminders(updated);
    saveSnoozedReminders(updated);
    toast.success(`Reminder posticipato di ${days} giorni`);
    setSnoozeTarget(null);
  };

  const handleClearSnoozed = () => {
    setSnoozedReminders([]);
    saveSnoozedReminders([]);
    toast.success("Tutti i reminder posticipati sono stati ripristinati");
  };

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

  const handleBulkFollowUp = () => {
    if (selectedReminders.length === 0) {
      toast.error("Seleziona almeno un reminder");
      return;
    }
    setBulkFollowUpOpen(true);
  };

  const selectedRemindersData = reminders.filter(r => selectedReminders.includes(r.id));

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
    <>
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
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setThresholdsDialogOpen(true)}
                title="Configura soglie"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
          
          {/* Snoozed count and actions */}
          {snoozedReminders.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {snoozedReminders.length} reminder posticipati
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearSnoozed}
                className="text-xs"
              >
                Ripristina tutti
              </Button>
            </div>
          )}
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
              {/* Bulk actions bar */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedReminders.length === remindersWithEmail.length && remindersWithEmail.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Seleziona tutti ({remindersWithEmail.length})
                  </span>
                </div>
                {selectedReminders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <CheckSquare className="h-3 w-3 mr-1" />
                      {selectedReminders.length}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleBulkFollowUp}
                    >
                      <CalendarPlus className="h-4 w-4 mr-1" />
                      Follow-up
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSendToCampaign}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Campagna
                    </Button>
                  </div>
                )}
              </div>

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
                    <div className="flex items-center gap-1">
                      {!reminder.email && (
                        <Badge variant="outline" className="text-xs">
                          No email
                        </Badge>
                      )}
                      {reminder.email && onSelectTemplate && (
                        <ReminderTemplates
                          reminderType={reminder.type}
                          investorName={reminder.investorName}
                          onSelectTemplate={(subject, content) => 
                            onSelectTemplate(subject, content, reminder.email!)
                          }
                        />
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSnooze(reminder);
                        }}
                        title="Posticipa reminder"
                      >
                        <Clock className="h-4 w-4" />
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

      {/* Dialogs */}
      <ReminderSnoozeDialog
        open={snoozeDialogOpen}
        onOpenChange={setSnoozeDialogOpen}
        investorName={snoozeTarget?.investorName || ""}
        onSnooze={handleConfirmSnooze}
      />
      
      <ReminderThresholdsDialog
        open={thresholdsDialogOpen}
        onOpenChange={setThresholdsDialogOpen}
        onSave={setThresholds}
      />
      
      <BulkFollowUpDialog
        open={bulkFollowUpOpen}
        onOpenChange={setBulkFollowUpOpen}
        reminders={selectedRemindersData.map(r => ({
          investorId: r.investorId,
          investorName: r.investorName,
          company: r.company,
        }))}
        userEmail={userEmail}
        onSuccess={() => {
          setSelectedReminders([]);
          handleRefresh();
        }}
      />
    </>
  );
};
