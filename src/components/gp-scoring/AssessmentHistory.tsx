import { useState, useEffect } from "react";
import { History, Trash2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { SavedAssessment } from "./ai-types";

export async function loadHistory(): Promise<SavedAssessment[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('gp_scoring_assessments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    fundName: row.fund_name,
    gpName: row.gp_name,
    date: row.assessment_date,
    score: Number(row.score),
    verdict: row.verdict,
    timestamp: new Date(row.created_at).getTime(),
    data: row.data as any,
  }));
}

export async function saveToHistory(assessment: SavedAssessment) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error('You must be logged in to save assessments');
    return;
  }

  const { error } = await supabase
    .from('gp_scoring_assessments')
    .upsert({
      id: assessment.id,
      user_id: user.id,
      fund_name: assessment.fundName,
      gp_name: assessment.gpName,
      assessment_date: assessment.date,
      score: assessment.score,
      verdict: assessment.verdict,
      data: assessment.data as any,
    }, { onConflict: 'id' });

  if (error) {
    console.error('Save error:', error);
    toast.error('Failed to save assessment');
  }
}

export async function deleteFromHistory(id: string) {
  const { error } = await supabase
    .from('gp_scoring_assessments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error);
    toast.error('Failed to delete assessment');
  }
}

interface AssessmentHistoryProps {
  onLoad: (data: SavedAssessment['data']) => void;
}

export default function AssessmentHistory({ onLoad }: AssessmentHistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SavedAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      loadHistory().then((h) => {
        setHistory(h);
        setLoading(false);
      });
    }
  }, [open]);

  const handleDelete = async (id: string) => {
    await deleteFromHistory(id);
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
        {loading ? (
          <p className="text-sm text-slate-400 py-8 text-center">Loading...</p>
        ) : history.length === 0 ? (
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
