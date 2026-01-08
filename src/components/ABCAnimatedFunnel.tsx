import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowDown, Users } from "lucide-react";

interface Investor {
  id: string;
  status: string;
}

interface ABCAnimatedFunnelProps {
  investors: Investor[];
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
  conversionRate: number | null;
}

export const ABCAnimatedFunnel = ({ investors }: ABCAnimatedFunnelProps) => {
  const funnelData = useMemo(() => {
    const total = investors.length;
    
    const statusCounts = {
      total,
      contacted: investors.filter(inv => ["Contacted", "Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
      interested: investors.filter(inv => ["Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
      meetings: investors.filter(inv => ["Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
      negotiation: investors.filter(inv => ["In Negotiation", "Closed"].includes(inv.status)).length,
      closed: investors.filter(inv => inv.status === "Closed").length
    };

    const stages: FunnelStage[] = [
      { 
        stage: "Contacts", 
        count: statusCounts.total, 
        percentage: 100,
        color: "from-blue-500 to-blue-600",
        conversionRate: null
      },
      { 
        stage: "Contacted", 
        count: statusCounts.contacted, 
        percentage: total ? Math.round((statusCounts.contacted / total) * 100) : 0,
        color: "from-cyan-500 to-cyan-600",
        conversionRate: total ? Math.round((statusCounts.contacted / total) * 100) : 0
      },
      { 
        stage: "Interested", 
        count: statusCounts.interested, 
        percentage: total ? Math.round((statusCounts.interested / total) * 100) : 0,
        color: "from-teal-500 to-teal-600",
        conversionRate: statusCounts.contacted ? Math.round((statusCounts.interested / statusCounts.contacted) * 100) : 0
      },
      { 
        stage: "Meetings", 
        count: statusCounts.meetings, 
        percentage: total ? Math.round((statusCounts.meetings / total) * 100) : 0,
        color: "from-emerald-500 to-emerald-600",
        conversionRate: statusCounts.interested ? Math.round((statusCounts.meetings / statusCounts.interested) * 100) : 0
      },
      { 
        stage: "Negotiation", 
        count: statusCounts.negotiation, 
        percentage: total ? Math.round((statusCounts.negotiation / total) * 100) : 0,
        color: "from-primary to-orange-600",
        conversionRate: statusCounts.meetings ? Math.round((statusCounts.negotiation / statusCounts.meetings) * 100) : 0
      },
      { 
        stage: "Closed", 
        count: statusCounts.closed, 
        percentage: total ? Math.round((statusCounts.closed / total) * 100) : 0,
        color: "from-green-500 to-green-600",
        conversionRate: statusCounts.negotiation ? Math.round((statusCounts.closed / statusCounts.negotiation) * 100) : 0
      },
    ];

    return stages;
  }, [investors]);

  // Calculate overall conversion rate
  const overallConversionRate = investors.length > 0 
    ? ((funnelData[5].count / investors.length) * 100).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Conversion Funnel
          </div>
          <div className="flex items-center gap-4 text-sm font-normal">
            <div className="flex items-center gap-1 text-muted-foreground">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              Live Data
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
              {overallConversionRate}% overall
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Visual Funnel */}
          <div className="space-y-1">
            {funnelData.map((stage, idx) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ 
                  delay: idx * 0.1, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="relative"
              >
                <div 
                  className="flex items-center"
                  style={{ 
                    paddingLeft: `${idx * 3}%`,
                    paddingRight: `${idx * 3}%`,
                  }}
                >
                  <div 
                    className={`
                      flex-1 h-14 rounded-lg bg-gradient-to-r ${stage.color}
                      flex items-center justify-between px-4
                      shadow-sm hover:shadow-md transition-shadow cursor-pointer
                      relative overflow-hidden
                    `}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        delay: idx * 0.2,
                        ease: "linear"
                      }}
                    />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <Users className="h-5 w-5 text-white/80" />
                      <div>
                        <span className="font-semibold text-white text-lg">
                          {stage.count}
                        </span>
                        <span className="ml-2 text-white/80 text-sm">
                          {stage.stage}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 relative z-10">
                      <span className="text-white font-bold text-lg">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Conversion arrow between stages */}
                {idx < funnelData.length - 1 && stage.conversionRate !== null && (
                  <motion.div 
                    className="flex items-center justify-center py-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    {funnelData[idx + 1].conversionRate !== null && funnelData[idx + 1].conversionRate > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {funnelData[idx + 1].conversionRate}% conversione
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{funnelData[0].count}</p>
              <p className="text-xs text-muted-foreground">Totale Contatti</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{funnelData[5].count}</p>
              <p className="text-xs text-muted-foreground">Chiusi</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{overallConversionRate}%</p>
              <p className="text-xs text-muted-foreground">Tasso Conversione</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
