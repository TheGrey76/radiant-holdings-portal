import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AlertTriangle, TrendingUp, TrendingDown, Save, RefreshCw, Calendar, ArrowLeft, Download, Loader2, Coins, Bell, BarChart3, CalendarIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CertificateKeyDates } from '@/components/CertificateKeyDates';
import { CouponTracker } from '@/components/CouponTracker';
import { BarrierAlerts } from '@/components/BarrierAlerts';
import { PerformanceHistory } from '@/components/PerformanceHistory';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

interface PriceHistory {
  date: string;
  prices: Record<string, number>;
}

const INITIAL_UNDERLYINGS: Underlying[] = [
  // Certificate A - Morgan Stanley Phoenix Mixed Basket
  { id: 'enel', name: 'Enel', ticker: 'ENEL.MI', certificate: 'A - Morgan Stanley Phoenix', certificateId: 'DE000MS0H1P0', barrier: 65, strikePrice: 6.50, currentPrice: 0, lastUpdate: '' },
  { id: 'googl', name: 'Alphabet', ticker: 'GOOGL', certificate: 'A - Morgan Stanley Phoenix', certificateId: 'DE000MS0H1P0', barrier: 65, strikePrice: 175.00, currentPrice: 0, lastUpdate: '' },
  { id: 'ucg', name: 'UniCredit', ticker: 'UCG.MI', certificate: 'A - Morgan Stanley Phoenix', certificateId: 'DE000MS0H1P0', barrier: 65, strikePrice: 38.00, currentPrice: 0, lastUpdate: '' },
  
  // Certificate B - UBS Phoenix Healthcare
  { id: 'novo', name: 'Novo Nordisk', ticker: 'NVO', certificate: 'B - UBS Phoenix Healthcare', certificateId: 'DE000UQ23YT1', barrier: 60, strikePrice: 110.00, currentPrice: 0, lastUpdate: '' },
  { id: 'mrk-de', name: 'Merck KGaA', ticker: 'MRK.DE', certificate: 'B - UBS Phoenix Healthcare', certificateId: 'DE000UQ23YT1', barrier: 60, strikePrice: 150.00, currentPrice: 0, lastUpdate: '' },
  { id: 'cvs', name: 'CVS Health', ticker: 'CVS', certificate: 'B - UBS Phoenix Healthcare', certificateId: 'DE000UQ23YT1', barrier: 60, strikePrice: 58.00, currentPrice: 0, lastUpdate: '' },
  
  // Certificate C - UBS Memory Cash Collect (Italian Large Caps)
  { id: 'isp', name: 'Intesa Sanpaolo', ticker: 'ISP.MI', certificate: 'C - UBS Memory Cash Collect', certificateId: 'DE000UQ0LUM5', barrier: 65, strikePrice: 3.80, currentPrice: 0, lastUpdate: '' },
  { id: 'eni', name: 'Eni', ticker: 'ENI.MI', certificate: 'C - UBS Memory Cash Collect', certificateId: 'DE000UQ0LUM5', barrier: 65, strikePrice: 14.00, currentPrice: 0, lastUpdate: '' },
  { id: 'stm', name: 'STMicroelectronics', ticker: 'STM', certificate: 'C - UBS Memory Cash Collect', certificateId: 'DE000UQ0LUM5', barrier: 65, strikePrice: 24.00, currentPrice: 0, lastUpdate: '' },
  
  // Certificate D - Barclays Phoenix Italy Consumer & Luxury
  { id: 'race', name: 'Ferrari', ticker: 'RACE.MI', certificate: 'D - Barclays Phoenix Luxury', certificateId: 'XS3153270833', barrier: 65, strikePrice: 420.00, currentPrice: 0, lastUpdate: '' },
  { id: 'bc', name: 'Brunello Cucinelli', ticker: 'BC.MI', certificate: 'D - Barclays Phoenix Luxury', certificateId: 'XS3153270833', barrier: 65, strikePrice: 95.00, currentPrice: 0, lastUpdate: '' },
  { id: 'cpr', name: 'Campari', ticker: 'CPR.MI', certificate: 'D - Barclays Phoenix Luxury', certificateId: 'XS3153270833', barrier: 65, strikePrice: 6.50, currentPrice: 0, lastUpdate: '' },
];

const STORAGE_KEY = 'aries76_underlying_prices';
const HISTORY_KEY = 'aries76_price_history';
const PORTFOLIO_DATE_KEY = 'aries76_portfolio_start_date';
const AUTH_KEY = 'aries76_monitoring_auth';

const AUTHORIZED_EMAILS = [
  'edoardo.grigione@aries76.com',
  'admin@aries76.com',
];

