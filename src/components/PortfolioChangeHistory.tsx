import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { History, ArrowRight, Calendar, RefreshCcw, Plus, Minus, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface ChangeLogEntry {
  id: string;
  portfolio_id: string;
  change_type: string;
  old_isin: string | null;
  new_isin: string | null;
  old_name: string | null;
  new_name: string | null;
  position_label: string | null;
  reason: string | null;
  changed_at: string;
  changed_by: string | null;
}

interface PortfolioChangeHistoryProps {
  portfolioId: string | null;
}

export const PortfolioChangeHistory = ({ portfolioId }: PortfolioChangeHistoryProps) => {
  const [changes, setChanges] = useState<ChangeLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!portfolioId) return;

    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio_change_log')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('changed_at', { ascending: false });

      if (!error && data) {
        setChanges(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [portfolioId]);

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'replacement':
        return <RefreshCcw className="h-4 w-4" />;
      case 'addition':
        return <Plus className="h-4 w-4" />;
      case 'removal':
        return <Minus className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getChangeBadgeColor = (type: string) => {
    switch (type) {
      case 'replacement':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'addition':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'removal':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getChangeLabel = (type: string) => {
    switch (type) {
      case 'replacement':
        return 'Sostituzione';
      case 'addition':
        return 'Aggiunta';
      case 'removal':
        return 'Rimozione';
      default:
        return 'Modifica';
    }
  };

  if (loading) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-slate-600" />
            Storico Modifiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (changes.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-slate-600" />
            Storico Modifiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <History className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Nessuna modifica registrata</p>
            <p className="text-sm mt-1">Lo storico inizierà dal primo ribilanciamento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-slate-600" />
          Storico Modifiche
          <Badge variant="secondary" className="ml-2">{changes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200" />

            {changes.map((change, index) => (
              <div key={change.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ${
                  change.change_type === 'replacement' ? 'border-amber-400' :
                  change.change_type === 'addition' ? 'border-emerald-400' :
                  change.change_type === 'removal' ? 'border-red-400' :
                  'border-slate-300'
                }`}>
                  {getChangeIcon(change.change_type)}
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className={getChangeBadgeColor(change.change_type)}>
                      {getChangeLabel(change.change_type)}
                    </Badge>
                    {change.position_label && (
                      <Badge variant="secondary" className="text-xs">
                        Posizione {change.position_label}
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(change.changed_at), "d MMM yyyy 'alle' HH:mm", { locale: it })}
                    </span>
                  </div>

                  {change.change_type === 'replacement' && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
                      <div className="flex-1">
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Da</p>
                        <p className="font-mono text-xs text-slate-600">{change.old_isin}</p>
                        <p className="text-slate-700">{change.old_name}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-amber-500 hidden md:block" />
                      <div className="flex-1">
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">A</p>
                        <p className="font-mono text-xs text-emerald-600">{change.new_isin}</p>
                        <p className="text-slate-700 font-medium">{change.new_name}</p>
                      </div>
                    </div>
                  )}

                  {change.change_type === 'addition' && (
                    <div className="text-sm">
                      <p className="font-mono text-xs text-emerald-600">{change.new_isin}</p>
                      <p className="text-slate-700 font-medium">{change.new_name}</p>
                    </div>
                  )}

                  {change.reason && (
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Motivo: {change.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PortfolioChangeHistory;
