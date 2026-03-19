import Link from "next/link";
import { SITE, STATS } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

const badges = [
  { icon: "🏆", label: "Recognition", value: "Top-Rated Local Service" },
  { icon: "✅", label: "Assurance", value: "Fully Insured & Vetted" },
  { icon: "⚡", label: "Response", value: "Same-Day Booking Available" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen bg-pine grid grid-cols-1 md:grid-cols-2 items-center px-[5vw] pt-[100px] pb-16 relative overflow-hidden"
    >
      {/* Decorative rings */}
      <div className="absolute -top-28 -right-28 w-[580px] h-[580px] rounded-full border border-sage/10 pointer-events-none" />
      <div className="absolute -bottom-16 right-16 w-[360px] h-[360px] rounded-full border border-sage/[0.06] pointer-events-none" />

      {/* Left — text */}
      <div className="relative z-10">
        <span className="section-label-light">
          {SITE.city}&apos;s Trusted Cleaners
        </span>

        <h1 className="font-serif text-[clamp(2.8rem,5vw,4.2rem)] font-semibold text-cream leading-[1.1] mb-5 animate-fade-up">
          Spotless Spaces.
          <br />
          <em className="text-gold-light not-italic font-normal">
            Exceptional
          </em>{" "}
          Care.
        </h1>

        <p className="text-white/70 font-light max-w-[440px] mb-9 text-lg leading-relaxed">
          From deep domestic cleans to commercial contracts — Peeman Cleaning
          Services brings precision and reliability to every corner.
        </p>

        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-gold text-pine px-7 py-3.5 rounded text-sm font-medium hover:bg-gold-light transition-all hover:-translate-y-px"
          >
            <MessageCircle size={16} />
            Request a Quote
          </Link>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-white/85 px-6 py-3.5 rounded text-sm font-light hover:border-sage hover:text-sage transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.116 1.514 5.843L.036 23.5l5.805-1.523A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.359-.213-3.722.976.994-3.626-.234-.373A9.817 9.817 0 0 1 2.182 12C2.182 6.569 6.569 2.182 12 2.182c5.432 0 9.818 4.387 9.818 9.818 0 5.432-4.386 9.818-9.818 9.818z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Right — badges + stats */}
      <div className="relative z-10 flex flex-col gap-4 mt-10 md:mt-0 md:pl-10 items-start md:items-end">
        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-4 bg-white/[0.06] border border-sage/20 rounded-xl px-5 py-4"
            >
              <span className="w-11 h-11 rounded-[10px] bg-gold/[0.18] flex items-center justify-center text-xl flex-shrink-0">
                {b.icon}
              </span>
              <div>
                <p className="text-[0.72rem] text-white/45 uppercase tracking-widest mb-0.5">
                  {b.label}
                </p>
                <p className="font-serif text-[1.05rem] font-semibold text-cream">
                  {b.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-2">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <span className="block font-serif text-3xl font-semibold text-gold-light">
                {s.value}
              </span>
              <span className="text-[0.75rem] text-white/50">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
