"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] transition-shadow duration-300",
        "bg-pine/97 backdrop-blur-sm border-b border-sage/10",
        scrolled && "shadow-[0_2px_20px_rgba(0,0,0,0.25)]"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-serif text-base font-semibold text-pine flex-shrink-0">
          P
        </span>
        <span className="font-serif text-xl font-semibold text-gold-light tracking-wide">
          {SITE.name}
        </span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            {link.label === "Contact" ? (
              <Link
                href={link.href}
                className="bg-gold text-pine px-5 py-2 rounded text-sm font-medium hover:bg-gold-light transition-colors"
              >
                Get a Quote
              </Link>
            ) : (
              <Link
                href={link.href}
                className="text-white/80 text-sm font-light tracking-wide hover:text-sage transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-gold-light p-1"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-pine/98 border-b border-sage/15 px-[5vw] py-5 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-light tracking-wide transition-colors",
                link.label === "Contact"
                  ? "bg-gold text-pine px-4 py-2.5 rounded font-medium text-center"
                  : "text-white/80 hover:text-sage"
              )}
              onClick={() => setOpen(false)}
            >
              {link.label === "Contact" ? "Get a Quote" : link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
