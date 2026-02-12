import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Terminal, FileJson, Shield } from "lucide-react";
import TableBrowser from "@/components/admin-database/TableBrowser";
import SqlConsole from "@/components/admin-database/SqlConsole";
import ApiDocs from "@/components/admin-database/ApiDocs";

export default function AdminDatabase() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      // Check admin role using the security definer function
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
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Global Database</h1>
              <p className="text-sm text-muted-foreground">Admin panel • Browse, query, and manage your data</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Admin access
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tables" className="gap-1.5">
              <Database className="h-3.5 w-3.5" /> Tables
            </TabsTrigger>
            <TabsTrigger value="console" className="gap-1.5">
              <Terminal className="h-3.5 w-3.5" /> SQL Console
            </TabsTrigger>
            <TabsTrigger value="api-docs" className="gap-1.5">
              <FileJson className="h-3.5 w-3.5" /> API Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <TableBrowser />
          </TabsContent>

          <TabsContent value="console">
            <SqlConsole />
          </TabsContent>

          <TabsContent value="api-docs">
            <ApiDocs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
