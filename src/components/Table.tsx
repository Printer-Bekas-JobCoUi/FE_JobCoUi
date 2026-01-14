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
      const aVal = a[sortConfig.key] as string | number;
      const bVal = b[sortConfig.key] as string | number;
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortConfig]);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider group ${
                  col.sortable ? "cursor-pointer select-none hover:bg-slate-100" : ""
                } ${col.className ?? ""}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">
                    {col.title}
                  </span>
                  {col.sortable && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUp className="h-3 w-3 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100 bg-white">
          {sortedRows.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-slate-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 text-slate-700 ${
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
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <span className="text-2xl text-slate-300">📋</span>
                  </div>
                  <div className="font-medium text-slate-600">Tidak ada data</div>
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
