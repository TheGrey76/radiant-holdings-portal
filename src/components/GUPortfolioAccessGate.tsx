import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface GUPortfolioAccessGateProps {
  children: React.ReactNode;
}

export const GUPortfolioAccessGate = ({ children }: GUPortfolioAccessGateProps) => {
  const [email, setEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStored, setIsCheckingStored] = useState(true);

  useEffect(() => {
    // Check if email is stored in sessionStorage
    const storedEmail = sessionStorage.getItem("gu_portfolio_email");
    if (storedEmail) {
      verifyAccess(storedEmail, true);
    } else {
      setIsCheckingStored(false);
    }
  }, []);

  const verifyAccess = async (emailToVerify: string, isFromStorage: boolean = false) => {
    if (!isFromStorage) {
      setIsLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from("gu_portfolio_access")
        .select("email")
        .eq("email", emailToVerify.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking access:", error);
        toast.error("Errore nella verifica dell'accesso");
        setIsAuthorized(false);
        setIsCheckingStored(false);
        return;
      }

      if (data) {
        setIsAuthorized(true);
        // Store email in sessionStorage for this session
        sessionStorage.setItem("gu_portfolio_email", emailToVerify.toLowerCase().trim());
        if (!isFromStorage) {
          toast.success("Accesso autorizzato");
        }
      } else {
        setIsAuthorized(false);
        sessionStorage.removeItem("gu_portfolio_email");
        if (!isFromStorage) {
          toast.error("Email non autorizzata");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsAuthorized(false);
      toast.error("Errore nella verifica");
    } finally {
      setIsLoading(false);
      setIsCheckingStored(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Inserisci un indirizzo email");
      return;
    }
    verifyAccess(email);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gu_portfolio_email");
    setIsAuthorized(null);
    setEmail("");
  };

  // Show loading while checking stored email
  if (isCheckingStored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifica accesso in corso...</p>
        </div>
      </div>
    );
  }

  // If authorized, show content
  if (isAuthorized === true) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Esci
          </Button>
        </div>
        {children}
      </>
    );
  }

  // Show access gate
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/10">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">Accesso Riservato</CardTitle>
            <CardDescription className="text-base">
              Portfolio Strutturato Cliente G.U.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthorized === false && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive mb-1">Accesso Negato</p>
                <p className="text-sm text-muted-foreground">
                  L'indirizzo email inserito non è autorizzato ad accedere a questa documentazione.
                  Per richiedere l'accesso, contatta Aries76.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Indirizzo Email Aziendale
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@azienda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifica in corso...
                </>
              ) : (
                "Accedi al Portfolio"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Questo documento è riservato esclusivamente ai clienti autorizzati.
              <br />
              L'accesso non autorizzato è vietato.
            </p>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Email autorizzate:</p>
                <p className="text-muted-foreground">
                  Solo gli indirizzi email preautorizzati possono accedere a questa presentazione.
                  Se non hai ricevuto l'autorizzazione, contatta il tuo referente Aries76.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};