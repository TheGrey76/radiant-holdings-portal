import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RegionData {
  region: string;
  count: number;
  percentage: number;
}

interface WorldMapChartProps {
  regionData: RegionData[];
  onRegionClick?: (region: string) => void;
}

// Simplified world map SVG paths for each region
const REGION_PATHS: Record<string, { paths: string[]; cx: number; cy: number; label: string }> = {
  Italy: {
    paths: [
      "M508,168 L512,172 L510,180 L506,188 L508,196 L504,200 L500,192 L502,184 L504,176 Z",
    ],
    cx: 506, cy: 184,
    label: "Italy",
  },
  UK: {
    paths: [
      "M472,130 L478,126 L480,134 L476,142 L470,138 Z",
    ],
    cx: 475, cy: 134,
    label: "UK",
  },
  France: {
    paths: [
      "M478,158 L492,156 L496,164 L490,172 L480,170 L476,164 Z",
    ],
    cx: 485, cy: 164,
    label: "France",
  },
  Germany: {
    paths: [
      "M496,140 L510,138 L512,150 L506,156 L494,154 L492,146 Z",
    ],
    cx: 502, cy: 148,
    label: "Germany",
  },
  Spain: {
    paths: [
      "M460,172 L480,170 L482,182 L474,188 L458,186 L456,178 Z",
    ],
    cx: 468, cy: 180,
    label: "Spain",
  },
  Switzerland: {
    paths: [
      "M494,160 L504,158 L506,164 L498,166 Z",
    ],
    cx: 500, cy: 162,
    label: "Switzerland",
  },
  Luxembourg: {
    paths: [
      "M488,148 L494,147 L494,153 L488,154 Z",
    ],
    cx: 491, cy: 150,
    label: "Luxembourg",
  },
  Netherlands: {
    paths: [
      "M488,136 L496,134 L498,140 L490,142 Z",
    ],
    cx: 493, cy: 138,
    label: "Netherlands",
  },
  "Other Europe": {
    paths: [
      "M514,130 L550,124 L560,140 L556,158 L540,164 L520,160 L512,148 Z",
    ],
    cx: 536, cy: 146,
    label: "Other Europe",
  },
  USA: {
    paths: [
      "M120,140 L240,130 L260,150 L250,180 L200,200 L140,190 L110,170 Z",
    ],
    cx: 185, cy: 165,
    label: "USA",
  },
  "Middle East": {
    paths: [
      "M570,190 L610,180 L620,200 L610,220 L580,218 L568,206 Z",
    ],
    cx: 594, cy: 200,
    label: "Middle East",
  },
  "Asia-Pacific": {
    paths: [
      "M660,140 L760,120 L790,160 L780,220 L720,240 L660,220 L640,180 Z",
    ],
    cx: 720, cy: 180,
    label: "Asia-Pacific",
  },
  LATAM: {
    paths: [
      "M220,240 L280,220 L310,260 L300,340 L260,360 L220,340 L200,280 Z",
    ],
    cx: 256, cy: 290,
    label: "LATAM",
  },
  Africa: {
    paths: [
      "M480,230 L540,220 L560,260 L550,320 L520,340 L490,330 L470,280 Z",
    ],
    cx: 516, cy: 280,
    label: "Africa",
  },
  Unknown: {
    paths: [],
    cx: 400, cy: 380,
    label: "Unknown",
  },
};

// Color intensity based on percentage
function getRegionColor(percentage: number): string {
  if (percentage >= 20) return "hsl(var(--primary))";
  if (percentage >= 10) return "hsl(var(--primary) / 0.8)";
  if (percentage >= 5) return "hsl(var(--primary) / 0.6)";
  if (percentage >= 2) return "hsl(var(--primary) / 0.4)";
  if (percentage > 0) return "hsl(var(--primary) / 0.25)";
  return "hsl(var(--muted) / 0.3)";
}

function getRegionStroke(percentage: number): string {
  if (percentage >= 10) return "hsl(var(--primary))";
  if (percentage > 0) return "hsl(var(--primary) / 0.6)";
  return "hsl(var(--border))";
}

export default function WorldMapChart({ regionData, onRegionClick }: WorldMapChartProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regionMap = useMemo(() => {
    const map: Record<string, RegionData> = {};
    for (const r of regionData) map[r.region] = r;
    return map;
  }, [regionData]);

  const maxCount = useMemo(() => Math.max(...regionData.map(r => r.count), 1), [regionData]);

  return (
    <div className="w-full">
      {/* SVG Map */}
      <div className="relative w-full aspect-[2/1] bg-card rounded-xl border overflow-hidden">
        {/* Background grid for ocean feel */}
        <svg viewBox="0 0 900 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Ocean background */}
          <rect width="900" height="420" fill="hsl(var(--muted) / 0.15)" rx="12" />
          
          {/* Grid lines for visual texture */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 90} y1="0" x2={(i + 1) * 90} y2="420" stroke="hsl(var(--border) / 0.3)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 84} x2="900" y2={(i + 1) * 84} stroke="hsl(var(--border) / 0.3)" strokeWidth="0.5" />
          ))}

          {/* Region shapes */}
          <TooltipProvider delayDuration={0}>
            {Object.entries(REGION_PATHS).map(([region, config]) => {
              const data = regionMap[region];
              const count = data?.count || 0;
              const pct = data?.percentage || 0;
              const isHovered = hoveredRegion === region;

              if (!config.paths.length) return null;

              return (
                <Tooltip key={region}>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onRegionClick?.(region)}
                      style={{ transform: isHovered ? "scale(1.05)" : "scale(1)", transformOrigin: `${config.cx}px ${config.cy}px` }}
                    >
                      {config.paths.map((path, i) => (
                        <path
                          key={i}
                          d={path}
                          fill={getRegionColor(pct)}
                          stroke={getRegionStroke(pct)}
                          strokeWidth={isHovered ? 2 : 1}
                          opacity={isHovered ? 1 : 0.85}
                        />
                      ))}
                      {/* Bubble indicator */}
                      {count > 0 && (
                        <>
                          <circle
                            cx={config.cx}
                            cy={config.cy}
                            r={Math.max(8, Math.min(28, (count / maxCount) * 28))}
                            fill="hsl(var(--primary) / 0.2)"
                            stroke="hsl(var(--primary))"
                            strokeWidth={1.5}
                          />
                          <text
                            x={config.cx}
                            y={config.cy + 1}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={count > 99 ? 8 : 9}
                            fontWeight="700"
                            fill="hsl(var(--primary))"
                          >
                            {count}
                          </text>
                        </>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    <p className="font-semibold">{region}</p>
                    <p>{count} connessioni ({pct.toFixed(1)}%)</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>

          {/* "Unknown" label at bottom */}
          {regionMap["Unknown"]?.count > 0 && (
            <g
              className="cursor-pointer"
              onClick={() => onRegionClick?.("Unknown")}
              onMouseEnter={() => setHoveredRegion("Unknown")}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <rect x="350" y="370" width="100" height="30" rx="6" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" />
              <text x="400" y="389" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))" fontWeight="600">
                Unknown ({regionMap["Unknown"].count})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Region legend / ranking below the map */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {regionData
          .filter(r => r.count > 0)
          .sort((a, b) => b.count - a.count)
          .map(r => (
            <button
              key={r.region}
              onClick={() => onRegionClick?.(r.region)}
              className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:border-primary transition-colors text-left"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getRegionColor(r.percentage) }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.region}</p>
                <p className="text-xs text-muted-foreground">{r.count} ({r.percentage.toFixed(1)}%)</p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
