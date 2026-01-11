import { Helmet } from "react-helmet";
import { ArrowUp, TrendingUp, BarChart3, Layers, Database, Activity, Coins, Network, Target, LineChart, Lightbulb, HelpCircle, Shield, Globe, Scale, Calendar, Zap, AlertTriangle, GitBranch, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BitcoinPriceChart, 
  M2LiquidityChart, 
  RealRatesChart, 
  PriceScenariosChart, 
  ETFFlowChart, 
  MiningEconomicsChart 
} from "@/components/InstitutionalCharts";
import BitcoinTreasuriesLive from "@/components/BitcoinTreasuriesLive";
import { ReportSearch } from "@/components/ReportSearch";
import { FearGreedIndex } from "@/components/FearGreedIndex";
import { useBitcoinReportData } from "@/hooks/useBitcoinReportData";
import { useTwelveDataBtc } from "@/hooks/useTwelveDataBtc";
import { Link } from "react-router-dom";

// Glossary definitions in Italian
const glossary: Record<string, string> = {
  "M2": "Aggregato monetario che include contanti, depositi bancari e strumenti finanziari a breve termine. Misura la quantità totale di moneta disponibile nell'economia.",
  "tassi reali": "Tassi di interesse reali, calcolati sottraendo l'inflazione dai tassi nominali. Tassi reali negativi rendono Bitcoin più attraente come riserva di valore.",
  "flussi ETF": "Afflussi o deflussi di capitale dagli ETF Bitcoin. Indicatore chiave della domanda istituzionale e del sentiment degli investitori professionali.",
  "halving": "Evento programmato che dimezza la ricompensa del mining per Bitcoin ogni 210.000 blocchi (circa ogni 4 anni), riducendo l'offerta di nuovi Bitcoin.",
  "riserva di valore": "Asset che mantiene il suo valore nel tempo senza deprezzarsi. Bitcoin è sempre più considerato un 'oro digitale' con questa funzione.",
  "hash rate": "Potenza computazionale totale della rete Bitcoin, misura della sicurezza e dell'adozione dei miner.",
  "on-chain": "Dati e metriche derivate direttamente dalla blockchain Bitcoin, come transazioni, indirizzi attivi e volume di scambio.",
  "QE": "Quantitative Easing - politica monetaria espansiva in cui le banche centrali acquistano asset per aumentare la liquidità nel sistema finanziario.",
  "Fed pivot": "Cambio di direzione della politica monetaria della Federal Reserve, tipicamente da restrittiva (tassi alti) a espansiva (tassi bassi).",
  "risk-on": "Ambiente di mercato dove gli investitori sono disposti a prendere rischi e allocare capitale su asset più volatili come azioni e criptovalute.",
  "condizioni di liquidità": "Disponibilità di capitale nel sistema finanziario. Maggiore liquidità tende a favorire asset come Bitcoin.",
  "ETF": "Exchange-Traded Fund - fondo di investimento negoziato in borsa che replica un asset o indice sottostante, permettendo un'esposizione semplificata.",
  "macro-liquidità": "Aggregato della liquidità globale determinato dalle politiche monetarie delle banche centrali, crescita M2 e condizioni creditizie.",
  "bilancio": "Stato patrimoniale che mostra attività, passività e patrimonio netto di un'entità. Per le banche centrali, indica espansione o contrazione monetaria."
};

