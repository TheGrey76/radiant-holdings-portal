import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pillar, Verdict } from "./types";
import { calcPillarScore, calcTotalScore, getVerdict, getZeroMetrics } from "./types";

interface ScoreDashboardProps {
  pillars: Pillar[];
  aiScoredCount?: number;
  manualScoredCount?: number;
}

const PILLAR_COLORS = ['#0B1829', '#E86F2A', '#2DD4BF', '#64748B'];

export default function ScoreDashboard({ pillars, aiScoredCount = 0, manualScoredCount = 0 }: ScoreDashboardProps) {
  const totalScore = useMemo(() => calcTotalScore(pillars), [pillars]);
  const verdict = useMemo(() => getVerdict(pillars), [pillars]);
  const zeroMetrics = useMemo(() => getZeroMetrics(pillars), [pillars]);

  const pillarScores = useMemo(() =>
    pillars.map((p, i) => ({
      name: p.shortName,
      score: calcPillarScore(p),
      max: p.totalPoints,
      color: PILLAR_COLORS[i],
    })),
    [pillars]
  );

  const radarData = useMemo(() =>
    pillars.map((p) => ({
      subject: p.shortName,
      value: p.totalPoints > 0 ? (calcPillarScore(p) / p.totalPoints) * 100 : 0,
      fullMark: 100,
    })),
    [pillars]
  );

  const verdictConfig: Record<Verdict, { icon: typeof CheckCircle2; label: string; sublabel: string; className: string }> = {
    pass: {
      icon: CheckCircle2,
      label: 'PASS',
      sublabel: 'Proceed to IC Review',
      className: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    conditional: {
      icon: AlertTriangle,
      label: 'CONDITIONAL',
      sublabel: `Zero score in: ${zeroMetrics.join(', ')}`,
      className: 'bg-orange-50 border-orange-200 text-orange-700',
    },
    fail: {
      icon: XCircle,
      label: 'FAIL',
      sublabel: 'Does not meet minimum threshold',
      className: 'bg-red-50 border-red-200 text-red-700',
    },
  };

  const vc = verdictConfig[verdict];
  const VerdictIcon = vc.icon;
  const totalMetrics = aiScoredCount + manualScoredCount;

  return (
    <div className="space-y-5">
      {/* Total Score */}
      <div className="text-center">
        <div className="text-5xl font-bold text-[#0B1829] tabular-nums transition-all duration-500">
          {totalScore.toFixed(0)}
        </div>
        <div className="text-sm text-slate-400 font-medium">/ 100</div>
      </div>

      {/* Verdict Badge */}
      <div className={cn("border rounded-lg p-3 flex items-center gap-2", vc.className)}>
        <VerdictIcon className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-bold text-sm">{vc.label}</div>
          <div className="text-xs opacity-80 leading-tight">{vc.sublabel}</div>
        </div>
      </div>

      {/* AI vs Manual indicator */}
      {totalMetrics > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
          <span>{aiScoredCount}/{totalMetrics} AI-scored, {manualScoredCount} manual</span>
        </div>
      )}

      {/* Pillar Breakdown */}
      <div className="space-y-2">
        {pillarScores.map((p) => (
          <div key={p.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
              <span className="text-slate-600 font-medium">{p.name}</span>
            </div>
            <span className="font-bold text-[#0B1829] tabular-nums">{p.score.toFixed(1)}/{p.max}</span>
          </div>
        ))}
      </div>

      {/* Stacked Bar */}
      <div className="h-8 flex rounded-full overflow-hidden bg-slate-100">
        {pillarScores.map((p) => (
          <div
            key={p.name}
            className="transition-all duration-500 flex items-center justify-center"
            style={{
              width: `${(p.score / 100) * 100}%`,
              backgroundColor: p.color,
              minWidth: p.score > 0 ? '8px' : '0',
            }}
          >
            {p.score >= 5 && (
              <span className="text-[9px] text-white font-bold">{p.score.toFixed(0)}</span>
            )}
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#E86F2A"
              fill="#E86F2A"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
