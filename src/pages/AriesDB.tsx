import { useState, useMemo, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Users, MapPin, Building2, Search, Download, BarChart3, Globe, Filter, ArrowUpDown, Linkedin, X, Trash2, Mail, Phone, Loader2, RefreshCw } from "lucide-react";
import WorldMapChart from "@/components/ariesdb/WorldMapChart";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ── Types ──────────────────────────────────────────────

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

interface DBContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  headline: string | null;
  job_title: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  linkedin_url: string | null;
  connected_on: string | null;
  year: string | null;
  industry: string | null;
  region: string | null;
  enriched_email: string | null;
  enriched_phone: string | null;
  enriched_linkedin_url: string | null;
  enriched_title: string | null;
  enriched_company: string | null;
  enriched_location: string | null;
  enrichment_status: string;
  enrichment_source: string | null;
  enriched_at: string | null;
  dedup_key: string;
}

interface EnrichedConnection extends Connection {
  id?: string;
  industry: string;
  region: string;
  enrichedEmail?: string | null;
  enrichedPhone?: string | null;
  enrichedLinkedinUrl?: string | null;
  enrichedTitle?: string | null;
  enrichedCompany?: string | null;
  enrichedLocation?: string | null;
  enrichmentStatus?: string;
  enrichmentSource?: string | null;
  enrichedAt?: string | null;
}

// ── Classification helpers (unchanged) ──────────────────

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Private Equity": ["private equity", "pe fund", "buyout", "lbo", "growth equity", "leveraged", "tdr capital", "palatine", "operating partner"],
  "Venture Capital": ["venture capital", "vc fund", "startup", "seed fund", "series a", "series b", "early stage", "incubat", "accelerat", "venture partner", "page one ventures", "sent ventures"],
  "Asset Management": ["asset management", "fund manager", "portfolio manager", "investment manager", "sgr", "sicav", "gestione fondi", "chief investment", "investment officer", "hedge fund", "quant", "aum", "blackrock", "fidelity", "ark invest", "vanguard", "pimco", "amundi", "schroders", "invesco", "franklin templeton", "investor", "investment associate", "private debt", "public equity", "head of distribution", "fund", "capital", "invest"],
  "Banking": ["bank", "banco", "banca", "credit", "lending", "capital market", "fixed income", "equity research", "trading", "treasury", "poste italiane", "mizuho", "goldman", "morgan stanley", "jp morgan", "ubs", "barclays", "deutsche bank", "hsbc", "bnp", "societe generale", "global markets", "financial planner", "chartered financial"],
  "Family Office": ["family office", "single family", "multi family", "wealth management", "wealth advisory", "private wealth", "patrimoni", "fiduciaria", "unione fiduciaria"],
  "Real Estate": ["real estate", "immobili", "property", "reit", "costruzion"],
  "Insurance": ["insurance", "assicuraz", "underwriting", "vita "],
  "Advisory": ["advisory", "advisor", "consulen", "consulting", "m&a", "corporate finance", "investment banking", "strategic", "due diligence", "ey-parthenon", "ey ", "parthenon", "mckinsey", "bain", "bcg", "deloitte", "kpmg", "pwc", "forvis mazars", "valuation", "strategy and transaction"],
  "Fintech": ["fintech", "blockchain", "crypto", "defi", "web3", "bitcoin", "digital asset", "regtech", "qonto", "binance"],
  "Corporate": ["ceo", "cfo", "coo", "managing director", "general manager", "founder", "co-founder", "amministratore delegato", "direttore generale", "chief executive", "president", "head of finance", "responsabile amministrativo"],
  "Technology": ["software", "engineer", "developer", "saas", "cloud", "ai ", "artificial intelligence", "machine learning", "data scien", "product manager", "cto", "google", "microsoft", "amazon", "computer science", "data engineer"],
  "Legal": ["avvocato", "lawyer", "attorney", "legal", "law firm", "studio legale", "notai", "advocate"],
  "Sales & Marketing": ["sales", "marketing", "business develop", "commercial", "key account", "account manager", "relationship manager", "vendite", "commerciale", "partnership manager", "head of business growth"],
  "HR & Recruiting": ["recruiter", "recruiting", "talent", "human resources", "hr business partner", "people", "hiring"],
  "Media & Communication": ["journalist", "media", "communication", "editorial", "press", "pr manager", "content", "newsletter", "editore", "publisher"],
};

