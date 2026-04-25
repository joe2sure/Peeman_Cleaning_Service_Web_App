"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getAdminGallery, patchGalleryItem, deleteGalleryItem } from "@/lib/admin/api";
import MediaUploader from "@/components/admin/MediaUploader";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { MediaItem } from "@/types";
import {
  Trash2, Eye, EyeOff, Star, StarOff, Edit2, Check, X, Loader2,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems]         = useState<MediaItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [editId, setEditId]       = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving]       = useState(false);
  const [stats, setStats]         = useState({ total: 0, published: 0, featured: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminGallery({ limit: 50 });
      const data = (res.data?.data ?? []) as MediaItem[];
      setItems(data);
      setStats({
        total:     data.length,
        published: data.filter((i) => i.published).length,
        featured:  data.filter((i) => i.featured).length,
      });
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === "all"
    ? items
    : items.filter((i) => i.category === filter);

  const toggle = async (item: MediaItem, field: "published" | "featured") => {
    try {
      await patchGalleryItem(item._id, { [field]: !item[field] });
      setItems((prev) =>
        prev.map((i) => i._id === item._id ? { ...i, [field]: !item[field] } : i)
      );
    } catch { /* silent */ }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this media item? This cannot be undone.")) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch { /* silent */ }
  };

  const saveEdit = async () => {
    if (!editId || !editTitle.trim()) return;
    setSaving(true);
    try {
      await patchGalleryItem(editId, { title: editTitle.trim() });
      setItems((prev) =>
        prev.map((i) => i._id === editId ? { ...i, title: editTitle } : i)
      );
      setEditId(null);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-pine">Gallery Management</h1>
        <p className="text-brand-muted text-sm mt-1">
          Upload, manage and publish photos and videos of your cleaning work.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Items",    value: stats.total },
          { label: "Published",      value: stats.published },
          { label: "Featured",       value: stats.featured },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-cream-mid rounded-xl p-4">
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-serif text-2xl font-semibold text-pine">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Uploader */}
        <div className="lg:col-span-1">
          <MediaUploader
            onUploaded={(item) => {
              setItems((prev) => [item, ...prev]);
              setStats((s) => ({
                total:     s.total + 1,
                published: item.published ? s.published + 1 : s.published,
                featured:  item.featured  ? s.featured + 1  : s.featured,
              }));
            }}
          />
        </div>

        {/* Gallery grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                  filter === cat.value
                    ? "bg-pine text-cream border-pine"
                    : "bg-white text-brand-muted border-cream-mid hover:border-pine/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-cream-mid rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-brand-muted border border-dashed border-cream-mid rounded-xl">
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm">No items in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="relative rounded-xl overflow-hidden border border-cream-mid group bg-cream-mid"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.title}
                      fill
                      sizes="200px"
                      className="object-cover"
                      unoptimized={item._id.startsWith("demo-")}
                    />
                    {!item.published && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-xs text-white bg-black/60 px-2 py-0.5 rounded">Draft</span>
                      </div>
                    )}
                  </div>

                  {/* Action bar */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggle(item, "featured")}
                      title={item.featured ? "Remove from featured" : "Set as featured"}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        item.featured ? "bg-gold text-pine" : "bg-black/50 text-white hover:bg-gold hover:text-pine"
                      }`}
                    >
                      {item.featured ? <Star size={11} fill="currentColor" /> : <StarOff size={11} />}
                    </button>
                    <button
                      onClick={() => toggle(item, "published")}
                      title={item.published ? "Unpublish" : "Publish"}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        item.published ? "bg-pine-light text-white" : "bg-black/50 text-white hover:bg-pine-light"
                      }`}
                    >
                      {item.published ? <Eye size={11} /> : <EyeOff size={11} />}
                    </button>
                    <button
                      onClick={() => { setEditId(item._id); setEditTitle(item.title); }}
                      title="Edit title"
                      className="w-6 h-6 rounded bg-black/50 text-white hover:bg-white hover:text-pine flex items-center justify-center text-xs transition-colors"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => remove(item._id)}
                      title="Delete"
                      className="w-6 h-6 rounded bg-black/50 text-white hover:bg-red-500 flex items-center justify-center text-xs transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Title / inline edit */}
                  <div className="p-2">
                    {editId === item._id ? (
                      <div className="flex gap-1">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 text-xs border border-pine-light rounded px-1.5 py-1 outline-none min-w-0"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditId(null); }}
                        />
                        <button onClick={saveEdit} disabled={saving}
                          className="text-pine-light hover:text-pine">
                          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        </button>
                        <button onClick={() => setEditId(null)} className="text-brand-muted hover:text-ink">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-ink truncate" title={item.title}>{item.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
