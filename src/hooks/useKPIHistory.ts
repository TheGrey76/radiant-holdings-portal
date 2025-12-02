import { useState, useEffect, useCallback, useRef } from "react";

export interface KPISnapshot {
  date: string; // ISO date string
  raisedAmount: number;
  targetAmount: number;
  pipelineValue: number;
  closedDealsCount: number;
  closedDealsValue: number;
  meetingsCount: number;
  meetingsTarget: number;
}

const STORAGE_KEY = "abc_kpi_history";

export function useKPIHistory() {
  const [history, setHistory] = useState<KPISnapshot[]>([]);
  const historyRef = useRef<KPISnapshot[]>([]);
  const hasRecordedToday = useRef(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        historyRef.current = parsed;
      } catch (e) {
        console.error("Failed to parse KPI history:", e);
        setHistory([]);
        historyRef.current = [];
      }
    }
  }, []);

  // Add or update today's snapshot (memoized to prevent infinite loops)
  const recordSnapshot = useCallback((snapshot: Omit<KPISnapshot, "date">) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Only record once per day to prevent loops
    if (hasRecordedToday.current) return;
    hasRecordedToday.current = true;
    
    const newHistory = [...historyRef.current];
    
    // Check if we already have a snapshot for today
    const todayIndex = newHistory.findIndex((s) => s.date === today);
    
    const fullSnapshot: KPISnapshot = {
      ...snapshot,
      date: today,
    };

    if (todayIndex >= 0) {
      // Update existing snapshot
      newHistory[todayIndex] = fullSnapshot;
    } else {
      // Add new snapshot
      newHistory.push(fullSnapshot);
    }

    // Sort by date (oldest first)
    newHistory.sort((a, b) => a.date.localeCompare(b.date));

    // Save to localStorage and update state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    historyRef.current = newHistory;
    setHistory(newHistory);
  }, []);

  // Get snapshots for a specific time range
  const getSnapshotsForRange = (days: number): KPISnapshot[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = cutoffDate.toISOString().split("T")[0];

    return history.filter((s) => s.date >= cutoff);
  };

  // Calculate trend (percentage change from first to last in range)
  const calculateTrend = (values: number[]): { change: number; direction: "up" | "down" | "flat" } => {
    if (values.length < 2) return { change: 0, direction: "flat" };
    
    const first = values[0];
    const last = values[values.length - 1];
    
    if (first === 0) return { change: 0, direction: "flat" };
    
    const change = ((last - first) / first) * 100;
    const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
    
    return { change: Math.abs(change), direction };
  };

  // Linear regression for forecasting
  const calculateLinearRegression = (data: { x: number; y: number }[]) => {
    const n = data.length;
    if (n < 2) return null;

    const sumX = data.reduce((sum, p) => sum + p.x, 0);
    const sumY = data.reduce((sum, p) => sum + p.y, 0);
    const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  // Forecast future value based on historical trend
  const forecastValue = (snapshots: KPISnapshot[], getValue: (s: KPISnapshot) => number, daysAhead: number): number | null => {
    if (snapshots.length < 2) return null;

    const data = snapshots.map((s, i) => ({
      x: i,
      y: getValue(s),
    }));

    const regression = calculateLinearRegression(data);
    if (!regression) return null;

    const futureX = snapshots.length - 1 + daysAhead;
    const forecastedValue = regression.slope * futureX + regression.intercept;

    return Math.max(0, forecastedValue); // Don't allow negative forecasts
  };

  // Predict when a target will be reached
  const predictTargetDate = (snapshots: KPISnapshot[], getValue: (s: KPISnapshot) => number, targetValue: number): string | null => {
    if (snapshots.length < 2) return null;

    const data = snapshots.map((s, i) => ({
      x: i,
      y: getValue(s),
    }));

    const regression = calculateLinearRegression(data);
    if (!regression || regression.slope <= 0) return null; // Can't predict if no growth

    const currentValue = getValue(snapshots[snapshots.length - 1]);
    if (currentValue >= targetValue) return "Target reached";

    // Solve for x when y = targetValue: targetValue = slope * x + intercept
    const daysFromStart = (targetValue - regression.intercept) / regression.slope;
    const daysAhead = daysFromStart - (snapshots.length - 1);

    if (daysAhead < 0) return "Target reached";

    const lastDate = new Date(snapshots[snapshots.length - 1].date);
    const predictedDate = new Date(lastDate);
    predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysAhead));

    return predictedDate.toISOString().split("T")[0];
  };

  return {
    history,
    recordSnapshot,
    getSnapshotsForRange,
    calculateTrend,
    forecastValue,
    predictTargetDate,
  };
}
