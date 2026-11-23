"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative rounded-3xl overflow-hidden h-80 md:h-[480px] shadow-lg bg-gradient-to-br from-cream to-blush cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        <Image src={src} alt={alt} fill className="object-contain p-4" sizes="(max-width:768px) 100vw, 50vw" priority />
        <span className="absolute bottom-3 right-3 text-xs bg-white/80 backdrop-blur px-2 py-1 rounded-full text-slate-600">
          Click to enlarge
        </span>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            aria-label="close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}