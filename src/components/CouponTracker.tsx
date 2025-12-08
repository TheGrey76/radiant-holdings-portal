import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Coins, Plus, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
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

const INITIAL_COUPONS: CouponPayment[] = [
  // Certificate A - Morgan Stanley Phoenix (9.32% annual, quarterly = €2,790/year = €697.50/quarter)
  { id: 'a-q1-25', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', expectedDate: '2025-03-15', expectedAmount: 2790, status: 'pending' },
  { id: 'a-q2-25', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', expectedDate: '2025-06-15', expectedAmount: 2790, status: 'pending' },
  { id: 'a-q3-25', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', expectedDate: '2025-09-15', expectedAmount: 2790, status: 'pending' },
  { id: 'a-q4-25', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', expectedDate: '2025-12-15', expectedAmount: 2790, status: 'pending' },
  
  // Certificate B - UBS Phoenix Healthcare (10% annual, quarterly = €2,000/year = €500/quarter)
  { id: 'b-q1-25', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', expectedDate: '2025-02-13', expectedAmount: 2000, status: 'pending' },
  { id: 'b-q2-25', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', expectedDate: '2025-05-13', expectedAmount: 2000, status: 'pending' },
  { id: 'b-q3-25', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', expectedDate: '2025-08-13', expectedAmount: 2000, status: 'pending' },
  { id: 'b-q4-25', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', expectedDate: '2025-11-13', expectedAmount: 2000, status: 'pending' },
  
  // Certificate C - UBS Memory Cash Collect (12% annual, monthly = €800/month)
  { id: 'c-jan-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-01-20', expectedAmount: 800, status: 'pending' },
  { id: 'c-feb-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-02-20', expectedAmount: 800, status: 'pending' },
  { id: 'c-mar-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-03-20', expectedAmount: 800, status: 'pending' },
  { id: 'c-apr-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-04-20', expectedAmount: 800, status: 'pending' },
  { id: 'c-may-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-05-20', expectedAmount: 800, status: 'pending' },
  { id: 'c-jun-25', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', expectedDate: '2025-06-20', expectedAmount: 800, status: 'pending' },
  
  // Certificate D - Barclays Phoenix Luxury (8% annual, quarterly = €1,200/year = €300/quarter)
  { id: 'd-q1-25', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', expectedDate: '2025-02-10', expectedAmount: 1200, status: 'pending' },
  { id: 'd-q2-25', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', expectedDate: '2025-05-10', expectedAmount: 1200, status: 'pending' },
  { id: 'd-q3-25', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', expectedDate: '2025-08-10', expectedAmount: 1200, status: 'pending' },
  { id: 'd-q4-25', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', expectedDate: '2025-11-10', expectedAmount: 1200, status: 'pending' },
];

const CERTIFICATE_INVESTMENTS: Record<string, number> = {
  'DE000MS0H1P0': 120000, // Certificate A
  'DE000UQ23YT1': 80000,  // Certificate B
  'DE000UQ0LUM5': 80000,  // Certificate C
  'XS3153270833': 60000,  // Certificate D
  'XS3153397073': 60000,  // Certificate E (no coupons)
};

const STORAGE_KEY = 'aries76_coupon_tracker';

export const CouponTracker = () => {
  const [coupons, setCoupons] = useState<CouponPayment[]>(INITIAL_COUPONS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCoupons(JSON.parse(saved));
    }
  }, []);

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
