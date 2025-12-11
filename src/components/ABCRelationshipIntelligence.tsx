import { useState, useEffect, useMemo } from "react";
import { 
  Users, TrendingUp, Clock, Mail, Calendar, MessageSquare, 
  Phone, Zap, Network, UserCheck, AlertTriangle, ArrowUpRight,
  Activity, Target, Heart, Star, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, subDays, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email?: string;
  status: string;
  lastContactDate?: string;
  engagementScore: number;
  emailOpensCount: number;
  emailResponsesCount: number;
  meetingsCount: number;
  notesCount: number;
  relationshipOwner?: string;
  createdAt: string;
  pipelineValue: number;
  approvalStatus: string;
}

interface RelationshipData {
  investorId: string;
  investorName: string;
  company: string;
  relationshipStrength: number;
  daysSinceLastContact: number;
  totalInteractions: number;
  emailsCount: number;
  meetingsCount: number;
  notesCount: number;
  responsesCount: number;
  trend: 'rising' | 'stable' | 'declining';
  riskLevel: 'low' | 'medium' | 'high';
  owner: string;
  pipelineValue: number;
}

interface TeamConnection {
  teamMember: string;
  connectedInvestors: string[];
  totalConnections: number;
  strongConnections: number;
}

interface ABCRelationshipIntelligenceProps {
  investors: Investor[];
  onInvestorSelect?: (investorId: string) => void;
}

// Calculate relationship strength (0-100)
const calculateRelationshipStrength = (
  daysSinceLastContact: number,
  emailsCount: number,
  meetingsCount: number,
  notesCount: number,
  responsesCount: number
): number => {
  // Recency score (max 40 points) - decays over time
  const recencyScore = Math.max(0, 40 - (daysSinceLastContact * 0.5));
  
  // Frequency score (max 30 points)
  const frequencyScore = Math.min(30, 
    (emailsCount * 2) + 
    (meetingsCount * 8) + 
    (responsesCount * 5) + 
    (notesCount * 1)
  );
  
  // Engagement score (max 30 points)
  const engagementScore = Math.min(30, 
    (responsesCount * 10) + 
    (meetingsCount * 5)
  );
  
  return Math.round(recencyScore + frequencyScore + engagementScore);
};

// Determine relationship trend
const determineTrend = (daysSinceLastContact: number, interactions: number): 'rising' | 'stable' | 'declining' => {
  if (daysSinceLastContact <= 7 && interactions >= 3) return 'rising';
  if (daysSinceLastContact > 30 || interactions < 2) return 'declining';
  return 'stable';
};

// Determine risk level
const determineRiskLevel = (daysSinceLastContact: number, strength: number): 'low' | 'medium' | 'high' => {
  if (daysSinceLastContact > 60 || strength < 20) return 'high';
  if (daysSinceLastContact > 30 || strength < 40) return 'medium';
  return 'low';
};

