import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase,
  PieChart,
  Shield,
  Clock,
  Percent,
  Award,
  FileText,
  ChevronRight
} from 'lucide-react';

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;
    
    setHasStarted(true);
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView, hasStarted]);

  return { count, ref };
};

const ABCCompanyInvestor = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Counter animations
  const capitalCounter = useCountUp(32, 2000);
  const portfolioCounter = useCountUp(207, 2500);
  const clubDealCounter = useCountUp(24, 2000);
  const outperformCounter = useCountUp(35, 1800);

  const trackRecord = [
    { name: 'Del Casale / Gecchele', sector: 'Food', cashOnCash: '2.7x', irr: '58%', period: '2 anni' },
    { name: 'NextGeo', sector: 'Energy Services', cashOnCash: '-', irr: '59%', period: 'IPO 2024' },
    { name: 'Lipogems', sector: 'MedTech', cashOnCash: 'In corso', irr: 'FDA 2026', period: 'Exit attesa' },
  ];

  const advantages = [
    { icon: <Target className="h-6 w-6" />, title: 'Deal-by-Deal', description: 'Selezione autonoma degli investimenti senza hard commitment' },
    { icon: <Shield className="h-6 w-6" />, title: 'Ticket Accessibili', description: 'Investimenti significativamente inferiori rispetto al PE tradizionale' },
    { icon: <Clock className="h-6 w-6" />, title: 'Holding Flessibile', description: 'Nessun vincolo temporale di exit, holding period modulabile' },
    { icon: <Percent className="h-6 w-6" />, title: 'Costi Competitivi', description: 'Fees di partecipazione contenute rispetto ai fondi tradizionali' },
    { icon: <Users className="h-6 w-6" />, title: 'Partecipazione Attiva', description: 'Coinvolgimento diretto nelle decisioni strategiche' },
    { icon: <PieChart className="h-6 w-6" />, title: 'Diversificazione', description: 'Equity alternativo decorrelato dal mercato pubblico' },
  ];

  const sectors = ['MedTech', 'Meccanica', 'Food & Beverage', 'Digital Services', 'Events'];

  return (
    <>
      <Helmet>
        <title>ABC Company | Opportunità di Investimento in Club Deal | Aumento di Capitale</title>
        <meta name="description" content="Investi in ABC Company: società quotata di permanent capital specializzata in Club Deal su PMI italiane. Track record eccellente con IRR fino al 59%. Aumento di capitale €12M in corso." />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3a52]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Quotata su Euronext Growth Milan
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                ABC Company
                <span className="block text-orange-400 mt-2">Club Deal Investment</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                Società indipendente di permanent capital specializzata in investimenti in PMI italiane.
                <span className="text-orange-400 font-semibold"> Track record verificato, governance trasparente.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  <FileText className="mr-2 h-5 w-5" />
                  Richiedi Documentazione
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Scopri l'Opportunità
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Capital raise banner */}
              <motion.div 
                className="inline-block bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl px-8 py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className="text-gray-300 text-sm mb-1">Aumento di Capitale in Corso</p>
                <p className="text-3xl font-bold text-white">€12M <span className="text-orange-400">@ €4.00/azione</span></p>
                <p className="text-gray-400 text-sm mt-1">Chiusura: 30 Dicembre 2025</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-orange-400 rounded-full mt-2" />
            </div>
          </motion.div>
        </motion.section>

        {/* Key Metrics Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                I Numeri di ABC Company
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Una piattaforma consolidata di investimento in PMI italiane con risultati dimostrati
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                ref={capitalCounter.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="text-center p-6 bg-card border-border hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                      €{capitalCounter.count}M
                    </div>
                    <p className="text-muted-foreground">Capitale Proprio Raccolto</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                ref={portfolioCounter.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="text-center p-6 bg-card border-border hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                      {portfolioCounter.count}
                    </div>
                    <p className="text-muted-foreground">Partecipazioni in Portafoglio</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                ref={clubDealCounter.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="text-center p-6 bg-card border-border hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                      €{clubDealCounter.count}M
                    </div>
                    <p className="text-muted-foreground">Capitale Club Deal</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                ref={outperformCounter.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="text-center p-6 bg-card border-border hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                      +{outperformCounter.count}%
                    </div>
                    <p className="text-muted-foreground">vs FTSE Growth Milan</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is Club Deal Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/30">
                  Il Modello
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Cos'è un Club Deal?
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Il Club Deal è una forma di investimento collettivo che aggrega operatori e investitori privati 
                  per acquisire congiuntamente quote di partecipazione in società, combinando i vantaggi del 
                  private equity con maggiore flessibilità e accessibilità.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Gestione Diretta</h4>
                      <p className="text-muted-foreground text-sm">Crescente preferenza degli HNWI per la gestione diretta dei propri capitali</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">DNA Industriale</h4>
                      <p className="text-muted-foreground text-sm">Family Office italiani con impronta industriale vs approccio finanziario</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Selezione Autonoma</h4>
                      <p className="text-muted-foreground text-sm">Modello strutturato che garantisce la selezione autonoma degli investimenti</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="p-8 bg-gradient-to-br from-[#1a2332] to-[#2a3a52] border-none text-white">
                  <h3 className="text-2xl font-bold mb-6 text-center">Target Investimento ABC</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-gray-300">Fatturato Target</span>
                      <span className="font-bold text-orange-400">€10-100M</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-gray-300">EBITDA minimo</span>
                      <span className="font-bold text-orange-400">&gt;€2M</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-gray-300">Multipli acquisizione</span>
                      <span className="font-bold text-orange-400">6-8x EV/EBITDA</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-gray-300">IRR Obiettivo</span>
                      <span className="font-bold text-green-400">&gt;20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tipo Partecipazione</span>
                      <span className="font-bold text-white">Minoranza / Maggioranza</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400 text-center mb-4">Settori Focus</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sectors.map((sector) => (
                        <Badge key={sector} variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Track Record Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/30">
                Performance Verificate
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Track Record
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Risultati concreti e misurabili su operazioni completate
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {trackRecord.map((deal, index) => (
                <motion.div
                  key={deal.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-orange-500/50 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{deal.name}</h3>
                          <Badge variant="secondary" className="mt-1">{deal.sector}</Badge>
                        </div>
                        <Briefcase className="h-6 w-6 text-orange-500" />
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cash on Cash</span>
                          <span className="font-bold text-foreground">{deal.cashOnCash}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IRR</span>
                          <span className="font-bold text-green-500">{deal.irr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Holding Period</span>
                          <span className="font-bold text-foreground">{deal.period}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perché Investire in ABC Company
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vantaggi esclusivi per azionisti e partecipanti ai Club Deal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((adv, index) => (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 group hover:border-orange-500/50">
                    <CardContent className="p-0">
                      <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-4 group-hover:bg-orange-500/20 transition-colors">
                        <div className="text-orange-500">{adv.icon}</div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{adv.title}</h3>
                      <p className="text-muted-foreground text-sm">{adv.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Capital Raise CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3a52] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Opportunità Attiva
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Aumento di Capitale ABC Company
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Partecipa alla crescita di una piattaforma consolidata di Club Deal
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Importo Residuo</p>
                    <p className="text-3xl font-bold text-white">€12M</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Prezzo per Azione</p>
                    <p className="text-3xl font-bold text-orange-400">€4.00</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Warrant Gratuiti</p>
                    <p className="text-3xl font-bold text-white">1:5</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 mb-10">
                  <p className="text-gray-400 text-sm mb-4">Utilizzo dei Fondi</p>
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400">90%</div>
                      <p className="text-gray-300 text-sm mt-1">Nuovi Club Deal</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">10%</div>
                      <p className="text-gray-300 text-sm mt-1">Partecipazioni Strategiche</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg w-full sm:w-auto">
                      Contattaci per Investire
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="/ABC_Company_Pitch_Deck.pdf" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto">
                      <FileText className="mr-2 h-5 w-5" />
                      Scarica Pitch Deck
                    </Button>
                  </a>
                </div>

                <p className="text-gray-400 text-sm mt-6">
                  Chiusura Aumento di Capitale: <span className="text-white font-semibold">30 Dicembre 2025</span>
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Governance e Trasparenza
                </h2>
                <p className="text-muted-foreground">
                  Società Benefit quotata su Euronext Growth Milan
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        Per gli Azionisti ABC
                      </h3>
                      <ul className="space-y-3">
                        {[
                          'Società di permanent capital indipendente e quotata',
                          'Allineamento di interessi con investitori',
                          'ABC trae profitto principalmente dalle plusvalenze',
                          'Bassi costi di gestione',
                          'Società Benefit certificata'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-orange-500" />
                        Per i Partecipanti Club Deal
                      </h3>
                      <ul className="space-y-3">
                        {[
                          'Accesso privilegiato ed esclusivo agli investimenti',
                          'Equity alternativo decorrelato dal public market',
                          'Assenza di soft commitment',
                          'Fees di partecipazione contenute',
                          'Visibilità e contributo allo sviluppo delle partecipate'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Vuoi saperne di più?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Contattaci per ricevere la documentazione completa e discutere l'opportunità di investimento
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Richiedi Informazioni
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ABCCompanyInvestor;
