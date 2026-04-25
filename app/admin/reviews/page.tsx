
"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getAdminReviews, approveReview, deleteReview } from "@/lib/admin/api";
import adminApi from "@/lib/admin/api";
import type { Review } from "@/types";
import { CheckCircle, XCircle, Trash2, Star, ImageIcon } from "lucide-react";

export default function AdminReviewsPage() {
  const [items,   setItems]   = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [note,    setNote]    = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminReviews(1, 50);
      setItems(res.data?.data ?? []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    try {
      await approveReview(id);
      setItems(p => p.map(r => r._id === id ? { ...r, status: "approved", approved: true } : r));
    } catch { /* silent */ }
  };

  const reject = async (id: string) => {
    try {
      await adminApi.patch(`/api/v1/reviews/${id}/reject`, { adminNote: note[id] });
      setItems(p => p.map(r => r._id === id ? { ...r, status: "rejected", approved: false } : r));
    } catch { /* silent */ }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setItems(p => p.filter(r => r._id !== id));
    } catch { /* silent */ }
  };

  const filtered = filter === "all" ? items : items.filter(r => r.status === filter);
  const pending  = items.filter(r => r.status === "pending").length;
  const approved = items.filter(r => r.status === "approved").length;
  const rejected = items.filter(r => r.status === "rejected").length;

  const statusColor: Record<string, string> = {
    pending:  "bg-gold/15 text-yellow-700",
    approved: "bg-sage-pale text-pine-mid",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-pine">Reviews</h1>
        <p className="text-brand-muted text-sm mt-0.5">Approve or reject customer reviews before they go live.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending",  value: pending,  highlight: pending > 0 },
          { label: "Approved", value: approved, highlight: false },
          { label: "Rejected", value: rejected, highlight: false },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.highlight ? "border-gold/40 bg-gold/5" : "bg-white border-cream-mid"}`}>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-serif text-2xl font-semibold ${s.highlight ? "text-gold" : "text-pine"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all","pending","approved","rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition-colors border ${
              filter === f ? "bg-pine text-cream border-pine" : "bg-white text-brand-muted border-cream-mid hover:border-pine/30"
            }`}>{f}</button>
        ))}
      </div>

      {/* Review cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({length:4}).map((_,i) => <div key={i} className="h-28 bg-cream-mid rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-brand-muted border border-dashed border-cream-mid rounded-xl">
          <Star size={24} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reviews in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review._id} className={`bg-white border rounded-xl p-5 ${review.status === "pending" ? "border-gold/30" : "border-cream-mid"}`}>
              <div className="flex items-start gap-4 flex-wrap">
                {/* Service image thumbnail */}
                {review.serviceImageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 border border-cream-mid">
                    <Image src={review.serviceImageUrl} alt="service" fill className="object-cover" unoptimized />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-ink text-sm">{review.name}</span>
                    <span className="text-brand-muted text-xs">·</span>
                    <span className="text-brand-muted text-xs">{review.location}</span>
                    <span className="text-brand-muted text-xs">·</span>
                    <span className="text-xs text-pine-light">{review.service}</span>
                    <div className="flex gap-0.5">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} size={10} className={i < review.rating ? "text-gold fill-gold" : "text-cream-mid"} />
                      ))}
                    </div>
                    <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[review.status]}`}>
                      {review.status}
                    </span>
                    {review.serviceImageUrl && (
                      <span className="text-[0.65rem] flex items-center gap-0.5 text-brand-muted border border-cream-mid rounded px-1.5 py-0.5">
                        <ImageIcon size={9} /> Photo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-brand-muted italic leading-relaxed mb-2">&ldquo;{review.text}&rdquo;</p>
                  {review.email && <p className="text-xs text-brand-muted/60">{review.email}</p>}
                  <p className="text-xs text-brand-muted/50 mt-0.5">
                    Submitted {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {review.status !== "approved" && (
                    <button onClick={() => approve(review._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pine text-cream rounded text-xs font-medium hover:bg-pine-mid transition-colors">
                      <CheckCircle size={12} /> Approve
                    </button>
                  )}
                  {review.status !== "rejected" && (
                    <button onClick={() => reject(review._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors">
                      <XCircle size={12} /> Reject
                    </button>
                  )}
                  <button onClick={() => remove(review._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-brand-muted hover:text-red-500 text-xs transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Admin note input for pending */}
              {review.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-cream-mid">
                  <input
                    value={note[review._id] ?? ""}
                    onChange={e => setNote(n => ({ ...n, [review._id]: e.target.value }))}
                    placeholder="Optional admin note (visible internally only)…"
                    className="w-full text-xs border border-cream-mid rounded px-3 py-1.5 outline-none focus:border-pine-light bg-white"
                  />
                </div>
              )}
              {review.adminNote && (
                <p className="mt-2 text-xs text-brand-muted bg-cream-mid/60 rounded px-3 py-1.5 italic">
                  Note: {review.adminNote}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { getAdminReviews, approveReview, deleteReview } from "@/lib/admin/api";
// import type { Review } from "@/types";
// import { CheckCircle, Trash2, Star } from "lucide-react";

// export default function AdminReviewsPage() {
//   const [items, setItems]     = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter]   = useState<"all" | "pending" | "approved">("all");

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getAdminReviews(1, 50);
//       setItems(res.data?.data ?? []);
//     } catch { setItems([]); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const approve = async (id: string) => {
//     try {
//       await approveReview(id);
//       setItems((prev) => prev.map((r) => r._id === id ? { ...r, approved: true } : r));
//     } catch { /* silent */ }
//   };

//   const remove = async (id: string) => {
//     if (!confirm("Delete this review permanently?")) return;
//     try {
//       await deleteReview(id);
//       setItems((prev) => prev.filter((r) => r._id !== id));
//     } catch { /* silent */ }
//   };

//   const filtered = filter === "all"
//     ? items
//     : filter === "approved"
//     ? items.filter((r) => r.approved)
//     : items.filter((r) => !r.approved);

//   const pending  = items.filter((r) => !r.approved).length;
//   const approved = items.filter((r) =>  r.approved).length;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div>
//         <h1 className="font-serif text-3xl font-semibold text-pine">Reviews</h1>
//         <p className="text-brand-muted text-sm mt-0.5">
//           Approve customer reviews before they appear publicly.
//         </p>
//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-3 gap-4">
//         {[
//           { label: "Total",    value: items.length },
//           { label: "Pending",  value: pending,  highlight: pending > 0 },
//           { label: "Approved", value: approved },
//         ].map((s) => (
//           <div key={s.label} className={`rounded-xl border p-4 ${s.highlight ? "border-gold/40 bg-gold/5" : "bg-white border-cream-mid"}`}>
//             <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">{s.label}</p>
//             <p className={`font-serif text-2xl font-semibold ${s.highlight ? "text-gold" : "text-pine"}`}>
//               {s.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Filter tabs */}
//       <div className="flex gap-1.5">
//         {(["all", "pending", "approved"] as const).map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition-colors border ${
//               filter === f ? "bg-pine text-cream border-pine" : "bg-white text-brand-muted border-cream-mid hover:border-pine/30"
//             }`}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {/* Review cards */}
//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="bg-white border border-cream-mid rounded-xl p-5 animate-pulse">
//               <div className="h-4 bg-cream-mid rounded w-1/4 mb-3" />
//               <div className="h-3 bg-cream-mid rounded w-full mb-2" />
//               <div className="h-3 bg-cream-mid rounded w-3/4" />
//             </div>
//           ))}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="py-16 text-center text-brand-muted border border-dashed border-cream-mid rounded-xl">
//           <Star size={24} className="mx-auto mb-2 opacity-30" />
//           <p className="text-sm">No reviews in this category.</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((review) => (
//             <div
//               key={review._id}
//               className={`bg-white border rounded-xl p-5 transition-colors ${
//                 review.approved ? "border-cream-mid" : "border-gold/30 bg-gold/[0.02]"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-2 flex-wrap">
//                     <span className="font-medium text-ink text-sm">{review.name}</span>
//                     <span className="text-brand-muted text-xs">·</span>
//                     <span className="text-brand-muted text-xs">{review.location}</span>
//                     <span className="text-brand-muted text-xs">·</span>
//                     <span className="text-xs text-pine-light">{review.service}</span>
//                     <div className="flex gap-0.5 text-gold text-xs">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <span key={i}>{i < review.rating ? "★" : "☆"}</span>
//                       ))}
//                     </div>
//                     {review.approved ? (
//                       <span className="text-[0.65rem] bg-sage-pale text-pine-mid px-2 py-0.5 rounded-full font-medium">
//                         Published
//                       </span>
//                     ) : (
//                       <span className="text-[0.65rem] bg-gold/15 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
//                         Pending
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-brand-muted italic leading-relaxed">
//                     &ldquo;{review.text}&rdquo;
//                   </p>
//                   <p className="text-xs text-brand-muted/60 mt-2">
//                     Submitted {new Date(review.createdAt).toLocaleDateString("en-GB")}
//                   </p>
//                 </div>

//                 <div className="flex gap-2 flex-shrink-0">
//                   {!review.approved && (
//                     <button
//                       onClick={() => approve(review._id)}
//                       title="Approve"
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-pine text-cream rounded text-xs font-medium hover:bg-pine-mid transition-colors"
//                     >
//                       <CheckCircle size={12} />
//                       Approve
//                     </button>
//                   )}
//                   <button
//                     onClick={() => remove(review._id)}
//                     title="Delete"
//                     className="p-1.5 text-brand-muted hover:text-red-500 transition-colors"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
