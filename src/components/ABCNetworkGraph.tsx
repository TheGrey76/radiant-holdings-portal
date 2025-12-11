import { useMemo, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid } from "lucide-react";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  categoria: string;
  status: string;
  citta?: string;
  pipelineValue: number;
  approvalStatus: string;
}

interface ABCNetworkGraphProps {
  investors: Investor[];
}

const STATUS_COLORS: Record<string, string> = {
  "To Contact": "#64748b",
  "Contacted": "#3b82f6",
  "Interested": "#8b5cf6",
  "Meeting Scheduled": "#f59e0b",
  "In Negotiation": "#f97316",
  "Closed": "#22c55e",
  "Not Interested": "#ef4444",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Family Office": "#3b82f6",
  "HNWI": "#8b5cf6",
  "Institutional": "#22c55e",
  "Corporate": "#f59e0b",
  "Fund": "#ef4444",
  "Club Deal Investor": "#06b6d4",
  "Other": "#64748b",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  if (data.isGroup) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.investorCount} investitori
        </p>
        <p className="text-sm font-medium text-primary">
          €{(data.value / 1000).toFixed(0)}k totale
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg max-w-xs">
      <p className="font-semibold text-foreground">{data.investorName}</p>
      <p className="text-sm text-muted-foreground">{data.company}</p>
      <Badge variant="outline" className="text-xs mt-1">
        {data.status}
      </Badge>
      <p className="text-sm font-medium text-primary mt-1">
        €{(data.value / 1000).toFixed(0)}k pipeline
      </p>
    </div>
  );
};

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, depth, value, investorName, color } = props;
  
  if (width < 4 || height < 4) return null;
  
  const displayName = depth === 1 ? name : investorName || name;
  const fontSize = depth === 1 ? 11 : 9;
  const showLabel = width > 35 && height > 18;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color || (depth === 1 ? "#1a2332" : "#2d3a4d")}
        stroke="#0f1419"
        strokeWidth={depth === 1 ? 2 : 1}
        rx={depth === 1 ? 4 : 2}
        className="transition-opacity hover:opacity-80"
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={fontSize}
          fontWeight={depth === 1 ? 600 : 400}
          style={{ pointerEvents: "none" }}
        >
          {displayName.length > width / 6 
            ? displayName.substring(0, Math.floor(width / 6)) + "…" 
            : displayName}
        </text>
      )}
      {depth === 1 && width > 55 && height > 35 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 13}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize={9}
        >
          €{(value / 1000).toFixed(0)}k
        </text>
      )}
    </g>
  );
};

export function ABCNetworkGraph({ investors }: ABCNetworkGraphProps) {
  const [groupBy, setGroupBy] = useState<"categoria" | "status" | "citta">("categoria");

  const filteredInvestors = useMemo(() => 
    investors.filter(inv => inv.approvalStatus !== "not_approved"),
    [investors]
  );

  const treemapData = useMemo(() => {
    const groups: Record<string, typeof filteredInvestors> = {};
    
    filteredInvestors.forEach((inv) => {
      const key = groupBy === "citta" 
        ? (inv.citta || "Non specificata") 
        : groupBy === "categoria"
        ? (inv.categoria || "Altro")
        : inv.status;
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(inv);
    });

    const colorMap = groupBy === "status" ? STATUS_COLORS : CATEGORY_COLORS;

    return Object.entries(groups)
      .map(([name, invs]) => ({
        name,
        value: invs.reduce((sum, inv) => sum + (inv.pipelineValue || 10000), 0),
        color: colorMap[name] || "#64748b",
        isGroup: true,
        investorCount: invs.length,
        children: invs.map((inv) => ({
          name: inv.nome,
          investorName: inv.nome,
          company: inv.azienda,
          status: inv.status,
          value: inv.pipelineValue || 10000,
          color: groupBy === "status" 
            ? STATUS_COLORS[inv.status] || "#64748b"
            : colorMap[name] || "#64748b",
        })),
      }))
      .filter((g) => g.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredInvestors, groupBy]);

  const totalValue = filteredInvestors.reduce((sum, inv) => sum + (inv.pipelineValue || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Mappa Investitori</CardTitle>
          </div>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="categoria">Per Categoria</SelectItem>
              <SelectItem value="status">Per Status</SelectItem>
              <SelectItem value="citta">Per Città</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 mt-1">
          <Badge variant="secondary">{filteredInvestors.length} investitori</Badge>
          <Badge variant="outline">{treemapData.length} gruppi</Badge>
          <Badge variant="outline">€{(totalValue / 1000).toFixed(0)}k totale</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#0f1419"
              content={<CustomizedContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
          {treemapData.slice(0, 8).map((group) => (
            <div key={group.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: group.color }}
              />
              <span className="text-xs text-muted-foreground">
                {group.name} ({group.investorCount})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
