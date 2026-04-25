"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchPublishedMedia } from "@/lib/api";
import { DEMO_GALLERY } from "@/lib/constants";
import type { MediaItem, MediaCategory, MediaType } from "@/types";

interface UseGalleryOptions {
  initialCategory?: MediaCategory | "all";
  initialType?: MediaType | "all";
  pageSize?: number;
}

export function useGallery({
  initialCategory = "all",
  initialType = "all",
  pageSize = 12,
}: UseGalleryOptions = {}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<MediaCategory | "all">(initialCategory);
  const [mediaType, setMediaType] = useState<MediaType | "all">(initialType);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const load = useCallback(
    async (resetPage = true) => {
      setLoading(true);
      setError(null);
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: pageSize,
        };
        if (category !== "all") params.category = category;
        if (mediaType !== "all") params.type = mediaType;

        const res = await fetchPublishedMedia(params) as any;

        if (res.success && Array.isArray(res.data)) {
          const fetched = res.data as MediaItem[];
          setItems(resetPage ? fetched : (prev) => [...prev, ...fetched]);
          setTotal(res.pagination?.total ?? fetched.length);
          setHasMore(
            (res.pagination?.page ?? 1) < (res.pagination?.pages ?? 1)
          );
        } else {
          // Fall back to demo data filtered client-side
          useDemoData(category, mediaType, setItems, setTotal, setHasMore);
        }
      } catch {
        // API unavailable — show demo data so the gallery is never empty
        useDemoData(category, mediaType, setItems, setTotal, setHasMore);
      } finally {
        setLoading(false);
      }
    },
    [category, mediaType, page, pageSize]
  );

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, mediaType]);

  const loadMore = () => {
    setPage((p) => p + 1);
    load(false);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const lightboxNext = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : 0));
  const lightboxPrev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + items.length) % items.length : 0
    );

  return {
    items,
    loading,
    error,
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
  };
}

// ── Fallback: filter demo data client-side ─────────────────────────────────
function useDemoData(
  category: MediaCategory | "all",
  mediaType: MediaType | "all",
  setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>,
  setTotal: React.Dispatch<React.SetStateAction<number>>,
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
) {
  let filtered = DEMO_GALLERY;
  if (category !== "all") filtered = filtered.filter((m) => m.category === category);
  if (mediaType !== "all") filtered = filtered.filter((m) => m.type === mediaType);
  setItems(filtered);
  setTotal(filtered.length);
  setHasMore(false);
}
