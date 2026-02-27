import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CRMSidebar } from "@/components/personal-crm/CRMSidebar";
import { CRMContactHub } from "@/components/personal-crm/CRMContactHub";
import { CRMDealPipeline } from "@/components/personal-crm/CRMDealPipeline";
import { CRMOutreach } from "@/components/personal-crm/CRMOutreach";
import { CRMDashboardOverview } from "@/components/personal-crm/CRMDashboardOverview";

export default function PersonalCRM() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data } = await supabase.rpc("get_current_user_role");
      if (data === "admin") {
        setAuthorized(true);
      } else {
        navigate("/");
      }
      setChecking(false);
    };
    checkAccess();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verifying access...</div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full pt-16">
        <CRMSidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-background/95 backdrop-blur sticky top-16 z-10">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-sm font-semibold text-foreground">
              {activeView === "overview" && "Dashboard"}
              {activeView === "contacts" && "Contact Hub"}
              {activeView === "pipeline" && "Deal Pipeline"}
              {activeView === "outreach" && "Outreach Engine"}
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {activeView === "overview" && <CRMDashboardOverview onNavigate={setActiveView} />}
            {activeView === "contacts" && <CRMContactHub />}
            {activeView === "pipeline" && <CRMDealPipeline />}
            {activeView === "outreach" && <CRMOutreach />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