function classifyIndustry(c: Connection): string {
  const text = `${c.headline} ${c.jobTitle} ${c.company}`.toLowerCase();
  // Check specific industries first, then broader ones
  const orderedKeys = ["Private Equity", "Venture Capital", "Family Office", "Fintech", "Real Estate", "Insurance", "Legal", "HR & Recruiting", "Media & Communication", "Advisory", "Banking", "Technology", "Sales & Marketing", "Corporate", "Asset Management"];
  for (const industry of orderedKeys) {
    const keywords = INDUSTRY_KEYWORDS[industry];
    if (keywords && keywords.some(k => text.includes(k))) return industry;
  }
  return "Other";
}

function extractRegion(location: string): string {
  if (!location) return "Unknown";
  const loc = location.toLowerCase();

  // Italy – comprehensive list of cities, provinces and regions
  const italyCities = ["milan","rome","turin","italy","italia","napl","florence","bologna","genoa","biella","bergamo","brescia","padova","padua","verona","venezia","venice","ancona","puglia","sicil","sardegna","cagliari","rovigo","bolzano","greater milan","greater rome","monza","brianza","varese","vicenza","pavia","forlì","forli","cesena","ravenna","pisa","trento","bari","lecce","modena","parma","reggio emilia","ferrara","pistoia","lucca","cuneo","aosta","ivrea","lodi","frosinone","benevento","treviso","trieste","catania","palermo","altamura","martina franca","erba","cernusco","cerro maggiore","cinisello","brugherio","melzo","merate","pieve emanuele","busseto","casalecchio","castel bolognese","camisano","colle umberto","conegliano","cortina","modigliana","fano","inverigo","manerbio","palestrina","bonvicino","borgomanero","buja","calvizzano","busto arsizio","reggio nell","asiago","arpino","andora"];
  if (italyCities.some(c => loc.includes(c))) return "Italy";

  // UK
  const ukCities = ["london","united kingdom","manchester","edinburgh","cambridge","leeds","bristol","belfast","glasgow","oxford","brighton","derby","gloucester","harrogate","cirencester","kensington","guernsey","isle of man"];
  if (ukCities.some(c => loc.includes(c))) return "UK";

  // USA
  const usaCities = ["new york","san francisco","california","texas","chicago","boston","miami","los angeles","washington","usa","united states","atlanta","austin","dallas","denver","philadelphia","fort lauderdale","boca raton","hartford","fairfield, ct","darien, ct","little falls, nj","palo alto","pasadena","tuscaloosa","oklahoma","bangor, ca"];
  if (usaCities.some(c => loc.includes(c))) return "USA";

  // Switzerland
  if (loc.includes("switzerland") || loc.includes("zurich") || loc.includes("zürich") || loc.includes("geneva") || loc.includes("lugano") || loc.includes("basel") || loc.includes("zug") || loc.includes("locarno") || loc.includes("feusisberg")) return "Switzerland";

  // Middle East
  if (loc.includes("dubai") || loc.includes("abu dhabi") || loc.includes("uae") || loc.includes("united arab emirates") || loc.includes("qatar") || loc.includes("saudi") || loc.includes("riyadh") || loc.includes("bahrain") || loc.includes("israel") || loc.includes("tel aviv") || loc.includes("jordan") || loc.includes("amman") || loc.includes("kuwait")) return "Middle East";

  // France
  if (loc.includes("paris") || loc.includes("france") || loc.includes("lyon") || loc.includes("montpellier")) return "France";

  // Germany
  if (loc.includes("germany") || loc.includes("berlin") || loc.includes("munich") || loc.includes("frankfurt") || loc.includes("hamburg") || loc.includes("cologne") || loc.includes("düsseldorf") || loc.includes("hagen") || loc.includes("eberswalde")) return "Germany";

  // Spain
  if (loc.includes("spain") || loc.includes("madrid") || loc.includes("barcelona") || loc.includes("las palmas") || loc.includes("palma de mallorca") || loc.includes("pozuelo")) return "Spain";

  // Asia-Pacific
  if (loc.includes("singapore") || loc.includes("hong kong") || loc.includes("tokyo") || loc.includes("shanghai") || loc.includes("china") || loc.includes("india") || loc.includes("mumbai") || loc.includes("japan") || loc.includes("beijing") || loc.includes("ho chi minh") || loc.includes("vietnam") || loc.includes("manila") || loc.includes("indonesia") || loc.includes("noida") || loc.includes("new zealand") || loc.includes("australia") || loc.includes("hope island") || loc.includes("nepal")) return "Asia-Pacific";

  if (loc.includes("luxembourg")) return "Luxembourg";

  // Netherlands / Benelux
  if (loc.includes("netherlands") || loc.includes("amsterdam") || loc.includes("rotterdam") || loc.includes("groningen")) return "Netherlands";

  // LATAM
  if (loc.includes("brazil") || loc.includes("são paulo") || loc.includes("mexico") || loc.includes("argentina") || loc.includes("colombia") || loc.includes("uruguay") || loc.includes("panama")) return "LATAM";

  // Africa
  if (loc.includes("africa") || loc.includes("nigeria") || loc.includes("kenya") || loc.includes("south africa") || loc.includes("zambia") || loc.includes("johannesburg") || loc.includes("kimberley") || loc.includes("dakar") || loc.includes("senegal") || loc.includes("mauritius") || loc.includes("port louis") || loc.includes("ballito")) return "Africa";

  // Canada
  if (loc.includes("canada") || loc.includes("toronto") || loc.includes("montreal") || loc.includes("calgary")) return "Canada";

  // Scandinavia
  if (loc.includes("copenhagen") || loc.includes("denmark") || loc.includes("helsinki") || loc.includes("finland") || loc.includes("espoo") || loc.includes("stockholm") || loc.includes("sweden") || loc.includes("oslo") || loc.includes("norway")) return "Scandinavia";

  // CEE (Central & Eastern Europe)
  if (loc.includes("budapest") || loc.includes("hungary") || loc.includes("prague") || loc.includes("czechia") || loc.includes("czech") || loc.includes("warsaw") || loc.includes("poland") || loc.includes("lodz") || loc.includes("bratislava") || loc.includes("slovakia") || loc.includes("romania") || loc.includes("buftea") || loc.includes("lithuania") || loc.includes("vilnius") || loc.includes("latvia") || loc.includes("kyiv") || loc.includes("ukraine") || loc.includes("kragujevac") || loc.includes("serbia") || loc.includes("athens") || loc.includes("greece") || loc.includes("istanbul") || loc.includes("türkiye") || loc.includes("turkey")) return "CEE";

  // Benelux / Belgium
  if (loc.includes("belgium") || loc.includes("brussels") || loc.includes("herent")) return "Belgium";

  // Other small states
  if (loc.includes("monaco") || loc.includes("monte carlo")) return "Monaco";
  if (loc.includes("malta")) return "Malta";
  if (loc.includes("cyprus") || loc.includes("limassol") || loc.includes("paralimni")) return "Cyprus";
  if (loc.includes("gibraltar")) return "Gibraltar";
  if (loc.includes("andorra")) return "Andorra";
  if (loc.includes("san marino")) return "San Marino";

  // Ireland
  if (loc.includes("ireland") || loc.includes("dublin")) return "Ireland";

  // Portugal
  if (loc.includes("portugal") || loc.includes("lisbon") || loc.includes("cascais")) return "Portugal";

  // Austria
  if (loc.includes("austria") || loc.includes("vienna") || loc.includes("innsbruck")) return "Austria";

  // Offshore / Caribbean
  if (loc.includes("cayman") || loc.includes("nassau") || loc.includes("bahamas")) return "Offshore";

  return "Other";
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

function getDedupeKey(c: Connection): string {
  return c.linkedinUrl || `${c.name}|${c.company}`;
}

function deduplicateConnections(all: Connection[]): Connection[] {
  const seen = new Map<string, Connection>();
  for (const c of all) {
    const key = getDedupeKey(c);
    if (!seen.has(key)) seen.set(key, c);
  }
  return Array.from(seen.values());
}

function dbToEnriched(db: DBContact): EnrichedConnection {
  return {
    id: db.id,
    name: db.name,
    email: db.email || "",
    phone: db.phone || "",
    headline: db.headline || "",
    jobTitle: db.job_title || "",
    location: db.location || "",
    company: db.company || "",
    website: db.website || "",
    linkedinUrl: db.linkedin_url || "",
    connectedOn: db.connected_on || "",
    year: db.year || "Unknown",
    industry: classifyIndustry({ name: db.name, email: db.email || "", phone: db.phone || "", headline: db.headline || "", jobTitle: db.job_title || "", location: db.location || "", company: db.company || "", website: db.website || "", linkedinUrl: db.linkedin_url || "", connectedOn: db.connected_on || "", year: db.year || "Unknown" }),
    region: extractRegion(db.location || ""),
    enrichedEmail: db.enriched_email,
    enrichedPhone: db.enriched_phone,
    enrichedLinkedinUrl: db.enriched_linkedin_url,
    enrichedTitle: db.enriched_title,
    enrichedCompany: db.enriched_company,
    enrichedLocation: db.enriched_location,
    enrichmentStatus: db.enrichment_status,
    enrichmentSource: db.enrichment_source,
    enrichedAt: db.enriched_at,
  };
}

// ── Component ──────────────────────────────────────────

export default function AriesDB() {
  const [contacts, setContacts] = useState<EnrichedConnection[]>([]);
  const [uploading, setUploading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [enrichmentFilter, setEnrichmentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const getKey = (c: EnrichedConnection) => c.linkedinUrl || `${c.name}|${c.company}`;

  // ── Load from Supabase on mount ──
  const loadFromDB = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch in batches to handle >1000 rows
      let allData: DBContact[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;
      while (hasMore) {
        const { data, error } = await supabase
          .from("ariesdb_contacts")
          .select("*")
          .range(from, from + batchSize - 1)
          .order("name");
        if (error) throw error;
        if (data && data.length > 0) {
          allData = [...allData, ...(data as unknown as DBContact[])];
          from += batchSize;
          if (data.length < batchSize) hasMore = false;
        } else {
          hasMore = false;
        }
      }
      setContacts(allData.map(dbToEnriched));
    } catch (err) {
      console.error("Error loading contacts:", err);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem("ariesdb_connections");
        if (saved) {
          const parsed: Connection[] = JSON.parse(saved);
          setContacts(parsed.map(c => ({
            ...c,
            industry: classifyIndustry(c),
            region: extractRegion(c.location),
          })));
        }
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFromDB(); }, [loadFromDB]);

  // ── Save connections to Supabase ──
  const saveToSupabase = useCallback(async (connections: Connection[]): Promise<number> => {
    const rows = connections.map(c => ({
      name: c.name,
      email: c.email || null,
      phone: c.phone || null,
      headline: c.headline || null,
      job_title: c.jobTitle || null,
      location: c.location || null,
      company: c.company || null,
      website: c.website || null,
      linkedin_url: c.linkedinUrl || null,
      connected_on: c.connectedOn || null,
      year: c.year || null,
      industry: classifyIndustry(c),
      region: extractRegion(c.location),
      dedup_key: getDedupeKey(c),
      enrichment_status: "pending" as const,
    }));

    // Upsert in batches of 100
    let inserted = 0;
    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100);
      const { error, data } = await supabase
        .from("ariesdb_contacts")
        .upsert(batch as any, { onConflict: "dedup_key", ignoreDuplicates: true })
        .select("id");
      if (error) {
        console.error("Upsert error:", error);
      } else {
        inserted += data?.length || 0;
      }
    }
    return inserted;
  }, []);

  // ── Auto-enrich after upload ──
  const triggerEnrichment = useCallback(async () => {
    setEnriching(true);
    try {
      let totalEnriched = 0;
      let hasMore = true;
      while (hasMore) {
        const { data, error } = await supabase.functions.invoke("enrich-ariesdb-contacts", {
          body: { batch_size: 20 },
        });
        if (error) {
          console.error("Enrichment error:", error);
          break;
        }
        totalEnriched += data?.enriched || 0;
        if (!data?.total || data.total < 20) hasMore = false;
        // Update UI periodically
        await loadFromDB();
      }
      if (totalEnriched > 0) {
        toast({ title: "Enrichment completato", description: `${totalEnriched} contatti arricchiti con successo.` });
      } else {
        toast({ title: "Enrichment", description: "Nessun nuovo contatto da arricchire." });
      }
    } catch (err) {
      console.error("Enrichment failed:", err);
      toast({ title: "Errore enrichment", description: String(err), variant: "destructive" });
    } finally {
      setEnriching(false);
      await loadFromDB();
    }
  }, [loadFromDB]);

  // ── File upload → save → enrich ──
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const allConns: Connection[] = [];
      for (const file of Array.from(files)) {
        const buf = await file.arrayBuffer();
        allConns.push(...parseExcel(buf));
      }
      const deduped = deduplicateConnections(allConns);
      const inserted = await saveToSupabase(deduped);
      toast({ title: "Upload completato", description: `${deduped.length} connessioni processate, ${inserted} nuove salvate.` });
      // Also keep in localStorage as backup
      localStorage.setItem("ariesdb_connections", JSON.stringify(deduped));
      await loadFromDB();
      // Auto-enrich
      triggerEnrichment();
    } catch (err) {
      toast({ title: "Errore upload", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, [saveToSupabase, loadFromDB, triggerEnrichment]);

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
      const inserted = await saveToSupabase(deduped);
      toast({ title: "Dati caricati", description: `${deduped.length} connessioni, ${inserted} nuove salvate su DB.` });
      localStorage.setItem("ariesdb_connections", JSON.stringify(deduped));
      await loadFromDB();
      // Auto-enrich
      triggerEnrichment();
    } catch (err) {
      toast({ title: "Errore", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [saveToSupabase, loadFromDB, triggerEnrichment]);

  // ── Delete ──
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

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const idsToDelete = contacts.filter(c => selected.has(getKey(c)) && c.id).map(c => c.id!);
    if (idsToDelete.length > 0) {
      for (let i = 0; i < idsToDelete.length; i += 100) {
        await supabase.from("ariesdb_contacts").delete().in("id", idsToDelete.slice(i, i + 100) as any);
      }
    }
    setContacts(prev => prev.filter(c => !selected.has(getKey(c))));
    toast({ title: "Eliminati", description: `${selected.size} contatti rimossi.` });
    setSelected(new Set());
  };

  const deleteSingle = async (c: EnrichedConnection) => {
    if (c.id) {
      await supabase.from("ariesdb_contacts").delete().eq("id", c.id as any);
    }
    const key = getKey(c);
    setContacts(prev => prev.filter(conn => getKey(conn) !== key));
    setSelected(prev => { const next = new Set(prev); next.delete(key); return next; });
    toast({ title: "Eliminato", description: `${c.name} rimosso.` });
  };

  // ── Derived data ──
  const filtered = useMemo(() => {
    let data = contacts;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.company.toLowerCase().includes(s) ||
        c.jobTitle.toLowerCase().includes(s) ||
        c.headline.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        (c.enrichedEmail || "").toLowerCase().includes(s)
      );
    }
    if (industryFilter !== "all") data = data.filter(c => c.industry === industryFilter);
    if (regionFilter !== "all") data = data.filter(c => c.region === regionFilter);
    if (yearFilter !== "all") data = data.filter(c => c.year === yearFilter);
    if (enrichmentFilter !== "all") {
      if (enrichmentFilter === "enriched") data = data.filter(c => c.enrichmentStatus === "enriched");
      else if (enrichmentFilter === "pending") data = data.filter(c => !c.enrichmentStatus || c.enrichmentStatus === "pending");
      else if (enrichmentFilter === "not_found") data = data.filter(c => c.enrichmentStatus === "not_found");
      else if (enrichmentFilter === "with_email") data = data.filter(c => c.enrichedEmail || c.email);
    }
    data = [...data].sort((a, b) => {
      if (sortField === "enrichedAt") {
        const av = a.enrichedAt || "";
        const bv = b.enrichedAt || "";
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const av = (a as any)[sortField] || "";
      const bv = (b as any)[sortField] || "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [contacts, searchTerm, industryFilter, regionFilter, yearFilter, enrichmentFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    const industryMap: Record<string, number> = {};
    const regionMap: Record<string, number> = {};
    const yearMap: Record<string, number> = {};
    const companyMap: Record<string, number> = {};
    let enrichedCount = 0;
    let withEmail = 0;
    for (const c of contacts) {
      industryMap[c.industry] = (industryMap[c.industry] || 0) + 1;
      regionMap[c.region] = (regionMap[c.region] || 0) + 1;
      yearMap[c.year] = (yearMap[c.year] || 0) + 1;
      if (c.company) companyMap[c.company] = (companyMap[c.company] || 0) + 1;
      if (c.enrichmentStatus === "enriched") enrichedCount++;
      if (c.email || c.enrichedEmail) withEmail++;
    }
    const topCompanies = Object.entries(companyMap).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const topIndustries = Object.entries(industryMap).sort((a, b) => b[1] - a[1]);
    const topRegions = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);
    return { industryMap, regionMap, yearMap, topCompanies, topIndustries, topRegions, total: contacts.length, enrichedCount, withEmail };
  }, [contacts]);

  const industries = useMemo(() => [...new Set(contacts.map(c => c.industry))].sort(), [contacts]);
  const regions = useMemo(() => [...new Set(contacts.map(c => c.region))].sort(), [contacts]);
  const years = useMemo(() => [...new Set(contacts.map(c => c.year))].sort(), [contacts]);

  const exportCSV = useCallback(() => {
    if (!filtered.length) return;
    const headers = ["Name", "Email", "Enriched Email", "Phone", "Enriched Phone", "Job Title", "Company", "Location", "Region", "Industry", "LinkedIn URL", "Enriched LinkedIn", "Connected On", "Enrichment Status"];
    const rows = filtered.map(c => [c.name, c.email, c.enrichedEmail || "", c.phone, c.enrichedPhone || "", c.jobTitle, c.company, c.location, c.region, c.industry, c.linkedinUrl, c.enrichedLinkedinUrl || "", c.connectedOn, c.enrichmentStatus || ""]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aries_db_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setRegionFilter("all");
    setYearFilter("all");
    setEnrichmentFilter("all");
  };

  // ── Enrichment status badge ──
  const EnrichmentBadge = ({ status }: { status?: string }) => {
    if (!status || status === "pending") return <Badge variant="outline" className="text-xs bg-muted/50">Pending</Badge>;
    if (status === "enriched") return <Badge className="text-xs bg-green-500/20 text-green-700 border-green-300">Enriched</Badge>;
    if (status === "not_found") return <Badge variant="outline" className="text-xs text-muted-foreground">Not found</Badge>;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Caricamento contatti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aries76 Network Database</h1>
            <p className="text-muted-foreground mt-1">
              Deal & Geo Best Fit Dashboard — {stats.total.toLocaleString()} connections
              {stats.enrichedCount > 0 && <span className="text-green-600 ml-2">• {stats.enrichedCount} enriched</span>}
              {stats.withEmail > 0 && <span className="text-primary ml-2">• {stats.withEmail} con email</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {enriching && (
              <Badge variant="outline" className="h-9 px-3 flex items-center gap-2 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enriching...
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={triggerEnrichment} disabled={enriching || uploading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${enriching ? "animate-spin" : ""}`} /> Enrich
            </Button>
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

        {contacts.length === 0 ? (
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1" />Overview</TabsTrigger>
              <TabsTrigger value="contacts"><Users className="h-4 w-4 mr-1" />Contatti</TabsTrigger>
              <TabsTrigger value="geo"><Globe className="h-4 w-4 mr-1" />Geo Analysis</TabsTrigger>
              <TabsTrigger value="industry"><Building2 className="h-4 w-4 mr-1" />Industry</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Totale Connessioni</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.total.toLocaleString()}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Enriched</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-600">{stats.enrichedCount}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Con Email</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-primary">{stats.withEmail}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Regioni</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.topRegions.length}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Settori</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-foreground">{stats.topIndustries.length}</p></CardContent></Card>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Cerca nome, azienda, ruolo, email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
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
                    <Select value={enrichmentFilter} onValueChange={setEnrichmentFilter}>
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Enrichment" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti gli status</SelectItem>
                        <SelectItem value="enriched">✅ Enriched</SelectItem>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="not_found">❌ Not found</SelectItem>
                        <SelectItem value="with_email">📧 Con email</SelectItem>
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

              <Card>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-auto">
                    <TooltipProvider>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10"><Checkbox checked={filtered.length > 0 && selected.size === filtered.length} onCheckedChange={toggleSelectAll} /></TableHead>
                            <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}><span className="flex items-center gap-1">Nome <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                            <TableHead className="cursor-pointer" onClick={() => toggleSort("jobTitle")}><span className="flex items-center gap-1">Ruolo <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                            <TableHead className="cursor-pointer" onClick={() => toggleSort("company")}><span className="flex items-center gap-1">Azienda <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Settore</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => toggleSort("enrichedAt")}><span className="flex items-center gap-1">Enriched <ArrowUpDown className="h-3 w-3" /></span></TableHead>
                            <TableHead className="w-20"></TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.slice(0, 200).map((c, i) => {
                            const key = getKey(c);
                            const displayEmail = c.enrichedEmail || c.email;
                            const displayPhone = c.enrichedPhone || c.phone;
                            const displayLinkedin = c.enrichedLinkedinUrl || c.linkedinUrl;
                            return (
                              <TableRow key={i} className={selected.has(key) ? "bg-muted/50" : ""}>
                                <TableCell><Checkbox checked={selected.has(key)} onCheckedChange={() => toggleSelect(key)} /></TableCell>
                                <TableCell className="font-medium text-foreground max-w-[180px] truncate">{c.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                                  {c.enrichedTitle || c.jobTitle}
                                </TableCell>
                                <TableCell className="text-sm text-foreground max-w-[140px] truncate">{c.company}</TableCell>
                                <TableCell className="text-sm max-w-[180px]">
                                  {displayEmail ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <a href={`mailto:${displayEmail}`} className="flex items-center gap-1 text-primary hover:underline truncate">
                                          <Mail className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">{displayEmail}</span>
                                        </a>
                                      </TooltipTrigger>
                                      <TooltipContent>{displayEmail}</TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">—</span>
                                  )}
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-xs">{c.industry}</Badge></TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    <EnrichmentBadge status={c.enrichmentStatus} />
                                    {c.enrichedAt && (
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(c.enrichedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {displayLinkedin && (
                                      <a href={displayLinkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4 text-primary hover:text-accent transition-colors" />
                                      </a>
                                    )}
                                    {displayPhone && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <a href={`tel:${displayPhone}`}>
                                            <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                          </a>
                                        </TooltipTrigger>
                                        <TooltipContent>{displayPhone}</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
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
                    </TooltipProvider>
                    {filtered.length > 200 && (
                      <p className="text-center text-sm text-muted-foreground py-3">Mostrando 200 di {filtered.length} risultati. Usa i filtri per restringere.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GEO TAB */}
            <TabsContent value="geo" className="space-y-4">
              <WorldMapChart
                regionData={stats.topRegions.map(([region, count]) => ({
                  region,
                  count,
                  percentage: (count / stats.total) * 100,
                }))}
                activeRegion={regionFilter !== "all" ? regionFilter : undefined}
                onRegionClick={(region) => {
                  if (regionFilter === region) {
                    setRegionFilter("all");
                  } else {
                    setRegionFilter(region);
                    setActiveTab("contacts");
                  }
                }}
              />
            </TabsContent>

            {/* INDUSTRY TAB */}
            <TabsContent value="industry" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {stats.topIndustries.map(([industry, count]) => {
                  const industryConns = contacts.filter(c => c.industry === industry);
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
