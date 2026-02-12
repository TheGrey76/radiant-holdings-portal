import { useState, useRef } from "react";
import { useAdminDatabase } from "@/hooks/useAdminDatabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Trash2, Download } from "lucide-react";

interface QueryResult {
  query: string;
  data: any[] | null;
  error: string | null;
  duration: number;
  timestamp: Date;
}

export default function SqlConsole() {
  const db = useAdminDatabase();
  const [query, setQuery] = useState("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 20;");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const executeQuery = async () => {
    if (!query.trim()) return;
    const start = Date.now();
    const data = await db.executeSql(query);
    const duration = Date.now() - start;

    const result: QueryResult = {
      query,
      data: data || null,
      error: data === null ? "Query failed" : null,
      duration,
      timestamp: new Date(),
    };
    setResults(prev => [result, ...prev]);
    if (!history.includes(query.trim())) {
      setHistory(prev => [query.trim(), ...prev].slice(0, 20));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      executeQuery();
    }
  };

  const exportResult = (result: QueryResult) => {
    if (!result.data?.length) return;
    const headers = Object.keys(result.data[0]);
    const csv = [headers.join(","), ...result.data.map(r => headers.map(h => {
      const v = r[h];
      if (v === null) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return s.includes(",") ? `"${s}"` : s;
    }).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "query_result.csv";
    a.click();
  };

  const latestResult = results[0];
  const resultColumns = latestResult?.data?.length ? Object.keys(latestResult.data[0]) : [];

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Query Panel */}
      <div className="flex-1 flex flex-col min-w-0 border rounded-lg bg-card overflow-hidden">
        {/* Editor */}
        <div className="p-4 border-b">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono text-sm min-h-[120px] resize-y bg-muted/30"
              placeholder="Enter SQL query..."
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">⌘+Enter to execute</span>
            <Button onClick={executeQuery} disabled={db.loading || !query.trim()} size="sm">
              <Play className="h-3.5 w-3.5 mr-1" /> Execute
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {latestResult && (
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                {latestResult.error ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="secondary">{latestResult.data?.length ?? 0} rows</Badge>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {latestResult.duration}ms
                </span>
              </div>
              {latestResult.data?.length ? (
                <Button variant="ghost" size="sm" onClick={() => exportResult(latestResult)}>
                  <Download className="h-3.5 w-3.5 mr-1" /> CSV
                </Button>
              ) : null}
            </div>
          )}
          <ScrollArea className="flex-1">
            {latestResult?.error ? (
              <div className="p-4 text-destructive text-sm font-mono">{latestResult.error}</div>
            ) : latestResult?.data?.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {resultColumns.map(c => <TableHead key={c} className="whitespace-nowrap text-xs">{c}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestResult.data.map((row, i) => (
                      <TableRow key={i}>
                        {resultColumns.map(c => (
                          <TableCell key={c} className="text-xs max-w-[250px] truncate">
                            {row[c] === null ? <span className="text-muted-foreground italic">null</span> :
                              typeof row[c] === "object" ? JSON.stringify(row[c]).slice(0, 80) :
                              String(row[c]).slice(0, 100)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : latestResult ? (
              <div className="p-4 text-muted-foreground text-sm text-center">Query executed successfully (no rows returned)</div>
            ) : (
              <div className="p-8 text-muted-foreground text-sm text-center">Run a query to see results</div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* History sidebar */}
      <div className="w-64 flex-shrink-0 border rounded-lg bg-card overflow-hidden flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <span className="text-sm font-medium">History</span>
          {history.length > 0 && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setHistory([])}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">No queries yet</p>
            ) : history.map((h, i) => (
              <button
                key={i}
                onClick={() => setQuery(h)}
                className="w-full text-left px-3 py-2 rounded-md text-xs font-mono hover:bg-muted truncate block"
              >
                {h.slice(0, 60)}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
