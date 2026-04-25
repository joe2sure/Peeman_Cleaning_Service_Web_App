"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardStats } from "@/lib/admin/api";
import {
  ClipboardList, CalendarCheck, Star, ImagePlus,
  TrendingUp, ArrowRight, Loader2,
} from "lucide-react";

interface Stats {
  enquiries: { total: number; new: number } | null;
  bookings:  { total: number; pending: number; confirmed: number } | null;
  reviews:   { total: number; approved: number } | null;
  gallery:   { total: number; published: number; featured: number } | null;
}

const STAT_CARDS = (s: Stats) => [
  {
    label: "Enquiries",
    total: s.enquiries?.total ?? 0,
    sub: `${s.enquiries?.new ?? 0} new`,
    icon: ClipboardList,
    href: "/admin/enquiries",
    color: "bg-gold/10 text-gold",
  },
  {
    label: "Bookings",
    total: s.bookings?.total ?? 0,
    sub: `${s.bookings?.pending ?? 0} pending`,
    icon: CalendarCheck,
    href: "/admin/bookings",
    color: "bg-sage/10 text-pine-light",
  },
  {
    label: "Reviews",
    total: s.reviews?.total ?? 0,
    sub: `${s.reviews?.approved ?? 0} approved`,
    icon: Star,
    href: "/admin/reviews",
    color: "bg-pine/10 text-pine",
  },
  {
    label: "Gallery Items",
    total: s.gallery?.total ?? 0,
    sub: `${s.gallery?.published ?? 0} published`,
    icon: ImagePlus,
    href: "/admin/gallery",
    color: "bg-bark-light/10 text-bark",
  },
];

