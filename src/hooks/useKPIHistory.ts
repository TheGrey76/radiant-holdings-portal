import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface KPISnapshot {
  date: string;
  raisedAmount: number;
  targetAmount: number;
  pipelineValue: number;
  closedDealsCount: number;
  closedDealsValue: number;
  meetingsCount: number;
  meetingsTarget: number;
  totalInvestors: number;
  toContactCount: number;
  contactedCount: number;
  interestedCount: number;
  meetingScheduledCount: number;
  inNegotiationCount: number;
  notesCount: number;
  activitiesCount: number;
  campaignsCount: number;
}

export function useKPIHistory() {
  const [history, setHistory] = useState<KPISnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch history from Supabase
  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("abc_kpi_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: true });

      if (error) {
        console.error("Error fetching KPI history:", error);
        return;
      }

      const snapshots: KPISnapshot[] = (data || []).map((row) => ({
        date: row.snapshot_date,
        raisedAmount: Number(row.raised_amount) || 0,
        targetAmount: Number(row.target_amount) || 5000000,
        pipelineValue: Number(row.pipeline_value) || 0,
        closedDealsCount: row.closed_deals_count || 0,
        closedDealsValue: Number(row.closed_deals_value) || 0,
        meetingsCount: row.meetings_count || 0,
        meetingsTarget: row.meetings_target || 50,
        totalInvestors: row.total_investors || 0,
        toContactCount: row.to_contact_count || 0,
        contactedCount: row.contacted_count || 0,
        interestedCount: row.interested_count || 0,
        meetingScheduledCount: row.meeting_scheduled_count || 0,
        inNegotiationCount: row.in_negotiation_count || 0,
        notesCount: row.notes_count || 0,
        activitiesCount: row.activities_count || 0,
        campaignsCount: row.campaigns_count || 0,
      }));

      setHistory(snapshots);
    } catch (e) {
      console.error("Failed to fetch KPI history:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Capture today's snapshot by calling the database function
  const recordSnapshot = useCallback(async () => {
    try {
      const { error } = await supabase.rpc("capture_kpi_snapshot");
      if (error) {
        console.error("Error capturing KPI snapshot:", error);
        return;
      }
      // Refresh history after capturing
      await fetchHistory();
    } catch (e) {
      console.error("Failed to capture KPI snapshot:", e);
    }
  }, [fetchHistory]);

  // Load history on mount and capture today's snapshot
  useEffect(() => {
    const init = async () => {
      await recordSnapshot();
    };
    init();
  }, [recordSnapshot]);

  // Get snapshots for a specific time range
  const getSnapshotsForRange = useCallback(
    (days: number | "all"): KPISnapshot[] => {
      if (days === "all") return history;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoff = cutoffDate.toISOString().split("T")[0];

      return history.filter((s) => s.date >= cutoff);
    },
    [history]
  );

  // Calculate trend (percentage change from first to last in range)
  const calculateTrend = useCallback(
    (values: number[]): { change: number; direction: "up" | "down" | "flat" } => {
      if (values.length < 2) return { change: 0, direction: "flat" };

      const first = values[0];
      const last = values[values.length - 1];

      if (first === 0) return { change: 0, direction: "flat" };

      const change = ((last - first) / first) * 100;
      const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";

      return { change: Math.abs(change), direction };
    },
    []
  );

  // Linear regression for forecasting
  const calculateLinearRegression = useCallback(
    (data: { x: number; y: number }[]) => {
      const n = data.length;
      if (n < 2) return null;

      const sumX = data.reduce((sum, p) => sum + p.x, 0);
      const sumY = data.reduce((sum, p) => sum + p.y, 0);
      const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
      const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return { slope, intercept };
    },
    []
  );

  // Forecast future value based on historical trend
  const forecastValue = useCallback(
    (
      snapshots: KPISnapshot[],
      getValue: (s: KPISnapshot) => number,
      daysAhead: number
    ): number | null => {
      if (snapshots.length < 2) return null;

      const data = snapshots.map((s, i) => ({
        x: i,
        y: getValue(s),
      }));

      const regression = calculateLinearRegression(data);
      if (!regression) return null;

      const futureX = snapshots.length - 1 + daysAhead;
      const forecastedValue = regression.slope * futureX + regression.intercept;

      return Math.max(0, forecastedValue);
    },
    [calculateLinearRegression]
  );

  // Predict when a target will be reached
  const predictTargetDate = useCallback(
    (
      snapshots: KPISnapshot[],
      getValue: (s: KPISnapshot) => number,
      targetValue: number
    ): string | null => {
      if (snapshots.length < 2) return null;

      const data = snapshots.map((s, i) => ({
        x: i,
        y: getValue(s),
      }));

      const regression = calculateLinearRegression(data);
      if (!regression || regression.slope <= 0) return null;

      const currentValue = getValue(snapshots[snapshots.length - 1]);
      if (currentValue >= targetValue) return "Target reached";

      const daysFromStart = (targetValue - regression.intercept) / regression.slope;
      const daysAhead = daysFromStart - (snapshots.length - 1);

      if (daysAhead < 0) return "Target reached";

      const lastDate = new Date(snapshots[snapshots.length - 1].date);
      const predictedDate = new Date(lastDate);
      predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysAhead));

      return predictedDate.toISOString().split("T")[0];
    },
    [calculateLinearRegression]
  );

  // Get current (latest) snapshot metrics
  const getCurrentMetrics = useCallback((): KPISnapshot | null => {
    if (history.length === 0) return null;
    return history[history.length - 1];
  }, [history]);

  return {
    history,
    isLoading,
    recordSnapshot,
    getSnapshotsForRange,
    calculateTrend,
    forecastValue,
    predictTargetDate,
    getCurrentMetrics,
    refetch: fetchHistory,
  };
}
