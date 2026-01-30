import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, Mail, Linkedin, Sparkles, X, 
  RefreshCw, StopCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useABCData } from '@/contexts/ABCDataContext';

interface ABCUnifiedEnrichmentProps {
  showAfterImport?: boolean;
  importedCount?: number;
  onDismissImportAlert?: () => void;
}

export const ABCUnifiedEnrichment: React.FC<ABCUnifiedEnrichmentProps> = ({
  showAfterImport = false,
  importedCount = 0,
  onDismissImportAlert,
}) => {
  const {
    missingDataStats,
    isLoadingInvestors,
    isEnriching,
    enrichProgress,
    enrichInvestors,
    stopEnrichment,
    refreshAll,
  } = useABCData();

  const [dismissed, setDismissed] = React.useState(false);
  const [showDetailDialog, setShowDetailDialog] = React.useState(false);
  const [enrichedCount, setEnrichedCount] = React.useState(0);

  const handleDismiss = () => {
    setDismissed(true);
    onDismissImportAlert?.();
  };

  const handleEnrichPercentage = async (percentage: number) => {
    setEnrichedCount(0);
    await enrichInvestors(percentage);
  };

  // Don't show if dismissed, loading, or no missing data
  if (dismissed || isLoadingInvestors) return null;
  if (!missingDataStats || (missingDataStats.missingEmail === 0 && missingDataStats.missingLinkedin === 0)) return null;

  const totalMissing = missingDataStats.investorsWithMissingData.length;
  const completenessPercent = Math.round(((missingDataStats.totalInvestors - totalMissing) / missingDataStats.totalInvestors) * 100);

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
                    <span><strong>{missingDataStats.missingEmail}</strong> senza email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Linkedin className="h-4 w-4 text-amber-500" />
                    <span><strong>{missingDataStats.missingLinkedin}</strong> senza LinkedIn</span>
                  </div>
                </div>

                {isEnriching && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Arricchimento in corso...</span>
                      <span className="text-xs font-medium">{enrichProgress}%</span>
                    </div>
                    <Progress value={enrichProgress} className="h-2" />
                  </div>
                )}

                {!isEnriching && (
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={completenessPercent} className="h-2 flex-1 max-w-[200px]" />
                    <span className="text-xs text-muted-foreground">{completenessPercent}% completo</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEnriching ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={stopEnrichment}
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop ({enrichProgress}%)
                    </Button>
                  ) : (
                    <>
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
                    </>
                  )}
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
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <Badge variant="outline" className="gap-1">
                <Mail className="h-3 w-3" />
                {missingDataStats.missingEmail} email mancanti
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Linkedin className="h-3 w-3" />
                {missingDataStats.missingLinkedin} LinkedIn mancanti
              </Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshAll}
                disabled={isEnriching}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {isEnriching ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopEnrichment}
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
              {missingDataStats.investorsWithMissingData.map(investor => (
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

export default ABCUnifiedEnrichment;
