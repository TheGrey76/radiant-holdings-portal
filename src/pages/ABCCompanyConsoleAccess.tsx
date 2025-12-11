import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ABCCompanyConsoleAccess = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      // Verify email against database instead of hardcoded list
      const { data, error } = await supabase
        .from('abc_console_access')
        .select('email')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        console.error('Access verification error:', error);
        toast.error("Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data) {
        sessionStorage.setItem('abc_console_authorized', 'true');
        sessionStorage.setItem('abc_console_email', normalizedEmail);
        toast.success("Access granted to ABC Company Console");
        navigate('/abc-company-console');
      } else {
        toast.error("Access denied. This email is not authorized.");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e2838] border border-[#2a3a4a] rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ABC Company Console
            </h1>
            <p className="text-gray-400 text-sm">
              Investor CRM & Fundraising Dashboard
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Enter your authorized email to access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 bg-[#2a3a4a] border-[#3a4a5a] text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Console"}
            </Button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            This is a restricted area for authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ABCCompanyConsoleAccess;
