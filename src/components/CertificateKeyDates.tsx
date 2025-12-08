import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { differenceInDays, format, isPast, isFuture, isToday, addDays, addMonths, addQuarters, addYears } from 'date-fns';
import { it } from 'date-fns/locale';

interface KeyDate {
  id: string;
  certificateId: string;
  certificateName: string;
  dateType: 'maturity' | 'observation' | 'autocall' | 'coupon';
  date: string;
  description: string;
  amount?: number;
}

interface CertificateConfig {
  id: string;
  name: string;
  maturityMonths: number; // Months from portfolio start to maturity
  observationFrequency: 'monthly' | 'quarterly';
  couponFrequency?: 'monthly' | 'quarterly';
  couponAmount?: number;
}

const CERTIFICATE_CONFIGS: CertificateConfig[] = [
  { id: 'DE000MS0H1P0', name: 'A - Morgan Stanley Phoenix', maturityMonths: 24, observationFrequency: 'quarterly' },
  { id: 'DE000UQ23YT1', name: 'B - UBS Phoenix Healthcare', maturityMonths: 36, observationFrequency: 'quarterly' },
  { id: 'DE000UQ0LUM5', name: 'C - UBS Memory Cash Collect', maturityMonths: 30, observationFrequency: 'monthly', couponFrequency: 'monthly', couponAmount: 800 },
  { id: 'XS3153270833', name: 'D - Barclays Phoenix Luxury', maturityMonths: 36, observationFrequency: 'quarterly' },
  { id: 'XS3153397073', name: 'E - Barclays Capital Protected', maturityMonths: 60, observationFrequency: 'quarterly' },
];

interface Props {
  portfolioStartDate?: Date;
}

const STORAGE_KEY = 'aries76_key_dates_alerts';

