import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Shield, Equal } from 'lucide-react';
import { PortfolioHolding } from '@/hooks/usePortfolioGU';
import { Certificate } from '@/components/CertificateListManager';

interface PortfolioComparisonProps {
  holdings: PortfolioHolding[];
  certificates: Certificate[];
  onStartReplacement?: (isin: string, positionLabel: string, name: string) => void;
}

interface ComparisonResult {
  holding: PortfolioHolding;
  alternatives: {
    cert: Certificate;
    couponDelta: number;
    irrDelta: number;
    barrierMatch: boolean;
    sameBarrier: boolean;
    riskLevel: 'lower' | 'same' | 'higher';
    recommendation: 'strong' | 'moderate' | 'weak' | 'none';
    reasons: string[];
  }[];
  verdict: 'keep' | 'consider' | 'replace';
  verdictReason: string;
}

const parsePercent = (val: string | null | undefined): number => {
  if (!val || val === '-') return 0;
  return parseFloat(val.replace('%', '')) || 0;
};

function findAlternatives(holding: PortfolioHolding, certificates: Certificate[]): ComparisonResult {
  const holdingCoupon = parsePercent(holding.coupon_pa);
  const holdingCouponBarrier = parsePercent(holding.coupon_barrier);
  const holdingCapitalBarrier = parsePercent(holding.capital_barrier);

  const alternatives = certificates
    .filter(cert => cert.isin !== holding.isin) // exclude same cert
    .filter(cert => parsePercent(cert.couponPa) > 0) // only income-producing
    .map(cert => {
      const certCoupon = parsePercent(cert.couponPa);
      const certIrr = parsePercent(cert.irr);
      const certCouponBarrier = parsePercent(cert.couponBarrier);
      const certCapitalBarrier = parsePercent(cert.capitalBarrier);

      const couponDelta = certCoupon - holdingCoupon;
      const irrDelta = certIrr; // we don't have IRR for holdings

      // Barrier comparison
      const sameBarrier = certCapitalBarrier === holdingCapitalBarrier && certCouponBarrier === holdingCouponBarrier;
      const barrierMatch = certCapitalBarrier >= holdingCapitalBarrier - 5; // within 5% tolerance
      
      let riskLevel: 'lower' | 'same' | 'higher' = 'same';
      if (certCapitalBarrier < holdingCapitalBarrier) riskLevel = 'higher';
      if (certCapitalBarrier > holdingCapitalBarrier) riskLevel = 'lower';

      const reasons: string[] = [];
      let recommendation: 'strong' | 'moderate' | 'weak' | 'none' = 'none';

      if (couponDelta > 3 && sameBarrier) {
        recommendation = 'strong';
        reasons.push(`+${couponDelta.toFixed(1)}% cedola con stesse barriere`);
      } else if (couponDelta > 3 && barrierMatch) {
        recommendation = 'moderate';
        reasons.push(`+${couponDelta.toFixed(1)}% cedola, barriere simili`);
      } else if (couponDelta > 1 && sameBarrier) {
        recommendation = 'moderate';
        reasons.push(`+${couponDelta.toFixed(1)}% cedola con stesse barriere`);
      } else if (couponDelta > 5) {
        recommendation = 'weak';
        reasons.push(`+${couponDelta.toFixed(1)}% cedola ma barriere diverse`);
      }

      if (certIrr > 15) reasons.push(`IRR ${certIrr.toFixed(1)}%`);
      if (riskLevel === 'lower') reasons.push('Barriere più conservative');

      return { cert, couponDelta, irrDelta, barrierMatch, sameBarrier, riskLevel, recommendation, reasons };
    })
    .filter(a => a.recommendation !== 'none')
    .sort((a, b) => {
      const order = { strong: 3, moderate: 2, weak: 1, none: 0 };
      return order[b.recommendation] - order[a.recommendation] || b.couponDelta - a.couponDelta;
    })
    .slice(0, 3); // top 3 alternatives

  let verdict: 'keep' | 'consider' | 'replace' = 'keep';
  let verdictReason = 'Nessuna alternativa significativamente migliore a parità di rischio.';

  if (alternatives.some(a => a.recommendation === 'strong')) {
    verdict = 'replace';
    verdictReason = 'Esistono alternative con cedola significativamente superiore e rischio equivalente.';
  } else if (alternatives.some(a => a.recommendation === 'moderate')) {
    verdict = 'consider';
    verdictReason = 'Esistono alternative interessanti da valutare.';
  }

  return { holding, alternatives, verdict, verdictReason };
}

