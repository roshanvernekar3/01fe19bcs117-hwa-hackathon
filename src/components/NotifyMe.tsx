"use client";

import { useState } from "react";

export default function NotifyMe({ slug, productName }: { slug: string; productName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to subscribe");
      if (d.alreadySubscribed) {
        setStatus("duplicate");
        setMsg("You're already on the list — we'll email you when it's back!");
      } else {
        setStatus("success");
        setMsg("You're subscribed! We'll email you the moment it's back in stock. 🐾");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed to subscribe");
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="font-bold text-navy mb-1">Out of Stock</div>
      <p className="text-sm text-slate-600 mb-3">
        {productName} is currently unavailable. Enter your email and we&apos;ll notify you when it&apos;s back.
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-berry text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-full bg-berry text-white text-sm font-semibold hover:bg-berry-dark transition disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Notify Me When Available"}
        </button>
      </form>
      {msg && (
        <div className={`mt-2 text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>{msg}</div>
      )}
    </div>
  );
}
