import ScrollReveal from "@/components/ui/ScrollReveal";
import { WHY_US } from "@/lib/constants";

export default function WhyUsSection() {
  return (
    <section id="why" className="bg-pine py-[88px] px-[5vw]">
      <ScrollReveal variant="fade-up" duration={550}>
        <span className="section-label-light">Why Choose Us</span>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-cream leading-tight mb-3">
          What Sets Peeman Apart
        </h2>
        <p className="text-white/60 font-light max-w-xl mb-12 text-base">
          We don&apos;t just clean — we care about the spaces and people we serve.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {WHY_US.map((item, i) => (
          <ScrollReveal
            key={item.num}
            variant={i % 2 === 0 ? "fade-left" : "fade-right"}
            delay={Math.floor(i / 2) * 100}
            duration={600}
          >
            <div className="flex gap-5 items-start">
              <span className="font-serif text-[2.4rem] font-semibold text-gold leading-none flex-shrink-0 min-w-[36px]">
                {item.num}
              </span>
              <div>
                <h4 className="font-sans text-base font-medium text-cream mb-1.5">
                  {item.title}
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.body}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}



// import { WHY_US } from "@/lib/constants";

// export default function WhyUsSection() {
//   return (
//     <section id="why" className="bg-pine py-[88px] px-[5vw]">
//       <span className="section-label-light">Why Choose Us</span>
//       <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-cream leading-tight mb-3">
//         What Sets Peeman Apart
//       </h2>
//       <p className="text-white/60 font-light max-w-xl mb-12 text-base">
//         We don&apos;t just clean — we care about the spaces and people we serve.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {WHY_US.map((item) => (
//           <div key={item.num} className="flex gap-5 items-start">
//             <span className="font-serif text-[2.4rem] font-semibold text-gold leading-none flex-shrink-0 min-w-[36px]">
//               {item.num}
//             </span>
//             <div>
//               <h4 className="font-sans text-base font-medium text-cream mb-1.5">
//                 {item.title}
//               </h4>
//               <p className="text-sm text-white/60 leading-relaxed">{item.body}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
