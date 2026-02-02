import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Plus, 
  Trash2, 
  Scale, 
  AlertCircle, 
  CheckCircle2,
  Search,
  TrendingUp,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Common tickers database for autocomplete
const TICKER_DATABASE = [
  // US Large Cap
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financials' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { ticker: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financials' },
  { ticker: 'HD', name: 'The Home Depot', sector: 'Consumer Cyclical' },
  { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy' },
  { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
  { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
  { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Defensive' },
  { ticker: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Defensive' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer Defensive' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare' },
  { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
  { ticker: 'DIS', name: 'Walt Disney Company', sector: 'Communication Services' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
  { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
  { ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Technology' },
  { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  // ETFs
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'ETF' },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', sector: 'ETF' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF' },
  { ticker: 'VTI', name: 'Vanguard Total Stock Market', sector: 'ETF' },
  { ticker: 'IWM', name: 'iShares Russell 2000', sector: 'ETF' },
  { ticker: 'EFA', name: 'iShares MSCI EAFE', sector: 'ETF' },
  { ticker: 'EEM', name: 'iShares MSCI Emerging Markets', sector: 'ETF' },
  { ticker: 'AGG', name: 'iShares Core US Aggregate Bond', sector: 'ETF' },
  { ticker: 'BND', name: 'Vanguard Total Bond Market', sector: 'ETF' },
  { ticker: 'GLD', name: 'SPDR Gold Shares', sector: 'ETF' },
  { ticker: 'TLT', name: 'iShares 20+ Year Treasury', sector: 'ETF' },
  { ticker: 'VNQ', name: 'Vanguard Real Estate ETF', sector: 'ETF' },
  { ticker: 'ARKK', name: 'ARK Innovation ETF', sector: 'ETF' },
  { ticker: 'XLF', name: 'Financial Select Sector SPDR', sector: 'ETF' },
  { ticker: 'XLK', name: 'Technology Select Sector SPDR', sector: 'ETF' },
  { ticker: 'XLE', name: 'Energy Select Sector SPDR', sector: 'ETF' },
  { ticker: 'XLV', name: 'Health Care Select Sector SPDR', sector: 'ETF' },
  // Crypto
  { ticker: 'BTC', name: 'Bitcoin', sector: 'Cryptocurrency' },
  { ticker: 'ETH', name: 'Ethereum', sector: 'Cryptocurrency' },
  { ticker: 'SOL', name: 'Solana', sector: 'Cryptocurrency' },
  { ticker: 'XRP', name: 'Ripple', sector: 'Cryptocurrency' },
  { ticker: 'ADA', name: 'Cardano', sector: 'Cryptocurrency' },
  { ticker: 'DOGE', name: 'Dogecoin', sector: 'Cryptocurrency' },
  { ticker: 'AVAX', name: 'Avalanche', sector: 'Cryptocurrency' },
  { ticker: 'DOT', name: 'Polkadot', sector: 'Cryptocurrency' },
  { ticker: 'LINK', name: 'Chainlink', sector: 'Cryptocurrency' },
  { ticker: 'MATIC', name: 'Polygon', sector: 'Cryptocurrency' },
  // International
  { ticker: 'BABA', name: 'Alibaba Group', sector: 'Consumer Cyclical' },
  { ticker: 'TSM', name: 'Taiwan Semiconductor', sector: 'Technology' },
  { ticker: 'NVO', name: 'Novo Nordisk', sector: 'Healthcare' },
  { ticker: 'ASML', name: 'ASML Holding', sector: 'Technology' },
  { ticker: 'TM', name: 'Toyota Motor', sector: 'Consumer Cyclical' },
  { ticker: 'SAP', name: 'SAP SE', sector: 'Technology' },
];

export interface PortfolioHolding {
  id: string;
  ticker: string;
  name: string;
  weight: number;
  sector: string;
}

interface EnhancedPortfolioInputProps {
  onPortfolioChange: (holdings: PortfolioHolding[]) => void;
  initialHoldings?: PortfolioHolding[];
}

export const EnhancedPortfolioInput: React.FC<EnhancedPortfolioInputProps> = ({
  onPortfolioChange,
  initialHoldings = [],
}) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(
    initialHoldings.length > 0 ? initialHoldings : [
      { id: '1', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', weight: 40, sector: 'ETF' },
      { id: '2', ticker: 'QQQ', name: 'Invesco QQQ Trust', weight: 25, sector: 'ETF' },
      { id: '3', ticker: 'AAPL', name: 'Apple Inc.', weight: 15, sector: 'Technology' },
      { id: '4', ticker: 'BTC', name: 'Bitcoin', weight: 10, sector: 'Cryptocurrency' },
      { id: '5', ticker: 'GLD', name: 'SPDR Gold Shares', weight: 10, sector: 'ETF' },
    ]
  );
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalWeight = holdings.reduce((sum, h) => sum + h.weight, 0);
  const isBalanced = Math.abs(totalWeight - 100) < 0.1;

  useEffect(() => {
    onPortfolioChange(holdings);
  }, [holdings, onPortfolioChange]);

  const addHolding = () => {
    const newId = Date.now().toString();
    setHoldings([...holdings, { 
      id: newId, 
      ticker: '', 
      name: '', 
      weight: 0,
      sector: '' 
    }]);
    setOpenPopover(newId);
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const selectTicker = (holdingId: string, tickerData: typeof TICKER_DATABASE[0]) => {
    setHoldings(holdings.map(h => 
      h.id === holdingId 
        ? { ...h, ticker: tickerData.ticker, name: tickerData.name, sector: tickerData.sector }
        : h
    ));
    setOpenPopover(null);
    setSearchQuery('');
  };

  const updateWeight = (id: string, weight: number) => {
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, weight } : h
    ));
  };

  const autoBalance = () => {
    const count = holdings.length;
    if (count === 0) return;
    
    const equalWeight = Math.floor(100 / count);
    const remainder = 100 - (equalWeight * count);
    
    setHoldings(holdings.map((h, i) => ({
      ...h,
      weight: equalWeight + (i === 0 ? remainder : 0)
    })));
  };

  const normalizeWeights = () => {
    if (totalWeight === 0) return;
    
    setHoldings(holdings.map(h => ({
      ...h,
      weight: Math.round((h.weight / totalWeight) * 100 * 10) / 10
    })));
  };

  const filteredTickers = TICKER_DATABASE.filter(t => 
    t.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Cryptocurrency': return <Coins className="h-3 w-3" />;
      case 'ETF': return <TrendingUp className="h-3 w-3" />;
      default: return null;
    }
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Healthcare': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Financials': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Consumer Cyclical': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Consumer Defensive': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Energy': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'ETF': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Cryptocurrency': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Communication Services': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[sector] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Portfolio Holdings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={autoBalance}
              title="Distribute weights equally"
            >
              <Scale className="h-4 w-4 mr-1" />
              Equal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={normalizeWeights}
              disabled={totalWeight === 0}
              title="Normalize to 100%"
            >
              Normalize
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Allocation</span>
            <span className={cn(
              "font-bold flex items-center gap-1",
              isBalanced ? "text-emerald-400" : totalWeight > 100 ? "text-red-400" : "text-amber-400"
            )}>
              {isBalanced ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {totalWeight.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.min(totalWeight, 100)} 
            className={cn(
              "h-2",
              totalWeight > 100 && "[&>div]:bg-red-500"
            )}
          />
        </div>

        {/* Holdings List */}
        <div className="space-y-3">
          {holdings.map((holding) => (
            <div 
              key={holding.id} 
              className="grid grid-cols-[1fr,120px,40px] gap-3 items-center p-3 bg-muted/30 rounded-lg border border-border/50"
            >
              {/* Ticker Selector */}
              <div className="space-y-1">
                <Popover 
                  open={openPopover === holding.id} 
                  onOpenChange={(open) => setOpenPopover(open ? holding.id : null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between h-10"
                    >
                      {holding.ticker ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{holding.ticker}</span>
                          {holding.sector && (
                            <Badge variant="outline" className={cn("text-[10px]", getSectorColor(holding.sector))}>
                              {getSectorIcon(holding.sector)}
                              <span className="ml-1">{holding.sector}</span>
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Search ticker...
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search ticker or name..." 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No ticker found. You can still type "{searchQuery}" manually.
                            <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => {
                                selectTicker(holding.id, { 
                                  ticker: searchQuery.toUpperCase(), 
                                  name: searchQuery.toUpperCase(),
                                  sector: 'Custom'
                                });
                              }}
                            >
                              Use "{searchQuery.toUpperCase()}"
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredTickers.map((t) => (
                            <CommandItem
                              key={t.ticker}
                              value={t.ticker}
                              onSelect={() => selectTicker(holding.id, t)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span className="font-mono font-bold">{t.ticker}</span>
                                  <span className="text-muted-foreground text-xs ml-2">{t.name}</span>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px]", getSectorColor(t.sector))}>
                                  {t.sector}
                                </Badge>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {holding.name && holding.name !== holding.ticker && (
                  <p className="text-xs text-muted-foreground truncate pl-1">{holding.name}</p>
                )}
              </div>

              {/* Weight Slider */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Slider
                    value={[holding.weight]}
                    onValueChange={([value]) => updateWeight(holding.id, value)}
                    max={100}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="font-mono text-sm w-12 text-right">
                    {holding.weight.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHolding(holding.id)}
                disabled={holdings.length <= 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Holding */}
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={addHolding}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Holding
        </Button>

        {/* Sector Summary */}
        {holdings.length > 0 && holdings.some(h => h.sector) && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Sector Allocation</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                holdings.reduce((acc, h) => {
                  if (h.sector) {
                    acc[h.sector] = (acc[h.sector] || 0) + h.weight;
                  }
                  return acc;
                }, {} as Record<string, number>)
              ).sort((a, b) => b[1] - a[1]).map(([sector, weight]) => (
                <Badge 
                  key={sector} 
                  variant="outline"
                  className={cn(getSectorColor(sector))}
                >
                  {sector}: {weight.toFixed(1)}%
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioInput;
