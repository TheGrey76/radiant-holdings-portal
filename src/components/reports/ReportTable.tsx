import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableDataConfig {
  headers?: string[];
  rows?: Array<Array<string | number>>;
  highlightFirst?: boolean;
}

interface ReportTableProps {
  data?: Record<string, unknown>;
}

const ReportTable = ({ data }: ReportTableProps) => {
  const tableData = data as TableDataConfig | undefined;
  
  const headers = tableData?.headers || ['Metric', 'Value', 'Change'];
  const rows = tableData?.rows || [
    ['Revenue', '$1.2M', '+15%'],
    ['Users', '45,000', '+22%'],
    ['Conversion', '3.2%', '+0.5%'],
  ];
  const highlightFirst = tableData?.highlightFirst ?? true;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            {headers.map((header, index) => (
              <TableHead 
                key={index}
                className="text-zinc-400 font-semibold bg-zinc-900"
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
              className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <TableCell 
                  key={cellIndex}
                  className={
                    cellIndex === 0 && highlightFirst
                      ? 'font-medium text-white'
                      : 'text-zinc-300'
                  }
                >
                  {/* Color code percentage changes */}
                  {typeof cell === 'string' && cell.startsWith('+') ? (
                    <span className="text-emerald-400">{cell}</span>
                  ) : typeof cell === 'string' && cell.startsWith('-') ? (
                    <span className="text-red-400">{cell}</span>
                  ) : (
                    cell
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;
