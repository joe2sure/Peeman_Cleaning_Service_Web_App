"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  // Hook called BEFORE any conditional return
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0F2A1E] text-white/50">
      <div className="px-[5vw] py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-serif text-sm font-semibold text-pine">
              P
            </span>
            <span className="font-serif text-lg font-semibold text-gold-light">
              {SITE.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Professional cleaning services across Wolverhampton and the West
            Midlands. Trusted, insured and highly rated.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4 font-medium">
            Quick Links
          </p>
          <ul className="flex flex-col gap-2.5 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-sage transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="text-sm hover:text-sage transition-colors">
                Sign In / Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4 font-medium">
            Contact
          </p>
          <ul className="flex flex-col gap-3 list-none">
            <li className="flex items-start gap-2.5 text-sm">
              <MapPin size={15} className="mt-0.5 flex-shrink-0 text-sage/60" />
              <span>
                {SITE.address}, {SITE.city}, {SITE.postcode}, {SITE.country}
              </span>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 text-sm hover:text-sage transition-colors"
              >
                <Mail size={15} className="text-sage/60" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-2.5 text-sm hover:text-sage transition-colors"
              >
                <Phone size={15} className="text-sage/60" />
                {SITE.phone}
              </a>
            </li>
          </ul>
          <div className="mt-4 text-xs">
            <p>{SITE.hours.weekday}</p>
            <p>{SITE.hours.weekend}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-[5vw] py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-gold-light/60">{SITE.name}</span>. All rights reserved.
        </p>
        <p>
          {SITE.address} · {SITE.postcode}
        </p>
      </div>
    </footer>
  );
}



// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { SITE, NAV_LINKS } from "@/lib/constants";
// import { Mail, Phone, MapPin } from "lucide-react";

// export default function Footer() {
//   const pathname = usePathname();
//   if (pathname.startsWith("/admin")) return null;
//   return (
//     <footer className="bg-[#0F2A1E] text-white/50">
//       {/* Main footer */}
//       <div className="px-[5vw] py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
//         {/* Brand */}
//         <div>
//           <div className="flex items-center gap-2.5 mb-4">
//             <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-serif text-sm font-semibold text-pine">
//               P
//             </span>
//             <span className="font-serif text-lg font-semibold text-gold-light">
//               {SITE.name}
//             </span>
//           </div>
//           <p className="text-sm leading-relaxed max-w-xs">
//             Professional cleaning services across Wolverhampton and the West
//             Midlands. Trusted, insured and highly rated.
//           </p>
//         </div>

//         {/* Links */}
//         <div>
//           <p className="text-xs uppercase tracking-widest text-white/30 mb-4 font-medium">
//             Quick Links
//           </p>
//           <ul className="flex flex-col gap-2.5 list-none">
//             {NAV_LINKS.map((link) => (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   className="text-sm hover:text-sage transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Contact */}
//         <div>
//           <p className="text-xs uppercase tracking-widest text-white/30 mb-4 font-medium">
//             Contact
//           </p>
//           <ul className="flex flex-col gap-3 list-none">
//             <li className="flex items-start gap-2.5 text-sm">
//               <MapPin size={15} className="mt-0.5 flex-shrink-0 text-sage/60" />
//               <span>
//                 {SITE.address}, {SITE.city}, {SITE.postcode},{" "}
//                 {SITE.country}
//               </span>
//             </li>
//             <li>
//               <a
//                 href={`mailto:${SITE.email}`}
//                 className="flex items-center gap-2.5 text-sm hover:text-sage transition-colors"
//               >
//                 <Mail size={15} className="text-sage/60" />
//                 {SITE.email}
//               </a>
//             </li>
//             <li>
//               <a
//                 href={`tel:${SITE.phone}`}
//                 className="flex items-center gap-2.5 text-sm hover:text-sage transition-colors"
//               >
//                 <Phone size={15} className="text-sage/60" />
//                 {SITE.phone}
//               </a>
//             </li>
//           </ul>
//           <div className="mt-4 text-xs">
//             <p>{SITE.hours.weekday}</p>
//             <p>{SITE.hours.weekend}</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="border-t border-white/5 px-[5vw] py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
//         <p>
//           © {new Date().getFullYear()}{" "}
//           <span className="text-gold-light/60">{SITE.name}</span>. All rights
//           reserved.
//         </p>
//         <p>
//           {SITE.address} · {SITE.postcode}
//         </p>
//       </div>
//     </footer>
//   );
// }