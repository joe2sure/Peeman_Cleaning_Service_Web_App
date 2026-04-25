"use client";
import { useEffect, useState } from "react";
import adminApi from "@/lib/admin/api";
import { BarChart2, Eye, Users, ClipboardList, CalendarCheck, Star, TrendingUp } from "lucide-react";

interface Summary {
  pageViews:  { total: number; today: number; last7days: number; last30days: number };
  users:      { total: number; newLast7days: number };
  enquiries:  { total: number; last7days: number };
  bookings:   { total: number; last7days: number };
  reviews:    { pendingApproval: number };
  topPages:   { path: string; count: number }[];
  dailyViews: { date: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [data,    setData]    = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/api/v1/analytics/summary")
      .then(r => setData(r.data?.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxViews = data ? Math.max(...data.dailyViews.map(d => d.count), 1) : 1;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-cream-mid rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 bg-cream-mid rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto pt-10 text-center text-brand-muted">
        <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
        <p className="font-serif text-lg text-pine">Analytics unavailable</p>
        <p className="text-sm">Check your API connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-pine">Analytics</h1>
        <p className="text-brand-muted text-sm mt-0.5">Site performance and visitor insights.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Page Views",   value: data.pageViews.total,      sub: `${data.pageViews.today} today`,          icon: Eye,          color: "text-pine-light" },
          { label: "Views This Week",    value: data.pageViews.last7days,  sub: `${data.pageViews.last30days} this month`, icon: TrendingUp,   color: "text-sage" },
          { label: "Registered Users",   value: data.users.total,          sub: `+${data.users.newLast7days} this week`,   icon: Users,        color: "text-gold" },
          { label: "Total Enquiries",    value: data.enquiries.total,      sub: `${data.enquiries.last7days} this week`,   icon: ClipboardList,color: "text-bark-light" },
          { label: "Total Bookings",     value: data.bookings.total,       sub: `${data.bookings.last7days} this week`,    icon: CalendarCheck,color: "text-pine" },
          { label: "Pending Reviews",    value: data.reviews.pendingApproval, sub: "awaiting approval",                   icon: Star,         color: "text-gold" },
          { label: "30-Day Views",       value: data.pageViews.last30days, sub: "page views",                             icon: BarChart2,    color: "text-pine-light" },
          { label: "New Users / Week",   value: data.users.newLast7days,   sub: "registrations",                          icon: Users,        color: "text-sage" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-cream-mid rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-brand-muted uppercase tracking-wider leading-tight">{label}</p>
              <Icon size={14} className={color} />
            </div>
            <p className="font-serif text-2xl font-semibold text-pine">{value}</p>
            <p className="text-[0.7rem] text-brand-muted mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Daily views bar chart */}
      {data.dailyViews.length > 0 && (
        <div className="bg-white border border-cream-mid rounded-xl p-6">
          <h2 className="font-serif text-lg font-semibold text-pine mb-5">Page Views — Last 14 Days</h2>
          <div className="flex items-end gap-1.5 h-40 overflow-x-auto pb-1">
            {data.dailyViews.map(({ date, count }) => {
              const pct = Math.max((count / maxViews) * 100, 4);
              return (
                <div key={date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: "100%" }}>
                    <div
                      className="w-full bg-pine-light/70 group-hover:bg-pine rounded-t transition-all duration-300"
                      style={{ height: `${pct}%` }}
                      title={`${count} views`}
                    />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[0.6rem] text-brand-muted opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {count}
                    </span>
                  </div>
                  <span className="text-[0.55rem] text-brand-muted rotate-45 origin-left whitespace-nowrap mt-1">
                    {date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top pages */}
      {data.topPages.length > 0 && (
        <div className="bg-white border border-cream-mid rounded-xl p-6">
          <h2 className="font-serif text-lg font-semibold text-pine mb-4">Top Pages</h2>
          <div className="space-y-3">
            {data.topPages.map(({ path, count }, i) => {
              const pct = Math.round((count / data.topPages[0].count) * 100);
              return (
                <div key={path} className="flex items-center gap-3">
                  <span className="text-xs text-brand-muted w-4 flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-ink font-mono flex-1 truncate min-w-0">{path || "/"}</span>
                  <div className="w-24 h-1.5 bg-cream-mid rounded-full flex-shrink-0">
                    <div className="h-full bg-pine-light rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-brand-muted w-10 text-right flex-shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}