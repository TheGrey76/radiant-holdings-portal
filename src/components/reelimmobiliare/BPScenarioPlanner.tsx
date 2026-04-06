import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Users, Building2,
  Save, RotateCcw, Download, Info, Euro, Target,
  ChevronDown, ChevronUp, BarChart3, PieChart as PieChartIcon
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BPInputs {
  // Agency growth
  agenzie2026: number;
  agenzie2027: number;
  agenzie2028: number;
  gratuite: number;
  // Pricing
  prezzoBase: number;
  prezzoCompleto: number;
  mesiMediPagamento: number;
  // Costs
  piattaforma: [number, number, number];
  sviluppo: [number, number, number];
  personale: [number, number, number];
  marketing: [number, number, number];
  legale: [number, number, number];
  speseGenerali: [number, number, number];
  // Investment
  speseGiaSostenute: number;
  budgetPreLancio: number;
  // CAC
  cac: [number, number, number];
}

interface Scenario {
  name: string;
  inputs: BPInputs;
  timestamp: number;
}

const defaultInputs: BPInputs = {
  agenzie2026: 100, agenzie2027: 500, agenzie2028: 3500, gratuite: 50,
  prezzoBase: 149, prezzoCompleto: 249, mesiMediPagamento: 6,
  piattaforma: [12000, 18000, 36000],
  sviluppo: [25000, 40000, 80000],
  personale: [50000, 120000, 300000],
  marketing: [30000, 80000, 200000],
  legale: [10000, 15000, 25000],
  speseGenerali: [15000, 25000, 50000],
  speseGiaSostenute: 29126, budgetPreLancio: 30000,
  cac: [300, 160, 57],
};

const STORAGE_KEY = "reel_bp_scenarios";
const CURRENT_KEY = "reel_bp_current";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M €`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k €`;
  return `${n.toLocaleString("it-IT")} €`;
};

const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

const COLORS = {
  revenue: "hsl(142, 71%, 45%)",
  costs: "hsl(0, 84%, 60%)",
  ebitda: "hsl(217, 91%, 60%)",
  agencies: "hsl(262, 83%, 58%)",
  positive: "hsl(142, 71%, 45%)",
  negative: "hsl(0, 84%, 60%)",
  base: "hsl(217, 91%, 60%)",
  completo: "hsl(262, 83%, 58%)",
  piattaforma: "hsl(199, 89%, 48%)",
  sviluppo: "hsl(262, 83%, 58%)",
  personale: "hsl(25, 95%, 53%)",
  marketing: "hsl(340, 82%, 52%)",
  legale: "hsl(142, 71%, 45%)",
  generali: "hsl(45, 93%, 47%)",
};

const PIE_COLORS = [
  COLORS.piattaforma, COLORS.sviluppo, COLORS.personale,
  COLORS.marketing, COLORS.legale, COLORS.generali,
];

