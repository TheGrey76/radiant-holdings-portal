import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Loader2, Check, X, AlertCircle, RefreshCw, 
  User, Mail, Phone, Linkedin, FileText, Target, DollarSign,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email: string | null;
  phone: string | null;
  ruolo: string | null;
  categoria: string;
  linkedin: string | null;
}

interface EnrichedData {
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  bio: string | null;
  investmentFocus: string[] | null;
  ticketSize: string | null;
  recentDeals: string[] | null;
  notes: string | null;
  confidence: 'high' | 'medium' | 'low';
}

interface ABCAIEnrichmentProps {
  onDataUpdated?: () => void;
}

const ABCAIEnrichment: React.FC<ABCAIEnrichmentProps> = ({ onDataUpdated }) => {
  const [investorsToEnrich, setInvestorsToEnrich] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, { data: EnrichedData; status: 'success' | 'partial' | 'error' }>>({});
  const [bulkEnriching, setBulkEnriching] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const stopRef = useRef(false);

  const fetchInvestorsToEnrich = async () => {
    setLoading(true);
    try {
      // Fetch investors missing key data (email, phone, linkedin, or note)
      const { data, error } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, email, phone, ruolo, categoria, linkedin')
        .or('email.is.null,phone.is.null,linkedin.is.null,email.eq.,phone.eq.,linkedin.eq.')
        .order('nome');

      if (error) throw error;
      setInvestorsToEnrich(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Errore nel caricamento investitori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorsToEnrich();
  }, []);

  const getMissingFields = (investor: Investor): string[] => {
    const missing: string[] = [];
    if (!investor.email) missing.push('email');
    if (!investor.phone) missing.push('phone');
    if (!investor.linkedin) missing.push('linkedin');
    return missing;
  };

  const enrichInvestor = async (investor: Investor) => {
    setEnrichingIds(prev => new Set(prev).add(investor.id));

    try {
      const { data, error } = await supabase.functions.invoke('ai-investor-enrichment', {
        body: {
          investorId: investor.id,
          nome: investor.nome,
          azienda: investor.azienda,
          ruolo: investor.ruolo,
          categoria: investor.categoria,
        },
      });

      if (error) throw error;

      if (data.success) {
        const enrichedData = data.data as EnrichedData;
        const hasData = enrichedData.email || enrichedData.phone || enrichedData.linkedin || enrichedData.bio;
        
        setResults(prev => ({
          ...prev,
          [investor.id]: { 
            data: enrichedData, 
            status: hasData ? (enrichedData.confidence === 'high' ? 'success' : 'partial') : 'error' 
          },
        }));

        if (data.updated) {
          toast.success(`Dati arricchiti per ${investor.nome}`);
          // Refresh the list
          fetchInvestorsToEnrich();
          onDataUpdated?.();
        } else {
          toast.info(`Nessun nuovo dato trovato per ${investor.nome}`);
        }
      }
    } catch (error: any) {
      console.error('Error enriching investor:', error);
      setResults(prev => ({
        ...prev,
        [investor.id]: { 
          data: {} as EnrichedData, 
          status: 'error' 
        },
      }));
      
      if (error.message?.includes('429')) {
        toast.error('Rate limit raggiunto. Riprova tra poco.');
      } else if (error.message?.includes('402')) {
        toast.error('Crediti AI esauriti. Ricarica il workspace.');
      } else {
        toast.error(`Errore nell'arricchimento per ${investor.nome}`);
      }
    } finally {
      setEnrichingIds(prev => {
        const next = new Set(prev);
        next.delete(investor.id);
        return next;
      });
    }
  };

  const enrichPercentage = async (percentage: number) => {
    setBulkEnriching(true);
    setBulkProgress(0);
    stopRef.current = false;
    
    const toEnrich = investorsToEnrich.filter(i => !results[i.id]);
    const count = Math.max(1, Math.ceil(toEnrich.length * (percentage / 100)));
    const subset = toEnrich.slice(0, count);
    let completed = 0;

    for (const investor of subset) {
      // Check if user requested stop
      if (stopRef.current) {
        toast.info(`Enrichment interrotto dopo ${completed} investitori`);
        break;
      }
      
      await enrichInvestor(investor);
      completed++;
      setBulkProgress(Math.round((completed / subset.length) * 100));
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setBulkEnriching(false);
    if (!stopRef.current) {
      toast.success(`Arricchimento completato: ${completed} investitori`);
    }
    stopRef.current = false;
  };

  const stopEnrichment = () => {
    stopRef.current = true;
    toast.info('Interruzione in corso...');
  };

  const toggleExpanded = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Media</Badge>;
      default:
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">Bassa</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Enrichment</CardTitle>
            <Badge variant="secondary">{investorsToEnrich.length} da arricchire</Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInvestorsToEnrich}
              disabled={loading || bulkEnriching}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => enrichPercentage(25)}
              disabled={bulkEnriching || investorsToEnrich.length === 0}
            >
              {bulkEnriching ? <Loader2 className="h-4 w-4 animate-spin" /> : '25%'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => enrichPercentage(50)}
              disabled={bulkEnriching || investorsToEnrich.length === 0}
            >
              {bulkEnriching ? <Loader2 className="h-4 w-4 animate-spin" /> : '50%'}
            </Button>
            {bulkEnriching ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={stopEnrichment}
              >
                <X className="h-4 w-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => enrichPercentage(100)}
                disabled={investorsToEnrich.length === 0}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                100%
              </Button>
            )}
          </div>
        </div>
        {bulkEnriching && (
          <Progress value={bulkProgress} className="h-2 mt-3" />
        )}
      </CardHeader>
      <CardContent>
        {investorsToEnrich.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>Tutti gli investitori hanno dati completi</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {investorsToEnrich.map(investor => (
                <InvestorEnrichRow
                  key={investor.id}
                  investor={investor}
                  isEnriching={enrichingIds.has(investor.id)}
                  result={results[investor.id]}
                  missingFields={getMissingFields(investor)}
                  isExpanded={expandedRows.has(investor.id)}
                  onEnrich={() => enrichInvestor(investor)}
                  onToggleExpand={() => toggleExpanded(investor.id)}
                  getConfidenceBadge={getConfidenceBadge}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

interface InvestorEnrichRowProps {
  investor: Investor;
  isEnriching: boolean;
  result?: { data: EnrichedData; status: 'success' | 'partial' | 'error' };
  missingFields: string[];
  isExpanded: boolean;
  onEnrich: () => void;
  onToggleExpand: () => void;
  getConfidenceBadge: (confidence: string) => React.ReactNode;
}

const InvestorEnrichRow: React.FC<InvestorEnrichRowProps> = ({
  investor,
  isEnriching,
  result,
  missingFields,
  isExpanded,
  onEnrich,
  onToggleExpand,
  getConfidenceBadge,
}) => {
  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <div className="rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center justify-between p-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium truncate">{investor.nome}</span>
              {getStatusIcon()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="truncate">{investor.azienda}</span>
              {investor.ruolo && (
                <>
                  <span>•</span>
                  <span className="truncate">{investor.ruolo}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {missingFields.map(field => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field === 'email' && <Mail className="h-3 w-3 mr-1" />}
                  {field === 'phone' && <Phone className="h-3 w-3 mr-1" />}
                  {field === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                  {field}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {result && result.status !== 'error' && (
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            )}
            <Button
              size="sm"
              onClick={onEnrich}
              disabled={isEnriching}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isEnriching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          {result && result.data && (
            <div className="px-3 pb-3 border-t border-border/50 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">RISULTATI AI</span>
                {result.data.confidence && getConfidenceBadge(result.data.confidence)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {result.data.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="truncate">{result.data.email}</span>
                  </div>
                )}
                {result.data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{result.data.phone}</span>
                  </div>
                )}
                {result.data.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-primary" />
                    <a 
                      href={result.data.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {result.data.ticketSize && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>{result.data.ticketSize}</span>
                  </div>
                )}
              </div>

              {result.data.investmentFocus && result.data.investmentFocus.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <Target className="h-3 w-3" /> FOCUS INVESTIMENTI
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.data.investmentFocus.map((focus, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.data.bio && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">BIO</span>
                  <p className="text-sm text-foreground mt-1">{result.data.bio}</p>
                </div>
              )}

              {result.data.recentDeals && result.data.recentDeals.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">DEAL RECENTI</span>
                  <ul className="text-sm text-foreground mt-1 list-disc list-inside">
                    {result.data.recentDeals.slice(0, 3).map((deal, idx) => (
                      <li key={idx}>{deal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.data.notes && (
                <div className="bg-primary/5 p-2 rounded">
                  <span className="text-xs font-semibold text-primary">💡 NOTE FUNDRAISING</span>
                  <p className="text-sm text-foreground mt-1">{result.data.notes}</p>
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ABCAIEnrichment;
