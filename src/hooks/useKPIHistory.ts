import { useState, useEffect } from "react";

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

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse KPI history:", e);
        setHistory([]);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (newHistory: KPISnapshot[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Add or update today's snapshot
  const recordSnapshot = (snapshot: Omit<KPISnapshot, "date">) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const newHistory = [...history];
    
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

    saveHistory(newHistory);
  };

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

  return {
    history,
    recordSnapshot,
    getSnapshotsForRange,
    calculateTrend,
  };
}
