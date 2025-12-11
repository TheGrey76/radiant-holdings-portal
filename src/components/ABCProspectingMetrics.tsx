import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, ArrowRight, Users, Target, Percent } from 'lucide-react';

interface Investor {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string | null;
}

interface ABCProspectingMetricsProps {
  investors: Investor[];
}

const FUNNEL_STAGES = [
  'To Contact',
  'Contacted',
  'Interested',
  'Meeting Scheduled',
  'In Negotiation',
  'Closed'
];

const ABCProspectingMetrics: React.FC<ABCProspectingMetricsProps> = ({ investors }) => {
  const metrics = useMemo(() => {
    // Count by status
    const statusCounts: Record<string, number> = {};
    FUNNEL_STAGES.forEach(stage => {
      statusCounts[stage] = investors.filter(i => i.status === stage).length;
    });
    
    // Calculate conversion rates between stages
    const conversionRates: { from: string; to: string; rate: number }[] = [];
    for (let i = 0; i < FUNNEL_STAGES.length - 1; i++) {
      const fromStage = FUNNEL_STAGES[i];
      const toStage = FUNNEL_STAGES[i + 1];
      
      // Count investors who have progressed to this stage or beyond
      const fromCount = FUNNEL_STAGES.slice(i).reduce((sum, stage) => sum + (statusCounts[stage] || 0), 0);
      const toCount = FUNNEL_STAGES.slice(i + 1).reduce((sum, stage) => sum + (statusCounts[stage] || 0), 0);
      
      const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
      conversionRates.push({ from: fromStage, to: toStage, rate });
    }
    
    // Calculate average time in funnel (days since creation)
    const now = new Date();
    const avgTimeByStatus: Record<string, number> = {};
    
    FUNNEL_STAGES.forEach(stage => {
      const stageInvestors = investors.filter(i => i.status === stage);
      if (stageInvestors.length > 0) {
        const totalDays = stageInvestors.reduce((sum, inv) => {
          const created = new Date(inv.created_at);
          const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        avgTimeByStatus[stage] = Math.round(totalDays / stageInvestors.length);
      } else {
        avgTimeByStatus[stage] = 0;
      }
    });
    
    // Overall metrics
    const totalInvestors = investors.length;
    const closedCount = statusCounts['Closed'] || 0;
    const overallConversionRate = totalInvestors > 0 ? Math.round((closedCount / totalInvestors) * 100) : 0;
    
    // Average days to close
    const closedInvestors = investors.filter(i => i.status === 'Closed');
    const avgDaysToClose = closedInvestors.length > 0
      ? Math.round(closedInvestors.reduce((sum, inv) => {
          const created = new Date(inv.created_at);
          const updated = new Date(inv.updated_at);
          return sum + Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / closedInvestors.length)
      : 0;
    
    // Active pipeline (excluding Closed and Not Interested)
    const activePipeline = investors.filter(i => 
      i.status !== 'Closed' && i.status !== 'Not Interested'
    ).length;
    
    // Hot leads (Interested + Meeting Scheduled + In Negotiation)
    const hotLeads = (statusCounts['Interested'] || 0) + 
                     (statusCounts['Meeting Scheduled'] || 0) + 
                     (statusCounts['In Negotiation'] || 0);
    
    return {
      statusCounts,
      conversionRates,
      avgTimeByStatus,
      overallConversionRate,
      avgDaysToClose,
      activePipeline,
      hotLeads,
      totalInvestors,
      closedCount
    };
  }, [investors]);

  const getConversionColor = (rate: number) => {
    if (rate >= 60) return 'text-green-500';
    if (rate >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 60) return 'bg-green-500';
    if (rate >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Percent className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-bold">{metrics.overallConversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Giorni Medi a Closing</p>
                <p className="text-xl font-bold">{metrics.avgDaysToClose || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hot Leads</p>
                <p className="text-xl font-bold">{metrics.hotLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pipeline Attiva</p>
                <p className="text-xl font-bold">{metrics.activePipeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tassi di Conversione per Fase</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.conversionRates.map((conv, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{conv.from}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{conv.to}</span>
                  </div>
                  <span className={`font-bold ${getConversionColor(conv.rate)}`}>
                    {conv.rate}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${getProgressColor(conv.rate)}`}
                    style={{ width: `${conv.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time in Stage */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tempo Medio per Fase (giorni)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FUNNEL_STAGES.map((stage) => {
              const count = metrics.statusCounts[stage] || 0;
              const avgDays = metrics.avgTimeByStatus[stage] || 0;
              
              return (
                <div 
                  key={stage} 
                  className="p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground truncate">{stage}</span>
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{avgDays}</span>
                    <span className="text-xs text-muted-foreground">gg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCProspectingMetrics;
