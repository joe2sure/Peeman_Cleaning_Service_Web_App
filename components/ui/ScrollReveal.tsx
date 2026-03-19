"use client";
import { useRef, useEffect, ReactNode, CSSProperties, JSX } from "react";
import { cn } from "@/lib/utils";

type AnimVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "zoom-in";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: AnimVariant;
  delay?: number;       // ms
  duration?: number;    // ms
  threshold?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const variantStyles: Record<AnimVariant, CSSProperties> = {
  "fade-up":    { opacity: 0, transform: "translateY(32px)" },
  "fade-in":    { opacity: 0, transform: "none" },
  "fade-left":  { opacity: 0, transform: "translateX(-28px)" },
  "fade-right": { opacity: 0, transform: "translateX(28px)" },
  "zoom-in":    { opacity: 0, transform: "scale(0.94)" },
};

export default function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.12,
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply initial hidden state
    Object.assign(el.style, variantStyles[variant]);
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    el.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          if (once) observer.unobserve(el);
        } else if (!once) {
          Object.assign(el.style, variantStyles[variant]);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay, duration, threshold, once]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
