"use client";

import { useEffect, useRef, useState } from "react";

type ChatMsg = {
  id: string;
  from: "user" | "bot";
  text: string;
  complaintId?: string;
  status?: string;
  tick?: "sent";
};

type Complaint = { id: string; status: string; topic: string; message: string; updatedAt?: string };
type Order = { id: string; createdAt: string; status: string; total: number; items: { name: string; qty: number }[] };
type FlowKind = "cancel" | "return" | "refund" | "support";
type Pending =
  | { kind: "cancel" | "return" | "refund"; orderId?: string }
  | { kind: "support"; issue: string }
  | null;

const QUICK_REPLIES = [
  { label: "Where is my order?", action: "orders" },
  { label: "Cancel my order", action: "cancel" },
  { label: "Request a return", action: "return" },
  { label: "Talk to support", action: "support" },
] as const;

let seq = 1;
const nid = (p: string) => `${p}${seq++}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "g1", from: "bot", text: "Hi! I'm PawBot 🐾 Tell me what you need, or pick a quick option below." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [flow, setFlow] = useState<{ kind: FlowKind } | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastNotified = useRef("");

  function pushUser(text: string): string {
    const id = nid("u");
    setMessages((m) => [...m, { id, from: "user", text }]);
    return id;
  }

  function markSent(id: string) {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, tick: "sent" as const } : x)));
  }

  function pushBot(text: string, complaintId?: string, status?: string) {
    setMessages((m) => [...m, { id: nid("b"), from: "bot", text, complaintId, status }]);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  useEffect(() => {
    if (!open) return;
    let stop = false;

    async function poll() {
      try {
        const r = await fetch("/api/support/complaints", { cache: "no-store" });
        const d = await r.json();
        const cs = ((d?.complaints || []) as Complaint[]).slice().sort((a, b) => {
          const ta = new Date(a.updatedAt || 0).getTime();
          const tb = new Date(b.updatedAt || 0).getTime();
          return tb - ta;
        });
        const latest = cs[0];
        if (!latest || stop) return;
        const key = `${latest.id}:${latest.status}`;
        if (!lastNotified.current) {
          lastNotified.current = key;
          return;
        }
        if (key !== lastNotified.current) {
          lastNotified.current = key;
          pushBot(`Update: complaint ${latest.id} is now "${latest.status}".`, latest.id, latest.status);
        }
      } catch {}
    }

    void poll();
    const t = setInterval(poll, 20000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [open]);

  async function lookupLatestOrder(): Promise<Order | null> {
    try {
      const r = await fetch("/api/orders/mine", { cache: "no-store" });
      const d = await r.json();
      const orders = ((d?.orders || []) as Order[]).slice().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return orders[0] || null;
    } catch {
      return null;
    }
  }

  async function createTicket(topic: string, message: string, orderId?: string, userMsgId?: string) {
    setBusy(true);
    setTyping(true);
    try {
      const r = await fetch("/api/support/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message, orderId }),
      });
      const d = await r.json();
      if (r.ok && d?.complaint) {
        if (userMsgId) markSent(userMsgId);
        pushBot(`Complaint ${d.complaint.id} filed with status "${d.complaint.status}". Our team will review it shortly.`, d.complaint.id, d.complaint.status);
        setFlow(null);
        setPending(null);
      } else {
        pushBot(d?.error || "Sorry, something went wrong. Please try again.");
      }
    } catch {
      pushBot("Sorry, I could not send that. Please check your connection and try again.");
    } finally {
      setTyping(false);
      setBusy(false);
    }
  }

  async function startOrderFlow(kind: "cancel" | "return" | "refund") {
    setTyping(true);
    const order = await lookupLatestOrder();
    setTyping(false);
    if (!order) {
      pushBot("I couldn't find any orders on your account yet, so there's nothing to " + kind + ".");
      return;
    }
    setFlow({ kind });
    setPending({ kind, orderId: order.id });
    pushBot(
      `Your latest order is ${order.id} · ${order.status} · ₹${order.total}. Would you like to submit a ${kind} request for this order?`
    );
  }

  async function showOrderStatus() {
    setTyping(true);
    const order = await lookupLatestOrder();
    setTyping(false);
    if (!order) {
      pushBot("I couldn't find any orders on your account yet. If you just placed one, give it a moment and try again.");
      return;
    }
    const items = order.items.map((i) => `${i.name} ×${i.qty}`).join(", ");
    pushBot(
      `Latest order: ${order.id} · ${order.status} · ₹${order.total} · Placed ${new Date(order.createdAt).toLocaleString()}. Items: ${items}.`
    );
  }

  function confirmPending(action: "yes" | "no") {
    if (!pending) return;
    pushUser(action === "yes" ? "Yes, submit it" : "No, cancel");
    if (action === "no") {
      setPending(null);
      setFlow(null);
      pushBot("No problem — nothing was submitted.");
      return;
    }
    if (pending.kind === "support") {
      void createTicket("other", pending.issue || "Support request");
    } else {
      const verb = pending.kind;
      void createTicket(verb, `${verb[0].toUpperCase() + verb.slice(1)} request for order ${pending.orderId}`, pending.orderId);
    }
  }

  async function handleSend(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");

    if (pending) {
      const t = text.toLowerCase();
      if (["y", "yes", "yeah", "ok", "okay", "confirm", "sure"].some((w) => t.includes(w))) {
        confirmPending("yes");
      } else if (["n", "no", "nope", "cancel", "stop"].some((w) => t.includes(w))) {
        confirmPending("no");
      } else {
        pushUser(text);
        pushBot("Please tap Yes to submit or No to cancel.");
      }
      return;
    }

    pushUser(text);
    setFlow(null);
    setPending({ kind: "support", issue: text });
    pushBot(
      flow?.kind === "support"
        ? "Got it. Should I raise a support ticket with this message?"
        : "Should I raise a support ticket with this message?"
    );
  }

  function handleQuick(label: string, action: (typeof QUICK_REPLIES)[number]["action"]) {
    if (busy) return;
    pushUser(label);
    if (action === "orders") void showOrderStatus();
    else if (action === "support") {
      setFlow({ kind: "support" });
      pushBot("Sure — tell me briefly what happened and I'll raise a support ticket.");
    } else {
      void startOrderFlow(action);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="fixed bottom-6 right-6 z-[10000] w-14 h-14 rounded-full bg-berry text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[10000] w-[92vw] max-w-sm h-[70vh] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-berry text-white p-3 flex items-center justify-between">
            <div className="font-bold text-sm">Paw Support 🐾</div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white text-lg leading-none">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                  m.from === "user"
                    ? "bg-berry text-white rounded-br-sm self-end"
                    : "bg-white border border-slate-100 text-navy rounded-bl-sm self-start"
                }`}
              >
                {m.text}
                {m.from === "user" && m.tick === "sent" && (
                  <span className="ml-1 text-[11px] text-white/70">✓</span>
                )}
                {m.complaintId && (
                  <div className="text-[10px] mt-1 opacity-70">Ticket {m.complaintId} · {m.status}</div>
                )}
              </div>
            ))}
            {typing && (
              <div className="max-w-[85%] px-3 py-2 rounded-2xl bg-white border border-slate-100 rounded-bl-sm self-start flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-chat-typing" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-2 border-t border-slate-100 flex flex-wrap gap-2">
            {pending ? (
              <>
                <button onClick={() => confirmPending("yes")} className="px-3 py-1.5 rounded-full bg-berry text-white text-xs font-semibold hover:bg-berry-dark transition">Yes, submit</button>
                <button onClick={() => confirmPending("no")} className="px-3 py-1.5 rounded-full bg-slate-200 text-navy text-xs font-semibold hover:bg-slate-300 transition">No, cancel</button>
              </>
            ) : (
              QUICK_REPLIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuick(q.label, q.action)}
                  className="px-3 py-1.5 rounded-full bg-berry/10 text-berry text-xs font-semibold hover:bg-berry/20 transition"
                >
                  {q.label}
                </button>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSend(input);
              }}
              placeholder={pending ? "Tap Yes or No above, or type it…" : "Describe your issue…"}
              className="flex-1 px-3 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-berry"
            />
            <button
              onClick={() => void handleSend(input)}
              disabled={busy}
              className="px-4 py-2 rounded-full bg-berry text-white text-sm font-semibold hover:bg-berry-dark transition disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