const generateKeyDates = (startDate: Date): KeyDate[] => {
  const dates: KeyDate[] = [];
  
  CERTIFICATE_CONFIGS.forEach(config => {
    // Maturity date
    const maturityDate = addMonths(startDate, config.maturityMonths);
    dates.push({
      id: `${config.id}-mat`,
      certificateId: config.id,
      certificateName: config.name,
      dateType: 'maturity',
      date: maturityDate.toISOString().split('T')[0],
      description: 'Scadenza finale',
    });

    // Observation dates (first 2 years from start)
    const observationMonths = config.observationFrequency === 'quarterly' ? 3 : 1;
    for (let i = 1; i <= Math.min(24 / observationMonths, config.maturityMonths / observationMonths); i++) {
      const obsDate = addMonths(startDate, i * observationMonths);
      if (obsDate < maturityDate) {
        const quarter = Math.ceil((obsDate.getMonth() + 1) / 3);
        const year = obsDate.getFullYear();
        dates.push({
          id: `${config.id}-obs-${i}`,
          certificateId: config.id,
          certificateName: config.name,
          dateType: 'observation',
          date: obsDate.toISOString().split('T')[0],
          description: config.observationFrequency === 'quarterly' 
            ? `Osservazione Q${quarter} ${year}`
            : `Osservazione ${format(obsDate, 'MMMM yyyy', { locale: it })}`,
        });
      }
    }

    // Coupon dates (if applicable, first 12 months)
    if (config.couponFrequency && config.couponAmount) {
      const couponMonths = config.couponFrequency === 'quarterly' ? 3 : 1;
      for (let i = 1; i <= 12 / couponMonths; i++) {
        const couponDate = addMonths(startDate, i * couponMonths);
        if (couponDate < maturityDate) {
          dates.push({
            id: `${config.id}-coupon-${i}`,
            certificateId: config.id,
            certificateName: config.name,
            dateType: 'coupon',
            date: couponDate.toISOString().split('T')[0],
            description: `Cedola ${format(couponDate, 'MMMM yyyy', { locale: it })}`,
            amount: config.couponAmount,
          });
        }
      }
    }
  });

  return dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const CertificateKeyDates = ({ portfolioStartDate }: Props) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Generate dates based on portfolio start date
  const keyDates = useMemo(() => {
    if (!portfolioStartDate) return [];
    return generateKeyDates(portfolioStartDate);
  }, [portfolioStartDate]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setDismissedAlerts(JSON.parse(saved));
    }
  }, []);

  const dismissAlert = (id: string) => {
    const updated = [...dismissedAlerts, id];
    setDismissedAlerts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // If no start date, show configuration message
  if (!portfolioStartDate) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 text-center">
          <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800">Data Composizione Non Configurata</h3>
          <p className="text-amber-600 mt-2">
            Configura la data di composizione del portafoglio nell'header per generare il calendario eventi.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDateTypeColor = (type: KeyDate['dateType']) => {
    switch (type) {
      case 'maturity': return 'bg-purple-100 text-purple-800';
      case 'observation': return 'bg-blue-100 text-blue-800';
      case 'autocall': return 'bg-orange-100 text-orange-800';
      case 'coupon': return 'bg-emerald-100 text-emerald-800';
    }
  };

  const getDateTypeIcon = (type: KeyDate['dateType']) => {
    switch (type) {
      case 'maturity': return Calendar;
      case 'observation': return Clock;
      case 'autocall': return Bell;
      case 'coupon': return CheckCircle;
    }
  };

  const getUrgencyBadge = (date: string) => {
    const eventDate = new Date(date);
    const daysUntil = differenceInDays(eventDate, new Date());
    
    if (isPast(eventDate) && !isToday(eventDate)) {
      return <Badge variant="outline" className="text-slate-500">Passato</Badge>;
    }
    if (isToday(eventDate)) {
      return <Badge className="bg-red-500 text-white animate-pulse">OGGI</Badge>;
    }
    if (daysUntil <= 7) {
      return <Badge className="bg-red-100 text-red-800">{daysUntil}g</Badge>;
    }
    if (daysUntil <= 30) {
      return <Badge className="bg-amber-100 text-amber-800">{daysUntil}g</Badge>;
    }
    return <Badge variant="outline">{daysUntil}g</Badge>;
  };

  const filteredDates = keyDates
    .filter(d => {
      if (filter === 'upcoming') return isFuture(new Date(d.date)) || isToday(new Date(d.date));
      if (filter === 'past') return isPast(new Date(d.date)) && !isToday(new Date(d.date));
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const urgentDates = keyDates.filter(d => {
    const daysUntil = differenceInDays(new Date(d.date), new Date());
    return daysUntil >= 0 && daysUntil <= 14 && !dismissedAlerts.includes(d.id);
  });

  return (
    <div className="space-y-6">
      {/* Urgent Alerts */}
      {urgentDates.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Eventi nei prossimi 14 giorni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgentDates.map(d => {
              const Icon = getDateTypeIcon(d.dateType);
              return (
                <div key={d.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-sm">{d.description}</p>
                      <p className="text-xs text-slate-500">{d.certificateName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{format(new Date(d.date), 'dd/MM/yyyy')}</span>
                    {getUrgencyBadge(d.date)}
                    <Button size="sm" variant="ghost" onClick={() => dismissAlert(d.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* All Dates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendario Eventi
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
              >
                Prossimi
              </Button>
              <Button 
                size="sm" 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                Tutti
              </Button>
              <Button 
                size="sm" 
                variant={filter === 'past' ? 'default' : 'outline'}
                onClick={() => setFilter('past')}
              >
                Passati
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredDates.map(d => {
              const Icon = getDateTypeIcon(d.dateType);
              return (
                <div 
                  key={d.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isPast(new Date(d.date)) && !isToday(new Date(d.date)) 
                      ? 'bg-slate-50 opacity-60' 
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-600" />
                    <Badge className={getDateTypeColor(d.dateType)}>
                      {d.dateType === 'maturity' ? 'Scadenza' : 
                       d.dateType === 'observation' ? 'Osservazione' :
                       d.dateType === 'autocall' ? 'Autocall' : 'Cedola'}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{d.description}</p>
                      <p className="text-xs text-slate-500">{d.certificateName}</p>
                    </div>
                    {d.amount && (
                      <Badge variant="outline" className="text-emerald-700">€{d.amount.toLocaleString()}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{format(new Date(d.date), 'dd MMM yyyy', { locale: it })}</span>
                    {getUrgencyBadge(d.date)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
