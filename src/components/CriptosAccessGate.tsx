import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CRYPTO_LOGOS = [
  { symbol: 'TON', url: 'https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png' },
  { symbol: 'LINK', url: 'https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png' },
  { symbol: 'ONDO', url: 'https://assets.coingecko.com/coins/images/26580/standard/ONDO.png' },
  { symbol: 'TAO', url: 'https://assets.coingecko.com/coins/images/28452/standard/ARUsPeNQ_400x400.jpeg' },
  { symbol: 'RENDER', url: 'https://assets.coingecko.com/coins/images/11636/standard/rndr.png' },
  { symbol: 'SUI', url: 'https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg' },
  { symbol: 'AAVE', url: 'https://assets.coingecko.com/coins/images/12645/standard/AAVE.png' },
  { symbol: 'RSR', url: 'https://assets.coingecko.com/coins/images/8365/standard/rsr.png' },
  { symbol: 'BTC', url: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png' },
  { symbol: 'ETH', url: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png' },
  { symbol: 'SOL', url: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png' },
  { symbol: 'BNB', url: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png' },
];

interface CriptosAccessGateProps {
  children: React.ReactNode;
}

const CriptosAccessGate = ({ children }: CriptosAccessGateProps) => {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('criptos_portfolio_email');
    const storedAccess = sessionStorage.getItem('criptos_portfolio_access');
    
    if (storedEmail && storedAccess === 'true') {
      revalidateAccess(storedEmail);
    } else {
      setIsLoading(false);
    }
  }, []);

  const revalidateAccess = async (storedEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-page-access', {
        body: { email: storedEmail, page_slug: 'criptos-portfolio' }
      });

      if (error || !data?.hasAccess) {
        sessionStorage.removeItem('criptos_portfolio_email');
        sessionStorage.removeItem('criptos_portfolio_access');
        setHasAccess(false);
        setErrorReason(data?.reason === 'expired' ? 'Accesso scaduto.' : null);
      } else {
        setEmail(storedEmail);
        setHasAccess(true);
      }
    } catch {
      sessionStorage.removeItem('criptos_portfolio_email');
      sessionStorage.removeItem('criptos_portfolio_access');
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccess = async () => {
    if (!email.trim()) {
      toast.error('Inserisci la tua email');
      return;
    }

    setIsVerifying(true);
    setErrorReason(null);
    
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.functions.invoke('check-page-access', {
        body: { email: normalizedEmail, page_slug: 'criptos-portfolio' }
      });

      if (error) {
        toast.error('Errore nella verifica');
        setHasAccess(false);
        return;
      }

      if (data?.hasAccess) {
        sessionStorage.setItem('criptos_portfolio_email', normalizedEmail);
        sessionStorage.setItem('criptos_portfolio_access', 'true');
        setHasAccess(true);
        toast.success('Accesso autorizzato');
      } else {
        setHasAccess(false);
        if (data?.reason === 'expired') {
          setErrorReason('Accesso scaduto. Contatta il tuo consulente.');
          toast.error('Accesso scaduto');
        } else {
          setErrorReason('Email non autorizzata. Contatta il tuo consulente.');
          toast.error('Email non autorizzata');
        }
      }
    } catch {
      toast.error('Errore di connessione');
      setHasAccess(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') verifyAccess();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Radiant background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />

      {/* Floating crypto logos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CRYPTO_LOGOS.map((logo, i) => {
          const positions = [
            { top: '8%', left: '10%' },
            { top: '12%', right: '15%' },
            { top: '25%', left: '5%' },
            { top: '30%', right: '8%' },
            { bottom: '35%', left: '12%' },
            { bottom: '30%', right: '10%' },
            { bottom: '15%', left: '8%' },
            { bottom: '10%', right: '18%' },
            { top: '5%', left: '45%' },
            { bottom: '8%', left: '40%' },
            { top: '45%', left: '3%' },
            { top: '50%', right: '4%' },
          ];
          const pos = positions[i] || {};
          return (
            <div
              key={logo.symbol}
              className="absolute opacity-[0.12] hover:opacity-25 transition-opacity duration-500"
              style={{
                ...pos,
                animation: `float ${6 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <img
                src={logo.url}
                alt={logo.symbol}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* Access card */}
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Criptos Portfolio</CardTitle>
          <CardDescription>
            Inserisci la tua email autorizzata per accedere al report cripto
          </CardDescription>

          {/* Mini logo strip */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {CRYPTO_LOGOS.slice(0, 8).map((logo) => (
              <img
                key={logo.symbol}
                src={logo.url}
                alt={logo.symbol}
                className="w-7 h-7 rounded-full opacity-60"
                loading="lazy"
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tuaemail@esempio.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorReason(null); }}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isVerifying}
              />
            </div>
          </div>

          {errorReason && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{errorReason}</p>
            </div>
          )}

          <Button onClick={verifyAccess} className="w-full" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifica in corso...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verifica Accesso
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Questa pagina è riservata ai clienti autorizzati.
            <br />
            Per richiedere accesso, contatta{' '}
            <a href="mailto:edoardo.grigione@aries76.com" className="text-primary hover:underline">
              edoardo.grigione@aries76.com
            </a>
          </p>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default CriptosAccessGate;
