"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchActiveAds, trackAdClick } from "@/lib/api";
import type { Ad } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { X, ExternalLink } from "lucide-react";

export default function AdsSection() {
  const [ads, setAds]           = useState<Ad[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchActiveAds("homepage")
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAds(res.data as Ad[]);
        }
      })
      .catch(() => {});
  }, []);

  const handleClick = (ad: Ad) => {
    trackAdClick(ad._id);
  };

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed((prev) => new Set([...prev, id]));
  };

  const visible = ads.filter((ad) => !dismissed.has(ad._id));
  if (visible.length === 0) return null;

  return (
    <section id="promotions" className="bg-cream py-10 px-[5vw]">
      <ScrollReveal variant="fade-up" duration={500}>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[0.7rem] uppercase tracking-widest text-brand-muted font-medium border border-cream-mid rounded px-2 py-0.5">
            Promotions
          </span>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {visible.map((ad, i) => (
          <ScrollReveal key={ad._id} variant="fade-up" delay={i * 80} duration={500}>
            <AdCard ad={ad} onDismiss={dismiss} onClick={handleClick} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function AdCard({
  ad,
  onDismiss,
  onClick,
}: {
  ad: Ad;
  onDismiss: (id: string, e: React.MouseEvent) => void;
  onClick: (ad: Ad) => void;
}) {
  const isFullWidth = ad.type === "fullwidth";
  const isBanner    = ad.type === "banner";

  const inner = (
    <div
      className={`relative rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-lg ${
        isFullWidth ? "min-h-[180px] md:min-h-[220px]" : "flex items-center gap-6 p-5 md:p-7"
      }`}
      style={{
        background: ad.imageUrl ? undefined : ad.backgroundColor,
        color: ad.textColor,
      }}
    >
      {/* Background image */}
      {ad.imageUrl && (
        <>
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div
            className="absolute inset-0"
            style={{ background: `${ad.backgroundColor}CC` }}
          />
        </>
      )}

      {/* Background video */}
      {ad.videoUrl && !ad.imageUrl && (
        <>
          <video
            src={ad.videoUrl}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: `${ad.backgroundColor}B0` }} />
        </>
      )}

      {/* Content */}
      <div
        className={`relative z-10 ${
          isFullWidth
            ? "absolute inset-0 flex flex-col items-center justify-center text-center p-8"
            : "flex-1 min-w-0"
        }`}
      >
        <h3
          className={`font-serif font-semibold leading-tight mb-1 ${
            isFullWidth ? "text-2xl md:text-3xl mb-3" : "text-lg"
          }`}
          style={{ color: ad.textColor }}
        >
          {ad.title}
        </h3>
        {ad.body && (
          <p
            className={`leading-relaxed ${isFullWidth ? "text-base max-w-lg mx-auto mb-4" : "text-sm mb-3"}`}
            style={{ color: `${ad.textColor}CC` }}
          >
            {ad.body}
          </p>
        )}
        {ad.ctaLabel && ad.ctaHref && (
          <span
            className={`inline-flex items-center gap-1.5 font-medium text-sm px-5 py-2 rounded transition-opacity hover:opacity-90 ${
              isFullWidth ? "mt-2" : ""
            }`}
            style={{ background: ad.textColor, color: ad.backgroundColor }}
          >
            {ad.ctaLabel}
            <ExternalLink size={12} />
          </span>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => onDismiss(ad._id, e)}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
        aria-label="Dismiss"
        style={{ color: ad.textColor }}
      >
        <X size={13} />
      </button>

      {/* Banner layout right side */}
      {isBanner && (
        <div className="relative z-10 flex-shrink-0 hidden sm:block">
          {ad.ctaLabel && (
            <span
              className="inline-flex items-center gap-1.5 font-medium text-sm px-5 py-2 rounded whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ background: ad.textColor, color: ad.backgroundColor }}
            >
              {ad.ctaLabel}
              <ExternalLink size={12} />
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (ad.ctaHref) {
    return (
      <a
        href={ad.ctaHref}
        target={ad.ctaHref.startsWith("http") ? "_blank" : undefined}
        rel={ad.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
        onClick={() => onClick(ad)}
        className="block no-underline"
      >
        {inner}
      </a>
    );
  }

  return <div onClick={() => onClick(ad)}>{inner}</div>;
}
