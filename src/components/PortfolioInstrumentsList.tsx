import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, RefreshCcw, AlertCircle } from 'lucide-react';
import { PortfolioHolding } from '@/hooks/usePortfolioGU';

interface PortfolioInstrumentsListProps {
  holdings: PortfolioHolding[];
  loading: boolean;
  onStartReplacement?: (isin: string, positionLabel: string, name: string) => void;
}

const positionColors: Record<string, { border: string; badge: string; secondary: string }> = {
  'A': { border: 'border-l-slate-700', badge: 'bg-slate-700 text-white', secondary: 'bg-slate-100 text-slate-800' },
  'B': { border: 'border-l-blue-600', badge: 'bg-blue-600 text-white', secondary: 'bg-blue-100 text-blue-800' },
  'C': { border: 'border-l-emerald-600', badge: 'bg-emerald-600 text-white', secondary: 'bg-emerald-100 text-emerald-800' },
  'D': { border: 'border-l-amber-600', badge: 'bg-amber-600 text-white', secondary: 'bg-amber-100 text-amber-800' },
  'E': { border: 'border-l-green-600', badge: 'bg-green-600 text-white', secondary: 'bg-green-100 text-green-800' },
};

const getBorsaItalianaUrl = (isin: string) => {
  if (isin.startsWith('XS')) {
    return `https://www.borsaitaliana.it/borsa/cw-e-certificates/eurotlx/scheda/${isin}.html?lang=it`;
  }
  return `https://www.borsaitaliana.it/borsa/cw-e-certificates/scheda/${isin}.html?lang=it`;
};

export const PortfolioInstrumentsList = ({ holdings, loading, onStartReplacement }: PortfolioInstrumentsListProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-l-4 border-l-slate-300 shadow-sm">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-600">Nessun certificato nel portafoglio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {holdings.map((holding) => {
        const colors = positionColors[holding.position_label] || positionColors['A'];
        const wasReplaced = !!holding.replaced_isin;

        return (
          <Card key={holding.id} className={`border-l-4 ${colors.border} shadow-sm`}>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={colors.badge}>{holding.position_label}</Badge>
                    <span className="text-sm text-slate-500 font-mono">{holding.isin}</span>
                    <a
                      href={getBorsaItalianaUrl(holding.isin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Prezzo
                    </a>
                    {wasReplaced && (
                      <Badge variant="outline" className="border-emerald-400 text-emerald-700 bg-emerald-50 text-xs">
                        Sostituito
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    {holding.issuer} — {holding.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2 text-slate-600">
                    {holding.role || 'Certificate Position'}
                  </CardDescription>
                  {wasReplaced && (
                    <p className="text-xs text-slate-500 mt-1">
                      Precedente: <span className="font-mono">{holding.replaced_isin}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-300 text-slate-700">
                    {holding.coupon_pa && holding.coupon_pa !== '-' ? 'Phoenix' : 'Capital Protected'}
                  </Badge>
                  {onStartReplacement && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-amber-400 text-amber-700 hover:bg-amber-50"
                      onClick={() => onStartReplacement(holding.isin, holding.position_label, holding.name)}
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Sostituisci
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Sottostanti</p>
                  <p className="font-semibold text-slate-900 text-sm">{holding.underlyings || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Cedola p.a.</p>
                  <p className="font-semibold text-slate-900">
                    {holding.coupon_pa || '-'}
                  </p>
                  <p className="text-xs text-slate-500">{holding.coupon_frequency || ''}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Barriere</p>
                  <p className="font-semibold text-slate-900">
                    {holding.coupon_barrier || '-'} / {holding.capital_barrier || '-'}
                  </p>
                  <p className="text-xs text-slate-500">Cedola / Capitale</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Scadenza</p>
                  <p className="font-semibold text-slate-900">
                    {holding.maturity_date 
                      ? new Date(holding.maturity_date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Allocazione</p>
                  <p className="font-semibold text-slate-900">{holding.allocation_percent}%</p>
                  <p className="text-xs text-slate-500">€{holding.allocation_amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  {holding.coupon_frequency && holding.coupon_frequency !== '-' && (
                    <Badge variant="secondary" className="text-xs">Memory</Badge>
                  )}
                  {holding.role && (
                    <Badge variant="secondary" className={`text-xs ${colors.secondary}`}>
                      {holding.role}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioInstrumentsList;
