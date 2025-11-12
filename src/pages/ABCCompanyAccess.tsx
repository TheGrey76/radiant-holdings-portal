import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "quinley.martini@aries76.com",
  "stefano.taioli@abccompany.it",
];

const ABCCompanyAccess = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    if (AUTHORIZED_EMAILS.includes(normalizedEmail)) {
      sessionStorage.setItem("abcCompanyAccessEmail", normalizedEmail);
      toast.success("Access granted");
      navigate("/abc-company-proposal");
    } else {
      toast.error("Access denied. Email not authorized.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ABC Company S.p.A.
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your authorized email to access the capital raise proposal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Proposal"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ABCCompanyAccess;
