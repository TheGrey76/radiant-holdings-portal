import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Mail, Loader2, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  email: string | null;
  ruolo: string | null;
  categoria: string;
}

interface ABCEmailEnrichmentProps {
  onEmailUpdated?: () => void;
}

const ABCEmailEnrichment: React.FC<ABCEmailEnrichmentProps> = ({ onEmailUpdated }) => {
  const [investorsWithoutEmail, setInvestorsWithoutEmail] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingIds, setSearchingIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, { email: string | null; confidence: number; status: 'found' | 'not_found' | 'error' }>>({});
  const [bulkSearching, setBulkSearching] = useState(false);

  const fetchInvestorsWithoutEmail = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, email, ruolo, categoria')
        .or('email.is.null,email.eq.')
        .order('nome');

      if (error) throw error;
      setInvestorsWithoutEmail(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Errore nel caricamento investitori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorsWithoutEmail();
  }, []);

  const parseFullName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  };

  const searchEmail = async (investor: Investor) => {
    setSearchingIds(prev => new Set(prev).add(investor.id));
    
    try {
      const { firstName, lastName } = parseFullName(investor.nome);
      
      const { data, error } = await supabase.functions.invoke('search-email', {
        body: {
          firstName,
          lastName,
          company: investor.azienda,
          investorId: investor.id,
        },
      });

      if (error) throw error;

      if (data.email) {
        setResults(prev => ({
          ...prev,
          [investor.id]: { email: data.email, confidence: data.confidence, status: 'found' },
        }));
        toast.success(`Email trovata per ${investor.nome}: ${data.email}`);
        // Remove from list
        setInvestorsWithoutEmail(prev => prev.filter(i => i.id !== investor.id));
        onEmailUpdated?.();
      } else {
        setResults(prev => ({
          ...prev,
          [investor.id]: { email: null, confidence: 0, status: 'not_found' },
        }));
        toast.info(`Nessuna email trovata per ${investor.nome}`);
      }
    } catch (error) {
      console.error('Error searching email:', error);
      setResults(prev => ({
        ...prev,
        [investor.id]: { email: null, confidence: 0, status: 'error' },
      }));
      toast.error(`Errore nella ricerca per ${investor.nome}`);
    } finally {
      setSearchingIds(prev => {
        const next = new Set(prev);
        next.delete(investor.id);
        return next;
      });
    }
  };

  const searchAllEmails = async () => {
    setBulkSearching(true);
    const toSearch = investorsWithoutEmail.filter(i => !results[i.id]);
    
    for (const investor of toSearch) {
      await searchEmail(investor);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setBulkSearching(false);
    toast.success('Ricerca completata');
  };

  const manualUpdateEmail = async (investorId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('abc_investors')
        .update({ email })
        .eq('id', investorId);

      if (error) throw error;
      
      toast.success('Email aggiornata');
      setInvestorsWithoutEmail(prev => prev.filter(i => i.id !== investorId));
      onEmailUpdated?.();
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Errore nell\'aggiornamento');
    }
  };

  const getStatusIcon = (investorId: string) => {
    const result = results[investorId];
    if (!result) return null;
    
    switch (result.status) {
      case 'found':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'not_found':
        return <X className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Email Mancanti</CardTitle>
            <Badge variant="secondary">{investorsWithoutEmail.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInvestorsWithoutEmail}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={searchAllEmails}
              disabled={bulkSearching || investorsWithoutEmail.length === 0}
            >
              {bulkSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ricerca in corso...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Cerca Tutte
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {investorsWithoutEmail.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>Tutti gli investitori hanno un'email associata</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {investorsWithoutEmail.map(investor => (
                <InvestorRow
                  key={investor.id}
                  investor={investor}
                  isSearching={searchingIds.has(investor.id)}
                  result={results[investor.id]}
                  onSearch={() => searchEmail(investor)}
                  onManualUpdate={(email) => manualUpdateEmail(investor.id, email)}
                  statusIcon={getStatusIcon(investor.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

interface InvestorRowProps {
  investor: Investor;
  isSearching: boolean;
  result?: { email: string | null; confidence: number; status: 'found' | 'not_found' | 'error' };
  onSearch: () => void;
  onManualUpdate: (email: string) => void;
  statusIcon: React.ReactNode;
}

const InvestorRow: React.FC<InvestorRowProps> = ({
  investor,
  isSearching,
  result,
  onSearch,
  onManualUpdate,
  statusIcon,
}) => {
  const [manualEmail, setManualEmail] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{investor.nome}</span>
          {statusIcon}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">{investor.azienda}</span>
          {investor.ruolo && (
            <>
              <span>•</span>
              <span className="truncate">{investor.ruolo}</span>
            </>
          )}
        </div>
        {result?.status === 'not_found' && (
          <p className="text-xs text-yellow-600 mt-1">Nessun risultato automatico</p>
        )}
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {showManualInput ? (
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="email@esempio.com"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="w-48 h-8 text-sm"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (manualEmail) {
                  onManualUpdate(manualEmail);
                  setShowManualInput(false);
                  setManualEmail('');
                }
              }}
              disabled={!manualEmail}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowManualInput(false);
                setManualEmail('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowManualInput(true)}
            >
              Manuale
            </Button>
            <Button
              size="sm"
              onClick={onSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ABCEmailEnrichment;
