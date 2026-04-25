"use client";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { MediaItem } from "@/types";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/lib/constants";

interface LightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryLightbox({
  items,
  index,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const item = items[index];

  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!item) return null;

  const catLabel =
    GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label ??
    item.category;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Inner wrapper — stops click-through */}
      <div
        className="relative flex flex-col max-w-5xl w-full mx-4 max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <span className="text-[0.7rem] text-pine-light uppercase tracking-widest">
              {catLabel}
            </span>
            <h2 className="font-serif text-lg font-semibold text-white leading-snug">
              {item.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              title="Open original"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media area */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center rounded-xl overflow-hidden bg-black">
          {item.type === "video" ? (
            <video
              src={item.url}
              poster={item.thumbnailUrl}
              controls
              autoPlay
              className="max-h-[70vh] max-w-full rounded-xl"
            />
          ) : (
            <div className="relative w-full" style={{ maxHeight: "70vh" }}>
              <Image
                src={item.url}
                alt={item.title}
                width={1200}
                height={900}
                className="object-contain max-h-[70vh] w-auto mx-auto rounded-xl"
                unoptimized={item._id.startsWith("demo-")}
              />
            </div>
          )}

          {/* Prev arrow */}
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next arrow */}
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between mt-3 flex-shrink-0">
          {item.description ? (
            <p className="text-sm text-white/60 max-w-lg">{item.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-white/35 tabular-nums flex-shrink-0 ml-4">
            {index + 1} / {items.length}
          </span>
        </div>

        {/* Thumbnail strip */}
        {items.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 flex-shrink-0 scrollbar-hide">
            {items.map((m, i) => (
              <button
                key={m._id}
                onClick={() => {
                  // navigate to this index via onNext/onPrev logic
                  const diff = i - index;
                  if (diff > 0) for (let d = 0; d < diff; d++) onNext();
                  if (diff < 0) for (let d = 0; d > diff; d--) onPrev();
                }}
                className={`relative w-14 h-10 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                  i === index ? "border-gold" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={m.thumbnailUrl ?? m.url}
                  alt={m.title}
                  fill
                  className="object-cover"
                  unoptimized={m._id.startsWith("demo-")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
