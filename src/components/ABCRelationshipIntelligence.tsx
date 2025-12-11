import { useState, useEffect, useMemo } from "react";
import { 
  Users, TrendingUp, Clock, Mail, Calendar, MessageSquare, 
  Phone, Zap, Network, UserCheck, AlertTriangle, ArrowUpRight,
  Activity, Target, Heart, Star, Eye, X, ChevronRight, Sparkles,
  Link2, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, parseISO } from "date-fns";
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

interface TeamMemberConnection {
  name: string;
  email: string;
  strength: number;
  lastInteraction: string;
  interactionCount: number;
}

interface RelationshipProfile {
  investorId: string;
  investorName: string;
  company: string;
  relationshipStrength: number;
  daysSinceLastContact: number;
  status: string;
  owner: string;
  totalInteractions: number;
  emailsCount: number;
  meetingsCount: number;
  notesCount: number;
  responsesCount: number;
  teamConnections: TeamMemberConnection[];
  yourConnections: TeamMemberConnection[];
  bestIntroPath: TeamMemberConnection | null;
  pipelineValue: number;
}

interface ABCRelationshipIntelligenceProps {
  investors: Investor[];
  onInvestorSelect?: (investorId: string) => void;
}

// Team members for the console
const TEAM_MEMBERS = [
  { name: "Edoardo Grigione", email: "edoardo.grigione@aries76.com" },
  { name: "Stefano Taioli", email: "stefano.taioli@abccompany.it" },
  { name: "Enrico Sobacchi", email: "enrico.sobacchi@abccompany.it" },
  { name: "Lorenzo Del Forno", email: "lorenzo.delforno@abccompany.it" },
  { name: "Alessandro Catullo", email: "alessandro.catullo@aries76.com" },
];

// Calculate relationship strength (0-100)
const calculateRelationshipStrength = (
  daysSinceLastContact: number,
  emailsCount: number,
  meetingsCount: number,
  notesCount: number,
  responsesCount: number
): number => {
  const recencyScore = Math.max(0, 40 - (daysSinceLastContact * 0.5));
  const frequencyScore = Math.min(30, 
    (emailsCount * 2) + (meetingsCount * 8) + (responsesCount * 5) + (notesCount * 1)
  );
  const engagementScore = Math.min(30, (responsesCount * 10) + (meetingsCount * 5));
  return Math.round(recencyScore + frequencyScore + engagementScore);
};

