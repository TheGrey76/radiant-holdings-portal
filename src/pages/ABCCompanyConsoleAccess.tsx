import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ABCCompanyConsoleAccess = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated and authorized
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user is authorized for ABC console
        const { data: authUser } = await supabase
          .from('abc_authorized_users')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        // Also check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        
        if (authUser || isAdmin) {
          navigate('/abc-company-console');
          return;
        }
      }
      setIsCheckingSession(false);
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      // First verify email is in the access list
      const { data: accessData, error: accessError } = await supabase
        .from('abc_console_access')
        .select('email')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (accessError) {
        console.error('Access verification error:', accessError);
        toast.error("Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!accessData) {
        toast.error("Access denied. This email is not authorized.");
        setIsLoading(false);
        return;
      }

      // Email is authorized, proceed with authentication
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: password,
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error("This email is already registered. Please sign in instead.");
            setIsSignUp(false);
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user && !data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setIsSignUp(false);
        } else if (data.session) {
          // Auto-confirmed, add to authorized users
          await addToAuthorizedUsers(data.user!.id, normalizedEmail);
          toast.success("Account created! Access granted to ABC Company Console");
          navigate('/abc-company-console');
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. If you haven't signed up yet, click 'Create Account'.");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Ensure user is in authorized users table
          await addToAuthorizedUsers(data.user.id, normalizedEmail);
          toast.success("Access granted to ABC Company Console");
          navigate('/abc-company-console');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const addToAuthorizedUsers = async (userId: string, userEmail: string) => {
    // Check if already in authorized users
    const { data: existing } = await supabase
      .from('abc_authorized_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existing) {
      // Add to authorized users (this will be done with service role in production)
      // For now, we rely on the RLS policy that allows admins to insert
      const { error } = await supabase
        .from('abc_authorized_users')
        .insert({
          user_id: userId,
          email: userEmail,
          granted_by: 'self-registration'
        });
      
      if (error) {
        console.log('Could not add to authorized users (may need admin to add):', error);
      }
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
              {isSignUp ? "Create your account" : "Sign in to access"}
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 bg-[#2a3a4a] border-[#3a4a5a] text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-400 hover:text-orange-300 text-sm"
              disabled={isLoading}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            This is a restricted area for authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ABCCompanyConsoleAccess;