"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot from "@/components/Mascot";

const FAQS = [
  { q: "How long does shipping take?", a: "Orders are dispatched within 24 hours and typically arrive in 3-7 business days." },
  { q: "What is your return policy?", a: "We offer 30-day hassle-free returns on all unused products in original packaging." },
  { q: "Are your products safe for pets?", a: "Yes. All materials are vet-friendly and non-toxic, tested by real pets." },
  { q: "How do I track my order?", a: "Use the Track Order page with your order ID, or check your confirmation email." },
  { q: "Do you ship internationally?", a: "Currently we ship within India. International shipping is coming soon." },
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
      setMsg("Thanks! We'll get back to you within 24 hours.");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <Mascot type="dog" size="lg" anim="peek" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-navy mt-4">Support Center</h1>
        <p className="text-muted mt-2">We&apos;re here to help you and your pets.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { emoji: "📧", title: "Email", desc: "hello@pawberry.com" },
          { emoji: "📞", title: "Phone", desc: "1-800-555-1234" },
          { emoji: "💬", title: "Live Chat", desc: "Mon-Sat, 9am-6pm" },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-2xl p-5 border border-slate-100 text-center hover-lift">
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="font-bold text-navy">{c.title}</div>
            <div className="text-slate-500 text-sm mt-1">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-extrabold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="bg-white rounded-2xl p-4 border border-slate-100 group">
                <summary className="font-semibold text-navy cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-berry group-open:rotate-45 transition">+</span>
                </summary>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/orders" className="text-berry font-semibold hover:underline">Track your order →</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="text-2xl font-extrabold text-navy mb-4">Send us a message</h2>
          <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required rows={4} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
            <button type="submit" disabled={status === "loading"} className="w-full px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60">
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            {msg && <div className={`text-sm ${status === "error" ? "text-red-500" : "text-slate-600"}`}>{msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}