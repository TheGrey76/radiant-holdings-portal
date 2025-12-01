import { motion } from "framer-motion";
import { FileText, Calendar, MessageSquare, Paperclip, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useABCActivityFeed, ActivityItem } from "@/hooks/useABCActivityFeed";
import { formatDistanceToNow } from "date-fns";

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
  };

  const labels: Record<ActivityItem['type'], string> = {
    note: "Note",
    followup: "Follow-up",
    activity: "Activity",
    document: "Document",
  };

  return (
    <Badge variant="outline" className={variants[type]}>
      {labels[type]}
    </Badge>
  );
};

export const ABCActivityFeed = () => {
  const { activities, loading } = useABCActivityFeed();

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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted/50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activities yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all duration-200 hover:shadow-sm">
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
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{activity.createdBy}</span>
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
