import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertTriangle, Shield, Cpu, Coins, Globe, Brain, Image, Layers, Landmark, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CryptoAsset {
  symbol: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  currentStatus: string;
  drivers: string[];
  mediumTerm: string;
  mediumSentiment: "bullish" | "neutral" | "bearish" | "speculative";
  longTerm: string;
  longSentiment: "bullish" | "neutral" | "bearish" | "speculative";
  risks: string[];
  links: { label: string; url: string }[];
}

interface LivePrice {
  price_usd: number | null;
  price_eur: number | null;
  change_24h: number | null;
  market_cap_usd: number | null;
  volume_24h_usd: number | null;
}

const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-crypto-prices");
      if (error) throw new Error(error.message);
      return data?.results as Record<string, LivePrice> | undefined;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  });
};

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
const formatVol = formatMcap;
const formatChange = (v: number | null | undefined) =>
  v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—";

const cryptoAssets: CryptoAsset[] = [
  {
    symbol: "TON",
    name: "Toncoin",
    icon: <Globe className="w-5 h-5" />,
    description: "TON è la criptovaluta nativa di The Open Network, un layer-1 originariamente sviluppato da Telegram e oggi indipendente con forte integrazione nella user base Telegram. Utilizzato per trasferimenti, dApp, storage decentralizzato e staking.",
    currentStatus: "Prezzo stabile attorno a ~$1.45-1.50; capitalizzazione di mercato ~3.6 mld USD.",
    drivers: [
      "Integrazione con Telegram e wallet nativo",
      "Sviluppi roadmap come TON Storage, bridge Bitcoin e miglioramenti di performance"
    ],
    mediumTerm: "Neutrale-bullish se adoption aumenta",
    mediumSentiment: "neutral",
    longTerm: "Bullish se user adoption reale",
    longSentiment: "bullish",
    risks: [
      "Forte correlazione con performance macro crypto",
      "Necessità di effettiva adozione di dApp oltre ai casi d'uso di pagamento"
    ],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/TON_(blockchain)" },
      { label: "CoinGecko", url: "https://www.coingecko.com/en/coins/toncoin" }
    ]
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    icon: <Shield className="w-5 h-5" />,
    description: "Rete oracle decentralizzata che fornisce dati off-chain a smart contracts, usata diffusamente in DeFi e applicazioni blockchain.",
    currentStatus: "Prezzo soggetto a rebound tecnico da livelli compressi; market cap superiore ai 6 mld USD.",
    drivers: [
      "Adozione di servizi oracle (Price Feeds, CCIP)",
      "Riserva in crescita e accumulo da parte di wallet istituzionali"
    ],
    mediumTerm: "Potenziale rebound tecnico — target $15-25 in scenari favorevoli",
    mediumSentiment: "bullish",
    longTerm: "Forte in scenari DeFi espansi",
    longSentiment: "bullish",
    risks: [
      "Forte competizione in oracles",
      "Inefficienze se domanda di dati on-chain rallenta"
    ],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Chainlink_(blockchain_oracle)" },
      { label: "CoinGecko", url: "https://www.coingecko.com/en/coins/chainlink" }
    ]
  },
  {
    symbol: "ONDO",
    name: "Ondo Finance",
    icon: <Landmark className="w-5 h-5" />,
    description: "Token di governance per Ondo Finance, ecosistema orientato alla tokenizzazione di asset reali (RWAs: obbligazioni, azioni, stablecoin yield).",
    currentStatus: "Prezzo e capitalizzazione moderate con trend rialzista recente e crescente attività sociale.",
    drivers: [
      "Tokenizzazione di asset tradizionali on-chain",
      "Compliance normativo come vantaggio competitivo",
      "Espansione di prodotti e partnership"
    ],
    mediumTerm: "Bullish se istituzionali adottano",
    mediumSentiment: "bullish",
    longTerm: "Crescita legata a asset tokenizzati",
    longSentiment: "bullish",
    risks: [
      "Dipendenza da contesto normativo",
      "Real yield effettivi derivanti da asset sottostanti"
    ],
    links: [
      { label: "CoinMarketCap", url: "https://coinmarketcap.com/cmc-ai/ondo-finance/what-is/" },
      { label: "CoinGecko", url: "https://www.coingecko.com/en/coins/ondo" }
    ]
  },
  {
    symbol: "TAO",
    name: "Bittensor",
    icon: <Brain className="w-5 h-5" />,
    description: "TAO è il token della rete Bittensor, un mercato decentralizzato per machine learning e AI dove i modelli vengono incentivati a contribuire valore al network.",
    currentStatus: "Progetto emergente nel settore crypto-AI con capitalizzazione in crescita.",
    drivers: [
      "AI marketplace decentralizzato",
      "Incentivi per contribuzione di modelli ML al network"
    ],
    mediumTerm: "Speculativo, dipende adoption",
    mediumSentiment: "speculative",
    longTerm: "Alto rischio/alto potenziale",
    longSentiment: "speculative",
    risks: [
      "Tecnologie AI tokenizzate sono altamente speculative",
      "Dipendono da adoption molto più ampia di quella attuale"
    ],
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bittensor" }
    ]
  },
  {
    symbol: "RENDER",
    name: "Render Network",
    icon: <Image className="w-5 h-5" />,
    description: "Piattaforma decentralizzata per servizi di rendering GPU distribuito, utilizzata per visual compute, AI e applicazioni grafiche su blockchain.",
    currentStatus: "Movimenti di prezzo volatili con rally significativi in brevi periodi.",
    drivers: [
      "Domanda per servizi di rendering decentralizzato",
      "Utilizzo in settori visual compute su blockchain"
    ],
    mediumTerm: "Speculativo",
    mediumSentiment: "speculative",
    longTerm: "Dipende da adozione reale",
    longSentiment: "neutral",
    risks: [
      "Trend speculativo prevalente",
      "Attenzione ai livelli di resistenza tecnica"
    ],
    links: [
      { label: "AMBCrypto", url: "https://ambcrypto.com/render-outpaces-link-and-tao-with-21-rally-watch-this-closely/" }
    ]
  },
  {
    symbol: "SUI",
    name: "Sui Network",
    icon: <Layers className="w-5 h-5" />,
    description: "Layer-1 con architettura altamente scalabile e motore Move VM, orientato a DeFi e infrastruttura blockchain di nuova generazione.",
    currentStatus: "Prezzo sotto ATH con forte volume e interesse per sviluppi DeFi e potenziali ETF.",
    drivers: [
      "Crescita degli sviluppatori e TVL",
      "Potenziale ETF basato su SUI in pipeline"
    ],
    mediumTerm: "Neutrale-bullish con volumi attivi",
    mediumSentiment: "neutral",
    longTerm: "Bullish se ecosystem cresce",
    longSentiment: "bullish",
    risks: [
      "Supporto tecnico critico",
      "Sentiment del mercato crypto globale determinante"
    ],
    links: [
      { label: "CoinMarketCap", url: "https://coinmarketcap.com/currencies/sui/" },
      { label: "Changelly", url: "https://changelly.com/blog/sui-sui-price-prediction/" }
    ]
  },
  {
    symbol: "AAVE",
    name: "Aave Protocol",
    icon: <Coins className="w-5 h-5" />,
    description: "Progetto DeFi di lending/borrowing pionieristico con token governance e utilizzo nel protocol safety module.",
    currentStatus: "Consolidato come infrastruttura DeFi core con volumi stabili.",
    drivers: [
      "Protocollo DeFi lending leader",
      "Possibile apprezzamento in scenari bull market esteso"
    ],
    mediumTerm: "Stable in DeFi",
    mediumSentiment: "neutral",
    longTerm: "Dipende uso/DeFi growth",
    longSentiment: "neutral",
    risks: [
      "Performance dipende dal volume di utilizzo DeFi",
      "Liquidità complessiva e rischi regolatori"
    ],
    links: [
      { label: "Aave", url: "https://aave.com/" },
      { label: "Changelly", url: "https://changelly.com/blog/aave-price-prediction/" }
    ]
  },
  {
    symbol: "RSR",
    name: "Reserve Rights",
    icon: <DollarSign className="w-5 h-5" />,
    description: "ERC-20 token associato al protocol Reserve per overcollateralizzazione di stablecoin e governance.",
    currentStatus: "Prezzi molto bassi e capitalizzazione relativamente modesta, trend laterale/compresso.",
    drivers: [
      "Ecosistema stablecoin sottostante",
      "Utilità nella governance del protocollo Reserve"
    ],
    mediumTerm: "Rischio alto",
    mediumSentiment: "bearish",
    longTerm: "Dipende validità stablecoin",
    longSentiment: "neutral",
    risks: [
      "Ecosistema stablecoin meno attivo rispetto a competitor",
      "Capitalizzazione modesta e scarsa liquidità"
    ],
    links: [
      { label: "CoinGecko", url: "https://www.coingecko.com/en/coins/reserve-rights" }
    ]
  }
];

