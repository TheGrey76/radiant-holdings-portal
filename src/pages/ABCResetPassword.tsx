import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

const ABCResetPassword = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canonicalUrl = useMemo(() => `${window.location.origin}/abc-reset-password`, []);

  useEffect(() => {
    // Supabase may exchange the recovery token from the URL into a session automatically.
    // We only check if a session exists and guide the user otherwise.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        toast.error("Open the reset link from your email again (it may have expired).");
      }
      setIsReady(true);
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Reset session missing. Please reopen the reset email link.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setIsSaving(false);
      return;
    }

    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate("/abc-company-console-access", { replace: true });
  };

  if (!isReady) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | ABC Company Console</title>
        <meta
          name="description"
          content="Reset your password to access the ABC Company Console securely."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center p-4">
        <section className="w-full max-w-md" aria-labelledby="abc-reset-title">
          <article className="bg-[#1e2838] border border-[#2a3a4a] rounded-lg shadow-2xl p-8">
            <header className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h1 id="abc-reset-title" className="text-2xl font-bold text-white mb-2">
                Set a new password
              </h1>
              <p className="text-gray-400 text-sm">ABC Company Console</p>
            </header>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 bg-[#2a3a4a] border-[#3a4a5a] text-white placeholder:text-gray-500"
                  disabled={isSaving}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 bg-[#2a3a4a] border-[#3a4a5a] text-white placeholder:text-gray-500"
                  disabled={isSaving}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : "Update password"}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-6">
              If this page says the reset session is missing, reopen the most recent reset email link.
            </p>
          </article>
        </section>
      </main>
    </>
  );
};

export default ABCResetPassword;
