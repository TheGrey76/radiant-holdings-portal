import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { ArrowRight, Bitcoin, Cpu, Building2, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NetworkParticles from '@/components/NetworkParticles';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

/* ───────────────────── HERO ───────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Suspense fallback={<div className="absolute inset-0 bg-[#0f1729]" />}>
        <NetworkParticles />
      </Suspense>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-transparent to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1729]/50 via-transparent to-transparent z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] z-0" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.2 }} className="mb-4">
          <div className="text-5xl sm:text-6xl font-light tracking-[0.15em] text-white uppercase">
            ARIES<span className="text-accent">76</span>
          </div>
          <div className="text-[0.65rem] font-extralight tracking-[0.4em] text-accent uppercase mt-1">
            Capital Intelligence
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight"
        >
          Operative Holding &{' '}
          <span className="text-accent font-normal">Capital Intelligence</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Aries76 Ltd è una holding operativa strategica con focus su intelligenza artificiale
          per i mercati privati e asset digitali.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-6 text-base"
          >
            <a href="#raise-ai">
              Scopri RAISE AI
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-6 text-base backdrop-blur-sm"
          >
            <a href="#bitcoin">Bitcoin Strategy</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────────────────── CHI SIAMO ───────────────────── */
function ChiSiamoSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-[#0f1729] to-[#111d33]">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }}>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            The Holding Company
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
            Aries76 costruisce ponti tra capitale e opportunità. Non più una semplice advisory,
            ma un'entità che investe e opera direttamente in progetti trasformativi —
            dall'intelligenza artificiale applicata ai mercati privati alla gestione strategica
            di asset digitali.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { icon: Building2, title: 'Holding Operativa', desc: 'Investimento diretto e gestione attiva di progetti strategici ad alto potenziale.' },
            { icon: Cpu, title: 'AI-Powered', desc: 'Tecnologia proprietaria per intelligenza di mercato e capital formation.' },
            { icon: Bitcoin, title: 'Digital Assets', desc: 'Strategia istituzionale in Bitcoin e asset digitali con ricerca dedicata.' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <item.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── RAISE AI ───────────────────── */
function RaiseAISection() {
  return (
    <section id="raise-ai" className="relative py-28 bg-[#111d33]">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent" />
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium tracking-wider uppercase mb-6">
              Progetto Principale
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-tight">
              RAISE AI Ltd
            </h2>
            <p className="text-accent font-medium text-lg mb-6">
              AI-Powered Capital Intelligence
            </p>
            <p className="text-white/60 font-light leading-relaxed mb-4">
              Aries76 è attivamente coinvolta e investita in RAISE AI Ltd, la piattaforma
              intelligente che guida attraverso ogni fase del fundraise — dalla
              strutturazione alla chiusura.
            </p>
            <p className="text-white/40 italic text-sm mb-8">
              "Close More. Guess Less."
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-medium px-8"
            >
              <a href="https://www.raiseplatform.eu" target="_blank" rel="noopener noreferrer">
                Visita RAISE Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-light tracking-[0.15em] text-white/80 uppercase mb-2">
                  RAISE
                </div>
                <div className="text-accent text-sm tracking-[0.3em] uppercase font-light">
                  AI Platform
                </div>
                <div className="mt-4 text-white/30 text-xs">www.raiseplatform.eu</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── BITCOIN HOLDING ───────────────────── */
function BitcoinSection() {
  return (
    <section id="bitcoin" className="relative py-28 bg-gradient-to-b from-[#111d33] to-[#0f1729]">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium tracking-wider uppercase mb-6">
            Digital Assets
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
            Bitcoin Holding Strategy
          </h2>
          <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Aries76 opera come Bitcoin Holding Company, gestendo un portafoglio strategico
            e fornendo ricerca istituzionale — Bitcoin Scenario-Consistent Ranges — e
            allocazione dinamica nel settore degli asset digitali.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'Strategic Portfolio', desc: 'Gestione attiva di posizioni Bitcoin con approccio istituzionale.' },
            { label: 'Research', desc: 'Scenario-Consistent Ranges e analisi di regime per allocazione dinamica.' },
            { label: 'Institutional Grade', desc: 'Framework di rischio e compliance per investitori qualificati.' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-xl border border-white/10 bg-white/[0.02] text-left"
            >
              <Bitcoin className="h-5 w-5 text-accent mb-3" strokeWidth={1.5} />
              <h3 className="text-white font-medium mb-2">{item.label}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── FOOTER ───────────────────── */
function LandingFooter() {
  return (
    <footer className="bg-[#0a0f1d] border-t border-white/5 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-3xl font-light tracking-[0.15em] text-white uppercase mb-1">
              ARIES<span className="text-accent">76</span>
            </div>
            <div className="text-[0.6rem] font-extralight tracking-[0.3em] text-accent uppercase mb-6">
              Capital Intelligence
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed">
              Operative Holding & Capital Intelligence
            </p>
          </div>

          {/* HQ */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-light">
              Sede Principale
            </h3>
            <div className="flex items-start gap-2 text-white/40 text-sm mb-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent/60" />
              <span>27 Old Gloucester Street, London, WC1N 3AX, United Kingdom</span>
            </div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-light mt-6">
              Ufficio Budapest
            </h3>
            <div className="flex items-start gap-2 text-white/40 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent/60" />
              <span>Kertész u. 37, Budapest, 1073, Hungary</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-light">
              Contatti
            </h3>
            <a
              href="mailto:quinley.martini@aries76.com"
              className="flex items-center gap-2 text-white/40 hover:text-accent transition-colors text-sm"
            >
              <Mail className="h-4 w-4 text-accent/60" />
              quinley.martini@aries76.com
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-white/25 text-[0.65rem] leading-relaxed text-center">
            © 2026 Aries76 Ltd — All rights reserved. | Aries76 Ltd is registered in
            England and Wales. | The company does not conduct any regulated investment
            activity as defined by the UK Financial Services and Markets Act 2000.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */
const Home = () => (
  <div className="min-h-screen bg-[#0f1729]">
    <HeroSection />
    <ChiSiamoSection />
    <RaiseAISection />
    <BitcoinSection />
    <LandingFooter />
  </div>
);

export default Home;
