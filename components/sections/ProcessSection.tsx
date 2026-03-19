import ScrollReveal from "@/components/ui/ScrollReveal";
import { PROCESS_STEPS } from "@/lib/constants";

export default function ProcessSection() {
  return (
    <section id="process" className="bg-cream-mid py-[88px] px-[5vw]">
      <ScrollReveal variant="fade-up" duration={550}>
        <span className="section-label">How It Works</span>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
          From Enquiry to Spotless
        </h2>
        <p className="text-brand-muted font-light max-w-xl mb-14 text-base">
          Getting started with Peeman is simple. Here&apos;s what to expect from
          your first contact to a gleaming result.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connecting dashed line (desktop) */}
        <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-pine/20 z-0" />

        {PROCESS_STEPS.map((step, i) => (
          <ScrollReveal
            key={step.num}
            variant="zoom-in"
            delay={i * 110}
            duration={580}
          >
            <div className="text-center relative z-10">
              <div className="w-14 h-14 rounded-full bg-pine text-cream flex items-center justify-center font-serif text-[1.35rem] font-semibold mx-auto mb-5 border-4 border-cream-mid">
                {step.num}
              </div>
              <h4 className="font-sans text-base font-medium text-pine mb-2">
                {step.title}
              </h4>
              <p className="text-sm text-brand-muted leading-relaxed">{step.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}



// import { PROCESS_STEPS } from "@/lib/constants";

// export default function ProcessSection() {
//   return (
//     <section id="process" className="bg-cream-mid py-[88px] px-[5vw]">
//       <span className="section-label">How It Works</span>
//       <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
//         From Enquiry to Spotless
//       </h2>
//       <p className="text-brand-muted font-light max-w-xl mb-14 text-base">
//         Getting started with Peeman is simple. Here&apos;s what to expect from
//         your first contact to a gleaming result.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
//         {/* Connecting dashed line (desktop) */}
//         <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-pine/20 z-0" />

//         {PROCESS_STEPS.map((step) => (
//           <div key={step.num} className="text-center relative z-10">
//             <div className="w-14 h-14 rounded-full bg-pine text-cream flex items-center justify-center font-serif text-[1.35rem] font-semibold mx-auto mb-5 border-4 border-cream-mid">
//               {step.num}
//             </div>
//             <h4 className="font-sans text-base font-medium text-pine mb-2">
//               {step.title}
//             </h4>
//             <p className="text-sm text-brand-muted leading-relaxed">{step.body}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
