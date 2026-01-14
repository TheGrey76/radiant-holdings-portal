import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ETFPortfolioAccessGateProps {
  children: React.ReactNode;
}

const ETFPortfolioAccessGate = ({ children }: ETFPortfolioAccessGateProps) => {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already verified in session
    const storedEmail = sessionStorage.getItem('etf_portfolio_email');
    const storedAccess = sessionStorage.getItem('etf_portfolio_access');
    
    if (storedEmail && storedAccess === 'true') {
      setEmail(storedEmail);
      setHasAccess(true);
    }
    setIsLoading(false);
  }, []);

  const verifyAccess = async () => {
    if (!email.trim()) {
      toast.error('Inserisci la tua email');
      return;
    }

    setIsVerifying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-page-access', {
        body: { email: email.trim().toLowerCase(), page_slug: 'etf-sp-af' }
      });

      if (error) {
        console.error('Error checking access:', error);
        toast.error('Errore nella verifica');
        setHasAccess(false);
        return;
      }

      if (data?.hasAccess) {
        sessionStorage.setItem('etf_portfolio_email', email.trim().toLowerCase());
        sessionStorage.setItem('etf_portfolio_access', 'true');
        setHasAccess(true);
        toast.success('Accesso autorizzato');
      } else {
        setHasAccess(false);
        toast.error('Email non autorizzata', {
          description: 'Contatta il tuo consulente per richiedere accesso'
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Errore di connessione');
      setHasAccess(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyAccess();
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Portafoglio Riservato</CardTitle>
          <CardDescription>
            Inserisci la tua email autorizzata per accedere al portafoglio ETF & Certificates
          </CardDescription>
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
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isVerifying}
              />
            </div>
          </div>

          {hasAccess === false && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>Email non autorizzata. Contatta il tuo consulente.</p>
            </div>
          )}

          <Button 
            onClick={verifyAccess} 
            className="w-full" 
            disabled={isVerifying}
          >
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
    </div>
  );
};

export default ETFPortfolioAccessGate;
