import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, Flame, ThermometerSun, Snowflake, 
  RefreshCw, Mail, MessageSquare, Calendar, FileText 
} from "lucide-react";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email: string | null;
  engagement_score?: number;
  email_opens_count?: number;
  email_responses_count?: number;
  meetings_count?: number;
  notes_count?: number;
}

interface ABCEngagementScoreProps {
  investors: Investor[];
  onSelectInvestor?: (investorId: string) => void;
}

export function ABCEngagementScore({ investors, onSelectInvestor }: ABCEngagementScoreProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Sort investors by engagement score (highest first)
  const sortedInvestors = [...investors]
    .filter(inv => inv.email)
    .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
    .slice(0, 10);

  const getEngagementLevel = (score: number) => {
    if (score >= 70) return { label: "Hot", color: "text-red-500", bg: "bg-red-100", icon: Flame };
    if (score >= 40) return { label: "Warm", color: "text-orange-500", bg: "bg-orange-100", icon: ThermometerSun };
    if (score >= 20) return { label: "Cool", color: "text-blue-400", bg: "bg-blue-100", icon: Snowflake };
    return { label: "Cold", color: "text-slate-400", bg: "bg-slate-100", icon: Snowflake };
  };

  const updateEngagementScores = async () => {
    setIsUpdating(true);
    try {
      // Call the database function to update all engagement scores
      const { error } = await supabase.rpc('update_all_engagement_scores');
      
      if (error) throw error;

      toast({
        title: "Engagement scores aggiornati",
        description: "I punteggi di engagement sono stati ricalcolati",
      });

      // Trigger a page reload to see updated scores
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating engagement scores:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento degli engagement scores",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Top 10 Prospect più Caldi
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={updateEngagementScores}
            disabled={isUpdating}
            className="h-7 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>
        <CardDescription className="text-xs">
          Basato su aperture email, risposte, meeting e note
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedInvestors.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Nessun dato di engagement disponibile
          </div>
        ) : (
          <div className="space-y-3">
            {sortedInvestors.map((investor, index) => {
              const score = investor.engagement_score || 0;
              const level = getEngagementLevel(score);
              const Icon = level.icon;

              return (
                <div 
                  key={investor.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectInvestor?.(investor.id)}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{investor.nome}</p>
                      <Badge variant="outline" className={`${level.color} ${level.bg} text-xs px-1.5`}>
                        <Icon className="h-3 w-3 mr-0.5" />
                        {level.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{investor.azienda}</p>
                    
                    {/* Engagement breakdown */}
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      {investor.email_opens_count !== undefined && investor.email_opens_count > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Mail className="h-2.5 w-2.5" />
                          {investor.email_opens_count}
                        </span>
                      )}
                      {investor.email_responses_count !== undefined && investor.email_responses_count > 0 && (
                        <span className="flex items-center gap-0.5 text-green-600">
                          <MessageSquare className="h-2.5 w-2.5" />
                          {investor.email_responses_count}
                        </span>
                      )}
                      {investor.meetings_count !== undefined && investor.meetings_count > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-600">
                          <Calendar className="h-2.5 w-2.5" />
                          {investor.meetings_count}
                        </span>
                      )}
                      {investor.notes_count !== undefined && investor.notes_count > 0 && (
                        <span className="flex items-center gap-0.5">
                          <FileText className="h-2.5 w-2.5" />
                          {investor.notes_count}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <Progress value={score} className="h-2" />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
