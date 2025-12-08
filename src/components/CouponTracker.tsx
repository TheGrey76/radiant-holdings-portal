import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { format, isPast, isFuture, addMonths } from 'date-fns';
import { it } from 'date-fns/locale';

interface CouponPayment {
  id: string;
  certificateId: string;
  certificateName: string;
  expectedDate: string;
  expectedAmount: number;
  receivedDate?: string;
  receivedAmount?: number;
  status: 'pending' | 'received' | 'missed';
}

interface CouponSummary {
  certificateId: string;
  certificateName: string;
  totalExpected: number;
  totalReceived: number;
  annualYield: number;
  investment: number;
}

interface CertificateCouponConfig {
  id: string;
  name: string;
  investment: number;
  annualYieldPercent: number;
  frequency: 'monthly' | 'quarterly';
  maturityMonths: number;
}

const CERTIFICATE_COUPON_CONFIGS: CertificateCouponConfig[] = [
  { id: 'DE000MS0H1P0', name: 'A - Morgan Stanley Phoenix', investment: 120000, annualYieldPercent: 9.32, frequency: 'quarterly', maturityMonths: 24 },
  { id: 'DE000UQ23YT1', name: 'B - UBS Phoenix Healthcare', investment: 80000, annualYieldPercent: 10, frequency: 'quarterly', maturityMonths: 36 },
  { id: 'DE000UQ0LUM5', name: 'C - UBS Memory Cash Collect', investment: 80000, annualYieldPercent: 12, frequency: 'monthly', maturityMonths: 30 },
  { id: 'XS3153270833', name: 'D - Barclays Phoenix Luxury', investment: 60000, annualYieldPercent: 8, frequency: 'quarterly', maturityMonths: 36 },
];

const CERTIFICATE_INVESTMENTS: Record<string, number> = {
  'DE000MS0H1P0': 120000,
  'DE000UQ23YT1': 80000,
  'DE000UQ0LUM5': 80000,
  'XS3153270833': 60000,
  'XS3153397073': 60000,
};

interface Props {
  portfolioStartDate?: Date;
}

const generateCoupons = (startDate: Date): CouponPayment[] => {
  const coupons: CouponPayment[] = [];
  
  CERTIFICATE_COUPON_CONFIGS.forEach(config => {
    const annualCoupon = config.investment * (config.annualYieldPercent / 100);
    const couponMonths = config.frequency === 'quarterly' ? 3 : 1;
    const couponPerPayment = annualCoupon / (12 / couponMonths);
    const numPayments = Math.min(12 / couponMonths, Math.floor(config.maturityMonths / couponMonths));
    
    for (let i = 1; i <= numPayments; i++) {
      const couponDate = addMonths(startDate, i * couponMonths);
      coupons.push({
        id: `${config.id}-coupon-${i}`,
        certificateId: config.id,
        certificateName: config.name,
        expectedDate: couponDate.toISOString().split('T')[0],
        expectedAmount: Math.round(couponPerPayment),
        status: 'pending',
      });
    }
  });
  
  return coupons.sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());
};

const STORAGE_KEY = 'aries76_coupon_tracker';

