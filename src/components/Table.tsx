import React, { useState } from "react";
import { ArrowUp, ArrowDown, Copy, Check, Search, RefreshCcw } from "lucide-react";

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
  className?: string;
  emptyText?: string;
  loading?: boolean;
};

export default function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  className,
  emptyText,
  loading = false,
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
      const aVal = a[sortConfig.key] as string | number | undefined;
      const bVal = b[sortConfig.key] as string | number | undefined;
      
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortConfig]);

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ${className || ""}`}>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
            {columns.map((col) => {
              const isRight = col.className?.includes('text-right');
              const isCenter = col.className?.includes('text-center');
              
              return (
                <th
                  key={col.key}
                  className={`py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest group border-b border-slate-200 ${
                    col.sortable ? "cursor-pointer select-none hover:bg-slate-100/50" : ""
                  } ${col.className ?? ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="inline-flex items-center gap-2">
                    <span>{col.title}</span>
                    {col.sortable && (
                      <span className={`transition-all duration-200 ${sortConfig?.key === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}>
                        {sortConfig?.key === col.key && sortConfig.direction === "desc" ? (
                          <ArrowDown className="h-3 w-3 text-blue-500" />
                        ) : (
                          <ArrowUp className="h-3 w-3 text-blue-500" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-50 relative">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="py-5 px-6">
                    <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : sortedRows.length > 0 ? (
            sortedRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-50/30 transition-all duration-150 group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-4 px-6 text-slate-600 font-medium ${
                      col.className ?? ""
                    }`}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-20 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                      <span className="text-lg">✨</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{emptyText || "Tidak ada data ditemukan"}</div>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Coba sesuaikan filter pencarian atau tambahkan data baru untuk melihat hasilnya di sini.</p>
                  </div>
                  <button onClick={() => window.location.reload()} className="btn-secondary text-xs mt-2 border-slate-200">
                    <RefreshCcw className="h-3 w-3 mr-2" /> Segarkan Halaman
                  </button>
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
