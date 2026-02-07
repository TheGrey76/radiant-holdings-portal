import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  BarChart3,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  Plus,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import SwingPortfolioTable from "@/components/swing/SwingPortfolioTable";
import {
  useSwingReports,
  useUploadReport,
  useSwingPositions,
  useSwingUploadTokens,
  useCreateUploadToken,
  type SwingReport as SwingReportType,
} from "@/hooks/useSwingData";

export default function SwingReport() {
  const { data: reports = [], isLoading: reportsLoading } = useSwingReports();
  const { data: positions = [], isLoading: positionsLoading } = useSwingPositions(false);
  const { data: tokens = [] } = useSwingUploadTokens();
  const uploadReport = useUploadReport();
  const createToken = useCreateUploadToken();

  const [viewingReport, setViewingReport] = useState<SwingReportType | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [tokenLabel, setTokenLabel] = useState("");
  const [tokenEmail, setTokenEmail] = useState("info@aries76.com");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        uploadReport.mutate({ content, fileName: file.name });
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [uploadReport]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        uploadReport.mutate({ content, fileName: file.name });
      };
      reader.readAsText(file);
    },
    [uploadReport]
  );

  const copyUploadLink = (token: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/swingreport/upload?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    toast.success("Link copiato!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCreateToken = () => {
    if (!tokenLabel.trim()) {
      toast.error("Inserisci un'etichetta");
      return;
    }
    createToken.mutate(
      { label: tokenLabel, notification_email: tokenEmail },
      {
        onSuccess: () => {
          setShowTokenDialog(false);
          setTokenLabel("");
        },
      }
    );
  };

  const activePositions = positions.filter((p) => p.is_active);
  const closedPositions = positions.filter((p) => !p.is_active);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            📊 Swing Trading Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestione report, portafoglio live e tracking P&L
          </p>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList>
            <TabsTrigger value="portfolio" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Portafoglio
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Report
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Link Upload
            </TabsTrigger>
          </TabsList>

          {/* ===== PORTFOLIO TAB ===== */}
          <TabsContent value="portfolio">
            {positionsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-8">
                {activePositions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Posizioni Attive
                    </h2>
                    <SwingPortfolioTable positions={activePositions} />
                  </div>
                )}
                {closedPositions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                      Posizioni Chiuse
                    </h2>
                    <SwingPortfolioTable positions={closedPositions} />
                  </div>
                )}
                {positions.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Nessuna posizione nel portafoglio.</p>
                      <p className="text-sm mt-1">
                        Carica un report nella tab "Report" per iniziare.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* ===== REPORTS TAB ===== */}
          <TabsContent value="reports" className="space-y-6">
            {/* Upload zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carica Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt,.markdown"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {uploadReport.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Elaborazione report...</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Trascina il file .md qui o clicca per selezionare
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reports list */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Report Caricati</h2>
              {reportsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : reports.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  Nessun report caricato.
                </p>
              ) : (
                reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {report.client_name}
                            </span>
                            {report.week_range && (
                              <Badge variant="secondary" className="text-xs">
                                {report.week_range}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {report.uploaded_by}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            {report.capital && (
                              <span>
                                Capitale: $
                                {report.capital.toLocaleString()}
                              </span>
                            )}
                            {report.risk_profile && (
                              <span>{report.risk_profile}</span>
                            )}
                            {report.sectors?.length > 0 && (
                              <span>{report.sectors.join(", ")}</span>
                            )}
                            <span>
                              {new Date(report.created_at).toLocaleDateString(
                                "it-IT"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedReport(
                                expandedReport === report.id
                                  ? null
                                  : report.id
                              )
                            }
                          >
                            {expandedReport === report.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {expandedReport === report.id && (
                        <ScrollArea className="mt-4 h-96 rounded border p-4">
                          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                            {report.raw_content}
                          </pre>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* ===== UPLOAD LINKS TAB ===== */}
          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Link di Upload Esterni
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowTokenDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nuovo Link
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Genera link per permettere a collaboratori esterni di caricare
                  report. Riceverai una notifica email ad ogni upload.
                </p>

                {tokens.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">
                    Nessun link creato.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tokens.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{t.label}</span>
                            <Badge
                              variant={t.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {t.is_active ? "Attivo" : "Disattivo"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Notifiche → {t.notification_email}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyUploadLink(t.token)}
                        >
                          {copiedToken === t.token ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          Copia Link
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Token Dialog */}
            <Dialog
              open={showTokenDialog}
              onOpenChange={setShowTokenDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea Link di Upload</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Etichetta (es. nome collaboratore)</Label>
                    <Input
                      value={tokenLabel}
                      onChange={(e) => setTokenLabel(e.target.value)}
                      placeholder="es. Julio"
                    />
                  </div>
                  <div>
                    <Label>Email per notifiche</Label>
                    <Input
                      type="email"
                      value={tokenEmail}
                      onChange={(e) => setTokenEmail(e.target.value)}
                      placeholder="info@aries76.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowTokenDialog(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    onClick={handleCreateToken}
                    disabled={createToken.isPending}
                  >
                    {createToken.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : null}
                    Crea
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
