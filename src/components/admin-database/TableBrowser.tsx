import { useState, useEffect } from "react";
import { useAdminDatabase, TableInfo, ColumnInfo } from "@/hooks/useAdminDatabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Upload, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Database, ArrowUpDown, X, Filter as FilterIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TableBrowser() {
  const db = useAdminDatabase();
  const { toast } = useToast();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(50);
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderDir, setOrderDir] = useState<string>("asc");
  const [filters, setFilters] = useState<{ column: string; operator: string; value: string }[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; mode: "create" | "edit"; row: Record<string, any> }>({ open: false, mode: "create", row: {} });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [searchTable, setSearchTable] = useState("");

  useEffect(() => {
    db.listTables().then(t => t && setTables(t));
  }, []);

  const selectTable = async (name: string) => {
    setSelectedTable(name);
    setPage(0);
    setFilters([]);
    setOrderBy("");
    const [schema, count] = await Promise.all([
      db.getTableSchema(name),
      db.getTableCount(name),
    ]);
    if (schema) setColumns(schema);
    if (count?.[0]) setTotalCount(count[0].total);
    const data = await db.readTable(name, { limit: pageSize, offset: 0 });
    if (data) setRows(data);
  };

  const refreshData = async () => {
    if (!selectedTable) return;
    const [count, data] = await Promise.all([
      db.getTableCount(selectedTable),
      db.readTable(selectedTable, {
        filters: filters.filter(f => f.column && f.value),
        limit: pageSize,
        offset: page * pageSize,
        orderBy: orderBy || undefined,
        orderDir,
      }),
    ]);
    if (count?.[0]) setTotalCount(count[0].total);
    if (data) setRows(data);
  };

  useEffect(() => {
    if (selectedTable) refreshData();
  }, [page, orderBy, orderDir]);

  const applyFilters = () => { setPage(0); refreshData(); };

  const handleSort = (col: string) => {
    if (orderBy === col) {
      setOrderDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(col);
      setOrderDir("asc");
    }
  };

  const handleSave = async () => {
    if (!selectedTable) return;
    const { mode, row } = editDialog;
    // Remove empty strings for non-text fields
    const cleanData = { ...row };
    if (mode === "create") {
      const result = await db.insertRow(selectedTable, cleanData);
      if (result) {
        toast({ title: "Row created" });
        setEditDialog({ open: false, mode: "create", row: {} });
        refreshData();
      }
    } else {
      const id = row.id;
      const { id: _, ...updateData } = cleanData;
      const result = await db.updateRow(selectedTable, id, updateData);
      if (result) {
        toast({ title: "Row updated" });
        setEditDialog({ open: false, mode: "create", row: {} });
        refreshData();
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedTable) return;
    const result = await db.deleteRow(selectedTable, deleteDialog.id);
    if (result) {
      toast({ title: "Row deleted" });
      setDeleteDialog({ open: false, id: "" });
      refreshData();
    }
  };

  const exportCsv = () => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => headers.map(h => {
        const val = r[h];
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !selectedTable) return;
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => {
          const val = values[idx];
          row[h] = val === "" ? null : val;
        });
        const result = await db.insertRow(selectedTable, row);
        if (result) imported++;
      }
      toast({ title: `Imported ${imported} rows` });
      refreshData();
    };
    input.click();
  };

  const filteredTables = tables.filter(t => t.table_name.toLowerCase().includes(searchTable.toLowerCase()));
  const totalPages = Math.ceil(totalCount / pageSize);
  const visibleColumns = columns.slice(0, 8);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Sidebar - Table List */}
      <div className="w-64 flex-shrink-0 border rounded-lg bg-card overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tables..." value={searchTable} onChange={e => setSearchTable(e.target.value)} className="pl-8 h-9" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {filteredTables.map(t => (
              <button
                key={t.table_name}
                onClick={() => selectTable(t.table_name)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedTable === t.table_name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 flex-shrink-0" />
                  {t.table_name}
                </span>
                <Badge variant="secondary" className="text-[10px] ml-1 flex-shrink-0">{t.column_count}</Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t text-xs text-muted-foreground">
          {tables.length} tables
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 border rounded-lg bg-card overflow-hidden">
        {!selectedTable ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select a table to browse</p>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="p-3 border-b flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{selectedTable}</h3>
                <Badge variant="outline" className="text-xs">{totalCount} rows</Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon className="h-3.5 w-3.5 mr-1" /> Filters {filters.length > 0 && `(${filters.length})`}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditDialog({ open: true, mode: "create", row: {} })}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
                <Button variant="outline" size="sm" onClick={importCsv}>
                  <Upload className="h-3.5 w-3.5 mr-1" /> Import
                </Button>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Export
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="p-3 border-b bg-muted/30 space-y-2">
                {filters.map((f, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Select value={f.column} onValueChange={v => { const nf = [...filters]; nf[i].column = v; setFilters(nf); }}>
                      <SelectTrigger className="w-40 h-8"><SelectValue placeholder="Column" /></SelectTrigger>
                      <SelectContent>{columns.map(c => <SelectItem key={c.column_name} value={c.column_name}>{c.column_name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={f.operator} onValueChange={v => { const nf = [...filters]; nf[i].operator = v; setFilters(nf); }}>
                      <SelectTrigger className="w-28 h-8"><SelectValue placeholder="Op" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="like">Contains</SelectItem>
                        <SelectItem value="eq">Equals</SelectItem>
                        <SelectItem value="neq">Not equals</SelectItem>
                        <SelectItem value="gt">Greater than</SelectItem>
                        <SelectItem value="lt">Less than</SelectItem>
                        <SelectItem value="is_null">Is null</SelectItem>
                        <SelectItem value="not_null">Not null</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="h-8 flex-1" placeholder="Value" value={f.value} onChange={e => { const nf = [...filters]; nf[i].value = e.target.value; setFilters(nf); }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFilters(filters.filter((_, idx) => idx !== i))}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFilters([...filters, { column: "", operator: "like", value: "" }])}>
                    <Plus className="h-3 w-3 mr-1" /> Add filter
                  </Button>
                  <Button size="sm" onClick={applyFilters}>Apply</Button>
                </div>
              </div>
            )}

            {/* Table */}
            <ScrollArea className="flex-1">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map(c => (
                        <TableHead key={c.column_name} className="cursor-pointer whitespace-nowrap" onClick={() => handleSort(c.column_name)}>
                          <span className="flex items-center gap-1">
                            {c.column_name}
                            {orderBy === c.column_name && <ArrowUpDown className="h-3 w-3" />}
                          </span>
                        </TableHead>
                      ))}
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow><TableCell colSpan={visibleColumns.length + 1} className="text-center py-8 text-muted-foreground">No data</TableCell></TableRow>
                    ) : rows.map((row, i) => (
                      <TableRow key={i}>
                        {visibleColumns.map(c => (
                          <TableCell key={c.column_name} className="max-w-[200px] truncate text-xs">
                            {row[c.column_name] === null ? <span className="text-muted-foreground italic">null</span> :
                              typeof row[c.column_name] === "object" ? JSON.stringify(row[c.column_name]).slice(0, 60) :
                              String(row[c.column_name]).slice(0, 80)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ open: true, mode: "edit", row: { ...row } })}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            {row.id && (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ open: true, id: row.id })}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>

            {/* Pagination */}
            <div className="p-3 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog.open} onOpenChange={o => !o && setEditDialog({ open: false, mode: "create", row: {} })}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editDialog.mode === "create" ? "Create Row" : "Edit Row"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {columns.map(c => (
              <div key={c.column_name}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {c.column_name} <span className="text-muted-foreground/60">({c.data_type})</span>
                </label>
                <Input
                  value={editDialog.row[c.column_name] ?? ""}
                  onChange={e => setEditDialog(prev => ({ ...prev, row: { ...prev.row, [c.column_name]: e.target.value || null } }))}
                  placeholder={c.column_default || (c.is_nullable === "YES" ? "nullable" : "required")}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, mode: "create", row: {} })}>Cancel</Button>
            <Button onClick={handleSave} disabled={db.loading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onOpenChange={o => !o && setDeleteDialog({ open: false, id: "" })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Row</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: "" })}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={db.loading}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
