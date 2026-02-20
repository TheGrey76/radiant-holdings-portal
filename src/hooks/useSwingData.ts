import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types (not in auto-generated types yet)
export interface SwingReport {
  id: string;
  client_name: string;
  capital: number | null;
  risk_profile: string | null;
  sectors: string[] | null;
  horizon: string | null;
  report_date: string | null;
  week_range: string | null;
  raw_content: string;
  file_name: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface SwingPosition {
  id: string;
  report_id: string | null;
  ticker: string;
  name: string | null;
  sector: string | null;
  status: string;
  entry_zone_low: number | null;
  entry_zone_high: number | null;
  stop_loss: number | null;
  target_1: number | null;
  target_2: number | null;
  target_3: number | null;
  risk_reward: number | null;
  allocation_pct: number | null;
  allocation_amount: number | null;
  confidence: string | null;
  shares: number | null;
  entry_price: number | null;
  fees: number | null;
  exit_price: number | null;
  exit_date: string | null;
  realized_pnl: number | null;
  max_profit: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SwingUploadToken {
  id: string;
  token: string;
  label: string;
  notification_email: string;
  is_active: boolean;
  created_at: string;
}

// ---- Reports ----
export function useSwingReports() {
  return useQuery({
    queryKey: ["swing-reports"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("swing_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SwingReport[];
    },
  });
}

export function useUploadReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      fileName,
      isJson,
      jsonData,
    }: {
      content: string;
      fileName: string;
      isJson?: boolean;
      jsonData?: any;
    }) => {
      if (isJson && jsonData) {
        // Flexible JSON: accept array of positions OR { report, positions } OR { positions }
        let positionsArray: any[] = [];
        let reportMeta: Record<string, any> = {};

        if (Array.isArray(jsonData)) {
          positionsArray = jsonData;
        } else if (Array.isArray(jsonData.positions)) {
          positionsArray = jsonData.positions;
          reportMeta = jsonData.report || jsonData;
        } else if (Array.isArray(jsonData.ideas)) {
          // Synth response format with abbreviated keys
          positionsArray = jsonData.ideas.map((idea: any) => ({
            ticker: idea.t,
            name: idea.t,
            entry_zone_low: idea.e?.[0] ?? null,
            entry_zone_high: idea.e?.[1] ?? null,
            stop_loss: idea.inv ?? null,
            target_1: idea.tg?.[0] ?? null,
            target_2: idea.tg?.[1] ?? null,
            target_3: idea.tg?.[2] ?? null,
            risk_reward: idea.rr ?? null,
            allocation_pct: idea.sz ?? null,
            confidence: idea.s != null ? `${idea.s}/5` : null,
            entry_price: idea.cp ?? null,
            notes: idea.sum || null,
            is_active: true,
            status: "PASS",
          }));
        } else {
          throw new Error("JSON non valido: deve contenere un array di posizioni o ideas");
        }

        // Insert report record
        const { data, error } = await (supabase as any)
          .from("swing_reports")
          .insert({
            client_name: reportMeta.client_name || "Import JSON",
            capital: reportMeta.capital || null,
            risk_profile: reportMeta.risk_profile || null,
            sectors: reportMeta.sectors || null,
            horizon: reportMeta.horizon || null,
            report_date: reportMeta.report_date || null,
            week_range: reportMeta.week_range || null,
            raw_content: content,
            file_name: fileName,
            uploaded_by: "admin",
          })
          .select()
          .single();

        if (error) throw error;

        // Fetch existing active positions to avoid duplicates
        const { data: existingPositions } = await (supabase as any)
          .from("swing_positions")
          .select("ticker")
          .eq("is_active", true);

        const existingTickers = new Set(
          (existingPositions || []).map((p: any) => p.ticker?.toUpperCase())
        );

        // Only add positions with new tickers
        const newPositions = positionsArray
          .filter((p) => p.ticker && !existingTickers.has(p.ticker.toUpperCase()))
          .map((p) => ({
            report_id: data.id,
            ticker: p.ticker?.toUpperCase(),
            name: p.name || null,
            sector: p.sector || null,
            status: p.status || "PASS",
            entry_zone_low: p.entry_zone_low ?? null,
            entry_zone_high: p.entry_zone_high ?? null,
            stop_loss: p.stop_loss ?? null,
            target_1: p.target_1 ?? null,
            target_2: p.target_2 ?? null,
            target_3: p.target_3 ?? null,
            risk_reward: p.risk_reward ?? null,
            allocation_pct: p.allocation_pct ?? null,
            allocation_amount: p.allocation_amount ?? null,
            confidence: p.confidence || null,
            entry_price: p.entry_price ?? null,
            shares: p.shares ?? null,
            fees: p.fees ?? null,
            exit_price: p.exit_price ?? null,
            realized_pnl: p.realized_pnl ?? null,
            is_active: p.is_active !== undefined ? p.is_active : true,
            notes: p.notes || null,
          }));

        const skipped = positionsArray.length - newPositions.length;

        if (newPositions.length > 0) {
          const { error: posError } = await (supabase as any)
            .from("swing_positions")
            .insert(newPositions);
          if (posError) throw new Error(`Errore posizioni: ${posError.message}`);
        }

        return { added: newPositions.length, skipped };
      }

      // Markdown path (legacy)
      const metadata = parseReportMetadata(content);
      const { data, error } = await (supabase as any)
        .from("swing_reports")
        .insert({
          client_name: metadata.client_name || "Unknown",
          capital: metadata.capital,
          risk_profile: metadata.risk_profile,
          sectors: metadata.sectors,
          horizon: metadata.horizon,
          report_date: metadata.report_date,
          week_range: metadata.week_range,
          raw_content: content,
          file_name: fileName,
          uploaded_by: "admin",
        })
        .select()
        .single();

      if (error) throw error;

      const positions = parsePositionsFromMarkdown(content, data.id);
      if (positions.length > 0) {
        const { error: posError } = await (supabase as any)
          .from("swing_positions")
          .insert(positions);
        if (posError) throw new Error(`Errore posizioni: ${posError.message}`);
      }

      return { added: positions.length, skipped: 0 };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["swing-reports"] });
      queryClient.invalidateQueries({ queryKey: ["swing-positions"] });
      const msg = result.skipped > 0
        ? `${result.added} nuove posizioni aggiunte, ${result.skipped} già presenti (ignorate)`
        : `${result.added} posizioni importate`;
      toast.success(msg);
    },
    onError: (err: Error) => {
      toast.error(`Errore upload: ${err.message}`);
    },
  });
}

