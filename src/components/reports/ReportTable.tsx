import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Json } from "@/integrations/supabase/types";

interface TableData {
  headers: string[];
  rows: Array<Array<string | number>>;
  highlightRows?: number[];
}

interface ReportTableProps {
  data: Json | null;
}

export const ReportTable = ({ data }: ReportTableProps) => {
  const tableData = useMemo(() => {
    if (!data || typeof data !== 'object') return null;
    return data as unknown as TableData;
  }, [data]);

  if (!tableData || !tableData.headers || !tableData.rows) {
    return (
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-6 text-center text-muted-foreground">
          Table data not available
        </CardContent>
      </Card>
    );
  }

  const { headers, rows, highlightRows = [] } = tableData;

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {headers.map((header, index) => (
                  <TableHead 
                    key={index}
                    className="text-foreground font-semibold bg-muted/30"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  className={`border-border/30 ${
                    highlightRows.includes(rowIndex) 
                      ? 'bg-primary/10 hover:bg-primary/15' 
                      : 'hover:bg-muted/30'
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell 
                      key={cellIndex}
                      className={`${
                        highlightRows.includes(rowIndex) 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
