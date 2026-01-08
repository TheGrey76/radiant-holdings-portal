import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock, TrendingUp, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, parseISO } from "date-fns";

interface Investor {
  id: string;
  nome: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate: string | null;
}

interface ABCPipelineVelocityProps {
  investors: Investor[];
}

interface StageTransition {
  from: string;
  to: string;
  avgDays: number;
  count: number;
}

export const ABCPipelineVelocity = ({ investors }: ABCPipelineVelocityProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch historical status change activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('abc_investor_activities')
          .select('*')
          .eq('activity_type', 'status_change')
          .order('activity_date', { ascending: true });

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate stage transitions and velocity
  const velocityData = useMemo(() => {
    const stages = [
      { key: 'To Contact', label: 'To Contact', order: 0 },
      { key: 'Contacted', label: 'Contacted', order: 1 },
      { key: 'Interested', label: 'Interested', order: 2 },
      { key: 'Meeting Scheduled', label: 'Meeting', order: 3 },
      { key: 'In Negotiation', label: 'Negotiation', order: 4 },
      { key: 'Closed', label: 'Closed', order: 5 },
    ];

    // Parse activities to build transition history per investor
    const investorTransitions: Record<string, { stage: string; date: Date }[]> = {};

    activities.forEach(activity => {
      const investorName = activity.investor_name;
      // Extract new status from description like "Status: Contacted → Interested"
      const match = activity.activity_description?.match(/Status:.*→\s*(.+)/);
      if (match) {
        const newStatus = match[1].trim();
        if (!investorTransitions[investorName]) {
          investorTransitions[investorName] = [];
        }
        investorTransitions[investorName].push({
          stage: newStatus,
          date: parseISO(activity.activity_date),
        });
      }
    });

    // Calculate average days between each stage transition
    const transitions: Record<string, { totalDays: number; count: number }> = {};

    Object.values(investorTransitions).forEach(history => {
      // Sort by date
      history.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      for (let i = 1; i < history.length; i++) {
        const fromStage = history[i - 1].stage;
        const toStage = history[i].stage;
        const days = differenceInDays(history[i].date, history[i - 1].date);
        
        const key = `${fromStage}→${toStage}`;
        if (!transitions[key]) {
          transitions[key] = { totalDays: 0, count: 0 };
        }
        transitions[key].totalDays += days;
        transitions[key].count += 1;
      }
    });

    // Format for display - main funnel stages
    const mainTransitions = [
      { from: 'To Contact', to: 'Contacted' },
      { from: 'Contacted', to: 'Interested' },
      { from: 'Interested', to: 'Meeting Scheduled' },
      { from: 'Meeting Scheduled', to: 'In Negotiation' },
      { from: 'In Negotiation', to: 'Closed' },
    ];

    const formattedTransitions: StageTransition[] = mainTransitions.map(t => {
      const key = `${t.from}→${t.to}`;
      const data = transitions[key];
      return {
        from: t.from === 'Meeting Scheduled' ? 'Meeting' : t.from === 'In Negotiation' ? 'Negotiation' : t.from,
        to: t.to === 'Meeting Scheduled' ? 'Meeting' : t.to === 'In Negotiation' ? 'Negotiation' : t.to,
        avgDays: data ? Math.round(data.totalDays / data.count) : 0,
        count: data?.count || 0,
      };
    });

    // Calculate overall velocity (average total days from To Contact to Closed)
    let totalClosedDays = 0;
    let closedCount = 0;

    investors.filter(inv => inv.status === 'Closed').forEach(inv => {
      if (inv.createdAt) {
        const days = differenceInDays(new Date(), parseISO(inv.createdAt));
        if (days > 0) {
          totalClosedDays += days;
          closedCount += 1;
        }
      }
    });

    const avgTotalDays = closedCount > 0 ? Math.round(totalClosedDays / closedCount) : 0;

    return {
      transitions: formattedTransitions,
      avgTotalDays,
      closedCount,
    };
  }, [activities, investors]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Pipeline Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded" />
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
            <Zap className="h-5 w-5 text-primary" />
            Pipeline Velocity
          </div>
          <div className="flex items-center gap-2 text-sm font-normal">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tempo medio per stage</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Velocity */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo medio al Closing</p>
              <p className="text-2xl font-bold text-foreground">
                {velocityData.avgTotalDays > 0 ? `${velocityData.avgTotalDays} giorni` : 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Investitori chiusi</p>
              <p className="text-xl font-semibold text-primary">{velocityData.closedCount}</p>
            </div>
          </div>
        </div>

        {/* Stage Transitions */}
        <div className="space-y-2">
          {velocityData.transitions.map((transition, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium text-foreground min-w-[90px]">
                  {transition.from}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground min-w-[90px]">
                  {transition.to}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${transition.avgDays > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {transition.avgDays > 0 ? `${transition.avgDays}g` : '--'}
                  </p>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="text-xs text-muted-foreground">
                    {transition.count} {transition.count === 1 ? 'transiz.' : 'transiz.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {velocityData.transitions.every(t => t.count === 0) && (
          <p className="text-center text-muted-foreground text-sm py-4">
            I dati di velocità saranno disponibili man mano che gli investitori progrediscono nel funnel
          </p>
        )}
      </CardContent>
    </Card>
  );
};
