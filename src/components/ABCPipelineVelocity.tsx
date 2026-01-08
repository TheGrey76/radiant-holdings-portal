import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, parseISO } from "date-fns";

interface Investor {
  id: string;
  nome: string;
  azienda?: string;
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

type StatusChangeActivity = {
  investor_name: string;
  activity_type: string;
  activity_description: string | null;
  activity_date: string;
};

const STAGES = [
  "To Contact",
  "Contacted",
  "Interested",
  "Meeting Scheduled",
  "In Negotiation",
  "Closed",
] as const;

const MAIN_TRANSITIONS: Array<{ from: (typeof STAGES)[number]; to: (typeof STAGES)[number] }> = [
  { from: "To Contact", to: "Contacted" },
  { from: "Contacted", to: "Interested" },
  { from: "Interested", to: "Meeting Scheduled" },
  { from: "Meeting Scheduled", to: "In Negotiation" },
  { from: "In Negotiation", to: "Closed" },
];

function normalizeInvestorKey(inv: Pick<Investor, "nome" | "azienda">) {
  return `${inv.nome}${inv.azienda ? ` - ${inv.azienda}` : ""}`.trim();
}

function parseStatusChange(description: string | null): { from: string; to: string } | null {
  if (!description) return null;
  // Expect: "Status: Contacted → Interested"
  const match = description.match(/Status:\s*(.+?)\s*→\s*(.+)\s*$/);
  if (!match) return null;
  return { from: match[1].trim(), to: match[2].trim() };
}

export const ABCPipelineVelocity = ({ investors }: ABCPipelineVelocityProps) => {
  const [activities, setActivities] = useState<StatusChangeActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch historical status change activities + keep in sync with Investors
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("abc_investor_activities")
          .select("investor_name, activity_type, activity_description, activity_date")
          .eq("activity_type", "status_change")
          .order("activity_date", { ascending: true });

        if (error) throw error;
        setActivities((data || []) as StatusChangeActivity[]);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    channel = supabase
      .channel("abc_pipeline_velocity_status_change")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "abc_investor_activities" },
        (payload) => {
          const row = payload.new as StatusChangeActivity;
          if (row?.activity_type !== "status_change") return;
          setActivities((prev) => {
            const next = [...prev, row];
            next.sort((a, b) => parseISO(a.activity_date).getTime() - parseISO(b.activity_date).getTime());
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const velocityData = useMemo(() => {
    const investorByKey = new Map<string, Investor>();
    investors.forEach((inv) => investorByKey.set(normalizeInvestorKey(inv), inv));

    // Group activities by investor
    const byInvestor: Record<string, StatusChangeActivity[]> = {};
    for (const a of activities) {
      const key = a.investor_name;
      if (!byInvestor[key]) byInvestor[key] = [];
      byInvestor[key].push(a);
    }

    // transitions accumulator
    const transitionsAcc: Record<string, { totalDays: number; count: number }> = {};

    // for avg total days to close
    let closedTotalDays = 0;
    let closedCount = 0;

    const isKnownStage = (s: string) => (STAGES as readonly string[]).includes(s);

    Object.entries(byInvestor).forEach(([investorKey, acts]) => {
      const inv = investorByKey.get(investorKey);
      const createdAt = inv?.createdAt ? parseISO(inv.createdAt) : null;

      acts.sort((a, b) => parseISO(a.activity_date).getTime() - parseISO(b.activity_date).getTime());

      let prevDate: Date | null = createdAt;

      // Track first time reaching Closed for total-to-close
      let closedAt: Date | null = null;

      for (const act of acts) {
        const parsed = parseStatusChange(act.activity_description);
        if (!parsed) continue;
        const { from, to } = parsed;
        if (!isKnownStage(from) || !isKnownStage(to)) continue;

        const actDate = parseISO(act.activity_date);
        const daysSpent = prevDate ? Math.max(0, differenceInDays(actDate, prevDate)) : 0;

        const key = `${from}→${to}`;
        if (!transitionsAcc[key]) transitionsAcc[key] = { totalDays: 0, count: 0 };
        transitionsAcc[key].totalDays += daysSpent;
        transitionsAcc[key].count += 1;

        // mark close time
        if (to === "Closed" && !closedAt) {
          closedAt = actDate;
        }

        prevDate = actDate;
      }

      // Average total days = createdAt -> first Closed transition date (if investor currently Closed)
      if (inv?.status === "Closed" && createdAt && closedAt) {
        const totalDays = Math.max(0, differenceInDays(closedAt, createdAt));
        if (totalDays > 0) {
          closedTotalDays += totalDays;
          closedCount += 1;
        }
      }
    });

    const formattedTransitions: StageTransition[] = MAIN_TRANSITIONS.map((t) => {
      const key = `${t.from}→${t.to}`;
      const data = transitionsAcc[key];
      return {
        from: t.from === "Meeting Scheduled" ? "Meeting" : t.from === "In Negotiation" ? "Negotiation" : t.from,
        to: t.to === "Meeting Scheduled" ? "Meeting" : t.to === "In Negotiation" ? "Negotiation" : t.to,
        avgDays: data ? Math.round(data.totalDays / data.count) : 0,
        count: data?.count || 0,
      };
    });

    const avgTotalDays = closedCount > 0 ? Math.round(closedTotalDays / closedCount) : 0;

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
            {[1, 2, 3].map((i) => (
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
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo medio al Closing</p>
              <p className="text-2xl font-bold text-foreground">
                {velocityData.avgTotalDays > 0 ? `${velocityData.avgTotalDays} giorni` : "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Investitori chiusi</p>
              <p className="text-xl font-semibold text-primary">{velocityData.closedCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {velocityData.transitions.map((transition, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium text-foreground min-w-[90px]">{transition.from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground min-w-[90px]">{transition.to}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transition.avgDays > 0 ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {transition.avgDays > 0 ? `${transition.avgDays}g` : "--"}
                  </p>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="text-xs text-muted-foreground">{transition.count} transiz.</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {velocityData.transitions.every((t) => t.count === 0) && (
          <p className="text-center text-muted-foreground text-sm py-4">
            I dati di velocità saranno disponibili man mano che gli investitori progrediscono nel funnel
          </p>
        )}
      </CardContent>
    </Card>
  );
};

