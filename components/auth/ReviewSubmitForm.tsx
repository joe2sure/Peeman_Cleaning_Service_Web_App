"use client";
import { useState, useRef, FormEvent } from "react";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { CheckCircle, AlertCircle, Loader2, Upload, X, Star } from "lucide-react";

interface Props {
  prefillName?: string;
  prefillEmail?: string;
}

export default function ReviewSubmitForm({ prefillName = "", prefillEmail = "" }: Props) {
  const [form, setForm] = useState({
    name: prefillName, location: "", rating: 0, service: "", text: "", email: prefillEmail,
  });
  const [hovered,  setHovered]  = useState(0);
  const [imgFile,  setImgFile]  = useState<File | null>(null);
  const [imgPrev,  setImgPrev]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgFile(f);
    setImgPrev(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.rating || !form.service || form.text.length < 10) {
      setError("Please fill in all fields and write at least 10 characters."); return;
    }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imgFile) fd.append("serviceImage", imgFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`, {
        method: "POST", body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Submission failed");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle size={36} className="text-pine-light" />
        <h3 className="font-serif text-xl font-semibold text-pine">Thank you!</h3>
        <p className="text-brand-muted text-sm max-w-sm">
          Your review has been submitted and will appear on the website once approved.
        </p>
        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, rating: 0, text: "", location: "" })); setImgFile(null); setImgPrev(""); }}
          className="mt-2 text-pine-light text-sm hover:underline">
          Submit another review
        </button>
      </div>
    );
  }

  const inputCls = "w-full border border-cream-mid rounded px-3.5 py-2.5 text-ink text-sm outline-none focus:border-pine-light transition-colors bg-white";
  const labelCls = "block text-xs uppercase tracking-wider text-brand-muted mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Your Name <span className="text-red-400">*</span></label>
          <input value={form.name} onChange={set("name")} placeholder="Jane Smith" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Your Location <span className="text-red-400">*</span></label>
          <input value={form.location} onChange={set("location")} placeholder="e.g. Penn, Wolverhampton" className={inputCls} />
        </div>
      </div>

      {/* Service */}
      <div>
        <label className={labelCls}>Service Received <span className="text-red-400">*</span></label>
        <select value={form.service} onChange={set("service")} className={inputCls}>
          <option value="">Select the service you received…</option>
          {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Star rating */}
      <div>
        <label className={labelCls}>Your Rating <span className="text-red-400">*</span></label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button"
              onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
              onClick={() => setForm(f => ({ ...f, rating: n }))}
              className="transition-transform hover:scale-110">
              <Star size={28}
                className={`transition-colors ${
                  n <= (hovered || form.rating) ? "text-gold fill-gold" : "text-cream-mid"
                }`}
              />
            </button>
          ))}
          {form.rating > 0 && (
            <span className="ml-2 text-sm text-brand-muted self-center">
              {["","Poor","Fair","Good","Very Good","Excellent"][form.rating]}
            </span>
          )}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label className={labelCls}>Your Review <span className="text-red-400">*</span></label>
        <textarea value={form.text} onChange={set("text")} rows={4} placeholder="Tell us about your experience…"
          className={`${inputCls} resize-none`} />
        <p className="text-[0.7rem] text-brand-muted mt-0.5">{form.text.length}/2000 characters</p>
      </div>

      {/* Optional image */}
      <div>
        <label className={labelCls}>Upload a Photo (optional)</label>
        <div className="border-2 border-dashed border-cream-mid rounded-xl p-4 text-center cursor-pointer hover:border-pine/30 transition-colors"
          onClick={() => fileRef.current?.click()}>
          {imgPrev ? (
            <div className="relative">
              <img src={imgPrev} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              <button type="button"
                onClick={e => { e.stopPropagation(); setImgFile(null); setImgPrev(""); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center">
                <X size={11} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={18} className="mx-auto mb-1.5 text-brand-muted/50" />
              <p className="text-xs text-brand-muted">
                {imgFile ? imgFile.name : "Add a photo of the cleaning result (JPEG, PNG — max 10 MB)"}
              </p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-pine text-cream py-3 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60">
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}