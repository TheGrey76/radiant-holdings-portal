import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, FileSpreadsheet, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { UploadedDoc, DocumentType } from "./ai-types";
import { DOCUMENT_TYPE_LABELS } from "./ai-types";

interface DocumentUploadZoneProps {
  documents: UploadedDoc[];
  onDocumentsChange: (docs: UploadedDoc[]) => void;
  onAnalyze: () => void;
  processing: boolean;
}

const ACCEPTED = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="h-4 w-4 text-red-500" />;
  if (ext === 'xlsx' || ext === 'docx') return <FileSpreadsheet className="h-4 w-4 text-blue-500" />;
  if (['png', 'jpg', 'jpeg'].includes(ext || '')) return <Image className="h-4 w-4 text-teal-500" />;
  return <File className="h-4 w-4 text-slate-400" />;
}

function guessDocType(name: string): DocumentType {
  const lower = name.toLowerCase();
  if (lower.includes('ppm') || lower.includes('memorandum')) return 'ppm';
  if (lower.includes('pitch') || lower.includes('deck')) return 'pitch_deck';
  if (lower.includes('ddq')) return 'ddq';
  if (lower.includes('track') || lower.includes('performance')) return 'track_record';
  if (lower.includes('financial') || lower.includes('audit')) return 'financials';
  if (lower.includes('side letter') || lower.includes('lpa')) return 'side_letter';
  if (lower.includes('ilpa')) return 'ilpa_ddq';
  return 'other';
}

export default function DocumentUploadZone({ documents, onDocumentsChange, onAnalyze, processing }: DocumentUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newDocs: UploadedDoc[] = [];
    const fileArr = Array.from(files);

    for (const file of fileArr) {
      if (documents.length + newDocs.length >= MAX_FILES) break;
      if (file.size > MAX_SIZE) continue;

      newDocs.push({
        id: crypto.randomUUID(),
        file,
        type: guessDocType(file.name),
        status: 'ready',
      });
    }

    onDocumentsChange([...documents, ...newDocs]);
  }, [documents, onDocumentsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeDoc = (id: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== id));
  };

  const updateDocType = (id: string, type: DocumentType) => {
    onDocumentsChange(documents.map((d) => d.id === id ? { ...d, type } : d));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          dragOver
            ? "border-[#2DD4BF] bg-[#2DD4BF]/5"
            : "border-slate-300 hover:border-[#0B1829]/40 bg-white"
        )}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-[#2DD4BF]" />
        <p className="text-sm font-medium text-[#0B1829]">Drop GP documents here or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, PNG/JPG — Max 10MB per file, up to 5 files</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* File Queue */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2.5">
              {getFileIcon(doc.file.name)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0B1829] truncate">{doc.file.name}</p>
                <p className="text-[10px] text-slate-400">{(doc.file.size / 1024).toFixed(0)} KB</p>
              </div>
              <Select value={doc.type} onValueChange={(v) => updateDocType(doc.id, v as DocumentType)}>
                <SelectTrigger className="w-48 h-8 text-xs border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <span className={cn("w-2 h-2 rounded-full", {
                  'bg-slate-300': doc.status === 'ready',
                  'bg-blue-500 animate-pulse': doc.status === 'uploading' || doc.status === 'processing',
                  'bg-emerald-500': doc.status === 'done',
                  'bg-red-500': doc.status === 'error',
                })} />
                <span className="text-[10px] text-slate-400 capitalize w-16">{doc.status}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeDoc(doc.id); }}
                className="text-slate-300 hover:text-red-500 transition-colors"
                disabled={processing}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <Button
            onClick={onAnalyze}
            disabled={documents.length === 0 || processing}
            className="w-full bg-[#0B1829] hover:bg-[#0B1829]/90 text-white mt-2"
          >
            {processing ? 'Analyzing...' : 'Analyze Documents'}
          </Button>
        </div>
      )}
    </div>
  );
}
