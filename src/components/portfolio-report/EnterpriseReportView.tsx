import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  FileText,
  Building2,
  Sparkles,
  Target,
  Scale,
  Lightbulb
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EnterpriseReportViewProps {
  report: any;
  email: string;
}

export const EnterpriseReportView = ({ report, email }: EnterpriseReportViewProps) => {
  const { 
    executiveSummary, 
    institutionalStressTests, 
    taxOptimization, 
    regulatoryCompliance,
    aiRecommendations 
  } = report;

  const stressTestColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  const getStatusColor = (status: string) => {
    if (status === 'pass' || status === 'Fully Compliant') return 'text-green-500';
    if (status === 'warning' || status === 'Generally Compliant') return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'pass' || status === 'Fully Compliant') return 'bg-green-500/10';
    if (status === 'warning' || status === 'Generally Compliant') return 'bg-amber-500/10';
    return 'bg-red-500/10';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-600 border-red-200';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-600 border-amber-200';
    return 'bg-blue-500/10 text-blue-600 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-500">
            <Building2 className="h-6 w-6" />
            Enterprise Portfolio Report
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Institutional-grade analysis for {email}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-background border">
              <p className="text-3xl font-bold">{executiveSummary.riskScore}</p>
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <Badge variant="outline" className="mt-1">{executiveSummary.riskLevel}</Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border">
              <p className="text-3xl font-bold">{executiveSummary.resilienceScore}</p>
              <p className="text-xs text-muted-foreground">Resilience</p>
              <Badge variant="outline" className="mt-1">{executiveSummary.resilienceRating}</Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border">
              <p className="text-3xl font-bold">{executiveSummary.taxEfficiencyScore}%</p>
              <p className="text-xs text-muted-foreground">Tax Efficiency</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border">
              <p className="text-3xl font-bold">{executiveSummary.complianceScore}</p>
              <p className="text-xs text-muted-foreground">Compliance</p>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(executiveSummary.complianceStatus)}`}>
                {executiveSummary.complianceStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm bg-muted/50 p-4 rounded-lg">{aiRecommendations.summary}</p>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Action Items
            </h4>
            {aiRecommendations.actionItems.map((item: any, idx: number) => (
              <div key={idx} className={`p-3 rounded-lg border ${getPriorityColor(item.priority)}`}>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs capitalize">{item.priority}</Badge>
                  <div>
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {aiRecommendations.optimizationSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Optimization Suggestions
              </h4>
              <ul className="space-y-1">
                {aiRecommendations.optimizationSuggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Institutional Stress Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Institutional Stress Testing
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Historical crisis scenarios and portfolio impact
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-2xl font-bold text-red-500">
                {institutionalStressTests.worstHistoricalCase.impact.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Worst Case</p>
              <p className="text-xs mt-1">{institutionalStressTests.worstHistoricalCase.scenario}</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-2xl font-bold text-amber-500">
                {institutionalStressTests.averageDrawdown.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Average Drawdown</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-2xl font-bold text-blue-500">
                {institutionalStressTests.resilience.score}
              </p>
              <p className="text-xs text-muted-foreground">Resilience Score</p>
              <Badge variant="outline" className="mt-1">{institutionalStressTests.resilience.rating}</Badge>
            </div>
          </div>

          {/* Stress Test Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={institutionalStressTests.historicalScenarios.map((s: any) => ({
                  name: s.name.split(' ')[0],
                  impact: s.portfolioImpact,
                  market: s.marketDrawdown,
                }))}
                layout="vertical"
              >
                <XAxis type="number" domain={[-80, 20]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelFormatter={(label) => `Scenario: ${label}`}
                />
                <Legend />
                <Bar dataKey="impact" name="Your Portfolio" fill="#f97316" />
                <Bar dataKey="market" name="Market" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario Details */}
          <div className="space-y-2">
            {institutionalStressTests.historicalScenarios.slice(0, 3).map((scenario: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{scenario.name}</p>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Duration: {scenario.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${scenario.portfolioImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {scenario.portfolioImpact.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Est. recovery: {scenario.recoveryEstimate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-green-500" />
            Tax Optimization Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">{taxOptimization.efficiencyScore}%</p>
              <p className="text-sm text-muted-foreground">Tax Efficiency Score</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-lg font-bold text-blue-500">{taxOptimization.potentialSavings}</p>
              <p className="text-sm text-muted-foreground">Potential Annual Savings</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recommendations</h4>
            {taxOptimization.recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Asset Location Suggestions</h4>
            <div className="grid gap-2">
              {taxOptimization.assetLocationSuggestions.slice(0, 5).map((item: any, idx: number) => (
                <div key={idx} className="p-2 rounded border bg-muted/30 text-sm">
                  <span className="font-mono font-medium">{item.ticker}</span>
                  <span className="text-muted-foreground ml-2">→ {item.suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Regulatory Compliance Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${getStatusBgColor(regulatoryCompliance.overallStatus.status)} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{regulatoryCompliance.overallStatus.status}</p>
                <p className="text-sm text-muted-foreground">Overall Compliance Status</p>
              </div>
              <p className="text-3xl font-bold">{regulatoryCompliance.overallStatus.score}</p>
            </div>
          </div>

          <div className="space-y-2">
            {regulatoryCompliance.checks.map((check: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  {check.status === 'pass' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium text-sm">{check.name}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(check.status)}>
                  {check.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Jurisdiction Notes
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {regulatoryCompliance.jurisdictionNotes.map((note: string, idx: number) => (
                <li key={idx}>• {note}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Enterprise Report generated on {new Date(report.generatedAt).toLocaleString()}</p>
        <p className="mt-1">For institutional use. Contact research@aries76.com for custom analysis.</p>
      </div>
    </div>
  );
};
