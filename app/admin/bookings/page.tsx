"use client";
import { useEffect, useState, useCallback } from "react";
import { getAdminBookings, patchBookingStatus, deleteBooking } from "@/lib/admin/api";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import type { Booking } from "@/types";
import { Trash2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];
const FILTER_OPTIONS = ["all", ...STATUS_OPTIONS];

const COLS = [
  { key: "name",    label: "Client" },
  { key: "service", label: "Service" },
  { key: "date",    label: "Preferred Date" },
  { key: "time",    label: "Time" },
  { key: "phone",   label: "Phone" },
  { key: "status",  label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function AdminBookingsPage() {
  const [items, setItems]       = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminBookings(page, limit, filter === "all" ? undefined : filter);
      setItems(res.data?.data ?? []);
      setTotal(res.data?.pagination?.total ?? 0);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await patchBookingStatus(id, status);
      setItems((prev) =>
        prev.map((b) => b._id === id ? { ...b, status: status as Booking["status"] } : b)
      );
    } catch { /* silent */ }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    try {
      await deleteBooking(id);
      setItems((prev) => prev.filter((b) => b._id !== id));
    } catch { /* silent */ }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine">Bookings</h1>
          <p className="text-brand-muted text-sm mt-0.5">{total} total booking{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors border ${
                filter === s ? "bg-pine text-cream border-pine" : "bg-white text-brand-muted border-cream-mid hover:border-pine/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <AdminTable columns={COLS} loading={loading} emptyMessage="No bookings found.">
        {items.map((b) => (
          <>
            <tr
              key={b._id}
              className="hover:bg-cream/50 transition-colors cursor-pointer"
              onClick={() => setExpanded(expanded === b._id ? null : b._id)}
            >
              <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                {b.firstName} {b.lastName}
                <p className="text-xs text-brand-muted font-normal">{b.email}</p>
              </td>
              <td className="px-4 py-3 text-sm">{b.service}</td>
              <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{b.preferredDate}</td>
              <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{b.preferredTime}</td>
              <td className="px-4 py-3 text-brand-muted">{b.phone}</td>
              <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                  <select
                    value={b.status}
                    onChange={(ev) => updateStatus(b._id, ev.target.value)}
                    className="text-xs border border-cream-mid rounded px-2 py-1 bg-white outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => remove(b._id)}
                    className="text-brand-muted hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
            {expanded === b._id && (
              <tr key={`${b._id}-exp`} className="bg-sage-pale/40">
                <td colSpan={7} className="px-6 py-3">
                  <div className="flex items-start gap-2 text-sm text-ink">
                    <MapPin size={14} className="text-pine-light mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Job Address</p>
                      <p className="text-brand-muted">{b.address}</p>
                    </div>
                  </div>
                  {b.notes && (
                    <p className="text-sm text-brand-muted mt-2 italic">&ldquo;{b.notes}&rdquo;</p>
                  )}
                  <div className="flex gap-4 mt-2">
                    <a href={`mailto:${b.email}`} className="text-xs text-pine-light hover:underline">
                      Email client →
                    </a>
                    <a href={`tel:${b.phone}`} className="text-xs text-pine-light hover:underline">
                      Call {b.phone} →
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </>
        ))}
      </AdminTable>

      {pages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-brand-muted">Page {page} of {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
