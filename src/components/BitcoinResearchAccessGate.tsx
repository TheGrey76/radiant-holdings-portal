import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BitcoinResearchAccessGateProps {
  children: React.ReactNode;
}

const BitcoinResearchAccessGate = ({ children }: BitcoinResearchAccessGateProps) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isCheckingStored, setIsCheckingStored] = useState(true);

  useEffect(() => {
    // Check if already verified in session
    const storedEmail = sessionStorage.getItem('bitcoin_research_email');
    const storedAccess = sessionStorage.getItem('bitcoin_research_access');
    
    if (storedEmail && storedAccess === 'true') {
      setEmail(storedEmail);
      setHasAccess(true);
    }
    setIsCheckingStored(false);
  }, []);

  const handleRequestAccess = async () => {
    if (!email.trim()) {
      toast.error('Inserisci la tua email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email non valida');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('bitcoin-research-signup', {
        body: { email: email.trim().toLowerCase(), action: 'request' }
      });

      if (error) {
        console.error('Error requesting access:', error);
        toast.error('Errore nella richiesta');
        return;
      }

      if (data?.success) {
        setStep('verify');
        toast.success('Codice di verifica inviato!', {
          description: 'Controlla la tua casella email'
        });
      } else if (data?.alreadyVerified) {
        sessionStorage.setItem('bitcoin_research_email', email.trim().toLowerCase());
        sessionStorage.setItem('bitcoin_research_access', 'true');
        setHasAccess(true);
        toast.success('Bentornato!');
      } else {
        toast.error(data?.error || 'Errore nella richiesta');
      }
    } catch (err) {
      console.error('Request error:', err);
      toast.error('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error('Inserisci il codice di verifica');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('bitcoin-research-signup', {
        body: { 
          email: email.trim().toLowerCase(), 
          action: 'verify',
          code: verificationCode.trim()
        }
      });

      if (error) {
        console.error('Error verifying:', error);
        toast.error('Errore nella verifica');
        return;
      }

      if (data?.success) {
        sessionStorage.setItem('bitcoin_research_email', email.trim().toLowerCase());
        sessionStorage.setItem('bitcoin_research_access', 'true');
        setHasAccess(true);
        toast.success('Email verificata! Benvenuto');
      } else {
        toast.error(data?.error || 'Codice non valido');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleRequestAccess();
      } else {
        handleVerifyCode();
      }
    }
  };

  if (isCheckingStored) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(247, 147, 26, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 147, 26, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md bg-[#161b22]/90 border-orange-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
              <span className="text-4xl font-bold text-orange-400">₿</span>
            </div>
            <CardTitle className="text-2xl text-white">Bitcoin Research 2026</CardTitle>
            <CardDescription className="text-gray-400">
              {step === 'email' 
                ? 'Inserisci la tua email per accedere al report completo'
                : 'Inserisci il codice di verifica ricevuto via email'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'email' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tuaemail@esempio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-[#0d1117] border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleRequestAccess} 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Accedi al Report
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-300">
                    Abbiamo inviato un codice di verifica a <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-300">Codice di Verifica</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-[#0d1117] border-gray-700 text-white text-center text-2xl tracking-widest placeholder:text-gray-500 focus:border-orange-500"
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                <Button 
                  onClick={handleVerifyCode} 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifica in corso...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verifica Email
                    </>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep('email')}
                  className="w-full text-gray-400 hover:text-white"
                >
                  ← Torna indietro
                </Button>
              </>
            )}

            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-center text-gray-500">
                Accesso gratuito per professionisti e investitori.
                <br />
                I tuoi dati sono protetti e non verranno condivisi.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BitcoinResearchAccessGate;
