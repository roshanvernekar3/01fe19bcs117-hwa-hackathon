"use client";

import { useEffect, useRef, useState } from "react";
import Mascot from "@/components/Mascot";

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
      const dataUrl = await compressImage(file, 1200, 0.82);
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, name: file.name }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Upload failed");
      setMsg("Thanks for sharing! 🐾");
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
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
          <div className="text-center py-8">
            <Mascot type="dog" size="lg" anim="peek" />
            <div className="text-muted mt-3">No photos yet — be the first to share your happy paw! 🐾</div>
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


function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not process image"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}
