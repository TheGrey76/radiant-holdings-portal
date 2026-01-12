// Bitcoin 2026 - Pagina Preview con HARD GATING - Versione Italiana
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Loader2,
  Lock,
  TrendingUp,
  BarChart3,
  Layers,
  Database,
  Activity,
  Coins,
  Network,
  Target,
  LineChart,
  Shield,
  Globe,
  Scale,
  Calendar,
  Zap,
  AlertTriangle,
  GitBranch,
  LogOut,
  ArrowUp
} from 'lucide-react';
import { FearGreedIndex } from '@/components/FearGreedIndex';
import { useBitcoinReportData } from '@/hooks/useBitcoinReportData';
import { useTwelveDataBtc } from '@/hooks/useTwelveDataBtc';
import { Link } from 'react-router-dom';

const Bitcoin2026ReportPreviewIT = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: bitcoinData, loading: bitcoinLoading } = useBitcoinReportData();
  const { data: twelveData, isLoading: twelveLoading } = useTwelveDataBtc();

  const handleAccessRequest = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Inserisci un indirizzo email professionale valido');
      return;
    }

    setIsLoading(true);
    try {
      // Get source from URL params if available
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('src') || 'direct';
      
      const { data, error } = await supabase.functions.invoke('create-bitcoin-report-checkout', {
        body: { 
          email,
          source,
          successUrl: `${window.location.origin}/bitcoin-2026-report-it?success=true`,
          cancelUrl: `${window.location.origin}/bitcoin-2026-report-preview-it?canceled=true`
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Si è verificato un errore. Riprova.');
      setIsLoading(false);
    }
  };

  // Chapter definitions with icons (Italian)
  const chapters = [
    { id: "chapter-1", number: "I", title: "Executive Summary e Analisi Macro", icon: TrendingUp },
    { id: "chapter-2", number: "II", title: "Framework Avanzato dei Prezzi", icon: BarChart3 },
    { id: "chapter-3", number: "III", title: "Modelli Quantitativi di Regime", icon: Layers },
    { id: "chapter-4", number: "IV", title: "Dinamiche ETF e Microstruttura di Mercato", icon: Network },
    { id: "chapter-5", number: "V", title: "Analytics On-Chain e Comportamento Entità", icon: Database },
    { id: "chapter-6", number: "VI", title: "Mercati Derivati e Posizionamento", icon: Activity },
    { id: "chapter-7", number: "VII", title: "Economia del Mining e Analisi Hashrate", icon: Coins },
    { id: "chapter-8", number: "VIII", title: "Dinamiche dell'Offerta e Holder a Lungo Termine", icon: LineChart },
    { id: "chapter-9", number: "IX", title: "Analisi Scenari e Framework di Rischio", icon: Target },
    { id: "chapter-10", number: "X", title: "Target di Prezzo 2026 e Implicazioni di Investimento", icon: TrendingUp },
    { id: "chapter-11", number: "XI", title: "Framework di Gestione del Rischio", icon: Shield },
    { id: "chapter-12", number: "XII", title: "Correlazioni Cross-Asset", icon: GitBranch },
    { id: "chapter-13", number: "XIII", title: "Panorama Regolamentare 2026", icon: Scale },
    { id: "chapter-14", number: "XIV", title: "Metriche di Adozione Istituzionale", icon: Globe },
    { id: "chapter-15", number: "XV", title: "Calendario Macro e Date Chiave 2026", icon: Calendar },
    { id: "chapter-16", number: "XVI", title: "Analisi del Rischio Geopolitico", icon: AlertTriangle },
    { id: "chapter-17", number: "XVII", title: "Confronto Storico dei Cicli", icon: Activity },
    { id: "chapter-18", number: "XVIII", title: "Framework Strategia di Uscita", icon: LogOut },
    { id: "chapter-19", number: "XIX", title: "Lightning Network e Layer 2", icon: Zap },
  ];

  // Email Gate Component
  const EmailGate = () => (
    <motion.div 
      className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-b from-zinc-900/95 to-zinc-950"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-2xl opacity-50" />
      
      <div className="relative p-8 md:p-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Accesso Completo Richiesto</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Richiedi accesso completo alla pagina di intelligence Bitcoin 2026
          </h3>
          
          <p className="text-sm text-zinc-400 mb-4">
            Aggiornamenti continui · Dati in tempo reale · Framework decisionale completo
          </p>
          
          {/* Price */}
          <div className="mb-8 py-4 border-y border-zinc-700/60">
            <div className="text-4xl font-semibold text-white tracking-tight">€99</div>
            <p className="text-sm text-zinc-400 mt-1">Pagamento unico · Aggiornamenti continui inclusi</p>
          </div>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <Input
              type="email"
              placeholder="Indirizzo email professionale"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-accent focus:ring-accent/30 h-12 text-center"
            />
            <Button 
              onClick={handleAccessRequest}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium h-12 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                <>
                  Richiedi accesso completo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-zinc-500 mt-6">
            Nessuna newsletter · Nessuno spam · Solo comunicazioni relative all'accesso
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Locked Content Placeholder
  const LockedSection = ({ title, description }: { title: string; description: string }) => (
    <motion.div 
      className="relative rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Subtle blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-zinc-950/40 z-10" />
      
      <div className="relative z-20 p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-700/50 mb-4">
          <Lock className="w-5 h-5 text-zinc-400" />
        </div>
        
        <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
        
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-2">
          {description}
        </p>
        
        <p className="text-zinc-300 text-sm max-w-md mx-auto mb-6">
          L'accesso completo è necessario per visualizzare questo contenuto.
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth' })}
          className="border-accent/30 text-accent hover:bg-accent/10"
        >
          Richiedi accesso completo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Bitcoin Q1 2026 Edizione | Ricerca Istituzionale | ARIES76</title>
        <meta name="description" content="Una pagina di intelligence Bitcoin aggiornata continuamente per decisori a lungo termine. Dati di prezzo in tempo reale, statistiche chiave e contesto strategico in evoluzione." />
        
        <meta property="og:title" content="Bitcoin Q1 2026 | Ricerca Istituzionale Live" />
        <meta property="og:description" content="Intelligence Bitcoin aggiornata continuamente con dati in tempo reale e analisi del framework macro-liquidità." />
        <meta property="og:image" content="https://aries76.com/bitcoin-2026-og.png" />
        <meta property="og:url" content="https://aries76.com/bitcoin-2026-report-preview-it" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitcoin Q1 2026 | ARIES76" />
        <meta name="twitter:description" content="Intelligence Bitcoin live per decisori istituzionali." />
        <meta name="twitter:image" content="https://aries76.com/bitcoin-2026-og.png" />
      </Helmet>

      <div className="min-h-screen bg-zinc-950">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden border-b border-zinc-800/40">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          
          {/* Bitcoin symbol */}
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
                <div className="absolute inset-4 rounded-full border border-orange-500/20" />
                <div className="absolute inset-8 rounded-full border border-dashed border-orange-500/15" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-orange-500/80">₿</span>
              </div>
            </div>
          </motion.div>
          
          <div className="container max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Language Switcher */}
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Link 
                  to="/bitcoin-2026-report-preview"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  EN
                </Link>
                <span className="text-zinc-600">|</span>
                <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent/20 text-accent border border-accent/30">
                  IT
                </span>
              </motion.div>

              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                </div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Ricerca Istituzionale</span>
              </motion.div>
              
              {/* Title */}
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Bitcoin</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Q1 2026</span>
                <br />
                <span className="text-2xl md:text-3xl text-zinc-300 font-medium tracking-wide">Edizione</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="text-lg md:text-xl text-zinc-100 mb-4 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Una pagina di intelligence Bitcoin aggiornata continuamente per decisori a lungo termine.
              </motion.p>
              
              <motion.p 
                className="text-sm text-zinc-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                Questo non è un PDF e non è un report statico.
              </motion.p>

              {/* Live Bitcoin Price */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-400">₿</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400 uppercase tracking-wider">Prezzo Live</span>
                      <AnimatePresence mode="wait">
                        {(twelveLoading && bitcoinLoading) ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-8 w-32 bg-zinc-700/50 rounded animate-pulse"
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
                  <div className="w-px h-10 bg-orange-500/20" />
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">EUR</span>
                    <span className="text-lg font-semibold text-zinc-100 tabular-nums">
                      €{(twelveData?.bitcoin_price_eur || bitcoinData?.bitcoin_price_eur)?.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
                    </span>
                  </div>
                  {/* 24h Change */}
                  {(twelveData?.change_24h !== undefined && twelveData?.change_24h !== null) && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      twelveData.change_24h >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <ArrowUp className={`w-3.5 h-3.5 ${twelveData.change_24h >= 0 ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                      <span className={`text-sm font-semibold tabular-nums ${twelveData.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Math.abs(twelveData.change_24h).toFixed(2)}%
                      </span>
                    </div>
                  )}
                  <div className="hidden sm:flex items-center gap-2 ml-2">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    </div>
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>
              </motion.div>

              {/* Live data indicator */}
              <motion.div 
                className="flex items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                  <div>
                    <span className="text-sm font-semibold text-white">ARIES76</span>
                    <span className="text-sm text-zinc-400 ml-2">Capital Intelligence</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>Edizione Q1 2026</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
        </section>

        {/* Live Data Banner */}
        <div className="bg-gradient-to-r from-green-500/10 via-accent/10 to-green-500/10 border-y border-green-500/30">
          <div className="container max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                </div>
                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Report con Dati Live</span>
              </div>
              <span className="hidden sm:block text-zinc-500">•</span>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm text-zinc-100">
                  Dati aggiornati quotidianamente alle 6:00 CET
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="container max-w-6xl mx-auto px-6 py-16">
          
          {/* ===== FEAR & GREED INDEX (VISIBLE IN PREVIEW) ===== */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-md [&_.bg-card\/50]:bg-zinc-800/80 [&_.text-muted-foreground]:text-zinc-300 [&_.border-border]:border-zinc-600 [&_.bg-muted]:bg-zinc-700 [&_.text-foreground]:text-white [&_.bg-primary]:bg-accent [&_.text-primary]:text-accent">
              <FearGreedIndex />
            </div>
          </motion.section>

          {/* ===== EXECUTIVE SUMMARY (HARD GATED) ===== */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-xl p-8 md:p-10 border border-accent/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-accent">Executive Summary</span>
              </h2>
              
              <div className="space-y-6">
                {/* Bullet 1 - FULLY VISIBLE */}
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">1</span>
                  <p className="text-zinc-100 leading-relaxed">
                    La traiettoria di Bitcoin nel 2026 NON è guidata dai cicli di halving—è governata dagli impulsi di liquidità globale M2 e dalle dinamiche dei tassi reali. Il nostro framework proprietario macro-liquidità rivela che l'accelerazione marginale di M2 produce risposte convesse al rialzo mentre la stagnazione innesca picchi di volatilità.
                  </p>
                </div>
                
                {/* Bullet 2 - TRUNCATED after one sentence */}
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">2</span>
                  <p className="text-zinc-100 leading-relaxed">
                    Con i tassi reali che comprimono verso la neutralità (range 0-1% entro metà 2026) e la normalizzazione del bilancio Fed in decelerazione, Bitcoin affronta un contesto macro paragonabile al Q4 2020.
                    <span className="text-zinc-500">...</span>
                  </p>
                </div>
                
                {/* Bullet 3 - COMPLETELY HIDDEN */}
              </div>
              
              {/* MANDATORY TEXT */}
              <div className="mt-8 pt-6 border-t border-zinc-700/60">
                <p className="text-sm text-zinc-300">
                  Il framework macro-liquidità completo, le probabilità degli scenari e l'architettura di valutazione sono disponibili solo con l'accesso completo.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ===== INVESTMENT IMPLICATIONS (FULL LOCK) ===== */}
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <LockedSection 
              title="Implicazioni di Investimento" 
              description="Questa sezione contiene framework di allocazione e logica decisionale basata sui regimi."
            />
          </motion.section>

          {/* ===== CTA IMMEDIATELY AFTER FIRST LOCKED SECTION (NON-OPTIONAL) ===== */}
          <section id="email-gate" className="mb-16 scroll-mt-24">
            <EmailGate />
          </section>

          {/* ===== TABLE OF CONTENTS (PROMISE ONLY) ===== */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-zinc-900/70 rounded-xl border border-zinc-700/60 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Indice dei Contenuti</h3>
              
              <div className="grid gap-3">
                {chapters.map((chapter) => {
                  const IconComponent = chapter.icon;
                  return (
                    <div 
                      key={chapter.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/40 opacity-60 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-mono text-zinc-500 w-8">{chapter.number}</span>
                        <IconComponent className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">{chapter.title}</span>
                      </div>
                      <Lock className="w-4 h-4 text-zinc-500" />
                    </div>
                  );
                })}
              </div>
              
              {/* MANDATORY TEXT */}
              <div className="mt-6 pt-6 border-t border-zinc-700/60">
                <p className="text-sm text-zinc-300">
                  Questa pagina include 19 capitoli istituzionali disponibili solo con l'accesso completo.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ===== ADVANCED FRAMEWORKS - LOCKED PLACEHOLDER BLOCKS ===== */}
          <div className="space-y-8 mb-16">
            <LockedSection 
              title="Framework Avanzato dei Prezzi" 
              description="Questa sezione contiene modelli di pricing quantitativi e architettura tecnica."
            />
            <LockedSection 
              title="Modelli Quantitativi di Regime" 
              description="Questa sezione contiene classificazione proprietaria dei regimi e matrici di transizione."
            />
            <LockedSection 
              title="Analisi Scenari" 
              description="Questa sezione contiene risultati degli scenari ponderati per probabilità e analisi di sensibilità."
            />
            <LockedSection 
              title="Framework di Rischio" 
              description="Questa sezione contiene metriche di rischio, analisi dei drawdown e logica di dimensionamento delle posizioni."
            />
            <LockedSection 
              title="Target di Prezzo 2026" 
              description="Questa sezione contiene proiezioni di prezzo base, bull e bear con assunzioni sottostanti."
            />
            <LockedSection 
              title="Logica di Allocazione" 
              description="Questa sezione contiene framework di costruzione del portafoglio e trigger di ribilanciamento."
            />
          </div>

          {/* ===== FINAL POSITIONING LINE (MANDATORY) ===== */}
          <motion.section 
            className="text-center py-16 border-t border-zinc-700/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-zinc-300 max-w-xl mx-auto">
              Questa pagina è volutamente incompleta.
            </p>
            <p className="text-lg text-zinc-100 font-medium mt-2 max-w-xl mx-auto">
              L'accesso completo è necessario per prendere decisioni informate.
            </p>
          </motion.section>

        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-700/40 py-8">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-zinc-400">
                © 2026 ARIES76 Capital Intelligence
              </div>
              <div className="text-xs text-zinc-500">
                Non costituisce consulenza finanziaria. Solo per investitori istituzionali e professionali.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Bitcoin2026ReportPreviewIT;
