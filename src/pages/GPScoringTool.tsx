import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileDown, Copy, RotateCcw, Sparkles, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FundInfoPanel from "@/components/gp-scoring/FundInfoPanel";
import ScoringPillar from "@/components/gp-scoring/ScoringPillar";
import ScoreDashboard from "@/components/gp-scoring/ScoreDashboard";
import ApiKeySettings, { getStoredApiKey } from "@/components/gp-scoring/ApiKeySettings";
import DocumentUploadZone from "@/components/gp-scoring/DocumentUploadZone";
import ProcessingOverlay from "@/components/gp-scoring/ProcessingOverlay";
import ExtractionResults from "@/components/gp-scoring/ExtractionResults";
import AssessmentHistory, { saveToHistory } from "@/components/gp-scoring/AssessmentHistory";
import { useAIExtraction } from "@/components/gp-scoring/useAIExtraction";
import type { FundInfo, Pillar } from "@/components/gp-scoring/types";
import { getDefaultPillars, calcPillarScore, calcTotalScore, getVerdict, getZeroMetrics } from "@/components/gp-scoring/types";
import type { ScoringMode, UploadedDoc, ExtractionResult } from "@/components/gp-scoring/ai-types";
import { METRIC_ID_MAP } from "@/components/gp-scoring/ai-types";

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
  const [mode, setMode] = useState<ScoringMode>('ai');
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [showExtraction, setShowExtraction] = useState(false);
  const [aiOverrides, setAiOverrides] = useState<Set<string>>(new Set());
  const [generatingNotes, setGeneratingNotes] = useState<string | null>(null);

  const { processing, processingStep, analyze, generateNotes } = useAIExtraction();
  const hasApiKey = !!getStoredApiKey();

  // Persist to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({ fundInfo, pillars, overallNotes }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [fundInfo, pillars, overallNotes]);

  // Count AI vs manual scores
  const { aiScoredCount, manualScoredCount } = useMemo(() => {
    let ai = 0, manual = 0;
    pillars.forEach((p) => p.metrics.forEach((m) => {
      if (m.score < 0) return;
      if (extraction && !aiOverrides.has(m.id)) ai++;
      else manual++;
    }));
    return { aiScoredCount: ai, manualScoredCount: manual };
  }, [pillars, extraction, aiOverrides]);

  const handleScoreChange = useCallback((pillarId: string, metricId: string, score: number) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? { ...p, metrics: p.metrics.map((m) => m.id === metricId ? { ...m, score } : m) }
          : p
      )
    );
    // Track manual overrides
    if (extraction) {
      const extKey = Object.entries(METRIC_ID_MAP).find(([, v]) => v === metricId)?.[0];
      const aiMetric = extKey ? extraction.metrics[extKey] : null;
      if (aiMetric && aiMetric.suggested_score !== score) {
        setAiOverrides((prev) => new Set(prev).add(metricId));
      }
    }
  }, [extraction]);

  const handlePillarNotes = useCallback((pillarId: string, notes: string) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, notes } : p))
    );
  }, []);

  const handleReset = () => {
    setFundInfo(getDefaultFundInfo());
    setPillars(getDefaultPillars());
    setOverallNotes('');
    setDocuments([]);
    setExtraction(null);
    setShowExtraction(false);
    setAiOverrides(new Set());
    localStorage.removeItem(LS_KEY);
    toast.success('Form reset successfully');
  };

  const handleAnalyze = async () => {
    const result = await analyze(documents);
    if (result) {
      setExtraction(result);
      setShowExtraction(true);
    }
  };

  const handleAcceptExtraction = () => {
    if (!extraction) return;
    setShowExtraction(false);

    // Pre-fill fund info
    const fi = extraction.fund_info;
    setFundInfo((prev) => ({
      ...prev,
      fundName: fi.fund_name.value || prev.fundName,
      gpName: fi.gp_name.value || prev.gpName,
      fundVintage: fi.fund_number.value || prev.fundVintage,
      targetSize: fi.target_size_usd_m.value != null ? String(fi.target_size_usd_m.value) : prev.targetSize,
    }));

    // Pre-fill scores from AI suggestions
    setPillars((prev) =>
      prev.map((p) => ({
        ...p,
        metrics: p.metrics.map((m) => {
          const extKey = Object.entries(METRIC_ID_MAP).find(([, v]) => v === m.id)?.[0];
          const aiMetric = extKey ? extraction.metrics[extKey] : null;
          if (aiMetric && aiMetric.raw_data && [0, 1, 3, 5].includes(aiMetric.suggested_score)) {
            return { ...m, score: aiMetric.suggested_score };
          }
          return m;
        }),
      }))
    );

    setAiOverrides(new Set());
    toast.success('AI scores applied — review and adjust as needed');
  };

  const handleGenerateNotes = async (pillarId: string, pillarName: string) => {
    setGeneratingNotes(pillarId);
    const pillar = pillars.find((p) => p.id === pillarId);
    if (!pillar) return;

    const pillarData = {
      name: pillarName,
      score: calcPillarScore(pillar),
      max: pillar.totalPoints,
      metrics: pillar.metrics.map((m) => ({
        name: m.name,
        score: m.score,
        weight: m.weight,
      })),
      extraction: extraction?.metrics,
    };

    const notes = await generateNotes(pillarName, pillarData);
    if (notes) {
      handlePillarNotes(pillarId, notes);
    }
    setGeneratingNotes(null);
  };

  const handleGenerateOverallNotes = async () => {
    setGeneratingNotes('overall');
    const overallData = {
      fundInfo,
      totalScore: calcTotalScore(pillars),
      verdict: getVerdict(pillars),
      pillars: pillars.map((p) => ({
        name: p.name,
        score: calcPillarScore(p),
        max: p.totalPoints,
      })),
    };
    const notes = await generateNotes('Overall Assessment', overallData);
    if (notes) setOverallNotes(notes);
    setGeneratingNotes(null);
  };

  const handleSaveAssessment = () => {
    const id = crypto.randomUUID();
    saveToHistory({
      id,
      fundName: fundInfo.fundName,
      gpName: fundInfo.gpName,
      date: fundInfo.assessmentDate,
      score: calcTotalScore(pillars),
      verdict: getVerdict(pillars),
      timestamp: Date.now(),
      data: { fundInfo, pillars, overallNotes, extraction },
    });
    toast.success('Assessment saved');
  };

  const handleLoadAssessment = (data: any) => {
    setFundInfo(data.fundInfo);
    setPillars(data.pillars);
    setOverallNotes(data.overallNotes || '');
    setExtraction(data.extraction || null);
    setShowExtraction(false);
    setAiOverrides(new Set());
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {processing && <ProcessingOverlay currentStep={processingStep} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#0B1829] tracking-tight">ARIES76</span>
              <div className="h-1 w-10 bg-[#E86F2A] rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <AssessmentHistory onLoad={handleLoadAssessment} />
              <ApiKeySettings />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1829] mb-2">
            Disciplined Selection Criteria
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-3">
            A Quantitative Framework for GP & Fund Selection
          </p>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed mb-5">
            Score General Partners and funds across four institutional-grade pillars. Upload GP materials for AI-assisted scoring, or enter scores manually. A minimum score of 75/100 with no zero in any metric is required to proceed to Investment Committee review.
          </p>

          {/* Mode Toggle */}
          <div className="inline-flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                mode === 'ai'
                  ? 'bg-[#0B1829] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI-Assisted
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-[#0B1829] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Manual Entry
            </button>
          </div>
        </div>
      </div>

      <div id="gp-scoring-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Upload (AI Mode) */}
        {mode === 'ai' && !showExtraction && !extraction && (
          <div className="mb-8">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#0B1829] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#2DD4BF]" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasApiKey ? (
                  <DocumentUploadZone
                    documents={documents}
                    onDocumentsChange={setDocuments}
                    onAnalyze={handleAnalyze}
                    processing={processing}
                  />
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-slate-500 mb-2">Configure your Anthropic API key to enable AI-assisted scoring</p>
                    <p className="text-xs text-slate-400">Click the ⚙️ icon in the header to set up your API key</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Extraction Results */}
        {showExtraction && extraction && (
          <div className="mb-8">
            <ExtractionResults
              result={extraction}
              onAccept={handleAcceptExtraction}
              onReanalyze={handleAnalyze}
              onSwitchManual={() => { setMode('manual'); setShowExtraction(false); setExtraction(null); }}
            />
          </div>
        )}

        {/* Fund Info */}
        <FundInfoPanel fundInfo={fundInfo} onChange={setFundInfo} aiExtraction={extraction} />

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
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: ['#0B1829', '#E86F2A', '#2DD4BF', '#64748B'][i] }} />
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
                    aiMetrics={extraction?.metrics}
                    aiOverrides={aiOverrides}
                  />
                </TabsContent>
              ))}
            </Tabs>

            {/* Notes Section */}
            <div className="mt-10 space-y-5">
              <h3 className="text-lg font-bold text-[#0B1829]">Notes & Commentary</h3>
              {pillars.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.name} Notes</Label>
                    {mode === 'ai' && hasApiKey && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateNotes(p.id, p.name)}
                        disabled={generatingNotes === p.id}
                        className="text-xs text-[#2DD4BF] hover:text-[#2DD4BF]/80 h-7 px-2"
                      >
                        {generatingNotes === p.id ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        Generate AI Summary
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={p.notes}
                    onChange={(e) => handlePillarNotes(p.id, e.target.value)}
                    placeholder={`Add qualitative notes on ${p.name.toLowerCase()}...`}
                    className="min-h-[80px] border-slate-200 text-sm resize-y"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Assessment & Recommendation</Label>
                  {mode === 'ai' && hasApiKey && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateOverallNotes}
                      disabled={generatingNotes === 'overall'}
                      className="text-xs text-[#2DD4BF] hover:text-[#2DD4BF]/80 h-7 px-2"
                    >
                      {generatingNotes === 'overall' ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      Generate AI Summary
                    </Button>
                  )}
                </div>
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
              <Button onClick={handleSaveAssessment} variant="outline" className="border-slate-300">
                <Save className="h-4 w-4 mr-2" />
                Save Assessment
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
                  <ScoreDashboard
                    pillars={pillars}
                    aiScoredCount={aiScoredCount}
                    manualScoredCount={manualScoredCount}
                  />
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
          <p className="text-[10px] text-slate-300 mt-0.5">
            AI-assisted scoring is advisory only. All scores must be reviewed and confirmed by qualified personnel.
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
      <div className="lg:hidden h-16" />
    </div>
  );
}