// ─── Calculation Engine ──────────────────────────────────────────────────────
function calculate(inputs: BPInputs) {
  const years = ["2026", "2027", "2028"];
  const agenzie = [inputs.agenzie2026, inputs.agenzie2027, inputs.agenzie2028];
  const g = inputs.gratuite;
  const exGratuite = [g, g, g]; // always 50 ex-free agencies at base price
  const nuoveCompleto = [
    Math.max(0, agenzie[0] - g),
    Math.max(0, agenzie[1] - g),
    Math.max(0, agenzie[2] - g),
  ];

  const ricaviBase = exGratuite.map(
    (a) => a * inputs.prezzoBase * inputs.mesiMediPagamento
  );
  const ricaviCompleto = nuoveCompleto.map(
    (a) => a * inputs.prezzoCompleto * inputs.mesiMediPagamento
  );
  const totaleRicavi = ricaviBase.map((r, i) => r + ricaviCompleto[i]);

  const costiPerCategoria = {
    piattaforma: inputs.piattaforma,
    sviluppo: inputs.sviluppo,
    personale: inputs.personale,
    marketing: inputs.marketing,
    legale: inputs.legale,
    speseGenerali: inputs.speseGenerali,
  };

  const totaleCosti = [0, 1, 2].map((i) =>
    Object.values(costiPerCategoria).reduce((sum, arr) => sum + arr[i], 0)
  );

  const ebitda = totaleRicavi.map((r, i) => r - totaleCosti[i]);
  const margineEbitda = ebitda.map((e, i) =>
    totaleRicavi[i] !== 0 ? e / totaleRicavi[i] : 0
  );

  const investimentoIniziale = inputs.speseGiaSostenute + inputs.budgetPreLancio;
  const cashFlowCumulato = ebitda.reduce<number[]>((acc, e, i) => {
    const prev = i === 0 ? -investimentoIniziale : acc[i - 1];
    acc.push(prev + e);
    return acc;
  }, []);

  const ricavoMedioPerAgenzia = totaleRicavi.map((r, i) =>
    agenzie[i] > 0 ? r / agenzie[i] : 0
  );
  const ltv = ricavoMedioPerAgenzia.map((r) => r * 2); // 24 months
  const ltvCac = ltv.map((l, i) => (inputs.cac[i] > 0 ? l / inputs.cac[i] : 0));

  // Break-even month estimate (simplified)
  const monthlyRevenue2026 = totaleRicavi[0] / 12;
  const monthlyCost2026 = totaleCosti[0] / 12;
  const netMonthly = monthlyRevenue2026 - monthlyCost2026;
  const breakEvenMonth = netMonthly > 0
    ? Math.ceil(investimentoIniziale / netMonthly)
    : null;

  return {
    years, agenzie, exGratuite, nuoveCompleto,
    ricaviBase, ricaviCompleto, totaleRicavi,
    costiPerCategoria, totaleCosti,
    ebitda, margineEbitda,
    investimentoIniziale, cashFlowCumulato,
    ricavoMedioPerAgenzia, ltv, ltvCac, breakEvenMonth,
  };
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({ title, value, subtitle, icon: Icon, trend, tooltip }: {
  title: string; value: string; subtitle?: string;
  icon: React.ElementType; trend?: "up" | "down" | "neutral"; tooltip?: string;
}) {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Target;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <motion.div
                  key={value}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {value}
                </motion.div>
                {subtitle && (
                  <div className={`flex items-center gap-1 mt-1 text-sm ${trendColor}`}>
                    <TrendIcon className="h-3 w-3" />
                    <span>{subtitle}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Editable Cost Row ───────────────────────────────────────────────────────
function CostInput({ label, values, onChange, tooltip }: {
  label: string;
  values: [number, number, number];
  onChange: (values: [number, number, number]) => void;
  tooltip?: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 items-center">
      <div className="flex items-center gap-1">
        <Label className="text-sm truncate">{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {[0, 1, 2].map((i) => (
        <Input
          key={i}
          type="number"
          value={values[i]}
          onChange={(e) => {
            const next = [...values] as [number, number, number];
            next[i] = Number(e.target.value) || 0;
            onChange(next);
          }}
          className="text-right text-sm h-9"
        />
      ))}
    </div>
  );
}

// ─── Milestones ──────────────────────────────────────────────────────────────
const milestones = [
  { date: "Apr 2026", text: "Lancio piattaforma MVP con 3-5 agenzie pilota" },
  { date: "Giu 2026", text: "50 agenzie registrate (piano gratuito)" },
  { date: "Set 2026", text: "Attivazione piano a pagamento per le prime 50 agenzie (149 €/mese)" },
  { date: "Dic 2026", text: "100 agenzie totali, prime dashboard analytics attive" },
  { date: "Mar 2027", text: "200 agenzie, lancio piano 249 € con analytics avanzate" },
  { date: "Giu 2027", text: "300 agenzie, prime integrazioni CRM" },
  { date: "Dic 2027", text: "500 agenzie, break-even operativo" },
  { date: "Giu 2028", text: "1.500 agenzie, lancio white-label per network" },
  { date: "Dic 2028", text: "3.500 agenzie, piattaforma pronta per licensing" },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BPScenarioPlanner() {
  const [inputs, setInputs] = useState<BPInputs>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_KEY);
      return stored ? JSON.parse(stored) : defaultInputs;
    } catch { return defaultInputs; }
  });

  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [compareIdx, setCompareIdx] = useState<number | null>(null);
  const [showCostDetail, setShowCostDetail] = useState(true);

  // Persist
  useEffect(() => {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  }, [scenarios]);

  const updateField = useCallback(<K extends keyof BPInputs>(key: K, value: BPInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const result = calculate(inputs);
  const compareResult = compareIdx !== null ? calculate(scenarios[compareIdx].inputs) : null;

  const saveScenario = () => {
    const name = prompt("Nome dello scenario:", `Scenario ${scenarios.length + 1}`);
    if (!name) return;
    setScenarios((prev) => [...prev, { name, inputs: { ...inputs }, timestamp: Date.now() }]);
    toast.success(`Scenario "${name}" salvato`);
  };

  const resetToDefault = () => {
    setInputs(defaultInputs);
    setCompareIdx(null);
    toast.info("Valori resettati al Business Plan originale");
  };

  const exportCSV = () => {
    const r = result;
    const rows = [
      ["Metrica", ...r.years],
      ["Agenzie", ...r.agenzie],
      ["Ricavi Totali", ...r.totaleRicavi],
      ["Costi Totali", ...r.totaleCosti],
      ["EBITDA", ...r.ebitda],
      ["Margine EBITDA %", ...r.margineEbitda.map((m) => (m * 100).toFixed(1) + "%")],
      ["Cash Flow Cumulato", ...r.cashFlowCumulato],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BP_ReelImmobiliare_Scenario.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV esportato");
  };

  // ─── Chart Data ──────────────────────────────────────────────────────────
  const overviewData = result.years.map((y, i) => ({
    year: y,
    ricavi: result.totaleRicavi[i],
    costi: result.totaleCosti[i],
    ebitda: result.ebitda[i],
    ...(compareResult ? {
      ricavi_cmp: compareResult.totaleRicavi[i],
      costi_cmp: compareResult.totaleCosti[i],
      ebitda_cmp: compareResult.ebitda[i],
    } : {}),
  }));

  const agencyData = result.years.map((y, i) => ({
    year: y,
    gratuite: result.exGratuite[i],
    complete: result.nuoveCompleto[i],
    totale: result.agenzie[i],
  }));

  const costBreakdown2028 = [
    { name: "Piattaforma", value: inputs.piattaforma[2] },
    { name: "Sviluppo", value: inputs.sviluppo[2] },
    { name: "Personale", value: inputs.personale[2] },
    { name: "Marketing", value: inputs.marketing[2] },
    { name: "Legale", value: inputs.legale[2] },
    { name: "Spese Generali", value: inputs.speseGenerali[2] },
  ];

  const cashFlowData = result.years.map((y, i) => ({
    year: y,
    cashFlow: result.cashFlowCumulato[i],
    ...(compareResult ? { cashFlow_cmp: compareResult.cashFlowCumulato[i] } : {}),
  }));

  const unitEconomicsData = result.years.map((y, i) => ({
    year: y,
    arpa: result.ricavoMedioPerAgenzia[i],
    cac: inputs.cac[i],
    ltv: result.ltv[i],
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <Badge variant="outline" className="text-xs tracking-wider uppercase">
          Business Plan Interattivo
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Scenario Planner — Piano a 3 Anni
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Modifica le ipotesi chiave e visualizza in tempo reale l'impatto sulle proiezioni finanziarie.
          Tutti i calcoli si aggiornano istantaneamente.
        </p>
      </motion.div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" size="sm" onClick={resetToDefault}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset BP Originale
        </Button>
        <Button variant="outline" size="sm" onClick={saveScenario}>
          <Save className="h-4 w-4 mr-1" /> Salva Scenario
        </Button>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Esporta CSV
        </Button>
        {scenarios.length > 0 && (
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Confronta:</Label>
            <select
              className="text-sm border rounded px-2 py-1 bg-background"
              value={compareIdx ?? ""}
              onChange={(e) => setCompareIdx(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">— nessuno —</option>
              {scenarios.map((s, i) => (
                <option key={i} value={i}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Ricavi 2028"
          value={fmt(result.totaleRicavi[2])}
          subtitle={result.totaleRicavi[2] > 0 ? "target" : ""}
          icon={Euro}
          trend={result.totaleRicavi[2] > 0 ? "up" : "neutral"}
          tooltip="Ricavi totali previsti per il terzo anno"
        />
        <KPICard
          title="EBITDA 2028"
          value={fmt(result.ebitda[2])}
          subtitle={fmtPct(result.margineEbitda[2]) + " margine"}
          icon={TrendingUp}
          trend={result.ebitda[2] > 0 ? "up" : "down"}
          tooltip="Utile operativo lordo anno 3"
        />
        <KPICard
          title="Agenzie 2028"
          value={result.agenzie[2].toLocaleString("it-IT")}
          subtitle={`da ${result.agenzie[0]} nel 2026`}
          icon={Building2}
          trend="up"
          tooltip="Numero totale agenzie abbonate"
        />
        <KPICard
          title="Break-even"
          value={result.breakEvenMonth ? `Mese ${result.breakEvenMonth}` : "N/D"}
          subtitle={result.breakEvenMonth && result.breakEvenMonth <= 12 ? "entro anno 1" : result.breakEvenMonth ? "dopo anno 1" : "non raggiunto"}
          icon={Target}
          trend={result.breakEvenMonth && result.breakEvenMonth <= 18 ? "up" : "down"}
          tooltip="Stima mesi al pareggio dall'avvio"
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="inputs" className="text-xs">Ipotesi</TabsTrigger>
          <TabsTrigger value="conto" className="text-xs">Conto Econ.</TabsTrigger>
          <TabsTrigger value="unit" className="text-xs">Unit Econ.</TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs">Milestones</TabsTrigger>
        </TabsList>

        {/* ─── OVERVIEW TAB ─────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue vs Costs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Ricavi vs Costi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={overviewData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-xs" />
                    <RechartsTooltip formatter={(v: number) => fmt(v)} />
                    <Legend />
                    <Bar dataKey="ricavi" name="Ricavi" fill={COLORS.revenue} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="costi" name="Costi" fill={COLORS.costs} radius={[4, 4, 0, 0]} />
                    {compareResult && (
                      <>
                        <Bar dataKey="ricavi_cmp" name="Ricavi (cmp)" fill={COLORS.revenue} opacity={0.4} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="costi_cmp" name="Costi (cmp)" fill={COLORS.costs} opacity={0.4} radius={[4, 4, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* EBITDA Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> EBITDA Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={overviewData}>
                    <defs>
                      <linearGradient id="ebitdaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.ebitda} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.ebitda} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-xs" />
                    <RechartsTooltip formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="ebitda" name="EBITDA" stroke={COLORS.ebitda} fill="url(#ebitdaGrad)" strokeWidth={2} />
                    {compareResult && (
                      <Area type="monotone" dataKey="ebitda_cmp" name="EBITDA (cmp)" stroke={COLORS.ebitda} fill="none" strokeWidth={2} strokeDasharray="5 5" />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Agency Growth */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" /> Crescita Agenzie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={agencyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="gratuite" name="Piano Base (149€)" fill={COLORS.base} stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="complete" name="Piano Completo (249€)" fill={COLORS.completo} stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Cash Flow Cumulato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-xs" />
                    <RechartsTooltip formatter={(v: number) => fmt(v)} />
                    <Line type="monotone" dataKey="cashFlow" name="Cash Flow" stroke={COLORS.positive} strokeWidth={3} dot={{ r: 5 }} />
                    {compareResult && (
                      <Line type="monotone" dataKey="cashFlow_cmp" name="Cash Flow (cmp)" stroke={COLORS.positive} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                    )}
                    {/* Zero line */}
                    <CartesianGrid horizontal={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" /> Ripartizione Costi 2028
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={costBreakdown2028}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {costBreakdown2028.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v: number) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── INPUTS TAB ───────────────────────────────────────────── */}
        <TabsContent value="inputs" className="space-y-6">
          {/* Agency & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Crescita Agenzie e Pricing</CardTitle>
              <CardDescription>Modifica le ipotesi di crescita e i prezzi degli abbonamenti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-4 gap-3 items-center text-xs font-semibold text-muted-foreground">
                <div />
                <div className="text-center">2026</div>
                <div className="text-center">2027</div>
                <div className="text-center">2028</div>
              </div>
              <div className="grid grid-cols-4 gap-3 items-center">
                <Label className="text-sm">Agenzie fine anno</Label>
                {[0, 1, 2].map((i) => (
                  <Input
                    key={i}
                    type="number"
                    value={[inputs.agenzie2026, inputs.agenzie2027, inputs.agenzie2028][i]}
                    onChange={(e) => {
                      const keys: (keyof BPInputs)[] = ["agenzie2026", "agenzie2027", "agenzie2028"];
                      updateField(keys[i], Number(e.target.value) || 0);
                    }}
                    className="text-right text-sm h-9"
                  />
                ))}
              </div>

              <Separator />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    Agenzie gratuite <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <Input
                    type="number"
                    value={inputs.gratuite}
                    onChange={(e) => updateField("gratuite", Number(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Prezzo Base (€/mese)</Label>
                  <Input
                    type="number"
                    value={inputs.prezzoBase}
                    onChange={(e) => updateField("prezzoBase", Number(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Prezzo Completo (€/mese)</Label>
                  <Input
                    type="number"
                    value={inputs.prezzoCompleto}
                    onChange={(e) => updateField("prezzoCompleto", Number(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Mesi medi di pagamento (nuove agenzie)</Label>
                <Input
                  type="number"
                  value={inputs.mesiMediPagamento}
                  onChange={(e) => updateField("mesiMediPagamento", Number(e.target.value) || 0)}
                  className="text-right h-9 max-w-[200px]"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label className="text-sm">CAC (€/agenzia)</Label>
                {[0, 1, 2].map((i) => (
                  <Input
                    key={i}
                    type="number"
                    value={inputs.cac[i]}
                    onChange={(e) => {
                      const next = [...inputs.cac] as [number, number, number];
                      next[i] = Number(e.target.value) || 0;
                      updateField("cac", next);
                    }}
                    className="text-right text-sm h-9"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Costs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Struttura Costi</CardTitle>
                  <CardDescription>Modifica i costi operativi previsionali per anno</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCostDetail(!showCostDetail)}
                >
                  {showCostDetail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {showCostDetail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-3 items-center text-xs font-semibold text-muted-foreground">
                      <div />
                      <div className="text-center">2026</div>
                      <div className="text-center">2027</div>
                      <div className="text-center">2028</div>
                    </div>
                    <CostInput label="Piattaforma" values={inputs.piattaforma} onChange={(v) => updateField("piattaforma", v)} tooltip="Hosting, server, manutenzione" />
                    <CostInput label="Sviluppo" values={inputs.sviluppo} onChange={(v) => updateField("sviluppo", v)} tooltip="Sito, AI, analytics" />
                    <CostInput label="Personale" values={inputs.personale} onChange={(v) => updateField("personale", v)} tooltip="Team cresce con la scala" />
                    <CostInput label="Marketing" values={inputs.marketing} onChange={(v) => updateField("marketing", v)} tooltip="Ads, contenuti, influencer" />
                    <CostInput label="Legale" values={inputs.legale} onChange={(v) => updateField("legale", v)} tooltip="GDPR, contratti, commercialista" />
                    <CostInput label="Spese Generali" values={inputs.speseGenerali} onChange={(v) => updateField("speseGenerali", v)} tooltip="Ufficio, trasferte, varie" />
                    <Separator />
                    <div className="grid grid-cols-4 gap-3 items-center font-semibold">
                      <Label className="text-sm">TOTALE COSTI</Label>
                      {result.totaleCosti.map((c, i) => (
                        <div key={i} className="text-right text-sm">{fmt(c)}</div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Investment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investimento Iniziale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Spese già sostenute (set 2025 - feb 2026)</Label>
                  <Input
                    type="number"
                    value={inputs.speseGiaSostenute}
                    onChange={(e) => updateField("speseGiaSostenute", Number(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Budget pre-lancio (mar-apr 2026)</Label>
                  <Input
                    type="number"
                    value={inputs.budgetPreLancio}
                    onChange={(e) => updateField("budgetPreLancio", Number(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-sm">
                <span>Totale Investimento Iniziale</span>
                <span>{fmt(result.investimentoIniziale)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CONTO ECONOMICO TAB ──────────────────────────────────── */}
        <TabsContent value="conto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conto Economico Previsionale</CardTitle>
              <CardDescription>Tutti i valori si aggiornano in tempo reale in base alle ipotesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Voce</TableHead>
                      {result.years.map((y) => (
                        <TableHead key={y} className="text-right min-w-[120px]">{y}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Agencies */}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>IPOTESI CHIAVE</TableCell>
                      <TableCell /><TableCell /><TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Agenzie totali</TableCell>
                      {result.agenzie.map((a, i) => <TableCell key={i} className="text-right">{a.toLocaleString("it-IT")}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-muted-foreground">di cui gratuite</TableCell>
                      {result.exGratuite.map((a, i) => <TableCell key={i} className="text-right text-muted-foreground">{a}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-muted-foreground">di cui a {inputs.prezzoCompleto}€/mese</TableCell>
                      {result.nuoveCompleto.map((a, i) => <TableCell key={i} className="text-right text-muted-foreground">{a.toLocaleString("it-IT")}</TableCell>)}
                    </TableRow>

                    {/* Revenue */}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>RICAVI</TableCell>
                      <TableCell /><TableCell /><TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Ricavi piano {inputs.prezzoBase}€</TableCell>
                      {result.ricaviBase.map((r, i) => <TableCell key={i} className="text-right">{fmt(r)}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Ricavi piano {inputs.prezzoCompleto}€</TableCell>
                      {result.ricaviCompleto.map((r, i) => <TableCell key={i} className="text-right">{fmt(r)}</TableCell>)}
                    </TableRow>
                    <TableRow className="font-bold border-t-2">
                      <TableCell className="pl-6">TOTALE RICAVI</TableCell>
                      {result.totaleRicavi.map((r, i) => (
                        <TableCell key={i} className="text-right text-green-600">{fmt(r)}</TableCell>
                      ))}
                    </TableRow>

                    {/* Costs */}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>COSTI OPERATIVI</TableCell>
                      <TableCell /><TableCell /><TableCell />
                    </TableRow>
                    {Object.entries(result.costiPerCategoria).map(([key, vals]) => (
                      <TableRow key={key}>
                        <TableCell className="pl-6 capitalize">{key === "speseGenerali" ? "Spese Generali" : key}</TableCell>
                        {vals.map((v, i) => <TableCell key={i} className="text-right">{fmt(v)}</TableCell>)}
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2">
                      <TableCell className="pl-6">TOTALE COSTI</TableCell>
                      {result.totaleCosti.map((c, i) => (
                        <TableCell key={i} className="text-right text-red-500">{fmt(c)}</TableCell>
                      ))}
                    </TableRow>

                    {/* EBITDA */}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>RISULTATO</TableCell>
                      <TableCell /><TableCell /><TableCell />
                    </TableRow>
                    <TableRow className="font-bold text-lg">
                      <TableCell className="pl-6">EBITDA</TableCell>
                      {result.ebitda.map((e, i) => (
                        <TableCell key={i} className={`text-right ${e >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {fmt(e)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6 text-muted-foreground">Margine EBITDA %</TableCell>
                      {result.margineEbitda.map((m, i) => (
                        <TableCell key={i} className={`text-right ${m >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {fmtPct(m)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Cash Flow */}
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell>CASH FLOW CUMULATO</TableCell>
                      <TableCell /><TableCell /><TableCell />
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell className="pl-6">Investimento iniziale</TableCell>
                      <TableCell className="text-right text-red-500">{fmt(-result.investimentoIniziale)}</TableCell>
                      <TableCell /><TableCell />
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell className="pl-6">Cash flow cumulato</TableCell>
                      {result.cashFlowCumulato.map((cf, i) => (
                        <TableCell key={i} className={`text-right ${cf >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {fmt(cf)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── UNIT ECONOMICS TAB ───────────────────────────────────── */}
        <TabsContent value="unit" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {result.years.map((y, i) => (
              <Card key={y}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{y}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ARPA (€/anno)</span>
                    <span className="font-semibold">{fmt(result.ricavoMedioPerAgenzia[i])}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CAC</span>
                    <span className="font-semibold">{fmt(inputs.cac[i])}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">LTV (24 mesi)</span>
                    <span className="font-semibold">{fmt(result.ltv[i])}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">LTV/CAC</span>
                    <Badge variant={result.ltvCac[i] >= 3 ? "default" : "destructive"}>
                      {result.ltvCac[i].toFixed(1)}x
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ARPA vs CAC vs LTV</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unitEconomicsData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="year" className="text-xs" />
                  <YAxis tickFormatter={(v) => `${v.toFixed(0)}€`} className="text-xs" />
                  <RechartsTooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Bar dataKey="arpa" name="ARPA" fill={COLORS.ebitda} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cac" name="CAC" fill={COLORS.costs} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ltv" name="LTV" fill={COLORS.revenue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── MILESTONES TAB ───────────────────────────────────────── */}
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Milestones Principali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4 relative"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">{m.date}</Badge>
                        <p className="text-sm text-foreground">{m.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t space-y-1">
        <p>Business Plan Reel Immobiliare — Piano a 3 anni (2026-2028)</p>
        <p>Piattaforma tecnologica B2B per il Real Estate. Tutti i dati sono proiezioni indicative.</p>
      </div>
    </div>
  );
}