// ---- Archive closed positions ----
export function useArchiveClosedPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await (supabase as any)
        .from("swing_positions")
        .delete()
        .eq("is_active", false)
        .select("id");
      if (error) throw error;
      return data?.length || 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["swing-positions"] });
      toast.success(`${count} posizioni chiuse archiviate`);
    },
    onError: (err: Error) => {
      toast.error(`Errore: ${err.message}`);
    },
  });
}

// ---- Positions ----
export function useSwingPositions(activeOnly = true) {
  return useQuery({
    queryKey: ["swing-positions", activeOnly],
    queryFn: async () => {
      let query = (supabase as any)
        .from("swing_positions")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SwingPosition[];
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<SwingPosition>;
    }) => {
      const { data, error } = await (supabase as any)
        .from("swing_positions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as SwingPosition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["swing-positions"] });
      toast.success("Posizione aggiornata");
    },
    onError: (err: Error) => {
      toast.error(`Errore: ${err.message}`);
    },
  });
}

// ---- Upload Tokens ----
export function useSwingUploadTokens() {
  return useQuery({
    queryKey: ["swing-upload-tokens"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("swing_upload_tokens")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SwingUploadToken[];
    },
  });
}

export function useCreateUploadToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      label,
      notification_email,
    }: {
      label: string;
      notification_email: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from("swing_upload_tokens")
        .insert({ label, notification_email })
        .select()
        .single();
      if (error) throw error;
      return data as SwingUploadToken;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["swing-upload-tokens"] });
      toast.success("Token creato");
    },
    onError: (err: Error) => {
      toast.error(`Errore: ${err.message}`);
    },
  });
}

// ---- Parsing utilities ----
function parseReportMetadata(content: string) {
  const clientMatch = content.match(/\*\*Cliente:\*\*\s*(.+)/);
  const capitalMatch = content.match(/\*\*Capitale:\*\*\s*\$?([\d,]+)/);
  const riskMatch = content.match(/\*\*Profilo Rischio:\*\*\s*(.+)/);
  const sectorsMatch = content.match(/\*\*Settori:\*\*\s*(.+)/);
  const horizonMatch = content.match(/\*\*Orizzonte:\*\*\s*(.+)/);
  const dateMatch = content.match(/\*\*Data Report:\*\*\s*(.+)/);
  const weekMatch = content.match(/Settimana\s+([\d]+-[\d]+\s+\w+\s+\d{4})/);

  let reportDate: string | null = null;
  if (dateMatch) {
    reportDate = parseItalianDate(dateMatch[1].trim());
  }

  return {
    client_name: clientMatch?.[1]?.trim() || null,
    capital: capitalMatch
      ? parseFloat(capitalMatch[1].replace(/,/g, ""))
      : null,
    risk_profile: riskMatch?.[1]?.trim() || null,
    sectors: sectorsMatch
      ? sectorsMatch[1].split(/\s*\+\s*/).map((s) => s.trim())
      : null,
    horizon: horizonMatch?.[1]?.trim() || null,
    report_date: reportDate,
    week_range: weekMatch?.[1]?.trim() || null,
  };
}

