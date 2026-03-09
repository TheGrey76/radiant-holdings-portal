import { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileDown, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import FundInfoPanel from "@/components/gp-scoring/FundInfoPanel";
import ScoringPillar from "@/components/gp-scoring/ScoringPillar";
import ScoreDashboard from "@/components/gp-scoring/ScoreDashboard";
import type { FundInfo, Pillar } from "@/components/gp-scoring/types";
import { getDefaultPillars, calcPillarScore, calcTotalScore, getVerdict, getZeroMetrics } from "@/components/gp-scoring/types";

const LS_KEY = 'aries76_gp_scoring';

function getDefaultFundInfo(): FundInfo {
  return {
    fundName: '',
    gpName: '',
    fundVintage: '',
    targetSize: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessedBy: '',
  };
}

function loadState(): { fundInfo: FundInfo; pillars: Pillar[]; overallNotes: string } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function GPScoringTool() {
  const saved = useRef(loadState());
  const [fundInfo, setFundInfo] = useState<FundInfo>(saved.current?.fundInfo ?? getDefaultFundInfo());
  const [pillars, setPillars] = useState<Pillar[]>(saved.current?.pillars ?? getDefaultPillars());
  const [overallNotes, setOverallNotes] = useState(saved.current?.overallNotes ?? '');

  // Persist to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({ fundInfo, pillars, overallNotes }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [fundInfo, pillars, overallNotes]);

  const handleScoreChange = useCallback((pillarId: string, metricId: string, score: number) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? {
              ...p,
              metrics: p.metrics.map((m) =>
                m.id === metricId ? { ...m, score } : m
              ),
            }
          : p
      )
    );
  }, []);

  const handlePillarNotes = useCallback((pillarId: string, notes: string) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, notes } : p))
    );
  }, []);

  const handleReset = () => {
    setFundInfo(getDefaultFundInfo());
    setPillars(getDefaultPillars());
    setOverallNotes('');
    localStorage.removeItem(LS_KEY);
    toast.success('Form reset successfully');
  };

  const handleCopySummary = () => {
    const total = calcTotalScore(pillars);
    const verdict = getVerdict(pillars);
    const zeros = getZeroMetrics(pillars);
    const lines = [
      `GP & Fund Selection — Score Summary`,
      `────────────────────────────────`,
      `Fund: ${fundInfo.fundName || '—'}`,
      `GP: ${fundInfo.gpName || '—'}`,
      `Vintage: ${fundInfo.fundVintage || '—'}`,
      `Date: ${fundInfo.assessmentDate}`,
      `Assessed By: ${fundInfo.assessedBy || '—'}`,
      ``,
      `Total Score: ${total.toFixed(1)} / 100`,
      `Verdict: ${verdict.toUpperCase()}${zeros.length > 0 ? ` (zero in: ${zeros.join(', ')})` : ''}`,
      ``,
      ...pillars.map((p) => `${p.shortName}: ${calcPillarScore(p).toFixed(1)} / ${p.totalPoints}`),
      ``,
      `© 2026 Aries76 — Capital Intelligence`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Summary copied to clipboard');
  };

  const handleExportPDF = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const el = document.getElementById('gp-scoring-content');
      if (!el) return;
      toast.info('Generating PDF...');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      let position = 0;
      const pageH = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfW, pdfH);

      if (pdfH > pageH) {
        let remaining = pdfH - pageH;
        while (remaining > 0) {
          position -= pageH;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfW, pdfH);
          remaining -= pageH;
        }
      }

      pdf.save(`GP_Scoring_${fundInfo.fundName || 'Assessment'}_${fundInfo.assessmentDate}.pdf`);
      toast.success('PDF exported');
    } catch {
      toast.error('PDF export failed');
    }
  };

  const PILLAR_TAB_COLORS = ['border-[#0B1829]', 'border-[#E86F2A]', 'border-[#2DD4BF]', 'border-slate-500'];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-[#0B1829] tracking-tight">ARIES76</span>
            <div className="h-1 w-10 bg-[#E86F2A] rounded-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1829] mb-2">
            Disciplined Selection Criteria
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-3">
            A Quantitative Framework for GP & Fund Selection
          </p>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Score General Partners and funds across four institutional-grade pillars. A minimum score of 75/100 with no zero in any metric is required to proceed to Investment Committee review.
          </p>
        </div>
      </div>

      <div id="gp-scoring-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fund Info */}
        <FundInfoPanel fundInfo={fundInfo} onChange={setFundInfo} />

        {/* Main Layout */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Scoring Area */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="team">
              <TabsList className="w-full h-auto flex-wrap bg-white border border-slate-200 p-1 rounded-lg">
                {pillars.map((p, i) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className="flex-1 min-w-[120px] text-xs sm:text-sm py-2.5 data-[state=active]:bg-[#0B1829] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <span className="hidden sm:inline">Pillar {i + 1}: </span>
                    {p.shortName}
                    <span className="ml-1.5 text-[10px] opacity-60">{p.totalPoints}pts</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {pillars.map((p, i) => (
                <TabsContent key={p.id} value={p.id} className="mt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-1 h-8 rounded-full ${PILLAR_TAB_COLORS[i]}`} style={{ borderWidth: 0, backgroundColor: ['#0B1829', '#E86F2A', '#2DD4BF', '#64748B'][i] }} />
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1829]">
                        Pillar {i + 1}: {p.name}
                      </h3>
                      <span className="text-xs text-slate-400">{p.totalPoints} Points Total</span>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-2xl font-bold text-[#0B1829] tabular-nums">
                        {calcPillarScore(p).toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-400">/{p.totalPoints}</span>
                    </div>
                  </div>
                  <ScoringPillar
                    pillar={p}
                    onScoreChange={(metricId, score) => handleScoreChange(p.id, metricId, score)}
                  />
                </TabsContent>
              ))}
            </Tabs>

            {/* Notes Section */}
            <div className="mt-10 space-y-5">
              <h3 className="text-lg font-bold text-[#0B1829]">Notes & Commentary</h3>
              {pillars.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.name} Notes</Label>
                  <Textarea
                    value={p.notes}
                    onChange={(e) => handlePillarNotes(p.id, e.target.value)}
                    placeholder={`Add qualitative notes on ${p.name.toLowerCase()}...`}
                    className="min-h-[80px] border-slate-200 text-sm resize-y"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Assessment & Recommendation</Label>
                <Textarea
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                  placeholder="Summarise the overall assessment and recommendation..."
                  className="min-h-[100px] border-slate-200 text-sm resize-y"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleExportPDF} className="bg-[#0B1829] hover:bg-[#0B1829]/90 text-white">
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button onClick={handleCopySummary} variant="outline" className="border-slate-300">
                <Copy className="h-4 w-4 mr-2" />
                Copy Summary
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Form
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all fund information, scores, and notes. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Score Dashboard - Sticky sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Score Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreDashboard pillars={pillars} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Aries76 — Capital Intelligence | Disciplined Selection Criteria Framework
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            This tool is for internal use by authorised personnel of the Aries76 & SV Alternatives partnership.
          </p>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <span className="text-2xl font-bold text-[#0B1829] tabular-nums">{calcTotalScore(pillars).toFixed(0)}</span>
            <span className="text-sm text-slate-400"> / 100</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            getVerdict(pillars) === 'pass'
              ? 'bg-emerald-100 text-emerald-700'
              : getVerdict(pillars) === 'conditional'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {getVerdict(pillars).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="lg:hidden h-16" /> {/* spacer for sticky bar */}
    </div>
  );
}
