import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface AdminTableProps {
  columns: Column[];
  children: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  colSpan?: number;
}

export function AdminTable({
  columns, children, loading, emptyMessage = "No records found.", colSpan,
}: AdminTableProps) {
  return (
    <div className="bg-white border border-cream-mid rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-mid">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider whitespace-nowrap",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-mid">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-cream-mid rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              children || (
                <tr>
                  <td
                    colSpan={colSpan ?? columns.length}
                    className="px-4 py-10 text-center text-brand-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new:       "bg-gold/15 text-yellow-700",
    contacted: "bg-sage-pale text-pine-mid",
    booked:    "bg-pine/10 text-pine",
    closed:    "bg-cream-mid text-brand-muted",
    pending:   "bg-gold/15 text-yellow-700",
    confirmed: "bg-sage-pale text-pine-mid",
    completed: "bg-pine/10 text-pine",
    cancelled: "bg-red-100 text-red-700",
    approved:  "bg-sage-pale text-pine-mid",
    rejected:  "bg-red-100 text-red-700",
  };
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
      colors[status] ?? "bg-cream-mid text-brand-muted"
    )}>
      {status}
    </span>
  );
}
