import ScrollReveal from "@/components/ui/ScrollReveal";
import { SERVICES } from "@/lib/constants";

export default function StripBanner() {
  return (
    <ScrollReveal variant="fade-in" duration={500}>
      <div className="bg-pine-mid py-4 px-[5vw] flex items-center justify-center gap-8 flex-wrap">
        {SERVICES.map((s) => (
          <div key={s.slug} className="flex items-center gap-2 text-white/85 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
            {s.title}
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}