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

// Function to match column headers flexibly
const matchColumn = (header: string, patterns: string[]): boolean => {
  const normalized = header.toLowerCase().trim().replace(/[_\-\s]+/g, ' ');
  return patterns.some(pattern => {
    const normalizedPattern = pattern.toLowerCase().trim().replace(/[_\-\s]+/g, ' ');
    return normalized === normalizedPattern || 
           normalized.includes(normalizedPattern) || 
           normalizedPattern.includes(normalized);
  });
};

// Special handling for ambiguous columns
const mapColumnToField = (header: string): string | null => {
  const normalized = header.toLowerCase().trim();
  
  // Exact matches first for ambiguous terms
  if (normalized === 'title') return 'nome'; // "Title" alone = person name
  if (normalized === 'job title') return 'ruolo';
  if (normalized === 'url') return 'linkedin';
  
  // Field patterns for flexible matching
  const FIELD_PATTERNS: Record<string, string[]> = {
    nome: ['nome', 'name', 'nominativo', 'contatto', 'full name', 'nome completo', 'nome e cognome', 'cognome e nome', 'referente', 'persona', 'first name', 'last name'],
    azienda: ['azienda', 'company', 'società', 'societa', 'organizzazione', 'organization', 'ente', 'impresa', 'ditta', 'ragione sociale', 'denominazione'],
    ruolo: ['ruolo', 'role', 'posizione', 'position', 'job title', 'carica', 'qualifica', 'mansione', 'funzione'],
    categoria: ['categoria', 'category', 'tipo', 'type', 'segmento', 'segment', 'tipologia', 'classificazione', 'classe', 'investor type', 'tipo investitore'],
    citta: ['citta', 'città', 'city', 'località', 'localita', 'sede', 'luogo', 'comune', 'location', 'based in'],
    fonte: ['fonte', 'source', 'provenienza', 'origin', 'canale', 'origine'],
    priorita: ['priorita', 'priorità', 'priority', 'importanza', 'rilevanza'],
    email: ['email', 'e-mail', 'mail', 'indirizzo email', 'posta elettronica', 'e mail'],
    phone: ['phone', 'telefono', 'tel', 'cellulare', 'mobile', 'numero', 'cell', 'recapito'],
    linkedin: ['linkedin', 'linkedin url', 'profilo linkedin', 'link linkedin', 'url', 'profile url'],
    pipeline_value: ['pipeline_value', 'pipeline value', 'valore pipeline', 'valore', 'value', 'importo', 'amount', 'ticket'],
    probability: ['probability', 'probabilità', 'probabilita', 'prob', 'percentuale'],
  };
  
  for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
    if (matchColumn(normalized, patterns)) {
      return field;
    }
  }
  return null;
};

export function ImportABCInvestorsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<InvestorRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseExcelFile = async (file: File) => {
    setParseError(null);
    setParsedData([]);
    setDetectedColumns([]);
    
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
      const headers = (jsonData[0] as string[]).map(h => String(h || '')).filter(h => h.trim() !== '');
      setDetectedColumns(headers);
      
      console.log('Colonne rilevate nel file:', headers);
      
      // Map headers to fields
      const fieldMapping: Record<number, string> = {};
      const originalHeaders = (jsonData[0] as string[]).map(h => String(h || ''));
      originalHeaders.forEach((header, index) => {
        if (header.trim()) {
          const field = mapColumnToField(header);
          if (field) {
            fieldMapping[index] = field;
            console.log(`Colonna "${header}" mappata a campo "${field}"`);
          }
        }
      });
      
      // Check required fields with better error messages
      const mappedFields = Object.values(fieldMapping);
      const missingFields: string[] = [];
      
      // Only nome and azienda are truly required
      if (!mappedFields.includes('nome')) {
        missingFields.push("Nome (nome del contatto)");
      }
      if (!mappedFields.includes('azienda')) {
        missingFields.push("Azienda");
      }
      
      if (missingFields.length > 0) {
        setParseError(
          `Colonne mancanti: ${missingFields.join(', ')}.\n\n` +
          `Colonne trovate nel file: ${headers.join(', ')}`
        );
        return;
      }
      
      // Note if categoria is missing - we'll use a default
      const hasCategoria = mappedFields.includes('categoria');
      
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
        
        // Set default categoria if not present
        if (!investor.categoria) {
          investor.categoria = 'Club Deal Investor';
        }
        
        // Only add if has required fields (nome and azienda)
        if (investor.nome && investor.azienda) {
          investors.push(investor as InvestorRow);
        }
      }
      
      if (investors.length === 0) {
        setParseError(
          "Nessun dato valido trovato nel file. Verifica che le righe abbiano i campi richiesti (Nome, Azienda, Categoria) compilati.\n\n" +
          `Colonne trovate: ${headers.join(', ')}`
        );
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
    setDetectedColumns([]);
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
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg space-y-2">
              {parseError.split('\n\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'text-xs opacity-80' : ''}>{line}</p>
              ))}
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
