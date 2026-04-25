"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { uploadGalleryMedia } from "@/lib/admin/api";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { MediaItem } from "@/types";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImagePlus } from "lucide-react";

interface MediaUploaderProps {
  onUploaded: (item: MediaItem) => void;
}

interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const [preview, setPreview]     = useState<FilePreview | null>(null);
  const [title, setTitle]         = useState("");
  const [description, setDesc]    = useState("");
  const [category, setCategory]   = useState("general");
  const [featured, setFeatured]   = useState(false);
  const [published, setPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const [dragging, setDragging]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = "image/jpeg,image/png,image/webp,video/mp4,video/mov,video/webm,video/quicktime";

  const handleFile = (file: File) => {
    const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    const previewUrl = type === "image" ? URL.createObjectURL(file) : "";
    setPreview({ file, preview: previewUrl, type });
    setError("");
    setSuccess(false);
    // Auto-fill title from filename
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    setTitle("");
    setDesc("");
    setCategory("general");
    setFeatured(false);
    setPublished(true);
    setError("");
    setSuccess(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!preview) return;
    if (!title.trim()) { setError("Title is required."); return; }

    setUploading(true);
    setError("");
    setProgress(10);

    try {
      const fd = new FormData();
      fd.append("file", preview.file);
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("category", category);
      fd.append("featured", String(featured));
      fd.append("published", String(published));

      // Fake progress ticks while waiting
      const ticker = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85));
      }, 600);

      const res = await uploadGalleryMedia(fd);
      clearInterval(ticker);
      setProgress(100);

      if (res.data?.success && res.data?.data) {
        setSuccess(true);
        onUploaded(res.data.data as MediaItem);
        setTimeout(clearFile, 2000);
      } else {
        setError(res.data?.message || "Upload failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const inputClass = "w-full bg-white border border-cream-mid rounded px-3 py-2 text-sm text-ink outline-none focus:border-pine-light transition-colors";

  return (
    <div className="bg-white border border-cream-mid rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <ImagePlus size={18} className="text-pine-light" />
        <h3 className="font-serif text-lg font-semibold text-pine">Upload Media</h3>
      </div>

      {/* Drop zone */}
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? "border-pine bg-sage-pale"
              : "border-cream-mid hover:border-pine/40 hover:bg-cream/50"
          }`}
        >
          <Upload size={28} className="mx-auto mb-3 text-pine-light" />
          <p className="text-sm font-medium text-pine mb-1">
            Drag &amp; drop or <span className="text-pine-light underline">browse</span>
          </p>
          <p className="text-xs text-brand-muted">
            Images (JPG, PNG, WebP) · Videos (MP4, MOV, WebM) · Max 100 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        <div className="relative border border-cream-mid rounded-xl overflow-hidden">
          {preview.type === "image" ? (
            <img
              src={preview.preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-pine flex items-center justify-center">
              <div className="text-center text-cream/70">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm">{preview.file.name}</p>
                <p className="text-xs opacity-60">{(preview.file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          )}
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Metadata fields */}
      {preview && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kitchen Deep Clean — Before & After"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="Brief description of the job…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {GALLERY_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-pine"
                />
                <span className="text-sm text-ink">Feature on homepage</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-pine"
                />
                <span className="text-sm text-ink">Publish immediately</span>
              </label>
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-cream-mid rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-pine-light rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Error / success */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-pine text-sm bg-sage-pale border border-sage/30 rounded px-3 py-2">
              <CheckCircle size={14} /> Uploaded successfully!
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || success}
            className="w-full flex items-center justify-center gap-2 bg-pine text-cream py-2.5 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading…" : "Upload to Gallery"}
          </button>
        </div>
      )}
    </div>
  );
}
