import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingStep } from "./ai-types";
import { PROCESSING_STEPS } from "./ai-types";

interface ProcessingOverlayProps {
  currentStep: ProcessingStep;
}

export default function ProcessingOverlay({ currentStep }: ProcessingOverlayProps) {
  const currentIdx = PROCESSING_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="fixed inset-0 bg-[#0B1829]/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center mx-auto mb-3">
            <Loader2 className="h-6 w-6 text-[#2DD4BF] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1829]">Analyzing Documents</h3>
          <p className="text-xs text-slate-400 mt-1">This typically takes 30–60 seconds</p>
        </div>

        <div className="space-y-3">
          {PROCESSING_STEPS.filter((s) => s.key !== 'done').map((step, i) => {
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={step.key} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-[#E86F2A] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span className={cn(
                  "text-sm",
                  isDone ? "text-slate-400" : isCurrent ? "text-[#0B1829] font-medium" : "text-slate-300"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
