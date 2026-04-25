import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — Our Cleaning Work",
  description:
    "Browse photos and videos of cleaning jobs completed by Peeman Cleaning Services across Wolverhampton and the West Midlands.",
};

export default function GalleryPage() {
  return (
    <section className="min-h-screen bg-cream pt-28 pb-20 px-[5vw]">
      {/* Page header */}
      <div className="max-w-2xl mb-12">
        <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-pine-light font-medium mb-2 before:block before:w-5 before:h-px before:bg-pine-light">
          Portfolio
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-pine leading-tight mb-4">
          Our Cleaning Work
        </h1>
        <p className="text-brand-muted font-light text-lg leading-relaxed">
          Real results from real jobs. Browse photos and videos of our work
          across domestic, commercial and specialist cleaning projects.
        </p>
      </div>

      {/* Gallery grid with filter */}
      <GalleryGrid />
    </section>
  );
}
