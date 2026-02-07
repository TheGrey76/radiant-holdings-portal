import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SwingAccessGateProps {
  children: React.ReactNode;
}

export default function SwingAccessGate({ children }: SwingAccessGateProps) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    verifyAccess();
  }, []);

  const verifyAccess = async () => {
    setChecking(true);
    setErrorReason(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        setErrorReason("login_required");
        setAuthorized(false);
        setChecking(false);
        return;
      }

      const { data } = await supabase.rpc("check_page_access", {
        p_email: session.user.email,
        p_page_slug: "STD",
      });

      if (data) {
        setAuthorized(true);
      } else {
        setErrorReason("not_authorized");
        setAuthorized(false);
      }
    } catch {
      setErrorReason("error");
      setAuthorized(false);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (authorized) return <>{children}</>;

  const errorMessages: Record<string, { title: string; desc: string }> = {
    login_required: {
      title: "Accesso richiesto",
      desc: "Effettua il login con un'email autorizzata per accedere.",
    },
    not_authorized: {
      title: "Accesso negato",
      desc: "La tua email non è autorizzata ad accedere a questa pagina.",
    },
    error: {
      title: "Errore di verifica",
      desc: "Si è verificato un errore durante la verifica. Riprova.",
    },
  };

  const msg = errorMessages[errorReason || "error"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <CardTitle className="text-lg">{msg.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{msg.desc}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {errorReason === "login_required" ? (
            <Button className="w-full" onClick={() => window.location.href = "/auth"}>
              Vai al Login
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={verifyAccess}>
              Riprova
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
