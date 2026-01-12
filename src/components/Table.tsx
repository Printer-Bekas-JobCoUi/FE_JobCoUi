import React, { useState } from "react";
import { ArrowUp, ArrowDown, Copy, Check } from "lucide-react";

type Column<T> = {
  key: string;
  title: string | React.ReactNode;
  className?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
};

export default function Table<T extends Record<string, unknown>>({
  columns,
  rows,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (columnKey: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return rows;
    
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortConfig]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {/* Modern header with gradient underline */}
        <thead className="border-b-2 border-white/10 relative">
          <tr className="relative">
            {/* Gradient underline */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-cyan/50" style={{
              background: 'linear-gradient(90deg, rgba(102,126,234,0.5) 0%, rgba(245,87,108,0.5) 50%, rgba(56,249,215,0.5) 100%)'
            }} />
            
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-4 px-4 first:pl-0 last:pr-0 text-xs font-bold text-slate-300 uppercase tracking-wider group ${
                  col.sortable ? "cursor-pointer select-none" : ""
                } ${col.className ?? ""}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="transition-colors group-hover:text-white">
                    {col.title}
                  </span>
                  {col.sortable && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-accent" />
                        )
                      ) : (
                        <ArrowUp className="h-3 w-3 text-slate-500" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Interactive table body */}
        <tbody className="divide-y divide-white/5">
          {sortedRows.map((row, idx) => (
            <tr
              key={idx}
              className="table-row group relative"
            >
              {/* Accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-4 px-4 first:pl-0 last:pr-0 text-slate-300 relative ${
                    col.className ?? ""
                  }`}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
          
          {/* Empty state */}
          {sortedRows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-slate-400"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-3xl">📋</span>
                  </div>
                  <div className="font-medium">Tidak ada data</div>
                  <div className="text-xs">Data akan muncul di sini</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Copyable Hash Component
export function CopyableHash({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncated = value.length > 12 ? `${value.slice(0, 8)}...${value.slice(-4)}` : value;

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
      title={value}
    >
      <code className="text-xs font-mono text-cyan">{truncated}</code>
      {copied ? (
        <Check className="h-3 w-3 text-success animate-fade-in" />
      ) : (
        <Copy className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

// User Avatar Component
export function UserAvatar({
  src,
  name,
  online = false,
}: {
  src?: string;
  name: string;
  online?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
        />
      ) : (
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
          {initials}
        </div>
      )}
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-bg-primary pulse-glow" />
      )}
    </div>
  );
}
