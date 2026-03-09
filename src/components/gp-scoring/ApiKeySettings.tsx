import { Sparkles } from "lucide-react";

export default function ApiKeySettings() {
  // No longer needed — AI is powered by Lovable AI Gateway via edge function
  // Keeping component as a simple info button
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2DD4BF]/10 rounded-md">
      <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
      <span className="text-[10px] font-medium text-[#2DD4BF]">AI Powered</span>
    </div>
  );
}

// These are no longer needed but kept for backward compatibility
export function getStoredApiKey(): string {
  return 'lovable-ai';
}

export function setStoredApiKey(_key: string) {
  // no-op
}
