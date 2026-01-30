import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, Mail, Linkedin, Sparkles, X, ChevronDown, ChevronUp,
  Loader2, Check, RefreshCw, StopCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MissingDataStats {
  totalInvestors: number;
  missingEmail: number;
  missingLinkedin: number;
  missingBoth: number;
  investorsWithMissingData: Array<{
    id: string;
    nome: string;
    azienda: string;
    missingEmail: boolean;
    missingLinkedin: boolean;
  }>;
}

interface ABCDataQualityAlertProps {
  onEnrichmentComplete?: () => void;
  showAfterImport?: boolean;
  importedCount?: number;
  onDismissImportAlert?: () => void;
}

export const ABCDataQualityAlert: React.FC<ABCDataQualityAlertProps> = ({
  onEnrichmentComplete,
  showAfterImport = false,
  importedCount = 0,
  onDismissImportAlert
}) => {
  const [stats, setStats] = useState<MissingDataStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState(0);
  const [enrichedCount, setEnrichedCount] = useState(0);
  
  // Ref to track if enrichment should be stopped
  const stopEnrichmentRef = useRef(false);

  const fetchMissingDataStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all investors
      const { data: investors, error } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, email, linkedin')
        .order('nome');

      if (error) throw error;

      const investorList = investors || [];
      const totalInvestors = investorList.length;
      
      const investorsWithMissingData = investorList
        .map(inv => ({
          id: inv.id,
          nome: inv.nome,
          azienda: inv.azienda,
          missingEmail: !inv.email || inv.email.trim() === '',
          missingLinkedin: !inv.linkedin || inv.linkedin.trim() === ''
        }))
        .filter(inv => inv.missingEmail || inv.missingLinkedin);

      const missingEmail = investorsWithMissingData.filter(i => i.missingEmail).length;
      const missingLinkedin = investorsWithMissingData.filter(i => i.missingLinkedin).length;
      const missingBoth = investorsWithMissingData.filter(i => i.missingEmail && i.missingLinkedin).length;

      setStats({
        totalInvestors,
        missingEmail,
        missingLinkedin,
        missingBoth,
        investorsWithMissingData
      });
    } catch (error) {
      console.error('Error fetching missing data stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissingDataStats();
  }, [fetchMissingDataStats]);

  const handleStopEnrichment = () => {
    stopEnrichmentRef.current = true;
    toast.info('Arresto enrichment in corso...');
  };

  const handleEnrichPercentage = async (percentage: number) => {
    if (!stats || stats.investorsWithMissingData.length === 0) return;

    setIsEnriching(true);
    setEnrichProgress(0);
    setEnrichedCount(0);
    stopEnrichmentRef.current = false;

    const allToEnrich = stats.investorsWithMissingData;
    const count = Math.max(1, Math.ceil(allToEnrich.length * (percentage / 100)));
    const toEnrich = allToEnrich.slice(0, count);
    
    let completed = 0;
    let enriched = 0;

    for (const investor of toEnrich) {
      // Check if stop was requested
      if (stopEnrichmentRef.current) {
        toast.warning(`Enrichment interrotto. ${enriched} investitori arricchiti su ${completed} processati.`);
        break;
      }

      try {
        // Get full investor data
        const { data: fullInvestor } = await supabase
          .from('abc_investors')
          .select('*')
          .eq('id', investor.id)
          .single();

        if (fullInvestor) {
          const { data, error } = await supabase.functions.invoke('ai-investor-enrichment', {
            body: {
              investorId: investor.id,
              nome: fullInvestor.nome,
              azienda: fullInvestor.azienda,
              ruolo: fullInvestor.ruolo,
              categoria: fullInvestor.categoria,
            },
          });

          if (!error && data?.updated) {
            enriched++;
            setEnrichedCount(enriched);
          }
        }
      } catch (err) {
        console.error('Error enriching investor:', investor.nome, err);
      }

      completed++;
      setEnrichProgress(Math.round((completed / toEnrich.length) * 100));
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsEnriching(false);
    stopEnrichmentRef.current = false;
    
    // Always refresh stats after enrichment to update counts
    await fetchMissingDataStats();
    
    if (enriched > 0) {
      toast.success(`${enriched} investitori arricchiti con successo!`);
      onEnrichmentComplete?.();
    } else if (!stopEnrichmentRef.current) {
      toast.info('Nessun nuovo dato trovato tramite AI');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismissImportAlert?.();
  };

  // Don't show if dismissed or no missing data
  if (dismissed || loading) return null;
  if (!stats || (stats.missingEmail === 0 && stats.missingLinkedin === 0)) return null;

  const totalMissing = stats.investorsWithMissingData.length;
  const completenessPercent = Math.round(((stats.totalInvestors - totalMissing) / stats.totalInvestors) * 100);

  return (
    <>
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {showAfterImport 
                      ? `${importedCount} investitori importati - Dati incompleti rilevati`
                      : 'Dati incompleti rilevati'
                    }
                  </h4>
                  <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                    {totalMissing} investitori
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-amber-500" />
                    <span><strong>{stats.missingEmail}</strong> senza email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Linkedin className="h-4 w-4 text-amber-500" />
                    <span><strong>{stats.missingLinkedin}</strong> senza LinkedIn</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Progress value={completenessPercent} className="h-2 flex-1 max-w-[200px]" />
                  <span className="text-xs text-muted-foreground">{completenessPercent}% completo</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowDetailDialog(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Arricchisci con AI
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDetailDialog(true)}
                  >
                    Vedi dettagli
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDismiss}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Investitori con Dati Mancanti
            </DialogTitle>
            <DialogDescription>
              {totalMissing} investitori necessitano di email o LinkedIn. Usa l'AI per arricchire automaticamente i dati.
            </DialogDescription>
          </DialogHeader>

          {isEnriching && (
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Arricchimento in corso...</span>
                <span className="text-sm text-muted-foreground">{enrichProgress}%</span>
              </div>
              <Progress value={enrichProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {enrichedCount} dati trovati finora
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <Badge variant="outline" className="gap-1">
                <Mail className="h-3 w-3" />
                {stats.missingEmail} email mancanti
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Linkedin className="h-3 w-3" />
                {stats.missingLinkedin} LinkedIn mancanti
              </Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchMissingDataStats}
                disabled={isEnriching}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {isEnriching ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleStopEnrichment}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop ({enrichProgress}%)
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnrichPercentage(25)}
                    disabled={isEnriching}
                  >
                    25%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnrichPercentage(50)}
                    disabled={isEnriching}
                  >
                    50%
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEnrichPercentage(100)}
                    disabled={isEnriching}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    100% ({totalMissing})
                  </Button>
                </>
              )}
            </div>
          </div>

          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="divide-y">
              {stats.investorsWithMissingData.map(investor => (
                <div key={investor.id} className="flex items-center justify-between p-3 hover:bg-accent/50">
                  <div>
                    <p className="font-medium">{investor.nome}</p>
                    <p className="text-sm text-muted-foreground">{investor.azienda}</p>
                  </div>
                  <div className="flex gap-2">
                    {investor.missingEmail && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30 gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Badge>
                    )}
                    {investor.missingLinkedin && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30 gap-1">
                        <Linkedin className="h-3 w-3" />
                        LinkedIn
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ABCDataQualityAlert;
