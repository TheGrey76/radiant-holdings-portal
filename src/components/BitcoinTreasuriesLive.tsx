import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, TrendingUp, Building2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChartContainer } from './InstitutionalCharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Treasury {
  id: string;
  rank: number;
  company_name: string;
  ticker: string | null;
  country: string | null;
  bitcoin_holdings: number;
  btc_price_usd: number | null;
  value_usd: number | null;
  updated_at: string;
}

const BitcoinTreasuriesLive = () => {
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTreasuries = async () => {
    const { data, error } = await supabase
      .from('bitcoin_treasuries')
      .select('*')
      .order('rank', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching treasuries:', error);
      return;
    }

    if (data && data.length > 0) {
      setTreasuries(data);
      setLastUpdated(data[0]?.updated_at);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-bitcoin-treasuries');
      
      if (error) {
        throw error;
      }

      if (data?.success) {
        toast.success(`Updated ${data.count} treasury entries`);
        await fetchTreasuries();
      } else {
        toast.error(data?.error || 'Failed to refresh data');
      }
    } catch (error) {
      console.error('Error refreshing:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuries();
  }, []);

  const chartData = treasuries.slice(0, 8).map(t => ({
    name: t.ticker || t.company_name.slice(0, 8),
    btc: t.bitcoin_holdings,
    fullName: t.company_name,
  }));

  const totalBTC = treasuries.reduce((sum, t) => sum + t.bitcoin_holdings, 0);
  const btcPrice = treasuries[0]?.btc_price_usd || 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-2">{data.fullName}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Holdings:</span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {data.btc.toLocaleString()} BTC
          </span>
        </div>
        {btcPrice > 0 && (
          <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-xs text-muted-foreground">Value:</span>
            <span className="text-sm font-semibold text-accent tabular-nums">
              ${(data.btc * btcPrice / 1e9).toFixed(2)}B
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Top 10 Companies</span>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {totalBTC.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">BTC Holdings</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Total Value</span>
          </div>
          <div className="text-2xl font-bold text-accent tabular-nums">
            ${btcPrice > 0 ? (totalBTC * btcPrice / 1e9).toFixed(1) : '—'}B
          </div>
          <div className="text-xs text-muted-foreground">USD</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/40 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <span>BTC Price</span>
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums">
            ${btcPrice > 0 ? btcPrice.toLocaleString() : '—'}
          </div>
          <div className="text-xs text-muted-foreground">Live</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/40">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
          {lastUpdated && (
            <div className="text-[10px] text-muted-foreground mt-2 text-center">
              Last: {new Date(lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <ChartContainer
          title="Institutional Bitcoin Holdings"
          subtitle="Top public companies by BTC on balance sheet"
          figure="Figure — Corporate Treasury Analysis"
          source="bitcointreasuries.net"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
              <CartesianGrid 
                strokeDasharray="1 0" 
                stroke="hsl(var(--border))" 
                opacity={0.4}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                type="number" 
                axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} />
              <Bar dataKey="btc" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? 'hsl(var(--primary))' : `hsl(var(--primary) / ${1 - index * 0.08})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Table */}
      {treasuries.length > 0 && (
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40">
            <h4 className="text-base font-semibold text-foreground">Top Corporate Bitcoin Treasuries</h4>
            <p className="text-xs text-muted-foreground mt-1">Public companies holding BTC on balance sheet</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ticker</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">BTC</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {treasuries.map((t) => (
                  <tr key={t.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{t.rank}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{t.company_name}</td>
                    <td className="px-4 py-3 text-sm text-primary font-mono">{t.ticker || '—'}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right tabular-nums font-medium">
                      {t.bitcoin_holdings.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent text-right tabular-nums">
                      ${t.value_usd ? (t.value_usd / 1e9).toFixed(2) + 'B' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-border/30 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/70">Source: bitcointreasuries.net</span>
            <a 
              href="https://bitcointreasuries.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-primary hover:underline flex items-center gap-1"
            >
              View Full List <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {treasuries.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">No treasury data available</p>
          <Button onClick={refreshData} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Fetch Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default BitcoinTreasuriesLive;
