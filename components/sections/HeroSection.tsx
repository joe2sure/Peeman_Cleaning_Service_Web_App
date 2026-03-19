"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SITE, STATS } from "@/lib/constants";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    eyebrow: "Wolverhampton's Trusted Cleaners",
    heading: ["Spotless Spaces.", "Exceptional Care."],
    headingAccent: "Exceptional",
    sub: "From deep domestic cleans to commercial contracts — Peeman Cleaning Services brings precision and reliability to every corner.",
    badge: { icon: "🏠", label: "Speciality", value: "Domestic & Commercial Cleans" },
    accent: "#C9A84C",
  },
  {
    eyebrow: "End of Tenancy Specialists",
    heading: ["Deposit Back.", "Guaranteed Clean."],
    headingAccent: "Guaranteed",
    sub: "Our end-of-tenancy cleans meet letting agency standards — so you get your deposit back, every single time.",
    badge: { icon: "🔑", label: "Guarantee", value: "Deposit-Back Quality Assured" },
    accent: "#74C69D",
  },
  {
    eyebrow: "Deep Clean Experts",
    heading: ["Top to Bottom.", "Inside & Out."],
    headingAccent: "Inside & Out.",
    sub: "A thorough deep clean covering every surface, appliance and forgotten corner — perfect for moving in, moving out, or a seasonal reset.",
    badge: { icon: "✨", label: "Coverage", value: "Every Surface, Every Corner" },
    accent: "#F0D080",
  },
  {
    eyebrow: "Commercial Cleaning Contracts",
    heading: ["Your Business,", "Immaculate Always."],
    headingAccent: "Immaculate",
    sub: "Reliable commercial cleaning for offices, retail and public spaces. Flexible scheduling that works around your business hours.",
    badge: { icon: "🏢", label: "Flexibility", value: "Early Morning & Evening Slots" },
    accent: "#9FE1CB",
  },
];

const BADGES_STATIC = [
  { icon: "✅", label: "Assurance", value: "Fully Insured & Vetted" },
  { icon: "⚡", label: "Response", value: "Same-Day Booking Available" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [slideKey, setSlideKey] = useState(0);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setSlideKey((k) => k + 1);
        setAnimating(false);
      }, 380);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [current, goTo]);

  // Auto-advance every 6 s
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  // Keyboard nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  const slide = SLIDES[current];

  return (
    <section
      id="home"
      className="min-h-screen bg-pine grid grid-cols-1 md:grid-cols-2 items-center px-[5vw] pt-[100px] pb-16 relative overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Ambient glow that shifts per slide */}
      <div
        className="absolute inset-0 pointer-events-none duration-1000 transition-all"
        style={{
          background: `radial-gradient(ellipse 55% 65% at 85% 45%, ${slide.accent}1A 0%, transparent 68%)`,
        }}
      />

      {/* Decorative rings */}
      <div className="absolute -top-28 -right-28 w-[580px] h-[580px] rounded-full border border-sage/10 pointer-events-none" />
      <div className="absolute -bottom-16 right-16 w-[360px] h-[360px] rounded-full border border-sage/[0.06] pointer-events-none" />

      {/* Slide-out overlay during transition */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: animating ? 1 : 0,
          background:
            direction === "next"
              ? "linear-gradient(90deg, rgba(27,67,50,0) 0%, rgba(27,67,50,0.55) 100%)"
              : "linear-gradient(270deg, rgba(27,67,50,0) 0%, rgba(27,67,50,0.55) 100%)",
        }}
      />

      {/* ── LEFT: Text content ── */}
      <div className="relative z-10">
        <span
          key={`ey-${slideKey}`}
          className="section-label-light hero-anim-up"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          {slide.eyebrow}
        </span>

        <h1
          key={`h1-${slideKey}`}
          className="font-serif text-[clamp(2.8rem,5vw,4.2rem)] font-semibold text-cream leading-[1.1] mb-5 hero-anim-up"
          style={{ "--delay": "70ms" } as React.CSSProperties}
        >
          {slide.heading[0]}
          <br />
          {(() => {
            const parts = slide.heading[1].split(slide.headingAccent);
            return parts.map((part, i) =>
              i < parts.length - 1 ? (
                <span key={i}>
                  {part}
                  <em
                    className="not-italic font-normal"
                    style={{ color: slide.accent, transition: "color 0.5s" }}
                  >
                    {slide.headingAccent}
                  </em>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            );
          })()}
        </h1>

        <p
          key={`sub-${slideKey}`}
          className="text-white/70 font-light max-w-[440px] mb-9 text-lg leading-relaxed hero-anim-up"
          style={{ "--delay": "140ms" } as React.CSSProperties}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div
          key={`cta-${slideKey}`}
          className="flex flex-wrap gap-3 items-center hero-anim-up"
          style={{ "--delay": "210ms" } as React.CSSProperties}
        >
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-pine px-7 py-3.5 rounded text-sm font-medium transition-all hover:-translate-y-px active:scale-95"
            style={{ background: slide.accent, transition: "background 0.5s, transform 0.15s" }}
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

        {/* Controls row */}
        <div className="flex items-center gap-4 mt-10">
          {/* Progress dots */}
          <div className="flex gap-2 items-center">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                aria-label={`Slide ${i + 1}`}
                className="relative h-[3px] rounded-full overflow-hidden transition-all duration-400"
                style={{
                  width: i === current ? 32 : 8,
                  background:
                    i === current
                      ? slide.accent
                      : "rgba(255,255,255,0.22)",
                }}
              >
                {i === current && (
                  <span
                    key={`prog-${slideKey}`}
                    className="absolute inset-y-0 left-0 w-0 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      animation: "dot-fill 6s linear forwards",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/55 hover:border-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/55 hover:border-white/50 hover:text-white transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <span className="text-xs text-white/30 tabular-nums">
            {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── RIGHT: Badges + Stats ── */}
      <div className="relative z-10 flex flex-col gap-4 mt-10 md:mt-0 md:pl-10 items-start md:items-end">
        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          {/* Dynamic badge (changes with slide) */}
          <div
            key={`dbadge-${slideKey}`}
            className="flex items-center gap-4 rounded-xl px-5 py-4 border hero-anim-right"
            style={{
              background: `${slide.accent}12`,
              borderColor: `${slide.accent}38`,
              "--delay": "80ms",
            } as React.CSSProperties}
          >
            <span
              className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${slide.accent}22` }}
            >
              {slide.badge.icon}
            </span>
            <div>
              <p className="text-[0.72rem] text-white/45 uppercase tracking-widest mb-0.5">
                {slide.badge.label}
              </p>
              <p className="font-serif text-[1.05rem] font-semibold text-cream">
                {slide.badge.value}
              </p>
            </div>
          </div>

          {/* Static badges */}
          {BADGES_STATIC.map((b) => (
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

        {/* Stats */}
        <div className="flex gap-6 mt-2">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <span
                className="block font-serif text-3xl font-semibold transition-colors duration-500"
                style={{ color: slide.accent }}
              >
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