import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const SWING_PASSWORD = "SwingA76!";

interface SwingAccessGateProps {
  children: React.ReactNode;
}

export default function SwingAccessGate({ children }: SwingAccessGateProps) {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(() => {
    return sessionStorage.getItem("swing_access") === "granted";
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SWING_PASSWORD) {
      sessionStorage.setItem("swing_access", "granted");
      setAuthorized(true);
    } else {
      toast.error("Password errata");
      setPassword("");
    }
  };

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
