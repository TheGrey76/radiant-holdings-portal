import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, AlertTriangle,
  Target, Clock, FileText, Settings, Search, Filter,
  Mail, Phone, Building, MapPin, Download, Share2, X, Plus,
  ExternalLink, Paperclip, Edit, Trash2, LogOut, Send, Eye, Heart,
  Shield, Lock, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ABCActivityFeed } from "@/components/ABCActivityFeed";
import { ABCInvestorKanban } from "@/components/ABCInvestorKanban";
import { ImportABCInvestorsDialog } from "@/components/ImportABCInvestorsDialog";

import { EditableOverallProgress } from "@/components/EditableOverallProgress";
import { EditableKPI } from "@/components/EditableKPI";
import { ABCAnalyticsTab } from "@/components/ABCAnalyticsTab";
import { ABCCommitmentTracker } from "@/components/ABCCommitmentTracker";
import { ABCEmailCampaignManager } from "@/components/ABCEmailCampaignManager";
import { ABCEngagementScore } from "@/components/ABCEngagementScore";
import { NotificationBell } from "@/components/NotificationBell";
import { OnlineUsersIndicator } from "@/components/OnlineUsersIndicator";
import { ABCSettingsTab } from "@/components/ABCSettingsTab";
import ABCEmailEnrichment from "@/components/ABCEmailEnrichment";
import ABCUnifiedEnrichment from "@/components/ABCUnifiedEnrichment";
import { ABCRelationshipIntelligence } from "@/components/ABCRelationshipIntelligence";
import { ABCPipelineVelocity } from "@/components/ABCPipelineVelocity";
import { ABCAnimatedFunnel } from "@/components/ABCAnimatedFunnel";
import { ABCAutoReminders, Reminder } from "@/components/ABCAutoReminders";
import { ABCFollowUpSequences } from "@/components/ABCFollowUpSequences";
import { ABCCampaignStatsDialog } from "@/components/ABCCampaignStatsDialog";
import { useKPIHistory } from "@/hooks/useKPIHistory";
import { supabase } from "@/integrations/supabase/client";
import { ABCDataProvider } from "@/contexts/ABCDataContext";

// Auth View type
type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

// Password reset form component (inline)
const ResetPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
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
    onBack();
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
              Set a new password
            </h1>
            <p className="text-gray-400 text-sm">ABC Company Console</p>
          </div>

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
        </div>
      </div>
    </div>
  );
};

