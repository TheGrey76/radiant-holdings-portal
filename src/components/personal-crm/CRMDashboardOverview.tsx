import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Kanban, Send, TrendingUp, Activity, UserPlus } from "lucide-react";

interface CRMDashboardOverviewProps {
  onNavigate: (view: string) => void;
}

export function CRMDashboardOverview({ onNavigate }: CRMDashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalContacts: 0,
    enrichedContacts: 0,
    totalDeals: 0,
    activeDeals: 0,
    totalInteractions: 0,
    campaigns: 0,
  });
  const [recentInteractions, setRecentInteractions] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [contacts, deals, interactions, campaigns] = await Promise.all([
        supabase.from("ariesdb_contacts").select("id, enrichment_status", { count: "exact", head: true }),
        supabase.from("personal_crm_deals").select("id, stage", { count: "exact" }),
        supabase.from("personal_crm_interactions").select("id", { count: "exact", head: true }),
        supabase.from("personal_crm_campaigns").select("id", { count: "exact", head: true }),
      ]);

      const enrichedCount = await supabase
        .from("ariesdb_contacts")
        .select("id", { count: "exact", head: true })
        .eq("enrichment_status", "enriched");

      const activeDealsCount = (deals.data || []).filter(
        (d: any) => !["won", "lost"].includes(d.stage)
      ).length;

      setStats({
        totalContacts: contacts.count || 0,
        enrichedContacts: enrichedCount.count || 0,
        totalDeals: deals.count || 0,
        activeDeals: activeDealsCount,
        totalInteractions: interactions.count || 0,
        campaigns: campaigns.count || 0,
      });

      // Recent interactions
      const { data: recent } = await supabase
        .from("personal_crm_interactions")
        .select("*, ariesdb_contacts(name, company)")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentInteractions(recent || []);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Contatti Totali", value: stats.totalContacts, icon: Users, view: "contacts", color: "text-primary" },
    { label: "Arricchiti", value: stats.enrichedContacts, icon: UserPlus, view: "contacts", color: "text-emerald-500" },
    { label: "Deal Attivi", value: stats.activeDeals, icon: Kanban, view: "pipeline", color: "text-accent" },
    { label: "Interazioni", value: stats.totalInteractions, icon: Activity, view: "contacts", color: "text-blue-500" },
    { label: "Campagne", value: stats.campaigns, icon: Send, view: "outreach", color: "text-violet-500" },
    { label: "Deal Totali", value: stats.totalDeals, icon: TrendingUp, view: "pipeline", color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md transition-shadow border-border/50"
            onClick={() => onNavigate(card.view)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Contact Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Gestisci i tuoi {stats.totalContacts} contatti, aggiungi tag, traccia interazioni.
            </p>
            <Button size="sm" onClick={() => onNavigate("contacts")}>Apri Contatti</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Kanban className="h-4 w-4 text-accent" /> Deal Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {stats.activeDeals} deal attivi nella pipeline. Trascina per aggiornare lo stato.
            </p>
            <Button size="sm" variant="outline" onClick={() => onNavigate("pipeline")}>Apri Pipeline</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4 text-violet-500" /> Outreach Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Crea campagne, template email, sollecita i tuoi contatti senza limiti.
            </p>
            <Button size="sm" variant="outline" onClick={() => onNavigate("outreach")}>Apri Outreach</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentInteractions.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attività Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInteractions.map((interaction: any) => (
                <div key={interaction.id} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="font-medium">{interaction.ariesdb_contacts?.name}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-muted-foreground capitalize">{interaction.interaction_type}</span>
                  {interaction.subject && (
                    <span className="text-muted-foreground truncate">: {interaction.subject}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