const verdictConfig = {
  keep: { icon: CheckCircle, label: 'Mantenere', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', iconColor: 'text-emerald-600' },
  consider: { icon: AlertTriangle, label: 'Da Valutare', color: 'bg-amber-100 text-amber-800 border-amber-300', iconColor: 'text-amber-600' },
  replace: { icon: TrendingUp, label: 'Sostituzione Consigliata', color: 'bg-red-100 text-red-800 border-red-300', iconColor: 'text-red-600' },
};

const recommendationColors = {
  strong: 'border-l-red-500 bg-red-50/50',
  moderate: 'border-l-amber-500 bg-amber-50/50',
  weak: 'border-l-slate-400 bg-slate-50/50',
  none: '',
};

export const PortfolioComparison = ({ holdings, certificates, onStartReplacement }: PortfolioComparisonProps) => {
  const comparisons = holdings
    .filter(h => parsePercent(h.capital_barrier) < 100) // skip capital protected for comparison
    .map(h => findAlternatives(h, certificates));

  const replaceCount = comparisons.filter(c => c.verdict === 'replace').length;
  const considerCount = comparisons.filter(c => c.verdict === 'consider').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analisi Confronto Portafoglio
          </CardTitle>
          <p className="text-sm text-slate-600">
            Confronto automatico tra le {holdings.length} posizioni del portafoglio GU e i {certificates.length} certificati disponibili dalla lista R5 del 16 febbraio 2026.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-3xl font-bold text-emerald-700">{comparisons.length - replaceCount - considerCount}</p>
              <p className="text-sm text-emerald-600">Da mantenere</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-3xl font-bold text-amber-700">{considerCount}</p>
              <p className="text-sm text-amber-600">Da valutare</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-3xl font-bold text-red-700">{replaceCount}</p>
              <p className="text-sm text-red-600">Sostituzione consigliata</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-holding comparison */}
      {comparisons.map((comparison) => {
        const { holding, alternatives, verdict, verdictReason } = comparison;
        const config = verdictConfig[verdict];
        const VerdictIcon = config.icon;

        return (
          <Card key={holding.id} className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-slate-700 text-white">{holding.position_label}</Badge>
                    <span className="font-mono text-sm text-slate-500">{holding.isin}</span>
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    {holding.issuer} — {holding.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Cedola: <strong>{holding.coupon_pa || '-'}</strong> | Barriere: {holding.coupon_barrier}/{holding.capital_barrier} | Sottostanti: {holding.underlyings}
                  </p>
                </div>
                <Badge variant="outline" className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
                  <VerdictIcon className={`h-4 w-4 ${config.iconColor}`} />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 italic">{verdictReason}</p>

              {alternatives.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Alternative dalla lista R5:</p>
                  {alternatives.map((alt) => (
                    <div
                      key={alt.cert.isin}
                      className={`border-l-4 ${recommendationColors[alt.recommendation]} p-3 rounded-r-lg flex flex-col md:flex-row md:items-center justify-between gap-3`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900">{alt.cert.theme}</span>
                          <Badge variant="outline" className="text-xs">{alt.cert.issuer}</Badge>
                          <span className="font-mono text-xs text-slate-500">{alt.cert.isin}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm">
                          <span className={alt.couponDelta > 0 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            Cedola: {alt.cert.couponPa} ({alt.couponDelta > 0 ? '+' : ''}{alt.couponDelta.toFixed(1)}%)
                          </span>
                          <span className="text-slate-600">Barriere: {alt.cert.couponBarrier}/{alt.cert.capitalBarrier}</span>
                          {alt.cert.irr !== '-' && <span className="text-blue-600">IRR: {alt.cert.irr}</span>}
                          <span className="text-slate-500">{alt.cert.underlyings}</span>
                        </div>
                        {alt.reasons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {alt.reasons.map((r, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {onStartReplacement && alt.recommendation !== 'weak' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-400 text-amber-700 hover:bg-amber-50 shrink-0"
                          onClick={() => onStartReplacement(holding.isin, holding.position_label, holding.name)}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Sostituisci
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {alternatives.length === 0 && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Nessuna alternativa migliore trovata a parità di rischio nella lista corrente.</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Capital Protected note */}
      {holdings.some(h => parsePercent(h.capital_barrier) >= 100) && (
        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                Le posizioni <strong>Capital Protected</strong> (barriera 100%) non sono incluse nel confronto — struttura non comparabile con i Phoenix.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioComparison;