export const ABCRelationshipIntelligence = ({ investors, onInvestorSelect }: ABCRelationshipIntelligenceProps) => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all activities for relationship data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [notesRes, followupsRes, activitiesRes] = await Promise.all([
          supabase.from('abc_investor_notes' as any).select('*'),
          supabase.from('abc_investor_followups' as any).select('*'),
          supabase.from('abc_investor_activities' as any).select('*'),
        ]);

        setActivities([
          ...(notesRes.data || []).map((n: any) => ({ ...n, type: 'note' })),
          ...(followupsRes.data || []).map((f: any) => ({ ...f, type: 'followup' })),
          ...(activitiesRes.data || []).map((a: any) => ({ ...a, type: 'activity' })),
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate relationship data for each investor
  const relationshipData: RelationshipData[] = useMemo(() => {
    return investors
      .filter(inv => inv.approvalStatus !== 'not_approved')
      .map(investor => {
        const daysSinceLastContact = investor.lastContactDate 
          ? differenceInDays(new Date(), parseISO(investor.lastContactDate))
          : differenceInDays(new Date(), parseISO(investor.createdAt));
        
        const totalInteractions = 
          (investor.emailOpensCount || 0) + 
          (investor.meetingsCount || 0) + 
          (investor.notesCount || 0) + 
          (investor.emailResponsesCount || 0);

        const relationshipStrength = calculateRelationshipStrength(
          daysSinceLastContact,
          investor.emailOpensCount || 0,
          investor.meetingsCount || 0,
          investor.notesCount || 0,
          investor.emailResponsesCount || 0
        );

        return {
          investorId: investor.id,
          investorName: investor.nome,
          company: investor.azienda,
          relationshipStrength,
          daysSinceLastContact,
          totalInteractions,
          emailsCount: investor.emailOpensCount || 0,
          meetingsCount: investor.meetingsCount || 0,
          notesCount: investor.notesCount || 0,
          responsesCount: investor.emailResponsesCount || 0,
          trend: determineTrend(daysSinceLastContact, totalInteractions),
          riskLevel: determineRiskLevel(daysSinceLastContact, relationshipStrength),
          owner: investor.relationshipOwner || 'Non assegnato',
          pipelineValue: investor.pipelineValue || 0,
        };
      })
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength);
  }, [investors]);

  // Team connections mapping
  const teamConnections: TeamConnection[] = useMemo(() => {
    const ownerMap = new Map<string, RelationshipData[]>();
    
    relationshipData.forEach(rel => {
      const existing = ownerMap.get(rel.owner) || [];
      ownerMap.set(rel.owner, [...existing, rel]);
    });

    return Array.from(ownerMap.entries()).map(([owner, connections]) => ({
      teamMember: owner,
      connectedInvestors: connections.map(c => c.investorName),
      totalConnections: connections.length,
      strongConnections: connections.filter(c => c.relationshipStrength >= 50).length,
    })).sort((a, b) => b.totalConnections - a.totalConnections);
  }, [relationshipData]);

  // Risk analysis
  const riskAnalysis = useMemo(() => {
    const highRisk = relationshipData.filter(r => r.riskLevel === 'high');
    const mediumRisk = relationshipData.filter(r => r.riskLevel === 'medium');
    const atRiskPipelineValue = [...highRisk, ...mediumRisk].reduce((sum, r) => sum + r.pipelineValue, 0);
    
    return {
      highRisk,
      mediumRisk,
      atRiskPipelineValue,
      averageStrength: relationshipData.length > 0 
        ? Math.round(relationshipData.reduce((sum, r) => sum + r.relationshipStrength, 0) / relationshipData.length)
        : 0,
    };
  }, [relationshipData]);

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-green-400';
    if (strength >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrengthBg = (strength: number) => {
    if (strength >= 70) return 'bg-green-500';
    if (strength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-400 rotate-90" />;
      default: return <Activity className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alto Rischio</Badge>;
      case 'medium': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medio</Badge>;
      default: return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Basso</Badge>;
    }
  };

  const handleViewProfile = (investorId: string) => {
    navigate(`/abc-company-console/investor/${investorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Caricamento dati relazioni...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#2a3342] to-[#1a2332] border-[#3a4352]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Relationship Score Medio</p>
                <p className={`text-3xl font-bold ${getStrengthColor(riskAnalysis.averageStrength)}`}>
                  {riskAnalysis.averageStrength}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#2a3342] to-[#1a2332] border-[#3a4352]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Relazioni Forti</p>
                <p className="text-3xl font-bold text-green-400">
                  {relationshipData.filter(r => r.relationshipStrength >= 50).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#2a3342] to-[#1a2332] border-[#3a4352]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">A Rischio</p>
                <p className="text-3xl font-bold text-red-400">
                  {riskAnalysis.highRisk.length + riskAnalysis.mediumRisk.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#2a3342] to-[#1a2332] border-[#3a4352]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Pipeline a Rischio</p>
                <p className="text-3xl font-bold text-yellow-400">
                  €{(riskAnalysis.atRiskPipelineValue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="bg-[#2a3342] border-[#3a4352]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Heart className="h-4 w-4 mr-2" />
            Strength Overview
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Network className="h-4 w-4 mr-2" />
            Team Network
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Clock className="h-4 w-4 mr-2" />
            Activity Timeline
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <Card className="bg-[#2a3342] border-[#3a4352]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-400" />
                Relationship Strength Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {relationshipData.slice(0, 20).map((rel, index) => (
                    <div 
                      key={rel.investorId}
                      className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg border border-[#3a4352] hover:border-orange-500/30 transition-colors cursor-pointer"
                      onClick={() => handleViewProfile(rel.investorId)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{rel.investorName}</p>
                          <p className="text-white/60 text-sm">{rel.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {/* Interaction counts */}
                        <TooltipProvider>
                          <div className="flex items-center gap-3 text-white/60 text-sm">
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{rel.emailsCount}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Email aperte</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{rel.meetingsCount}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Meeting</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{rel.notesCount}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Note</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        {/* Last contact */}
                        <div className="text-white/60 text-sm w-24 text-right">
                          {rel.daysSinceLastContact === 0 
                            ? 'Oggi' 
                            : rel.daysSinceLastContact === 1 
                              ? 'Ieri'
                              : `${rel.daysSinceLastContact}g fa`}
                        </div>

                        {/* Trend */}
                        <div className="w-8">
                          {getTrendIcon(rel.trend)}
                        </div>

                        {/* Strength score */}
                        <div className="w-24">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={rel.relationshipStrength} 
                              className="h-2 flex-1"
                            />
                            <span className={`text-sm font-bold ${getStrengthColor(rel.relationshipStrength)}`}>
                              {rel.relationshipStrength}
                            </span>
                          </div>
                        </div>

                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-orange-400 hover:text-orange-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(rel.investorId);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamConnections.map((team) => (
              <Card key={team.teamMember} className="bg-[#2a3342] border-[#3a4352]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-orange-500/20">
                        <AvatarFallback className="text-orange-400 text-sm">
                          {team.teamMember.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-base">{team.teamMember}</CardTitle>
                        <p className="text-white/60 text-sm">
                          {team.totalConnections} connessioni • {team.strongConnections} forti
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{team.totalConnections}</div>
                      <p className="text-white/60 text-xs">Investitori</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {team.connectedInvestors.slice(0, 6).map((investor, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-white/80 border-[#3a4352] text-xs"
                      >
                        {investor.split(' ')[0]}
                      </Badge>
                    ))}
                    {team.connectedInvestors.length > 6 && (
                      <Badge variant="outline" className="text-orange-400 border-orange-500/30 text-xs">
                        +{team.connectedInvestors.length - 6} altri
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risk" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* High Risk */}
            <Card className="bg-[#2a3342] border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alto Rischio ({riskAnalysis.highRisk.length})
                </CardTitle>
                <p className="text-white/60 text-sm">Nessun contatto da oltre 60 giorni o score &lt; 20</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {riskAnalysis.highRisk.map((rel) => (
                      <div 
                        key={rel.investorId}
                        className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors"
                        onClick={() => handleViewProfile(rel.investorId)}
                      >
                        <div>
                          <p className="text-white font-medium">{rel.investorName}</p>
                          <p className="text-white/60 text-sm">{rel.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-400 font-bold">{rel.daysSinceLastContact}g</p>
                          <p className="text-white/60 text-xs">senza contatto</p>
                        </div>
                      </div>
                    ))}
                    {riskAnalysis.highRisk.length === 0 && (
                      <p className="text-white/60 text-center py-4">Nessun investitore ad alto rischio</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Medium Risk */}
            <Card className="bg-[#2a3342] border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Rischio Medio ({riskAnalysis.mediumRisk.length})
                </CardTitle>
                <p className="text-white/60 text-sm">Nessun contatto da 30-60 giorni o score 20-40</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {riskAnalysis.mediumRisk.map((rel) => (
                      <div 
                        key={rel.investorId}
                        className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                        onClick={() => handleViewProfile(rel.investorId)}
                      >
                        <div>
                          <p className="text-white font-medium">{rel.investorName}</p>
                          <p className="text-white/60 text-sm">{rel.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold">{rel.daysSinceLastContact}g</p>
                          <p className="text-white/60 text-xs">senza contatto</p>
                        </div>
                      </div>
                    ))}
                    {riskAnalysis.mediumRisk.length === 0 && (
                      <p className="text-white/60 text-center py-4">Nessun investitore a rischio medio</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Risk Summary */}
          <Card className="bg-[#2a3342] border-[#3a4352] mt-4">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-white/60 text-sm">Relazioni a Rischio</p>
                  <p className="text-3xl font-bold text-red-400">
                    {Math.round(((riskAnalysis.highRisk.length + riskAnalysis.mediumRisk.length) / relationshipData.length) * 100) || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Pipeline a Rischio</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    €{(riskAnalysis.atRiskPipelineValue / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Azione Urgente</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {riskAnalysis.highRisk.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-4">
          <Card className="bg-[#2a3342] border-[#3a4352]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-400" />
                Timeline Interazioni Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="relative pl-6 space-y-4">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#3a4352]" />
                  
                  {activities
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 30)
                    .map((activity, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-4 w-3 h-3 rounded-full ${
                          activity.type === 'note' ? 'bg-blue-500' :
                          activity.type === 'followup' ? 'bg-green-500' :
                          'bg-orange-500'
                        }`} />
                        
                        <div className="p-3 bg-[#1a2332] rounded-lg border border-[#3a4352]">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {activity.type === 'note' && <MessageSquare className="h-4 w-4 text-blue-400" />}
                                {activity.type === 'followup' && <Calendar className="h-4 w-4 text-green-400" />}
                                {activity.type === 'activity' && <Zap className="h-4 w-4 text-orange-400" />}
                                <span className="text-white font-medium">
                                  {activity.investor_name || 'Unknown'}
                                </span>
                              </div>
                              <p className="text-white/60 text-sm">
                                {activity.note_text || activity.description || activity.activity_description || 'Attività registrata'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/40 text-xs">
                                {format(new Date(activity.created_at), 'dd MMM yyyy', { locale: it })}
                              </p>
                              <p className="text-white/40 text-xs">
                                {format(new Date(activity.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                          {activity.created_by && (
                            <p className="text-white/40 text-xs mt-2">
                              di {activity.created_by.split('@')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {activities.length === 0 && (
                    <p className="text-white/60 text-center py-8">Nessuna attività recente</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABCRelationshipIntelligence;
