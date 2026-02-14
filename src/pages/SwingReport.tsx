import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, LogOut, Archive } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SwingPortfolioTable from "@/components/swing/SwingPortfolioTable";
import {
  useSwingPositions,
  useUploadReport,
  useArchiveClosedPositions,
} from "@/hooks/useSwingData";

export default function SwingReport() {
  const { data: positions = [], isLoading: positionsLoading } = useSwingPositions(false);
  const uploadReport = useUploadReport();
  const archiveClosed = useArchiveClosedPositions();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".json")) {
        toast.error("Solo file JSON supportati");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        try {
          const jsonData = JSON.parse(content);
          uploadReport.mutate({ content, fileName: file.name, isJson: true, jsonData });
        } catch {
          toast.error("File JSON non valido");
        }
      };
      reader.readAsText(file);
    },
    [uploadReport]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const activePositions = positions.filter((p) => p.is_active);
  const closedPositions = positions.filter((p) => !p.is_active);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Swing Trading Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Portafoglio live e tracking P&L
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        {/* JSON Upload */}
        <div className="mb-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            {uploadReport.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Elaborazione JSON...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Upload className="h-5 w-5" />
                <span>Trascina file JSON qui, oppure clicca per selezionare</span>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio */}
        {positionsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : positions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Nessuna posizione nel portafoglio.</p>
              <p className="text-sm mt-1">
                Importa un file JSON per iniziare.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {activePositions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Posizioni Attive</h2>
                <SwingPortfolioTable positions={activePositions} />
              </div>
            )}
            {closedPositions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-muted-foreground">
                    Posizioni Chiuse
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archiveClosed.mutate()}
                    disabled={archiveClosed.isPending}
                    className="text-muted-foreground"
                  >
                    {archiveClosed.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : (
                      <Archive className="h-3 w-3 mr-2" />
                    )}
                    Archivia chiuse
                  </Button>
                </div>
                <SwingPortfolioTable positions={closedPositions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
