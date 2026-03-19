import ScrollReveal from "@/components/ui/ScrollReveal";
import { STATIC_REVIEWS } from "@/lib/constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold text-sm mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  return (
    <>
      {name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()}
    </>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-cream py-[88px] px-[5vw]">
      <ScrollReveal variant="fade-up" duration={550}>
        <span className="section-label">Client Reviews</span>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
          What Our Clients Say
        </h2>
        <p className="text-brand-muted font-light max-w-xl mb-12 text-base">
          Real feedback from real customers across Wolverhampton and the West
          Midlands.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATIC_REVIEWS.map((review, i) => (
          <ScrollReveal
            key={review._id}
            variant="fade-up"
            delay={i * 120}
            duration={620}
          >
            <div className="bg-white border border-cream-mid rounded-xl p-6 h-full flex flex-col">
              <StarRating rating={review.rating} />
              <p className="text-sm text-brand-muted leading-relaxed italic mb-5 flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sage-pale flex items-center justify-center text-[0.72rem] font-semibold text-pine-mid flex-shrink-0">
                  <Initials name={review.name} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{review.name}</p>
                  <p className="text-[0.75rem] text-brand-muted">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}




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
//   const parts = name.split(" ");
//   return parts
//     .slice(0, 2)
//     .map((p) => p[0])
//     .join("")
//     .toUpperCase();
// }

// export default function ReviewsSection() {
//   return (
//     <section id="reviews" className="bg-cream py-[88px] px-[5vw]">
//       <span className="section-label">Client Reviews</span>
//       <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
//         What Our Clients Say
//       </h2>
//       <p className="text-brand-muted font-light max-w-xl mb-12 text-base">
//         Real feedback from real customers across Wolverhampton and the West
//         Midlands.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {STATIC_REVIEWS.map((review) => (
//           <div
//             key={review._id}
//             className="bg-white border border-cream-mid rounded-xl p-6"
//           >
//             <StarRating rating={review.rating} />
//             <p className="text-sm text-brand-muted leading-relaxed italic mb-5">
//               &ldquo;{review.text}&rdquo;
//             </p>
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-sage-pale flex items-center justify-center text-[0.72rem] font-semibold text-pine-mid flex-shrink-0">
//                 <Initials name={review.name} />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-ink">{review.name}</p>
//                 <p className="text-[0.75rem] text-brand-muted">{review.location}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
