import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Minus, Target, Calendar, TrendingUpIcon } from "lucide-react";
import { KPISnapshot, useKPIHistory } from "@/hooks/useKPIHistory";
import { ABCNetworkGraph } from "@/components/ABCNetworkGraph";

type TimeRange = "7d" | "30d" | "90d" | "all";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  categoria: string;
  citta?: string;
  status: string;
  pipelineValue: number;
  approvalStatus: string;
}

interface ABCAnalyticsTabProps {
  investors?: Investor[];
}

export function ABCAnalyticsTab({ investors = [] }: ABCAnalyticsTabProps) {
  const { history, getSnapshotsForRange, calculateTrend, forecastValue, predictTargetDate } = useKPIHistory();
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

  // Generate forecasts
  const forecast30Days = data.length >= 2 ? {
    raisedAmount: forecastValue(data, (s) => s.raisedAmount, 30),
    pipelineValue: forecastValue(data, (s) => s.pipelineValue, 30),
    closedDeals: forecastValue(data, (s) => s.closedDealsCount, 30),
    meetings: forecastValue(data, (s) => s.meetingsCount, 30),
  } : null;

  const forecast60Days = data.length >= 2 ? {
    raisedAmount: forecastValue(data, (s) => s.raisedAmount, 60),
    pipelineValue: forecastValue(data, (s) => s.pipelineValue, 60),
    closedDeals: forecastValue(data, (s) => s.closedDealsCount, 60),
    meetings: forecastValue(data, (s) => s.meetingsCount, 60),
  } : null;

  // Predict target completion dates
  const targetAmount = data.length > 0 ? data[data.length - 1].targetAmount : 10000000;
  const targetMeetings = data.length > 0 ? data[data.length - 1].meetingsTarget : 50;
  
  const fundraisingCompletionDate = data.length >= 2 ? predictTargetDate(data, (s) => s.raisedAmount, targetAmount) : null;
  const meetingsCompletionDate = data.length >= 2 ? predictTargetDate(data, (s) => s.meetingsCount, targetMeetings) : null;

  // Prepare chart data with forecasts
  const chartData = data.map((snapshot) => ({
    date: formatDate(snapshot.date),
    rawDate: snapshot.date,
    raisedAmount: snapshot.raisedAmount,
    pipelineValue: snapshot.pipelineValue,
    closedDeals: snapshot.closedDealsCount,
    closedValue: snapshot.closedDealsValue,
    meetings: snapshot.meetingsCount,
  }));

  // Add forecast data points
  if (forecast30Days && data.length > 0) {
    const lastDate = new Date(data[data.length - 1].date);
    const forecast30Date = new Date(lastDate);
    forecast30Date.setDate(forecast30Date.getDate() + 30);
    
    chartData.push({
      date: formatDate(forecast30Date.toISOString().split("T")[0]),
      rawDate: forecast30Date.toISOString().split("T")[0],
      raisedAmount: forecast30Days.raisedAmount ?? 0,
      pipelineValue: forecast30Days.pipelineValue ?? 0,
      closedDeals: forecast30Days.closedDeals ?? 0,
      closedValue: 0,
      meetings: forecast30Days.meetings ?? 0,
    });
  }

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

  const formatPredictionDate = (dateStr: string | null) => {
    if (!dateStr) return "Insufficient data";
    if (dateStr === "Target reached") return dateStr;
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }).format(date);
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
          <p className="text-muted-foreground">Track KPI trends and predictive forecasting</p>
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

      {/* Forecast Summary Cards */}
      {forecast30Days && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Target Completion</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {fundraisingCompletionDate && fundraisingCompletionDate !== "Target reached" 
                  ? new Date(fundraisingCompletionDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  : fundraisingCompletionDate || "Calculating..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated €{targetAmount.toLocaleString()} fundraising completion
              </p>
              {fundraisingCompletionDate && fundraisingCompletionDate !== "Target reached" && fundraisingCompletionDate !== "Insufficient data" && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {Math.ceil((new Date(fundraisingCompletionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">30-Day Forecast</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(forecast30Days.raisedAmount ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Projected raised amount</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Pipeline: {formatCurrency(forecast30Days.pipelineValue ?? 0)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">60-Day Forecast</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(forecast60Days?.raisedAmount ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Extended projection</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {Math.round(((forecast60Days?.raisedAmount ?? 0) / targetAmount) * 100)}% of target
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fundraising Progress Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fundraising Progress with Forecast</CardTitle>
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
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                formatter={(value: number) => [formatCurrency(value), "Raised"]}
              />
              <ReferenceLine y={targetAmount} stroke="#10b981" strokeDasharray="3 3" label="Target" />
              <Area
                type="monotone"
                dataKey="raisedAmount"
                stroke="#ff6b35"
                strokeWidth={2}
                fill="url(#raisedGradient)"
                connectNulls
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

      {/* Network Graph */}
      {investors.length > 0 && (
        <ABCNetworkGraph investors={investors} />
      )}
    </div>
  );
}
