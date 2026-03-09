import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FundInfo } from "./types";

interface FundInfoPanelProps {
  fundInfo: FundInfo;
  onChange: (info: FundInfo) => void;
}

export default function FundInfoPanel({ fundInfo, onChange }: FundInfoPanelProps) {
  const update = (key: keyof FundInfo, value: string) => {
    onChange({ ...fundInfo, [key]: value });
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[#0B1829]">Fund Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fund Name</Label>
            <Input
              value={fundInfo.fundName}
              onChange={(e) => update('fundName', e.target.value)}
              placeholder="e.g. India Growth Fund III"
              className="border-slate-200 focus:border-[#E86F2A] focus:ring-[#E86F2A]/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">GP Name</Label>
            <Input
              value={fundInfo.gpName}
              onChange={(e) => update('gpName', e.target.value)}
              placeholder="e.g. Acme Capital Partners"
              className="border-slate-200 focus:border-[#E86F2A] focus:ring-[#E86F2A]/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fund Vintage / Number</Label>
            <Select value={fundInfo.fundVintage} onValueChange={(v) => update('fundVintage', v)}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select fund" />
              </SelectTrigger>
              <SelectContent>
                {['Fund I', 'Fund II', 'Fund III', 'Fund IV', 'Fund V+'].map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Target Fund Size (USD M)</Label>
            <Input
              type="number"
              value={fundInfo.targetSize}
              onChange={(e) => update('targetSize', e.target.value)}
              placeholder="e.g. 500"
              className="border-slate-200 focus:border-[#E86F2A] focus:ring-[#E86F2A]/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date of Assessment</Label>
            <Input
              type="date"
              value={fundInfo.assessmentDate}
              onChange={(e) => update('assessmentDate', e.target.value)}
              className="border-slate-200 focus:border-[#E86F2A] focus:ring-[#E86F2A]/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assessed By</Label>
            <Input
              value={fundInfo.assessedBy}
              onChange={(e) => update('assessedBy', e.target.value)}
              placeholder="e.g. John Smith"
              className="border-slate-200 focus:border-[#E86F2A] focus:ring-[#E86F2A]/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
