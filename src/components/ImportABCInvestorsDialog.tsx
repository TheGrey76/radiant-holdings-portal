import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, X, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface InvestorRow {
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria: string;
  citta?: string;
  fonte?: string;
  priorita?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  pipeline_value?: number;
  probability?: number;
}

// Column mapping from common Excel headers to database fields
const COLUMN_MAPPINGS: Record<string, string> = {
  // Name variations
  'nome': 'nome',
  'name': 'nome',
  'nominativo': 'nome',
  'contatto': 'nome',
  'full name': 'nome',
  'nome completo': 'nome',
  
  // Company variations
  'azienda': 'azienda',
  'company': 'azienda',
  'società': 'azienda',
  'societa': 'azienda',
  'organizzazione': 'azienda',
  'organization': 'azienda',
  'ente': 'azienda',
  
  // Role variations
  'ruolo': 'ruolo',
  'role': 'ruolo',
  'posizione': 'ruolo',
  'position': 'ruolo',
  'title': 'ruolo',
  'job title': 'ruolo',
  'carica': 'ruolo',
  
  // Category variations
  'categoria': 'categoria',
  'category': 'categoria',
  'tipo': 'categoria',
  'type': 'categoria',
  'segmento': 'categoria',
  'segment': 'categoria',
  
  // City variations
  'citta': 'citta',
  'città': 'citta',
  'city': 'citta',
  'località': 'citta',
  'localita': 'citta',
  'sede': 'citta',
  
  // Source variations
  'fonte': 'fonte',
  'source': 'fonte',
  'provenienza': 'fonte',
  'origin': 'fonte',
  
  // Priority variations
  'priorita': 'priorita',
  'priorità': 'priorita',
  'priority': 'priorita',
  'importanza': 'priorita',
  
  // Email variations
  'email': 'email',
  'e-mail': 'email',
  'mail': 'email',
  'indirizzo email': 'email',
  
  // Phone variations
  'phone': 'phone',
  'telefono': 'phone',
  'tel': 'phone',
  'cellulare': 'phone',
  'mobile': 'phone',
  
  // LinkedIn variations
  'linkedin': 'linkedin',
  'linkedin url': 'linkedin',
  'profilo linkedin': 'linkedin',
  
  // Pipeline value variations
  'pipeline_value': 'pipeline_value',
  'pipeline value': 'pipeline_value',
  'valore pipeline': 'pipeline_value',
  'valore': 'pipeline_value',
  'value': 'pipeline_value',
  'importo': 'pipeline_value',
  
  // Probability variations
  'probability': 'probability',
  'probabilità': 'probability',
  'probabilita': 'probability',
  'prob': 'probability',
  '%': 'probability',
};

