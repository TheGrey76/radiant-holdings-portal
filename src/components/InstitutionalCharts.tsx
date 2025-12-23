import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  ReferenceArea
} from "recharts";

// Institutional color palette - muted and sophisticated
const COLORS = {
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
  border: "hsl(var(--border))",
  card: "hsl(var(--card))",
  foreground: "hsl(var(--foreground))",
  positive: "#10b981",
  negative: "#ef4444",
  neutral: "#6b7280",
};

// Custom Axis Tick
const CustomAxisTick = ({ x, y, payload, isY = false }: any) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={isY ? -10 : 0}
      y={isY ? 4 : 16}
      textAnchor={isY ? "end" : "middle"}
      fill="hsl(var(--muted-foreground))"
      fontSize={11}
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight={500}
    >
      {payload.value}
    </text>
  </g>
);

// Institutional Tooltip
const InstitutionalTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "", title }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 min-w-[180px]">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border/50">
        {title || label}
      </p>
      <div className="space-y-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {valuePrefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart Container with title and source
interface ChartContainerProps {
  title: string;
  subtitle?: string;
  source?: string;
  figure?: string;
  children: React.ReactNode;
  annotations?: { text: string; position: 'left' | 'right' }[];
}

export const ChartContainer = ({ title, subtitle, source, figure, children, annotations }: ChartContainerProps) => (
  <div className="my-12 relative">
    <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold text-foreground tracking-tight">{title}</h4>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {annotations && (
            <div className="flex gap-4">
              {annotations.map((ann, i) => (
                <div key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {ann.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="px-6 py-6">
        {children}
      </div>

      {/* Footer */}
      {(source || figure) && (
        <div className="px-6 pb-4 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
              {figure}
            </p>
            {source && (
              <p className="text-[10px] text-muted-foreground/70">
                Source: {source}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Bitcoin Price Chart - Historical
interface PriceChartProps {
  data: { year: string; price: number }[];
}

export const BitcoinPriceChart = ({ data }: PriceChartProps) => (
  <ChartContainer
    title="Bitcoin Price Evolution"
    subtitle="Log-scale representation of price development"
    figure="Figure 1 — Synthetic Bitcoin Price (2013–2025)"
    source="ARIES76 Analysis"
  >
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="1 0" 
          stroke="hsl(var(--border))" 
          opacity={0.4}
          vertical={false}
        />
        <XAxis 
          dataKey="year" 
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickLine={false}
          tick={<CustomAxisTick />}
          dy={5}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={<CustomAxisTick isY />}
          tickFormatter={(value) => `$${value}k`}
          width={50}
        />
        <Tooltip 
          content={<InstitutionalTooltip valuePrefix="$" valueSuffix="k" />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        {/* Halving events as reference lines */}
        <ReferenceLine x="2016" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
        <ReferenceLine x="2020" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
        <ReferenceLine x="2024" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fill="url(#priceGradient)"
          name="BTC Price"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: 'hsl(var(--primary))', 
            strokeWidth: 2,
            fill: 'hsl(var(--card))'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// M2 Liquidity Chart
interface M2ChartProps {
  data: { year: string; m2: number }[];
}

export const M2LiquidityChart = ({ data }: M2ChartProps) => (
  <ChartContainer
    title="Global M2 Liquidity Index"
    subtitle="Indexed to 2013 = 100"
    figure="Figure 2 — Global M2 Liquidity Proxy (2013–2025)"
    source="Central Bank Data, ARIES76 Composite"
  >
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="m2Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2}/>
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="1 0" 
          stroke="hsl(var(--border))" 
          opacity={0.4}
          vertical={false}
        />
        {/* QE periods highlighted */}
        <ReferenceArea x1="2020" x2="2021" fill="hsl(var(--accent))" fillOpacity={0.05} />
        <XAxis 
          dataKey="year" 
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickLine={false}
          tick={<CustomAxisTick />}
          dy={5}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={<CustomAxisTick isY />}
          domain={[90, 230]}
          width={45}
        />
        <Tooltip 
          content={<InstitutionalTooltip title="M2 Index" />}
          cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
        <Area 
          type="monotone" 
          dataKey="m2" 
          stroke="hsl(var(--accent))" 
          strokeWidth={2}
          fill="url(#m2Gradient)"
          name="M2 Index"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: 'hsl(var(--accent))', 
            strokeWidth: 2,
            fill: 'hsl(var(--card))'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// Real Rates Chart
interface RealRatesChartProps {
  data: { year: string; rate: number }[];
}

export const RealRatesChart = ({ data }: RealRatesChartProps) => (
  <ChartContainer
    title="U.S. Real Interest Rates"
    subtitle="10Y Treasury minus Core CPI"
    figure="Figure 3 — Real Rates Regime (2013–2025)"
    source="Federal Reserve, BLS"
  >
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="positiveRates" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15}/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="negativeRates" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="1 0" 
          stroke="hsl(var(--border))" 
          opacity={0.4}
          vertical={false}
        />
        {/* Negative rates zone - favorable for BTC */}
        <ReferenceArea y1={-5} y2={0} fill="#10b981" fillOpacity={0.03} />
        <XAxis 
          dataKey="year" 
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickLine={false}
          tick={<CustomAxisTick />}
          dy={5}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={<CustomAxisTick isY />}
          tickFormatter={(value) => `${value}%`}
          domain={[-5, 3]}
          width={45}
        />
        <Tooltip 
          content={<InstitutionalTooltip valueSuffix="%" title="Real Rate" />}
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        {/* Zero line */}
        <ReferenceLine 
          y={0} 
          stroke="hsl(var(--foreground))" 
          strokeWidth={1.5}
          label={{ 
            value: '0%', 
            position: 'right', 
            fill: 'hsl(var(--muted-foreground))',
            fontSize: 10
          }}
        />
        <Area 
          type="monotone" 
          dataKey="rate" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth={2}
          fill="url(#positiveRates)"
          name="Real Rate"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: 'hsl(var(--muted-foreground))', 
            strokeWidth: 2,
            fill: 'hsl(var(--card))'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// Price Scenarios Chart
interface ScenarioChartProps {
  data: { month: string; base: number; high: number; stress: number }[];
}

export const PriceScenariosChart = ({ data }: ScenarioChartProps) => (
  <ChartContainer
    title="2026 Price Scenario Analysis"
    subtitle="Monthly progression under three macro regimes"
    figure="Figure 4 — Price Scenarios (Base, Bull, Stress)"
    source="ARIES76 Quantitative Model"
    annotations={[
      { text: 'Base 60%', position: 'right' },
      { text: 'Bull 25%', position: 'right' },
      { text: 'Stress 15%', position: 'right' },
    ]}
  >
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.12}/>
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12}/>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="1 0" 
          stroke="hsl(var(--border))" 
          opacity={0.4}
          vertical={false}
        />
        <XAxis 
          dataKey="month" 
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickLine={false}
          tick={<CustomAxisTick />}
          dy={5}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={<CustomAxisTick isY />}
          tickFormatter={(value) => `$${value}k`}
          domain={[40, 280]}
          width={50}
        />
        <Tooltip 
          content={<InstitutionalTooltip valuePrefix="$" valueSuffix="k" title="2026 Scenarios" />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
        <Area 
          type="monotone" 
          dataKey="high" 
          stroke="hsl(var(--accent))" 
          strokeWidth={2}
          fill="url(#highGradient)"
          name="Bull Case"
          dot={false}
        />
        <Area 
          type="monotone" 
          dataKey="base" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fill="url(#baseGradient)"
          name="Base Case"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="stress" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth={1.5}
          strokeDasharray="4 4"
          name="Stress Case"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

// ETF Flow Chart
interface ETFFlowChartProps {
  data: { week: string; inflows: number; outflows: number }[];
}

export const ETFFlowChart = ({ data }: ETFFlowChartProps) => {
  // Calculate net flows for each data point
  const dataWithNet = data.map(d => ({
    ...d,
    net: d.inflows - d.outflows
  }));

  return (
    <ChartContainer
      title="Weekly ETF Flow Dynamics"
      subtitle="Institutional capital movement via regulated vehicles"
      figure="Figure 5 — ETF Inflows vs Outflows"
      source="Bloomberg, ETF Providers"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={dataWithNet} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid 
            strokeDasharray="1 0" 
            stroke="hsl(var(--border))" 
            opacity={0.4}
            vertical={false}
          />
          <XAxis 
            dataKey="week" 
            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tickLine={false}
            tick={<CustomAxisTick />}
            dy={5}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={<CustomAxisTick isY />}
            tickFormatter={(value) => `$${value}M`}
            width={55}
          />
          <Tooltip 
            content={<InstitutionalTooltip valuePrefix="$" valueSuffix="M" title="ETF Flows" />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
          <Bar 
            dataKey="inflows" 
            fill="hsl(var(--primary))" 
            name="Inflows"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="outflows" 
            fill="hsl(var(--muted-foreground))" 
            name="Outflows"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
            opacity={0.6}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Mining Economics Chart
interface MiningChartProps {
  data: { quarter: string; cost: number; price: number }[];
}

export const MiningEconomicsChart = ({ data }: MiningChartProps) => (
  <ChartContainer
    title="Mining Economics: Cost vs Price"
    subtitle="Production cost floor as price support"
    figure="Figure 6 — Mining Profitability Analysis"
    source="ARIES76 Mining Model"
  >
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="1 0" 
          stroke="hsl(var(--border))" 
          opacity={0.4}
          vertical={false}
        />
        <XAxis 
          dataKey="quarter" 
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickLine={false}
          tick={<CustomAxisTick />}
          dy={5}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={<CustomAxisTick isY />}
          tickFormatter={(value) => `$${value}k`}
          domain={[30, 150]}
          width={50}
        />
        <Tooltip 
          content={<InstitutionalTooltip valuePrefix="$" valueSuffix="k" title="Mining Economics" />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fill="url(#marginGradient)"
          name="BTC Price"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="cost" 
          stroke="#ef4444" 
          strokeWidth={2}
          strokeDasharray="6 3"
          name="Mining Cost"
          dot={{ fill: '#ef4444', r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);
