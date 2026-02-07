import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SwingAccessGateProps {
  children: React.ReactNode;
}

export default function SwingAccessGate({ children }: SwingAccessGateProps) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data } = await supabase.rpc("check_page_access", {
          p_email: session.user.email,
          p_page_slug: "STD",
        });
        if (data) {
          setAuthorized(true);
          setChecking(false);
          return;
        }
      }
    } catch {
      // ignore
    }
    setAuthorized(false);
    setChecking(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setSubmitting(true);
    setErrorReason(null);

    try {
      // First check if email is in the whitelist
      const { data: hasAccess } = await supabase.rpc("check_page_access", {
        p_email: trimmed,
        p_page_slug: "STD",
      });

      if (!hasAccess) {
        setErrorReason("not_authorized");
        setSubmitting(false);
        return;
      }

      // Email is authorized — grant access
      setAuthorized(true);
    } catch {
      setErrorReason("error");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Accesso Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Inserisci la tua email autorizzata per accedere.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="gate-email">Email</Label>
              <Input
                id="gate-email"
                type="email"
                placeholder="nome@azienda.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorReason(null);
                }}
                required
                autoFocus
              />
            </div>

            {errorReason && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {errorReason === "not_authorized"
                    ? "Email non autorizzata."
                    : "Errore di verifica. Riprova."}
                </span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Accedi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
