"use client";

import { useState } from "react";

export default function NotifyMe({ slug, productName }: { slug: string; productName: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [msg, setMsg] = useState("");
  const [unsubEmail, setUnsubEmail] = useState("");
  const [unsubStatus, setUnsubStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [unsubMsg, setUnsubMsg] = useState("");

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
        setMsg("You’re already on the list — we’ll email you when it’s back!");
      } else {
        setStatus("success");
        setMsg("We’re on it — you’ll be first in line when it’s back!");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed to subscribe");
    }
  }

  async function unsubscribe(e: React.FormEvent) {
    e.preventDefault();
    setUnsubStatus("loading");
    setUnsubMsg("");
    try {
      const res = await fetch(`/api/restock?slug=${encodeURIComponent(slug)}&email=${encodeURIComponent(unsubEmail)}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setUnsubStatus("done");
      setUnsubMsg(d.removed ? "You’ve been unsubscribed. 🐾" : "That email wasn’t subscribed.");
      setUnsubEmail("");
    } catch (err) {
      setUnsubStatus("error");
      setUnsubMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="font-bold text-navy mb-1">Out of Stock</div>
      <p className="text-sm text-slate-600 mb-3">
        {productName} is currently unavailable. Enter your email and we’ll notify you when it’s back.
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
      <div className="mt-4 pt-3 border-t border-amber-100">
        <form onSubmit={unsubscribe} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={unsubEmail}
            onChange={(e) => setUnsubEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={unsubStatus === "loading"}
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-berry text-sm"
          />
          <button
            type="submit"
            disabled={unsubStatus === "loading"}
            className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-60"
          >
            {unsubStatus === "loading" ? "Unsubscribing…" : "Unsubscribe"}
          </button>
        </form>
        {unsubMsg && <div className="mt-2 text-sm text-slate-600">{unsubMsg}</div>}
      </div>
    </div>
  );
}
