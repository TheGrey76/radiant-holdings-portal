import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, MessageSquare, Paperclip, Clock, ArrowRight, ShieldCheck, UserPlus, Reply, Send, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useABCActivityFeed, ActivityItem } from "@/hooks/useABCActivityFeed";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MentionInput, TEAM_MEMBERS } from "./MentionInput";

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch (type) {
    case 'note':
      return <MessageSquare {...iconProps} className="text-blue-500" />;
    case 'followup':
      return <Calendar {...iconProps} className="text-purple-500" />;
    case 'activity':
      return <FileText {...iconProps} className="text-green-500" />;
    case 'document':
      return <Paperclip {...iconProps} className="text-orange-500" />;
    case 'status_change':
      return <ArrowRight {...iconProps} className="text-cyan-500" />;
    case 'approval_change':
      return <ShieldCheck {...iconProps} className="text-amber-500" />;
    case 'investor_added':
      return <UserPlus {...iconProps} className="text-emerald-500" />;
    default:
      return <FileText {...iconProps} />;
  }
};

const ActivityTypeBadge = ({ type }: { type: ActivityItem['type'] }) => {
  const variants: Record<ActivityItem['type'], string> = {
    note: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    followup: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    activity: "bg-green-500/10 text-green-600 border-green-500/20",
    document: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    status_change: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    approval_change: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    investor_added: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const labels: Record<ActivityItem['type'], string> = {
    note: "Note",
    followup: "Follow-up",
    activity: "Activity",
    document: "Document",
    status_change: "Status Change",
    approval_change: "Approval",
    investor_added: "New Investor",
  };

  return (
    <Badge variant="outline" className={variants[type]}>
      {labels[type]}
    </Badge>
  );
};

const ACTIVITY_TYPES: ActivityItem['type'][] = ['note', 'followup', 'activity', 'document', 'status_change', 'approval_change', 'investor_added'];

export const ABCActivityFeed = () => {
  const { activities, loading, refetch } = useABCActivityFeed();
  const [activeFilters, setActiveFilters] = useState<Set<ActivityItem['type']>>(new Set(ACTIVITY_TYPES));
  const [replyingTo, setReplyingTo] = useState<ActivityItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFilter = (type: ActivityItem['type']) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
  };

  const filteredActivities = activities.filter(a => activeFilters.has(a.type));

  const filterLabels: Record<ActivityItem['type'], string> = {
    note: "Note",
    followup: "Follow-up",
    activity: "Activity",
    document: "Document",
    status_change: "Status",
    approval_change: "Approval",
    investor_added: "New Investor",
  };

  // Convert email or raw value to formatted name
  const formatUserName = (value: string): string => {
    if (!value || value === 'Team' || value === 'System' || value === 'Unknown') {
      return value || 'Team';
    }
    // If it's an email, extract and format the name part
    if (value.includes('@')) {
      const namePart = value.split('@')[0] || 'Unknown';
      return namePart.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }
    // Already a name, return as-is
    return value;
  };

  const getCurrentUser = () => {
    // FIXED: use correct sessionStorage key 'abc_console_email' (not 'abc_user_email')
    const email = sessionStorage.getItem('abc_console_email') || '';
    if (!email) {
      return 'Team';
    }
    const namePart = email.split('@')[0] || 'Team';
    return namePart.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  };

  const [mentionedEmails, setMentionedEmails] = useState<string[]>([]);

  const handleReply = async () => {
    if (!replyingTo || !replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const currentUser = getCurrentUser();
      const replyNote = `↩️ Re: "${replyingTo.description.substring(0, 50)}${replyingTo.description.length > 50 ? '...' : ''}"\n\n${replyText.trim()}`;
      
      const { data: noteData, error } = await supabase.from('abc_investor_notes').insert({
        investor_name: replyingTo.investorName,
        note_text: replyNote,
        created_by: currentUser,
      }).select().single();

      if (error) throw error;

      // Create notifications for mentioned users
      if (mentionedEmails.length > 0) {
        const notifications = mentionedEmails
          .filter(email => email !== currentUser) // Don't notify yourself
          .map(email => ({
            user_email: email,
            from_user: currentUser,
            investor_name: replyingTo.investorName,
            note_id: noteData?.id,
            message: replyText.trim().substring(0, 200),
          }));

        if (notifications.length > 0) {
          await supabase.from('abc_notifications').insert(notifications);
        }
      }

      toast.success("Risposta aggiunta alla scheda investitore");
      setReplyingTo(null);
      setReplyText("");
      setMentionedEmails([]);
      // Refetch to update the activity feed with new reply
      refetch();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error("Errore nell'aggiunta della risposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <Card className="border-border/50 bg-gradient-to-br from-background/50 to-background backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Live Activity Feed
          </CardTitle>
          {!loading && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              Real-time
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-3">
          {ACTIVITY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                activeFilters.has(type)
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-muted/30 border-border/50 text-muted-foreground opacity-50'
              }`}
            >
              {filterLabels[type]}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Reply Input Panel */}
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg border border-blue-500/30 bg-blue-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Reply className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">Rispondi a nota di</span>
                <span className="font-medium text-foreground">{replyingTo.investorName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={cancelReply} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2 italic">
              "{replyingTo.description}"
            </p>
            <MentionInput
              value={replyText}
              onChange={setReplyText}
              onMentions={setMentionedEmails}
              placeholder="Scrivi la tua risposta... usa @nome per menzionare"
              className="min-h-[80px] text-sm mb-2"
              autoFocus
            />
            {mentionedEmails.length > 0 && (
              <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                <span>Menzioni:</span>
                {mentionedEmails.map(email => {
                  const member = TEAM_MEMBERS.find(m => m.email === email);
                  return (
                    <Badge key={email} variant="secondary" className="text-xs">
                      @{member?.name.split(' ')[0] || email}
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={cancelReply}>
                Annulla
              </Button>
              <Button 
                size="sm" 
                onClick={handleReply} 
                disabled={!replyText.trim() || isSubmitting}
                className="gap-1"
              >
                <Send className="h-3.5 w-3.5" />
                Invia risposta
              </Button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted/50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{activities.length === 0 ? 'No activities yet' : 'No activities match filters'}</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <ActivityTypeBadge type={activity.type} />
                          <span className="text-sm font-medium text-foreground truncate">
                            {activity.investorName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{formatUserName(activity.createdBy)}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </span>
                            {activity.metadata?.status && (
                              <>
                                <span>•</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-1.5 py-0 h-5"
                                >
                                  {activity.metadata.status}
                                </Badge>
                              </>
                            )}
                          </div>
                          {/* Reply button for notes only */}
                          {activity.type === 'note' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                              onClick={() => setReplyingTo(activity)}
                            >
                              <Reply className="h-3.5 w-3.5 mr-1" />
                              Rispondi
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