const QUICK_LINKS = [
  { label: "Upload Media",      href: "/admin/gallery",   icon: ImagePlus },
  { label: "View Enquiries",    href: "/admin/enquiries", icon: ClipboardList },
  { label: "Manage Bookings",   href: "/admin/bookings",  icon: CalendarCheck },
  { label: "Approve Reviews",   href: "/admin/reviews",   icon: Star },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    enquiries: null, bookings: null, reviews: null, gallery: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats({
          enquiries: data.enquiries?.pagination
            ? { total: data.enquiries.pagination.total, new: 0 }
            : null,
          bookings: data.bookings?.pagination
            ? { total: data.bookings.pagination.total, pending: 0, confirmed: 0 }
            : null,
          reviews: data.reviews?.pagination
            ? { total: data.reviews.pagination.total, approved: 0 }
            : null,
          gallery: data.gallery ?? null,
        });
      })
      .catch(() => {/* silently keep zeroes */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-pine">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">
          Welcome back — here&apos;s an overview of Peeman Cleaning Services.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-cream-mid rounded-xl p-5 animate-pulse">
                <div className="h-3 bg-cream-mid rounded w-1/2 mb-3" />
                <div className="h-8 bg-cream-mid rounded w-1/3 mb-2" />
                <div className="h-2.5 bg-cream-mid rounded w-2/3" />
              </div>
            ))
          : STAT_CARDS(stats).map(({ label, total, sub, icon: Icon, href, color }) => (
              <Link
                key={label}
                href={href}
                className="bg-white border border-cream-mid rounded-xl p-5 hover:border-pine/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={15} />
                  </div>
                </div>
                <p className="font-serif text-3xl font-semibold text-pine">{total}</p>
                <p className="text-xs text-brand-muted mt-1 flex items-center gap-1">
                  <TrendingUp size={11} className="text-pine-light" />
                  {sub}
                </p>
              </Link>
            ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-pine mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-cream-mid rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-pine/25 hover:bg-cream/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sage-pale flex items-center justify-center group-hover:bg-pine group-hover:text-cream transition-colors">
                <Icon size={16} className="text-pine group-hover:text-cream transition-colors" />
              </div>
              <span className="text-xs font-medium text-brand-muted group-hover:text-pine transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips card */}
      <div className="bg-pine rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-cream mb-1">
            Keep your gallery fresh
          </h3>
          <p className="text-white/60 text-sm max-w-md">
            Upload before &amp; after photos after every job. Clients trust visual proof — a
            regularly updated gallery can increase enquiry rates significantly.
          </p>
        </div>
        <Link
          href="/admin/gallery"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-gold text-pine px-5 py-2.5 rounded text-sm font-medium hover:bg-gold-light transition-colors"
        >
          Upload Media <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}



// "use client";
// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import type { Enquiry, Booking } from "@/types";

// export default function AdminPage() {
//   const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [tab, setTab] = useState<"enquiries" | "bookings">("enquiries");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [eq, bk] = await Promise.all([
//           api.get("/api/v1/enquiries"),
//           api.get("/api/v1/bookings"),
//         ]);
//         setEnquiries(eq.data.data || []);
//         setBookings(bk.data.data || []);
//       } catch {
//         /* handle silently – show empty state */
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const statusColors: Record<string, string> = {
//     new: "bg-gold/20 text-gold",
//     contacted: "bg-sage-pale text-pine-mid",
//     booked: "bg-pine/10 text-pine",
//     closed: "bg-cream-mid text-brand-muted",
//     pending: "bg-gold/20 text-gold",
//     confirmed: "bg-sage-pale text-pine-mid",
//     completed: "bg-pine/10 text-pine",
//     cancelled: "bg-red-100 text-red-700",
//   };

//   const updateStatus = async (
//     id: string,
//     status: string,
//     type: "enquiries" | "bookings"
//   ) => {
//     try {
//       await api.patch(`/api/v1/${type}/${id}`, { status });
//       if (type === "enquiries") {
//         setEnquiries((prev) =>
//           prev.map((e) => (e._id === id ? { ...e, status: status as Enquiry["status"] } : e))
//         );
//       } else {
//         setBookings((prev) =>
//           prev.map((b) => (b._id === id ? { ...b, status: status as Booking["status"] } : b))
//         );
//       }
//     } catch {/* silent */}
//   };

//   return (
//     <div className="min-h-screen bg-cream pt-24 pb-16 px-[5vw]">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="font-serif text-3xl font-semibold text-pine mb-1">
//           Admin Dashboard
//         </h1>
//         <p className="text-brand-muted text-sm mb-8">
//           Peeman Cleaning Services — internal management
//         </p>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: "Total Enquiries", value: enquiries.length },
//             { label: "New Enquiries", value: enquiries.filter((e) => e.status === "new").length },
//             { label: "Total Bookings", value: bookings.length },
//             { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length },
//           ].map((stat) => (
//             <div key={stat.label} className="bg-white border border-cream-mid rounded-xl p-5">
//               <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
//                 {stat.label}
//               </p>
//               <p className="font-serif text-3xl font-semibold text-pine">
//                 {loading ? "–" : stat.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 mb-6 bg-cream-mid rounded-lg p-1 w-fit">
//           {(["enquiries", "bookings"] as const).map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
//                 tab === t
//                   ? "bg-pine text-cream"
//                   : "text-brand-muted hover:text-pine"
//               }`}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="text-brand-muted text-sm">Loading…</div>
//         ) : tab === "enquiries" ? (
//           <div className="bg-white border border-cream-mid rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-cream-mid">
//                   <tr>
//                     {["Name", "Email", "Phone", "Service", "Status", "Date", "Actions"].map(
//                       (h) => (
//                         <th
//                           key={h}
//                           className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider"
//                         >
//                           {h}
//                         </th>
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-cream-mid">
//                   {enquiries.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
//                         No enquiries yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     enquiries.map((e) => (
//                       <tr key={e._id} className="hover:bg-cream/50 transition-colors">
//                         <td className="px-4 py-3 font-medium text-ink">
//                           {e.firstName} {e.lastName}
//                         </td>
//                         <td className="px-4 py-3 text-brand-muted">{e.email}</td>
//                         <td className="px-4 py-3 text-brand-muted">{e.phone || "–"}</td>
//                         <td className="px-4 py-3">{e.service}</td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
//                             {e.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-brand-muted">
//                           {new Date(e.createdAt).toLocaleDateString("en-GB")}
//                         </td>
//                         <td className="px-4 py-3">
//                           <select
//                             value={e.status}
//                             onChange={(ev) => updateStatus(e._id, ev.target.value, "enquiries")}
//                             className="text-xs border border-cream-mid rounded px-2 py-1 bg-white"
//                           >
//                             {["new", "contacted", "booked", "closed"].map((s) => (
//                               <option key={s} value={s}>{s}</option>
//                             ))}
//                           </select>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white border border-cream-mid rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-cream-mid">
//                   <tr>
//                     {["Name", "Email", "Service", "Date", "Address", "Status", "Actions"].map(
//                       (h) => (
//                         <th
//                           key={h}
//                           className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider"
//                         >
//                           {h}
//                         </th>
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-cream-mid">
//                   {bookings.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
//                         No bookings yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     bookings.map((b) => (
//                       <tr key={b._id} className="hover:bg-cream/50 transition-colors">
//                         <td className="px-4 py-3 font-medium text-ink">
//                           {b.firstName} {b.lastName}
//                         </td>
//                         <td className="px-4 py-3 text-brand-muted">{b.email}</td>
//                         <td className="px-4 py-3">{b.service}</td>
//                         <td className="px-4 py-3 text-brand-muted">{b.preferredDate}</td>
//                         <td className="px-4 py-3 text-brand-muted truncate max-w-[140px]">
//                           {b.address}
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
//                             {b.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <select
//                             value={b.status}
//                             onChange={(ev) => updateStatus(b._id, ev.target.value, "bookings")}
//                             className="text-xs border border-cream-mid rounded px-2 py-1 bg-white"
//                           >
//                             {["pending", "confirmed", "completed", "cancelled"].map((s) => (
//                               <option key={s} value={s}>{s}</option>
//                             ))}
//                           </select>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
