import { useMemo } from "react";
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
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Json } from "@/integrations/supabase/types";

interface ChartConfig {
  type: 'line' | 'area' | 'bar';
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
}

interface ReportChartProps {
  config: Json | null;
}

export const ReportChart = ({ config }: ReportChartProps) => {
  const chartConfig = useMemo(() => {
    if (!config || typeof config !== 'object') return null;
    return config as unknown as ChartConfig;
  }, [config]);

  if (!chartConfig || !chartConfig.data || !chartConfig.yKeys) {
    return (
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-6 text-center text-muted-foreground">
          Chart configuration not available
        </CardContent>
      </Card>
    );
  }

  const { type, data, xKey, yKeys, showGrid = true, showLegend = true } = chartConfig;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const axisProps = {
      stroke: "hsl(var(--muted-foreground))",
      fontSize: 12,
      tickLine: false,
      axisLine: false,
    };

    const tooltipStyle = {
      contentStyle: {
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "8px",
        color: "hsl(var(--foreground))",
      },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {yKeys.map((yKey, index) => (
              <Area
                key={yKey.key}
                type="monotone"
                dataKey={yKey.key}
                name={yKey.name}
                stroke={yKey.color}
                fill={yKey.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {yKeys.map((yKey) => (
              <Bar
                key={yKey.key}
                dataKey={yKey.key}
                name={yKey.name}
                fill={yKey.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {yKeys.map((yKey) => (
              <Line
                key={yKey.key}
                type="monotone"
                dataKey={yKey.key}
                name={yKey.name}
                stroke={yKey.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: yKey.color }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
