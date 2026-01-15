import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Twitter, Bitcoin, Send, Newspaper, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface XPostLog {
  id: string;
  created_at: string | null;
  content_type: string | null;
  content: string;
  tweet_id: string | null;
  status: string | null;
  error_message: string | null;
  posted_at: string | null;
}

interface BitcoinUpdateLog {
  id: number;
  update_timestamp: string;
  status: string | null;
  bitcoin_data_updated: boolean | null;
  macro_data_updated: boolean | null;
  model_updated: boolean | null;
  error_message: string | null;
}

interface TelegramLog {
  id: string;
  created_at: string;
  publication_type: string;
  status: string;
  telegram_message_id: string | null;
  message_content: string | null;
  published_at: string;
}

interface DistributionLog {
  id: string;
  distributed_at: string | null;
  platform: string;
  content_title: string;
  status: string | null;
}

export default function AutomationMonitor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [xPosts, setXPosts] = useState<XPostLog[]>([]);
  const [bitcoinUpdates, setBitcoinUpdates] = useState<BitcoinUpdateLog[]>([]);
  const [telegramLogs, setTelegramLogs] = useState<TelegramLog[]>([]);
  const [distributionLogs, setDistributionLogs] = useState<DistributionLog[]>([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const { data: roleData } = await supabase.rpc('get_current_user_role');
    if (roleData !== 'admin') {
      toast.error("Accesso non autorizzato");
      navigate("/");
      return;
    }
    
    fetchAllData();
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchXPosts(),
      fetchBitcoinUpdates(),
      fetchTelegramLogs(),
      fetchDistributionLogs()
    ]);
    setLoading(false);
  };

  const fetchXPosts = async () => {
    const { data } = await supabase
      .from("x_post_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setXPosts(data);
  };

  const fetchBitcoinUpdates = async () => {
    const { data } = await supabase
      .from("bitcoin_report_updates_log")
      .select("*")
      .order("update_timestamp", { ascending: false })
      .limit(50);
    if (data) setBitcoinUpdates(data);
  };

  const fetchTelegramLogs = async () => {
    const { data } = await supabase
      .from("telegram_publication_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setTelegramLogs(data);
  };

  const fetchDistributionLogs = async () => {
    const { data } = await supabase
      .from("distribution_logs")
      .select("*")
      .order("distributed_at", { ascending: false })
      .limit(50);
    if (data) setDistributionLogs(data);
  };

  const getStatusBadge = (success: boolean | null | string) => {
    if (success === true || success === "success" || success === "published") {
      return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
    }
    if (success === false || success === "error" || success === "failed") {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    }
    return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  // Calculate stats
  const xPostsToday = xPosts.filter(p => 
    p.created_at && new Date(p.created_at).toDateString() === new Date().toDateString()
  ).length;
  const xPostsSuccess = xPosts.filter(p => p.status === 'published' || p.status === 'success').length;
  const bitcoinUpdatesToday = bitcoinUpdates.filter(u =>
    new Date(u.update_timestamp).toDateString() === new Date().toDateString()
  ).length;
  const lastBitcoinUpdate = bitcoinUpdates[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Automation Monitor</h1>
            <p className="text-muted-foreground">Panoramica di tutti gli automatismi attivi</p>
          </div>
          <Button onClick={fetchAllData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                X Posts Oggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{xPostsToday}</div>
              <p className="text-xs text-muted-foreground">
                {xPostsSuccess}/{xPosts.length} totali con successo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bitcoin className="w-4 h-4 text-orange-400" />
                Bitcoin Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bitcoinUpdatesToday}</div>
              <p className="text-xs text-muted-foreground">
                Ultimo: {lastBitcoinUpdate ? format(new Date(lastBitcoinUpdate.update_timestamp), "dd/MM HH:mm") : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                Telegram Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{telegramLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Totale pubblicazioni
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-purple-400" />
                Content Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Contenuti distribuiti
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs with Logs */}
        <Tabs defaultValue="x-posts" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="x-posts">X Auto-Post</TabsTrigger>
            <TabsTrigger value="bitcoin">Bitcoin Updates</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="x-posts">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Log X Auto-Post (ogni 2 ore)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contenuto</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {xPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="text-muted-foreground">
                          {post.created_at ? format(new Date(post.created_at), "dd/MM/yyyy HH:mm") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.content_type || "unknown"}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {post.content?.substring(0, 100)}...
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitcoin">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Log Aggiornamenti Bitcoin Report (ogni giorno alle 6:00)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Bitcoin Data</TableHead>
                      <TableHead>Macro Data</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bitcoinUpdates.map((update) => (
                      <TableRow key={update.id}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(update.update_timestamp), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{getStatusBadge(update.bitcoin_data_updated)}</TableCell>
                        <TableCell>{getStatusBadge(update.macro_data_updated)}</TableCell>
                        <TableCell>{getStatusBadge(update.model_updated)}</TableCell>
                        <TableCell>{getStatusBadge(update.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telegram">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Log Pubblicazioni Telegram</CardTitle>
              </CardHeader>
              <CardContent>
                {telegramLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nessuna pubblicazione Telegram registrata</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Message ID</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telegramLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(log.created_at), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.publication_type}</Badge>
                          </TableCell>
                          <TableCell>{log.telegram_message_id || "-"}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Log Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {distributionLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nessuna distribuzione registrata</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Piattaforma</TableHead>
                        <TableHead>Contenuto</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributionLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">
                            {log.distributed_at ? format(new Date(log.distributed_at), "dd/MM/yyyy HH:mm") : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.platform}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">{log.content_title}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
