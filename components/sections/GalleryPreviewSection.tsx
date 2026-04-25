"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchFeaturedMedia } from "@/lib/api";
import { DEMO_GALLERY } from "@/lib/constants";
import type { MediaItem } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import { Play, ArrowRight } from "lucide-react";

export default function GalleryPreviewSection() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFeaturedMedia()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems((res.data as MediaItem[]).slice(0, 6));
        } else {
          setItems(DEMO_GALLERY.filter((m) => m.featured).slice(0, 6));
        }
      })
      .catch(() => {
        setItems(DEMO_GALLERY.filter((m) => m.featured).slice(0, 6));
      });
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="gallery-preview" className="bg-cream-mid py-[88px] px-[5vw]">
      <ScrollReveal variant="fade-up">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="section-label">Our Work</span>
            <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-pine leading-tight">
              Cleaning That Speaks for Itself
            </h2>
            <p className="text-brand-muted font-light max-w-xl mt-2">
              Real results from real jobs — browse photos and videos of our
              cleaning work across Wolverhampton and the West Midlands.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-pine-light text-sm font-medium hover:text-pine transition-colors flex-shrink-0"
          >
            View full gallery <ArrowRight size={15} />
          </Link>
        </div>
      </ScrollReveal>

      {/* Featured grid — asymmetric layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <ScrollReveal
            key={item._id}
            variant="zoom-in"
            delay={i * 70}
            duration={520}
            className={i === 0 ? "col-span-2 md:col-span-1 row-span-2" : ""}
          >
            <button
              onClick={() => setLightboxIndex(i)}
              className={`group relative w-full rounded-xl overflow-hidden bg-cream-mid hover:shadow-lg transition-all duration-300 focus:outline-none ${
                i === 0 ? "h-full min-h-[280px]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={item.thumbnailUrl ?? item.url}
                alt={item.title}
                fill
                sizes="(max-width:768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={item._id.startsWith("demo-")}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-pine/0 group-hover:bg-pine/35 transition-all duration-300 flex items-end">
                <div className="p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-cream text-xs font-medium leading-snug line-clamp-2">
                    {item.title}
                  </p>
                </div>
              </div>
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/85 flex items-center justify-center shadow">
                    <Play size={16} className="text-pine fill-pine ml-0.5" />
                  </div>
                </div>
              )}
            </button>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA */}
      <ScrollReveal variant="fade-up" delay={200}>
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-pine text-cream px-8 py-3.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors hover:-translate-y-px"
          >
            See All Photos & Videos <ArrowRight size={15} />
          </Link>
        </div>
      </ScrollReveal>

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => ((i ?? 0) + 1) % items.length)}
          onPrev={() =>
            setLightboxIndex((i) => ((i ?? 0) - 1 + items.length) % items.length)
          }
        />
      )}
    </section>
  );
}
