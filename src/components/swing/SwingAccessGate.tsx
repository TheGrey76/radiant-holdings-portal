import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SWING_PASSWORD = "SwingA76!";

interface SwingAccessGateProps {
  children: React.ReactNode;
}

export default function SwingAccessGate({ children }: SwingAccessGateProps) {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedAccess = sessionStorage.getItem("swing_access");

    if (storedAccess !== "granted") {
      // No stored session — check if logged-in user has page_access
      checkLoggedInUser();
      return;
    }

    // Stored session exists — re-validate against whitelist
    revalidateStoredAccess();
  }, []);

  const checkLoggedInUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data } = await supabase.rpc("check_page_access", {
          p_email: session.user.email,
          p_page_slug: "STD",
        });
        if (data) {
          sessionStorage.setItem("swing_access", "granted");
          sessionStorage.setItem("swing_access_method", "email");
          setAuthorized(true);
        }
      }
    } catch {
      // ignore – fallback to password
    } finally {
      setChecking(false);
    }
  };

  const revalidateStoredAccess = async () => {
    const method = sessionStorage.getItem("swing_access_method");

    if (method === "password") {
      // Password access doesn't need re-validation against DB
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // Email-based access — re-verify against whitelist
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
      // Access revoked or user logged out — clear session
      sessionStorage.removeItem("swing_access");
      sessionStorage.removeItem("swing_access_method");
      setAuthorized(false);
    } catch {
      // Network error — clear for safety
      sessionStorage.removeItem("swing_access");
      sessionStorage.removeItem("swing_access_method");
      setAuthorized(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SWING_PASSWORD) {
      sessionStorage.setItem("swing_access", "granted");
      sessionStorage.setItem("swing_access_method", "password");
      setAuthorized(true);
    } else {
      toast.error("Password errata");
      setPassword("");
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
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Swing Trading Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Inserisci la password per accedere
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full">
              Accedi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