export const CouponTracker = ({ portfolioStartDate }: Props) => {
  // Generate coupons based on portfolio start date
  const generatedCoupons = useMemo(() => {
    if (!portfolioStartDate) return [];
    return generateCoupons(portfolioStartDate);
  }, [portfolioStartDate]);

  const [coupons, setCoupons] = useState<CouponPayment[]>([]);

  useEffect(() => {
    if (generatedCoupons.length > 0) {
      // Load saved status from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedCoupons = JSON.parse(saved) as CouponPayment[];
        // Merge saved status with generated coupons
        const merged = generatedCoupons.map(gc => {
          const savedCoupon = savedCoupons.find(sc => sc.id === gc.id);
          return savedCoupon ? { ...gc, status: savedCoupon.status, receivedAmount: savedCoupon.receivedAmount, receivedDate: savedCoupon.receivedDate } : gc;
        });
        setCoupons(merged);
      } else {
        setCoupons(generatedCoupons);
      }
    }
  }, [generatedCoupons]);

  // If no start date, show configuration message
  if (!portfolioStartDate) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 text-center">
          <Coins className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800">Data Composizione Non Configurata</h3>
          <p className="text-amber-600 mt-2">
            Configura la data di composizione del portafoglio nell'header per generare il calendario cedole.
          </p>
        </CardContent>
      </Card>
    );
  }

  const saveCoupons = (updated: CouponPayment[]) => {
    setCoupons(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const markAsReceived = (id: string, amount?: number) => {
    const updated = coupons.map(c => 
      c.id === id 
        ? { 
            ...c, 
            status: 'received' as const, 
            receivedDate: new Date().toISOString().split('T')[0],
            receivedAmount: amount || c.expectedAmount 
          } 
        : c
    );
    saveCoupons(updated);
  };

  const markAsMissed = (id: string) => {
    const updated = coupons.map(c => 
      c.id === id ? { ...c, status: 'missed' as const } : c
    );
    saveCoupons(updated);
  };

  // Calculate summaries
  const summaries: CouponSummary[] = [...new Set(coupons.map(c => c.certificateId))].map(certId => {
    const certCoupons = coupons.filter(c => c.certificateId === certId);
    const totalExpected = certCoupons.reduce((sum, c) => sum + c.expectedAmount, 0);
    const totalReceived = certCoupons
      .filter(c => c.status === 'received')
      .reduce((sum, c) => sum + (c.receivedAmount || c.expectedAmount), 0);
    const investment = CERTIFICATE_INVESTMENTS[certId] || 0;
    
    return {
      certificateId: certId,
      certificateName: certCoupons[0]?.certificateName || '',
      totalExpected,
      totalReceived,
      annualYield: investment > 0 ? (totalExpected / investment) * 100 : 0,
      investment,
    };
  });

  const totalExpectedYearly = summaries.reduce((sum, s) => sum + s.totalExpected, 0);
  const totalReceived = summaries.reduce((sum, s) => sum + s.totalReceived, 0);
  const totalInvestment = Object.values(CERTIFICATE_INVESTMENTS).reduce((a, b) => a + b, 0);

  const upcomingCoupons = coupons
    .filter(c => c.status === 'pending' && isFuture(new Date(c.expectedDate)))
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Cedole Ricevute (YTD)</p>
            <p className="text-2xl font-bold text-emerald-600">€{totalReceived.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Cedole Attese (Anno)</p>
            <p className="text-2xl font-bold text-blue-600">€{totalExpectedYearly.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Rendimento Medio</p>
            <p className="text-2xl font-bold text-purple-600">
              {((totalExpectedYearly / totalInvestment) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Progresso Incasso</p>
            <div className="mt-2">
              <Progress value={(totalReceived / totalExpectedYearly) * 100} className="h-3" />
              <p className="text-xs text-slate-500 mt-1">{((totalReceived / totalExpectedYearly) * 100).toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Coupons */}
      {upcomingCoupons.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Prossime Cedole
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingCoupons.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-medium text-sm">{c.certificateName}</p>
                      <p className="text-xs text-slate-500">{format(new Date(c.expectedDate), 'dd MMM yyyy', { locale: it })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-emerald-600">€{c.expectedAmount.toLocaleString()}</span>
                    <Button size="sm" variant="outline" onClick={() => markAsReceived(c.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Ricevuta
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-Certificate Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Riepilogo per Certificato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificato</TableHead>
                <TableHead className="text-right">Investimento</TableHead>
                <TableHead className="text-right">Cedole Attese</TableHead>
                <TableHead className="text-right">Cedole Ricevute</TableHead>
                <TableHead className="text-right">Yield</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map(s => (
                <TableRow key={s.certificateId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{s.certificateName}</p>
                      <p className="text-xs text-slate-500 font-mono">{s.certificateId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">€{s.investment.toLocaleString()}</TableCell>
                  <TableCell className="text-right">€{s.totalExpected.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-emerald-600 font-semibold">
                    €{s.totalReceived.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-purple-700">{s.annualYield.toFixed(1)}%</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress value={(s.totalReceived / s.totalExpected) * 100} className="h-2" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Full Coupon List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Storico Cedole
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Certificato</TableHead>
                  <TableHead className="text-right">Importo Atteso</TableHead>
                  <TableHead className="text-right">Importo Ricevuto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime()).map(c => (
                  <TableRow key={c.id} className={c.status === 'received' ? 'bg-emerald-50/50' : c.status === 'missed' ? 'bg-red-50/50' : ''}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(c.expectedDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-sm">{c.certificateName.split(' - ')[0]}</TableCell>
                    <TableCell className="text-right">€{c.expectedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {c.receivedAmount ? `€${c.receivedAmount.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>
                      {c.status === 'received' && <Badge className="bg-emerald-100 text-emerald-800">Ricevuta</Badge>}
                      {c.status === 'pending' && <Badge variant="outline">In Attesa</Badge>}
                      {c.status === 'missed' && <Badge className="bg-red-100 text-red-800">Non Pagata</Badge>}
                    </TableCell>
                    <TableCell>
                      {c.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => markAsReceived(c.id)}>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
