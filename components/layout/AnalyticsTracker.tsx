"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a page-view beacon to /api/v1/analytics/pageview on every route change.
 * Uses sendBeacon so it never blocks navigation or throws visible errors.
 */
export default function AnalyticsTracker() {
  const pathname   = usePathname();
  const sessionRef = useRef<string>("");

  // Generate/restore a session ID for this browser tab
  useEffect(() => {
    if (!sessionRef.current) {
      try {
        let sid = sessionStorage.getItem("p_sid");
        if (!sid) {
          sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
          sessionStorage.setItem("p_sid", sid);
        }
        sessionRef.current = sid;
      } catch {
        sessionRef.current = Math.random().toString(36).slice(2);
      }
    }
  }, []);

  useEffect(() => {
    // Skip admin routes
    if (pathname.startsWith("/admin")) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const payload = JSON.stringify({
      path:      pathname,
      referrer:  typeof document !== "undefined" ? document.referrer : "",
      sessionId: sessionRef.current,
    });

    // sendBeacon is fire-and-forget, won't throw or affect UX
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        `${apiUrl}/api/v1/analytics/pageview`,
        new Blob([payload], { type: "application/json" })
      );
    } else {
      // Fallback for environments without sendBeacon
      fetch(`${apiUrl}/api/v1/analytics/pageview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null; // renders nothing
}