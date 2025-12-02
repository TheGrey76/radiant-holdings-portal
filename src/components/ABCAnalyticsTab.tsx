import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { KPISnapshot, useKPIHistory } from "@/hooks/useKPIHistory";

type TimeRange = "7d" | "30d" | "90d" | "all";

export function ABCAnalyticsTab() {
  const { history, getSnapshotsForRange, calculateTrend } = useKPIHistory();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  // Get data for selected time range
  const getData = (): KPISnapshot[] => {
    if (timeRange === "all") return history;
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return getSnapshotsForRange(days);
  };

  const data = getData();

  // Calculate trends
  const raisedTrend = calculateTrend(data.map((d) => d.raisedAmount));
  const pipelineTrend = calculateTrend(data.map((d) => d.pipelineValue));
  const closedTrend = calculateTrend(data.map((d) => d.closedDealsCount));
  const meetingsTrend = calculateTrend(data.map((d) => d.meetingsCount));

  // Format date for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", { month: "short", day: "numeric" }).format(date);
  };

  // Format currency for chart
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
    return `€${value}`;
  };

  // Prepare chart data
  const chartData = data.map((snapshot) => ({
    date: formatDate(snapshot.date),
    raisedAmount: snapshot.raisedAmount,
    pipelineValue: snapshot.pipelineValue,
    closedDeals: snapshot.closedDealsCount,
    closedValue: snapshot.closedDealsValue,
    meetings: snapshot.meetingsCount,
  }));

  const TrendIndicator = ({ trend }: { trend: ReturnType<typeof calculateTrend> }) => {
    const Icon = trend.direction === "up" ? TrendingUp : trend.direction === "down" ? TrendingDown : Minus;
    const color = trend.direction === "up" ? "text-green-600" : trend.direction === "down" ? "text-red-600" : "text-muted-foreground";
    
    return (
      <div className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{trend.change.toFixed(1)}%</span>
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Track KPI trends and progress over time</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No historical data available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                KPI snapshots are captured automatically once per day. Check back tomorrow to see your first data point.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track KPI trends and progress over time</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
          >
            90 Days
          </Button>
          <Button
            variant={timeRange === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Fundraising Progress Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fundraising Progress</CardTitle>
            <TrendIndicator trend={raisedTrend} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="raisedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                formatter={(value: number) => [formatCurrency(value), "Raised"]}
              />
              <Area
                type="monotone"
                dataKey="raisedAmount"
                stroke="#ff6b35"
                strokeWidth={2}
                fill="url(#raisedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pipeline Value Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline Value</CardTitle>
            <TrendIndicator trend={pipelineTrend} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                formatter={(value: number) => [formatCurrency(value), "Pipeline"]}
              />
              <Line
                type="monotone"
                dataKey="pipelineValue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Closed Deals & Meetings Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closed Deals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Closed Deals</CardTitle>
              <TrendIndicator trend={closedTrend} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                  formatter={(value: number, name: string) => [
                    name === "closedDeals" ? value : formatCurrency(value),
                    name === "closedDeals" ? "Count" : "Value"
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="closedDeals"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#closedGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="closedValue"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: "#059669", r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meetings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Meetings Scheduled</CardTitle>
              <TrendIndicator trend={meetingsTrend} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="meetingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                  formatter={(value: number) => [value, "Meetings"]}
                />
                <Area
                  type="monotone"
                  dataKey="meetings"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#meetingsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
