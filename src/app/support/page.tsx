"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Logo } from "@/components/Brand";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched within 24 hours and arrive in 2–4 working days across India. International delivery is 5–9 days, carbon-neutral.",
  },
  {
    q: "What is your return policy?",
    a: "30 days on unworn pieces with tags attached. Returned pieces are inspected, re-sold or re-spun into new fibre — never landfilled.",
  },
  {
    q: "How do repairs work?",
    a: "Every REWEAR piece includes free repairs for life. Book from your account or message the concierge, and we cover the return label both ways.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track order page with your order ID (RW-…), or open Orders while logged in to see live status.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship worldwide with carbon-neutral carriers. Duties are calculated at checkout where applicable.",
  },
  {
    q: "What is a fibre passport?",
    a: "A scannable tag inside each garment that shows its fibre origin, mill, dye process and end-of-life route. It is how we keep the loop honest.",
  },
];

const CHANNELS = [
  { icon: "sparkle" as const, title: "Concierge", desc: "Live chat, bottom-left", note: "Fastest" },
  { icon: "mail" as const, title: "Email", desc: "help@rewear.systems", note: "Within 24h" },
  { icon: "shield" as const, title: "Repairs", desc: "Book from your account", note: "Free for life" },
];

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setStatus("success");
      setMsg("Message received. The REWEAR team will reply within 24 hours.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/3 top-0 h-64 w-96 rounded-full bg-violet/10 blur-[110px]" />
      </div>

      <div className="container-x max-w-5xl pb-20">
        <div className="border-b border-white/[0.08] pb-6">
          <p className="eyebrow mb-3">Support / system help</p>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
            We keep you <span className="text-gradient">in the loop.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-silver/45">
            Delivery, returns, repairs or fit — talk to a human who knows the system.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 transition-colors hover:border-violet/30"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-violet-bright">
                  <Icon name={c.icon} size={16} />
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-silver/30">{c.note}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-chrome">{c.title}</p>
              <p className="mt-0.5 text-xs text-silver/40">{c.desc}</p>
            </div>
          ))}
        </div>

        <div id="faq" className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="text-xl font-medium tracking-tight text-chrome sm:text-2xl">
              Frequently asked<span className="text-violet-bright">.</span>
            </h2>
            <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-chrome">
                    {f.q}
                    <Icon
                      name="plus"
                      size={14}
                      className="shrink-0 text-silver/35 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-2.5 max-w-md text-xs leading-relaxed text-silver/45">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/orders"
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-violet-bright hover:text-chrome"
              >
                Track an order <Icon name="arrow-right" size={12} />
              </Link>
              <Link
                href="/sustainability#care"
                className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome"
              >
                Care & repair guide
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight text-chrome sm:text-2xl">
                Send a message<span className="text-violet-bright">.</span>
              </h2>
              <Logo compact />
            </div>
            <p className="mt-1.5 text-xs text-silver/40">One reply, from a real person. No bots.</p>

            <form onSubmit={submit} className="mt-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="s-name" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                    Name
                  </label>
                  <input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="field" />
                </div>
                <div>
                  <label htmlFor="s-email" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                    Email
                  </label>
                  <input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" required className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="s-subject" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                  Subject
                </label>
                <input id="s-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Order, repair, fit…" className="field" />
              </div>
              <div>
                <label htmlFor="s-message" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                  Message
                </label>
                <textarea
                  id="s-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  required
                  rows={4}
                  className="field resize-none"
                />
              </div>
              <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full disabled:opacity-60">
                {status === "loading" ? "Sending…" : "Send message"}
                {status !== "loading" && <Icon name="arrow-right" size={15} />}
              </button>
              {msg && (
                <p
                  className={`text-xs ${
                    status === "error" ? "text-red-300" : "text-violet-bright"
                  }`}
                  role="status"
                >
                  {msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
