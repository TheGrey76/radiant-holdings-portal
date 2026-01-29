import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, FileSpreadsheet, Users, AlertCircle, Eye, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ImportBatch {
  id: string;
  batch_name: string;
  file_name: string | null;
  imported_by: string;
  imported_at: string;
  total_records: number;
  new_records: number;
  duplicates_skipped: number;
  status: string;
}

interface BatchInvestor {
  id: string;
  nome: string;
  azienda: string;
  categoria: string;
  status: string;
  approval_status: string;
  created_at: string;
}

export function ABCImportHistory() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [batchInvestors, setBatchInvestors] = useState<BatchInvestor[]>([]);
  const [loadingInvestors, setLoadingInvestors] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('abc_import_batches')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error('Error fetching import batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchInvestors = async (batchId: string) => {
    setLoadingInvestors(true);
    try {
      const { data, error } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, categoria, status, approval_status, created_at')
        .eq('import_batch_id', batchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatchInvestors(data || []);
    } catch (error) {
      console.error('Error fetching batch investors:', error);
    } finally {
      setLoadingInvestors(false);
    }
  };

  const handleViewBatch = (batch: ImportBatch) => {
    setSelectedBatch(batch);
    fetchBatchInvestors(batch.id);
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Approvato</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rifiutato</Badge>;
      default:
        return <Badge variant="outline">In Attesa</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Caricamento cronologia...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Cronologia Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        {batches.length === 0 ? (
          <div className="text-center py-8">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nessun import effettuato</p>
          </div>
        ) : (
          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium truncate">{batch.batch_name}</span>
                      {batch.new_records > 0 && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Nuovo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {batch.file_name && (
                        <p className="truncate">File: {batch.file_name}</p>
                      )}
                      <p>
                        {format(new Date(batch.imported_at), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                      </p>
                      <p>Importato da: {batch.imported_by}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {batch.new_records} nuovi
                      </Badge>
                      {batch.duplicates_skipped > 0 && (
                        <Badge variant="outline" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {batch.duplicates_skipped} duplicati
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {batch.total_records} totali nel file
                      </Badge>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewBatch(batch)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Dettagli
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5" />
                          {selectedBatch?.batch_name}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="flex-1 overflow-auto">
                        {loadingInvestors ? (
                          <p className="text-center py-8 text-muted-foreground">Caricamento...</p>
                        ) : batchInvestors.length === 0 ? (
                          <p className="text-center py-8 text-muted-foreground">
                            Nessun investitore trovato per questo batch
                          </p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Azienda</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Approvazione</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {batchInvestors.map((investor) => (
                                <TableRow key={investor.id}>
                                  <TableCell className="font-medium">{investor.nome}</TableCell>
                                  <TableCell>{investor.azienda}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{investor.categoria}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">{investor.status}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {getApprovalBadge(investor.approval_status)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
