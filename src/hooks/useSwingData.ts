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
    }: {
      content: string;
      fileName: string;
    }) => {
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

      // Parse and insert positions
      const positions = parsePositionsFromMarkdown(content, data.id);
      if (positions.length > 0) {
        const { error: posError } = await (supabase as any)
          .from("swing_positions")
          .insert(positions);
        if (posError) console.error("Error inserting positions:", posError);
      }

      return { report: data as SwingReport, positionsCount: positions.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["swing-reports"] });
      queryClient.invalidateQueries({ queryKey: ["swing-positions"] });
      toast.success(
        `Report caricato con ${result.positionsCount} posizioni estratte`
      );
    },
    onError: (err: Error) => {
      toast.error(`Errore upload: ${err.message}`);
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

  // Match PASS table rows
  const passSection = content.match(
    /### ✅ PASS.*?\n\n([\s\S]*?)(?=\n###|\n## )/
  );
  if (passSection) {
    const rows = passSection[1].match(/\|\s*\*\*(\w+)\*\*\s*\|(.+)\|/g);
    if (rows) {
      for (const row of rows) {
        const pos = parsePositionRow(row, "PASS", reportId);
        if (pos) positions.push(pos);
      }
    }
  }

  // Match WATCHLIST table rows
  const watchSection = content.match(
    /### ⚠️ WATCHLIST.*?\n\n([\s\S]*?)(?=\n>|\n## )/
  );
  if (watchSection) {
    const rows = watchSection[1].match(/\|\s*\*\*(\w+)\*\*\s*\|(.+)\|/g);
    if (rows) {
      for (const row of rows) {
        const pos = parsePositionRow(row, "WATCHLIST", reportId);
        if (pos) positions.push(pos);
      }
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
  const t3Match = cells[8].match(/\$?([\d.]+)/);
  const rrMatch = cells[9].match(/([\d.]+)/);
  const sizeMatch = cells[10].match(/([\d.]+)%\s*\(\$([\d,]+)\)/);

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
