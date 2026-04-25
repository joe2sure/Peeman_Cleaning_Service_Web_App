"use client";
import { useEffect, useState, useCallback, useRef, FormEvent } from "react";
import Image from "next/image";
import { getAdminAds, createAd, updateAd, deleteAd } from "@/lib/admin/api";
import type { Ad } from "@/types";
import {
  Plus, Trash2, Edit2, Upload, X, Loader2,
  CheckCircle, AlertCircle, Eye, EyeOff,
} from "lucide-react";

const PLACEMENTS = ["homepage", "gallery", "contact", "global"] as const;
const AD_TYPES   = ["banner", "card", "fullwidth"] as const;

const EMPTY: Partial<Ad> & { active: boolean } = {
  title: "", body: "", ctaLabel: "", ctaHref: "",
  type: "banner", placement: "homepage",
  backgroundColor: "#1B4332", textColor: "#F8F5EF",
  active: true, startsAt: "", endsAt: "",
};

export default function AdminAdsPage() {
  const [ads, setAds]           = useState<Ad[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ ...EMPTY });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminAds();
      setAds(res.data?.data ?? []);
    } catch { setAds([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY });
    setMediaFile(null); setMediaPreview("");
    setShowForm(true); setFeedback(null);
  };

  const openEdit = (ad: Ad) => {
    setEditId(ad._id);
    setForm({
      title: ad.title, body: ad.body ?? "", ctaLabel: ad.ctaLabel ?? "",
      ctaHref: ad.ctaHref ?? "", type: ad.type, placement: ad.placement,
      backgroundColor: ad.backgroundColor, textColor: ad.textColor,
      active: ad.active,
      startsAt: ad.startsAt ? ad.startsAt.substring(0, 10) : "",
      endsAt:   ad.endsAt   ? ad.endsAt.substring(0, 10)   : "",
    });
    setMediaPreview(ad.imageUrl ?? ad.videoUrl ?? "");
    setMediaFile(null);
    setShowForm(true); setFeedback(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMediaFile(f);
    setMediaPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { setFeedback({ type: "err", msg: "Title is required." }); return; }
    setSaving(true); setFeedback(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== "") fd.append(k, String(v)); });
      if (mediaFile) fd.append("mediaFile", mediaFile);

      if (editId) {
        await updateAd(editId, fd);
        setFeedback({ type: "ok", msg: "Ad updated!" });
      } else {
        await createAd(fd);
        setFeedback({ type: "ok", msg: "Ad created!" });
      }
      await load();
      setTimeout(() => { setShowForm(false); setFeedback(null); }, 1200);
    } catch (err: unknown) {
      setFeedback({ type: "err", msg: err instanceof Error ? err.message : "Failed to save" });
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this ad permanently?")) return;
    await deleteAd(id).catch(() => {});
    setAds((p) => p.filter((a) => a._id !== id));
  };

  const inputCls = "w-full border border-cream-mid rounded px-3 py-2 text-sm text-ink outline-none focus:border-pine-light bg-white";
  const labelCls = "block text-xs uppercase tracking-wider text-brand-muted mb-1";

  const placementColor: Record<string, string> = {
    homepage: "bg-gold/10 text-yellow-700",
    gallery:  "bg-sage-pale text-pine-mid",
    contact:  "bg-pine/10 text-pine",
    global:   "bg-bark-light/10 text-bark",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine">Ads & Promotions</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Create promotional banners, cards and full-width ads shown on the website.
          </p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 bg-pine text-cream px-5 py-2.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors">
          <Plus size={15} /> New Ad
        </button>
      </div>

      {/* Stats summary */}
      {!loading && ads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLACEMENTS.map((p) => {
            const count = ads.filter(a => a.placement === p && a.active).length;
            return (
              <div key={p} className={`rounded-xl border px-4 py-3 ${count > 0 ? "border-pine/20 bg-white" : "border-cream-mid bg-cream/50"}`}>
                <p className="text-xs text-brand-muted capitalize mb-1">{p}</p>
                <p className="font-serif text-xl font-semibold text-pine">{count}</p>
                <p className="text-[0.65rem] text-brand-muted">active</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Ads list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-cream-mid rounded-xl animate-pulse" />)}
        </div>
      ) : ads.length === 0 ? (
        <div className="border-2 border-dashed border-cream-mid rounded-xl py-16 text-center text-brand-muted">
          <p className="text-3xl mb-3">📢</p>
          <p className="font-serif text-lg text-pine mb-1">No ads yet</p>
          <p className="text-sm mb-4">Create a promotional banner to display on the website.</p>
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 bg-pine text-cream px-5 py-2 rounded text-sm font-medium hover:bg-pine-mid transition-colors">
            <Plus size={14} /> Create First Ad
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad._id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${
                ad.active ? "border-cream-mid" : "border-cream-mid opacity-55"
              }`}
            >
              {/* Media thumbnail */}
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative"
                style={{ background: ad.backgroundColor }}>
                {ad.imageUrl ? (
                  <Image src={ad.imageUrl} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">📢</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-medium text-ink text-sm">{ad.title}</p>
                  <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-medium capitalize ${placementColor[ad.placement]}`}>
                    {ad.placement}
                  </span>
                  <span className="text-[0.65rem] border border-cream-mid text-brand-muted px-2 py-0.5 rounded capitalize">
                    {ad.type}
                  </span>
                  {!ad.active && (
                    <span className="text-[0.65rem] bg-red-50 text-red-500 px-2 py-0.5 rounded">Inactive</span>
                  )}
                </div>
                {ad.body && <p className="text-xs text-brand-muted line-clamp-1">{ad.body}</p>}
                {(ad.startsAt || ad.endsAt) && (
                  <p className="text-[0.65rem] text-brand-muted/60 mt-0.5">
                    {ad.startsAt && `From: ${new Date(ad.startsAt).toLocaleDateString("en-GB")}`}
                    {ad.startsAt && ad.endsAt && " · "}
                    {ad.endsAt && `Until: ${new Date(ad.endsAt).toLocaleDateString("en-GB")}`}
                  </p>
                )}
                <p className="text-[0.65rem] text-brand-muted/60 mt-0.5">
                  Clicks: {ad.clickCount ?? 0}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full border" style={{ background: ad.backgroundColor }} />
                  <div className="w-3 h-3 rounded-full border" style={{ background: ad.textColor }} />
                </div>
                <button onClick={() => openEdit(ad)}
                  className="p-1.5 text-brand-muted hover:text-pine transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => remove(ad._id)}
                  className="p-1.5 text-brand-muted hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Ad Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-mid">
              <h2 className="font-serif text-xl font-semibold text-pine">
                {editId ? "Edit Ad" : "Create New Ad"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Title <span className="text-red-400">*</span></label>
                <input className={inputCls} value={form.title ?? ""}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Summer Deep Clean Special — 20% Off" />
              </div>

              <div>
                <label className={labelCls}>Body text</label>
                <textarea className={`${inputCls} resize-none`} rows={2}
                  value={form.body ?? ""}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Optional supporting text shown below the title..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>CTA Button Label</label>
                  <input className={inputCls} value={form.ctaLabel ?? ""}
                    onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                    placeholder="Book Now" />
                </div>
                <div>
                  <label className={labelCls}>CTA Link (href)</label>
                  <input className={inputCls} value={form.ctaHref ?? ""}
                    onChange={e => setForm(f => ({ ...f, ctaHref: e.target.value }))}
                    placeholder="/#contact or https://..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ad Type</label>
                  <select className={inputCls} value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as Ad["type"] }))}>
                    {AD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Placement</label>
                  <select className={inputCls} value={form.placement}
                    onChange={e => setForm(f => ({ ...f, placement: e.target.value as Ad["placement"] }))}>
                    {PLACEMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Colours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Background Colour</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.backgroundColor}
                      onChange={e => setForm(f => ({ ...f, backgroundColor: e.target.value }))}
                      className="w-9 h-9 rounded cursor-pointer border border-cream-mid" />
                    <span className="text-xs text-brand-muted">{form.backgroundColor}</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Text Colour</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.textColor}
                      onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))}
                      className="w-9 h-9 rounded cursor-pointer border border-cream-mid" />
                    <span className="text-xs text-brand-muted">{form.textColor}</span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Start date (optional)</label>
                  <input type="date" className={inputCls} value={form.startsAt ?? ""}
                    onChange={e => setForm(f => ({ ...f, startsAt: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>End date (optional)</label>
                  <input type="date" className={inputCls} value={form.endsAt ?? ""}
                    onChange={e => setForm(f => ({ ...f, endsAt: e.target.value }))} />
                </div>
              </div>

              {/* Media */}
              <div>
                <label className={labelCls}>Media image / video (optional)</label>
                <div className="border-2 border-dashed border-cream-mid rounded-xl p-4 text-center cursor-pointer hover:border-pine/30 transition-colors"
                  onClick={() => fileRef.current?.click()}>
                  {mediaPreview ? (
                    <div className="relative">
                      <img src={mediaPreview} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                      <button type="button" onClick={e => { e.stopPropagation(); setMediaFile(null); setMediaPreview(""); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={18} className="mx-auto mb-1 text-brand-muted/60" />
                      <p className="text-xs text-brand-muted">{mediaFile ? mediaFile.name : "Click to upload (JPEG, PNG, MP4 — max 50 MB)"}</p>
                    </>
                  )}
                  <input ref={fileRef} type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/mov,video/webm"
                    className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              {/* Live preview */}
              <div>
                <label className={labelCls}>Live Preview</label>
                <div className="rounded-xl overflow-hidden p-4 text-sm"
                  style={{ background: form.backgroundColor, color: form.textColor }}>
                  <p className="font-serif text-base font-semibold">{form.title || "Your Ad Title"}</p>
                  {form.body && <p className="text-xs mt-1 opacity-80">{form.body}</p>}
                  {form.ctaLabel && (
                    <span className="inline-block mt-2 px-3 py-1 rounded text-xs font-medium"
                      style={{ background: form.textColor, color: form.backgroundColor }}>
                      {form.ctaLabel}
                    </span>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-pine" />
                <span className="text-sm text-ink">Active (visible on website)</span>
              </label>

              {feedback && (
                <div className={`flex items-center gap-2 text-sm rounded px-3 py-2 ${
                  feedback.type === "ok" ? "bg-sage-pale text-pine border border-sage/30" : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {feedback.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {feedback.msg}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm border border-cream-mid rounded hover:bg-cream transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-pine text-cream px-6 py-2.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : editId ? "Update Ad" : "Create Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
