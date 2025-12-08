import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

interface PriceHistory {
  date: string;
  prices: Record<string, number>;
}

interface Underlying {
  id: string;
  name: string;
  ticker: string;
  certificate: string;
  certificateId: string;
  barrier: number;
  strikePrice: number;
  currentPrice: number;
  lastUpdate: string;
}

interface Props {
  underlyings: Underlying[];
  priceHistory: PriceHistory[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#a855f7', // purple
];

export const PerformanceHistory = ({ underlyings, priceHistory }: Props) => {
  const [selectedCertificate, setSelectedCertificate] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(30);

  const certificates = useMemo(() => 
    [...new Set(underlyings.map(u => u.certificateId))],
    [underlyings]
  );

  const filteredUnderlyings = useMemo(() => 
    selectedCertificate === 'all' 
      ? underlyings 
      : underlyings.filter(u => u.certificateId === selectedCertificate),
    [underlyings, selectedCertificate]
  );

  // Calculate barrier distance history
  const barrierDistanceHistory = useMemo(() => {
    const cutoffDate = subDays(new Date(), timeRange);
    
    return priceHistory
      .filter(h => parseISO(h.date) >= cutoffDate)
      .map(h => {
        const dataPoint: Record<string, any> = { date: format(parseISO(h.date), 'dd/MM') };
        
        filteredUnderlyings.forEach(u => {
          const price = h.prices[u.id];
          if (price && price > 0) {
            const barrierPrice = u.strikePrice * (u.barrier / 100);
            const distance = ((price - barrierPrice) / barrierPrice) * 100;
            dataPoint[u.name] = parseFloat(distance.toFixed(2));
          }
        });
        
        return dataPoint;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [priceHistory, filteredUnderlyings, timeRange]);

  // Price history normalized to 100
  const normalizedPriceHistory = useMemo(() => {
    const cutoffDate = subDays(new Date(), timeRange);
    const sortedHistory = priceHistory
      .filter(h => parseISO(h.date) >= cutoffDate)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    if (sortedHistory.length === 0) return [];

    // Get first valid price for each underlying
    const basePrices: Record<string, number> = {};
    sortedHistory.forEach(h => {
      filteredUnderlyings.forEach(u => {
        if (!basePrices[u.id] && h.prices[u.id] && h.prices[u.id] > 0) {
          basePrices[u.id] = h.prices[u.id];
        }
      });
    });

    return sortedHistory.map(h => {
      const dataPoint: Record<string, any> = { date: format(parseISO(h.date), 'dd/MM') };
      
      filteredUnderlyings.forEach(u => {
        const price = h.prices[u.id];
        const basePrice = basePrices[u.id];
        if (price && price > 0 && basePrice) {
          dataPoint[u.name] = parseFloat(((price / basePrice) * 100).toFixed(2));
        }
      });
      
      return dataPoint;
    });
  }, [priceHistory, filteredUnderlyings, timeRange]);

  // Calculate performance stats
  const performanceStats = useMemo(() => {
    return filteredUnderlyings.map(u => {
      const prices = priceHistory
        .filter(h => h.prices[u.id] && h.prices[u.id] > 0)
        .map(h => ({ date: h.date, price: h.prices[u.id] }))
        .sort((a, b) => a.date.localeCompare(b.date));

      if (prices.length < 2) {
        return { ...u, change: 0, trend: 'flat' as const, dataPoints: 0 };
      }

      const firstPrice = prices[0].price;
      const lastPrice = prices[prices.length - 1].price;
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;

      return {
        ...u,
        change,
        trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'flat' as const,
        dataPoints: prices.length,
      };
    });
  }, [filteredUnderlyings, priceHistory]);

  const hasData = barrierDistanceHistory.length > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-slate-500 block mb-1">Certificato</label>
              <Select value={selectedCertificate} onValueChange={setSelectedCertificate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i certificati</SelectItem>
                  {certificates.map(cert => {
                    const name = underlyings.find(u => u.certificateId === cert)?.certificate;
                    return (
                      <SelectItem key={cert} value={cert}>{name}</SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                size="sm" 
                variant={timeRange === 7 ? 'default' : 'outline'}
                onClick={() => setTimeRange(7)}
              >
                7g
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 14 ? 'default' : 'outline'}
                onClick={() => setTimeRange(14)}
              >
                14g
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 30 ? 'default' : 'outline'}
                onClick={() => setTimeRange(30)}
              >
                30g
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Performance Sottostanti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {performanceStats.map((stat, i) => (
              <div 
                key={stat.id} 
                className={`p-3 rounded-lg border ${
                  stat.trend === 'up' ? 'bg-emerald-50 border-emerald-200' :
                  stat.trend === 'down' ? 'bg-red-50 border-red-200' :
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : null}
                  <span className="font-medium text-sm">{stat.name}</span>
                </div>
                <p className={`text-lg font-bold ${
                  stat.change > 0 ? 'text-emerald-600' : 
                  stat.change < 0 ? 'text-red-600' : 
                  'text-slate-600'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">{stat.dataPoints} data points</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Barrier Distance Chart */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Distanza dalla Barriera (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={barrierDistanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Legend />
                  {/* Reference line at 0 (barrier level) */}
                  <Area 
                    type="monotone" 
                    dataKey={() => 0} 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                    name="Barriera"
                  />
                  {filteredUnderlyings.map((u, i) => (
                    <Area
                      key={u.id}
                      type="monotone"
                      dataKey={u.name}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              <p>Nessun dato storico disponibile. Aggiorna i prezzi per iniziare a tracciare la performance.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Normalized Performance Chart */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Performance Normalizzata (Base 100)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData && normalizedPriceHistory.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={normalizedPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [value.toFixed(2), '']}
                  />
                  <Legend />
                  {/* Reference line at 100 */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 100} 
                    stroke="#94a3b8" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Base"
                  />
                  {filteredUnderlyings.map((u, i) => (
                    <Line
                      key={u.id}
                      type="monotone"
                      dataKey={u.name}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              <p>Nessun dato storico disponibile.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