// Login Form Component (inline)
const LoginForm = ({ onSuccess }: { onSuccess: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);

  const handleForgotPassword = async () => {
    const normalizedEmail = email.toLowerCase().trim();
    const redirectTo = `${window.location.origin}/abc-company-console?reset=true`;
    
    if (!normalizedEmail) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotMessage(true);
    }
    
    setIsLoading(false);
  };

  const addToAuthorizedUsers = async (userId: string, userEmail: string) => {
    const { data: existing } = await supabase
      .from('abc_authorized_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existing) {
      await supabase
        .from('abc_authorized_users')
        .insert({
          user_id: userId,
          email: userEmail,
          granted_by: 'self-registration'
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const { data: isAuthorized, error: accessError } = await supabase.rpc(
        'check_abc_console_access',
        { check_email: normalizedEmail }
      );

      if (accessError) {
        console.error('Access verification error:', accessError);
        toast.error("Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!isAuthorized) {
        toast.error("Access denied. This email is not authorized.");
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
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
          await addToAuthorizedUsers(data.user!.id, normalizedEmail);
          toast.success("Account created! Access granted to ABC Company Console");
          onSuccess(normalizedEmail);
        }
      } else {
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
          await addToAuthorizedUsers(data.user.id, normalizedEmail);
          toast.success("Access granted to ABC Company Console");
          onSuccess(normalizedEmail);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  if (showForgotMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#1e2838] border border-[#2a3a4a] rounded-lg shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 text-sm mb-6">
              We've sent a password reset link to your email address. Click the link to set a new password.
            </p>
            <Button
              onClick={() => setShowForgotMessage(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
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
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 bg-[#2a3a4a] border-[#3a4a5a] text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-400 hover:text-orange-300 text-sm block w-full"
              disabled={isLoading}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
            
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-gray-400 hover:text-gray-300 text-sm"
                disabled={isLoading || !email}
              >
                Forgot password?
              </button>
            )}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            This is a restricted area for authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
};

// All investor data is fetched dynamically from Supabase - funnel synced with live data

const ABCCompanyConsole = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  // KPI history is now automatically managed by Supabase
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Check for reset password query param
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setShowResetPassword(true);
    }
  }, [searchParams]);

  // Check authentication on mount via Supabase Auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If reset mode and session exists, show reset form
      if (searchParams.get('reset') === 'true' && session?.user) {
        setShowResetPassword(true);
        setIsCheckingAuth(false);
        return;
      }
      
      if (!session?.user) {
        setIsCheckingAuth(false);
        return;
      }

      // Check if user is authorized (either in abc_authorized_users or is admin)
      const { data: authUser } = await supabase
        .from('abc_authorized_users')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });
      
      if (!authUser && !isAdmin) {
        setIsCheckingAuth(false);
        return;
      }

      setCurrentUserEmail(session.user.email || null);
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setCurrentUserEmail(null);
        setShowResetPassword(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUserEmail(email);
    setIsAuthenticated(true);
  };

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [investors, setInvestors] = useState<any[]>([]);
  const [loadingInvestors, setLoadingInvestors] = useState(true);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<any[]>([]);
  // Funnel data is now always calculated from real investor data (removed customFunnelData override)
  const [editInvestorId, setEditInvestorId] = useState<string | null>(null);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);
  const [pendingReminders, setPendingReminders] = useState<Reminder[]>([]);
  
  // Quick Actions state
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [selectedInvestorForAction, setSelectedInvestorForAction] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [followUpData, setFollowUpData] = useState({
    date: "",
    type: "call",
    description: ""
  });
  const [progressData, setProgressData] = useState({
    targetAmount: 10000000,
    raisedAmount: 0,
    deadline: "2026-06-30",
  });
  const [meetingsKPI, setMeetingsKPI] = useState({
    current: 0,
    target: 20,
    percentage: 0,
  });
  const [closedKPI, setClosedKPI] = useState({
    current: 0,
    target: 10000000,
    percentage: 0,
  });

  // Campaign stats state
  const [campaignStats, setCampaignStats] = useState({
    totalCampaigns: 0,
    totalEmailsSent: 0,
    totalOpens: 0,
    successRate: 0,
  });
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [statsDialogType, setStatsDialogType] = useState<'campaigns' | 'sent' | 'opens' | 'success'>('campaigns');
  
  // Data quality alert state
  const [showDataQualityAlert, setShowDataQualityAlert] = useState(true);
  const [lastImportCount, setLastImportCount] = useState(0);
  const [showImportAlert, setShowImportAlert] = useState(false);
  
  // Refresh key - incrementato dopo enrichment per forzare re-render dei componenti engagement
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  // Settings state
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailySummary: true,
    followUpReminders: true,
    milestoneAlerts: true,
    overdueTasks: true,
    biweeklyReport: true,
    newInteractions: true,
    statusChanges: true,
    documentUploads: true,
    meetingReminders: true,
  });
  const [customAuthorizedEmails, setCustomAuthorizedEmails] = useState<string[]>([]);
  const [newAuthorizedEmail, setNewAuthorizedEmail] = useState("");
  const [settingsTargetAmount, setSettingsTargetAmount] = useState("10000000");
  const [settingsDeadline, setSettingsDeadline] = useState("2026-06-30");
  // currentUserEmail is now set via Supabase auth state in the useEffect above

  // Fetch investors from Supabase and load saved data
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInvestors();
    fetchUpcomingFollowUps();
    fetchCampaignStats();

    const savedProgress = localStorage.getItem("abc-progress-data");
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }

    const savedMeetings = localStorage.getItem("abc-meetings-kpi");
    if (savedMeetings) {
      setMeetingsKPI(JSON.parse(savedMeetings));
    }

    const savedClosed = localStorage.getItem("abc-closed-kpi");
    if (savedClosed) {
      setClosedKPI(JSON.parse(savedClosed));
    }
  }, [isAuthenticated]);

  // Record daily KPI snapshot automatically
  // KPI snapshots are now captured automatically from the database via capture_kpi_snapshot()

  // Funnel data is always calculated from real investor data - no localStorage override

  // Load settings from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Load notification preferences
    const savedNotifPrefs = localStorage.getItem('abc_notification_prefs');
    if (savedNotifPrefs) {
      setNotificationPrefs(JSON.parse(savedNotifPrefs));
    }
    
    // Load custom authorized emails
    const savedEmails = localStorage.getItem('abc_console_custom_emails');
    if (savedEmails) {
      setCustomAuthorizedEmails(JSON.parse(savedEmails));
    }
    
    // Load settings target/deadline from progressData
    setSettingsTargetAmount(progressData.targetAmount.toString());
    setSettingsDeadline(progressData.deadline);
  }, [isAuthenticated, progressData.targetAmount, progressData.deadline]);

  // Save notification preferences
  const saveNotificationPrefs = () => {
    localStorage.setItem('abc_notification_prefs', JSON.stringify(notificationPrefs));
    toast.success("Notification preferences saved");
  };

  // Save configuration
  const saveConfiguration = () => {
    const newTarget = parseInt(settingsTargetAmount) || 10000000;
    const newProgressData = {
      ...progressData,
      targetAmount: newTarget,
      deadline: settingsDeadline,
    };
    setProgressData(newProgressData);
    localStorage.setItem('abc-progress-data', JSON.stringify(newProgressData));
    toast.success("Configuration updated");
  };

  // Add authorized email
  const addAuthorizedEmail = () => {
    const email = newAuthorizedEmail.toLowerCase().trim();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    if (customAuthorizedEmails.includes(email)) {
      toast.error("Email already in list");
      return;
    }
    const newList = [...customAuthorizedEmails, email];
    setCustomAuthorizedEmails(newList);
    localStorage.setItem('abc_console_custom_emails', JSON.stringify(newList));
    setNewAuthorizedEmail("");
    toast.success("User added successfully");
  };

  // Remove authorized email
  const removeAuthorizedEmail = (email: string) => {
    const newList = customAuthorizedEmails.filter(e => e !== email);
    setCustomAuthorizedEmails(newList);
    localStorage.setItem('abc_console_custom_emails', JSON.stringify(newList));
    toast.success("User removed");
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1a2332] to-[#2a3342] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show reset password form when coming from reset email link
  if (showResetPassword) {
    return (
      <ResetPasswordForm 
        onBack={() => {
          setShowResetPassword(false);
          setSearchParams({});
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  const fetchUpcomingFollowUps = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data, error } = await supabase
        .from('abc_investor_followups' as any)
        .select('*')
        .gte('follow_up_date', today.toISOString().split('T')[0])
        .lte('follow_up_date', nextWeek.toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('follow_up_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setUpcomingFollowUps(data || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const fetchInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('abc_investors' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const normalizeNullableString = (v: unknown): string | null => {
        if (v === null || v === undefined) return null;
        if (typeof v !== 'string') return String(v);
        const t = v.trim();
        if (!t) return null;
        if (t.toLowerCase() === 'null') return null;
        return t;
      };

      // Transform to match component interface
      const transformedInvestors = (data || []).map((inv: any) => ({
        id: inv.id,
        nome: inv.nome,
        azienda: inv.azienda,
        ruolo: inv.ruolo,
        categoria: inv.categoria,
        citta: inv.citta,
        fonte: inv.fonte,
        linkedin: normalizeNullableString(inv.linkedin),
        email: normalizeNullableString(inv.email),
        phone: normalizeNullableString(inv.phone),
        priorita: inv.priorita,
        status: inv.status,
        pipelineValue: Number(inv.pipeline_value),
        probability: inv.probability,
        expectedClose: inv.expected_close,
        relationshipOwner: inv.relationship_owner,
        rilevanza: inv.rilevanza,
        lastContactDate: inv.last_contact_date,
        nextFollowUpDate: inv.next_follow_up_date,
        approvalStatus: inv.approval_status || 'pending',
        createdAt: inv.created_at,
        updatedAt: inv.updated_at,
        engagementScore: inv.engagement_score || 0,
        emailOpensCount: inv.email_opens_count || 0,
        emailResponsesCount: inv.email_responses_count || 0,
        meetingsCount: inv.meetings_count || 0,
        notesCount: inv.notes_count || 0,
      }));

      setInvestors(transformedInvestors);
      setLastDataUpdate(new Date());
      setLoadingInvestors(false);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Failed to load investors');
      setLoadingInvestors(false);
    }
  };

  const fetchCampaignStats = async () => {
    try {
      // Fetch campaign history
      const { data: campaigns, error: campaignsError } = await supabase
        .from('abc_email_campaign_history' as any)
        .select('*');

      if (campaignsError) throw campaignsError;

      // Fetch email opens
      const { data: opens, error: opensError } = await supabase
        .from('abc_email_opens' as any)
        .select('*');

      if (opensError) throw opensError;

      const totalCampaigns = campaigns?.length || 0;
      const totalEmailsSent = campaigns?.reduce((sum: number, c: any) => sum + (c.successful_sends || 0), 0) || 0;
      const totalOpens = opens?.length || 0;
      const successRate = totalCampaigns > 0 
        ? Math.round((campaigns?.reduce((sum: number, c: any) => sum + (c.successful_sends || 0), 0) / 
                     campaigns?.reduce((sum: number, c: any) => sum + (c.recipient_count || 0), 0)) * 100) || 0
        : 0;

      setCampaignStats({
        totalCampaigns,
        totalEmailsSent,
        totalOpens,
        successRate: isNaN(successRate) ? 0 : successRate,
      });
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  // KPI Data - calculated from real Supabase investor data
  const totalPipelineValue = investors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
  const closedInvestors = investors.filter(inv => inv.status === "Closed");
  const closedValue = closedInvestors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
  const meetingInvestors = investors.filter(inv => inv.status === "Meeting Scheduled" || inv.status === "In Negotiation");
  
  const kpis = {
    contacts: { current: investors.length, target: 352, percentage: Math.round((investors.length / 352) * 100) },
    meetings: { current: meetingInvestors.length, target: 20, percentage: Math.round((meetingInvestors.length / 20) * 100) },
    pipeline: { current: totalPipelineValue, target: 10000000, percentage: Math.round((totalPipelineValue / 10000000) * 100) },
    closed: { current: closedValue, target: 10000000, percentage: Math.round((closedValue / 10000000) * 100) }
  };

  // Recent Activity - updated with real investor names
  const recentActivity = [
    { investor: "Marco Boschetti (Family Office Italia)", action: "Meeting scheduled for Dec 10, 2024", time: "2 hours ago" },
    { investor: "Carlotta de Courten (Fondo Italiano SGR)", action: 'Email sent: "ABC Company Opportunity"', time: "5 hours ago" },
    { investor: "Patrizia Polonia (Fideuram Private Banking)", action: 'Note added: "Very interested, wants financials"', time: "1 day ago" },
    { investor: "Andrea Reale (Fondo Italiano SGR)", action: "Status changed: Contacted → Meeting", time: "2 days ago" }
  ];

  // Conversion Funnel Data - calculated from Supabase investor data
  const statusCounts = {
    total: investors.length,
    contacted: investors.filter(inv => ["Contacted", "Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    interested: investors.filter(inv => ["Interested", "Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    meetings: investors.filter(inv => ["Meeting Scheduled", "In Negotiation", "Closed"].includes(inv.status)).length,
    negotiation: investors.filter(inv => ["In Negotiation", "Closed"].includes(inv.status)).length,
    closed: investors.filter(inv => inv.status === "Closed").length
  };

  // Funnel data - always calculated from live investor data
  const funnelData = [
    { stage: "Contacts", count: statusCounts.total, percentage: 100 },
    { stage: "Contacted", count: statusCounts.contacted, percentage: statusCounts.total ? Math.round((statusCounts.contacted / statusCounts.total) * 100) : 0 },
    { stage: "Interested", count: statusCounts.interested, percentage: statusCounts.total ? Math.round((statusCounts.interested / statusCounts.total) * 100) : 0 },
    { stage: "Meetings", count: statusCounts.meetings, percentage: statusCounts.total ? Math.round((statusCounts.meetings / statusCounts.total) * 100) : 0 },
    { stage: "Negotiation", count: statusCounts.negotiation, percentage: statusCounts.total ? Math.round((statusCounts.negotiation / statusCounts.total) * 100) : 0 },
    { stage: "Closed", count: statusCounts.closed, percentage: statusCounts.total ? Math.round((statusCounts.closed / statusCounts.total) * 100) : 0 }
  ];

  const handleProgressUpdate = (newProgress: typeof progressData) => {
    setProgressData(newProgress);
    localStorage.setItem("abc-progress-data", JSON.stringify(newProgress));
  };

  const handleMeetingsUpdate = (newData: typeof meetingsKPI) => {
    setMeetingsKPI(newData);
    localStorage.setItem("abc-meetings-kpi", JSON.stringify(newData));
  };

  const handleClosedUpdate = (newData: typeof closedKPI) => {
    setClosedKPI(newData);
    localStorage.setItem("abc-closed-kpi", JSON.stringify(newData));
  };

  // Quick Actions handlers
  const handleAddNote = async () => {
    if (!selectedInvestorForAction || !noteText.trim()) {
      toast.error("Seleziona un investitore e inserisci una nota");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('abc_investor_notes')
        .insert({
          investor_name: selectedInvestorForAction.nome,
          note_text: noteText,
          created_by: sessionStorage.getItem('abc_console_email') || 'Admin'
        });
      
      if (error) throw error;
      
      toast.success(`Nota aggiunta per ${selectedInvestorForAction.nome}`);
      setShowAddNoteDialog(false);
      setNoteText("");
      setSelectedInvestorForAction(null);
    } catch (err) {
      toast.error("Errore nell'aggiungere la nota");
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!selectedInvestorForAction || !followUpData.date) {
      toast.error("Seleziona un investitore e una data");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('abc_investor_followups')
        .insert({
          investor_name: selectedInvestorForAction.nome,
          follow_up_date: followUpData.date,
          follow_up_type: followUpData.type,
          description: followUpData.description,
          created_by: sessionStorage.getItem('abc_console_email') || 'Admin'
        });
      
      if (error) throw error;
      
      toast.success(`Follow-up pianificato per ${selectedInvestorForAction.nome}`);
      setShowFollowUpDialog(false);
      setFollowUpData({ date: "", type: "call", description: "" });
      setSelectedInvestorForAction(null);
      fetchUpcomingFollowUps();
    } catch (err) {
      toast.error("Errore nel pianificare il follow-up");
    }
  };

  const handleExportPipeline = () => {
    const csvContent = [
      ["Nome", "Azienda", "Ruolo", "Categoria", "Status", "Pipeline Value", "Email", "Telefono", "Città", "Fonte"].join(","),
      ...investors.map(inv => [
        inv.nome,
        inv.azienda,
        inv.ruolo || "",
        inv.categoria,
        inv.status,
        inv.pipeline_value,
        inv.email || "",
        inv.phone || "",
        inv.citta || "",
        inv.fonte || ""
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `abc_pipeline_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Pipeline esportata con successo");
  };

  const handleExportApproved = () => {
    const approvedInvestors = investors.filter(inv => inv.approvalStatus === 'approved');
    
    if (approvedInvestors.length === 0) {
      toast.warning("Nessun investitore approvato da esportare");
      return;
    }

    // Escape function for CSV fields
    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Nome", "Azienda", "Ruolo", "Categoria", "Status", "Pipeline Value (EUR)", "Email", "Telefono", "Città", "LinkedIn"];
    
    const rows = approvedInvestors.map(inv => [
      escapeCSV(inv.nome),
      escapeCSV(inv.azienda),
      escapeCSV(inv.ruolo),
      escapeCSV(inv.categoria),
      escapeCSV(inv.status),
      escapeCSV(inv.pipeline_value),
      escapeCSV(inv.email),
      escapeCSV(inv.phone),
      escapeCSV(inv.citta),
      escapeCSV(inv.linkedin)
    ].join(";"));

    const csvContent = [headers.join(";"), ...rows].join("\n");
    
    // Add BOM for UTF-8 Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ABC_Investitori_Approvati_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success(`${approvedInvestors.length} investitori approvati esportati`);
  };

  const formatCurrency = (value: number) => {
    return `€${(value / 1000000).toFixed(1)}M`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-l-primary";
      case "medium": return "border-l-4 border-l-blue-500";
      case "low": return "border-l-4 border-l-muted";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      "to-contact": { label: "To Contact", color: "bg-muted text-muted-foreground" },
      "contacted": { label: "Contacted", color: "bg-blue-500/10 text-blue-600" },
      "interested": { label: "Interested", color: "bg-yellow-500/10 text-yellow-600" },
      "meeting": { label: "Meeting Scheduled", color: "bg-purple-500/10 text-purple-600" },
      "negotiation": { label: "In Negotiation", color: "bg-primary/10 text-primary" },
      "closed": { label: "Closed", color: "bg-green-500/10 text-green-600" },
      "not-interested": { label: "Not Interested", color: "bg-red-500/10 text-red-600" }
    };
    return statusMap[status] || statusMap["to-contact"];
  };

  const getFilteredInvestors = () => {
    return investors.filter(inv => {
      const matchesSearch = 
        inv.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.azienda?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || inv.categoria === filterCategory;
      const matchesSource = filterSource === "all" || inv.fonte === filterSource;
      
      return matchesSearch && matchesCategory && matchesSource;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ABC COMPANY FUNDRAISING CONSOLE</h1>
              <p className="text-sm text-muted-foreground">Target: €10,000,000 | Deadline: June 30, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <ImportABCInvestorsDialog onSuccess={(count) => {
                fetchInvestors();
                if (count > 0) {
                  setLastImportCount(count);
                  setShowImportAlert(true);
                  setShowDataQualityAlert(true);
                }
              }} />
              <OnlineUsersIndicator />
              <NotificationBell />
              <span className="text-sm text-muted-foreground">User: {currentUserEmail}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="commitments">Commitments</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="prospecting">Prospecting</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

            {/* Data Quality Alert - Shows when email/LinkedIn missing */}
            {showDataQualityAlert && (
              <ABCUnifiedEnrichment 
                showAfterImport={showImportAlert}
                importedCount={lastImportCount}
                onDismissImportAlert={() => {
                  setShowImportAlert(false);
                  setShowDataQualityAlert(false);
                }}
              />
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">CONTACTS</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{kpis.contacts.current}/{kpis.contacts.target}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.contacts.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <EditableKPI
                  title="Meetings"
                  data={meetingsKPI}
                  icon={Calendar}
                  onUpdate={handleMeetingsUpdate}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">PIPELINE</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.pipeline.current)}</div>
                    <p className="text-sm text-primary font-semibold">{kpis.pipeline.percentage}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <EditableKPI
                  title="Closed"
                  data={closedKPI}
                  icon={CheckCircle}
                  onUpdate={handleClosedUpdate}
                  formatter={formatCurrency}
                />
              </motion.div>
            </div>

            {/* Timeline Progress */}
            <Card>
              <CardHeader>
                <CardTitle>OVERALL PROGRESS</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableOverallProgress 
                  data={progressData}
                  onUpdate={handleProgressUpdate}
                />
              </CardContent>
            </Card>

            {/* Pipeline Velocity & Animated Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ABCPipelineVelocity investors={investors} />
              <ABCAnimatedFunnel investors={investors} />
            </div>

            {/* Auto Reminders */}
            <ABCAutoReminders 
              investors={investors.map(inv => ({
                ...inv,
                engagementScore: inv.engagementScore || 0,
              }))} 
              onSelectInvestor={(id) => {
                setActiveTab('investors');
                setEditInvestorId(id);
              }}
              onSendReminders={(reminders) => {
                setPendingReminders(reminders);
                setActiveTab('campaigns');
                toast.success(`${reminders.length} investitori pronti per campagna reminder`);
              }}
              onSelectTemplate={(subject, content, investorEmail) => {
                setActiveTab('campaigns');
                toast.info(`Template caricato per ${investorEmail}`);
              }}
              userEmail={currentUserEmail || "user@example.com"}
            />

            {/* Real-time Activity Feed */}
            <ABCActivityFeed />
          </TabsContent>

          {/* INVESTORS TAB */}
          <TabsContent value="investors" className="space-y-6">
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

            {/* Investor Management KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">To Contact</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'To Contact').length}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => ['Contacted', 'Interested', 'Meeting Scheduled'].includes(i.status)).length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Negotiation</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'In Negotiation').length}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Closed</p>
                        <p className="text-2xl font-bold text-foreground">
                          {investors.filter(i => i.status === 'Closed').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions & Upcoming Follow-ups */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setShowAddNoteDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setShowFollowUpDialog(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => toast.info("Email campaign coming soon")}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleExportPipeline}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Pipeline
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleExportApproved}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Export Approved
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Follow-ups */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Follow-ups (Next 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {upcomingFollowUps.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No follow-ups scheduled for the next 7 days
                      </p>
                    ) : (
                      upcomingFollowUps.map((followUp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{followUp.investor_name}</p>
                            <p className="text-xs text-muted-foreground">{followUp.follow_up_type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">
                              {new Date(followUp.follow_up_date).toLocaleDateString('it-IT', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {followUp.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Family Office">Family Office</SelectItem>
                    <SelectItem value="Istituzionale">Istituzionale</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Ricerca Esterna">Direct</SelectItem>
                    <SelectItem value="Network LinkedIn">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Kanban Board */}
            {loadingInvestors ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-pulse">
                    <p className="text-muted-foreground">Loading investors...</p>
                  </div>
                </CardContent>
              </Card>
            ) : investors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No investors found</p>
                  <p className="text-sm text-muted-foreground">Import investor data to get started</p>
                </CardContent>
              </Card>
            ) : (
              <ABCInvestorKanban
                investors={getFilteredInvestors()}
                onStatusChange={fetchInvestors}
                initialEditInvestorId={editInvestorId}
                onEditDialogClosed={() => setEditInvestorId(null)}
              />
            )}
          </TabsContent>

          {/* RELATIONSHIPS TAB - Affinity-style Relationship Intelligence */}
          <TabsContent value="relationships" className="space-y-6">
            <ABCRelationshipIntelligence 
              investors={investors.map(i => ({
                id: i.id,
                nome: i.nome,
                azienda: i.azienda,
                email: i.email,
                status: i.status,
                lastContactDate: i.lastContactDate,
                engagementScore: i.engagementScore,
                emailOpensCount: i.emailOpensCount,
                emailResponsesCount: i.emailResponsesCount,
                meetingsCount: i.meetingsCount,
                notesCount: i.notesCount,
                relationshipOwner: i.relationshipOwner,
                createdAt: i.createdAt,
                pipelineValue: i.pipelineValue,
                approvalStatus: i.approvalStatus,
              }))}
              onInvestorSelect={(id) => setEditInvestorId(id)}
            />
          </TabsContent>

          <TabsContent value="commitments" className="space-y-6">
            <ABCCommitmentTracker investors={investors.map(i => ({ id: i.id, nome: i.nome, azienda: i.azienda }))} />
          </TabsContent>

          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Campaign Stats Cards - Clickable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => { setStatsDialogType('campaigns'); setStatsDialogOpen(true); }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Campagne Inviate</p>
                      <p className="text-xl font-bold">{campaignStats.totalCampaigns}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => { setStatsDialogType('sent'); setStatsDialogOpen(true); }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Send className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Inviate</p>
                      <p className="text-xl font-bold">{campaignStats.totalEmailsSent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => { setStatsDialogType('opens'); setStatsDialogOpen(true); }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Eye className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aperture Totali</p>
                      <p className="text-xl font-bold">{campaignStats.totalOpens}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => { setStatsDialogType('success'); setStatsDialogOpen(true); }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasso Successo</p>
                      <p className="text-xl font-bold">{campaignStats.successRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Follow-up Sequences */}
            <ABCFollowUpSequences 
              key={`followup-seq-${dataRefreshKey}`}
              investors={investors.map(i => ({
                id: i.id,
                nome: i.nome,
                azienda: i.azienda,
                email: i.email,
                status: i.status,
                last_contact_date: i.lastContactDate,
              }))}
            />

            {/* Stats Dialog */}
            <ABCCampaignStatsDialog
              open={statsDialogOpen}
              onOpenChange={setStatsDialogOpen}
              statType={statsDialogType}
              onNavigateToInvestor={(id) => {
                setEditInvestorId(id);
                setActiveTab("investors");
              }}
            />

            <ABCEmailCampaignManager 
              key={`campaign-manager-${investors.filter(i => i.email).length}-${pendingReminders.length}-${lastDataUpdate?.getTime() || 0}-${dataRefreshKey}`}
              investors={investors.map(i => ({ 
                id: i.id, 
                nome: i.nome, 
                azienda: i.azienda, 
                email: i.email, 
                categoria: i.categoria, 
                status: i.status,
                approval_status: i.approvalStatus,
                ruolo: i.ruolo,
                citta: i.citta,
                pipeline_value: i.pipelineValue,
                last_contact_date: i.lastContactDate,
                engagement_score: i.engagementScore,
                linkedin: i.linkedin,
                fonte: i.fonte
              }))} 
              onInvestorsUpdated={fetchInvestors}
              pendingReminders={pendingReminders}
              onRemindersClear={() => setPendingReminders([])}
            />
          </TabsContent>

          {/* PROSPECTING TAB */}
          <TabsContent value="prospecting" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ABCEngagementScore 
                investors={investors.map(i => ({
                  id: i.id,
                  nome: i.nome,
                  azienda: i.azienda,
                  email: i.email,
                  status: i.status,
                  engagement_score: i.engagementScore,
                  email_opens_count: i.emailOpensCount,
                  email_responses_count: i.emailResponsesCount,
                  meetings_count: i.meetingsCount,
                  notes_count: i.notesCount,
                }))}
                onSelectInvestor={(id) => {
                  setEditInvestorId(id);
                  setActiveTab("investors");
                }}
              />
              <ABCEmailEnrichment onEmailUpdated={() => { fetchInvestors(); fetchCampaignStats(); }} />
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Live Data Indicator */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Dati live</span>
                <span className="text-foreground font-medium">
                  {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </span>
              </div>
            </div>

            <ABCAnalyticsTab investors={investors} />
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC COMPANY FUNDRAISING TIMELINE</CardTitle>
                <p className="text-sm text-muted-foreground">December 2024 → June 2026</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Phase Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {(() => {
                      // Start counting from Jan 7, 2026
                      const startDate = new Date('2026-01-07');
                      const today = new Date();
                      const now = today < startDate ? startDate : today;
                      const getDaysRemaining = (deadline: Date) => {
                        const diff = deadline.getTime() - now.getTime();
                        return Math.ceil(diff / (1000 * 60 * 60 * 24));
                      };
                      const phase1Deadline = new Date('2026-01-31');
                      const phase2Deadline = new Date('2026-03-31');
                      const phase3Deadline = new Date('2026-04-30');
                      const phase4Deadline = new Date('2026-05-31');
                      const phase5Deadline = new Date('2026-06-30');
                      const phase6Deadline = new Date('2026-06-30');

                      const CountdownBadge = ({ days }: { days: number }) => {
                        if (days < 0) return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">Completata</Badge>;
                        if (days <= 7) return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">{days}g rimanenti</Badge>;
                        if (days <= 30) return <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{days}g rimanenti</Badge>;
                        return <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">{days}g rimanenti</Badge>;
                      };

                      // Calcolo automatico Attention Required basato su performance vs target (soglia 80%)
                      const phase1Progress = 100; // Completata
                      const phase2Current = investors.filter(i => i.status === 'Meeting Scheduled' || i.status === 'In Negotiation' || i.status === 'Closed').length;
                      const phase2Target = 20;
                      const phase2Progress = (phase2Current / phase2Target) * 100;
                      
                      const phase3Current = investors.filter(i => i.status === 'Interested').length;
                      const phase3Target = 10;
                      const phase3Progress = (phase3Current / phase3Target) * 100;
                      
                      const phase4Current = investors.filter(i => i.status === 'In Negotiation').length;
                      const phase4Target = 5;
                      const phase4Progress = (phase4Current / phase4Target) * 100;
                      
                      const phase5Current = investors.filter(i => i.status === 'Closed').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
                      const phase5Target = 5000000;
                      const phase5Progress = (phase5Current / phase5Target) * 100;
                      
                      const phase6Current = investors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);
                      const phase6Target = 10000000;
                      const phase6Progress = (phase6Current / phase6Target) * 100;

                      const getExpectedProgress = (deadline: Date) => {
                        const start = new Date('2025-12-01');
                        const totalDuration = deadline.getTime() - start.getTime();
                        const elapsed = now.getTime() - start.getTime();
                        return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                      };

                      const needsAttention = (progress: number, deadline: Date) => {
                        const expected = getExpectedProgress(deadline);
                        const daysRemaining = getDaysRemaining(deadline);
                        // Alert se: sotto 80% del progresso atteso E non completata E deadline non passata
                        return daysRemaining > 0 && progress < (expected * 0.8);
                      };

                      const AttentionBadge = ({ show }: { show: boolean }) => {
                        if (!show) return null;
                        return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">⚠️ Attenzione</Badge>;
                      };

                      return (
                        <>
                          <Card className="border-2 border-green-500/20 bg-green-500/5">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 1: Outreach</CardTitle>
                                <div className="flex items-center gap-2">
                                  <CountdownBadge days={getDaysRemaining(phase1Deadline)} />
                                  <Badge className="bg-green-500 text-white">✅ DONE</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Dec 2025 - Jan 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: Contact {investors.length} high-priority investors</p>
                              <Progress value={100} className="h-2" />
                              <p className="text-sm font-semibold text-green-600">{investors.length}/{investors.length} contacts reached (100%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: January 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase2Progress, phase2Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-primary/20 bg-primary/5'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 2: Initial Meetings</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase2Progress, phase2Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase2Deadline)} />
                                  <Badge className="bg-primary">⏳ IN PROGRESS</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Feb 2026 - Mar 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: Schedule 20 meetings with interested investors</p>
                              <Progress value={Math.min(100, Math.round(phase2Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-primary">{phase2Current}/20 meetings scheduled ({Math.round(phase2Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: March 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase3Progress, phase3Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 3: Due Diligence</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase3Progress, phase3Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase3Deadline)} />
                                  <Badge variant="outline">{phase3Current > 0 ? '⏳ IN PROGRESS' : 'UPCOMING'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Mar 2026 - Apr 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: 10 interested investors in DD process</p>
                              <Progress value={Math.min(100, Math.round(phase3Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">{phase3Current}/10 in progress ({Math.round(phase3Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: April 30, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase4Progress, phase4Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 4: Negotiation</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase4Progress, phase4Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase4Deadline)} />
                                  <Badge variant="outline">{phase4Current > 0 ? '⏳ IN PROGRESS' : 'UPCOMING'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Apr 2026 - May 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: 5 active negotiations</p>
                              <Progress value={Math.min(100, Math.round(phase4Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">{phase4Current}/5 in negotiation ({Math.round(phase4Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: May 31, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase5Progress, phase5Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-muted'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 5: First Closing</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase5Progress, phase5Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase5Deadline)} />
                                  <Badge variant="outline">{phase5Current > 0 ? '⏳ IN PROGRESS' : 'TARGET'}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">May 2026 - Jun 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: €3-5M first closing</p>
                              <Progress value={Math.min(100, Math.round(phase5Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-foreground">€{(phase5Current / 1000000).toFixed(1)}M / €5M ({Math.round(phase5Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Deadline: June 30, 2026</p>
                            </CardContent>
                          </Card>

                          <Card className={`border-2 ${needsAttention(phase6Progress, phase6Deadline) ? 'border-red-500/40 bg-red-500/5' : 'border-accent/20 bg-accent/5'}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Phase 6: Final Closing</CardTitle>
                                <div className="flex items-center gap-2">
                                  <AttentionBadge show={needsAttention(phase6Progress, phase6Deadline)} />
                                  <CountdownBadge days={getDaysRemaining(phase6Deadline)} />
                                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/40">🎯 TARGET</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">Apr 2026 - Jun 2026</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-foreground">Target: €10M total fundraise</p>
                              <Progress value={Math.min(100, Math.round(phase6Progress))} className="h-2" />
                              <p className="text-sm font-semibold text-accent">€{(phase6Current / 1000000).toFixed(2)}M / €10M ({Math.round(phase6Progress)}%)</p>
                              <p className="text-xs text-muted-foreground">Final Deadline: June 30, 2026</p>
                              <div className="pt-2 border-t border-border/50 mt-2">
                                <p className="text-xs text-muted-foreground">Pipeline Summary:</p>
                                <p className="text-xs">• Closed: €{(investors.filter(i => i.status === 'Closed').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                                <p className="text-xs">• In Negotiation: €{(investors.filter(i => i.status === 'In Negotiation').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                                <p className="text-xs">• Interested: €{(investors.filter(i => i.status === 'Interested').reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0) / 1000000).toFixed(2)}M</p>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>

                  {/* Alerts */}
                  <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-5 w-5" />
                        ATTENTION REQUIRED
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-foreground">• {Math.max(0, 20 - investors.filter(i => i.status === 'Meeting Scheduled' || i.status === 'In Negotiation' || i.status === 'Closed').length)} meetings still needed to reach Phase 2 target</p>
                      <p className="text-sm text-foreground">• {investors.filter(i => i.status === 'To Contact' && i.approvalStatus === 'approved').length} approved investors to contact</p>
                      <p className="text-sm text-foreground">• {investors.filter(i => i.approvalStatus === 'pending').length} investors pending approval</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6">
            {(() => {
              // Fundraising period: Jan 7, 2026 - Jun 30, 2026
              const campaignStart = new Date(2026, 0, 7); // Jan 7, 2026
              const campaignEnd = new Date(2026, 5, 30); // Jun 30, 2026
              const today = new Date();
              const effectiveToday = today < campaignStart ? campaignStart : today;
              
              // Calculate current biweekly period (2-week intervals starting from campaign start)
              const msPerDay = 24 * 60 * 60 * 1000;
              const daysSinceStart = Math.floor((effectiveToday.getTime() - campaignStart.getTime()) / msPerDay);
              const currentPeriodIndex = Math.max(0, Math.floor(daysSinceStart / 14));
              
              const periodStart = new Date(campaignStart.getTime() + currentPeriodIndex * 14 * msPerDay);
              const periodEnd = new Date(periodStart.getTime() + 13 * msPerDay);
              
              // Calculate next report date (Monday after current period ends)
              const nextReportBase = new Date(periodEnd.getTime() + msPerDay);
              const daysUntilMonday = (8 - nextReportBase.getDay()) % 7 || 7;
              const nextReport = new Date(nextReportBase.getTime() + (daysUntilMonday - 1) * msPerDay);
              
              // Format dates
              const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const currentPeriodLabel = `${formatDate(periodStart)} - ${formatDate(periodEnd)}`;
              const nextReportLabel = formatDate(nextReport);
              
              // Calculate weeks remaining
              const weeksRemaining = Math.ceil((campaignEnd.getTime() - effectiveToday.getTime()) / (7 * msPerDay));
              
              return (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>BIWEEKLY REPORT</CardTitle>
                    <p className="text-sm text-muted-foreground">Campaign: January 7, 2026 → June 30, 2026 ({weeksRemaining > 0 ? `${weeksRemaining} weeks remaining` : 'Campaign ended'})</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Dati live</span>
                    <span className="text-foreground font-medium">
                      {lastDataUpdate ? lastDataUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Report Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Period:</span>
                        <span className="text-foreground">{currentPeriodLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="text-foreground">Every 2 weeks (Monday)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipients:</span>
                        <span className="text-foreground">edoardo.grigione@aries76.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="text-foreground">PDF + Dashboard Link</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Report:</span>
                        <span className="text-primary font-semibold">{nextReportLabel}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="gap-2" onClick={() => {
                        const reportData = {
                          period: currentPeriodLabel,
                          totalInvestors: investors.length,
                          byStatus: statusCounts,
                          totalPipeline: totalPipelineValue,
                          closedValue: closedValue,
                          topInvestors: [...investors]
                            .sort((a, b) => (b.pipelineValue || 0) - (a.pipelineValue || 0))
                            .slice(0, 5)
                        };
                        
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>ABC Company Fundraising Report</title>
                                <style>
                                  body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                                  h1 { color: #1a2332; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
                                  h2 { color: #1a2332; margin-top: 30px; }
                                  .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                                  .metric-value { font-weight: bold; color: #ff6b35; }
                                  .investor { padding: 10px; margin: 10px 0; background: #f5f5f5; border-radius: 8px; }
                                  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
                                </style>
                              </head>
                              <body>
                                <h1>ABC Company Capital Raise Report</h1>
                                <p>Period: ${reportData.period}</p>
                                <p>Generated: ${new Date().toLocaleDateString('it-IT')}</p>
                                
                                <h2>Pipeline Summary</h2>
                                <div class="metric"><span>Total Investors</span><span class="metric-value">${reportData.totalInvestors}</span></div>
                                <div class="metric"><span>Total Pipeline Value</span><span class="metric-value">€${(reportData.totalPipeline / 1000000).toFixed(2)}M</span></div>
                                <div class="metric"><span>Closed Value</span><span class="metric-value">€${(reportData.closedValue / 1000000).toFixed(2)}M</span></div>
                                
                                <h2>Status Breakdown</h2>
                                <div class="metric"><span>Total Contacts</span><span class="metric-value">${reportData.byStatus.total}</span></div>
                                <div class="metric"><span>Contacted</span><span class="metric-value">${reportData.byStatus.contacted}</span></div>
                                <div class="metric"><span>Interested</span><span class="metric-value">${reportData.byStatus.interested}</span></div>
                                <div class="metric"><span>Meeting Scheduled</span><span class="metric-value">${reportData.byStatus.meetings}</span></div>
                                <div class="metric"><span>In Negotiation</span><span class="metric-value">${reportData.byStatus.negotiation}</span></div>
                                <div class="metric"><span>Closed</span><span class="metric-value">${reportData.byStatus.closed}</span></div>
                                
                                <h2>Top 5 Investors by Pipeline Value</h2>
                                ${reportData.topInvestors.map((inv, i) => `
                                  <div class="investor">
                                    <strong>${i + 1}. ${inv.nome}</strong><br/>
                                    <span>${inv.azienda} - €${((inv.pipelineValue || 0) / 1000).toFixed(0)}K</span>
                                  </div>
                                `).join('')}
                                
                                <div class="footer">
                                  <p>ARIES76 Capital Intelligence | ABC Company Fundraising Console</p>
                                </div>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }
                        toast.success("Report generated successfully");
                      }}>
                        <FileText className="h-4 w-4" />
                        Generate Report Now
                      </Button>
                      <Button variant="outline">Edit Settings</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Current Status (Live)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.meetings > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.meetings} meeting{statusCounts.meetings !== 1 ? 's' : ''} scheduled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.negotiation > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.negotiation} investor{statusCounts.negotiation !== 1 ? 's' : ''} in negotiation phase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${closedValue > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>€{(closedValue / 1000).toFixed(0)}K total closed commitments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.interested > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.interested} interested investor{statusCounts.interested !== 1 ? 's' : ''} in DD</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${statusCounts.contacted > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{statusCounts.contacted} investor{statusCounts.contacted !== 1 ? 's' : ''} contacted</span>
                      </li>
                    </ul>
                    
                    <div className="pt-4 border-t border-border/50">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-2">CONVERSION FUNNEL</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>To Contact → Contacted:</span>
                          <span className="font-semibold">{statusCounts.total > 0 ? Math.round((statusCounts.contacted / statusCounts.total) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contacted → Interested:</span>
                          <span className="font-semibold">{statusCounts.contacted > 0 ? Math.round((statusCounts.interested / statusCounts.contacted) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interested → Negotiation:</span>
                          <span className="font-semibold">{statusCounts.interested > 0 ? Math.round((statusCounts.negotiation / statusCounts.interested) * 100) : 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Negotiation → Closed:</span>
                          <span className="font-semibold">{statusCounts.negotiation > 0 ? Math.round((statusCounts.closed / statusCounts.negotiation) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Three Action-Oriented Sections */}
                  <div className="border-t border-border pt-6 grid md:grid-cols-3 gap-6">
                    
                    {/* 1. Hot Opportunities - Closest to Close */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                        <h4 className="font-semibold text-foreground">Hot Opportunities</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Probability ≥70% + recent activity</p>
                      <div className="space-y-2">
                        {(() => {
                          const hotOpportunities = investors
                            .filter(inv => {
                              const prob = inv.probability || 50;
                              const lastContact = inv.lastContactDate ? new Date(inv.lastContactDate) : null;
                              const daysSinceContact = lastContact 
                                ? Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
                                : 999;
                              const isActive = ["Interested", "Meeting Scheduled", "In Negotiation"].includes(inv.status);
                              return prob >= 70 && daysSinceContact <= 14 && isActive;
                            })
                            .sort((a, b) => (b.probability || 50) - (a.probability || 50))
                            .slice(0, 4);
                          
                          if (hotOpportunities.length === 0) {
                            return (
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">No hot opportunities yet</p>
                                <p className="text-xs text-muted-foreground mt-1">Move investors to active stages with high probability</p>
                              </div>
                            );
                          }
                          
                          return hotOpportunities.map((inv, idx) => (
                            <div 
                              key={inv.id}
                              className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors"
                              onClick={() => {
                                setEditInvestorId(inv.id);
                                setActiveTab('investors');
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{inv.nome}</p>
                                  <p className="text-xs text-muted-foreground truncate">{inv.azienda}</p>
                                </div>
                                <Badge variant="outline" className="text-xs ml-2 shrink-0 border-orange-500/50 text-orange-600">
                                  {inv.probability}%
                                </Badge>
                              </div>
                              <div className="flex justify-between mt-1.5 text-xs">
                                <span className="text-muted-foreground">{inv.status}</span>
                                <span className="font-medium text-primary">{formatCurrency(inv.pipelineValue || 0)}</span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* 4. Most Engaged Prospects */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <h4 className="font-semibold text-foreground">Most Engaged</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Highest engagement scores</p>
                      <div className="space-y-2">
                        {(() => {
                          const engaged = investors
                            .filter(inv => (inv.engagementScore || 0) > 0)
                            .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
                            .slice(0, 4);
                          
                          if (engaged.length === 0) {
                            return (
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">No engagement data yet</p>
                                <p className="text-xs text-muted-foreground mt-1">Send campaigns to track engagement</p>
                              </div>
                            );
                          }
                          
                          return engaged.map((inv) => (
                            <div 
                              key={inv.id}
                              className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors"
                              onClick={() => {
                                setEditInvestorId(inv.id);
                                setActiveTab('investors');
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{inv.nome}</p>
                                  <p className="text-xs text-muted-foreground truncate">{inv.azienda}</p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500 rounded-full" 
                                      style={{ width: `${inv.engagementScore || 0}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-blue-600">{inv.engagementScore || 0}</span>
                                </div>
                              </div>
                              <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                                <span>Opens: {inv.emailOpensCount || 0}</span>
                                <span>Responses: {inv.emailResponsesCount || 0}</span>
                                <span>Meetings: {inv.meetingsCount || 0}</span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* 5. Overdue Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <h4 className="font-semibold text-foreground">Overdue Actions</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                      <div className="space-y-2">
                        {(() => {
                          const now = new Date();
                          const overdue = investors
                            .filter(inv => {
                              // Check for overdue follow-ups
                              if (inv.nextFollowUpDate) {
                                const followUp = new Date(inv.nextFollowUpDate);
                                if (followUp < now) return true;
                              }
                              // Check for stale active investors (no contact in 14+ days)
                              if (["Contacted", "Interested", "Meeting Scheduled", "In Negotiation"].includes(inv.status)) {
                                const lastContact = inv.lastContactDate ? new Date(inv.lastContactDate) : null;
                                if (!lastContact) return true;
                                const daysSince = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
                                if (daysSince >= 14) return true;
                              }
                              return false;
                            })
                            .map(inv => {
                              const lastContact = inv.lastContactDate ? new Date(inv.lastContactDate) : null;
                              const daysSince = lastContact 
                                ? Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
                                : null;
                              const hasOverdueFollowUp = inv.nextFollowUpDate && new Date(inv.nextFollowUpDate) < now;
                              const followUpDaysOverdue = inv.nextFollowUpDate 
                                ? Math.floor((now.getTime() - new Date(inv.nextFollowUpDate).getTime()) / (1000 * 60 * 60 * 24))
                                : null;
                              return { ...inv, daysSince, hasOverdueFollowUp, followUpDaysOverdue };
                            })
                            .sort((a, b) => {
                              // Prioritize overdue follow-ups, then by days since contact
                              if (a.hasOverdueFollowUp && !b.hasOverdueFollowUp) return -1;
                              if (!a.hasOverdueFollowUp && b.hasOverdueFollowUp) return 1;
                              return (b.daysSince || 0) - (a.daysSince || 0);
                            })
                            .slice(0, 4);
                          
                          if (overdue.length === 0) {
                            return (
                              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                <p className="text-xs text-green-600 font-medium">All caught up!</p>
                                <p className="text-xs text-muted-foreground mt-1">No overdue actions</p>
                              </div>
                            );
                          }
                          
                          return overdue.map((inv) => (
                            <div 
                              key={inv.id}
                              className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors"
                              onClick={() => {
                                setEditInvestorId(inv.id);
                                setActiveTab('investors');
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{inv.nome}</p>
                                  <p className="text-xs text-muted-foreground truncate">{inv.azienda}</p>
                                </div>
                                {inv.hasOverdueFollowUp ? (
                                  <Badge variant="destructive" className="text-xs ml-2 shrink-0">
                                    +{inv.followUpDaysOverdue}d
                                  </Badge>
                                ) : inv.daysSince !== null ? (
                                  <Badge variant="destructive" className="text-xs ml-2 shrink-0">
                                    {inv.daysSince}d ago
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs ml-2 shrink-0 border-red-500/50 text-red-600">
                                    Mai
                                  </Badge>
                                )}
                              </div>
                              <div className="flex justify-between mt-1.5 text-xs">
                                <span className="text-red-600">
                                  {inv.hasOverdueFollowUp ? '⏰ Follow-up scaduto' : '📭 Nessun contatto recente'}
                                </span>
                                <span className="text-muted-foreground">{inv.status}</span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => {
                    const doc = new jsPDF();
                    const pageWidth = doc.internal.pageSize.getWidth();
                    
                    // Header
                    doc.setFontSize(20);
                    doc.setTextColor(26, 35, 50);
                    doc.text("ABC Company Capital Raise Report", pageWidth / 2, 20, { align: "center" });
                    
                    // Period
                    doc.setFontSize(12);
                    doc.setTextColor(100);
                    doc.text(`Period: ${currentPeriodLabel}`, pageWidth / 2, 30, { align: "center" });
                    doc.text(`Generated: ${new Date().toLocaleDateString('it-IT')}`, pageWidth / 2, 36, { align: "center" });
                    
                    // Orange line
                    doc.setDrawColor(255, 107, 53);
                    doc.setLineWidth(1);
                    doc.line(20, 42, pageWidth - 20, 42);
                    
                    // Pipeline Summary
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Pipeline Summary", 20, 55);
                    
                    doc.setFontSize(11);
                    doc.setTextColor(60);
                    let yPos = 65;
                    const metrics = [
                      ["Total Investors", `${investors.length}`],
                      ["Total Pipeline Value", `€${(totalPipelineValue / 1000000).toFixed(2)}M`],
                      ["Closed Value", `€${(closedValue / 1000000).toFixed(2)}M`],
                    ];
                    metrics.forEach(([label, value]) => {
                      doc.text(label, 25, yPos);
                      doc.setTextColor(255, 107, 53);
                      doc.text(value, pageWidth - 25, yPos, { align: "right" });
                      doc.setTextColor(60);
                      yPos += 8;
                    });
                    
                    // Status Breakdown
                    yPos += 5;
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Status Breakdown", 20, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(11);
                    doc.setTextColor(60);
                    const statuses = [
                      ["Total Contacts", `${statusCounts.total}`],
                      ["Contacted", `${statusCounts.contacted}`],
                      ["Interested", `${statusCounts.interested}`],
                      ["Meeting Scheduled", `${statusCounts.meetings}`],
                      ["In Negotiation", `${statusCounts.negotiation}`],
                      ["Closed", `${statusCounts.closed}`],
                    ];
                    statuses.forEach(([label, value]) => {
                      doc.text(label, 25, yPos);
                      doc.setTextColor(255, 107, 53);
                      doc.text(value, pageWidth - 25, yPos, { align: "right" });
                      doc.setTextColor(60);
                      yPos += 8;
                    });
                    
                    // Top Investors
                    yPos += 5;
                    doc.setFontSize(14);
                    doc.setTextColor(26, 35, 50);
                    doc.text("Top 5 Investors by Pipeline Value", 20, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(10);
                    const topInvestors = [...investors]
                      .sort((a, b) => (b.pipelineValue || 0) - (a.pipelineValue || 0))
                      .slice(0, 5);
                    topInvestors.forEach((inv, i) => {
                      doc.setTextColor(26, 35, 50);
                      doc.text(`${i + 1}. ${inv.nome}`, 25, yPos);
                      doc.setTextColor(100);
                      doc.text(`${inv.azienda}`, 25, yPos + 5);
                      doc.setTextColor(255, 107, 53);
                      doc.text(`€${((inv.pipelineValue || 0) / 1000).toFixed(0)}K`, pageWidth - 25, yPos, { align: "right" });
                      yPos += 14;
                    });
                    
                    // Footer
                    doc.setFontSize(9);
                    doc.setTextColor(150);
                    doc.text("ARIES76 Capital Intelligence | ABC Company Fundraising Console", pageWidth / 2, 285, { align: "center" });
                    
                    doc.save(`ABC_Company_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                    toast.success("PDF downloaded successfully");
                  }}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Dashboard link copied to clipboard");
                  }}>
                    <Share2 className="h-4 w-4" />
                    Share Dashboard Link
                  </Button>
                </div>
              </CardContent>
            </Card>
              );
            })()}
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <ABCSettingsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleziona Investitore</Label>
              <Select 
                value={selectedInvestorForAction?.id || ""} 
                onValueChange={(val) => setSelectedInvestorForAction(investors.find(i => i.id === val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona investitore..." />
                </SelectTrigger>
                <SelectContent>
                  {investors.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.nome} - {inv.azienda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nota</Label>
              <Textarea 
                placeholder="Inserisci la nota..." 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleAddNote} className="w-full">
              Salva Nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pianifica Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleziona Investitore</Label>
              <Select 
                value={selectedInvestorForAction?.id || ""} 
                onValueChange={(val) => setSelectedInvestorForAction(investors.find(i => i.id === val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona investitore..." />
                </SelectTrigger>
                <SelectContent>
                  {investors.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.nome} - {inv.azienda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input 
                type="date" 
                value={followUpData.date}
                onChange={(e) => setFollowUpData({...followUpData, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select 
                value={followUpData.type} 
                onValueChange={(val) => setFollowUpData({...followUpData, type: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Chiamata</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="presentation">Presentazione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrizione (opzionale)</Label>
              <Textarea 
                placeholder="Note aggiuntive..." 
                value={followUpData.description}
                onChange={(e) => setFollowUpData({...followUpData, description: e.target.value})}
                rows={2}
              />
            </div>
            <Button onClick={handleScheduleFollowUp} className="w-full">
              Pianifica Follow-up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap with ABCDataProvider
const ABCCompanyConsoleWithProvider = () => (
  <ABCDataProvider>
    <ABCCompanyConsole />
  </ABCDataProvider>
);

export default ABCCompanyConsoleWithProvider;
