"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContexxt";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ImagePlus, ClipboardList,
  CalendarCheck, Star, LogOut, Menu, X, ChevronRight,
  Layers, Megaphone,
  Users,
  BarChart2,
} from "lucide-react";

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/hero",      label: "Hero Slides", icon: Layers },
  { href: "/admin/ads",       label: "Ads",         icon: Megaphone },
  { href: "/admin/gallery",   label: "Gallery",    icon: ImagePlus },
  { href: "/admin/enquiries", label: "Enquiries",  icon: ClipboardList },
  { href: "/admin/bookings",  label: "Bookings",   icon: CalendarCheck },
  { href: "/admin/reviews",   label: "Reviews",    icon: Star },
  { href: "/admin/users",     label: "Users",      icon: Users },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart2 },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <div className={cn(
      "flex flex-col h-full bg-pine text-cream",
      mobile ? "w-72" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div>
          <p className="font-serif text-lg font-semibold text-gold-light leading-none">Peeman</p>
          <p className="text-[0.7rem] text-white/40 uppercase tracking-wider mt-0.5">Admin Panel</p>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                active
                  ? "bg-white/15 text-cream font-medium"
                  : "text-white/55 hover:bg-white/8 hover:text-cream"
              )}
            >
              <Icon size={16} className={active ? "text-gold" : "text-white/40 group-hover:text-white/70"} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto text-white/30" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-semibold">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-cream truncate">{user?.email ?? "Admin"}</p>
            <p className="text-[0.65rem] text-white/35">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/8 hover:text-cream transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Show login page without the shell
  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col flex-shrink-0 border-r border-cream-mid">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          <div className="shadow-2xl">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-cream-mid flex-shrink-0">
          <button
            className="md:hidden text-brand-muted hover:text-pine"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            target="_blank"
            className="text-xs text-brand-muted hover:text-pine transition-colors"
          >
            ← View website
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}




// "use client";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContexxt";
// import { cn } from "@/lib/utils";
// import {
//   LayoutDashboard, ImagePlus, ClipboardList,
//   CalendarCheck, Star, LogOut, Menu, X, ChevronRight,
// } from "lucide-react";

// const NAV = [
//   { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
//   { href: "/admin/gallery",   label: "Gallery",    icon: ImagePlus },
//   { href: "/admin/enquiries", label: "Enquiries",  icon: ClipboardList },
//   { href: "/admin/bookings",  label: "Bookings",   icon: CalendarCheck },
//   { href: "/admin/reviews",   label: "Reviews",    icon: Star },
// ];

// function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
//   const pathname = usePathname();
//   const { user, logout } = useAdminAuth();

//   return (
//     <div className={cn(
//       "flex flex-col h-full bg-pine text-cream",
//       mobile ? "w-72" : "w-64"
//     )}>
//       {/* Logo */}
//       <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
//         <div>
//           <p className="font-serif text-lg font-semibold text-gold-light leading-none">Peeman</p>
//           <p className="text-[0.7rem] text-white/40 uppercase tracking-wider mt-0.5">Admin Panel</p>
//         </div>
//         {mobile && (
//           <button onClick={onClose} className="text-white/50 hover:text-white">
//             <X size={18} />
//           </button>
//         )}
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
//         {NAV.map(({ href, label, icon: Icon }) => {
//           const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
//           return (
//             <Link
//               key={href}
//               href={href}
//               onClick={onClose}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
//                 active
//                   ? "bg-white/15 text-cream font-medium"
//                   : "text-white/55 hover:bg-white/8 hover:text-cream"
//               )}
//             >
//               <Icon size={16} className={active ? "text-gold" : "text-white/40 group-hover:text-white/70"} />
//               {label}
//               {active && <ChevronRight size={12} className="ml-auto text-white/30" />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* User + logout */}
//       <div className="px-4 py-4 border-t border-white/10">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-semibold">
//             {user?.email?.[0]?.toUpperCase() ?? "A"}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-xs font-medium text-cream truncate">{user?.email ?? "Admin"}</p>
//             <p className="text-[0.65rem] text-white/35">Administrator</p>
//           </div>
//         </div>
//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/8 hover:text-cream transition-colors"
//         >
//           <LogOut size={14} />
//           Sign out
//         </button>
//       </div>
//     </div>
//   );
// }

// function AdminShell({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, loading } = useAdminAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!loading && !isAuthenticated && pathname !== "/admin/login") {
//       router.replace("/admin/login");
//     }
//   }, [loading, isAuthenticated, pathname, router]);

//   // Show login page without the shell
//   if (pathname === "/admin/login") return <>{children}</>;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-cream flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) return null;

//   return (
//     <div className="flex h-screen bg-cream overflow-hidden">
//       {/* Desktop sidebar */}
//       <aside className="hidden md:flex flex-col flex-shrink-0 border-r border-cream-mid">
//         <Sidebar />
//       </aside>

//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-50 md:hidden flex">
//           <div className="flex-1" onClick={() => setSidebarOpen(false)} />
//           <div className="shadow-2xl">
//             <Sidebar mobile onClose={() => setSidebarOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Top bar */}
//         <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-cream-mid flex-shrink-0">
//           <button
//             className="md:hidden text-brand-muted hover:text-pine"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu size={20} />
//           </button>
//           <div className="flex-1" />
//           <Link
//             href="/"
//             target="_blank"
//             className="text-xs text-brand-muted hover:text-pine transition-colors"
//           >
//             ← View website
//           </Link>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <AdminAuthProvider>
//       <AdminShell>{children}</AdminShell>
//     </AdminAuthProvider>
//   );
// }
