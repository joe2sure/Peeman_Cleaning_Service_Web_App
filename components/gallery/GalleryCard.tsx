"use client";
import Image from "next/image";
import type { MediaItem } from "@/types";
import { Play, ZoomIn } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/lib/constants";

interface GalleryCardProps {
  item: MediaItem;
  index: number;
  onOpen: (index: number) => void;
}

export default function GalleryCard({ item, index, onOpen }: GalleryCardProps) {
  const catLabel =
    GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label ??
    item.category;

  return (
    <button
      onClick={() => onOpen(index)}
      className="group relative w-full rounded-xl overflow-hidden bg-cream-mid border border-cream-mid hover:border-pine/25 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(27,67,50,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
      aria-label={`View ${item.title}`}
    >
      {/* Aspect-ratio container */}
      <div className="aspect-[4/3] w-full relative overflow-hidden">
        <Image
          src={item.thumbnailUrl ?? item.url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={item._id.startsWith("demo-")}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-pine/0 group-hover:bg-pine/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            {item.type === "video" ? (
              <Play size={18} className="text-pine fill-pine ml-0.5" />
            ) : (
              <ZoomIn size={18} className="text-pine" />
            )}
          </div>
        </div>

        {/* Video badge */}
        {item.type === "video" && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-pine/80 text-cream text-[0.65rem] font-medium px-2 py-1 rounded-full">
            <Play size={9} className="fill-cream" />
            VIDEO
          </div>
        )}

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-2.5 right-2.5 bg-gold text-pine text-[0.65rem] font-semibold px-2 py-1 rounded-full">
            ★ Featured
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="p-4 text-left">
        <p className="text-[0.7rem] text-pine-light uppercase tracking-widest font-medium mb-1">
          {catLabel}
        </p>
        <h3 className="font-serif text-base font-semibold text-pine leading-snug line-clamp-1">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-brand-muted mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
}
