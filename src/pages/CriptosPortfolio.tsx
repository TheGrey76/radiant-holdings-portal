import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertTriangle, Shield, Cpu, Coins, Globe, Brain, Image, Layers, Landmark, DollarSign, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface LivePrice {
  price_usd: number | null;
  price_eur: number | null;
  change_24h: number | null;
  market_cap_usd: number | null;
  volume_24h_usd: number | null;
}

interface CryptoOutlook {
  symbol: string;
  name: string;
  description: string | null;
  current_status: string | null;
  drivers: string[];
  medium_term_outlook: string | null;
  medium_term_sentiment: string;
  long_term_outlook: string | null;
  long_term_sentiment: string;
  risks: string[];
  ai_commentary: string | null;
  fear_greed_at_update: number | null;
  price_usd_at_update: number | null;
  last_updated_at: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  TON: <Globe className="w-5 h-5" />,
  LINK: <Shield className="w-5 h-5" />,
  ONDO: <Landmark className="w-5 h-5" />,
  TAO: <Brain className="w-5 h-5" />,
  RENDER: <Image className="w-5 h-5" />,
  SUI: <Layers className="w-5 h-5" />,
  AAVE: <Coins className="w-5 h-5" />,
  RSR: <DollarSign className="w-5 h-5" />,
};

const LINKS_MAP: Record<string, { label: string; url: string }[]> = {
  TON: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/toncoin" }],
  LINK: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/chainlink" }],
  ONDO: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/ondo" }],
  TAO: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/bittensor" }],
  RENDER: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/render-token" }],
  SUI: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/sui" }],
  AAVE: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/aave" }],
  RSR: [{ label: "CoinGecko", url: "https://www.coingecko.com/en/coins/reserve-rights" }],
};

const USE_CASE_MAP: Record<string, string> = {
  TON: "Layer-1 con Telegram integrato",
  LINK: "Oracle infrastrutturale",
  ONDO: "Tokenizzazione RWAs",
  TAO: "AI marketplace",
  RENDER: "Rendering compute",
  SUI: "Layer-1 scalabile",
  AAVE: "DeFi lending",
  RSR: "Stablecoin support",
};

// Hooks
const useCryptoPrices = () =>
  useQuery({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-crypto-prices");
      if (error) throw new Error(error.message);
      return data?.results as Record<string, LivePrice> | undefined;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  });

const useCryptoOutlook = () =>
  useQuery({
    queryKey: ["crypto-outlook"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crypto_portfolio_outlook")
        .select("*")
        .order("symbol");
      if (error) throw error;
      return data as CryptoOutlook[];
    },
    refetchInterval: 300000, // every 5 min
  });

// Helpers
const formatUsd = (v: number | null | undefined) =>
  v != null ? `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: v < 1 ? 6 : 2 })}` : "—";
const formatEur = (v: number | null | undefined) =>
  v != null ? `€${v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: v < 1 ? 6 : 2 })}` : "—";
const formatMcap = (v: number | null | undefined) => {
  if (v == null) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
};
const formatChange = (v: number | null | undefined) =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

