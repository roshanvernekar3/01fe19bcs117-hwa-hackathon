"use client";

import { Mark } from "@/components/Brand";

export default function Loader({
  message,
  size = "md",
}: {
  message?: string;
  size?: "sm" | "md" | "lg";
}) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 64 : 44;
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-violet/20 blur-2xl" />
        <span className="relative flex text-chrome animate-spin-slow">
          <Mark size={markSize} />
        </span>
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/40">
        {message || "Loading the system…"}
      </p>
    </div>
  );
}
