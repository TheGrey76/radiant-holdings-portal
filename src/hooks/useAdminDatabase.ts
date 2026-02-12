import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FUNCTION_URL = "admin-database-query";

async function callAdmin(action: string, params: Record<string, any> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke(FUNCTION_URL, {
    body: { action, ...params },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data?.data;
}

export interface TableInfo {
  table_name: string;
  column_count: number;
}

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
}

export interface Filter {
  column: string;
  operator: string;
  value: string;
}

export function useAdminDatabase() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    try {
      return await fn();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const listTables = () => withLoading(() => callAdmin("list_tables")) as Promise<TableInfo[] | null>;

  const getTableSchema = (table: string) =>
    withLoading(() => callAdmin("table_schema", { table })) as Promise<ColumnInfo[] | null>;

  const getTableCount = (table: string) =>
    withLoading(() => callAdmin("table_count", { table }));

  const readTable = (table: string, opts: { filters?: Filter[]; limit?: number; offset?: number; orderBy?: string; orderDir?: string }) =>
    withLoading(() => callAdmin("read", { table, ...opts }));

  const insertRow = (table: string, data: Record<string, any>) =>
    withLoading(() => callAdmin("insert", { table, data }));

  const updateRow = (table: string, id: string, data: Record<string, any>) =>
    withLoading(() => callAdmin("update", { table, id, data }));

  const deleteRow = (table: string, id: string) =>
    withLoading(() => callAdmin("delete", { table, id }));

  const executeSql = (query: string) =>
    withLoading(() => callAdmin("execute_sql", { query }));

  const getOpenApiSchema = () =>
    withLoading(() => callAdmin("openapi_schema"));

  return { loading, listTables, getTableSchema, getTableCount, readTable, insertRow, updateRow, deleteRow, executeSql, getOpenApiSchema };
}
