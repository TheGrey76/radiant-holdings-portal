import { useState } from "react";
import { ChevronDown, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metric, Pillar } from "./types";
import { VALID_SCORES, SCORE_COLORS, SCORE_DOT_COLORS, calcMetricWeightedScore } from "./types";
import type { ExtractedMetric, Confidence } from "./ai-types";
import { CONFIDENCE_COLORS, getConfidenceLabel, METRIC_ID_MAP } from "./ai-types";

interface ScoringPillarProps {
  pillar: Pillar;
  onScoreChange: (metricId: string, score: number) => void;
  aiMetrics?: Record<string, ExtractedMetric>;
  aiOverrides?: Set<string>;
}

function MetricCard({
  metric,
  onScoreChange,
  aiMetric,
  isOverridden,
}: {
  metric: Metric;
  onScoreChange: (score: number) => void;
  aiMetric?: ExtractedMetric;
  isOverridden?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showRationale, setShowRationale] = useState(false);
  const weighted = calcMetricWeightedScore(metric);
  const criteriaMap: Record<number, string> = {
    5: metric.criteria.score5,
    3: metric.criteria.score3,
    1: metric.criteria.score1,
    0: metric.criteria.score0,
  };

  const hasAI = aiMetric && aiMetric.raw_data;

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[#0B1829] text-sm">{metric.name}</h4>
            {hasAI && !isOverridden && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#2DD4BF]/10 text-[#2DD4BF] text-[9px] font-bold rounded">
                <Sparkles className="h-2.5 w-2.5" />
                AI
              </span>
            )}
            {isOverridden && (
              <span className="px-1.5 py-0.5 bg-[#E86F2A]/10 text-[#E86F2A] text-[9px] font-bold rounded">
                Adjusted
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">{metric.weight} pts</span>
        </div>
        <div className="text-right">
          <span className={cn(
            "text-lg font-bold tabular-nums transition-colors duration-300",
            metric.score >= 0 ? "text-[#0B1829]" : "text-slate-300"
          )}>
            {weighted.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 block">/ {metric.weight}</span>
        </div>
      </div>

      {/* No data message */}
      {aiMetric && !aiMetric.raw_data && metric.score < 0 && (
        <p className="text-xs text-slate-400 italic mb-2">
          No relevant data found in uploaded documents. Please score manually.
        </p>
      )}

      <div className="flex gap-2 mb-2">
        {VALID_SCORES.map((s) => (
          <button
            key={s}
            onClick={() => onScoreChange(s)}
            className={cn(
              "flex-1 py-2 px-1 rounded-md border text-xs font-bold transition-all duration-200",
              metric.score === s
                ? SCORE_COLORS[s]
                : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white",
              hasAI && aiMetric.suggested_score === s && metric.score !== s &&
                "ring-1 ring-[#2DD4BF]/50 border-[#2DD4BF]/30"
            )}
          >
            {s}
            {hasAI && aiMetric.suggested_score === s && metric.score !== s && (
              <span className="block text-[8px] text-[#2DD4BF] font-normal mt-0.5">suggested</span>
            )}
          </button>
        ))}
      </div>

      {/* AI Rationale */}
      {hasAI && (
        <button
          onClick={() => setShowRationale(!showRationale)}
          className="flex items-center gap-1 text-[10px] text-[#2DD4BF] hover:text-[#2DD4BF]/80 transition-colors mt-1"
        >
          <Sparkles className="h-3 w-3" />
          {showRationale ? 'Hide' : 'Show'} AI rationale
        </button>
      )}

      {hasAI && showRationale && (
        <div className="mt-2 p-2.5 bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 rounded text-xs text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <p>{aiMetric.rationale}</p>
          {aiMetric.source_document && (
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
              <FileText className="h-3 w-3" />
              {aiMetric.source_document}{aiMetric.source_location ? `, ${aiMetric.source_location}` : ''}
            </p>
          )}
          <span className="mt-1 inline-flex items-center gap-1">
            <span className={cn("w-1.5 h-1.5 rounded-full", CONFIDENCE_COLORS[aiMetric.confidence])} />
            <span className="text-[9px] text-slate-400">{getConfidenceLabel(aiMetric.confidence)} confidence</span>
          </span>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors mt-1"
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
        Scoring criteria
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {VALID_SCORES.slice().reverse().map((s) => (
            <div key={s} className="flex gap-2 items-start text-[11px]">
              <span className={cn("w-2 h-2 rounded-full mt-1 shrink-0", SCORE_DOT_COLORS[s])} />
              <span className="text-slate-500">
                <strong className="text-slate-700">{s}:</strong> {criteriaMap[s]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Build a reverse map: metric.id -> extraction key
const REVERSE_METRIC_MAP: Record<string, string> = {};
for (const [extKey, metricId] of Object.entries(METRIC_ID_MAP)) {
  REVERSE_METRIC_MAP[metricId] = extKey;
}

export default function ScoringPillar({ pillar, onScoreChange, aiMetrics, aiOverrides }: ScoringPillarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pillar.metrics.map((metric) => {
        const extKey = REVERSE_METRIC_MAP[metric.id];
        const aiMetric = extKey && aiMetrics ? aiMetrics[extKey] : undefined;
        return (
          <MetricCard
            key={metric.id}
            metric={metric}
            onScoreChange={(score) => onScoreChange(metric.id, score)}
            aiMetric={aiMetric}
            isOverridden={aiOverrides?.has(metric.id)}
          />
        );
      })}
    </div>
  );
}
