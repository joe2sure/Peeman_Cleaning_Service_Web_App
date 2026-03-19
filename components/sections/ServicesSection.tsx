import ScrollReveal from "@/components/ui/ScrollReveal";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  return (
    <section id="services" className="bg-cream py-[88px] px-[5vw]">
      <ScrollReveal variant="fade-up" duration={550}>
        <span className="section-label">What We Do</span>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight mb-3">
          Our Cleaning Services
        </h2>
        <p className="text-brand-muted font-light max-w-xl mb-12 text-base">
          Professional, thorough and reliable — tailored to every home and
          business across Wolverhampton and the West Midlands.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((service, i) => (
          <ScrollReveal
            key={service.slug}
            variant="fade-up"
            delay={i * 80}
            duration={600}
          >
            <div className="bg-white border border-cream-mid rounded-xl p-7 hover:-translate-y-1 transition-transform duration-200 group relative overflow-hidden cursor-default h-full">
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-pine-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="w-12 h-12 rounded-xl bg-sage-pale flex items-center justify-center text-2xl mb-5">
                {service.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-pine mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}