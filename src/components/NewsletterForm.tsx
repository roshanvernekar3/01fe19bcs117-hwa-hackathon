"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
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
      if (!res.ok) throw new Error(d.error || "Failed to subscribe");
      setStatus("success");
      setMsg(d.duplicate ? "You're already in the loop." : "You're in. Watch your inbox for Drop 02.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className={compact ? "" : "w-full max-w-xl"}>
      <form onSubmit={submit} className="group flex items-center gap-2 border-b border-white/25 pb-2 transition-colors focus-within:border-violet">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          aria-label="Email address"
          className="w-full bg-transparent py-2 text-base text-chrome placeholder:text-silver/35 focus:outline-none sm:text-lg"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-chrome transition-all duration-300 hover:border-violet hover:bg-violet hover:text-void disabled:opacity-50"
          aria-label="Subscribe"
        >
          <Icon name={status === "success" ? "check" : "arrow-right"} size={18} />
        </button>
      </form>
      <div className="mt-3 min-h-5">
        {msg ? (
          <p className={`font-mono text-[10px] uppercase tracking-[0.16em] ${status === "error" ? "text-red-300" : "text-violet-bright"}`}>
            {msg}
          </p>
        ) : (
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver/30">
            Drop alerts, repair notes, no noise. Unsubscribe anytime.
          </p>
        )}
      </div>
    </div>
  );
}
