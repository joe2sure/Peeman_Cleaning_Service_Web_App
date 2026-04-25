"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/context/UserAuthContext";
import ReviewSubmitForm from "@/components/auth/ReviewSubmitForm";
import { LogOut, User, Mail, Phone } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout, isAuthenticated } = useUserAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "review">("profile");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-[5vw]">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header card */}
        <div className="bg-pine rounded-2xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif text-2xl font-semibold flex-shrink-0">
            {user.firstName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-xl font-semibold text-cream">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-white/55 text-sm">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/50 hover:text-cream text-xs border border-white/15 hover:border-white/30 px-3 py-2 rounded transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-mid rounded-lg p-1 w-fit">
          {(["profile", "review"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-pine text-cream" : "text-brand-muted hover:text-pine"
              }`}>
              {t === "review" ? "Write a Review" : "My Profile"}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="bg-white border border-cream-mid rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-pine mb-2">Account Details</h2>
            {[
              { icon: User, label: "Full Name", value: `${user.firstName} ${user.lastName}` },
              { icon: Mail, label: "Email", value: user.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-b border-cream-mid last:border-0">
                <div className="w-9 h-9 rounded-lg bg-sage-pale flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-pine-light" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-ink font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review tab */}
        {tab === "review" && (
          <div className="bg-white border border-cream-mid rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-pine mb-1">Share Your Experience</h2>
            <p className="text-brand-muted text-sm mb-6">
              Your review will be shown on the website after approval.
            </p>
            <ReviewSubmitForm prefillName={`${user.firstName} ${user.lastName}`} prefillEmail={user.email} />
          </div>
        )}
      </div>
    </div>
  );
}