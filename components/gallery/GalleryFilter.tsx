"use client";
import { GALLERY_CATEGORIES, MEDIA_TYPES } from "@/lib/constants";
import type { MediaCategory, MediaType } from "@/types";
import { cn } from "@/lib/utils";
import { Images, Video } from "lucide-react";

interface GalleryFilterProps {
  category: MediaCategory | "all";
  mediaType: MediaType | "all";
  onCategoryChange: (c: MediaCategory | "all") => void;
  onTypeChange: (t: MediaType | "all") => void;
  total: number;
}

export default function GalleryFilter({
  category,
  mediaType,
  onCategoryChange,
  onTypeChange,
  total,
}: GalleryFilterProps) {
  return (
    <div className="mb-10 space-y-4">
      {/* Media type toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {MEDIA_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => onTypeChange(t.value as MediaType | "all")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              mediaType === t.value
                ? "bg-pine text-cream border-pine"
                : "bg-white text-brand-muted border-cream-mid hover:border-pine/30 hover:text-pine"
            )}
          >
            {t.value === "image" && <Images size={14} />}
            {t.value === "video" && <Video size={14} />}
            {t.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-brand-muted">
          {total} item{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value as MediaCategory | "all")}
            className={cn(
              "px-3.5 py-1.5 rounded text-xs font-medium tracking-wide transition-all border",
              category === cat.value
                ? "bg-gold text-pine border-gold"
                : "bg-white text-brand-muted border-cream-mid hover:border-gold/50 hover:text-pine"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
