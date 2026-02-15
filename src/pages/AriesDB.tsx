import { useState, useMemo, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Users, MapPin, Building2, Search, Download, BarChart3, Globe, Filter, ArrowUpDown, Linkedin, X, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface Connection {
  name: string;
  email: string;
  phone: string;
  headline: string;
  jobTitle: string;
  location: string;
  company: string;
  website: string;
  linkedinUrl: string;
  connectedOn: string;
  year: string;
}

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Private Equity": ["private equity", "pe ", "buyout", "lbo", "growth equity"],
  "Venture Capital": ["venture capital", "vc ", "startup", "seed", "series a", "series b"],
  "Asset Management": ["asset management", "fund manager", "portfolio manager", "investment manager", "sgr", "sicav"],
  "Banking": ["bank", "banco", "banca", "credit", "lending"],
  "Family Office": ["family office", "single family", "multi family", "wealth"],
  "Real Estate": ["real estate", "immobili", "property", "reit"],
  "Insurance": ["insurance", "assicuraz", "underwriting"],
  "Advisory": ["advisory", "advisor", "consulen", "consulting"],
  "Fintech": ["fintech", "blockchain", "crypto", "defi", "web3"],
  "Corporate": ["ceo", "cfo", "coo", "managing director", "general manager", "founder"],
};

function classifyIndustry(c: Connection): string {
  const text = `${c.headline} ${c.jobTitle} ${c.company}`.toLowerCase();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return industry;
  }
  return "Other";
}

function extractRegion(location: string): string {
  if (!location) return "Unknown";
  const loc = location.toLowerCase();
  if (loc.includes("milan") || loc.includes("rome") || loc.includes("turin") || loc.includes("italy") || loc.includes("italia") || loc.includes("napl") || loc.includes("florence") || loc.includes("bologna") || loc.includes("genoa") || loc.includes("biella") || loc.includes("bergamo") || loc.includes("brescia") || loc.includes("padova") || loc.includes("verona") || loc.includes("venezia") || loc.includes("ancona") || loc.includes("puglia") || loc.includes("sicil") || loc.includes("sardegna") || loc.includes("rovigo") || loc.includes("bolzano") || loc.includes("greater milan") || loc.includes("greater rome")) return "Italy";
  if (loc.includes("london") || loc.includes("united kingdom") || loc.includes("uk") || loc.includes("manchester") || loc.includes("edinburgh") || loc.includes("cambridge")) return "UK";
  if (loc.includes("new york") || loc.includes("san francisco") || loc.includes("california") || loc.includes("texas") || loc.includes("chicago") || loc.includes("boston") || loc.includes("miami") || loc.includes("los angeles") || loc.includes("washington") || loc.includes("usa") || loc.includes("united states")) return "USA";
  if (loc.includes("switzerland") || loc.includes("zurich") || loc.includes("geneva") || loc.includes("lugano")) return "Switzerland";
  if (loc.includes("dubai") || loc.includes("abu dhabi") || loc.includes("uae") || loc.includes("qatar") || loc.includes("saudi") || loc.includes("riyadh") || loc.includes("bahrain")) return "Middle East";
  if (loc.includes("paris") || loc.includes("france")) return "France";
  if (loc.includes("germany") || loc.includes("berlin") || loc.includes("munich") || loc.includes("frankfurt")) return "Germany";
  if (loc.includes("spain") || loc.includes("madrid") || loc.includes("barcelona")) return "Spain";
  if (loc.includes("singapore") || loc.includes("hong kong") || loc.includes("tokyo") || loc.includes("shanghai") || loc.includes("china") || loc.includes("india") || loc.includes("mumbai") || loc.includes("japan")) return "Asia-Pacific";
  if (loc.includes("luxembourg")) return "Luxembourg";
  if (loc.includes("netherlands") || loc.includes("amsterdam")) return "Netherlands";
  if (loc.includes("brazil") || loc.includes("são paulo") || loc.includes("mexico") || loc.includes("argentina") || loc.includes("colombia")) return "LATAM";
  if (loc.includes("africa") || loc.includes("nigeria") || loc.includes("kenya") || loc.includes("south africa") || loc.includes("zambia")) return "Africa";
  return "Other Europe";
}

