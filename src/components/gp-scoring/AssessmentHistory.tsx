import { useState, useEffect } from "react";
import { History, Trash2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SavedAssessment } from "./ai-types";

const HISTORY_LS = 'aries76_gp_scoring_history';

export function loadHistory(): SavedAssessment[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_LS) || '[]');
  } catch { return []; }
}

export function saveToHistory(assessment: SavedAssessment) {
  const history = loadHistory();
  const idx = history.findIndex((h) => h.id === assessment.id);
  if (idx >= 0) history[idx] = assessment;
  else history.unshift(assessment);
  localStorage.setItem(HISTORY_LS, JSON.stringify(history.slice(0, 50)));
}

export function deleteFromHistory(id: string) {
  const history = loadHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_LS, JSON.stringify(history));
}

interface AssessmentHistoryProps {
  onLoad: (data: SavedAssessment['data']) => void;
}

export default function AssessmentHistory({ onLoad }: AssessmentHistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SavedAssessment[]>([]);

  useEffect(() => {
    if (open) setHistory(loadHistory());
  }, [open]);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    toast.success('Assessment deleted');
  };

  const handleLoad = (a: SavedAssessment) => {
    onLoad(a.data);
    setOpen(false);
    toast.success(`Loaded: ${a.fundName || 'Untitled'}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0B1829]">Assessment History</DialogTitle>
        </DialogHeader>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No saved assessments yet.</p>
        ) : (
          <div className="space-y-2 pt-2">
            {history.map((a) => (
              <div key={a.id} className="flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0B1829] truncate">{a.fundName || 'Untitled Fund'}</p>
                  <p className="text-xs text-slate-400">{a.gpName || '—'} · {a.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#0B1829] tabular-nums">{a.score.toFixed(0)}/100</span>
                  <span className={cn("block text-[10px] font-bold uppercase", {
                    'text-emerald-600': a.verdict === 'pass',
                    'text-orange-600': a.verdict === 'conditional',
                    'text-red-600': a.verdict === 'fail',
                  })}>{a.verdict}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleLoad(a)} className="p-1.5 text-slate-400 hover:text-[#0B1829] transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
