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
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  const ALLOCATION_PER_POSITION = 50000;
  const PERF_FEE_RATE = 0.15; // 15% performance fee

  const openEdit = (pos: SwingPosition) => {
    setEditingPosition(pos);
    const ep = pos.entry_price?.toString() || "";
    setEntryPrice(ep);
    setFees(pos.fees?.toString() || "0");
    // Auto-calc shares if not already set
    if (pos.shares) {
      setShares(pos.shares.toString());
    } else if (pos.entry_price) {
      setShares(Math.floor(ALLOCATION_PER_POSITION / pos.entry_price).toString());
    } else {
      setShares("");
    }
    setExitPrice(pos.exit_price?.toString() || "");
  };

  const handleEntryPriceChange = (val: string) => {
    setEntryPrice(val);
    const price = parseFloat(val);
    if (price > 0) {
      setShares(Math.floor(ALLOCATION_PER_POSITION / price).toString());
    }
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
    let totalMtM = 0;

    for (const pos of positions) {
      if (pos.entry_price && pos.shares) {
        totalInvested += pos.entry_price * pos.shares + (pos.fees || 0);

        if (pos.is_active) {
          const currentPrice = prices[pos.ticker]?.price;
          if (currentPrice) {
            totalMtM += currentPrice * pos.shares;
            totalUnrealized +=
              (currentPrice - pos.entry_price) * pos.shares - (pos.fees || 0);
          }
        }
      }

      if (pos.realized_pnl) {
        totalRealized += pos.realized_pnl;
      }
    }

    const totalGross = totalUnrealized + totalRealized;
    const perfFee = totalGross > 0 ? totalGross * PERF_FEE_RATE : 0;
    const netOfFees = totalGross - perfFee;

    return { totalUnrealized, totalRealized, totalInvested, totalMtM, totalGross, perfFee, netOfFees };
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
    <TooltipProvider delayDuration={200}>
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Posizioni Attive</p>
            <InfoTip text="Numero di operazioni attualmente aperte nel portafoglio." />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {positions.filter((p) => p.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Investito</p>
            <InfoTip text="Capitale totale impiegato nelle posizioni aperte (prezzo di carico × shares + commissioni)." />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totals.totalInvested)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">MtM Live</p>
            <InfoTip text="Mark-to-Market: valore di mercato corrente di tutte le posizioni aperte (prezzo live × shares)." />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {totals.totalMtM > 0 ? formatCurrency(totals.totalMtM) : "—"}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Unrealized P&L</p>
            <InfoTip text="Profitto o perdita sulle posizioni ancora aperte, calcolato rispetto al prezzo di mercato corrente." />
          </div>
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
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Realized P&L</p>
            <InfoTip text="Profitto o perdita effettivo sulle posizioni già chiuse, al netto delle commissioni." />
          </div>
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

      {/* Performance fees summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Gross P&L</p>
            <InfoTip text="Somma di Unrealized + Realized P&L." />
          </div>
          <p className={`text-lg font-bold ${totals.totalGross >= 0 ? "text-green-600" : "text-destructive"}`}>
            {formatPnL(totals.totalGross)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">Performance Fee (15%)</p>
            <InfoTip text="15% sul P&L lordo positivo. Nessuna fee se il P&L è negativo." />
          </div>
          <p className="text-lg font-bold text-amber-500">
            {totals.perfFee > 0 ? `-${formatCurrency(totals.perfFee)}` : "$0.00"}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 border-primary/30">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground font-semibold">Net of Fees</p>
            <InfoTip text="P&L netto dopo la deduzione della performance fee del 15%." />
          </div>
          <p className={`text-lg font-bold ${totals.netOfFees >= 0 ? "text-green-600" : "text-destructive"}`}>
            {formatPnL(totals.netOfFees)}
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
              <TableHead className="w-24">
                <HeaderTip label="Ticker" tip="Simbolo di borsa del titolo (es. AAPL, MSFT)." />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>
                <HeaderTip label="Status" tip="PASS = pronto per l'ingresso, WATCHLIST = in osservazione." />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Entry Zone" tip="Range di prezzo consigliato per l'acquisto." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Prezzo Carico" tip="Prezzo effettivo a cui è stata aperta la posizione." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Prezzo Live" tip="Prezzo di mercato corrente del titolo." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Chg%" tip="Variazione percentuale giornaliera del prezzo." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Shares" tip="Numero di azioni/quote detenute." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Fees" tip="Commissioni di acquisto pagate al broker." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Stop" tip="Stop-loss: prezzo sotto il quale si chiude la posizione per limitare le perdite." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="T1 / T2" tip="Target 1 e Target 2: livelli di prezzo obiettivo per la presa di profitto." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="MtM Live" tip="Mark-to-Market: valore di mercato corrente della posizione (prezzo live × shares)." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Unrealized P&L" tip="Profitto o perdita non realizzato sulle posizioni aperte, calcolato rispetto al prezzo di mercato corrente." align="right" />
              </TableHead>
              <TableHead className="text-right">
                <HeaderTip label="Realized P&L" tip="Profitto o perdita effettivo sulle posizioni già chiuse, al netto delle commissioni." align="right" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={15}
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
              const mtmValue =
                hasEntry && livePrice
                  ? livePrice * pos.shares!
                  : null;
              const unrealizedPnl =
                hasEntry && livePrice
                  ? (livePrice - pos.entry_price!) * pos.shares! -
                    (pos.fees || 0)
                  : null;
              const unrealizedPct =
                hasEntry && livePrice && pos.entry_price
                  ? ((livePrice - pos.entry_price) / pos.entry_price) * 100
                  : null;

              // removed displayPnl - now showing MtM, unrealized, and realized separately

              return (
                <TableRow
                  key={pos.id}
                  className={!pos.is_active ? "opacity-50" : ""}
                >
                  <TableCell className="font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                        onClick={() => openEdit(pos)}
                        title="Modifica prezzo di carico"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {pos.ticker}
                    </div>
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
                      : <button onClick={() => openEdit(pos)} className="text-primary text-xs underline underline-offset-2 hover:text-primary/80 cursor-pointer">da inserire</button>}
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
                  {/* MtM Live (current market value) */}
                  <TableCell className="text-right font-mono text-sm">
                    {pos.is_active && mtmValue != null
                      ? formatCurrency(mtmValue)
                      : !pos.is_active
                      ? <span className="text-xs text-muted-foreground">chiusa</span>
                      : "—"}
                  </TableCell>
                  {/* Unrealized P&L */}
                  <TableCell className="text-right">
                    {pos.is_active && unrealizedPnl != null ? (
                      <div>
                        <span
                          className={`font-mono font-bold ${
                            unrealizedPnl >= 0
                              ? "text-green-600"
                              : "text-destructive"
                          }`}
                        >
                          {formatPnL(unrealizedPnl)}
                        </span>
                        {unrealizedPct != null && (
                          <div className="text-xs text-muted-foreground">
                            {unrealizedPct >= 0 ? "+" : ""}
                            {unrealizedPct.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    ) : pos.is_active ? (
                      "—"
                    ) : (
                      <span className="text-xs text-muted-foreground">chiusa</span>
                    )}
                  </TableCell>
                  {/* Realized P&L */}
                  <TableCell className="text-right">
                    {pos.realized_pnl != null ? (
                      <span
                        className={`font-mono font-bold ${
                          pos.realized_pnl >= 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {formatPnL(pos.realized_pnl)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
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
                  onChange={(e) => handleEntryPriceChange(e.target.value)}
                  placeholder="es. 78.50"
                />
              </div>
              <div>
                <Label>Shares (auto: $50K / prezzo)</Label>
                <Input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="auto-calcolato"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Allocazione: {formatCurrency(ALLOCATION_PER_POSITION)} per posizione
                </p>
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
    </TooltipProvider>
  );
}

/* ---- Small helper components for tooltips ---- */

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3 w-3 text-muted-foreground/60 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function HeaderTip({ label, tip, align = "left" }: { label: string; tip: string; align?: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-xs">
          {tip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