// Glossary Term Component
const GlossaryTerm = ({ term, children }: { term: string; children: React.ReactNode }) => {
  const definition = glossary[term];
  
  if (!definition) return <>{children}</>;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted decoration-primary/50 cursor-help hover:decoration-primary transition-colors inline-flex items-baseline gap-0.5">
          {children}
          <HelpCircle className="w-3 h-3 text-primary/60 inline" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{definition}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Bitcoin2026ReportIT = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [daysUntilQ2, setDaysUntilQ2] = useState<number>(0);
  const { data: bitcoinData, loading: bitcoinLoading } = useBitcoinReportData();
  const { data: twelveData, isLoading: twelveLoading, error: twelveError } = useTwelveDataBtc();

  // Calculate days until Q2 2026 edition (April 1, 2026)
  useEffect(() => {
    const calculateDays = () => {
      const q2ReleaseDate = new Date('2026-04-01');
      const startDate = new Date('2026-01-07');
      const today = new Date();
      
      const effectiveToday = today < startDate ? startDate : today;
      const diffTime = q2ReleaseDate.getTime() - effectiveToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilQ2(Math.max(0, diffDays));
    };
    
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  // Animated Chapter Section Component
  const ChapterSection = ({ children, id, dataSection }: { children: React.ReactNode; id: string; dataSection: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.section
        ref={ref}
        id={id}
        data-section={dataSection}
        className="mb-24 scroll-mt-20 print-section"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: 'auto' }}
      >
        {children}
      </motion.section>
    );
  };

  // Key Takeaways Component
  const KeyTakeaways = ({ insights }: { insights: string[] }) => {
    const colors = [
      'from-primary/10 to-primary/5 border-primary/20',
      'from-accent/10 to-accent/5 border-accent/20',
      'from-blue-500/10 to-blue-500/5 border-blue-500/20',
      'from-purple-500/10 to-purple-500/5 border-purple-500/20',
    ];

    return (
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-background border-2 border-border/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Punti Chiave</h3>
        </div>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} border-2`}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Historical data for charts
  const btcHistoricalData = [
    { year: "2013", price: 0.1 },
    { year: "2014", price: 0.4 },
    { year: "2015", price: 0.3 },
    { year: "2016", price: 0.6 },
    { year: "2017", price: 19.5 },
    { year: "2018", price: 3.8 },
    { year: "2019", price: 7.2 },
    { year: "2020", price: 29.0 },
    { year: "2021", price: 69.0 },
    { year: "2022", price: 16.5 },
    { year: "2023", price: 42.0 },
    { year: "2024", price: 73.0 },
    { year: "2025", price: 108.0 },
  ];

  const m2LiquidityData = [
    { year: "2013", m2: 100 },
    { year: "2014", m2: 108 },
    { year: "2015", m2: 115 },
    { year: "2016", m2: 123 },
    { year: "2017", m2: 135 },
    { year: "2018", m2: 142 },
    { year: "2019", m2: 148 },
    { year: "2020", m2: 178 },
    { year: "2021", m2: 198 },
    { year: "2022", m2: 185 },
    { year: "2023", m2: 192 },
    { year: "2024", m2: 205 },
    { year: "2025", m2: 218 },
  ];

  const realRatesData = [
    { year: "2013", rate: -0.8 },
    { year: "2014", rate: -0.5 },
    { year: "2015", rate: 0.2 },
    { year: "2016", rate: -0.3 },
    { year: "2017", rate: 0.5 },
    { year: "2018", rate: 1.2 },
    { year: "2019", rate: 0.3 },
    { year: "2020", rate: -1.5 },
    { year: "2021", rate: -4.2 },
    { year: "2022", rate: 1.8 },
    { year: "2023", rate: 2.1 },
    { year: "2024", rate: 1.5 },
    { year: "2025", rate: 0.8 },
  ];

  const priceScenarioData = [
    { month: "Gen", base: 98, high: 185, stress: 52 },
    { month: "Mar", base: 105, high: 198, stress: 48 },
    { month: "Mag", base: 115, high: 215, stress: 50 },
    { month: "Lug", base: 120, high: 230, stress: 55 },
    { month: "Set", base: 125, high: 245, stress: 52 },
    { month: "Nov", base: 130, high: 258, stress: 58 },
  ];

  const etfFlowData = [
    { week: "S1", inflows: 450, outflows: 120 },
    { week: "S2", inflows: 520, outflows: 95 },
    { week: "S3", inflows: 380, outflows: 150 },
    { week: "S4", inflows: 610, outflows: 110 },
    { week: "S5", inflows: 490, outflows: 130 },
    { week: "S6", inflows: 580, outflows: 105 },
  ];

  const miningCostData = [
    { quarter: "T1", cost: 42, price: 98 },
    { quarter: "T2", cost: 45, price: 115 },
    { quarter: "T3", cost: 48, price: 125 },
    { quarter: "T4", cost: 51, price: 130 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.getAttribute('data-section') || '');
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chapters = [
    { id: "chapter-1", number: "I", title: "Executive Summary & Analisi Macro", icon: TrendingUp },
    { id: "chapter-2", number: "II", title: "Framework Avanzato dei Prezzi", icon: BarChart3 },
    { id: "chapter-3", number: "III", title: "Modelli Quantitativi di Regime", icon: Layers },
    { id: "chapter-4", number: "IV", title: "Dinamiche Flussi ETF & Microstruttura", icon: Network },
    { id: "chapter-5", number: "V", title: "Analisi On-Chain & Comportamento Entità", icon: Database },
    { id: "chapter-6", number: "VI", title: "Mercati Derivati & Posizionamento", icon: Activity },
    { id: "chapter-7", number: "VII", title: "Economia del Mining & Analisi Hashrate", icon: Coins },
    { id: "chapter-8", number: "VIII", title: "Dinamiche dell'Offerta & Holder Long-Term", icon: LineChart },
    { id: "chapter-9", number: "IX", title: "Analisi Scenari & Framework di Rischio", icon: Target },
    { id: "chapter-10", number: "X", title: "Target di Prezzo 2026 & Implicazioni", icon: TrendingUp },
    { id: "chapter-11", number: "XI", title: "Framework di Risk Management", icon: Shield },
    { id: "chapter-12", number: "XII", title: "Correlazioni Cross-Asset", icon: GitBranch },
    { id: "chapter-13", number: "XIII", title: "Panorama Regolamentare 2026", icon: Scale },
    { id: "chapter-14", number: "XIV", title: "Metriche di Adozione Istituzionale", icon: Globe },
    { id: "chapter-15", number: "XV", title: "Calendario Macro & Date Chiave 2026", icon: Calendar },
    { id: "chapter-16", number: "XVI", title: "Analisi Rischi Geopolitici", icon: AlertTriangle },
    { id: "chapter-17", number: "XVII", title: "Confronto Cicli Storici", icon: Activity },
    { id: "chapter-18", number: "XVIII", title: "Framework Strategia di Uscita", icon: LogOut },
    { id: "chapter-19", number: "XIX", title: "Lightning Network & Layer 2", icon: Zap },
  ];

  return (
    <TooltipProvider>
      <Helmet>
        <title>Bitcoin 2026: Analisi Istituzionale | ARIES76</title>
        <meta 
          name="description" 
          content="Analisi istituzionale completa della traiettoria di Bitcoin nel 2026 attraverso framework macro-liquidità e modellazione quantitativa." 
        />
        <html lang="it" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

        {/* Language Switcher */}
        <div className="fixed top-20 right-4 z-50 flex gap-2">
          <Link 
            to="/bitcoin-2026-report"
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm"
          >
            EN
          </Link>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            IT
          </span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
          
          <motion.div 
            className="absolute top-1/2 right-[10%] -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-48 h-48 rounded-full border-2 border-orange-500/30 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-4 rounded-full border border-orange-500/20"></div>
                <div className="absolute inset-8 rounded-full border border-dashed border-orange-500/15"></div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-orange-500/80">₿</span>
              </div>
            </div>
          </motion.div>
          
          <div className="container max-w-6xl mx-auto px-6 py-28 md:py-36 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Ricerca Istituzionale</span>
              </motion.div>
              
              {/* Main Title */}
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Bitcoin</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Q1 2026</span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-gray-400 font-medium tracking-wide">Edizione</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed max-w-2xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Analisi del Regime Macro-Liquidità & Framework di Valutazione Quantitativa
              </motion.p>

              {/* Live Bitcoin Price Ticker */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-400">₿</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Prezzo Live</span>
                      <AnimatePresence mode="wait">
                        {(twelveLoading && bitcoinLoading) ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-8 w-32 bg-gray-700/50 rounded animate-pulse"
                          />
                        ) : (
                          <motion.span
                            key={twelveData?.bitcoin_price_usd || bitcoinData?.bitcoin_price_usd}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold text-white tabular-nums"
                          >
                            ${(twelveData?.bitcoin_price_usd || bitcoinData?.bitcoin_price_usd)?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-orange-500/20"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">EUR</span>
                    <AnimatePresence mode="wait">
                      {(twelveLoading && bitcoinLoading) ? (
                        <motion.div
                          key="loading-eur"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"
                        />
                      ) : (
                        <motion.span
                          key={twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-lg font-semibold text-gray-300 tabular-nums"
                        >
                          €{(twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur)?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* 24h Change */}
                  {(twelveData?.change_24h !== undefined && twelveData?.change_24h !== null) && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      twelveData.change_24h >= 0 
                        ? 'bg-green-500/10' 
                        : 'bg-red-500/10'
                    }`}>
                      {twelveData.change_24h >= 0 ? (
                        <ArrowUp className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-red-400 rotate-180" />
                      )}
                      <span className={`text-sm font-semibold tabular-nums ${
                        twelveData.change_24h >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {Math.abs(twelveData.change_24h).toFixed(2)}%
                      </span>
                      <span className="text-xs text-gray-500">24h</span>
                    </div>
                  )}
                  <div className="hidden sm:flex items-center gap-2 ml-2">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>
              </motion.div>

              {/* Search Bar */}
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <ReportSearch chapters={chapters} glossary={glossary} />
              </motion.div>

              {/* Author Attribution */}
              <motion.div 
                className="flex flex-wrap items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-semibold text-white">ARIES76</span>
                    <span className="text-sm text-gray-500 ml-2">Capital Intelligence</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Edizione Q1 2026</span>
                </div>
                {daysUntilQ2 > 0 && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-medium text-orange-400">
                      Edizione Q2 tra {daysUntilQ2} giorni
                    </span>
                  </div>
                )}
                {bitcoinData?.current_regime && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-help ${
                        bitcoinData.current_regime === 'EXPANSION' 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : bitcoinData.current_regime === 'CONTRACTION'
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}>
                        <Activity className={`w-3.5 h-3.5 ${
                          bitcoinData.current_regime === 'EXPANSION' 
                            ? 'text-green-400' 
                            : bitcoinData.current_regime === 'CONTRACTION'
                            ? 'text-red-400'
                            : 'text-blue-400'
                        }`} />
                        <span className={`text-xs font-medium ${
                          bitcoinData.current_regime === 'EXPANSION' 
                            ? 'text-green-400' 
                            : bitcoinData.current_regime === 'CONTRACTION'
                            ? 'text-red-400'
                            : 'text-blue-400'
                        }`}>
                          Regime {bitcoinData.current_regime === 'EXPANSION' ? 'Espansione' : bitcoinData.current_regime === 'CONTRACTION' ? 'Contrazione' : 'Neutrale'}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="text-sm">
                        {bitcoinData.current_regime === 'EXPANSION' 
                          ? 'Condizioni macro favorevoli: tassi reali positivi e liquidità M2 in espansione supportano l\'apprezzamento di Bitcoin.'
                          : bitcoinData.current_regime === 'CONTRACTION'
                          ? 'Condizioni macro sfidanti: tassi reali negativi o liquidità M2 in contrazione potrebbero pressare i prezzi di Bitcoin.'
                          : 'Segnali macro misti: tassi reali e liquidità M2 non mostrano una chiara direzione.'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </motion.div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        {/* Live Data Banner */}
        <div className="bg-gradient-to-r from-green-500/10 via-primary/10 to-green-500/10 border-y border-green-500/30">
          <div className="container max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Report Dati Live</span>
              </div>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  I dati di questo report vengono aggiornati automaticamente ogni giorno alle 6:00 CET
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fear & Greed Index Section */}
        <div className="container max-w-6xl mx-auto px-6 pt-8">
          <div className="max-w-md">
            <FearGreedIndex />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="container max-w-6xl mx-auto px-6 pt-16 pb-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-10 border border-primary/20 shadow-xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <span className="text-primary">Executive Summary</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</span>
                <p className="text-muted-foreground leading-relaxed">
                  La traiettoria di Bitcoin nel 2026 NON è guidata dai cicli di halving—è governata dagli impulsi di liquidità M2 globale e dalle dinamiche dei tassi reali. Il nostro framework proprietario macro-liquidità rivela che l'accelerazione marginale di M2 produce risposte convesse al rialzo mentre la stagnazione innesca picchi di volatilità.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</span>
                <p className="text-muted-foreground leading-relaxed">
                  Target istituzionale: $138.000 (ponderato per probabilità su tre scenari). Caso base ($96k-$132k, 60% probabilità) assume espansione moderata della liquidità. Scenario alta convessità ($180k-$260k, 25%) richiede crescita sostenuta di M2 + rendimenti reali in calo. Regime stress ($45k-$60k, 15%) emerge solo con stretta monetaria aggressiva.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</span>
                <p className="text-muted-foreground leading-relaxed">
                  Il report integra dinamiche macro-liquidità, modelli quantitativi di regime, analisi derivati, metriche on-chain, economia del mining e intelligence istituzionale. Strategia azionabile inclusa per allocatori professionali e investitori retail sofisticati.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          <div className="flex gap-12">
            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl">

              {/* Table of Contents */}
              <motion.div 
                className="mb-24 p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border-2 border-border/60 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  Indice
                </h2>
                <nav className="grid md:grid-cols-2 gap-3">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        const element = document.getElementById(chapter.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="group flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 text-left border border-transparent hover:border-border/60"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {chapter.number}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {chapter.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </motion.div>

              {/* Chapter I */}
              <ChapterSection id="chapter-1" dataSection="chapter-1">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo I</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Executive Summary & Analisi del Regime Macro-Liquidità
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <p className="text-foreground/90 leading-relaxed m-0">
                      La traiettoria di Bitcoin nell'orizzonte 2025–2026 deve essere interpretata all'interno di un framework <GlossaryTerm term="macro-liquidità">macro-liquidità</GlossaryTerm> raffinato piuttosto che attraverso le euristiche semplicistiche che caratterizzavano i cicli precedenti. Bitcoin si è evoluto in un asset macro sensibile alla liquidità la cui formazione del prezzo è dominata dagli impulsi <GlossaryTerm term="M2">M2</GlossaryTerm> globali, dalle dinamiche dei <GlossaryTerm term="tassi reali">tassi reali</GlossaryTerm>, dalla trasmissione cross-border del dollaro, e dall'elasticità del <GlossaryTerm term="bilancio">bilancio</GlossaryTerm> degli intermediari bancari ombra e dei market maker degli <GlossaryTerm term="ETF">ETF</GlossaryTerm>.
                    </p>
                  </div>

                  <BitcoinPriceChart data={btcHistoricalData} />

                  <p className="text-foreground/80 leading-relaxed">
                    La Figura 1 illustra il percorso sintetico del prezzo di Bitcoin dal 2013 al 2025. Sebbene puramente basato su modello, la serie riproduce le caratteristiche strutturali fondamentali del comportamento storico di Bitcoin: fasi estese di apprezzamento coincidenti con abbondante liquidità globale, drawdown profondi durante periodi di stretta e quantitative tightening, e transizioni di regime innescate da punti di inflessione delle politiche e shock di funding.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 my-12">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                        Liquidità Globale
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        L'<GlossaryTerm term="M2">M2</GlossaryTerm> globale rimane la variabile macro più importante. Ciò che conta è l'impulso marginale di <GlossaryTerm term="condizioni di liquidità">liquidità</GlossaryTerm>: le accelerazioni producono risposte convesse in Bitcoin, mentre la stagnazione coincide con picchi di volatilità.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                        Impatto Tassi Reali
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        <GlossaryTerm term="tassi reali">Rendimenti reali</GlossaryTerm> in aumento aumentano il costo opportunità degli asset non fruttiferi. <GlossaryTerm term="tassi reali">Rendimenti reali</GlossaryTerm> in calo riducono quel costo e incentivano la ricerca di esposizioni convesse ad alto beta come Bitcoin.
                      </p>
                    </div>
                  </div>

                  <M2LiquidityChart data={m2LiquidityData} />

                  <RealRatesChart data={realRatesData} />

                  <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                    <h4 className="text-xl font-bold text-foreground mb-4">Sintesi Chiave</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      L'evidenza combinata supporta una chiara identità macro per Bitcoin. È un asset ad alta convessità, sensibile alla liquidità, il cui comportamento di prezzo è governato meno dai "cicli" e più dall'interazione tra crescita <GlossaryTerm term="M2">M2</GlossaryTerm> globale, trend dei <GlossaryTerm term="tassi reali">tassi reali</GlossaryTerm>, <GlossaryTerm term="condizioni di liquidità">liquidità</GlossaryTerm> ombra e canali di flusso istituzionale.
                    </p>
                  </div>

                  <KeyTakeaways insights={[
                    "Bitcoin si è evoluto in un asset macro sensibile alla liquidità il cui prezzo è ora dominato dagli impulsi M2 globali, dalle dinamiche dei tassi reali e dai flussi ETF istituzionali piuttosto che da semplicistici cicli di halving.",
                    "L'accelerazione dell'M2 globale produce risposte convesse al rialzo mentre la stagnazione innesca picchi di volatilità—l'impulso marginale di liquidità conta più dei livelli assoluti.",
                    "Rendimenti reali in calo riducono il costo opportunità di detenere asset non fruttiferi come Bitcoin, creando potenti venti favorevoli quando combinati con l'espansione monetaria.",
                    "La trasformazione strutturale di Bitcoin in asset class istituzionale significa che la sua formazione del prezzo è sempre più governata dall'elasticità di bilancio delle banche ombra e dei market maker ETF."
                  ]} />

                  {/* Investment Implications */}
                  <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-background to-primary/5 border-2 border-primary/20">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Implicazioni di Investimento
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-3">Per Investitori Retail High-Net-Worth</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          Considerare un'allocazione strategica del 3-5% del portafoglio liquido in Bitcoin con un orizzonte di 24 mesi. Il framework macro-liquidità suggerisce accumulo durante periodi di stagnazione M2 quando i picchi di volatilità creano opportunità di ingresso. Evitare di inseguire il momentum durante le fasi paraboliche.
                        </p>
                      </div>

                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-3">Per Family Office & Allocatori Istituzionali</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          Bitcoin ora funziona come asset macro sensibile alla liquidità adatto alla diversificazione di portafoglio. Il nostro scenario base supporta allocazioni nel range 2-4% come parte del bucket investimenti alternativi. Focus su veicoli ETF per chiarezza regolatoria e semplicità operativa. I trigger di ribilanciamento dovrebbero essere legati alle transizioni di regime piuttosto che a periodi fissi.
                        </p>
                      </div>

                      <div className="p-6 rounded-xl bg-card/50 border border-border/40">
                        <h4 className="text-lg font-semibold text-primary mb-3">Per Trader Quantitativi</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          Il modello di regime fornisce segnali azionabili per il posizionamento tattico. Le transizioni da regime di accumulo a espansione (identificate via HMM) offrono ingressi long ad alta convinzione. Le metriche di posizionamento sui derivati possono identificare punti di sovraestensione per trade mean-reversion. Monitorare la velocità dei flussi ETF come indicatore anticipatore per shift nella domanda istituzionale.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ChapterSection>

              {/* Chapter II - Simplified for brevity, same structure */}
              <ChapterSection id="chapter-2" dataSection="chapter-2">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo II</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Framework Avanzato dei Prezzi & Modellazione Quantitativa
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <p className="text-foreground/90 leading-relaxed m-0">
                      La valutazione di Bitcoin nell'orizzonte 2025–2026 richiede una partenza strutturale dai modelli guidati dalla narrativa. Il comportamento dell'asset è ora determinato da un sistema multidimensionale di condizioni di liquidità, vincoli di flusso impliciti nei derivati, assorbimento treasury e economia del mining.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-primary mb-2">$96k–$132k</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Banda di Equilibrio</div>
                      <p className="text-sm text-foreground/70">Scenario base con 60% probabilità</p>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-accent mb-2">$180k–$260k</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Alta Convessità</div>
                      <p className="text-sm text-foreground/70">Scenario bull con 25% probabilità</p>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-muted-foreground mb-2">$45k–$60k</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Regime Stress</div>
                      <p className="text-sm text-foreground/70">Scenario bear con 15% probabilità</p>
                    </div>
                  </div>

                  <p className="text-foreground/80 leading-relaxed">
                    Il Framework Avanzato dei Prezzi integra vettori macro-liquidità, teoria dei regime, indicatori di microstruttura e modelli di elasticità dell'offerta in un'architettura di investimento coerente. Questo approccio multidimensionale va oltre la semplice analisi ciclica per catturare le dinamiche complesse dei mercati Bitcoin istituzionali.
                  </p>

                  <PriceScenariosChart data={priceScenarioData} />

                  <KeyTakeaways insights={[
                    "La valutazione di Bitcoin richiede una partenza strutturale dai modelli narrativi—il prezzo è ora determinato da condizioni di liquidità multidimensionali, flussi derivati e dinamiche di bilancio istituzionali.",
                    "I modelli quantitativi di regime usando framework Hidden Markov superano l'analisi tecnica semplicistica identificando stati di mercato distinti guidati da shift macro-liquidità.",
                    "Il framework avanzato dei prezzi combina tassi di crescita M2, trend tassi reali, velocità flussi ETF e metriche on-chain per generare distribuzioni probabilistiche di scenario piuttosto che previsioni single-point."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo III */}
              <ChapterSection id="chapter-3" dataSection="chapter-3">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo III</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Modelli Quantitativi di Regime & Metodologia
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Il framework quantitativo impiega Modelli Hidden Markov per identificare regimi di mercato distinti, funzioni di domanda aggiustate per liquidità per modellare i flussi istituzionali, e posizionamento implicito sui derivati per catturare le dinamiche di microstruttura del mercato.
                  </p>

                  <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                    <h4 className="text-xl font-bold text-foreground mb-6">Target Istituzionale: $138.000</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                        <span className="text-sm font-medium text-foreground">Caso Base (60%)</span>
                        <span className="text-lg font-bold text-primary">$96k–$132k</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                        <span className="text-sm font-medium text-foreground">Caso Alto (25%)</span>
                        <span className="text-lg font-bold text-accent">$180k–$260k</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                        <span className="text-sm font-medium text-foreground">Caso Stress (15%)</span>
                        <span className="text-lg font-bold text-muted-foreground">$45k–$60k</span>
                      </div>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "I Modelli Hidden Markov identificano tre regimi di mercato distinti—accumulazione, espansione e distribuzione—ognuno con volatilità, profili di rendimento e probabilità di transizione caratteristici.",
                    "Il target istituzionale di $138.000 rappresenta il valore atteso ponderato per probabilità tra scenari Base ($96k-$132k, 60%), Alto ($180k-$260k, 25%) e Stress ($45k-$60k, 15%).",
                    "La metodologia quantitativa integra impulsi di liquidità macro, elasticità dell'offerta on-chain e posizionamento sui derivati in un framework di valutazione coerente che supera i modelli euristici ciclici."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo IV */}
              <ChapterSection id="chapter-4" dataSection="chapter-4">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Network className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo IV</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Dinamiche Flussi ETF & Microstruttura di Mercato
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <p className="text-foreground/90 leading-relaxed m-0">
                      L'introduzione degli ETF spot Bitcoin ha fondamentalmente alterato la microstruttura del mercato. I flussi istituzionali ora si muovono attraverso veicoli regolamentati, creando nuovi canali di arbitraggio e pattern di liquidità che differiscono marcatamente dall'era pre-ETF.
                    </p>
                  </div>

                  <p className="text-foreground/80 leading-relaxed">
                    I partecipanti autorizzati (AP) degli ETF arbitrano i differenziali NAV-prezzo spot, comprimendo gli spread ma creando anche dipendenze strutturali sui bilanci dei dealer. Durante periodi di volatilità elevata, i vincoli di capacità degli AP possono amplificare le oscillazioni di prezzo quando i meccanismi di creazione-rimborso incontrano attrito.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 my-12">
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Afflussi ETF</h4>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        Afflussi ETF sostenuti riducono il free float e creano canali di offerta quasi-inelastici. Gli acquirenti istituzionali attraverso ETF tipicamente detengono più a lungo dei buyer spot retail, riducendo l'elasticità dell'offerta circolante.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Profondità di Mercato</h4>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        I market maker ETF coprono l'esposizione delta attraverso spot e futures, concentrando la fornitura di liquidità in meno mani. Questo crea guadagni di efficienza nei mercati normali ma potenziale fragilità durante eventi di stress.
                      </p>
                    </div>
                  </div>

                  <ETFFlowChart data={etfFlowData} />

                  <KeyTakeaways insights={[
                    "Gli ETF spot Bitcoin hanno fondamentalmente alterato la microstruttura del mercato—i flussi istituzionali ora canalizzano attraverso veicoli regolamentati creando nuove dinamiche di arbitraggio.",
                    "Afflussi ETF sostenuti riducono l'elasticità dell'offerta circolante poiché gli acquirenti istituzionali dimostrano periodi di detenzione più lunghi rispetto ai buyer spot retail.",
                    "I partecipanti autorizzati ETF arbitrano i differenziali NAV-spot ma affrontano vincoli di capacità durante i picchi di volatilità—creando efficienza nei mercati normali ma potenziale fragilità durante eventi di stress."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo V */}
              <ChapterSection id="chapter-5" dataSection="chapter-5">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo V</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Analisi On-Chain & Comportamento delle Entità
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    I dati on-chain forniscono visibilità diretta sulla distribuzione dell'offerta, comportamento degli holder e pattern di transazione. Le metriche entity-adjusted distinguono tra holder genuini e aggregazione custodiale, rivelando la vera composizione della proprietà di Bitcoin.
                  </p>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <h4 className="text-lg font-bold text-foreground mb-3">Dinamiche Long-Term Holder</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed m-0">
                      I long-term holder (LTH)—definiti come indirizzi che detengono per 155+ giorni—rappresentano il segmento più guidato dalla convinzione. I picchi di offerta LTH tipicamente precedono i top di mercato, mentre l'accumulo LTH durante i drawdown segnala formazione di bottom.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Segnali On-Chain Chiave</h4>
                    <ul className="space-y-3 text-sm text-foreground/70">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Prezzo realizzato—costo base aggregato—agisce come supporto psicologico durante le correzioni</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Rapporto MVRV (market cap / realized cap) segnala sovraestensione sopra 3.5 e capitolazione sotto 1.0</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Net flow exchange rivela accumulazione istituzionale (deflussi) vs distribuzione retail (afflussi)</span>
                      </li>
                    </ul>
                  </div>

                  <KeyTakeaways insights={[
                    "L'analisi on-chain rivela pattern di comportamento delle entità—il prezzo realizzato agisce come costo base aggregato e supporto psicologico.",
                    "Net flow exchange distingue accumulazione istituzionale (deflussi persistenti verso cold storage) da distribuzione retail (afflussi che precedono vendite).",
                    "L'offerta long-term holder (12+ mesi) crea inelasticità dell'offerta—mentre l'offerta illiquida cresce attraverso ETF e accumulo treasury corporate, il float disponibile si riduce."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo VI */}
              <ChapterSection id="chapter-6" dataSection="chapter-6">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo VI</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Mercati Derivati & Posizionamento
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    I mercati dei derivati Bitcoin ora superano il volume spot, rendendo il posizionamento sui derivati un indicatore primario del sentiment di mercato. L'open interest dei futures, i funding rate dei perpetui e lo skew delle opzioni forniscono segnali in tempo reale sulla convinzione istituzionale.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-primary mb-2">$45B+</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Open Interest Futures</div>
                      <p className="text-sm text-foreground/70">Esposizione totale su exchange</p>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-accent mb-2">0.01-0.03%</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Funding Rate Medio</div>
                      <p className="text-sm text-foreground/70">Posizionamento perpetui attuale</p>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="text-2xl font-bold text-primary mb-2">+5% a +15%</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Skew Call Opzioni</div>
                      <p className="text-sm text-foreground/70">Bias rialzista nel mercato opzioni</p>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Il volume derivati supera lo spot 3x, rendendo il posizionamento sui derivati un indicatore primario per il sentiment istituzionale.",
                    "Funding rate elevati (>0.05%) segnalano sovraestensione del leverage long; funding negativi indicano opportunità contrarian.",
                    "Skew call pronunciato (>20%) anticipa aspettative rialziste ma può segnalare posizionamento affollato vulnerabile a correzioni."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo VII */}
              <ChapterSection id="chapter-7" dataSection="chapter-7">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo VII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Economia del Mining & Analisi Hashrate
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    L'economia del mining post-halving 2024 crea dinamiche strutturali cruciali. Con ricompensa dimezzata a 3.125 BTC, l'efficienza operativa e i costi energetici determinano la sopravvivenza dei miner e influenzano i pattern di vendita dell'offerta.
                  </p>

                  <MiningEconomicsChart data={miningCostData} />

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <h4 className="text-lg font-bold text-foreground mb-3">Soglia Breakeven Mining</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed m-0">
                      Costo medio di produzione stimato: $42,000-$55,000 per BTC nel 2025. Miner con costi superiori devono vendere immediatamente le ricompense, mentre miner efficienti possono accumulare, influenzando la pressione di vendita sull'offerta.
                    </p>
                  </div>

                  <KeyTakeaways insights={[
                    "Il costo breakeven mining post-halving è salito a $42k-$55k, creando un floor naturale per i prezzi—sotto questa soglia, la resa dei miner marginali riduce la pressione di vendita.",
                    "L'hashrate record indica fiducia dei miner nel lungo termine nonostante margini compressi post-halving.",
                    "La concentrazione geografica (US >35% hashrate) crea rischi regolatori ma anche benefici di stabilità energetica."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo VIII */}
              <ChapterSection id="chapter-8" dataSection="chapter-8">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo VIII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Dinamiche dell'Offerta & Holder Long-Term
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    L'offerta di Bitcoin presenta caratteristiche uniche tra gli asset finanziari: emissione programmata, cap massimo fisso, e crescente illiquidità dell'offerta attraverso comportamento HODLing e accumulo istituzionale.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Offerta Illiquida</h4>
                      <div className="text-3xl font-bold text-primary mb-2">~75%</div>
                      <p className="text-sm text-foreground/70">dell'offerta circolante non si è mossa in 6+ mesi</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Offerta Exchange</h4>
                      <div className="text-3xl font-bold text-accent mb-2">~12%</div>
                      <p className="text-sm text-foreground/70">ai minimi storici, segnalando accumulo</p>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "L'offerta illiquida a livelli record (~75%) crea elasticità dell'offerta ridotta—shock di domanda producono risposte di prezzo amplificate.",
                    "Deflussi continui dagli exchange indicano preferenza per self-custody e accumulo a lungo termine.",
                    "La competizione ETF-miner per l'offerta marginale intensifica le dinamiche di scarsità strutturale."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo IX */}
              <ChapterSection id="chapter-9" dataSection="chapter-9">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo IX</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Analisi Scenari & Framework di Rischio
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <h4 className="text-lg font-bold text-foreground mb-2">Scenario Base</h4>
                      <div className="text-2xl font-bold text-primary mb-2">$96k–$132k</div>
                      <p className="text-sm text-foreground/70">Probabilità 60%</p>
                      <p className="text-xs text-muted-foreground mt-2">Espansione M2 moderata, tassi stabili</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <h4 className="text-lg font-bold text-foreground mb-2">Scenario Bull</h4>
                      <div className="text-2xl font-bold text-accent mb-2">$180k–$260k</div>
                      <p className="text-sm text-foreground/70">Probabilità 25%</p>
                      <p className="text-xs text-muted-foreground mt-2">M2 accelera + tassi reali negativi</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                      <h4 className="text-lg font-bold text-foreground mb-2">Scenario Stress</h4>
                      <div className="text-2xl font-bold text-destructive mb-2">$45k–$60k</div>
                      <p className="text-sm text-foreground/70">Probabilità 15%</p>
                      <p className="text-xs text-muted-foreground mt-2">Stretta monetaria aggressiva</p>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Distribuzione probabilistica degli scenari riflette incertezza macro—nessun singolo target di prezzo è appropriato per decisioni di investimento.",
                    "Il framework di rischio richiede stress testing delle posizioni contro scenario peggiore ($45k) prima dell'allocazione.",
                    "Trigger di regime identificabili (M2, tassi reali, flussi ETF) permettono aggiustamenti tattici del posizionamento."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo X */}
              <ChapterSection id="chapter-10" dataSection="chapter-10">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo X</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Target di Prezzo 2026 & Implicazioni di Investimento
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2 border-primary/10">
                    <h4 className="text-2xl font-bold text-foreground mb-4">Target Ponderato: $138.000</h4>
                    <p className="text-foreground/80">
                      Valore atteso calcolato come: (0.60 × $114k) + (0.25 × $220k) + (0.15 × $52.5k) = $138.350
                    </p>
                  </div>

                  <KeyTakeaways insights={[
                    "Il target $138k rappresenta il valore atteso ponderato, non una previsione puntuale—la distribuzione degli outcome importa più del target mediano.",
                    "Allocazione consigliata: 2-5% del portafoglio per investitori istituzionali con orizzonte 24+ mesi.",
                    "Timing di ingresso ottimale: durante fasi di regime Accumulazione identificate dal modello HMM, non durante momentum parabolico."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XI */}
              <ChapterSection id="chapter-11" dataSection="chapter-11">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XI</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Framework di Risk Management
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    La volatilità di Bitcoin richiede un framework di risk management robusto. Le tecniche tradizionali (VaR, Sharpe) devono essere adattate per catturare la distribuzione fat-tail dei rendimenti crypto.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Position Sizing</h4>
                      <p className="text-sm text-foreground/70">Kelly Criterion adattato suggerisce allocazione max 2-5% per portafogli diversificati con orizzonte lungo.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Stop-Loss Dinamici</h4>
                      <p className="text-sm text-foreground/70">Stop basati su ATR (Average True Range) preferibili a percentuali fisse per adattarsi alla volatilità corrente.</p>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Position sizing conservativo (2-5% max) protegge da drawdown estremi preservando esposizione al potenziale rialzo.",
                    "Stop-loss basati su volatilità (ATR) superano stop percentuali fissi in mercati con volatilità variabile.",
                    "Ribilanciamento basato su regime (non calendario) cattura meglio le transizioni di mercato."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XII */}
              <ChapterSection id="chapter-12" dataSection="chapter-12">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Correlazioni Cross-Asset
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Le correlazioni di Bitcoin con asset tradizionali variano significativamente per regime di mercato. Comprendere queste dinamiche è cruciale per la costruzione di portafoglio.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <h4 className="text-lg font-bold text-foreground mb-3">Ambiente Risk-On</h4>
                      <ul className="space-y-2 text-sm text-foreground/70">
                        <li>BTC-Nasdaq: <span className="text-accent font-semibold">+0.75</span></li>
                        <li>BTC-Oro: <span className="text-muted-foreground font-semibold">+0.15</span></li>
                        <li>BTC-Bond: <span className="text-destructive font-semibold">-0.40</span></li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <h4 className="text-lg font-bold text-foreground mb-3">Ambiente Risk-Off</h4>
                      <ul className="space-y-2 text-sm text-foreground/70">
                        <li>BTC-Nasdaq: <span className="text-accent font-semibold">+0.85</span></li>
                        <li>BTC-Oro: <span className="text-accent font-semibold">+0.55</span></li>
                        <li>BTC-Bond: <span className="text-muted-foreground font-semibold">-0.15</span></li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <h4 className="text-lg font-bold text-foreground mb-3">Crisi Liquidità</h4>
                      <ul className="space-y-2 text-sm text-foreground/70">
                        <li>Tutti asset: <span className="text-accent font-semibold">→ +0.90</span></li>
                        <li>Correlazioni: <span className="text-destructive font-semibold">Convergono a 1</span></li>
                        <li>Diversificazione: <span className="text-destructive font-semibold">Fallisce</span></li>
                      </ul>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "La correlazione Bitcoin-Nasdaq (0.65) conferma il suo ruolo come asset risk ad alto beta, non oro digitale.",
                    "Correlazioni dipendenti dal regime richiedono hedging dinamico—allocazioni statiche ignorano dinamiche di rischio mutevoli.",
                    "I benefici di diversificazione da Bitcoin sono massimizzati in regime Accumulazione, non Espansione."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XIII */}
              <ChapterSection id="chapter-13" dataSection="chapter-13">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XIII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Panorama Regolamentare 2026
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    L'ambiente regolamentare per Bitcoin sta attraversando la sua trasformazione più significativa dall'inizio. Il 2025-2026 vedrà framework importanti finalizzati nelle giurisdizioni chiave, creando sia opportunità che rischi per gli allocatori istituzionali.
                  </p>

                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🇪🇺</span>
                        <h4 className="text-xl font-bold text-foreground">Unione Europea: Implementazione MiCA</h4>
                      </div>
                      <p className="text-sm text-foreground/70">MiCA crea chiarezza regolatoria—aspettarsi accelerazione dei flussi di capitale istituzionale nel 2025-2026.</p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🇺🇸</span>
                        <h4 className="text-xl font-bold text-foreground">Stati Uniti: Dinamiche SEC & CFTC</h4>
                      </div>
                      <p className="text-sm text-foreground/70">L'incertezza regolatoria US persiste ma l'approvazione ETF segnala accettazione de facto di Bitcoin come asset legittimo.</p>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🌏</span>
                        <h4 className="text-xl font-bold text-foreground">Asia-Pacifico: Approcci Divergenti</h4>
                      </div>
                      <p className="text-sm text-foreground/70">La posizione pro-crypto di Hong Kong la posiziona come hub degli asset digitali in Asia.</p>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "MiCA crea chiarezza regolatoria in EU—aspettarsi accelerazione dei flussi di capitale istituzionale nel 2025-2026.",
                    "L'incertezza regolatoria US persiste ma l'approvazione ETF segnala accettazione de facto di Bitcoin come asset legittimo.",
                    "Rischio chiave: regolamentazioni ambientali che colpiscono il mining proof-of-work potrebbero creare disruption lato offerta."
                  ]} />
                </div>
              </ChapterSection>

              {/* Chapter XIV - Institutional Adoption with Live Treasuries */}
              <ChapterSection id="chapter-14" dataSection="chapter-14">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Capitolo XIV</div>
                    <h2 className="text-3xl font-bold text-foreground">Metriche di Adozione Istituzionale</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    L'adozione istituzionale è passata dalla speculazione a trend di allocazione misurabili. Il monitoraggio di queste metriche fornisce indicatori anticipatori per il supporto sostenuto dei prezzi.
                  </p>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                      Categorie di Holder Istituzionali
                    </h3>

                    <BitcoinTreasuriesLive />
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Indicatori di Velocità di Adozione</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">1.100+</div>
                        <p className="text-sm text-foreground/70">Filer 13F con esposizione ETF BTC</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent mb-1">$120B+</div>
                        <p className="text-sm text-foreground/70">AUM Totale ETF (US + Globale)</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">7,6%</div>
                        <p className="text-sm text-foreground/70">Offerta detenuta da istituzioni</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-accent mb-1">+2,5%</div>
                        <p className="text-sm text-foreground/70">Crescita istituzionale YoY</p>
                      </div>
                    </div>
                  </div>
                </div>

                <KeyTakeaways insights={[
                  "Gli ETF hanno assorbito 1,1M BTC (5,2% dell'offerta) in 12 mesi—l'adozione istituzionale più rapida di qualsiasi asset class nella storia.",
                  "L'adozione treasury corporate rimane concentrata (Strategy ~90% del totale) ma fornisce supporto floor al prezzo.",
                  "Fondi sovrani e fondi pensione rappresentano la prossima ondata—il 2026 potrebbe vedere i primi annunci di allocazione SWF importanti.",
                  "Il tasso di assorbimento istituzionale dell'offerta supera la nuova emissione di 3x, creando squilibrio strutturale domanda-offerta."
                ]} />
              </ChapterSection>

              {/* Capitolo XV */}
              <ChapterSection id="chapter-15" dataSection="chapter-15">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XV</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Calendario Macro & Date Chiave 2026
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Il 2026 presenta diversi catalizzatori macro potenziali che potrebbero influenzare significativamente il prezzo di Bitcoin. Monitorare queste date consente posizionamento anticipato.
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">Q1 2026</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Attuale</span>
                      </div>
                      <ul className="text-sm text-foreground/70 space-y-1">
                        <li>• Meeting FOMC (Gennaio, Marzo)</li>
                        <li>• Dati inflazione CPI mensili</li>
                        <li>• Report trimestrale flussi ETF</li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/40">
                      <h4 className="font-bold text-foreground mb-2">Q2-Q4 2026</h4>
                      <ul className="text-sm text-foreground/70 space-y-1">
                        <li>• Potenziali tagli tassi Fed (se inflazione scende)</li>
                        <li>• Elezioni mid-term US (Novembre)</li>
                        <li>• Review regolamentare MiCA in EU</li>
                      </ul>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "I meeting FOMC rimangono i principali catalizzatori macro—ogni decisione sui tassi influenza le condizioni di liquidità globale.",
                    "Le elezioni mid-term US potrebbero portare cambiamenti regolamentari significativi per il settore crypto.",
                    "Monitorare il calendario per posizionamento anticipato, non reattivo."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XVI */}
              <ChapterSection id="chapter-16" dataSection="chapter-16">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XVI</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Analisi Rischi Geopolitici
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Il contesto geopolitico globale influenza Bitcoin attraverso molteplici canali: flussi di capitali, sanzioni, politiche energetiche e adozione come riserva alternativa.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                      <h4 className="text-lg font-bold text-foreground mb-3">Rischi</h4>
                      <ul className="text-sm text-foreground/70 space-y-2">
                        <li>• Escalation conflitti → volatilità risk-off</li>
                        <li>• Sanzioni energetiche → disruption mining</li>
                        <li>• Ban crypto in economie maggiori</li>
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <h4 className="text-lg font-bold text-foreground mb-3">Opportunità</h4>
                      <ul className="text-sm text-foreground/70 space-y-2">
                        <li>• De-dollarizzazione → domanda BTC come riserva</li>
                        <li>• Inflazione emergenti → adozione retail</li>
                        <li>• Competizione CBDC → narrativa libertà</li>
                      </ul>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Il contesto geopolitico crea sia rischi che opportunità—Bitcoin beneficia dalla narrativa 'oro digitale' durante instabilità.",
                    "La de-dollarizzazione progressiva potrebbe accelerare l'adozione istituzionale di Bitcoin come riserva neutrale.",
                    "Monitorare sviluppi CBDC come potenziale catalizzatore per la narrativa di libertà finanziaria."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XVII */}
              <ChapterSection id="chapter-17" dataSection="chapter-17">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XVII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Confronto Cicli Storici
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Mentre i cicli storici forniscono contesto, il comportamento attuale di Bitcoin differisce significativamente dai cicli precedenti a causa dell'istituzionalizzazione e della maturazione del mercato.
                  </p>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <h4 className="text-lg font-bold text-foreground mb-4">Evoluzione dei Cicli</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-primary mb-1">Ciclo 2013-2017</div>
                        <p className="text-foreground/70">Retail-driven, volatilità estrema, picchi parabolici</p>
                      </div>
                      <div>
                        <div className="font-semibold text-primary mb-1">Ciclo 2017-2021</div>
                        <p className="text-foreground/70">Early institutional, COVID stimulus, doppio picco</p>
                      </div>
                      <div>
                        <div className="font-semibold text-primary mb-1">Ciclo 2021-2025+</div>
                        <p className="text-foreground/70">ETF-driven, macro-correlated, volatilità ridotta</p>
                      </div>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Ogni ciclo mostra volatilità decrescente e correlazione macro crescente—l'istituzionalizzazione stabilizza ma non elimina la ciclicità.",
                    "Il ciclo attuale differisce per struttura (ETF), partecipanti (istituzionali) e correlazioni (macro).",
                    "Cautela nell'usare metriche storiche—il contesto strutturale è fondamentalmente cambiato."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XVIII */}
              <ChapterSection id="chapter-18" dataSection="chapter-18">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XVIII</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Framework Strategia di Uscita
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Una strategia di uscita definita è cruciale quanto la strategia di ingresso. Vendere in un mercato euforico richiede disciplina pre-definita.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Segnali di Uscita</h4>
                      <ul className="text-sm text-foreground/70 space-y-2">
                        <li>• MVRV {'>'} 3.5 (storico top indicator)</li>
                        <li>• Funding rate perpetui {'>'} 0.1%</li>
                        <li>• Deflussi ETF sostenuti</li>
                        <li>• Distribuzione LTH accelerata</li>
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/40">
                      <h4 className="text-lg font-bold text-foreground mb-3">Approccio Consigliato</h4>
                      <ul className="text-sm text-foreground/70 space-y-2">
                        <li>• Prendere profitto gradualmente (25% a target 1, 2, 3)</li>
                        <li>• Mantenere core position (20-30%)</li>
                        <li>• Usare trailing stop dopo breakout</li>
                      </ul>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Definire target di uscita PRIMA dell'euforia—la disciplina durante i bull market è la sfida principale.",
                    "Uscita graduale (scaling out) supera il market timing—nessuno vende esattamente al top.",
                    "Mantenere core position per esposizione long-term mentre si realizzano profitti tattici."
                  ]} />
                </div>
              </ChapterSection>

              {/* Capitolo XIX */}
              <ChapterSection id="chapter-19" dataSection="chapter-19">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Capitolo XIX</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Lightning Network & Layer 2
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>

                <div className="prose prose-lg max-w-none space-y-8">
                  <p className="text-foreground/80 leading-relaxed">
                    Lightning Network rappresenta lo scaling layer di Bitcoin per transazioni quotidiane. Mentre la capacità rimane piccola rispetto al mercato spot, la crescita dell'adozione valida l'utilità di Bitcoin oltre la speculazione.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">~$500M</div>
                      <p className="text-sm text-foreground/70">Capacità Totale</p>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center">
                      <div className="text-3xl font-bold text-accent mb-1">~16.000</div>
                      <p className="text-sm text-foreground/70">Nodi Attivi</p>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">+120%</div>
                      <p className="text-sm text-foreground/70">Crescita Capacità YoY</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-muted/30 to-background border border-border/40">
                    <h4 className="text-lg font-bold text-foreground mb-4">Implicazioni di Investimento</h4>
                    <div className="space-y-3 text-foreground/80">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                        <p><strong>Long-term bullish:</strong> Affronta preoccupazioni di scalabilità; valida l'utilità di Bitcoin oltre la speculazione</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p><strong>Non catalizzatore near-term:</strong> Capacità (~$500M) troppo piccola per impattare direttamente il prezzo; solo valore narrativo</p>
                      </div>
                    </div>
                  </div>

                  <KeyTakeaways insights={[
                    "Capacità Lightning up 120% YoY—effetti di rete accelerano ma valore totale (~$500M) rimane immateriale per il prezzo.",
                    "Proposta US Strategic Reserve e adozione treasury corporate segnalano accettazione mainstream istituzionale.",
                    "Valore narrativo long-term significativo; impatto prezzo near-term minimo. Monitorare come metrica di adozione, non segnale di trading."
                  ]} />
                </div>
              </ChapterSection>

              {/* Disclaimer and Footer */}
              <div className="mt-24 p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full bg-primary rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">Disclaimer</h3>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        Questo report è fornito solo a scopo informativo e non costituisce consulenza di investimento. Bitcoin e gli asset digitali sono altamente volatili. Gli investitori dovrebbero condurre la propria due diligence e consultare consulenti finanziari qualificati.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground">© 2025 ARIES76 Capital Intelligence</p>
                    </div>
                    <div className="text-sm">
                      <a href="mailto:edoardo.grigione@aries76.com" className="text-primary hover:text-accent transition-colors font-medium">
                        edoardo.grigione@aries76.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Table of Contents */}
            <div className="hidden xl:block w-72 flex-shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)]">
                <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider sticky top-0 bg-card/90 backdrop-blur-sm py-2 -mt-2">Contenuti</h3>
                  <nav className="space-y-2">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          const element = document.getElementById(chapter.id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className={`group w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                          activeSection === chapter.id
                            ? 'bg-primary/10 border-l-2 border-primary'
                            : 'hover:bg-muted/50 border-l-2 border-transparent'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          activeSection === chapter.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        }`}>
                          {chapter.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug transition-colors ${
                            activeSection === chapter.id
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}>
                            {chapter.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-4 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Torna su"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </TooltipProvider>
  );
};

export default Bitcoin2026ReportIT;