const UnderlyingMonitoring = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [underlyings, setUnderlyings] = useState<Underlying[]>(INITIAL_UNDERLYINGS);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [portfolioStartDate, setPortfolioStartDate] = useState<Date | undefined>(undefined);

  // Load portfolio start date
  useEffect(() => {
    const saved = localStorage.getItem(PORTFOLIO_DATE_KEY);
    if (saved) {
      setPortfolioStartDate(new Date(saved));
    }
  }, []);

  const handlePortfolioDateChange = (date: Date | undefined) => {
    setPortfolioStartDate(date);
    if (date) {
      localStorage.setItem(PORTFOLIO_DATE_KEY, date.toISOString());
      toast.success(`Data composizione portafoglio: ${format(date, 'dd MMMM yyyy', { locale: it })}`);
    } else {
      localStorage.removeItem(PORTFOLIO_DATE_KEY);
    }
  };

  // Check authorization on mount
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY);
    if (auth && AUTHORIZED_EMAILS.includes(auth)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  // Load saved data and migrate old tickers
  useEffect(() => {
    if (isAuthorized) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let savedData = JSON.parse(saved) as Underlying[];
        
        // Migrate old STM.MI ticker to STM
        savedData = savedData.map(u => {
          if (u.ticker === 'STM.MI') {
            return { ...u, ticker: 'STM' };
          }
          return u;
        });
        
        // Save migrated data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
        
        setUnderlyings(prev => prev.map(u => {
          const savedU = savedData.find(s => s.id === u.id);
          return savedU ? { ...u, currentPrice: savedU.currentPrice, lastUpdate: savedU.lastUpdate, strikePrice: savedU.strikePrice } : u;
        }));
      }
      
      const historyData = localStorage.getItem(HISTORY_KEY);
      if (historyData) {
        setPriceHistory(JSON.parse(historyData));
      }
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    if (AUTHORIZED_EMAILS.includes(normalizedEmail)) {
      sessionStorage.setItem(AUTH_KEY, normalizedEmail);
      setIsAuthorized(true);
      toast.success('Accesso autorizzato');
    } else {
      toast.error('Email non autorizzata');
    }
  };

  const calculateDistanceFromBarrier = (current: number, strike: number, barrier: number): number => {
    if (current === 0 || strike === 0) return 0;
    const barrierPrice = strike * (barrier / 100);
    const distance = ((current - barrierPrice) / barrierPrice) * 100;
    return distance;
  };

  const getDistanceColor = (distance: number): string => {
    if (distance > 30) return 'text-emerald-600';
    if (distance > 15) return 'text-green-600';
    if (distance > 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDistanceBadge = (distance: number) => {
    if (distance > 30) return <Badge className="bg-emerald-100 text-emerald-800">Safe</Badge>;
    if (distance > 15) return <Badge className="bg-green-100 text-green-800">OK</Badge>;
    if (distance > 5) return <Badge className="bg-amber-100 text-amber-800">Watch</Badge>;
    return <Badge className="bg-red-100 text-red-800">Alert</Badge>;
  };

  const handlePriceUpdate = (id: string) => {
    const price = parseFloat(tempPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Inserisci un prezzo valido');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    setUnderlyings(prev => {
      const updated = prev.map(u => 
        u.id === id ? { ...u, currentPrice: price, lastUpdate: today } : u
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Update history
    setPriceHistory(prev => {
      const existingToday = prev.find(h => h.date === today);
      let newHistory: PriceHistory[];
      
      if (existingToday) {
        newHistory = prev.map(h => 
          h.date === today ? { ...h, prices: { ...h.prices, [id]: price } } : h
        );
      } else {
        const todayPrices: Record<string, number> = { [id]: price };
        newHistory = [...prev, { date: today, prices: todayPrices }].slice(-30); // Keep 30 days
      }
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });

    setEditingId(null);
    setTempPrice('');
    toast.success(`Prezzo aggiornato: ${price}`);
  };

  const handleStrikeUpdate = (id: string, newStrike: number) => {
    setUnderlyings(prev => {
      const updated = prev.map(u => 
        u.id === id ? { ...u, strikePrice: newStrike } : u
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    toast.success('Strike aggiornato');
  };

  const getWorstPerformer = (certificateId: string): Underlying | null => {
    const certUnderlyings = underlyings.filter(u => u.certificateId === certificateId && u.currentPrice > 0);
    if (certUnderlyings.length === 0) return null;
    
    return certUnderlyings.reduce((worst, current) => {
      const worstDistance = calculateDistanceFromBarrier(worst.currentPrice, worst.strikePrice, worst.barrier);
      const currentDistance = calculateDistanceFromBarrier(current.currentPrice, current.strikePrice, current.barrier);
      return currentDistance < worstDistance ? current : worst;
    });
  };

  // Fetch all prices from Finnhub API
  const fetchAllPrices = async () => {
    setIsLoadingPrices(true);
    const loadingToast = toast.loading('Recupero prezzi da Yahoo Finance...');
    
    try {
      const tickers = underlyings.map(u => u.ticker);
      
      const { data, error } = await supabase.functions.invoke('fetch-stock-prices', {
        body: { tickers }
      });

      if (error) throw error;

      console.log('API Response:', data);
      
      const today = new Date().toISOString().split('T')[0];
      const results = data?.results || [];
      
      // Count successes first
      const successCount = results.filter((r: any) => r.price && r.price > 0).length;
      const failCount = results.filter((r: any) => !r.price || r.price <= 0).length;

      console.log(`Success: ${successCount}, Failed: ${failCount}`);

      setUnderlyings(prev => {
        const updated = prev.map(u => {
          const result = results.find((r: any) => r.ticker === u.ticker);
          if (result?.price && result.price > 0) {
            return { ...u, currentPrice: result.price, lastUpdate: today };
          }
          return u;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Update history
      setPriceHistory(prev => {
        const newPrices: Record<string, number> = {};
        results.forEach((r: any) => {
          if (r.price && r.price > 0) {
            const underlying = underlyings.find(u => u.ticker === r.ticker);
            if (underlying) {
              newPrices[underlying.id] = r.price;
            }
          }
        });

        const existingToday = prev.find(h => h.date === today);
        let newHistory: PriceHistory[];
        
        if (existingToday) {
          newHistory = prev.map(h => 
            h.date === today ? { ...h, prices: { ...h.prices, ...newPrices } } : h
          );
        } else {
          newHistory = [...prev, { date: today, prices: newPrices }].slice(-30);
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });

      toast.dismiss(loadingToast);
      
      if (successCount > 0) {
        toast.success(`${successCount} prezzi aggiornati${failCount > 0 ? `, ${failCount} non disponibili` : ''}`);
      } else {
        toast.error('Nessun prezzo recuperato. Verifica la connessione API.');
      }
      
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.dismiss(loadingToast);
      toast.error('Errore nel recupero prezzi. Riprova più tardi.');
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const certificates = [...new Set(underlyings.map(u => u.certificateId))];

  if (isAuthorized === null) {
    return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Monitoring Sottostanti</CardTitle>
            <p className="text-slate-500 text-sm mt-2">Accesso riservato</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email autorizzata"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Accedi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
      {/* Header */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/structured-products-gu" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Torna al Portfolio
              </Link>
              <h1 className="text-3xl font-bold text-white">Monitoring Sottostanti</h1>
              <p className="text-slate-300 mt-2">Portafoglio Structured Products — Client G.U.</p>
              
              {/* Portfolio Start Date Picker */}
              <div className="mt-4 flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400 text-sm">Data Composizione:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-700",
                        !portfolioStartDate && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {portfolioStartDate ? (
                        format(portfolioStartDate, "dd MMMM yyyy", { locale: it })
                      ) : (
                        <span>Seleziona data...</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={portfolioStartDate}
                      onSelect={handlePortfolioDateChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {portfolioStartDate && (
                  <Badge className="bg-emerald-600 text-white">
                    Configurato
                  </Badge>
                )}
                {!portfolioStartDate && (
                  <Badge variant="outline" className="text-amber-400 border-amber-400">
                    Da configurare
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-3">
              <Button 
                onClick={fetchAllPrices} 
                disabled={isLoadingPrices}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoadingPrices ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Caricamento...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Aggiorna Tutti i Prezzi
                  </>
                )}
              </Button>
              <div>
                <p className="text-slate-400 text-sm">Ultimo aggiornamento</p>
                <p className="text-white font-mono">{new Date().toLocaleDateString('it-IT')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-7xl">
          <Tabs defaultValue="monitoring" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scadenze
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Cedole
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alert
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring">
              {/* Certificates Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Riepilogo per Certificato (5 Certificati)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {certificates.map(certId => {
                    const worst = getWorstPerformer(certId);
                    const certName = underlyings.find(u => u.certificateId === certId)?.certificate || certId;
                    
                    return (
                      <motion.div
                        key={certId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="border-l-4 border-l-slate-700">
                          <CardContent className="pt-4">
                            <p className="text-xs text-slate-500 font-mono">{certId}</p>
                            <p className="font-semibold text-slate-900 text-sm mt-1">{certName}</p>
                            {worst ? (
                              <div className="mt-3 p-2 bg-slate-50 rounded">
                                <p className="text-xs text-slate-500">Worst Performer</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-medium text-slate-900">{worst.name}</span>
                                  {getDistanceBadge(calculateDistanceFromBarrier(worst.currentPrice, worst.strikePrice, worst.barrier))}
                                </div>
                                <p className={`text-sm font-semibold mt-1 ${getDistanceColor(calculateDistanceFromBarrier(worst.currentPrice, worst.strikePrice, worst.barrier))}`}>
                                  {calculateDistanceFromBarrier(worst.currentPrice, worst.strikePrice, worst.barrier).toFixed(1)}% dalla barriera
                                </p>
                              </div>
                            ) : (
                              <p className="text-slate-400 text-sm mt-3">Nessun prezzo inserito</p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  
                  {/* Certificate E - Capital Protected */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-l-4 border-l-emerald-600">
                      <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 font-mono">XS3153397073</p>
                        <p className="font-semibold text-slate-900 text-sm mt-1">E - Barclays Capital Protected</p>
                        <div className="mt-3 p-2 bg-emerald-50 rounded">
                          <Badge className="bg-emerald-100 text-emerald-800">100% Protected</Badge>
                          <p className="text-xs text-slate-600 mt-2">Nessuna barriera da monitorare</p>
                          <p className="text-xs text-slate-500">Capitale garantito a scadenza</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

      {/* Full Table */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dettaglio Sottostanti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sottostante</TableHead>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Certificato</TableHead>
                      <TableHead className="text-right">Strike</TableHead>
                      <TableHead className="text-right">Prezzo Corrente</TableHead>
                      <TableHead className="text-right">Barriera</TableHead>
                      <TableHead className="text-right">Livello Barriera</TableHead>
                      <TableHead className="text-right">Distanza %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ultimo Agg.</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {underlyings.map(u => {
                      const barrierLevel = u.strikePrice * (u.barrier / 100);
                      const distance = calculateDistanceFromBarrier(u.currentPrice, u.strikePrice, u.barrier);
                      const isEditing = editingId === u.id;
                      
                      return (
                        <TableRow key={u.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell className="font-mono text-sm text-slate-500">{u.ticker}</TableCell>
                          <TableCell className="text-sm">{u.certificate.split(' - ')[0]}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              step="0.01"
                              value={u.strikePrice}
                              onChange={(e) => handleStrikeUpdate(u.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-right h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <div className="flex items-center gap-1 justify-end">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(e.target.value)}
                                  className="w-24 text-right h-8"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePriceUpdate(u.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                />
                                <Button size="sm" variant="ghost" onClick={() => handlePriceUpdate(u.id)}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <span 
                                className="cursor-pointer hover:bg-slate-100 px-2 py-1 rounded"
                                onClick={() => {
                                  setEditingId(u.id);
                                  setTempPrice(u.currentPrice > 0 ? u.currentPrice.toString() : '');
                                }}
                              >
                                {u.currentPrice > 0 ? `€${u.currentPrice.toFixed(2)}` : '—'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{u.barrier}%</TableCell>
                          <TableCell className="text-right font-mono">€{barrierLevel.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {u.currentPrice > 0 ? (
                              <span className={`font-semibold ${getDistanceColor(distance)}`}>
                                {distance > 0 ? '+' : ''}{distance.toFixed(1)}%
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {u.currentPrice > 0 ? getDistanceBadge(distance) : <Badge variant="outline">N/A</Badge>}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {u.lastUpdate || '—'}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditingId(u.id);
                                setTempPrice(u.currentPrice > 0 ? u.currentPrice.toString() : '');
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

              {/* Alert Section */}
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    Sottostanti in Attenzione
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {underlyings.filter(u => {
                    if (u.currentPrice === 0) return false;
                    const distance = calculateDistanceFromBarrier(u.currentPrice, u.strikePrice, u.barrier);
                    return distance < 15;
                  }).length > 0 ? (
                    <div className="space-y-2">
                      {underlyings.filter(u => {
                        if (u.currentPrice === 0) return false;
                        const distance = calculateDistanceFromBarrier(u.currentPrice, u.strikePrice, u.barrier);
                        return distance < 15;
                      }).map(u => {
                        const distance = calculateDistanceFromBarrier(u.currentPrice, u.strikePrice, u.barrier);
                        return (
                          <div key={u.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                            <div>
                              <span className="font-semibold">{u.name}</span>
                              <span className="text-slate-500 text-sm ml-2">({u.certificate})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`font-bold ${getDistanceColor(distance)}`}>
                                {distance.toFixed(1)}% dalla barriera
                              </span>
                              {getDistanceBadge(distance)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-600">Nessun sottostante richiede attenzione al momento.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <CertificateKeyDates portfolioStartDate={portfolioStartDate} />
            </TabsContent>

            <TabsContent value="coupons">
              <CouponTracker portfolioStartDate={portfolioStartDate} />
            </TabsContent>

            <TabsContent value="alerts">
              <BarrierAlerts underlyings={underlyings} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceHistory underlyings={underlyings} priceHistory={priceHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default UnderlyingMonitoring;
