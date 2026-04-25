import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { SITE } from "@/lib/constants";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Professional Cleaning in Wolverhampton`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Peeman Cleaning Services – trusted professional cleaning in Wolverhampton, WV1 3NP. Domestic, commercial, deep cleans, end of tenancy & more.",
  keywords: [
    "cleaning services Wolverhampton",
    "domestic cleaning WV1",
    "commercial cleaning Wolverhampton",
    "deep clean West Midlands",
    "end of tenancy cleaning",
    "carpet cleaning Wolverhampton",
  ],
  openGraph: {
    title: SITE.name,
    description: "Professional cleaning services in Wolverhampton, UK.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: SITE.name,
    locale: "en_GB",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body>
        {/*
         * UserAuthProvider wraps the whole app so any page/component
         * can call useUserAuth() to get the logged-in user state.
         *
         * AdminAuthProvider is mounted separately inside app/admin/layout.tsx
         * so it only loads on admin routes.
         */}
        <UserAuthProvider>
          {/* Analytics tracker — fires a page-view beacon on every route change */}
          <AnalyticsTracker />

          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1B4332",
                color: "#F8F5EF",
                border: "1px solid rgba(116,198,157,0.3)",
                fontFamily: "var(--font-dm-sans)",
              },
            }}
          />
        </UserAuthProvider>
      </body>
    </html>
  );
}


// import type { Metadata } from "next";
// import { DM_Sans, Cormorant_Garamond } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
// import { SITE } from "@/lib/constants";

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   variable: "--font-dm-sans",
//   weight: ["300", "400", "500"],
//   display: "swap",
// });

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   variable: "--font-cormorant",
//   weight: ["400", "600"],
//   style: ["normal", "italic"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: {
//     default: `${SITE.name} | Professional Cleaning in Wolverhampton`,
//     template: `%s | ${SITE.name}`,
//   },
//   description:
//     "Peeman Cleaning Services – trusted professional cleaning in Wolverhampton, WV1 3NP. Domestic, commercial, deep cleans, end of tenancy & more. Call, WhatsApp or email us today.",
//   keywords: [
//     "cleaning services Wolverhampton",
//     "domestic cleaning WV1",
//     "commercial cleaning Wolverhampton",
//     "deep clean West Midlands",
//     "end of tenancy cleaning",
//     "carpet cleaning Wolverhampton",
//   ],
//   openGraph: {
//     title: SITE.name,
//     description: "Professional cleaning services in Wolverhampton, UK.",
//     url: process.env.NEXT_PUBLIC_SITE_URL,
//     siteName: SITE.name,
//     locale: "en_GB",
//     type: "website",
//   },
//   robots: { index: true, follow: true },
//   icons: { icon: "/favicon.ico" },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
//       <body>
//         <Navbar />
//         <main>{children}</main>
//         <Footer />
//         <FloatingWhatsApp />
//         <Toaster
//           position="bottom-right"
//           toastOptions={{
//             style: {
//               background: "#1B4332",
//               color: "#F8F5EF",
//               border: "1px solid rgba(116,198,157,0.3)",
//               fontFamily: "var(--font-dm-sans)",
//             },
//           }}
//         />
//       </body>
//     </html>
//   );
// }
