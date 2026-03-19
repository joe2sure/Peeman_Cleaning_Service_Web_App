import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore the full range of professional cleaning services offered by Peeman Cleaning Services in Wolverhampton.",
};

export default function ServicesPage() {
  return (
    <section className="min-h-screen bg-cream pt-28 pb-20 px-[5vw]">
      <span className="section-label">What We Offer</span>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-pine leading-tight mb-4">
        Our Cleaning Services
      </h1>
      <p className="text-brand-muted font-light max-w-xl mb-12 text-lg">
        Professional, thorough and reliable — tailored to every home and
        business across Wolverhampton and the West Midlands.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.slug}
            className="bg-white border border-cream-mid rounded-xl p-7 hover:-translate-y-1 transition-transform duration-200 group relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-pine-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-12 h-12 rounded-xl bg-sage-pale flex items-center justify-center text-2xl mb-5">
              {service.icon}
            </div>
            <h2 className="font-serif text-xl font-semibold text-pine mb-2">
              {service.title}
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <p className="text-brand-muted mb-4">
          Not sure which service you need?
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 bg-pine text-cream px-8 py-3.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors"
        >
          Get a Free Quote →
        </Link>
        <p className="mt-3 text-sm text-brand-muted">
          Based in {SITE.city} · {SITE.phone}
        </p>
      </div>
    </section>
  );
}
