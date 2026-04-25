"use client";
import { useEffect, useState, useCallback } from "react";
import { getAdminEnquiries, patchEnquiryStatus, deleteEnquiry } from "@/lib/admin/api";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import type { Enquiry } from "@/types";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "booked", "closed"];
const FILTER_OPTIONS = ["all", ...STATUS_OPTIONS];

const COLS = [
  { key: "name",    label: "Name" },
  { key: "email",   label: "Email" },
  { key: "phone",   label: "Phone" },
  { key: "service", label: "Service" },
  { key: "status",  label: "Status" },
  { key: "date",    label: "Date" },
  { key: "actions", label: "Actions" },
];

export default function AdminEnquiriesPage() {
  const [items, setItems]       = useState<Enquiry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminEnquiries(page, limit, filter === "all" ? undefined : filter);
      setItems(res.data?.data ?? []);
      setTotal(res.data?.pagination?.total ?? 0);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await patchEnquiryStatus(id, status);
      setItems((prev) => prev.map((e) => e._id === id ? { ...e, status: status as Enquiry["status"] } : e));
    } catch { /* silent */ }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    try {
      await deleteEnquiry(id);
      setItems((prev) => prev.filter((e) => e._id !== id));
    } catch { /* silent */ }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine">Enquiries</h1>
          <p className="text-brand-muted text-sm mt-0.5">{total} total enquiry{total !== 1 ? "ies" : "y"}</p>
        </div>

        {/* Status filter */}
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

      <AdminTable columns={COLS} loading={loading} emptyMessage="No enquiries found.">
        {items.map((e) => (
          <>
            <tr
              key={e._id}
              className="hover:bg-cream/50 transition-colors cursor-pointer"
              onClick={() => setExpanded(expanded === e._id ? null : e._id)}
            >
              <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                {e.firstName} {e.lastName}
              </td>
              <td className="px-4 py-3 text-brand-muted">{e.email}</td>
              <td className="px-4 py-3 text-brand-muted">{e.phone || "—"}</td>
              <td className="px-4 py-3 text-sm">{e.service}</td>
              <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
              <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                {new Date(e.createdAt).toLocaleDateString("en-GB")}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e._id, ev.target.value)}
                    className="text-xs border border-cream-mid rounded px-2 py-1 bg-white outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => remove(e._id)}
                    className="text-brand-muted hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
            {/* Expanded message row */}
            {expanded === e._id && (
              <tr key={`${e._id}-exp`} className="bg-sage-pale/40">
                <td colSpan={7} className="px-6 py-3">
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-ink leading-relaxed">{e.message}</p>
                  <div className="flex gap-4 mt-2">
                    <a href={`mailto:${e.email}`} className="text-xs text-pine-light hover:underline">
                      Reply by email →
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="text-xs text-pine-light hover:underline">
                        Call {e.phone} →
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </>
        ))}
      </AdminTable>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-brand-muted">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
