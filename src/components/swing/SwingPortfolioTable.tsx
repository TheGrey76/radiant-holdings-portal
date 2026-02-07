import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  Pencil,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import type { SwingPosition } from "@/hooks/useSwingData";
import { useUpdatePosition } from "@/hooks/useSwingData";
import { useSwingPrices } from "@/hooks/useSwingPrices";

interface SwingPortfolioTableProps {
  positions: SwingPosition[];
}

export default function SwingPortfolioTable({
  positions,
}: SwingPortfolioTableProps) {
  const [editingPosition, setEditingPosition] = useState<SwingPosition | null>(
    null
  );
  const [entryPrice, setEntryPrice] = useState("");
  const [fees, setFees] = useState("");
  const [shares, setShares] = useState("");
  const [exitPrice, setExitPrice] = useState("");

  const updatePosition = useUpdatePosition();

  const tickers = useMemo(
    () => positions.map((p) => p.ticker).filter(Boolean),
    [positions]
  );

  const { prices, loading: pricesLoading, lastUpdated, refetch } = useSwingPrices(tickers);

  const openEdit = (pos: SwingPosition) => {
    setEditingPosition(pos);
    setEntryPrice(pos.entry_price?.toString() || "");
    setFees(pos.fees?.toString() || "0");
    setShares(pos.shares?.toString() || "");
    setExitPrice(pos.exit_price?.toString() || "");
  };

  const handleSave = () => {
    if (!editingPosition) return;

    const ep = entryPrice ? parseFloat(entryPrice) : null;
    const f = fees ? parseFloat(fees) : 0;
    const s = shares ? parseFloat(shares) : null;
    const ex = exitPrice ? parseFloat(exitPrice) : null;

    let realizedPnl: number | null = null;
    let isActive = editingPosition.is_active;

    if (ex && ep && s) {
      realizedPnl = (ex - ep) * s - (f || 0);
      isActive = false;
    }

    updatePosition.mutate({
      id: editingPosition.id,
      updates: {
        entry_price: ep,
        fees: f,
        shares: s,
        exit_price: ex,
        exit_date: ex ? new Date().toISOString() : null,
        realized_pnl: realizedPnl,
        is_active: isActive,
      },
    });

    setEditingPosition(null);
  };

  const closePosition = (pos: SwingPosition) => {
    const currentPrice = prices[pos.ticker]?.price;
    if (!currentPrice || !pos.entry_price || !pos.shares) return;

    const realizedPnl =
      (currentPrice - pos.entry_price) * pos.shares - (pos.fees || 0);

    updatePosition.mutate({
      id: pos.id,
      updates: {
        exit_price: currentPrice,
        exit_date: new Date().toISOString(),
        realized_pnl: realizedPnl,
        is_active: false,
      },
    });
  };

  // Calculate totals
  const totals = useMemo(() => {
    let totalUnrealized = 0;
    let totalRealized = 0;
    let totalInvested = 0;

    for (const pos of positions) {
      if (pos.entry_price && pos.shares) {
        totalInvested += pos.entry_price * pos.shares + (pos.fees || 0);

        if (pos.is_active) {
          const currentPrice = prices[pos.ticker]?.price;
          if (currentPrice) {
            totalUnrealized +=
              (currentPrice - pos.entry_price) * pos.shares - (pos.fees || 0);
          }
        }
      }

      if (pos.realized_pnl) {
        totalRealized += pos.realized_pnl;
      }
    }

    return { totalUnrealized, totalRealized, totalInvested };
  }, [positions, prices]);

  const formatCurrency = (val: number | null | undefined) => {
    if (val == null) return "—";
    return `$${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPnL = (val: number | null | undefined) => {
    if (val == null) return "—";
    const sign = val >= 0 ? "+" : "";
    return `${sign}$${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Posizioni Attive</p>
          <p className="text-2xl font-bold text-foreground">
            {positions.filter((p) => p.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Investito</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totals.totalInvested)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">P&L Non Realizzato</p>
          <p
            className={`text-2xl font-bold ${
              totals.totalUnrealized >= 0
                ? "text-green-600"
                : "text-destructive"
            }`}
          >
            {formatPnL(totals.totalUnrealized)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">P&L Realizzato</p>
          <p
            className={`text-2xl font-bold ${
              totals.totalRealized >= 0
                ? "text-green-600"
                : "text-destructive"
            }`}
          >
            {formatPnL(totals.totalRealized)}
          </p>
        </div>
      </div>

      {/* Price refresh indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {lastUpdated
            ? `Prezzi aggiornati: ${lastUpdated.toLocaleTimeString("it-IT")}`
            : "Caricamento prezzi..."}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={pricesLoading}
        >
          {pricesLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          <span className="ml-1">Aggiorna</span>
        </Button>
      </div>

      {/* Positions table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Ticker</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Entry Zone</TableHead>
              <TableHead className="text-right">Prezzo Carico</TableHead>
              <TableHead className="text-right">Prezzo Live</TableHead>
              <TableHead className="text-right">Chg%</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Fees</TableHead>
              <TableHead className="text-right">Stop</TableHead>
              <TableHead className="text-right">T1 / T2</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={13}
                  className="text-center text-muted-foreground py-8"
                >
                  Nessuna posizione. Carica un report per iniziare.
                </TableCell>
              </TableRow>
            )}
            {positions.map((pos) => {
              const livePrice = prices[pos.ticker]?.price;
              const livePctChange = prices[pos.ticker]?.percent_change;
              const hasEntry = pos.entry_price != null && pos.shares != null;
              const unrealizedPnl =
                hasEntry && livePrice
                  ? (livePrice - pos.entry_price!) * pos.shares! -
                    (pos.fees || 0)
                  : null;
              const unrealizedPct =
                hasEntry && livePrice && pos.entry_price
                  ? ((livePrice - pos.entry_price) / pos.entry_price) * 100
                  : null;

              const displayPnl = pos.is_active ? unrealizedPnl : pos.realized_pnl;

              return (
                <TableRow
                  key={pos.id}
                  className={!pos.is_active ? "opacity-50" : ""}
                >
                  <TableCell className="font-mono font-bold">
                    {pos.ticker}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{pos.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {pos.sector}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pos.status === "PASS"
                          ? "default"
                          : pos.status === "WATCHLIST"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {pos.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {pos.entry_zone_low && pos.entry_zone_high
                      ? `$${pos.entry_zone_low} - $${pos.entry_zone_high}`
                      : pos.entry_zone_low
                      ? `$${pos.entry_zone_low}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pos.entry_price
                      ? formatCurrency(pos.entry_price)
                      : <span className="text-muted-foreground text-xs">da inserire</span>}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pricesLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin inline" />
                    ) : livePrice ? (
                      formatCurrency(livePrice)
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {livePctChange != null ? (
                      <span
                        className={`text-xs font-mono flex items-center justify-end gap-1 ${
                          livePctChange >= 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {livePctChange >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {livePctChange.toFixed(2)}%
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pos.shares || "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {pos.fees ? formatCurrency(pos.fees) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-destructive">
                    {pos.stop_loss ? formatCurrency(pos.stop_loss) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {pos.target_1 && pos.target_2
                      ? `$${pos.target_1} / $${pos.target_2}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {displayPnl != null ? (
                      <div>
                        <span
                          className={`font-mono font-bold ${
                            displayPnl >= 0
                              ? "text-green-600"
                              : "text-destructive"
                          }`}
                        >
                          {formatPnL(displayPnl)}
                        </span>
                        {unrealizedPct != null && pos.is_active && (
                          <div className="text-xs text-muted-foreground">
                            {unrealizedPct >= 0 ? "+" : ""}
                            {unrealizedPct.toFixed(2)}%
                          </div>
                        )}
                        {!pos.is_active && (
                          <div className="text-xs text-muted-foreground">
                            chiusa
                          </div>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(pos)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {pos.is_active && hasEntry && livePrice && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => closePosition(pos)}
                          title="Chiudi posizione al prezzo corrente"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingPosition}
        onOpenChange={() => setEditingPosition(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Modifica {editingPosition?.ticker} — {editingPosition?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prezzo di Carico ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="es. 78.50"
                />
              </div>
              <div>
                <Label>Shares</Label>
                <Input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="es. 532"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fee di Negoziazione ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder="es. 9.95"
                />
              </div>
              <div>
                <Label>Prezzo di Uscita ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="Lascia vuoto se aperta"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Compilare per chiudere la posizione
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPosition(null)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
