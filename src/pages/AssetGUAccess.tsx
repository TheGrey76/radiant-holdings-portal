import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "gp@aries76.com"
];

const AssetGUAccess = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (AUTHORIZED_EMAILS.includes(email.toLowerCase().trim())) {
        sessionStorage.setItem("assetgu_authorized_email", email);
        toast({
          title: "Access Granted",
          description: "Redirecting to proposal...",
        });
        navigate("/asset-gu-proposal");
      } else {
        toast({
          title: "Access Denied",
          description: "This email is not authorized to view this proposal.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/95 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Asset G.U. Portfolio Architecture</CardTitle>
          <CardDescription className="text-base">
            This proposal is confidential and restricted to authorized recipients only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Proposal"}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              For access inquiries, please contact:{" "}
              <a href="mailto:edoardo.grigione@aries76.com" className="text-amber-600 hover:text-amber-700 underline">
                edoardo.grigione@aries76.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetGUAccess;
