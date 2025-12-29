import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartConfig {
  type?: 'line' | 'bar' | 'area' | 'pie';
  data?: Array<Record<string, unknown>>;
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  title?: string;
  subtitle?: string;
}

interface ReportChartProps {
  config?: Record<string, unknown>;
}

const DEFAULT_COLORS = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6'];

const ReportChart = ({ config }: ReportChartProps) => {
  const chartConfig = config as ChartConfig | undefined;
  
  const {
    type = 'line',
    data = [],
    dataKey = 'value',
    xAxisKey = 'name',
    colors = DEFAULT_COLORS,
    height = 300,
    showGrid = true,
    showLegend = true,
  } = chartConfig || {};

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Demo data if none provided
      return [
        { name: 'Jan', value: 100, secondary: 80 },
        { name: 'Feb', value: 120, secondary: 95 },
        { name: 'Mar', value: 115, secondary: 88 },
        { name: 'Apr', value: 140, secondary: 110 },
        { name: 'May', value: 160, secondary: 125 },
        { name: 'Jun', value: 155, secondary: 140 },
      ];
    }
    return data;
  }, [data]);

  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />}
            <XAxis dataKey={xAxisKey} stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            {showLegend && <Legend />}
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />}
            <XAxis dataKey={xAxisKey} stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              fill="url(#colorGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey={dataKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />}
            <XAxis dataKey={xAxisKey} stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors[0] }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
