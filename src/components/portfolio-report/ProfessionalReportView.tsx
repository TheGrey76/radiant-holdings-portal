import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Shield, 
  PieChart, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Target,
  BarChart3,
  Zap,
  Info,
  Download,
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
} from 'recharts';
import { cn } from '@/lib/utils';

interface SectorBreakdownItem {
  sector: string;
  weight: number;
  holdings: string[];
  riskContribution: number;
}

interface ScenarioResult {
  id: string;
  name: string;
  description: string;
  portfolioImpact: number;
  impactByHolding: { ticker: string; impact: number }[];
}

interface ProfessionalReport {
  reportType: string;
  generatedAt: string;
  holdingsAnalyzed: number;
  riskOverview: {
    riskScore: number;
    riskLevel: string;
    diversificationScore: number;
    concentrationRisk: {
      level: string;
      score: number;
      topSector: string;
    };
  };
  sectorBreakdown: SectorBreakdownItem[];
  scenarioAnalysis: {
    scenarios: ScenarioResult[];
    worstCase: { scenario: string; impact: number };
    bestCase: { scenario: string; impact: number };
    stressTestSummary: string;
  };
  monteCarlo: {
    percentiles: {
      p5: string;
      p25: string;
      p50: string;
      p75: string;
      p95: string;
    };
    probabilityOfLoss: string;
    expectedValue: string;
  };
  isPurchased: boolean;
}

interface ProfessionalReportViewProps {
  report: ProfessionalReport;
  email?: string;
}

const SECTOR_COLORS: Record<string, string> = {
  'Technology': '#3b82f6',
  'Healthcare': '#22c55e',
  'Financials': '#a855f7',
  'Consumer Cyclical': '#ec4899',
  'Consumer Defensive': '#f59e0b',
  'Energy': '#f97316',
  'Communication Services': '#6366f1',
  'Broad Market ETF': '#06b6d4',
  'Tech ETF': '#3b82f6',
  'Bond ETF': '#10b981',
  'Commodity ETF': '#eab308',
  'Real Estate ETF': '#8b5cf6',
  'Cryptocurrency': '#fbbf24',
  'Custom': '#6b7280',
};

export const ProfessionalReportView: React.FC<ProfessionalReportViewProps> = ({ report, email }) => {
  const { riskOverview, sectorBreakdown, scenarioAnalysis, monteCarlo } = report;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Conservative': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Moderate': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Aggressive': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 10) return '#22c55e';
    if (impact > 0) return '#86efac';
    if (impact > -10) return '#fbbf24';
    if (impact > -20) return '#f97316';
    return '#ef4444';
  };

  // Prepare pie chart data
  const pieData = sectorBreakdown.map(s => ({
    name: s.sector,
    value: s.weight,
    color: SECTOR_COLORS[s.sector] || SECTOR_COLORS['Custom'],
  }));

  // Prepare scenario chart data
  const scenarioChartData = scenarioAnalysis.scenarios.map(s => ({
    name: s.name.split(' ')[0],
    impact: s.portfolioImpact,
    fullName: s.name,
  }));

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Portfolio Professional Report
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              PROFESSIONAL
            </Badge>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Generated {new Date(report.generatedAt).toLocaleDateString()} • 
            {report.holdingsAnalyzed} holdings analyzed
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-3xl font-bold">{riskOverview.riskScore}</p>
                <Badge className={`mt-2 ${getRiskColor(riskOverview.riskLevel)}`}>
                  {riskOverview.riskLevel}
                </Badge>
              </div>
              <Shield className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diversification</p>
                <p className="text-3xl font-bold">{riskOverview.diversificationScore}</p>
                <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              </div>
              <PieChart className="h-10 w-10 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Worst Case</p>
                <p className="text-3xl font-bold text-red-400">
                  {scenarioAnalysis.worstCase.impact.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{scenarioAnalysis.worstCase.scenario}</p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Case</p>
                <p className="text-3xl font-bold text-emerald-400">
                  +{scenarioAnalysis.bestCase.impact.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{scenarioAnalysis.bestCase.scenario}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-400" />
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background/95 border rounded-lg p-2 shadow-xl">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">{data.value.toFixed(1)}%</p>
                        </div>
                      );
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Sector Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectorBreakdown.slice(0, 6).map((sector, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: SECTOR_COLORS[sector.sector] || SECTOR_COLORS['Custom'] }}
                    />
                    <span className="font-medium">{sector.sector}</span>
                    <span className="text-muted-foreground text-xs">
                      ({sector.holdings.join(', ')})
                    </span>
                  </div>
                  <span className="font-bold">{sector.weight.toFixed(1)}%</span>
                </div>
                <Progress value={sector.weight} className="h-1.5" />
              </div>
            ))}
            
            {/* Concentration Warning */}
            {riskOverview.concentrationRisk.level !== 'Low' && (
              <div className={cn(
                "mt-4 p-3 rounded-lg border flex items-start gap-2",
                riskOverview.concentrationRisk.level === 'High' 
                  ? "bg-red-500/10 border-red-500/30" 
                  : "bg-amber-500/10 border-amber-500/30"
              )}>
                <AlertTriangle className={cn(
                  "h-4 w-4 mt-0.5",
                  riskOverview.concentrationRisk.level === 'High' ? "text-red-400" : "text-amber-400"
                )} />
                <div className="text-sm">
                  <p className="font-medium">
                    {riskOverview.concentrationRisk.level} Concentration Risk
                  </p>
                  <p className="text-muted-foreground">
                    {riskOverview.concentrationRisk.topSector} represents a significant portion of your portfolio.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Stress Test Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  domain={[-50, 50]}
                  tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                  className="text-xs"
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  className="text-xs"
                />
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    const scenario = scenarioAnalysis.scenarios.find(s => s.name === data.fullName);
                    return (
                      <div className="bg-background/95 border rounded-lg p-3 shadow-xl max-w-xs">
                        <p className="font-medium">{data.fullName}</p>
                        <p className="text-sm text-muted-foreground mb-2">{scenario?.description}</p>
                        <p className={cn(
                          "text-lg font-bold",
                          data.impact >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {data.impact >= 0 ? '+' : ''}{data.impact.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {scenarioChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getImpactColor(entry.impact)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stress Test Summary */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Stress Test Summary</p>
                <p className="text-sm text-muted-foreground">{scenarioAnalysis.stressTestSummary}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monte Carlo Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            5-Year Projection Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-xs text-muted-foreground mb-1">Worst (P5)</p>
              <p className="text-xl font-bold text-red-400">{monteCarlo.percentiles.p5}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <p className="text-xs text-muted-foreground mb-1">Conservative</p>
              <p className="text-xl font-bold text-orange-400">{monteCarlo.percentiles.p25}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Median</p>
              <p className="text-2xl font-bold text-primary">{monteCarlo.percentiles.p50}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <p className="text-xs text-muted-foreground mb-1">Optimistic</p>
              <p className="text-xl font-bold text-emerald-400">{monteCarlo.percentiles.p75}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <p className="text-xs text-muted-foreground mb-1">Best (P95)</p>
              <p className="text-xl font-bold text-emerald-400">{monteCarlo.percentiles.p95}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-8 text-sm">
            <div>
              <span className="text-muted-foreground">Probability of Loss:</span>
              <span className="font-bold text-amber-400 ml-2">{monteCarlo.probabilityOfLoss}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Expected Value:</span>
              <span className="font-bold text-primary ml-2">{monteCarlo.expectedValue}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 flex gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          This report is for informational purposes only and does not constitute investment advice. 
          Scenario analysis is based on historical patterns and may not reflect future market conditions.
          Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalReportView;
