"use client";

import { useEffect, useRef, useState } from "react";

type Item = { url: string; name: string };

export default function GallerySection() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const d = await res.json();
      setItems(d.items || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result, name: file.name }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || "Upload failed");
        setMsg("Thanks for sharing! 🐾");
        await load();
        setUploading(false);
      };
      reader.onerror = () => {
        setMsg("Could not read file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Happy Paws Gallery</h2>
          <p className="text-muted mt-2">Real pets, real joy. Share your pet&apos;s photo and join the gallery.</p>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted py-8">
            No photos yet — be the first to share your happy paw! 🐾
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((it) => (
              <div key={it.url} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition hover-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt="happy paw" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60 shadow-lg shadow-berry/20"
          >
            {uploading ? "Uploading..." : "Share Your Pet's Photo"}
          </button>
          {msg && <div className="mt-3 text-sm text-slate-600">{msg}</div>}
        </div>
      </div>
    </section>
  );
}