function parseExcel(data: ArrayBuffer): Connection[] {
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
  return rows
    .filter(r => r["Name"]?.trim())
    .map(r => {
      const connDate = r["Connected On"] || "";
      let year = "Unknown";
      const match = connDate.match(/\d{4}/);
      if (match) year = match[0];
      return {
        name: r["Name"]?.trim() || "",
        email: r["Email"]?.trim() || "",
        phone: r["Phone"]?.trim() || "",
        headline: r["LinkedIn Headline"]?.trim() || "",
        jobTitle: r["Job Title"]?.trim() || "",
        location: r["Location"]?.trim() || "",
        company: r["Company"]?.trim() || "",
        website: r["Website"]?.trim() || "",
        linkedinUrl: r["LinkedIn Profile URL"]?.trim() || "",
        connectedOn: connDate.trim(),
        year,
      };
    });
}

function deduplicateConnections(all: Connection[]): Connection[] {
  const seen = new Map<string, Connection>();
  for (const c of all) {
    const key = c.linkedinUrl || `${c.name}|${c.company}`;
    if (!seen.has(key)) seen.set(key, c);
  }
  return Array.from(seen.values());
}

export default function AriesDB() {
  const [connections, setConnectionsRaw] = useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem("ariesdb_connections");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const setConnections = useCallback((updater: Connection[] | ((prev: Connection[]) => Connection[])) => {
    setConnectionsRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem("ariesdb_connections", JSON.stringify(next));
      return next;
    });
  }, []);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Connection>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const getKey = (c: Connection) => c.linkedinUrl || `${c.name}|${c.company}`;

  const toggleSelect = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => getKey(c))));
    }
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    setConnections(prev => prev.filter(c => !selected.has(getKey(c))));
    toast({ title: "Eliminati", description: `${selected.size} contatti rimossi.` });
    setSelected(new Set());
  };

  const deleteSingle = (c: Connection) => {
    const key = getKey(c);
    setConnections(prev => prev.filter(conn => getKey(conn) !== key));
    setSelected(prev => { const next = new Set(prev); next.delete(key); return next; });
    toast({ title: "Eliminato", description: `${c.name} rimosso.` });
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const allConns: Connection[] = [];
      for (const file of Array.from(files)) {
        const buf = await file.arrayBuffer();
        const parsed = parseExcel(buf);
        allConns.push(...parsed);
      }
      const deduped = deduplicateConnections([...connections, ...allConns]);
      setConnections(deduped);
      toast({ title: "Upload completato", description: `${allConns.length} connessioni caricate, ${deduped.length} totali dopo dedup.` });
    } catch (err) {
      toast({ title: "Errore upload", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, [connections]);

  const loadPreloaded = useCallback(async () => {
    setUploading(true);
    try {
      const files = ["/data/LinkedIn_Connections_2023.xlsx", "/data/LinkedIn_Connections_2024.xlsx", "/data/LinkedIn_Connections_2025_2026.xlsx"];
      const allConns: Connection[] = [];
      for (const url of files) {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        allConns.push(...parseExcel(buf));
      }
      const deduped = deduplicateConnections(allConns);
      setConnections(deduped);
      toast({ title: "Dati caricati", description: `${deduped.length} connessioni uniche caricate.` });
    } catch (err) {
      toast({ title: "Errore", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, []);

  const enriched = useMemo(() => connections.map(c => ({
    ...c,
    industry: classifyIndustry(c),
    region: extractRegion(c.location),
  })), [connections]);

  const filtered = useMemo(() => {
    let data = enriched;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.company.toLowerCase().includes(s) ||
        c.jobTitle.toLowerCase().includes(s) ||
        c.headline.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s)
      );
    }
    if (industryFilter !== "all") data = data.filter(c => c.industry === industryFilter);
    if (regionFilter !== "all") data = data.filter(c => c.region === regionFilter);
    if (yearFilter !== "all") data = data.filter(c => c.year === yearFilter);
    data.sort((a, b) => {
      const av = a[sortField] || "";
      const bv = b[sortField] || "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [enriched, searchTerm, industryFilter, regionFilter, yearFilter, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const industryMap: Record<string, number> = {};
    const regionMap: Record<string, number> = {};
    const yearMap: Record<string, number> = {};
    const companyMap: Record<string, number> = {};
    for (const c of enriched) {
      industryMap[c.industry] = (industryMap[c.industry] || 0) + 1;
      regionMap[c.region] = (regionMap[c.region] || 0) + 1;
      yearMap[c.year] = (yearMap[c.year] || 0) + 1;
      if (c.company) companyMap[c.company] = (companyMap[c.company] || 0) + 1;
    }
    const topCompanies = Object.entries(companyMap).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const topIndustries = Object.entries(industryMap).sort((a, b) => b[1] - a[1]);
    const topRegions = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);
    return { industryMap, regionMap, yearMap, topCompanies, topIndustries, topRegions, total: enriched.length };
  }, [enriched]);

  const industries = useMemo(() => [...new Set(enriched.map(c => c.industry))].sort(), [enriched]);
  const regions = useMemo(() => [...new Set(enriched.map(c => c.region))].sort(), [enriched]);
  const years = useMemo(() => [...new Set(enriched.map(c => c.year))].sort(), [enriched]);

  const exportCSV = useCallback(() => {
    if (!filtered.length) return;
    const headers = ["Name", "Email", "Job Title", "Company", "Location", "Region", "Industry", "LinkedIn URL", "Connected On"];
    const rows = filtered.map(c => [c.name, c.email, c.jobTitle, c.company, c.location, c.region, c.industry, c.linkedinUrl, c.connectedOn]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aries_db_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const toggleSort = (field: keyof Connection) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setRegionFilter("all");
    setYearFilter("all");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aries76 Network Database</h1>
            <p className="text-muted-foreground mt-1">Deal & Geo Best Fit Dashboard — {stats.total.toLocaleString()} connections</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={loadPreloaded} disabled={uploading}>
              <Upload className="h-4 w-4 mr-1" /> Carica Precaricati
            </Button>
            <label>
              <Button variant="default" asChild disabled={uploading}>
                <span><Upload className="h-4 w-4 mr-1" /> Upload Excel</span>
              </Button>
              <input type="file" accept=".xlsx,.xls" multiple className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {connections.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Carica i file LinkedIn Connections</h3>
              <p className="text-muted-foreground mb-4">Upload i file Excel (.xlsx) oppure clicca "Carica Precaricati" per usare i dati già presenti.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={loadPreloaded} disabled={uploading}>Carica Precaricati</Button>
                <label>
                  <Button variant="outline" asChild>
                    <span>Upload File</span>
                  </Button>
                  <input type="file" accept=".xlsx,.xls" multiple className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1" />Overview</TabsTrigger>
              <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-1" />Contatti</TabsTrigger>
              <TabsTrigger value="geo"><Globe className="h-4 w-4 mr-1" />Geo Analysis</TabsTrigger>
              <TabsTrigger value="industry"><Building2 className="h-4 w-4 mr-1" />Industry</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Totale Connessioni</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Regioni</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.topRegions.length}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Settori</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.topIndustries.length}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aziende</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{Object.keys(stats.yearMap).length} anni</p></CardContent></Card>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* By Year */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Per Anno</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(stats.yearMap).sort(([a], [b]) => b.localeCompare(a)).map(([year, count]) => (
                      <div key={year} className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{year}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${(count / stats.total) * 200}px` }} />
                          <span className="text-sm font-medium text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Industries */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Top Settori</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {stats.topIndustries.slice(0, 8).map(([ind, count]) => (
                      <div key={ind} className="flex justify-between items-center">
                        <span className="text-sm text-foreground truncate max-w-[140px]">{ind}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-accent rounded-full" style={{ width: `${(count / stats.total) * 200}px` }} />
                          <span className="text-sm font-medium text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Regions */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Top Regioni</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {stats.topRegions.slice(0, 8).map(([reg, count]) => (
                      <div key={reg} className="flex justify-between items-center">
                        <span className="text-sm text-foreground truncate max-w-[140px]">{reg}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-chart-3 rounded-full" style={{ width: `${(count / stats.total) * 200}px` }} />
                          <span className="text-sm font-medium text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Top Companies */}
              <Card>
                <CardHeader><CardTitle className="text-base">Top 15 Aziende per Connessioni</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stats.topCompanies.map(([comp, count]) => (
                      <Badge key={comp} variant="secondary" className="text-sm py-1 px-3">
                        {comp} <span className="ml-1 font-bold text-primary">({count})</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CONTACTS TAB */}
            <TabsContent value="contacts" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Cerca nome, azienda, ruolo, città..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                      </div>
                    </div>
                    <Select value={industryFilter} onValueChange={setIndustryFilter}>
                      <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-1" /><SelectValue placeholder="Settore" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti i settori</SelectItem>
                        {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="w-[160px]"><MapPin className="h-4 w-4 mr-1" /><SelectValue placeholder="Regione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutte le regioni</SelectItem>
                        {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-[120px]"><SelectValue placeholder="Anno" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti</SelectItem>
                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />CSV</Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{filtered.length.toLocaleString()} risultati</p>
                    {selected.size > 0 && (
                      <Button variant="destructive" size="sm" onClick={deleteSelected}>
                        <Trash2 className="h-4 w-4 mr-1" />Elimina {selected.size} selezionati
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"><Checkbox checked={filtered.length > 0 && selected.size === filtered.length} onCheckedChange={toggleSelectAll} /></TableHead>
                          <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}><span className="flex items-center gap-1">Nome <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                          <TableHead className="cursor-pointer" onClick={() => toggleSort("jobTitle")}><span className="flex items-center gap-1">Ruolo <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                          <TableHead className="cursor-pointer" onClick={() => toggleSort("company")}><span className="flex items-center gap-1">Azienda <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                          <TableHead>Settore</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => toggleSort("location")}><span className="flex items-center gap-1">Località <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                          <TableHead>Regione</TableHead>
                          <TableHead>Anno</TableHead>
                          <TableHead className="w-10"></TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.slice(0, 200).map((c, i) => {
                          const key = getKey(c);
                          return (
                          <TableRow key={i} className={selected.has(key) ? "bg-muted/50" : ""}>
                            <TableCell><Checkbox checked={selected.has(key)} onCheckedChange={() => toggleSelect(key)} /></TableCell>
                            <TableCell className="font-medium text-foreground max-w-[180px] truncate">{c.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{c.jobTitle}</TableCell>
                            <TableCell className="text-sm text-foreground max-w-[160px] truncate">{c.company}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{c.industry}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">{c.location}</TableCell>
                            <TableCell><Badge variant="secondary" className="text-xs">{c.region}</Badge></TableCell>
                            <TableCell className="text-sm">{c.year}</TableCell>
                            <TableCell>
                              {c.linkedinUrl && (
                                <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                  <Linkedin className="h-4 w-4 text-primary hover:text-accent transition-colors" />
                                </a>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteSingle(c)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {filtered.length > 200 && (
                      <p className="text-center text-sm text-muted-foreground py-3">Mostrando 200 di {filtered.length} risultati. Usa i filtri per restringere.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GEO TAB */}
            <TabsContent value="geo" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {stats.topRegions.map(([region, count]) => (
                  <Card key={region} className="cursor-pointer hover:border-primary transition-colors" onClick={() => { setRegionFilter(region); }}>
                    <CardContent className="pt-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{region}</p>
                        <p className="text-sm text-muted-foreground">{count} connessioni ({((count / stats.total) * 100).toFixed(1)}%)</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="h-3 bg-primary/20 rounded-full w-32 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {enriched.filter(c => c.region === region).reduce((acc, c) => { acc.add(c.industry); return acc; }, new Set<string>()).size} settori
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* INDUSTRY TAB */}
            <TabsContent value="industry" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {stats.topIndustries.map(([industry, count]) => {
                  const industryConns = enriched.filter(c => c.industry === industry);
                  const topCompInIndustry = Object.entries(
                    industryConns.reduce<Record<string, number>>((acc, c) => { if (c.company) acc[c.company] = (acc[c.company] || 0) + 1; return acc; }, {})
                  ).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  
                  return (
                    <Card key={industry} className="cursor-pointer hover:border-accent transition-colors" onClick={() => setIndustryFilter(industry)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex justify-between">
                          <span>{industry}</span>
                          <Badge>{count}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {topCompInIndustry.map(([comp, n]) => (
                            <Badge key={comp} variant="outline" className="text-xs">{comp} ({n})</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
