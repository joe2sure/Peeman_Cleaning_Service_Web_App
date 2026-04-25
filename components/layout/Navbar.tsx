"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Menu, X, LayoutDashboard, LogIn, UserCircle } from "lucide-react";

export default function Navbar() {
  // ── ALL hooks BEFORE any conditional return (fixes the React hooks error) ─
  const [scrolled,   setScrolled]   = useState(false);
  const [open,       setOpen]       = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("peeman_user_token"));
  }, [pathname]);

  // ── Conditional render AFTER all hooks ─────────────────────────────────
  if (pathname.startsWith("/admin")) return null;

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
        <span className="font-serif text-xl font-semibold text-gold-light tracking-wide hidden sm:block">
          {SITE.name}
        </span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-5 list-none">
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

        {/* User auth CTA */}
        <li>
          {isLoggedIn ? (
            <Link href="/profile"
              className="flex items-center gap-1.5 text-white/70 hover:text-cream text-xs font-medium transition-colors border border-white/15 hover:border-white/35 px-3 py-1.5 rounded">
              <UserCircle size={13} /><span>My Account</span>
            </Link>
          ) : (
            <Link href="/login"
              className="flex items-center gap-1.5 text-white/70 hover:text-cream text-xs font-medium transition-colors border border-white/15 hover:border-white/35 px-3 py-1.5 rounded">
              <LogIn size={13} /><span>Sign In</span>
            </Link>
          )}
        </li>

        {/* Admin portal — subtle */}
        <li>
          <Link href="/admin/login"
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors border border-white/8 hover:border-white/20 px-3 py-1.5 rounded"
            title="Admin Dashboard">
            <LayoutDashboard size={12} /><span>Admin</span>
          </Link>
        </li>
      </ul>

      {/* Mobile right group */}
      <div className="flex items-center gap-2 md:hidden">
        <Link href={isLoggedIn ? "/profile" : "/login"}
          className="flex items-center gap-1 text-white/55 hover:text-white/85 text-xs transition-colors px-2 py-1.5 rounded border border-white/10 hover:border-white/25">
          {isLoggedIn ? <UserCircle size={12} /> : <LogIn size={12} />}
          <span>{isLoggedIn ? "Account" : "Sign In"}</span>
        </Link>
        <button className="text-gold-light p-1" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-pine/98 border-b border-sage/15 px-[5vw] py-5 flex flex-col gap-4 md:hidden z-50">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn("text-sm font-light tracking-wide transition-colors",
                link.label === "Contact" ? "bg-gold text-pine px-4 py-2.5 rounded font-medium text-center" : "text-white/80 hover:text-sage"
              )}
              onClick={() => setOpen(false)}>
              {link.label === "Contact" ? "Get a Quote" : link.label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
            <Link href={isLoggedIn ? "/profile" : "/login"}
              className="flex items-center gap-2 text-white/65 hover:text-cream text-sm transition-colors"
              onClick={() => setOpen(false)}>
              {isLoggedIn ? <UserCircle size={14} /> : <LogIn size={14} />}
              {isLoggedIn ? "My Account" : "Sign In / Register"}
            </Link>
            <Link href="/admin/login"
              className="flex items-center gap-2 text-white/35 hover:text-white/65 text-sm transition-colors"
              onClick={() => setOpen(false)}>
              <LayoutDashboard size={14} />Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { NAV_LINKS, SITE } from "@/lib/constants";
// import { Menu, X, LayoutDashboard } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);

//   // ✅ All hooks are now declared unconditionally, before any early return
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => setOpen(false), [pathname]);

//   // Hide public navbar on admin pages — admin has its own sidebar
//   if (pathname.startsWith("/admin")) return null;

//   return (
//     <nav
//       className={cn(
//         "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] transition-shadow duration-300",
//         "bg-pine/97 backdrop-blur-sm border-b border-sage/10",
//         scrolled && "shadow-[0_2px_20px_rgba(0,0,0,0.25)]"
//       )}
//     >
//       {/* Logo */}
//       <Link href="/" className="flex items-center gap-2.5 no-underline">
//         <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-serif text-base font-semibold text-pine flex-shrink-0">
//           P
//         </span>
//         <span className="font-serif text-xl font-semibold text-gold-light tracking-wide hidden sm:block">
//           {SITE.name}
//         </span>
//       </Link>

//       {/* Desktop links */}
//       <ul className="hidden md:flex items-center gap-6 list-none">
//         {NAV_LINKS.map((link) => (
//           <li key={link.href}>
//             {link.label === "Contact" ? (
//               <Link
//                 href={link.href}
//                 className="bg-gold text-pine px-5 py-2 rounded text-sm font-medium hover:bg-gold-light transition-colors"
//               >
//                 Get a Quote
//               </Link>
//             ) : (
//               <Link
//                 href={link.href}
//                 className="text-white/80 text-sm font-light tracking-wide hover:text-sage transition-colors"
//               >
//                 {link.label}
//               </Link>
//             )}
//           </li>
//         ))}

//         {/* Admin Login CTA */}
//         <li>
//           <Link
//             href="/admin/login"
//             className="flex items-center gap-1.5 text-white/40 hover:text-white/75 text-xs font-medium transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5 rounded"
//             title="Admin Dashboard"
//           >
//             <LayoutDashboard size={13} />
//             <span>Admin</span>
//           </Link>
//         </li>
//       </ul>

//       {/* Mobile right group */}
//       <div className="flex items-center gap-2 md:hidden">
//         <Link
//           href="/admin/login"
//           className="flex items-center gap-1 text-white/35 hover:text-white/65 text-xs transition-colors px-2 py-1.5 rounded border border-white/10 hover:border-white/25"
//           title="Admin"
//         >
//           <LayoutDashboard size={12} />
//           <span>Admin</span>
//         </Link>
//         <button
//           className="text-gold-light p-1"
//           onClick={() => setOpen((o) => !o)}
//           aria-label="Toggle navigation"
//         >
//           {open ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="absolute top-[68px] left-0 right-0 bg-pine/98 border-b border-sage/15 px-[5vw] py-5 flex flex-col gap-4 md:hidden">
//           {NAV_LINKS.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={cn(
//                 "text-sm font-light tracking-wide transition-colors",
//                 link.label === "Contact"
//                   ? "bg-gold text-pine px-4 py-2.5 rounded font-medium text-center"
//                   : "text-white/80 hover:text-sage"
//               )}
//               onClick={() => setOpen(false)}
//             >
//               {link.label === "Contact" ? "Get a Quote" : link.label}
//             </Link>
//           ))}
//           <div className="border-t border-white/10 pt-3">
//             <Link
//               href="/admin"
//               className="flex items-center gap-2 text-white/45 hover:text-white/75 text-sm transition-colors"
//               onClick={() => setOpen(false)}
//             >
//               <LayoutDashboard size={14} />
//               Admin Dashboard
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }