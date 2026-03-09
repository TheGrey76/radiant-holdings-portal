import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_KEY_LS = 'aries76_anthropic_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_LS) || '';
  } catch { return ''; }
}

export function setStoredApiKey(key: string) {
  localStorage.setItem(API_KEY_LS, key);
}

export default function ApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (open) {
      setKey(getStoredApiKey());
      setTestResult(null);
    }
  }, [open]);

  const handleTest = async () => {
    if (!key.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say OK" }],
        }),
      });
      setTestResult(res.ok ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setStoredApiKey(key.trim());
    toast.success('API key saved');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#0B1829]">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0B1829]">AI Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Anthropic API Key</Label>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => { setKey(e.target.value); setTestResult(null); }}
                placeholder="sk-ant-..."
                className="pr-10 border-slate-200"
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 text-xs p-2 rounded ${
              testResult === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {testResult === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {testResult === 'success' ? 'Connection successful' : 'Connection failed — check your API key'}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={!key.trim() || testing}
              className="border-slate-200"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!key.trim()}
              className="bg-[#0B1829] hover:bg-[#0B1829]/90 text-white"
            >
              Save Key
            </Button>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            Your API key is stored locally in your browser and never sent to any server other than Anthropic's API.
          </p>
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#E86F2A] hover:underline flex items-center gap-1"
          >
            Get an API key <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