const useCaseMap: Record<string, string> = {
  TON: "Layer-1 con Telegram integrato",
  LINK: "Oracle infrastrutturale",
  ONDO: "Tokenizzazione RWAs",
  TAO: "AI marketplace",
  RENDER: "Rendering compute",
  SUI: "Layer-1 scalabile",
  AAVE: "DeFi lending",
  RSR: "Stablecoin support",
};

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
      <span className="font-mono">{formatVol(price.volume_24h_usd)}</span>
    </div>
  </div>
);

const LivePriceBadge = ({ price, loading }: { price?: LivePrice; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
      </div>
    );
  }
  if (!price?.price_usd) return null;
  
  const change = price.change_24h ?? 0;
  const isUp = change >= 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-help">
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatUsd(price.price_usd)}
          </span>
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
              Crypto Analysis — Febbraio 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Criptos Portfolio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Report sintetico e strutturato sulle principali caratteristiche, prospettive di mercato e
              considerazioni di lungo/medio periodo per 8 criptovalute selezionate.
            </p>
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
                    {cryptoAssets.map((asset) => (
                      <TableRow key={asset.symbol} className="border-border/20 hover:bg-muted/30">
                        <TableCell className="font-bold text-foreground">{asset.symbol}</TableCell>
                        <TableCell>
                          <LivePriceBadge price={prices?.[asset.symbol]} loading={pricesLoading} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                          {useCaseMap[asset.symbol]}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${sentimentColor(asset.mediumSentiment)}`}>
                            {sentimentIcon(asset.mediumSentiment)}
                            <span className="ml-1">{sentimentLabel(asset.mediumSentiment)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${sentimentColor(asset.longSentiment)}`}>
                            {sentimentIcon(asset.longSentiment)}
                            <span className="ml-1">{sentimentLabel(asset.longSentiment)}</span>
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
          {cryptoAssets.map((asset, index) => {
            const livePrice = prices?.[asset.symbol];
            return (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        {asset.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{asset.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-3 flex-wrap">
                        <LivePriceBadge price={livePrice} loading={pricesLoading} />
                        <Badge variant="outline" className={`text-xs ${sentimentColor(asset.mediumSentiment)}`}>
                          MP: {sentimentLabel(asset.mediumSentiment)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${sentimentColor(asset.longSentiment)}`}>
                          LP: {sentimentLabel(asset.longSentiment)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">Descrizione fondamentale</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{asset.description}</p>
                    </div>

                    {/* Current Status */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">Situazione attuale</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{asset.currentStatus}</p>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Drivers */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Driver fondamentali</h4>
                      <ul className="space-y-1.5">
                        {asset.drivers.map((driver, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {driver}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outlook */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Medio periodo</p>
                        <p className="text-sm text-foreground">{asset.mediumTerm}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lungo periodo</p>
                        <p className="text-sm text-foreground">{asset.longTerm}</p>
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Rischi</p>
                      </div>
                      <ul className="space-y-1">
                        {asset.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{risk}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    {asset.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {asset.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
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
