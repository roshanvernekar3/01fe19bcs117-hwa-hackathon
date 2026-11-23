"use client";

import { useEffect } from "react";

export default function AvatarViewer({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/90 text-navy text-xl shadow-lg flex items-center justify-center hover:scale-110 transition z-10"
      >
        ✕
      </button>
      <img
        src={src}
        alt="Avatar full"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl bg-white animate-avatar-zoom"
      />
    </div>
  );
}