const ITALIAN_MONTHS: Record<string, string> = {
  gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
  maggio: "05", giugno: "06", luglio: "07", agosto: "08",
  settembre: "09", ottobre: "10", novembre: "11", dicembre: "12",
};

function parseItalianDate(raw: string): string | null {
  // Remove time/timezone parts like "ore 19:30 CET"
  const cleaned = raw.replace(/,?\s*ore\s+[\d:]+\s*\w*/i, "").trim();
  // Match "6 Febbraio 2026" or similar
  const match = cleaned.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (!match) return null;

  const day = match[1].padStart(2, "0");
  const monthName = match[2].toLowerCase();
  const year = match[3];
  const month = ITALIAN_MONTHS[monthName];

  if (!month) return null;
  return `${year}-${month}-${day}`;
}

function parsePositionsFromMarkdown(content: string, reportId: string) {
  const positions: any[] = [];
  // Normalize line endings to \n
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Find all table rows with bold tickers like | **FTNT** | ... |
  // across the entire document — categorize by nearest section header
  const lines = normalized.split("\n");
  let currentSection: string | null = null;

  for (const line of lines) {
    // Detect section headers
    if (/###\s*✅\s*PASS/i.test(line)) {
      currentSection = "PASS";
      continue;
    }
    if (/###\s*⚠️\s*WATCHLIST/i.test(line)) {
      currentSection = "WATCHLIST";
      continue;
    }
    if (/###\s*❌\s*FAIL/i.test(line)) {
      currentSection = "FAIL";
      continue;
    }
    // Reset section on new ## header (but not ###)
    if (/^##\s+[^#]/.test(line) && !/^###/.test(line)) {
      currentSection = null;
      continue;
    }

    // Only parse PASS and WATCHLIST rows
    if (!currentSection || currentSection === "FAIL") continue;

    // Match table data rows with bold ticker
    if (/\|\s*\*\*\w+\*\*\s*\|/.test(line)) {
      const pos = parsePositionRow(line, currentSection, reportId);
      if (pos) positions.push(pos);
    }
  }

  return positions;
}

function parsePositionRow(
  row: string,
  status: string,
  reportId: string
): any | null {
  const cells = row
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c);
  if (cells.length < 11) return null;

  const ticker = cells[0].replace(/\*\*/g, "").trim();
  const name = cells[1].trim();
  const sector = cells[2].trim();

  // cells[3] is "Tema" — skip it
  const entryText = cells[4];
  const entryMatch = entryText.match(/\$?([\d.]+)\s*-\s*\$?([\d.]+)/);
  const singleEntry = entryText.match(/\$?([\d.]+)/);

  const entryLow = entryMatch
    ? parseFloat(entryMatch[1])
    : singleEntry
    ? parseFloat(singleEntry[1])
    : null;
  const entryHigh = entryMatch ? parseFloat(entryMatch[2]) : null;

  const stopMatch = cells[5].match(/\$?([\d.]+)/);
  const t1Match = cells[6].match(/\$?([\d.]+)/);
  const t2Match = cells[7].match(/\$?([\d.]+)/);
  const t3Match = cells[8]?.match(/\$?([\d.]+)/);
  const rrMatch = cells[9]?.match(/([\d.]+)/);
  const sizeMatch = cells[10]?.match(/([\d.]+)%\s*\(\$([\d,]+)\)/);

  return {
    report_id: reportId,
    ticker,
    name,
    sector,
    status,
    entry_zone_low: entryLow,
    entry_zone_high: entryHigh,
    stop_loss: stopMatch ? parseFloat(stopMatch[1]) : null,
    target_1: t1Match ? parseFloat(t1Match[1]) : null,
    target_2: t2Match ? parseFloat(t2Match[1]) : null,
    target_3: t3Match ? parseFloat(t3Match[1]) : null,
    risk_reward: rrMatch ? parseFloat(rrMatch[1]) : null,
    allocation_pct: sizeMatch ? parseFloat(sizeMatch[1]) : null,
    allocation_amount: sizeMatch
      ? parseFloat(sizeMatch[2].replace(/,/g, ""))
      : null,
    confidence: cells[11]?.replace(/[✅⚠️❌]/g, "").trim() || null,
    is_active: true,
  };
}