export function ImportABCInvestorsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<InvestorRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeHeader = (header: string): string => {
    return header.toLowerCase().trim();
  };

  const mapColumnToField = (header: string): string | null => {
    const normalized = normalizeHeader(header);
    return COLUMN_MAPPINGS[normalized] || null;
  };

  const parseExcelFile = async (file: File) => {
    setParseError(null);
    setParsedData([]);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
      
      if (jsonData.length < 2) {
        setParseError("Il file deve contenere almeno una riga di intestazione e una riga di dati");
        return;
      }
      
      // First row is headers
      const headers = (jsonData[0] as string[]).map(h => String(h || ''));
      
      // Map headers to fields
      const fieldMapping: Record<number, string> = {};
      headers.forEach((header, index) => {
        const field = mapColumnToField(header);
        if (field) {
          fieldMapping[index] = field;
        }
      });
      
      // Check required fields
      const mappedFields = Object.values(fieldMapping);
      if (!mappedFields.includes('nome')) {
        setParseError("Colonna 'Nome' non trovata. Assicurati che il file contenga una colonna con il nome del contatto.");
        return;
      }
      if (!mappedFields.includes('azienda')) {
        setParseError("Colonna 'Azienda' non trovata. Assicurati che il file contenga una colonna con il nome dell'azienda.");
        return;
      }
      if (!mappedFields.includes('categoria')) {
        setParseError("Colonna 'Categoria' non trovata. Assicurati che il file contenga una colonna con la categoria dell'investitore.");
        return;
      }
      
      // Parse data rows
      const investors: InvestorRow[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as unknown[];
        if (!row || row.length === 0) continue;
        
        const investor: Partial<InvestorRow> = {};
        
        Object.entries(fieldMapping).forEach(([indexStr, field]) => {
          const index = parseInt(indexStr);
          let value = row[index];
          
          if (value !== undefined && value !== null && value !== '') {
            // Handle numeric fields
            if (field === 'pipeline_value' || field === 'probability') {
              const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[€$,]/g, ''));
              if (!isNaN(numValue)) {
                (investor as any)[field] = numValue;
              }
            } else {
              (investor as any)[field] = String(value).trim();
            }
          }
        });
        
        // Only add if has required fields
        if (investor.nome && investor.azienda && investor.categoria) {
          investors.push(investor as InvestorRow);
        }
      }
      
      if (investors.length === 0) {
        setParseError("Nessun dato valido trovato nel file. Verifica che i campi richiesti (Nome, Azienda, Categoria) siano compilati.");
        return;
      }
      
      setParsedData(investors);
      toast.success(`${investors.length} record trovati nel file`);
      
    } catch (error: any) {
      console.error('Parse error:', error);
      setParseError(`Errore nel parsing del file: ${error.message}`);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'text/csv',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Formato file non supportato. Usa file Excel (.xlsx, .xls) o CSV.");
      return;
    }
    
    setSelectedFile(file);
    await parseExcelFile(file);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error("Nessun dato da importare");
      return;
    }
    
    setIsImporting(true);
    try {
      const dataToInsert = parsedData.map(inv => ({
        nome: inv.nome,
        azienda: inv.azienda,
        categoria: inv.categoria,
        ruolo: inv.ruolo || null,
        citta: inv.citta || null,
        fonte: inv.fonte || null,
        priorita: inv.priorita || 'medium',
        email: inv.email || null,
        phone: inv.phone || null,
        linkedin: inv.linkedin || null,
        pipeline_value: inv.pipeline_value || 0,
        probability: inv.probability || 50,
        status: 'To Contact',
        relationship_owner: 'Edoardo Grigione'
      }));
      
      const { error } = await supabase
        .from('abc_investors')
        .insert(dataToInsert);
      
      if (error) throw error;
      
      toast.success(`${parsedData.length} investitori importati con successo`);
      setIsOpen(false);
      setSelectedFile(null);
      setParsedData([]);
      
      // Refresh the page to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Errore durante l\'importazione');
    } finally {
      setIsImporting(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setParsedData([]);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) clearFile();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importa Investitori</DialogTitle>
          <DialogDescription>
            Carica un file Excel (.xlsx, .xls) o CSV con i dati degli investitori.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File upload area */}
          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Clicca per selezionare un file o trascinalo qui
              </p>
              <p className="text-xs text-muted-foreground">
                Formati supportati: .xlsx, .xls, .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Parse error */}
          {parseError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {parseError}
            </div>
          )}
          
          {/* Parsed data preview */}
          {parsedData.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {parsedData.length} record pronti per l'importazione
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Campi rilevati: Nome, Azienda, Categoria</p>
                {parsedData[0].email && <p>+ Email</p>}
                {parsedData[0].ruolo && <p>+ Ruolo</p>}
                {parsedData[0].citta && <p>+ Città</p>}
                {parsedData[0].phone && <p>+ Telefono</p>}
              </div>
            </div>
          )}
          
          {/* Import button */}
          <Button 
            onClick={handleImport} 
            disabled={isImporting || parsedData.length === 0}
            className="w-full"
          >
            {isImporting ? "Importazione in corso..." : `Importa ${parsedData.length} Investitori`}
          </Button>
          
          {/* Help text */}
          <p className="text-xs text-muted-foreground">
            Il file deve contenere almeno le colonne: <strong>Nome</strong>, <strong>Azienda</strong>, <strong>Categoria</strong>. 
            Colonne opzionali: Ruolo, Città, Email, Telefono, LinkedIn, Fonte, Priorità, Pipeline Value, Probabilità.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
