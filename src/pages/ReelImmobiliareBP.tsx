import BPScenarioPlanner from "@/components/reelimmobiliare/BPScenarioPlanner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const ReelBPAccessGate = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStored, setIsCheckingStored] = useState(true);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reel_immobiliare_email");
    if (storedEmail) {
      verifyAccess(storedEmail, true);
    } else {
      setIsCheckingStored(false);
    }
  }, []);

  const verifyAccess = async (emailToVerify: string, isFromStorage = false) => {
    if (!isFromStorage) setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reel_immobiliare_access")
        .select("email")
        .eq("email", emailToVerify.toLowerCase().trim())
        .maybeSingle();
      if (error) { setIsAuthorized(false); setIsCheckingStored(false); return; }
      if (data) {
        setIsAuthorized(true);
        sessionStorage.setItem("reel_immobiliare_email", emailToVerify.toLowerCase().trim());
      } else {
        setIsAuthorized(false);
        sessionStorage.removeItem("reel_immobiliare_email");
        if (!isFromStorage) toast.error("Email non autorizzata");
      }
    } catch { setIsAuthorized(false); } finally { setIsLoading(false); setIsCheckingStored(false); }
  };

  if (isCheckingStored) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (isAuthorized === true) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-md border-2 border-primary/20 bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <motion.div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mx-auto shadow-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>
          <div>
            <CardTitle className="text-2xl mb-2">Business Plan — Reel Immobiliare</CardTitle>
            <CardDescription>Scenario Planner Interattivo</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthorized === false && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Email non autorizzata.</p>
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) verifyAccess(email); }} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="email" placeholder="nome@azienda.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} required />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-orange-600" disabled={isLoading}>
              <Lock className="h-4 w-4 mr-2" /> {isLoading ? "Verifica..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ReelImmobiliareBP() {
  return (
    <RealBPAccessGateWrapper>
      <Helmet>
        <title>Business Plan — Reel Immobiliare | Aries76</title>
        <meta name="description" content="Business Plan interattivo con scenario planner per Reel Immobiliare - Piano a 3 anni" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <BPScenarioPlanner />
        </div>
      </div>
    </RealBPAccessGateWrapper>
  );
}

function RealBPAccessGateWrapper({ children }: { children: React.ReactNode }) {
  return <ReelBPAccessGate>{children}</ReelBPAccessGate>;
}
