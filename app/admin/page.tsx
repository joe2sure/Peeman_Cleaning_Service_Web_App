"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Enquiry, Booking } from "@/types";

export default function AdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"enquiries" | "bookings">("enquiries");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [eq, bk] = await Promise.all([
          api.get("/api/v1/enquiries"),
          api.get("/api/v1/bookings"),
        ]);
        setEnquiries(eq.data.data || []);
        setBookings(bk.data.data || []);
      } catch {
        /* handle silently – show empty state */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColors: Record<string, string> = {
    new: "bg-gold/20 text-gold",
    contacted: "bg-sage-pale text-pine-mid",
    booked: "bg-pine/10 text-pine",
    closed: "bg-cream-mid text-brand-muted",
    pending: "bg-gold/20 text-gold",
    confirmed: "bg-sage-pale text-pine-mid",
    completed: "bg-pine/10 text-pine",
    cancelled: "bg-red-100 text-red-700",
  };

  const updateStatus = async (
    id: string,
    status: string,
    type: "enquiries" | "bookings"
  ) => {
    try {
      await api.patch(`/api/v1/${type}/${id}`, { status });
      if (type === "enquiries") {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: status as Enquiry["status"] } : e))
        );
      } else {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: status as Booking["status"] } : b))
        );
      }
    } catch {/* silent */}
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-[5vw]">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-semibold text-pine mb-1">
          Admin Dashboard
        </h1>
        <p className="text-brand-muted text-sm mb-8">
          Peeman Cleaning Services — internal management
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Enquiries", value: enquiries.length },
            { label: "New Enquiries", value: enquiries.filter((e) => e.status === "new").length },
            { label: "Total Bookings", value: bookings.length },
            { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-cream-mid rounded-xl p-5">
              <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="font-serif text-3xl font-semibold text-pine">
                {loading ? "–" : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-cream-mid rounded-lg p-1 w-fit">
          {(["enquiries", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-pine text-cream"
                  : "text-brand-muted hover:text-pine"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-brand-muted text-sm">Loading…</div>
        ) : tab === "enquiries" ? (
          <div className="bg-white border border-cream-mid rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-mid">
                  <tr>
                    {["Name", "Email", "Phone", "Service", "Status", "Date", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-mid">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
                        No enquiries yet.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((e) => (
                      <tr key={e._id} className="hover:bg-cream/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">
                          {e.firstName} {e.lastName}
                        </td>
                        <td className="px-4 py-3 text-brand-muted">{e.email}</td>
                        <td className="px-4 py-3 text-brand-muted">{e.phone || "–"}</td>
                        <td className="px-4 py-3">{e.service}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brand-muted">
                          {new Date(e.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={e.status}
                            onChange={(ev) => updateStatus(e._id, ev.target.value, "enquiries")}
                            className="text-xs border border-cream-mid rounded px-2 py-1 bg-white"
                          >
                            {["new", "contacted", "booked", "closed"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-cream-mid rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-mid">
                  <tr>
                    {["Name", "Email", "Service", "Date", "Address", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-mid">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
                        No bookings yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-cream/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">
                          {b.firstName} {b.lastName}
                        </td>
                        <td className="px-4 py-3 text-brand-muted">{b.email}</td>
                        <td className="px-4 py-3">{b.service}</td>
                        <td className="px-4 py-3 text-brand-muted">{b.preferredDate}</td>
                        <td className="px-4 py-3 text-brand-muted truncate max-w-[140px]">
                          {b.address}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={b.status}
                            onChange={(ev) => updateStatus(b._id, ev.target.value, "bookings")}
                            className="text-xs border border-cream-mid rounded px-2 py-1 bg-white"
                          >
                            {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
