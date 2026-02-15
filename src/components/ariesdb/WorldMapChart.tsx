import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface RegionData {
  region: string;
  count: number;
  percentage: number;
}

interface WorldMapChartProps {
  regionData: RegionData[];
  onRegionClick?: (region: string) => void;
}

// Map ISO country names → our region keys
const COUNTRY_TO_REGION: Record<string, string> = {
  Italy: "Italy",
  "United Kingdom": "UK",
  France: "France",
  Germany: "Germany",
  Spain: "Spain",
  Switzerland: "Switzerland",
  Luxembourg: "Luxembourg",
  Netherlands: "Netherlands",
  "United States of America": "USA",
  "United Arab Emirates": "Middle East",
  Qatar: "Middle East",
  "Saudi Arabia": "Middle East",
  Bahrain: "Middle East",
  Kuwait: "Middle East",
  Oman: "Middle East",
  Israel: "Middle East",
  Jordan: "Middle East",
  Lebanon: "Middle East",
  China: "Asia-Pacific",
  Japan: "Asia-Pacific",
  "South Korea": "Asia-Pacific",
  India: "Asia-Pacific",
  Singapore: "Asia-Pacific",
  "Hong Kong": "Asia-Pacific",
  Australia: "Asia-Pacific",
  Indonesia: "Asia-Pacific",
  Thailand: "Asia-Pacific",
  Malaysia: "Asia-Pacific",
  Vietnam: "Asia-Pacific",
  Philippines: "Asia-Pacific",
  Taiwan: "Asia-Pacific",
  Brazil: "LATAM",
  Mexico: "LATAM",
  Argentina: "LATAM",
  Colombia: "LATAM",
  Chile: "LATAM",
  Peru: "LATAM",
  Nigeria: "Africa",
  "South Africa": "Africa",
  Kenya: "Africa",
  Egypt: "Africa",
  Morocco: "Africa",
  Ghana: "Africa",
  Ethiopia: "Africa",
  Tanzania: "Africa",
  // European countries → Other Europe
  Portugal: "Other Europe",
  Belgium: "Other Europe",
  Austria: "Other Europe",
  Sweden: "Other Europe",
  Norway: "Other Europe",
  Denmark: "Other Europe",
  Finland: "Other Europe",
  Ireland: "Other Europe",
  Poland: "Other Europe",
  "Czech Republic": "Other Europe",
  Czechia: "Other Europe",
  Romania: "Other Europe",
  Hungary: "Other Europe",
  Greece: "Other Europe",
  Croatia: "Other Europe",
  Bulgaria: "Other Europe",
  Slovakia: "Other Europe",
  Slovenia: "Other Europe",
  Lithuania: "Other Europe",
  Latvia: "Other Europe",
  Estonia: "Other Europe",
  Serbia: "Other Europe",
  Monaco: "Other Europe",
  Malta: "Other Europe",
  Cyprus: "Other Europe",
  Iceland: "Other Europe",
  Turkey: "Other Europe",
  Ukraine: "Other Europe",
  Russia: "Other Europe",
};

function getColorForPercentage(pct: number): string {
  if (pct >= 20) return "hsl(210, 80%, 35%)";
  if (pct >= 10) return "hsl(210, 70%, 45%)";
  if (pct >= 5) return "hsl(210, 60%, 55%)";
  if (pct >= 2) return "hsl(210, 50%, 65%)";
  if (pct > 0) return "hsl(210, 40%, 75%)";
  return "hsl(var(--muted))";
}

export default function WorldMapChart({ regionData, onRegionClick }: WorldMapChartProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  const regionMap = useMemo(() => {
    const map: Record<string, RegionData> = {};
    for (const r of regionData) map[r.region] = r;
    return map;
  }, [regionData]);

  const getRegionForCountry = (countryName: string): string | null => {
    return COUNTRY_TO_REGION[countryName] || null;
  };

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="relative w-full bg-card rounded-xl border overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [20, 30] }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const region = getRegionForCountry(countryName);
                  const data = region ? regionMap[region] : null;
                  const pct = data?.percentage || 0;
                  const fill = pct > 0 ? getColorForPercentage(pct) : "hsl(var(--muted) / 0.4)";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="hsl(var(--border))"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: pct > 0 ? "hsl(210, 85%, 40%)" : "hsl(var(--muted) / 0.6)",
                          outline: "none",
                          cursor: pct > 0 ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => {
                        if (region && data) {
                          setTooltipContent(`${region}: ${data.count} connessioni (${data.percentage.toFixed(1)}%)`);
                        } else {
                          setTooltipContent(countryName);
                        }
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      onClick={() => {
                        if (region && data && onRegionClick) onRegionClick(region);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip overlay */}
        {tooltipContent && (
          <div className="absolute top-3 left-3 bg-popover text-popover-foreground text-sm px-3 py-1.5 rounded-md shadow-md border pointer-events-none">
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {regionData
          .filter((r) => r.count > 0)
          .sort((a, b) => b.count - a.count)
          .map((r) => (
            <button
              key={r.region}
              onClick={() => onRegionClick?.(r.region)}
              className="flex items-center gap-2 p-2.5 rounded-lg border bg-card hover:border-primary transition-colors text-left"
            >
              <div
                className="w-3.5 h-3.5 rounded flex-shrink-0"
                style={{ backgroundColor: getColorForPercentage(r.percentage) }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{r.region}</p>
                <p className="text-xs text-muted-foreground">
                  {r.count} ({r.percentage.toFixed(1)}%)
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
