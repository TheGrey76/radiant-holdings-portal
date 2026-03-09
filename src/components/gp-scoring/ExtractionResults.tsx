import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExtractionResult, Confidence } from "./ai-types";
import { CONFIDENCE_COLORS, getConfidenceLabel, METRIC_ID_MAP } from "./ai-types";

interface ExtractionResultsProps {
  result: ExtractionResult;
  onAccept: () => void;
  onReanalyze: () => void;
  onSwitchManual: () => void;
}

function ConfidenceDot({ confidence }: { confidence: Confidence }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("w-2 h-2 rounded-full", CONFIDENCE_COLORS[confidence])} />
      <span className="text-[10px] text-slate-500">{getConfidenceLabel(confidence)}</span>
    </span>
  );
}

function NullDot() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-slate-300" />
      <span className="text-[10px] text-slate-400">Not found</span>
    </span>
  );
}

export default function ExtractionResults({ result, onAccept, onReanalyze, onSwitchManual }: ExtractionResultsProps) {
  const [showRaw, setShowRaw] = useState(false);
  const fi = result.fund_info;

  const infoFields = [
    { label: 'Fund Name', field: fi.fund_name },
    { label: 'GP Name', field: fi.gp_name },
    { label: 'Fund Number', field: fi.fund_number },
    { label: 'Target Size (USD M)', field: fi.target_size_usd_m },
    { label: 'Management Fee %', field: fi.management_fee_pct },
    { label: 'Carry %', field: fi.carry_pct },
    { label: 'Hurdle Rate %', field: fi.hurdle_rate_pct },
    { label: 'GP Commitment %', field: fi.gp_commitment_pct },
  ];

  const metricEntries = Object.entries(result.metrics);

  return (
    <div className="space-y-4">
      {/* Extracted Fund Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#0B1829]">Extracted Fund Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {infoFields.map((f) => (
              <div key={f.label} className="space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{f.label}</p>
                <p className="text-sm font-medium text-[#0B1829]">
                  {f.field.value != null ? String(f.field.value) : '—'}
                </p>
                {f.field.value != null ? (
                  <ConfidenceDot confidence={f.field.confidence} />
                ) : (
                  <NullDot />
                )}
              </div>
            ))}
          </div>

          {fi.key_persons && fi.key_persons.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Key Persons Identified</p>
              <div className="flex flex-wrap gap-2">
                {fi.key_persons.map((kp, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-[#0B1829]">
                    {kp.name}{kp.title ? ` — ${kp.title}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Data Points (Collapsible) */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-[#0B1829] hover:bg-slate-50 transition-colors"
        >
          <span>Raw Extracted Data Points ({metricEntries.length})</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", showRaw && "rotate-180")} />
        </button>
        {showRaw && (
          <div className="border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">Data Point</th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">Value Found</th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">Source</th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">Location</th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {metricEntries.map(([key, m]) => (
                  <tr key={key} className="border-t border-slate-50">
                    <td className="px-4 py-2 font-medium text-[#0B1829]">{key.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-slate-600">{m.raw_data || '—'}</td>
                    <td className="px-4 py-2">
                      {m.source_document ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <FileText className="h-3 w-3" />
                          {m.source_document}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-400">{m.source_location || '—'}</td>
                    <td className="px-4 py-2">
                      {m.raw_data ? <ConfidenceDot confidence={m.confidence} /> : <NullDot />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onAccept} className="bg-[#0B1829] hover:bg-[#0B1829]/90 text-white">
          Accept & Continue to Scoring
        </Button>
        <Button onClick={onReanalyze} variant="outline" className="border-slate-200">
          Re-analyze
        </Button>
        <Button onClick={onSwitchManual} variant="ghost" className="text-slate-500">
          Switch to Manual
        </Button>
      </div>
    </div>
  );
}