const sentimentColor = (s: string) => {
  switch (s) {
    case "bullish": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "neutral": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "bearish": return "bg-red-500/10 text-red-400 border-red-500/30";
    case "speculative": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const sentimentIcon = (s: string) => {
  switch (s) {
    case "bullish": return <TrendingUp className="w-3.5 h-3.5" />;
    case "bearish": return <TrendingDown className="w-3.5 h-3.5" />;
    default: return <Minus className="w-3.5 h-3.5" />;
  }
};

const sentimentLabel = (s: string) => {
  switch (s) {
    case "bullish": return "Bullish";
    case "neutral": return "Neutrale";
    case "bearish": return "Bearish";
    case "speculative": return "Speculativo";
    default: return s;
  }
};

const PriceTooltipContent = ({ price }: { price: LivePrice }) => (
  <div className="space-y-1.5 text-xs min-w-[180px]">
    <div className="flex justify-between">
      <span className="text-muted-foreground">USD</span>
      <span className="font-mono font-semibold">{formatUsd(price.price_usd)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">EUR</span>
      <span className="font-mono font-semibold">{formatEur(price.price_eur)}</span>
    </div>
    <Separator className="bg-border/30" />
    <div className="flex justify-between">
      <span className="text-muted-foreground">24h</span>
      <span className={`font-mono font-semibold ${(price.change_24h ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {formatChange(price.change_24h)}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">Mkt Cap</span>
      <span className="font-mono">{formatMcap(price.market_cap_usd)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">Vol 24h</span>
      <span className="font-mono">{formatMcap(price.volume_24h_usd)}</span>
    </div>
  </div>
);

const LivePriceBadge = ({ price, loading }: { price?: LivePrice; loading: boolean }) => {
  if (loading) return <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />;
  if (!price?.price_usd) return null;
  const change = price.change_24h ?? 0;
  const isUp = change >= 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-help">
          <span className="font-mono text-sm font-semibold text-foreground">{formatUsd(price.price_usd)}</span>
          <span className={`text-xs font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp className="w-3 h-3 inline mr-0.5" /> : <TrendingDown className="w-3 h-3 inline mr-0.5" />}
            {formatChange(price.change_24h)}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-popover border-border p-3">
        <PriceTooltipContent price={price} />
      </TooltipContent>
    </Tooltip>
  );
};

const CriptosPortfolio = () => {
  const { data: prices, isLoading: pricesLoading } = useCryptoPrices();
  const { data: outlooks, isLoading: outlookLoading } = useCryptoOutlook();

  const sortedOutlooks = outlooks?.sort((a, b) => {
    const order = ["TON", "LINK", "ONDO", "TAO", "RENDER", "SUI", "AAVE", "RSR"];
    return order.indexOf(a.symbol) - order.indexOf(b.symbol);
  }) || [];

  const lastUpdate = sortedOutlooks[0]?.last_updated_at;

  if (outlookLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Cpu className="w-3.5 h-3.5 mr-1.5" />
              Crypto Analysis — Aggiornamento AI Dinamico
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Criptos Portfolio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Report dinamico generato da AI basato su prezzi live, news di mercato e sentiment.
              Analisi aggiornata automaticamente ogni 6 ore.
            </p>
            {lastUpdate && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>
                  Ultimo aggiornamento AI:{" "}
                  {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true, locale: it })}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Riepilogo Outlook</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead className="text-muted-foreground font-semibold">Token</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Prezzo Live</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Caso d'uso</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Medio periodo</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Lungo periodo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOutlooks.map((o) => (
                      <TableRow key={o.symbol} className="border-border/20 hover:bg-muted/30">
                        <TableCell>
                          <a href={`#${o.symbol}`} className="font-bold text-primary hover:underline cursor-pointer">
                            {o.symbol}
                          </a>
                        </TableCell>
                        <TableCell>
                          <LivePriceBadge price={prices?.[o.symbol]} loading={pricesLoading} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                          {USE_CASE_MAP[o.symbol] || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${sentimentColor(o.medium_term_sentiment)}`}>
                            {sentimentIcon(o.medium_term_sentiment)}
                            <span className="ml-1">{sentimentLabel(o.medium_term_sentiment)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${sentimentColor(o.long_term_sentiment)}`}>
                            {sentimentIcon(o.long_term_sentiment)}
                            <span className="ml-1">{sentimentLabel(o.long_term_sentiment)}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Individual Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {sortedOutlooks.map((o, index) => {
            const livePrice = prices?.[o.symbol];
            const links = LINKS_MAP[o.symbol] || [];
            return (
              <motion.div
                key={o.symbol}
                id={o.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        {ICON_MAP[o.symbol] || <Coins className="w-5 h-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{o.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground">{o.name}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-3 flex-wrap">
                        <LivePriceBadge price={livePrice} loading={pricesLoading} />
                        <Badge variant="outline" className={`text-xs ${sentimentColor(o.medium_term_sentiment)}`}>
                          MP: {sentimentLabel(o.medium_term_sentiment)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${sentimentColor(o.long_term_sentiment)}`}>
                          LP: {sentimentLabel(o.long_term_sentiment)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* AI Commentary */}
                    {o.ai_commentary && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Analisi AI</p>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{o.ai_commentary}</p>
                      </div>
                    )}

                    {/* Description */}
                    {o.description && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1.5">Descrizione fondamentale</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{o.description}</p>
                      </div>
                    )}

                    {/* Current Status */}
                    {o.current_status && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1.5">Situazione attuale</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{o.current_status}</p>
                      </div>
                    )}

                    <Separator className="bg-border/30" />

                    {/* Drivers */}
                    {o.drivers && o.drivers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Driver fondamentali</h4>
                        <ul className="space-y-1.5">
                          {o.drivers.map((driver, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {driver}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Outlook */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Medio periodo</p>
                        <p className="text-sm text-foreground">{o.medium_term_outlook || sentimentLabel(o.medium_term_sentiment)}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lungo periodo</p>
                        <p className="text-sm text-foreground">{o.long_term_outlook || sentimentLabel(o.long_term_sentiment)}</p>
                      </div>
                    </div>

                    {/* Risks */}
                    {o.risks && o.risks.length > 0 && (
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Rischi</p>
                        </div>
                        <ul className="space-y-1">
                          {o.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-muted-foreground">{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Links */}
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {links.map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="py-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Nota:</strong> Tutte le criptovalute sono asset altamente volatili.
                  La performance passata non è garanzia di risultati futuri e l'analisi qui fornita non costituisce
                  consulenza finanziaria o raccomandazione di investimento. Il contesto macro, regolatorio e tecnologico
                  può modificare sostanzialmente le prospettive di ciascun progetto.
                  L'analisi è generata automaticamente da intelligenza artificiale e potrebbe contenere inesattezze.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CriptosPortfolio;
