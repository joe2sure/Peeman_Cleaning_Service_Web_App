"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApprovedReviews } from "@/lib/api";
import { STATIC_REVIEWS } from "@/lib/constants";
import type { Review } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Star, PenLine } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "text-gold fill-gold" : "text-cream-mid"} />
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  return (
    <>{name.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase()}</>
  );
}

// ── Single review card ─────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[340px] bg-white border border-cream-mid rounded-xl p-5 select-none">
      <StarRating rating={review.rating} />
      <p className="text-sm text-brand-muted leading-relaxed italic my-3 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-cream-mid/60">
        {review.serviceImageUrl ? (
          <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0">
            <Image src={review.serviceImageUrl} alt={review.name} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-sage-pale flex items-center justify-center text-[0.72rem] font-semibold text-pine-mid flex-shrink-0">
            <Initials name={review.name} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink truncate">{review.name}</p>
          <p className="text-xs text-brand-muted truncate">{review.location}</p>
        </div>
        <span className="ml-auto text-[0.65rem] text-pine-light font-medium bg-sage-pale px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          {review.service}
        </span>
      </div>
    </div>
  );
}

// ── Infinite sliding row ───────────────────────────────────────────────────
function SliderRow({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const paused    = useRef(false);
  const posRef    = useRef(0);
  const frameRef  = useRef<number>(0);

  // Double the list so we can loop seamlessly
  const doubled = [...reviews, ...reviews];
  const CARD_W  = 360; // card width + gap px

  useEffect(() => {
    const el = trackRef.current;
    if (!el || reviews.length === 0) return;

    const halfWidth = reviews.length * CARD_W;
    const speed = reverse ? -0.45 : 0.45; // px per frame

    const tick = () => {
      if (!paused.current) {
        posRef.current += speed;
        // Reset when first copy scrolls fully out of view
        if (!reverse && posRef.current >= halfWidth)  posRef.current -= halfWidth;
        if (reverse  && posRef.current <= -halfWidth) posRef.current += halfWidth;
        el.style.transform = `translateX(${posRef.current}px)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [reviews.length, reverse]);

  const pause  = () => { paused.current = true; };
  const resume = () => { paused.current = false; };

  return (
    <div className="overflow-hidden" onMouseEnter={pause} onMouseLeave={resume}
      onTouchStart={pause} onTouchEnd={resume}>
      <div ref={trackRef} className="flex gap-4 will-change-transform">
        {doubled.map((r, i) => (
          <ReviewCard key={`${r._id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data as Review[]);
        } else {
          setReviews(STATIC_REVIEWS as unknown as Review[]);
        }
      })
      .catch(() => setReviews(STATIC_REVIEWS as unknown as Review[]))
      .finally(() => setLoading(false));
  }, []);

  // Split into two rows (odd/even indices)
  const rowA = reviews.filter((_, i) => i % 2 === 0);
  const rowB = reviews.filter((_, i) => i % 2 !== 0);

  // Ensure each row has enough cards to fill the viewport when doubled
  const padRow = (row: Review[]) => {
    while (row.length < 5) row = [...row, ...row];
    return row;
  };

  return (
    <section id="reviews" className="bg-cream py-[88px] overflow-hidden">
      {/* Header */}
      <ScrollReveal variant="fade-up" className="px-[5vw] mb-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="section-label">Client Reviews</span>
            <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight">
              What Our Clients Say
            </h2>
            <p className="text-brand-muted font-light max-w-xl mt-2 text-base">
              Real feedback from real customers — hover to pause, read at your own pace.
            </p>
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-2 border border-pine/25 text-pine px-5 py-2.5 rounded text-sm font-medium hover:bg-pine hover:text-cream transition-all flex-shrink-0">
            <PenLine size={14} />
            Write a Review
          </Link>
        </div>
      </ScrollReveal>

      {/* Skeleton while loading */}
      {loading ? (
        <div className="px-[5vw] flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] h-[180px] bg-cream-mid rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="px-[5vw] py-16 text-center text-brand-muted">
          <Star size={28} className="mx-auto mb-2 opacity-30" />
          <p className="font-serif text-lg text-pine mb-1">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Row 1 — scrolls left */}
          <SliderRow reviews={padRow([...rowA])} reverse={false} />
          {/* Row 2 — scrolls right */}
          {rowB.length > 0 && <SliderRow reviews={padRow([...rowB])} reverse={true} />}
        </div>
      )}

      {/* CTA strip */}
      <ScrollReveal variant="fade-up" delay={100} className="px-[5vw] mt-10">
        <div className="bg-pine rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg font-semibold text-cream">Had a clean with us?</p>
            <p className="text-white/55 text-sm">Share your experience — approved reviews appear here automatically.</p>
          </div>
          <Link href="/login"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gold text-pine px-6 py-2.5 rounded text-sm font-medium hover:bg-gold-light transition-colors">
            <PenLine size={14} /> Leave a Review
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}




// import ScrollReveal from "@/components/ui/ScrollReveal";
// import { STATIC_REVIEWS } from "@/lib/constants";

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-0.5 text-gold text-sm mb-3">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <span key={i}>{i < rating ? "★" : "☆"}</span>
//       ))}
//     </div>
//   );
// }

// function Initials({ name }: { name: string }) {
//   return (
//     <>
//       {name
//         .split(" ")
//         .slice(0, 2)
//         .map((p) => p[0])
//         .join("")
//         .toUpperCase()}
//     </>
//   );
// }

// export default function ReviewsSection() {
//   return (
//     <section id="reviews" className="bg-cream py-[88px] px-[5vw]">
//       <ScrollReveal variant="fade-up" duration={550}>
//         <span className="section-label">Client Reviews</span>
//         <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
//           What Our Clients Say
//         </h2>
//         <p className="text-brand-muted font-light max-w-xl mb-12 text-base">
//           Real feedback from real customers across Wolverhampton and the West
//           Midlands.
//         </p>
//       </ScrollReveal>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {STATIC_REVIEWS.map((review, i) => (
//           <ScrollReveal
//             key={review._id}
//             variant="fade-up"
//             delay={i * 120}
//             duration={620}
//           >
//             <div className="bg-white border border-cream-mid rounded-xl p-6 h-full flex flex-col">
//               <StarRating rating={review.rating} />
//               <p className="text-sm text-brand-muted leading-relaxed italic mb-5 flex-1">
//                 &ldquo;{review.text}&rdquo;
//               </p>
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-full bg-sage-pale flex items-center justify-center text-[0.72rem] font-semibold text-pine-mid flex-shrink-0">
//                   <Initials name={review.name} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-ink">{review.name}</p>
//                   <p className="text-[0.75rem] text-brand-muted">
//                     {review.location}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </ScrollReveal>
//         ))}
//       </div>
//     </section>
//   );
// }