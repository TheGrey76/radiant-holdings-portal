import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

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
  Canada: "Canada",
  // Middle East
  "United Arab Emirates": "Middle East",
  Qatar: "Middle East",
  "Saudi Arabia": "Middle East",
  Bahrain: "Middle East",
  Kuwait: "Middle East",
  Oman: "Middle East",
  Israel: "Middle East",
  Jordan: "Middle East",
  Lebanon: "Middle East",
  // Asia-Pacific
  China: "Asia-Pacific",
  Japan: "Asia-Pacific",
  "South Korea": "Asia-Pacific",
  India: "Asia-Pacific",
  Singapore: "Asia-Pacific",
  Australia: "Asia-Pacific",
  Indonesia: "Asia-Pacific",
  Thailand: "Asia-Pacific",
  Malaysia: "Asia-Pacific",
  Vietnam: "Asia-Pacific",
  Philippines: "Asia-Pacific",
  "New Zealand": "Asia-Pacific",
  Nepal: "Asia-Pacific",
  // LATAM
  Brazil: "LATAM",
  Mexico: "LATAM",
  Argentina: "LATAM",
  Colombia: "LATAM",
  Chile: "LATAM",
  Peru: "LATAM",
  Uruguay: "LATAM",
  Panama: "LATAM",
  // Africa
  Nigeria: "Africa",
  "South Africa": "Africa",
  Kenya: "Africa",
  Egypt: "Africa",
  Morocco: "Africa",
  Ghana: "Africa",
  Ethiopia: "Africa",
  Tanzania: "Africa",
  Senegal: "Africa",
  Mauritius: "Africa",
  // Scandinavia
  Sweden: "Scandinavia",
  Norway: "Scandinavia",
  Denmark: "Scandinavia",
  Finland: "Scandinavia",
  Iceland: "Scandinavia",
  // CEE
  Poland: "CEE",
  "Czech Republic": "CEE",
  Czechia: "CEE",
  Hungary: "CEE",
  Romania: "CEE",
  Slovakia: "CEE",
  Bulgaria: "CEE",
  Serbia: "CEE",
  Croatia: "CEE",
  Slovenia: "CEE",
  Lithuania: "CEE",
  Latvia: "CEE",
  Estonia: "CEE",
  Ukraine: "CEE",
  Greece: "CEE",
  Turkey: "CEE",
  // Small European states
  Belgium: "Belgium",
  Ireland: "Ireland",
  Portugal: "Portugal",
  Austria: "Austria",
  Monaco: "Monaco",
  Malta: "Malta",
  Cyprus: "Cyprus",
  Andorra: "Andorra",
  Russia: "CEE",
  // Offshore
  "Cayman Islands": "Offshore",
};

const REGION_COLORS: Record<string, string> = {
  Italy: "hsl(210, 85%, 30%)",
  UK: "hsl(210, 75%, 40%)",
  USA: "hsl(200, 70%, 42%)",
  Switzerland: "hsl(150, 60%, 38%)",
  "Middle East": "hsl(35, 70%, 45%)",
  France: "hsl(220, 65%, 48%)",
  Germany: "hsl(0, 0%, 35%)",
  Spain: "hsl(15, 70%, 48%)",
  "Asia-Pacific": "hsl(340, 60%, 45%)",
  Luxembourg: "hsl(195, 55%, 50%)",
  Netherlands: "hsl(25, 80%, 50%)",
  LATAM: "hsl(130, 55%, 40%)",
  Africa: "hsl(45, 65%, 42%)",
  Canada: "hsl(0, 65%, 48%)",
  Scandinavia: "hsl(200, 60%, 55%)",
  CEE: "hsl(270, 45%, 50%)",
  Belgium: "hsl(50, 60%, 45%)",
  Ireland: "hsl(140, 65%, 35%)",
  Portugal: "hsl(10, 55%, 45%)",
  Austria: "hsl(0, 50%, 42%)",
  Monaco: "hsl(330, 55%, 50%)",
  Malta: "hsl(180, 50%, 45%)",
  Cyprus: "hsl(170, 45%, 48%)",
  Offshore: "hsl(280, 40%, 55%)",
  "San Marino": "hsl(215, 50%, 55%)",
  Gibraltar: "hsl(5, 55%, 50%)",
  Andorra: "hsl(250, 40%, 52%)",
  Unknown: "hsl(0, 0%, 50%)",
  Other: "hsl(0, 0%, 45%)",
};

function getColorForRegion(region: string, pct: number): string {
  if (pct === 0) return "hsl(var(--muted) / 0.4)";
  return REGION_COLORS[region] || "hsl(210, 40%, 60%)";
}

function getColorForPercentage(pct: number): string {
  if (pct >= 20) return "hsl(210, 85%, 30%)";
  if (pct >= 10) return "hsl(210, 75%, 40%)";
  if (pct >= 5) return "hsl(210, 60%, 48%)";
  if (pct >= 2) return "hsl(210, 50%, 58%)";
  if (pct > 0) return "hsl(210, 40%, 68%)";
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
                style={{ backgroundColor: REGION_COLORS[r.region] || getColorForPercentage(r.percentage) }}
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
