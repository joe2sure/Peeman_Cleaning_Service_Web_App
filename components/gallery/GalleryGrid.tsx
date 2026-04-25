"use client";
import GalleryCard from "./GalleryCard";
import GalleryLightbox from "./GalleryLightbox";
import { useGallery } from "@/hooks/useGallery";
import GalleryFilter from "./GalleryFilter";
import type { MediaCategory, MediaType } from "@/types";
import { Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function GalleryGrid() {
  const {
    items,
    loading,
    total,
    hasMore,
    category,
    mediaType,
    setCategory,
    setMediaType,
    loadMore,
    lightboxIndex,
    openLightbox,
    closeLightbox,
    lightboxNext,
    lightboxPrev,
  } = useGallery({ pageSize: 12 });

  return (
    <>
      <GalleryFilter
        category={category}
        mediaType={mediaType}
        onCategoryChange={(c) => setCategory(c as MediaCategory | "all")}
        onTypeChange={(t) => setMediaType(t as MediaType | "all")}
        total={total}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-cream-mid animate-pulse"
            >
              <div className="aspect-[4/3] bg-cream-mid" />
              <div className="p-4 space-y-2">
                <div className="h-2.5 bg-cream-mid rounded w-1/3" />
                <div className="h-4 bg-cream-mid rounded w-3/4" />
                <div className="h-3 bg-cream-mid rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-brand-muted">
          <p className="text-4xl mb-4">📷</p>
          <p className="font-serif text-xl text-pine mb-2">No media yet</p>
          <p className="text-sm">
            Check back soon — we&apos;re adding photos and videos regularly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <ScrollReveal key={item._id} variant="fade-up" delay={(i % 3) * 80} duration={550}>
              <GalleryCard item={item} index={i} onOpen={openLightbox} />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-pine text-cream px-8 py-3 rounded text-sm font-medium hover:bg-pine-mid transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {loading && items.length > 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 size={22} className="animate-spin text-pine-light" />
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          items={items}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={lightboxNext}
          onPrev={lightboxPrev}
        />
      )}
    </>
  );
}
