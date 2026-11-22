"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setStatus("success");
      setMsg(d.duplicate ? "You're already subscribed!" : "Welcome to the PAWBERRY family! 🐾");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-sage to-blush">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Join the PAWBERRY Pack</h2>
        <p className="text-navy/70 mt-3">Get new arrivals, play tips and exclusive offers in your inbox.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 max-w-sm px-5 py-3 rounded-full border border-white/60 bg-white/80 focus:outline-none focus:border-berry"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60 shadow-lg shadow-berry/20"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {msg && <div className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-navy"}`}>{msg}</div>}
      </div>
    </section>
  );
}
