"use client";

import { useEffect, useRef, useState } from "react";

type ChatMsg = { id: string; from: "user" | "bot"; text: string; complaintId?: string; status?: string };
type Complaint = { id: string; status: string; topic: string; message: string };

const QUICK_REPLIES = [
  { label: "Where is my order?", topic: "order", message: "Where is my order?" },
  { label: "Cancel my order", topic: "cancel", message: "I would like to cancel my order." },
  { label: "Request a return", topic: "return", message: "I would like to request a return." },
  { label: "Talk to support", topic: "other", message: "I need help from a support agent." },
];

let chatSeq = 1;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([{ id: "g1", from: "bot", text: "Hi! I'm PawBot 🐾 ... How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setMessages([{ id: "g1", from: "bot", text: "Hi! I'm PawBot 🐾 ... How can I help you today?" }]);
    setInput("");
    (async () => {
      try {
        const r = await fetch("/api/support/complaints", { cache: "no-store" });
        const d = await r.json();
        const cs = d?.complaints || [];
        const latest = cs[0];
        if (latest) setActiveComplaint(latest);
      } catch {}
    })();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string, topic?: string) {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setMessages((m) => [...m, { id: "u" + chatSeq++, from: "user" as const, text: t }]);
    setInput("");
    try {
      const r = await fetch("/api/support/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || "other", message: t }),
      });
      const d = await r.json();
      if (r.ok) {
        const c = d?.complaint;
        setActiveComplaint(c);
        setMessages((m) => [
          ...m,
          { id: "b" + chatSeq++, from: "bot" as const, text: `Complaint ${c.id} filed. Status: ${c.status}. Our team will review it shortly.`, complaintId: c.id, status: c.status },
        ]);
      } else {
        setMessages((m) => [...m, { id: "b" + chatSeq++, from: "bot" as const, text: d?.error || "Sorry, something went wrong. Please try again." }]);
      }
    } catch {
      setMessages((m) => [...m, { id: "b" + chatSeq++, from: "bot" as const, text: "Sorry, I could not send that. Please try again." }]);
    }
    setSending(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open support chat"
        className="fixed bottom-6 right-6 z-[10000] w-14 h-14 rounded-full bg-berry text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-24 right-4 z-[10000] w-[92vw] max-w-sm h-[70vh] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-berry text-white p-3 flex items-center justify-between">
            <div className="font-bold text-sm">Paw Support 🐾</div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.from === "user" ? "bg-berry text-white rounded-br-sm self-end" : "bg-white border border-slate-100 text-navy rounded-bl-sm self-start"}`}>
                {m.text}
                {m.complaintId && <div className="text-[10px] mt-1 opacity-70">Complaint {m.complaintId} · {m.status}</div>}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-slate-100 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((q) => (
              <button key={q.label} onClick={() => send(q.message, q.topic)} className="px-3 py-1.5 rounded-full bg-berry/10 text-berry text-xs font-semibold hover:bg-berry/20 transition">
                {q.label}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
              placeholder="Describe your issue..."
              className="flex-1 px-3 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-berry"
            />
            <button onClick={() => send(input)} disabled={sending} className="px-4 py-2 rounded-full bg-berry text-white text-sm font-semibold hover:bg-berry-dark transition disabled:opacity-60">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
