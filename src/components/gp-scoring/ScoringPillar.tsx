import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metric, Pillar } from "./types";
import { VALID_SCORES, SCORE_COLORS, SCORE_DOT_COLORS, calcMetricWeightedScore } from "./types";

interface ScoringPillarProps {
  pillar: Pillar;
  onScoreChange: (metricId: string, score: number) => void;
}

function MetricCard({ metric, onScoreChange }: { metric: Metric; onScoreChange: (score: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const weighted = calcMetricWeightedScore(metric);
  const criteriaMap: Record<number, string> = {
    5: metric.criteria.score5,
    3: metric.criteria.score3,
    1: metric.criteria.score1,
    0: metric.criteria.score0,
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-[#0B1829] text-sm">{metric.name}</h4>
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

      <div className="flex gap-2 mb-2">
        {VALID_SCORES.map((s) => (
          <button
            key={s}
            onClick={() => onScoreChange(s)}
            className={cn(
              "flex-1 py-2 px-1 rounded-md border text-xs font-bold transition-all duration-200",
              metric.score === s
                ? SCORE_COLORS[s]
                : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white"
            )}
          >
            {s}
          </button>
        ))}
      </div>

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

export default function ScoringPillar({ pillar, onScoreChange }: ScoringPillarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pillar.metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          onScoreChange={(score) => onScoreChange(metric.id, score)}
        />
      ))}
    </div>
  );
}
