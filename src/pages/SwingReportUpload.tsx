import { useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SwingReportUpload() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) processFile(droppedFile);
    },
    []
  );

  const processFile = (f: File) => {
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      // Try to extract client name from content
      const clientMatch = text.match(/\*\*Cliente:\*\*\s*(.+)/);
      if (clientMatch) setClientName(clientMatch[1].trim());
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!content.trim()) {
      toast.error("Nessun contenuto da caricare");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (token) {
        // External upload via edge function
        const { data, error: fnError } = await supabase.functions.invoke(
          "swing-report-upload",
          {
            body: {
              token,
              content,
              file_name: file?.name || "report.md",
              client_name: clientName || "Unknown",
            },
          }
        );

        if (fnError) throw new Error(fnError.message);
        if (data?.error) throw new Error(data.error);

        setSuccess(true);
        toast.success(
          `Report caricato con ${data.positions_count} posizioni`
        );
      } else {
        toast.error("Token di upload mancante");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore sconosciuto";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold">Link non valido</h2>
            <p className="text-muted-foreground mt-2">
              Questo link di upload non contiene un token valido. Contatta
              l'amministratore per ricevere un link corretto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold">Report Caricato</h2>
            <p className="text-muted-foreground mt-2">
              Il report è stato caricato con successo. L'amministratore è stato
              notificato via email.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setSuccess(false);
                setContent("");
                setFile(null);
                setClientName("");
              }}
            >
              Carica un altro report
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Swing Report
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Carica il file .md del report di swing trading
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.markdown"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) processFile(f);
              }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
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

          {/* Client name override */}
          <div>
            <label className="text-sm font-medium">Nome Cliente</label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Estratto automaticamente dal report"
            />
          </div>

          {/* Preview */}
          {content && (
            <div>
              <label className="text-sm font-medium">Anteprima</label>
              <Textarea
                value={content.substring(0, 2000) + (content.length > 2000 ? "\n\n... (troncato)" : "")}
                readOnly
                className="h-40 font-mono text-xs"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!content || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Caricamento...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Carica Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
