import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImportAdvisersDialogProps {
  onImportComplete: () => void;
}

export default function ImportAdvisersDialog({ onImportComplete }: ImportAdvisersDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);

    try {
      // Read CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Detect separator (semicolon for Italian Excel exports)
      const separator = lines[0].includes(';') ? ';' : ',';
      console.log('Using separator:', separator);
      
      const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, ''));
      console.log('Headers:', headers);
      
      // Parse CSV data - limit to actual data rows (skip header, take max 2000 rows)
      const csvData = lines.slice(1, 2001)
        .filter(line => line.trim() && line.split(separator).length > 1)
        .map(line => {
          const values = line.split(separator).map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        })
        .filter(row => {
          // Filter out empty rows
          const hasData = Object.values(row).some(val => val && val !== '');
          return hasData;
        });

      console.log('Parsed CSV data:', csvData.length, 'rows');
      if (csvData.length > 0) {
        console.log('Sample row:', csvData[0]);
      }

      if (csvData.length === 0) {
        toast.error('Nessun dato valido trovato nel file CSV');
        return;
      }

      toast.info(`Importazione di ${csvData.length} consulenti in corso...`);

      // Call edge function to import data
      const { data, error } = await supabase.functions.invoke('import-financial-advisers', {
        body: { csvData }
      });

      if (error) throw error;

      toast.success(`Import completato: ${data.inserted} consulenti aggiunti!`);
      setOpen(false);
      onImportComplete();

    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Errore durante l\'importazione');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90">
          <Upload className="mr-2 h-4 w-4" />
          Importa Consulenti
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f1729] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Importa Consulenti da CSV</DialogTitle>
          <DialogDescription className="text-white/60">
            Carica il file CSV esportato dal foglio "CONSULENTI" del file Excel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="csv-upload"
            />
            <label 
              htmlFor="csv-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-12 w-12 text-white/60" />
              <span className="text-white/90">
                {uploading ? 'Caricamento in corso...' : 'Clicca per caricare il file CSV'}
              </span>
              <span className="text-sm text-white/40">
                Solo file .csv
              </span>
            </label>
          </div>

          <div className="space-y-2 text-sm text-white/60">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
              Esporta il foglio "CONSULENTI" in formato CSV
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
              Il sistema mapperà automaticamente le colonne
            </p>
            <p className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-400 flex-shrink-0" />
              L'importazione potrebbe richiedere alcuni minuti per 1500+ record
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}