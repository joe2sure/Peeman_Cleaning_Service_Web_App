"use client";
import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Attach this ref to any element — it gains `data-revealed="true"`
 * once it enters the viewport, which CSS transitions pick up.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.12, rootMargin = "0px 0px -60px 0px", once = true } =
    options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-revealed", "true");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.removeAttribute("data-revealed");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