export const ABCRelationshipIntelligence = ({ investors, onInvestorSelect }: ABCRelationshipIntelligenceProps) => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<RelationshipProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserEmail = sessionStorage.getItem('abc_console_email') || '';

  // Fetch all activities to calculate team connections
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

  // Calculate team connections for an investor
  const getTeamConnections = (investorName: string): TeamMemberConnection[] => {
    const connectionMap = new Map<string, { count: number; lastDate: string }>();
    
    activities
      .filter(a => a.investor_name?.includes(investorName.split(' ')[0]))
      .forEach(activity => {
        const createdBy = activity.created_by;
        if (createdBy) {
          const existing = connectionMap.get(createdBy) || { count: 0, lastDate: '' };
          connectionMap.set(createdBy, {
            count: existing.count + 1,
            lastDate: activity.created_at > existing.lastDate ? activity.created_at : existing.lastDate
          });
        }
      });

    return TEAM_MEMBERS.map(member => {
      const connection = connectionMap.get(member.email) || { count: 0, lastDate: '' };
      const daysSince = connection.lastDate 
        ? differenceInDays(new Date(), parseISO(connection.lastDate))
        : 999;
      
      // Calculate strength based on interactions and recency
      const strength = Math.min(100, Math.max(0,
        (connection.count * 15) + Math.max(0, 40 - daysSince)
      ));

      return {
        name: member.name,
        email: member.email,
        strength,
        lastInteraction: connection.lastDate || '',
        interactionCount: connection.count
      };
    }).filter(c => c.interactionCount > 0).sort((a, b) => b.strength - a.strength);
  };

  // Build relationship profiles
  const relationshipProfiles: RelationshipProfile[] = useMemo(() => {
    return investors
      .filter(inv => inv.approvalStatus !== 'not_approved')
      .map(investor => {
        const daysSinceLastContact = investor.lastContactDate 
          ? differenceInDays(new Date(), parseISO(investor.lastContactDate))
          : differenceInDays(new Date(), parseISO(investor.createdAt));
        
        const teamConnections = getTeamConnections(investor.nome);
        const yourConnections = teamConnections.filter(c => c.email === currentUserEmail);
        const bestIntroPath = teamConnections.length > 0 ? teamConnections[0] : null;

        return {
          investorId: investor.id,
          investorName: investor.nome,
          company: investor.azienda,
          relationshipStrength: calculateRelationshipStrength(
            daysSinceLastContact,
            investor.emailOpensCount || 0,
            investor.meetingsCount || 0,
            investor.notesCount || 0,
            investor.emailResponsesCount || 0
          ),
          daysSinceLastContact,
          status: investor.status,
          owner: investor.relationshipOwner || 'Non assegnato',
          totalInteractions: (investor.emailOpensCount || 0) + (investor.meetingsCount || 0) + 
                           (investor.notesCount || 0) + (investor.emailResponsesCount || 0),
          emailsCount: investor.emailOpensCount || 0,
          meetingsCount: investor.meetingsCount || 0,
          notesCount: investor.notesCount || 0,
          responsesCount: investor.emailResponsesCount || 0,
          teamConnections,
          yourConnections,
          bestIntroPath,
          pipelineValue: investor.pipelineValue || 0,
        };
      })
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength);
  }, [investors, activities, currentUserEmail]);

  // Filter profiles
  const filteredProfiles = relationshipProfiles.filter(p => 
    p.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = useMemo(() => {
    const strongRelations = relationshipProfiles.filter(r => r.relationshipStrength >= 50).length;
    const atRisk = relationshipProfiles.filter(r => r.daysSinceLastContact > 30).length;
    const avgStrength = relationshipProfiles.length > 0
      ? Math.round(relationshipProfiles.reduce((sum, r) => sum + r.relationshipStrength, 0) / relationshipProfiles.length)
      : 0;
    const totalConnections = relationshipProfiles.reduce((sum, r) => sum + r.teamConnections.length, 0);
    return { strongRelations, atRisk, avgStrength, totalConnections };
  }, [relationshipProfiles]);

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-green-500';
    if (strength >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrengthBg = (strength: number) => {
    if (strength >= 70) return 'bg-green-500';
    if (strength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'To Contact': 'bg-slate-500/20 text-slate-400',
      'Contacted': 'bg-blue-500/20 text-blue-400',
      'Interested': 'bg-yellow-500/20 text-yellow-400',
      'Meeting Scheduled': 'bg-purple-500/20 text-purple-400',
      'In Negotiation': 'bg-orange-500/20 text-orange-400',
      'Closed': 'bg-green-500/20 text-green-400',
      'Not Interested': 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const formatLastContact = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading relationship data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            Relationship Intelligence
          </h2>
          <p className="text-muted-foreground">Unlock the power of your firm's network</p>
        </div>
      </div>

      {/* KPI Cards - Affinity Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Strength</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgStrength}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Strong Relations</p>
                <p className="text-2xl font-bold text-foreground">{stats.strongRelations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Link2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Team Connections</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Need Attention</p>
                <p className="text-2xl font-bold text-foreground">{stats.atRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* Contacts Table - Affinity Style */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Team Knows</TableHead>
                <TableHead className="text-right">Strength</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow 
                  key={profile.investorId}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {profile.investorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{profile.investorName}</p>
                        <p className="text-sm text-muted-foreground">{profile.company}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(profile.status)}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{profile.owner}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${profile.daysSinceLastContact > 30 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {formatLastContact(profile.daysSinceLastContact)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{profile.teamConnections.length}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthBg(profile.relationshipStrength)}`}
                          style={{ width: `${profile.relationshipStrength}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getStrengthColor(profile.relationshipStrength)}`}>
                        {profile.relationshipStrength}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Relationship Profile Sheet - Affinity Style */}
      <Sheet open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto">
          {selectedProfile && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {selectedProfile.investorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-xl">{selectedProfile.investorName}</SheetTitle>
                    <p className="text-muted-foreground">{selectedProfile.company}</p>
                    <Badge className={`mt-2 ${getStatusBadge(selectedProfile.status)}`}>
                      {selectedProfile.status}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              {/* Relationship Score */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Relationship Strength</span>
                    <span className={`text-2xl font-bold ${getStrengthColor(selectedProfile.relationshipStrength)}`}>
                      {selectedProfile.relationshipStrength}/100
                    </span>
                  </div>
                  <Progress value={selectedProfile.relationshipStrength} className="h-3" />
                </CardContent>
              </Card>

              {/* Team Connections - Affinity Style */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    People Your Team Knows
                  </h3>
                  <Badge variant="outline">{selectedProfile.teamConnections.length}</Badge>
                </div>

                {selectedProfile.teamConnections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                    No team connections yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedProfile.teamConnections.map((connection, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/20 text-primary text-sm">
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{connection.name}</p>
                            {idx === 0 && (
                              <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Best Intro
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {connection.interactionCount} interactions
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getStrengthBg(connection.strength)}`}
                                style={{ width: `${connection.strength}%` }}
                              />
                            </div>
                            <BarChart3 className={`h-4 w-4 ${getStrengthColor(connection.strength)}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Best Introduction Path */}
              {selectedProfile.bestIntroPath && (
                <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                  <CardContent className="p-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Recommended Introduction
                    </h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-yellow-500/20 text-yellow-600">
                          {selectedProfile.bestIntroPath.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{selectedProfile.bestIntroPath.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Strongest connection • Score: {selectedProfile.bestIntroPath.strength}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Mail className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-lg font-bold">{selectedProfile.emailsCount}</p>
                  <p className="text-xs text-muted-foreground">Emails Opened</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold">{selectedProfile.meetingsCount}</p>
                  <p className="text-xs text-muted-foreground">Meetings</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <MessageSquare className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <p className="text-lg font-bold">{selectedProfile.notesCount}</p>
                  <p className="text-xs text-muted-foreground">Notes</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                  <p className="text-lg font-bold">{selectedProfile.responsesCount}</p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </div>
              </div>

              {/* Last Contact Warning */}
              {selectedProfile.daysSinceLastContact > 30 && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-500">Relationship at risk</p>
                      <p className="text-sm text-muted-foreground">
                        No contact for {selectedProfile.daysSinceLastContact} days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    navigate(`/abc-company-console/investor/${selectedProfile.investorId}`);
                    setSelectedProfile(null);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ABCRelationshipIntelligence;
