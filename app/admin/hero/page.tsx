"use client";
import { useEffect, useState, useCallback, useRef, FormEvent } from "react";
import Image from "next/image";
import {
  getAdminHeroSlides, createHeroSlide, updateHeroSlide,
  deleteHeroSlide, toggleHeroSlide,
} from "@/lib/admin/api";
import type { HeroSlide } from "@/types";
import {
  Plus, Trash2, Edit2, Eye, EyeOff, Upload, X,
  Loader2, CheckCircle, AlertCircle, GripVertical,
} from "lucide-react";

const ACCENT_PRESETS = [
  "#C9A84C", "#74C69D", "#F0D080", "#9FE1CB",
  "#E07B54", "#A8D8EA", "#AA96DA", "#FCBAD3",
];

const EMPTY_FORM = {
  eyebrow: "", headingLine1: "", headingLine2: "", headingAccent: "",
  subtext: "", accentColor: "#C9A84C", badgeIcon: "✨",
  badgeLabel: "", badgeValue: "", ctaLabel: "Request a Quote",
  ctaHref: "/#contact", overlayOpacity: 40, active: true,
};

export default function AdminHeroPage() {
  const [slides, setSlides]     = useState<HeroSlide[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [bgFile, setBgFile]     = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminHeroSlides();
      setSlides(res.data?.data ?? []);
    } catch { setSlides([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setBgFile(null);
    setBgPreview("");
    setShowForm(true);
    setFeedback(null);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditId(slide._id);
    setForm({
      eyebrow: slide.eyebrow, headingLine1: slide.headingLine1,
      headingLine2: slide.headingLine2, headingAccent: slide.headingAccent,
      subtext: slide.subtext, accentColor: slide.accentColor,
      badgeIcon: slide.badgeIcon, badgeLabel: slide.badgeLabel,
      badgeValue: slide.badgeValue, ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      overlayOpacity: slide.overlayOpacity ?? 40,
      active: slide.active,
    });
    setBgPreview(slide.backgroundImage ?? slide.backgroundVideo ?? "");
    setBgFile(null);
    setShowForm(true);
    setFeedback(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBgFile(f);
    if (f.type.startsWith("image/")) {
      setBgPreview(URL.createObjectURL(f));
    } else {
      setBgPreview(""); // video — no preview
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.eyebrow || !form.headingLine1 || !form.headingLine2 || !form.subtext) {
      setFeedback({ type: "err", msg: "Eyebrow, both heading lines and subtext are required." });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (bgFile) fd.append("bgFile", bgFile);

      if (editId) {
        await updateHeroSlide(editId, fd);
        setFeedback({ type: "ok", msg: "Slide updated!" });
      } else {
        await createHeroSlide(fd);
        setFeedback({ type: "ok", msg: "Slide created!" });
      }
      await load();
      setTimeout(() => { setShowForm(false); setFeedback(null); }, 1200);
    } catch (err: unknown) {
      setFeedback({ type: "err", msg: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this hero slide permanently?")) return;
    await deleteHeroSlide(id).catch(() => {});
    setSlides((p) => p.filter((s) => s._id !== id));
  };

  const toggle = async (slide: HeroSlide) => {
    await toggleHeroSlide(slide._id, !slide.active).catch(() => {});
    setSlides((p) => p.map((s) => s._id === slide._id ? { ...s, active: !slide.active } : s));
  };

  const inputCls = "w-full border border-cream-mid rounded px-3 py-2 text-sm text-ink outline-none focus:border-pine-light bg-white";
  const labelCls = "block text-xs uppercase tracking-wider text-brand-muted mb-1";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine">Hero Slides</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Manage the rotating banner on the homepage. Changes go live immediately.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-pine text-cream px-5 py-2.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors"
        >
          <Plus size={15} /> New Slide
        </button>
      </div>

      {/* Slides list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-cream-mid rounded-xl animate-pulse" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="border-2 border-dashed border-cream-mid rounded-xl py-16 text-center text-brand-muted">
          <p className="text-3xl mb-3">🖼️</p>
          <p className="font-serif text-lg text-pine mb-1">No slides yet</p>
          <p className="text-sm mb-4">Create your first hero slide to get started.</p>
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 bg-pine text-cream px-5 py-2 rounded text-sm font-medium hover:bg-pine-mid transition-colors">
            <Plus size={14} /> Create First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div
              key={slide._id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${
                slide.active ? "border-cream-mid" : "border-cream-mid opacity-60"
              }`}
            >
              {/* Drag handle + order */}
              <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                <GripVertical size={16} className="text-brand-muted/40" />
                <span className="text-xs text-brand-muted/40">{i + 1}</span>
              </div>

              {/* Background preview */}
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-pine flex-shrink-0 relative">
                {slide.backgroundImage ? (
                  <Image src={slide.backgroundImage} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: slide.accentColor + "33" }}>
                    <span className="text-2xl">{slide.badgeIcon}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg" style={{ background: slide.accentColor }} />
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm leading-snug line-clamp-1">
                  {slide.headingLine1} {slide.headingLine2}
                </p>
                <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{slide.eyebrow}</p>
                <p className="text-xs text-brand-muted/60 mt-1 line-clamp-1">{slide.subtext}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[0.65rem] border border-cream-mid text-brand-muted px-2 py-0.5 rounded">
                    CTA: {slide.ctaLabel}
                  </span>
                  <span
                    className="text-[0.65rem] px-2 py-0.5 rounded text-white"
                    style={{ background: slide.accentColor }}
                  >
                    {slide.accentColor}
                  </span>
                  {slide.backgroundImage && (
                    <span className="text-[0.65rem] bg-sage-pale text-pine-mid px-2 py-0.5 rounded">
                      Has background image
                    </span>
                  )}
                  {slide.backgroundVideo && (
                    <span className="text-[0.65rem] bg-pine/10 text-pine px-2 py-0.5 rounded">
                      Has background video
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggle(slide)}
                  title={slide.active ? "Deactivate" : "Activate"}
                  className={`p-1.5 rounded transition-colors ${slide.active ? "text-pine-light hover:text-pine" : "text-brand-muted hover:text-pine-light"}`}>
                  {slide.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(slide)}
                  className="p-1.5 rounded text-brand-muted hover:text-pine transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => remove(slide._id)}
                  className="p-1.5 rounded text-brand-muted hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Slide Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-mid">
              <h2 className="font-serif text-xl font-semibold text-pine">
                {editId ? "Edit Slide" : "Create New Slide"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Text fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Eyebrow text <span className="text-red-400">*</span></label>
                  <input className={inputCls} value={form.eyebrow}
                    onChange={e => setForm(f => ({ ...f, eyebrow: e.target.value }))}
                    placeholder="e.g. Wolverhampton's Trusted Cleaners" />
                </div>
                <div>
                  <label className={labelCls}>Heading Accent word <span className="text-red-400">*</span></label>
                  <input className={inputCls} value={form.headingAccent}
                    onChange={e => setForm(f => ({ ...f, headingAccent: e.target.value }))}
                    placeholder="Word to highlight in colour" />
                </div>
                <div>
                  <label className={labelCls}>Heading Line 1 <span className="text-red-400">*</span></label>
                  <input className={inputCls} value={form.headingLine1}
                    onChange={e => setForm(f => ({ ...f, headingLine1: e.target.value }))}
                    placeholder="e.g. Spotless Spaces." />
                </div>
                <div>
                  <label className={labelCls}>Heading Line 2 <span className="text-red-400">*</span></label>
                  <input className={inputCls} value={form.headingLine2}
                    onChange={e => setForm(f => ({ ...f, headingLine2: e.target.value }))}
                    placeholder="e.g. Exceptional Care." />
                </div>
              </div>

              <div>
                <label className={labelCls}>Subtext <span className="text-red-400">*</span></label>
                <textarea className={`${inputCls} resize-none`} rows={3} value={form.subtext}
                  onChange={e => setForm(f => ({ ...f, subtext: e.target.value }))}
                  placeholder="Short description shown below the heading..." />
              </div>

              {/* Badge */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Badge Icon</label>
                  <input className={inputCls} value={form.badgeIcon}
                    onChange={e => setForm(f => ({ ...f, badgeIcon: e.target.value }))}
                    placeholder="🏠" />
                </div>
                <div>
                  <label className={labelCls}>Badge Label</label>
                  <input className={inputCls} value={form.badgeLabel}
                    onChange={e => setForm(f => ({ ...f, badgeLabel: e.target.value }))}
                    placeholder="Speciality" />
                </div>
                <div>
                  <label className={labelCls}>Badge Value</label>
                  <input className={inputCls} value={form.badgeValue}
                    onChange={e => setForm(f => ({ ...f, badgeValue: e.target.value }))}
                    placeholder="Domestic & Commercial" />
                </div>
              </div>

              {/* CTA + accent colour */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>CTA Button Label</label>
                  <input className={inputCls} value={form.ctaLabel}
                    onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                    placeholder="Request a Quote" />
                </div>
                <div>
                  <label className={labelCls}>CTA Link (href)</label>
                  <input className={inputCls} value={form.ctaHref}
                    onChange={e => setForm(f => ({ ...f, ctaHref: e.target.value }))}
                    placeholder="/#contact or /services" />
                </div>
              </div>

              {/* Accent colour picker */}
              <div>
                <label className={labelCls}>Accent Colour</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {ACCENT_PRESETS.map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, accentColor: c }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        form.accentColor === c ? "border-pine scale-110" : "border-white/0 hover:scale-105"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                  <input
                    type="color" value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer border border-cream-mid"
                    title="Custom colour"
                  />
                  <span className="text-xs text-brand-muted">{form.accentColor}</span>
                </div>
              </div>

              {/* Background media */}
              <div>
                <label className={labelCls}>Background Image / Video (optional)</label>
                <div
                  className="border-2 border-dashed border-cream-mid rounded-xl p-5 text-center cursor-pointer hover:border-pine/30 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {bgPreview ? (
                    <div className="relative">
                      <img src={bgPreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={e => { e.stopPropagation(); setBgFile(null); setBgPreview(""); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="mx-auto mb-2 text-brand-muted/60" />
                      <p className="text-sm text-brand-muted">
                        {bgFile ? bgFile.name : "Click to upload image or video (max 50 MB)"}
                      </p>
                    </>
                  )}
                  <input ref={fileRef} type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/mov,video/webm"
                    className="hidden" onChange={handleFileChange} />
                </div>
                {bgPreview || bgFile ? (
                  <div className="mt-2">
                    <label className={labelCls}>Background Overlay Opacity ({form.overlayOpacity}%)</label>
                    <input type="range" min={0} max={90} value={form.overlayOpacity}
                      onChange={e => setForm(f => ({ ...f, overlayOpacity: Number(e.target.value) }))}
                      className="w-full accent-pine" />
                  </div>
                ) : null}
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-pine" />
                <span className="text-sm text-ink">Make this slide active (visible on homepage)</span>
              </label>

              {/* Feedback */}
              {feedback && (
                <div className={`flex items-center gap-2 text-sm rounded px-3 py-2 ${
                  feedback.type === "ok"
                    ? "bg-sage-pale text-pine border border-sage/30"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {feedback.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {feedback.msg}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm border border-cream-mid rounded hover:bg-cream transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-pine text-cream px-6 py-2.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : editId ? "Update Slide" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
