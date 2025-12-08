import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { differenceInDays, format, isPast, isFuture, isToday, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

interface KeyDate {
  id: string;
  certificateId: string;
  certificateName: string;
  dateType: 'maturity' | 'observation' | 'autocall' | 'coupon';
  date: string;
  description: string;
  amount?: number; // For coupon amounts
}

const CERTIFICATE_KEY_DATES: KeyDate[] = [
  // Certificate A - Morgan Stanley Phoenix Mixed Basket
  { id: 'a-mat', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', dateType: 'maturity', date: '2027-03-15', description: 'Scadenza finale' },
  { id: 'a-obs1', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', dateType: 'observation', date: '2025-03-15', description: 'Osservazione Q1 2025' },
  { id: 'a-obs2', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', dateType: 'observation', date: '2025-06-15', description: 'Osservazione Q2 2025' },
  { id: 'a-obs3', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', dateType: 'observation', date: '2025-09-15', description: 'Osservazione Q3 2025' },
  { id: 'a-obs4', certificateId: 'DE000MS0H1P0', certificateName: 'A - Morgan Stanley Phoenix', dateType: 'observation', date: '2025-12-15', description: 'Osservazione Q4 2025' },
  
  // Certificate B - UBS Phoenix Healthcare
  { id: 'b-mat', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', dateType: 'maturity', date: '2028-11-13', description: 'Scadenza finale' },
  { id: 'b-obs1', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', dateType: 'observation', date: '2025-02-13', description: 'Osservazione Q1 2025' },
  { id: 'b-obs2', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', dateType: 'observation', date: '2025-05-13', description: 'Osservazione Q2 2025' },
  { id: 'b-obs3', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', dateType: 'observation', date: '2025-08-13', description: 'Osservazione Q3 2025' },
  { id: 'b-obs4', certificateId: 'DE000UQ23YT1', certificateName: 'B - UBS Phoenix Healthcare', dateType: 'observation', date: '2025-11-13', description: 'Osservazione Q4 2025' },
  
  // Certificate C - UBS Memory Cash Collect
  { id: 'c-mat', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', dateType: 'maturity', date: '2027-06-20', description: 'Scadenza finale' },
  { id: 'c-obs1', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', dateType: 'coupon', date: '2025-01-20', description: 'Cedola Gennaio 2025', amount: 800 },
  { id: 'c-obs2', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', dateType: 'coupon', date: '2025-02-20', description: 'Cedola Febbraio 2025', amount: 800 },
  { id: 'c-obs3', certificateId: 'DE000UQ0LUM5', certificateName: 'C - UBS Memory Cash Collect', dateType: 'coupon', date: '2025-03-20', description: 'Cedola Marzo 2025', amount: 800 },
  
  // Certificate D - Barclays Phoenix Italy Consumer & Luxury
  { id: 'd-mat', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', dateType: 'maturity', date: '2028-02-10', description: 'Scadenza finale' },
  { id: 'd-obs1', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', dateType: 'observation', date: '2025-02-10', description: 'Osservazione Q1 2025' },
  { id: 'd-obs2', certificateId: 'XS3153270833', certificateName: 'D - Barclays Phoenix Luxury', dateType: 'observation', date: '2025-05-10', description: 'Osservazione Q2 2025' },
  
  // Certificate E - Barclays Capital Protected
  { id: 'e-mat', certificateId: 'XS3153397073', certificateName: 'E - Barclays Capital Protected', dateType: 'maturity', date: '2030-01-15', description: 'Scadenza finale (100% Protected)' },
];

const STORAGE_KEY = 'aries76_key_dates_alerts';

export const CertificateKeyDates = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

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

  const filteredDates = CERTIFICATE_KEY_DATES
    .filter(d => {
      if (filter === 'upcoming') return isFuture(new Date(d.date)) || isToday(new Date(d.date));
      if (filter === 'past') return isPast(new Date(d.date)) && !isToday(new Date(d.date));
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const urgentDates = CERTIFICATE_KEY_DATES.filter(d => {
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
