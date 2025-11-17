import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContentDistribution } from "@/components/ContentDistribution";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, CheckCircle, XCircle, Activity } from "lucide-react";

interface DistributionLog {
  id: string;
  content_title: string;
  content_url: string;
  platform: string;
  status: string;
  distributed_at: string;
}

const DistributionDashboard = () => {
  const [logs, setLogs] = useState<DistributionLog[]>([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const { data, error } = await supabase
      .from("distribution_logs")
      .select("*")
      .order("distributed_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error loading logs:", error);
      return;
    }

    setLogs(data || []);
    
    // Calculate stats
    const successful = data?.filter(log => log.status === 'sent').length || 0;
    const failed = data?.filter(log => log.status === 'failed').length || 0;
    setStats({
      total: data?.length || 0,
      successful,
      failed
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Distribution Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and configure automatic content distribution
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Distributions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Successful</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration */}
          <ContentDistribution />

          {/* Distribution Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Distribution History
              </CardTitle>
              <CardDescription>Recent content distributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No distributions yet. Configure your webhook and share content to get started.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {log.status === 'sent' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{log.content_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.distributed_at).toLocaleString()} • {log.platform}
                        </p>
                        <a
                          href={log.content_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {log.content_url}
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DistributionDashboard;
